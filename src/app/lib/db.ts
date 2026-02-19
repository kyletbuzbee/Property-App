import { createClient, SupabaseClient, User } from '@supabase/supabase-js'

export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER' | 'TENANT'

export interface AuthUser {
  id: string
  email: string
  supabaseId: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
}

export interface AuthContext {
  user: AuthUser | null
  organizationId: string | null
  role: UserRole | null
  isAuthenticated: boolean
}

// Role hierarchy - higher roles have all permissions of lower roles
const roleHierarchy: Record<UserRole, number> = {
  OWNER: 5,
  ADMIN: 4,
  MEMBER: 3,
  VIEWER: 2,
  TENANT: 1,
}

export const hasRole = (userRole: UserRole | null, requiredRole: UserRole): boolean => {
  if (!userRole) return false
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export const canManageOrganization = (role: UserRole | null): boolean => {
  return hasRole(role, 'ADMIN')
}

export const canManageProperties = (role: UserRole | null): boolean => {
  return hasRole(role, 'MEMBER')
}

export const canViewProperties = (role: UserRole | null): boolean => {
  return hasRole(role, 'VIEWER')
}

export const canManageTenants = (role: UserRole | null): boolean => {
  return hasRole(role, 'MEMBER')
}

export const canManageMaintenance = (role: UserRole | null): boolean => {
  return hasRole(role, 'MEMBER')
}

export const canManagePayments = (role: UserRole | null): boolean => {
  return hasRole(role, 'MEMBER')
}

export const canManageAccounting = (role: UserRole | null): boolean => {
  return hasRole(role, 'ADMIN')
}

// Create a single supabase client for server-side use
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Get Supabase service role key for admin operations (use with caution)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, { auth: { autoRefreshToken: false, persistSession: false } })
  : null

export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER' | 'TENANT'

export interface AuthUser {
  id: string
  email: string
  supabaseId: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
}

export interface AuthContext {
  user: AuthUser | null
  organizationId: string | null
  role: UserRole | null
  isAuthenticated: boolean
}

// Role hierarchy - higher roles have all permissions of lower roles
const roleHierarchy: Record<UserRole, number> = {
  OWNER: 5,
  ADMIN: 4,
  MEMBER: 3,
  VIEWER: 2,
  TENANT: 1,
}

export const hasRole = (userRole: UserRole | null, requiredRole: UserRole): boolean => {
  if (!userRole) return false
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export const canManageOrganization = (role: UserRole | null): boolean => {
  return hasRole(role, 'ADMIN')
}

export const canManageProperties = (role: UserRole | null): boolean => {
  return hasRole(role, 'MEMBER')
}

export const canViewProperties = (role: UserRole | null): boolean => {
  return hasRole(role, 'VIEWER')
}

export const canManageTenants = (role: UserRole | null): boolean => {
  return hasRole(role, 'MEMBER')
}

export const canManageMaintenance = (role: UserRole | null): boolean => {
  return hasRole(role, 'MEMBER')
}

export const canManagePayments = (role: UserRole | null): boolean => {
  return hasRole(role, 'MEMBER')
}

export const canManageAccounting = (role: UserRole | null): boolean => {
  return hasRole(role, 'ADMIN')
}

// Authentication helper functions
export const getAuthUser = async (
  supabase: SupabaseClient,
  token: string
): Promise<{ user: User | null; error: Error | null }> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    return { user, error }
  } catch (error) {
    return { user: null, error: error as Error }
  }
}

export const getUserOrganization = async (
  supabase: SupabaseClient,
  prisma: any,
  userId: string
): Promise<{ orgId: string | null; role: UserRole | null; error: Error | null }> => {
  try {
    // First try to find user in our User table
    let dbUser = await prisma.user.findUnique({
      where: { supabaseId: userId },
      include: {
        organizations: {
          include: {
            organization: true,
          },
          take: 1,
        },
      },
    })

    if (dbUser && dbUser.organizations.length > 0) {
      return {
        orgId: dbUser.organizations[0].organization.id,
        role: dbUser.organizations[0].role as UserRole,
        error: null,
      }
    }

    // If no organization link, return null
    return { orgId: null, role: null, error: null }
  } catch (error) {
    return { orgId: null, role: null, error: error as Error }
  }
}

// Middleware helper for Next.js API routes
export const authenticateRequest = async (
  request: Request
): Promise<{ context: AuthContext; error: Response | null }> => {
  const { supabase, prisma } = await import('./db')

  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return {
      context: {
        user: null,
        organizationId: null,
        role: null,
        isAuthenticated: false,
      },
      error: new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    }
  }

  const token = authHeader.slice(7)
  const { user, error: authError } = await getAuthUser(supabase, token)

  if (authError || !user) {
    return {
      context: {
        user: null,
        organizationId: null,
        role: null,
        isAuthenticated: false,
      },
      error: new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    }
  }

  // Get user's organization and role
  const { orgId, role, error: orgError } = await getUserOrganization(
    supabase,
    prisma,
    user.id
  )

  return {
    context: {
      user: {
        id: user.id,
        email: user.email || '',
        supabaseId: user.id,
      },
      organizationId: orgId,
      role,
      isAuthenticated: true,
    },
    error: n