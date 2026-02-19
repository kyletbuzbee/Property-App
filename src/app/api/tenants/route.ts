import { NextRequest, NextResponse } from 'next/server'
import { prisma, authenticateRequest, canManageTenants, AuthContext } from '../../lib/db'

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

// GET /api/tenants - List all tenants for organization
export async function GET(request: NextRequest) {
  try {
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    if (!canManageTenants(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to view tenants' },
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
    const propertyId = searchParams.get('propertyId')
    const status = searchParams.get('status') // 'active', 'past', 'all'

    const where: any = { organizationId: orgUser.organizationId }

    if (propertyId) {
      where.propertyId = propertyId
    }

    // Filter by tenant status based on move-out date
    if (status === 'active') {
      where.AND = [
        { moveOutDate: null },
      ]
    } else if (status === 'past') {
      where.moveOutDate = { lt: new Date() }
    }

    const tenants = await prisma.tenant.findMany({
      where,
      include: {
        property: {
          select: { id: true, address: true, city: true, state: true, unitNumber: true },
        },
        leases: {
          where: { status: 'ACTIVE' },
          select: { id: true, monthlyRent: true, endDate: true },
        },
        _count: {
          select: { payments: true, maintenanceRequests: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Transform to include current lease info
    const transformedTenants = tenants.map((tenant) => ({
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
      currentRent: tenant.leases[0]?.monthlyRent || null,
      currentLeaseEnd: tenant.leases[0]?.endDate || null,
      paymentCount: tenant._count.payments,
      maintenanceCount: tenant._count.maintenanceRequests,
      notes: tenant.notes,
      createdAt: tenant.createdAt,
    }))

    return NextResponse.json({ tenants: transformedTenants })
  } catch (error) {
    console.error('Error fetching tenants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tenants' },
      { status: 500 }
    )
  }
}

// POST /api/tenants - Create a new tenant
export async function POST(request: NextRequest) {
  try {
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    if (!canManageTenants(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create tenants' },
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
      firstName,
      lastName,
      email,
      phone,
      propertyId,
      moveInDate,
      emergencyContact,
      emergencyPhone,
      notes,
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      )
    }

    // If propertyId provided, verify it belongs to the organization
    if (propertyId) {
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

    // Check if tenant email already exists in org
    const existingTenant = await prisma.tenant.findFirst({
      where: { organizationId: orgUser.organizationId, email },
    })
    if (existingTenant) {
      return NextResponse.json(
        { error: 'A tenant with this email already exists in your organization' },
        { status: 409 }
      )
    }

    const tenant = await prisma.tenant.create({
      data: {
        organizationId: orgUser.organizationId,
        firstName,
        lastName,
        email,
        phone,
        propertyId,
        moveInDate: moveInDate ? new Date(moveInDate) : null,
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
        action: 'TENANT_CREATED',
        targetType: 'tenant',
        targetId: tenant.id,
        details: { tenantName: `${firstName} ${lastName}`, email },
      },
    })

    return NextResponse.json({
      tenant: {
        ...tenant,
        fullName: `${tenant.firstName} ${tenant.lastName}`,
      },
      message: 'Tenant created successfully',
    })
  } catch (error) {
    console.error('Error creating tenant:', error)
    return NextResponse.json(
      { error: 'Failed to create tenant' },
      { status: 500 }
    )
  }
}