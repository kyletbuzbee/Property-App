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

// GET /api/leases - List all leases for organization
export async function GET(request: NextRequest) {
  try {
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    if (!canManageTenants(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to view leases' },
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
    const tenantId = searchParams.get('tenantId')
    const status = searchParams.get('status') // 'active', 'expired', 'all'

    const where: any = { organizationId: orgUser.organizationId }

    if (propertyId) {
      where.propertyId = propertyId
    }

    if (tenantId) {
      where.tenantId = tenantId
    }

    if (status === 'active') {
      where.status = 'ACTIVE'
    } else if (status === 'expired') {
      where.status = { in: ['EXPIRED', 'TERMINATED'] }
    }

    const leases = await prisma.lease.findMany({
      where,
      include: {
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        property: {
          select: {
            id: true,
            address: true,
            city: true,
            state: true,
            unitNumber: true,
            monthlyRent: true,
          },
        },
        payments: {
          orderBy: { dueDate: 'desc' },
          take: 12,
          select: {
            id: true,
            amount: true,
            dueDate: true,
            paidDate: true,
            status: true,
            type: true,
          },
        },
        _count: {
          select: { payments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Transform leases with computed fields
    const today = new Date()
    const transformedLeases = leases.map((lease) => {
      const isExpiringSoon = lease.status === 'ACTIVE' && 
        lease.endDate && 
        new Date(lease.endDate) <= new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      
      const totalPaid = lease.payments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0)

      return {
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
        rentDueDay: lease.rentDueDay,
        gracePeriod: lease.gracePeriod,
        lateFee: lease.lateFee,
        isExpiringSoon,
        totalPaid,
        paymentCount: lease._count.payments,
        recentPayments: lease.payments,
        createdAt: lease.createdAt,
      }
    })

    return NextResponse.json({ leases: transformedLeases })
  } catch (error) {
    console.error('Error fetching leases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leases' },
      { status: 500 }
    )
  }
}

// POST /api/leases - Create a new lease
export async function POST(request: NextRequest) {
  try {
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    if (!canManageTenants(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create leases' },
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

    // Validate required fields
    if (!tenantId || !propertyId || !startDate || !endDate || !monthlyRent) {
      return NextResponse.json(
        { error: 'Tenant, property, start date, end date, and monthly rent are required' },
        { status: 400 }
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

    // Verify property belongs to organization
    const property = await prisma.property.findFirst({
      where: { id: propertyId, organizationId: orgUser.organizationId },
    })
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found in your organization' },
        { status: 404 }
      )
    }

    // Check for overlapping active leases on the property
    const overlappingLease = await prisma.lease.findFirst({
      where: {
        propertyId,
        status: 'ACTIVE',
        OR: [
          {
            // New lease starts before existing ends
            startDate: { lte: new Date(endDate) },
            endDate: { gte: new Date(startDate) },
          },
        ],
      },
    })
    if (overlappingLease) {
      return NextResponse.json(
        { error: 'There is already an active lease for this property during this period' },
        { status: 409 }
      )
    }

    // Create the lease
    const lease = await prisma.lease.create({
      data: {
        organizationId: orgUser.organizationId,
        tenantId,
        propertyId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        monthlyRent,
        securityDeposit,
        status: status || 'DRAFT',
        lateFee,
        gracePeriod,
        rentDueDay: rentDueDay || 1,
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

    // If lease is active, update property status
    if (status === 'ACTIVE') {
      await prisma.property.update({
        where: { id: propertyId },
        data: { 
          propertyStatus: 'RENTED',
          isRental: true,
        },
      })

      // Update tenant's property assignment
      await prisma.tenant.update({
        where: { id: tenantId },
        data: { 
          propertyId,
          moveInDate: new Date(startDate),
        },
      })
    }

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId: orgUser.organizationId,
        userId: context.user?.id,
        action: 'LEASE_CREATED',
        targetType: 'lease',
        targetId: lease.id,
        details: { 
          tenantName: `${lease.tenant.firstName} ${lease.tenant.lastName}`,
          propertyAddress: lease.property.address,
          monthlyRent,
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
      message: 'Lease created successfully',
    })
  } catch (error) {
    console.error('Error creating lease:', error)
    return NextResponse.json(
      { error: 'Failed to create lease' },
      { status: 500 }
    )
  }
}