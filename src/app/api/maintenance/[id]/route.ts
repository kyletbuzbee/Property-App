import { NextRequest, NextResponse } from 'next/server'
import { prisma, authenticateRequest, canManageMaintenance, AuthContext } from '../../../lib/db'

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

// GET /api/maintenance/[id] - Get single maintenance request
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    if (!canManageMaintenance(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to view maintenance request' },
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

    const maintenanceRequest = await prisma.maintenanceRequest.findFirst({
      where: { id, organizationId: orgUser.organizationId },
      include: {
        property: {
          select: { id: true, address: true, city: true, state: true, zip: true, unitNumber: true },
        },
        tenant: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
        vendor: {
          select: { id: true, name: true, email: true, phone: true, category: true, hourlyRate: true },
        },
        comments: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        attachments: {
          orderBy: { uploadedAt: 'desc' },
        },
      },
    })

    if (!maintenanceRequest) {
      return NextResponse.json(
        { error: 'Maintenance request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      request: {
        ...maintenanceRequest,
        tenant: maintenanceRequest.tenant ? {
          ...maintenanceRequest.tenant,
          fullName: `${maintenanceRequest.tenant.firstName} ${maintenanceRequest.tenant.lastName}`,
        } : null,
        comments: maintenanceRequest.comments.map(c => ({
          ...c,
          user: c.user ? {
            ...c.user,
            fullName: `${c.user.firstName || ''} ${c.user.lastName || ''}`.trim() || 'Unknown',
          } : null,
        })),
      },
    })
  } catch (error) {
    console.error('Error fetching maintenance request:', error)
    return NextResponse.json(
      { error: 'Failed to fetch maintenance request' },
      { status: 500 }
    )
  }
}

// PUT /api/maintenance/[id] - Update a maintenance request
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    if (!canManageMaintenance(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to update maintenance request' },
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

    const existingRequest = await prisma.maintenanceRequest.findFirst({
      where: { id, organizationId: orgUser.organizationId },
    })

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Maintenance request not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      priority,
      status,
      category,
      vendorId,
      estimatedCost,
      actualCost,
      scheduledDate,
      completedDate,
      accessInstructions,
    } = body

    // If completing, set completed date
    const isCompleting = status === 'COMPLETED' && existingRequest.status !== 'COMPLETED'

    const maintenanceRequest = await prisma.maintenanceRequest.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        status,
        category,
        vendorId,
        estimatedCost,
        actualCost,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
        completedDate: isCompleting ? new Date() : (completedDate ? new Date(completedDate) : undefined),
        accessInstructions,
      },
      include: {
        property: {
          select: { id: true, address: true, city: true, state: true },
        },
        tenant: {
          select: { id: true, firstName: true, lastName: true },
        },
        vendor: {
          select: { id: true, name: true },
        },
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId: orgUser.organizationId,
        userId: context.user?.id,
        action: isCompleting ? 'MAINTENANCE_COMPLETED' : 'MAINTENANCE_UPDATED',
        targetType: 'maintenance',
        targetId: maintenanceRequest.id,
        details: { 
          title: maintenanceRequest.title,
          status,
          actualCost,
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
      message: isCompleting ? 'Maintenance request completed' : 'Maintenance request updated successfully',
    })
  } catch (error) {
    console.error('Error updating maintenance request:', error)
    return NextResponse.json(
      { error: 'Failed to update maintenance request' },
      { status: 500 }
    )
  }
}

// DELETE /api/maintenance/[id] - Delete a maintenance request
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    // Only ADMIN and above can delete
    if (!context.role || !['OWNER', 'ADMIN'].includes(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to delete maintenance request' },
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

    const existingRequest = await prisma.maintenanceRequest.findFirst({
      where: { id, organizationId: orgUser.organizationId },
    })

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Maintenance request not found' },
        { status: 404 }
      )
    }

    await prisma.maintenanceRequest.delete({
      where: { id },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId: orgUser.organizationId,
        userId: context.user?.id,
        action: 'MAINTENANCE_DELETED',
        targetType: 'maintenance',
        targetId: id,
        details: { title: existingRequest.title },
      },
    })

    return NextResponse.json({
      message: 'Maintenance request deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting maintenance request:', error)
    return NextResponse.json(
      { error: 'Failed to delete maintenance request' },
      { status: 500 }
    )
  }
}