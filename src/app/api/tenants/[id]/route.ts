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

// GET /api/tenants/[id] - Get single tenant by ID
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
        { error: 'Insufficient permissions to view tenant' },
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

    const tenant = await prisma.tenant.findFirst({
      where: { id, organizationId: orgUser.organizationId },
      include: {
        property: {
          select: { id: true, address: true, city: true, state: true, unitNumber: true, monthlyRent: true },
        },
        leases: {
          include: {
            property: {
              select: { id: true, address: true, city: true, state: true, unitNumber: true },
            },
          },
          orderBy: { startDate: 'desc' },
        },
        payments: {
          orderBy: { dueDate: 'desc' },
          take: 12,
          include: {
            lease: {
              select: { id: true, monthlyRent: true },
            },
          },
        },
        _count: {
          select: { payments: true, maintenanceRequests: true },
        },
      },
    })

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }

    // Calculate payment stats
    const completedPayments = tenant.payments.filter(p => p.status === 'COMPLETED')
    const totalPaid = completedPayments.reduce((sum, p) => sum + p.amount, 0)
    const pendingPayments = tenant.payments.filter(p => p.status === 'PENDING')
    const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0)

    return NextResponse.json({
      tenant: {
        id: tenant.id,
        firstName: tenant.firstName,
        lastName: tenant.lastName,
        fullName: `${tenant.firstName} ${tenant.lastName}`,
        email: tenant.email,
        phone: tenant.phone,
        propertyId: tenant.propertyId,
        property: tenant.property,
        moveInDate: tenant.moveInDate,
        moveOutDate: tenant.moveOutDate,
        emergencyContact: tenant.emergencyContact,
        emergencyPhone: tenant.emergencyPhone,
        notes: tenant.notes,
        leases: tenant.leases,
        payments: tenant.payments,
        paymentStats: {
          totalPaid,
          totalPending,
          paymentCount: completedPayments.length,
          pendingCount: pendingPayments.length,
        },
        maintenanceCount: tenant._count.maintenanceRequests,
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt,
      },
    })
  } catch (error) {
    console.error('Error fetching tenant:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tenant' },
      { status: 500 }
    )
  }
}

// PUT /api/tenants/[id] - Update a tenant
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
        { error: 'Insufficient permissions to update tenant' },
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

    // Verify tenant exists in organization
    const existingTenant = await prisma.tenant.findFirst({
      where: { id, organizationId: orgUser.organizationId },
    })

    if (!existingTenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      propertyId,
      moveInDate,
      moveOutDate,
      emergencyContact,
      emergencyPhone,
      notes,
    } = body

    // If changing email, check for duplicates
    if (email && email !== existingTenant.email) {
      const duplicateEmail = await prisma.tenant.findFirst({
        where: { organizationId: orgUser.organizationId, email },
      })
      if (duplicateEmail) {
        return NextResponse.json(
          { error: 'A tenant with this email already exists' },
          { status: 409 }
        )
      }
    }

    // If changing property, verify it belongs to organization
    if (propertyId && propertyId !== existingTenant.propertyId) {
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

    const tenant = await prisma.tenant.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        phone,
        propertyId,
        moveInDate: moveInDate ? new Date(moveInDate) : undefined,
        moveOutDate: moveOutDate ? new Date(moveOutDate) : undefined,
        emergencyContact,
        emergencyPhone,
        notes,
      },
      include: {
        property: {
          select: { id: true, address: true, city: true, state: true, unitNumber: true },
        },
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId: orgUser.organizationId,
        userId: context.user?.id,
        action: 'TENANT_UPDATED',
        targetType: 'tenant',
        targetId: tenant.id,
        details: { tenantName: `${tenant.firstName} ${tenant.lastName}` },
      },
    })

    return NextResponse.json({
      tenant: {
        ...tenant,
        fullName: `${tenant.firstName} ${tenant.lastName}`,
      },
      message: 'Tenant updated successfully',
    })
  } catch (error) {
    console.error('Error updating tenant:', error)
    return NextResponse.json(
      { error: 'Failed to update tenant' },
      { status: 500 }
    )
  }
}

// DELETE /api/tenants/[id] - Delete a tenant
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    // Only ADMIN and above can delete tenants
    if (!context.role || !['OWNER', 'ADMIN'].includes(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to delete tenant' },
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

    // Verify tenant exists in organization
    const existingTenant = await prisma.tenant.findFirst({
      where: { id, organizationId: orgUser.organizationId },
    })

    if (!existingTenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }

    // Check for active leases
    const activeLeases = await prisma.lease.count({
      where: { tenantId: id, status: 'ACTIVE' },
    })

    if (activeLeases > 0) {
      return NextResponse.json(
        { error: 'Cannot delete tenant with active leases. Please terminate leases first.' },
        { status: 400 }
      )
    }

    await prisma.tenant.delete({
      where: { id },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId: orgUser.organizationId,
        userId: context.user?.id,
        action: 'TENANT_DELETED',
        targetType: 'tenant',
        targetId: id,
        details: { tenantName: `${existingTenant.firstName} ${existingTenant.lastName}` },
      },
    })

    return NextResponse.json({
      message: 'Tenant deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting tenant:', error)
    return NextResponse.json(
      { error: 'Failed to delete tenant' },
      { status: 500 }
    )
  }
}