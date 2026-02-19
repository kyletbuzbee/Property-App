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

// GET /api/vendors - List all vendors
export async function GET(request: NextRequest) {
  try {
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    if (!canManageMaintenance(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to view vendors' },
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
    const category = searchParams.get('category')
    const isVerified = searchParams.get('verified')

    const where: any = { organizationId: orgUser.organizationId }
    if (category) where.category = category
    if (isVerified !== null) where.isVerified = isVerified === 'true'

    const vendors = await prisma.vendor.findMany({
      where,
      include: {
        _count: {
          select: { maintenanceRequests: true },
        },
      },
      orderBy: [{ isVerified: 'desc' }, { name: 'asc' }],
    })

    // Group by category
    const byCategory: Record<string, number> = {}
    vendors.forEach(v => {
      if (!byCategory[v.category]) byCategory[v.category] = 0
      byCategory[v.category]++
    })

    return NextResponse.json({
      vendors: vendors.map(v => ({
        id: v.id,
        name: v.name,
        email: v.email,
        phone: v.phone,
        address: v.address,
        city: v.city,
        state: v.state,
        zip: v.zip,
        category: v.category,
        hourlyRate: v.hourlyRate,
        rating: v.rating,
        isVerified: v.isVerified,
        licenseNumber: v.licenseNumber,
        insuranceExpiry: v.insuranceExpiry,
        notes: v.notes,
        jobCount: v._count.maintenanceRequests,
        createdAt: v.createdAt,
      })),
      summary: {
        totalVendors: vendors.length,
        verifiedCount: vendors.filter(v => v.isVerified).length,
        byCategory,
      },
    })
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    )
  }
}

// POST /api/vendors - Create a new vendor
export async function POST(request: NextRequest) {
  try {
    const { context, error } = await authenticateRequest(request)
    if (error) return error

    if (!canManageMaintenance(context.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create vendors' },
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
      email,
      phone,
      address,
      city,
      state,
      zip,
      category,
      hourlyRate,
      licenseNumber,
      insuranceExpiry,
      notes,
    } = body

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      )
    }

    // Validate category
    const validCategories = ['plumber', 'electrician', 'hvac', 'roofer', 'general', 'landscaper', 'painter', 'cleaner', 'handyman', 'other']
    if (!validCategories.includes(category.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    const vendor = await prisma.vendor.create({
      data: {
        organizationId: orgUser.organizationId,
        name,
        email,
        phone,
        address,
        city,
        state,
        zip,
        category: category.toLowerCase(),
        hourlyRate,
        licenseNumber,
        insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : null,
        notes,
        isVerified: false,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId: orgUser.organizationId,
        userId: context.user?.id,
        action: 'VENDOR_CREATED',
        targetType: 'vendor',
        targetId: vendor.id,
        details: { name, category },
      },
    })

    return NextResponse.json({
      vendor,
      message: 'Vendor created successfully',
    })
  } catch (error) {
    console.error('Error creating vendor:', error)
    return NextResponse.json(
      { error: 'Failed to create vendor' },
      { status: 500 }
    )
  }
}