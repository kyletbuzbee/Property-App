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

// GET /api/bank-accounts - List all bank accounts
export async function GET(request: NextRequest) {
  try {
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    if (!canManageAccounting(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to view bank accounts' },
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

    const accounts = await prisma.bankAccount.findMany({
      where: { organizationId: orgUser.organizationId },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    // Calculate totals
    const totalBalance = accounts
      .filter(a => a.type !== 'CREDIT_CARD')
      .reduce((sum, a) => sum + a.balance, 0)

    const totalCreditCardDebt = accounts
      .filter(a => a.type === 'CREDIT_CARD')
      .reduce((sum, a) => sum + Math.abs(a.balance), 0)

    return NextResponse.json({
      accounts: accounts.map(a => ({
        id: a.id,
        name: a.name,
        type: a.type,
        balance: a.balance,
        currency: a.currency,
        bankName: a.bankName,
        accountNumber: a.accountNumber,
        isActive: a.isActive,
        transactionCount: a._count.transactions,
        createdAt: a.createdAt,
      })),
      summary: {
        totalBalance,
        totalCreditCardDebt,
        netWorth: totalBalance - totalCreditCardDebt,
        accountCount: accounts.length,
      },
    })
  } catch (error) {
    console.error('Error fetching bank accounts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bank accounts' },
      { status: 500 }
    )
  }
}

// POST /api/bank-accounts - Create a new bank account
export async function POST(request: NextRequest) {
  try {
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    if (!canManageAccounting(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create bank accounts' },
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
      name,
      type,
      balance,
      currency,
      bankName,
      accountNumber,
    } = body

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      )
    }

    // Validate type
    const validTypes = ['CHECKING', 'SAVINGS', 'CREDIT_CARD', 'CASH', 'ESCROW']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid account type' },
        { status: 400 }
      )
    }

    const account = await prisma.bankAccount.create({
      data: {
        organizationId: orgUser.organizationId,
        name,
        type,
        balance: balance || 0,
        currency: currency || 'USD',
        bankName,
        accountNumber,
        isActive: true,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId: orgUser.organizationId,
        userId: context.user?.id,
        action: 'BANK_ACCOUNT_CREATED',
        targetType: 'bankAccount',
        targetId: account.id,
        details: { name, type, balance: balance || 0 },
      },
    })

    return NextResponse.json({
      account,
      message: 'Bank account created successfully',
    })
  } catch (error) {
    console.error('Error creating bank account:', error)
    return NextResponse.json(
      { error: 'Failed to create bank account' },
      { status: 500 }
    )
  }
}