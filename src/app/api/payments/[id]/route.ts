import { NextRequest, NextResponse } from 'next/server'
import { prisma, authenticateRequest, canManagePayments, AuthContext } from '../../../lib/db'

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

// GET /api/payments/[id] - Get single payment by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    if (!canManagePayments(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to view payment' },
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

    const payment = await prisma.payment.findFirst({
      where: { id, organizationId: orgUser.organizationId },
      include: {
        lease: {
          include: {
            tenant: {
              select: { id: true, firstName: true, lastName: true, email: true, phone: true },
            },
            property: {
              select: { id: true, address: true, city: true, state: true, zip: true, unitNumber: true },
            },
          },
        },
        tenant: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
      },
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      payment: {
        ...payment,
        tenant: payment.tenant ? {
          ...payment.tenant,
          fullName: `${payment.tenant.firstName} ${payment.tenant.lastName}`,
        } : null,
        lease: payment.lease ? {
          ...payment.lease,
          tenant: payment.lease.tenant ? {
            ...payment.lease.tenant,
            fullName: `${payment.lease.tenant.firstName} ${payment.lease.tenant.lastName}`,
          } : null,
        } : null,
      },
    })
  } catch (error) {
    console.error('Error fetching payment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment' },
      { status: 500 }
    )
  }
}

// PUT /api/payments/[id] - Update a payment (mark as paid, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    if (!canManagePayments(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to update payment' },
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

    // Verify payment exists in organization
    const existingPayment = await prisma.payment.findFirst({
      where: { id, organizationId: orgUser.organizationId },
    })

    if (!existingPayment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      status,
      paidDate,
      paymentMethod,
      reference,
      notes,
      lateFeeApplied,
    } = body

    const isCompleting = status === 'COMPLETED' && existingPayment.status !== 'COMPLETED'

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        status,
        paidDate: paidDate ? new Date(paidDate) : (status === 'COMPLETED' ? new Date() : undefined),
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
        action: isCompleting ? 'PAYMENT_RECEIVED' : 'PAYMENT_UPDATED',
        targetType: 'payment',
        targetId: payment.id,
        details: { 
          amount: payment.amount,
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
      message: isCompleting ? 'Payment marked as completed' : 'Payment updated successfully',
    })
  } catch (error) {
    console.error('Error updating payment:', error)
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    )
  }
}

// DELETE /api/payments/[id] - Delete a payment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    // Only ADMIN and above can delete payments
    if (!context.role || !['OWNER', 'ADMIN'].includes(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to delete payment' },
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

    // Verify payment exists in organization
    const existingPayment = await prisma.payment.findFirst({
      where: { id, organizationId: orgUser.organizationId },
    })

    if (!existingPayment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    // Don't allow deleting completed payments - void instead
    if (existingPayment.status === 'COMPLETED') {
      await prisma.payment.update({
        where: { id },
        data: { status: 'VOIDED' },
      })

      // Log activity
      await prisma.activity.create({
        data: {
          organizationId: orgUser.organizationId,
          userId: context.user?.id,
          action: 'PAYMENT_VOIDED',
          targetType: 'payment',
          targetId: id,
          details: { amount: existingPayment.amount },
        },
      })

      return NextResponse.json({
        message: 'Completed payment has been voided (not deleted)',
      })
    }

    await prisma.payment.delete({
      where: { id },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId: orgUser.organizationId,
        userId: context.user?.id,
        action: 'PAYMENT_DELETED',
        targetType: 'payment',
        targetId: id,
        details: { amount: existingPayment.amount },
      },
    })

    return NextResponse.json({
      message: 'Payment deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting payment:', error)
    return NextResponse.json(
      { error: 'Failed to delete payment' },
      { status: 500 }
    )
  }
}