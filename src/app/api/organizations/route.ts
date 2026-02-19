import { NextRequest, NextResponse } from 'next/server'  
import { supabase, prisma, authenticateRequest, requireRole, type UserRole } from '@/app/lib/db' 
