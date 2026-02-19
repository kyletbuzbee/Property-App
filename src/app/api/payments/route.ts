import { NextRequest, NextResponse } from 'next/server'
import { prisma, authenticateRequest, canManagePayments, AuthContext } from '../../lib/db'

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

// GET /api/payments - List all payments for organization
export async function GET(request: NextRequest) {
  try {
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    if (!canManagePayments(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to view payments' },
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
    const leaseId = searchParams.get('leaseId')
    const tenantId = searchParams.get('tenantId')
    const propertyId = searchParams.get('propertyId')
    const status = searchParams.get('status') // 'pending', 'completed', 'all'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = { organizationId: orgUser.organizationId }

    if (leaseId) where.leaseId = leaseId
    if (tenantId) where.tenantId = tenantId
    if (propertyId) {
      const property = await prisma.property.findFirst({
        where: { id: propertyId, organizationId: orgUser.organizationId },
      })
      if (property) {
        const leases = await prisma.lease.findMany({
          where: { propertyId },
          select: { id: true },
        })
        where.leaseId = { in: leases.map(l => l.id) }
      }
    }
    if (status === 'pending') where.status = 'PENDING'
    else if (status === 'completed') where.status = 'COMPLETED'

    if (startDate || endDate) {
      where.dueDate = {}
      if (startDate) where.dueDate.gte = new Date(startDate)
      if (endDate) where.dueDate.lte = new Date(endDate)
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        lease: {
          include: {
            tenant: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
            property: {
              select: { id: true, address: true, city: true, state: true, unitNumber: true },
            },
          },
        },
        tenant: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { dueDate: 'desc' },
    })

    // Transform payments
    const transformedPayments = payments.map(payment => ({
      id: payment.id,
      leaseId: payment.leaseId,
      lease: payment.lease ? {
        ...payment.lease,
        tenant: payment.lease.tenant ? {
          ...payment.lease.tenant,
          fullName: `${payment.lease.tenant.firstName} ${payment.lease.tenant.lastName}`,
        } : null,
        property: payment.lease.property,
      } : null,
      tenant: payment.tenant ? {
        ...payment.tenant,
        fullName: `${payment.tenant.firstName} ${payment.tenant.lastName}`,
      } : null,
      amount: payment.amount,
      dueDate: payment.dueDate,
      paidDate: payment.paidDate,
      status: payment.status,
      type: payment.type,
      paymentMethod: payment.paymentMethod,
      reference: payment.reference,
      notes: payment.notes,
      lateFeeApplied: payment.lateFeeApplied,
      createdAt: payment.createdAt,
    }))

    // Calculate summary stats
    const summary = {
      totalPending: payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0),
      totalCompleted: payments.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + p.amount, 0),
      totalCollected: payments.filter(p => p.status === 'COMPLETED').length,
      pendingCount: payments.filter(p => p.status === 'PENDING').length,
    }

    return NextResponse.json({ 
      payments: transformedPayments,
      summary,
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

// POST /api/payments - Create a new payment record
export async function POST(request: NextRequest) {
  try {
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    if (!canManagePayments(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create payments' },
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
      leaseId,
      tenantId,
      amount,
      dueDate,
      paidDate,
      status,
      type,
      paymentMethod,
      reference,
      notes,
      lateFeeApplied,
    } = body

    // Validate required fields
    if (!leaseId || !tenantId || !amount || !dueDate) {
      return NextResponse.json(
        { error: 'Lease, tenant, amount, and due date are required' },
        { status: 400 }
      )
    }

    // Verify lease belongs to organization
    const lease = await prisma.lease.findFirst({
      where: { id: leaseId, organizationId: orgUser.organizationId },
    })
    if (!lease) {
      return NextResponse.json(
        { error: 'Lease not found in your organization' },
        { status: 404 }
      )
    }

    // Verify tenant belongs to organization
    const tenant = await prisma.tenant.findFirst({
      where: { id: tenantId, organizationId: orgUser.organizationId },
    })
    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found in your organization' },
        { status: 404 }
      )
    }

    const payment = await prisma.payment.create({
      data: {
        organizationId: orgUser.organizationId,
        leaseId,
        tenantId,
        amount,
        dueDate: new Date(dueDate),
        paidDate: paidDate ? new Date(paidDate) : null,
        status: status || 'PENDING',
        type: type || 'RENT',
        paymentMethod,
        reference,
        notes,
        lateFeeApplied,
      },
      include: {
        lease: {
          include: {
            property: {
              select: { id: true, address: true, city: true, state: true },
            },
          },
        },
        tenant: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId: orgUser.organizationId,
        userId: context.user?.id,
        action: status === 'COMPLETED' ? 'PAYMENT_RECEIVED' : 'PAYMENT_CREATED',
        targetType: 'payment',
        targetId: payment.id,
        details: { 
          amount,
          status,
          tenantName: `${payment.tenant.firstName} ${payment.tenant.lastName}`,
        },
      },
    })

    return NextResponse.json({
      payment: {
        ...payment,
        tenant: {
          ...payment.tenant,
          fullName: `${payment.tenant.firstName} ${payment.tenant.lastName}`,
        },
      },
      message: status === 'COMPLETED' ? 'Payment recorded successfully' : 'Payment created successfully',
    })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}