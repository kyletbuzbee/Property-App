
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

// GET /api/vendors/[id] - Get single vendor
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
        { error: 'Insufficient permissions to view vendor' },
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

    const vendor = await prisma.vendor.findFirst({
      where: { id, organizationId: orgUser.organizationId },
      include: {
        maintenanceRequests: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            property: {
              select: { id: true, address: true, city: true, state: true },
            },
          },
        },
      },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Calculate vendor stats
    const completedJobs = vendor.maintenanceRequests.filter(j => j.status === 'COMPLETED')
    const totalSpent = completedJobs.reduce((sum, j) => sum + (j.actualCost || 0), 0)

    return NextResponse.json({
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        address: vendor.address,
        city: vendor.city,
        state: vendor.state,
        zip: vendor.zip,
        category: vendor.category,
        hourlyRate: vendor.hourlyRate,
        rating: vendor.rating,
        isVerified: vendor.isVerified,
        licenseNumber: vendor.licenseNumber,
        insuranceExpiry: vendor.insuranceExpiry,
        notes: vendor.notes,
        recentJobs: vendor.maintenanceRequests,
        stats: {
          totalJobs: vendor.maintenanceRequests.length,
          completedJobs: completedJobs.length,
          totalSpent,
        },
        createdAt: vendor.createdAt,
        updatedAt: vendor.updatedAt,
      },
    })
  } catch (error) {
    console.error('Error fetching vendor:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendor' },
      { status: 500 }
    )
  }
}

// PUT /api/vendors/[id] - Update a vendor
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
        { error: 'Insufficient permissions to update vendor' },
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

    const existingVendor = await prisma.vendor.findFirst({
      where: { id, organizationId: orgUser.organizationId },
    })

    if (!existingVendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      zip,
      category,
      hourlyRate,
      rating,
      isVerified,
      licenseNumber,
      insuranceExpiry,
      notes,
    } = body

    const vendor = await prisma.vendor.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        city,
        state,
        zip,
        category,
        hourlyRate,
        rating,
        isVerified,
        licenseNumber,
        insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : undefined,
        notes,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId: orgUser.organizationId,
        userId: context.user?.id,
        action: 'VENDOR_UPDATED',
        targetType: 'vendor',
        targetId: vendor.id,
        details: { name: vendor.name },
      },
    })

    return NextResponse.json({
      vendor,
      message: 'Vendor updated successfully',
    })
  } catch (error) {
    console.error('Error updating vendor:', error)
    return NextResponse.json(
      { error: 'Failed to update vendor' },
      { status: 500 }
    )
  }
}

// DELETE /api/vendors/[id] - Delete a vendor
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
        { error: 'Insufficient permissions to delete vendor' },
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

    const existingVendor = await prisma.vendor.findFirst({
      where: { id, organizationId: orgUser.organizationId },
    })

    if (!existingVendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Check for associated maintenance requests
    const jobCount = await prisma.maintenanceRequest.count({
      where: { vendorId: id },
    })

    if (jobCount > 0) {
      return NextResponse.json({
        message: 'Cannot delete vendor with associated jobs',
      })
    }

    await prisma.vendor.delete({
      where: { id },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId: orgUser.organizationId,
        userId: context.user?.id,
        action: 'VENDOR_DELETED',
        targetType: 'vendor',
        targetId: id,
        details: { name: existingVendor.name },
      },
    })

    return NextResponse.json({
      message: 'Vendor deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting vendor:', error)
    return NextResponse.json(
      { error: 'Failed to delete vendor' },
      { status: 500 }
    )
  }
}