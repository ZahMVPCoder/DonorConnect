import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function checkAdminRole(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('auth-user')?.value;

    if (!authCookie) {
      return {
        isAdmin: false,
        user: null,
        error: 'Unauthorized - No auth cookie',
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: authCookie },
      select: { id: true, role: true, email: true, username: true },
    });

    if (!user) {
      return {
        isAdmin: false,
        user: null,
        error: 'User not found',
      };
    }

    return {
      isAdmin: user.role === 'admin',
      user,
      error: null,
    };
  } catch (error) {
    return {
      isAdmin: false,
      user: null,
      error: 'Internal server error',
    };
  }
}

export function createUnauthorizedResponse(message: string = 'Admin access required') {
  return NextResponse.json(
    { error: message },
    { status: 403 }
  );
}
