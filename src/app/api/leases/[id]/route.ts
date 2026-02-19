import { NextRequest, NextResponse } from 'next/server'
import { prisma, authenticateRequest, canManageTenants, AuthContext } from '../../../lib/db'

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

// GET /api/leases/[id] - Get single lease by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    if (!canManageTenants(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to view lease' },
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

    const lease = await prisma.lease.findFirst({
      where: { id, organizationId: orgUser.organizationId },
      include: {
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            moveInDate: true,
            emergencyContact: true,
            emergencyPhone: true,
          },
        },
        property: {
          select: {
            id: true,
            address: true,
            city: true,
            state: true,
            zip: true,
            unitNumber: true,
            monthlyRent: true,
            bedrooms: true,
            bathrooms: true,
          },
        },
        payments: {
          orderBy: { dueDate: 'desc' },
          include: {
            tenant: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
    })

    if (!lease) {
      return NextResponse.json(
        { error: 'Lease not found' },
        { status: 404 }
      )
    }

    // Calculate payment stats
    const completedPayments = lease.payments.filter(p => p.status === 'COMPLETED')
    const pendingPayments = lease.payments.filter(p => p.status === 'PENDING')
    const totalPaid = completedPayments.reduce((sum, p) => sum + p.amount, 0)
    const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0)

    // Check if expiring soon (within 30 days)
    const today = new Date()
    const isExpiringSoon = lease.status === 'ACTIVE' && 
      lease.endDate && 
      new Date(lease.endDate) <= new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

    return NextResponse.json({
      lease: {
        id: lease.id,
        tenantId: lease.tenantId,
        tenant: {
          ...lease.tenant,
          fullName: `${lease.tenant.firstName} ${lease.tenant.lastName}`,
        },
        propertyId: lease.propertyId,
        property: lease.property,
        startDate: lease.startDate,
        endDate: lease.endDate,
        monthlyRent: lease.monthlyRent,
        securityDeposit: lease.securityDeposit,
        status: lease.status,
        terms: lease.terms,
        lateFee: lease.lateFee,
        gracePeriod: lease.gracePeriod,
        rentDueDay: lease.rentDueDay,
        isExpiringSoon,
        payments: lease.payments,
        paymentStats: {
          totalPaid,
          totalPending,
          completedCount: completedPayments.length,
          pendingCount: pendingPayments.length,
        },
        createdAt: lease.createdAt,
        updatedAt: lease.updatedAt,
      },
    })
  } catch (error) {
    console.error('Error fetching lease:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lease' },
      { status: 500 }
    )
  }
}

// PUT /api/leases/[id] - Update a lease
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    if (!canManageTenants(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to update lease' },
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

    // Verify lease exists in organization
    const existingLease = await prisma.lease.findFirst({
      where: { id, organizationId: orgUser.organizationId },
    })

    if (!existingLease) {
      return NextResponse.json(
        { error: 'Lease not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      tenantId,
      propertyId,
      startDate,
      endDate,
      monthlyRent,
      securityDeposit,
      status,
      lateFee,
      gracePeriod,
      rentDueDay,
      terms,
    } = body

    // If changing property, verify it belongs to organization
    if (propertyId && propertyId !== existingLease.propertyId) {
      const property = await prisma.property.findFirst({
        where: { id: propertyId, organizationId: orgUser.organizationId },
      })
      if (!property) {
        return NextResponse.json(
          { error: 'Property not found in your organization' },
          { status: 404 }
        )
      }
    }

    // If changing tenant, verify it belongs to organization
    if (tenantId && tenantId !== existingLease.tenantId) {
      const tenant = await prisma.tenant.findFirst({
        where: { id: tenantId, organizationId: orgUser.organizationId },
      })
      if (!tenant) {
        return NextResponse.json(
          { error: 'Tenant not found in your organization' },
          { status: 404 }
        )
      }
    }

    // Track status changes
    const wasActive = existingLease.status === 'ACTIVE'
    const isNowActive = status === 'ACTIVE'

    const lease = await prisma.lease.update({
      where: { id },
      data: {
        tenantId,
        propertyId,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        monthlyRent,
        securityDeposit,
        status,
        lateFee,
        gracePeriod,
        rentDueDay,
        terms,
      },
      include: {
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        property: {
          select: {
            id: true,
            address: true,
            city: true,
            state: true,
            unitNumber: true,
          },
        },
      },
    })

    // Handle property status changes
    if (wasActive && !isNowActive) {
      // Lease no longer active - set property back to available
      await prisma.property.update({
        where: { id: existingLease.propertyId },
        data: { propertyStatus: 'AVAILABLE' },
      })
    } else if (!wasActive && isNowActive) {
      // Lease now active - set property to rented
      await prisma.property.update({
        where: { id: propertyId || existingLease.propertyId },
        data: { propertyStatus: 'RENTED', isRental: true },
      })

      // Update tenant's property
      await prisma.tenant.update({
        where: { id: tenantId || existingLease.tenantId },
        data: { 
          propertyId: propertyId || existingLease.propertyId,
          moveInDate: new Date(startDate || existingLease.startDate),
        },
      })
    }

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId: orgUser.organizationId,
        userId: context.user?.id,
        action: 'LEASE_UPDATED',
        targetType: 'lease',
        targetId: lease.id,
        details: { 
          tenantName: `${lease.tenant.firstName} ${lease.tenant.lastName}`,
          status: status || existingLease.status,
        },
      },
    })

    return NextResponse.json({
      lease: {
        ...lease,
        tenant: {
          ...lease.tenant,
          fullName: `${lease.tenant.firstName} ${lease.tenant.lastName}`,
        },
      },
      message: 'Lease updated successfully',
    })
  } catch (error) {
    console.error('Error updating lease:', error)
    return NextResponse.json(
      { error: 'Failed to update lease' },
      { status: 500 }
    )
  }
}

// DELETE /api/leases/[id] - Delete a lease
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    // Only ADMIN and above can delete leases
    if (!context.role || !['OWNER', 'ADMIN'].includes(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to delete lease' },
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

    // Verify lease exists in organization
    const existingLease = await prisma.lease.findFirst({
      where: { id, organizationId: orgUser.organizationId },
    })

    if (!existingLease) {
      return NextResponse.json(
        { error: 'Lease not found' },
        { status: 404 }
      )
    }

    // Check for payments associated with this lease
    const paymentCount = await prisma.payment.count({
      where: { leaseId: id },
    })

    if (paymentCount > 0) {
      // Instead of deleting, mark as terminated
      await prisma.lease.update({
        where: { id },
        data: { status: 'TERMINATED' },
      })

      // Update property status
      await prisma.property.update({
        where: { id: existingLease.propertyId },
        data: { propertyStatus: 'AVAILABLE' },
      })

      return NextResponse.json({
        message: 'Lease terminated (has associated payments)',
      })
    }

    await prisma.lease.delete({
      where: { id },
    })

    // Update property status
    await prisma.property.update({
      where: { id: existingLease.propertyId },
      data: { propertyStatus: 'AVAILABLE' },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId: orgUser.organizationId,
        userId: context.user?.id,
        action: 'LEASE_DELETED',
        targetType: 'lease',
        targetId: id,
        details: { propertyId: existingLease.propertyId },
      },
    })

    return NextResponse.json({
      message: 'Lease deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting lease:', error)
    return NextResponse.json(
      { error: 'Failed to delete lease' },
      { status: 500 }
    )
  }
}