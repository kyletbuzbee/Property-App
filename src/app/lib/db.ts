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

// Authentication helper functions
export const getAuthUser = async (
  supabaseClient: SupabaseClient,
  token: string
): Promise<{ user: User | null; error: Error | null }> => {
  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser(token)
    return { user, error: error as Error | null }
  } catch (error) {
    return { user: null, error: error as Error }
  }
}

// Middleware helper for Next.js API routes
export const authenticateRequest = async (
  request: Request
): Promise<{ context: AuthContext; error: Response | null }> => {
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

  return {
    context: {
      user: {
        id: user.id,
        email: user.email || '',
        supabaseId: user.id,
      },
      organizationId: null, // Will be populated after checking User table
      role: null,
      isAuthenticated: true,
    },
    error: null,
  }
}

// Decorator-like function for requiring specific roles
export const requireRole = (...allowedRoles: UserRole[]) => {
  return async (
    request: Request
  ): Promise<{ context: AuthContext; error: Response | null }> => {
    const { context, error } = await authenticateRequest(request)

    if (error) {
      return { context, error }
    }

    if (!context.role || !allowedRoles.includes(context.role)) {
      return {
        context,
        error: new Response(
          JSON.stringify({ error: 'Insufficient permissions' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        ),
      }
    }

    return { context, error: null }
  }
}

// Keep prisma export for compatibility but mark as deprecated
// TODO: Migrate all queries to use supabase client
import { PrismaClient } from '../../generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    console.warn('DATABASE_URL not set, Prisma client may not work')
    return null as any
  }
  
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
