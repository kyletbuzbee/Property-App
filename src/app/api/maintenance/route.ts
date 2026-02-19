import { NextRequest, NextResponse } from 'next/server'
import { prisma, authenticateRequest, canManageMaintenance, AuthContext } from '../../lib/db'

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

// GET /api/maintenance - List all maintenance requests
export async function GET(request: NextRequest) {
  try {
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    if (!canManageMaintenance(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to view maintenance requests' },
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
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const category = searchParams.get('category')

    const where: any = { organizationId: orgUser.organizationId }

    if (propertyId) where.propertyId = propertyId
    if (tenantId) where.tenantId = tenantId
    if (status) where.status = status
    if (priority) where.priority = priority
    if (category) where.category = category

    const requests = await prisma.maintenanceRequest.findMany({
      where,
      include: {
        property: {
          select: { id: true, address: true, city: true, state: true, unitNumber: true },
        },
        tenant: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
        vendor: {
          select: { id: true, name: true, email: true, phone: true, category: true },
        },
        _count: {
          select: { comments: true, attachments: true },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    // Transform with computed fields
    const transformedRequests = requests.map(req => ({
      id: req.id,
      propertyId: req.propertyId,
      property: req.property,
      tenantId: req.tenantId,
      tenant: req.tenant ? {
        ...req.tenant,
        fullName: `${req.tenant.firstName} ${req.tenant.lastName}`,
      } : null,
      vendorId: req.vendorId,
      vendor: req.vendor,
      title: req.title,
      description: req.description,
      priority: req.priority,
      status: req.status,
      category: req.category,
      estimatedCost: req.estimatedCost,
      actualCost: req.actualCost,
      scheduledDate: req.scheduledDate,
      completedDate: req.completedDate,
      accessInstructions: req.accessInstructions,
      commentCount: req._count.comments,
      attachmentCount: req._count.attachments,
      createdAt: req.createdAt,
      updatedAt: req.updatedAt,
    }))

    // Get summary stats
    const summary = {
      open: requests.filter(r => r.status === 'OPEN').length,
      inProgress: requests.filter(r => r.status === 'IN_PROGRESS').length,
      completed: requests.filter(r => r.status === 'COMPLETED').length,
      emergency: requests.filter(r => r.priority === 'EMERGENCY' && r.status !== 'COMPLETED').length,
      totalEstimated: requests.reduce((sum, r) => sum + (r.estimatedCost || 0), 0),
      totalActual: requests.reduce((sum, r) => sum + (r.actualCost || 0), 0),
    }

    return NextResponse.json({ 
      requests: transformedRequests,
      summary,
    })
  } catch (error) {
    console.error('Error fetching maintenance requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch maintenance requests' },
      { status: 500 }
    )
  }
}

// POST /api/maintenance - Create a new maintenance request
export async function POST(request: NextRequest) {
  try {
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    if (!canManageMaintenance(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create maintenance requests' },
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
      propertyId,
      tenantId,
      vendorId,
      title,
      description,
      priority,
      category,
      estimatedCost,
      scheduledDate,
      accessInstructions,
    } = body

    // Validate required fields
    if (!propertyId || !title || !description) {
      return NextResponse.json(
        { error: 'Property, title, and description are required' },
        { status: 400 }
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

    // Verify vendor if provided
    if (vendorId) {
      const vendor = await prisma.vendor.findFirst({
        where: { id: vendorId, organizationId: orgUser.organizationId },
      })
      if (!vendor) {
        return NextResponse.json(
          { error: 'Vendor not found in your organization' },
          { status: 404 }
        )
      }
    }

    const maintenanceRequest = await prisma.maintenanceRequest.create({
      data: {
        organizationId: orgUser.organizationId,
        propertyId,
        tenantId,
        vendorId,
        reportedBy: context.user?.id,
        title,
        description,
        priority: priority || 'MEDIUM',
        category: category || 'General',
        estimatedCost,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        accessInstructions,
        status: 'OPEN',
      },
      include: {
        property: {
          select: { id: true, address: true, city: true, state: true, unitNumber: true },
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
        action: 'MAINTENANCE_REQUEST_CREATED',
        targetType: 'maintenance',
        targetId: maintenanceRequest.id,
        details: { 
          title,
          priority: priority || 'MEDIUM',
          propertyAddress: maintenanceRequest.property.address,
        },
      },
    })

    return NextResponse.json({
      request: {
        ...maintenanceRequest,
        tenant: maintenanceRequest.tenant ? {
          ...maintenanceRequest.tenant,
          fullName: `${maintenanceRequest.tenant.firstName} ${maintenanceRequest.tenant.lastName}`,
        } : null,
      },
      message: 'Maintenance request created successfully',
    })
  } catch (error) {
    console.error('Error creating maintenance request:', error)
    return NextResponse.json(
      { error: 'Failed to create maintenance request' },
      { status: 500 }
    )
  }
}