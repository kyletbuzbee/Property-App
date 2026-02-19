import { NextRequest, NextResponse } from 'next/server'
import { prisma, authenticateRequest, canManageAccounting, AuthContext } from '../../lib/db'

// Helper to get user's organization and role
async function getUserOrgContext(context: AuthContext) {
  if (!context.user) return null

  const orgUser = await prisma.organizationUser.findFirst({
    where: { userId: context.user.id },
    include: { organization: true },
    orderBy: { createdAt: 'desc' },
  })

  return orgUser
}

// GET /api/transactions - List all transactions
export async function GET(request: NextRequest) {
  try {
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    if (!canManageAccounting(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to view transactions' },
        { status: 403 }
      )
    }

    const orgUser = await getUserOrgContext(context)
    if (!orgUser) {
      return NextResponse.json(
        { error: 'No organization found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const bankAccountId = searchParams.get('bankAccountId')
    const propertyId = searchParams.get('propertyId')
    const type = searchParams.get('type') // 'INCOME', 'EXPENSE', 'TRANSFER'
    const category = searchParams.get('category')
    const isReconciled = searchParams.get('reconciled')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = { organizationId: orgUser.organizationId }

    if (bankAccountId) where.bankAccountId = bankAccountId
    if (propertyId) where.propertyId = propertyId
    if (type) where.type = type
    if (category) where.category = category
    if (isReconciled !== null) where.isReconciled = isReconciled === 'true'

    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate)
      if (endDate) where.date.lte = new Date(endDate)
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        bankAccount: {
          select: { id: true, name: true, type: true },
        },
        property: {
          select: { id: true, address: true, city: true, state: true },
        },
        tenant: {
          select: { id: true, firstName: true, lastName: true },
        },
        lease: {
          select: { id: true, monthlyRent: true },
        },
      },
      orderBy: { date: 'desc' },
    })

    // Calculate summary
    const income = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)
    const expenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)
    const transfers = transactions
      .filter(t => t.type === 'TRANSFER')
      .reduce((sum, t) => sum + t.amount, 0)

    // Group by category
    const byCategory: Record<string, number> = {}
    transactions.forEach(t => {
      if (!byCategory[t.category]) byCategory[t.category] = 0
      byCategory[t.category] += t.type === 'EXPENSE' ? t.amount : 0
    })

    return NextResponse.json({
      transactions: transactions.map(t => ({
        ...t,
        tenant: t.tenant ? {
          ...t.tenant,
          fullName: `${t.tenant.firstName} ${t.tenant.lastName}`,
        } : null,
      })),
      summary: {
        totalIncome: income,
        totalExpenses: expenses,
        netCashFlow: income - expenses,
        transfers,
        byCategory,
        count: transactions.length,
      },
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    if (!canManageAccounting(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create transactions' },
        { status: 403 }
      )
    }

    const orgUser = await getUserOrgContext(context)
    if (!orgUser) {
      return NextResponse.json(
        { error: 'No organization found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      bankAccountId,
      propertyId,
      tenantId,
      leaseId,
      maintenanceRequestId,
      date,
      description,
      amount,
      category,
      type,
      reference,
      notes,
    } = body

    // Validate required fields
    if (!bankAccountId || !date || !description || !amount || !type) {
      return NextResponse.json(
        { error: 'Bank account, date, description, amount, and type are required' },
        { status: 400 }
      )
    }

    // Verify bank account belongs to organization
    const bankAccount = await prisma.bankAccount.findFirst({
      where: { id: bankAccountId, organizationId: orgUser.organizationId },
    })
    if (!bankAccount) {
      return NextResponse.json(
        { error: 'Bank account not found in your organization' },
        { status: 404 }
      )
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        organizationId: orgUser.organizationId,
        bankAccountId,
        propertyId,
        tenantId,
        leaseId,
        maintenanceRequestId,
        date: new Date(date),
        description,
        amount,
        category,
        type,
        reference,
        notes,
      },
      include: {
        bankAccount: {
          select: { id: true, name: true, type: true },
        },
        property: {
          select: { id: true, address: true, city: true },
        },
      },
    })

    // Update bank account balance
    const balanceChange = type === 'INCOME' ? amount : (type === 'EXPENSE' ? -amount : 0)
    await prisma.bankAccount.update({
      where: { id: bankAccountId },
      data: { balance: { increment: balanceChange } },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId: orgUser.organizationId,
        userId: context.user?.id,
        action: type === 'INCOME' ? 'INCOME_RECORDED' : 'EXPENSE_RECORDED',
        targetType: 'transaction',
        targetId: transaction.id,
        details: { 
          amount, 
          type, 
          category,
          description,
        },
      },
    })

    return NextResponse.json({
      transaction,
      message: 'Transaction recorded successfully',
    })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}