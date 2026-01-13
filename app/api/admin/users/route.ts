import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminRole, createUnauthorizedResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = await checkAdminRole(request);

    if (!auth.isAdmin) {
      return createUnauthorizedResponse();
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update user role (admin only)
export async function PUT(request: NextRequest) {
  try {
    const auth = await checkAdminRole(request);

    if (!auth.isAdmin) {
      return createUnauthorizedResponse();
    }

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role || !['admin', 'staff'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid userId or role' },
        { status: 400 }
      );
    }

    // Prevent removing the last admin
    if (role === 'staff') {
      const adminCount = await prisma.user.count({
        where: { role: 'admin' },
      });

      if (adminCount === 1) {
        const targetUser = await prisma.user.findUnique({ where: { id: userId } });
        if (targetUser?.role === 'admin') {
          return NextResponse.json(
            { error: 'Cannot remove the last admin user' },
            { status: 400 }
          );
        }
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete user (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const auth = await checkAdminRole(request);

    if (!auth.isAdmin) {
      return createUnauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Prevent deleting the last admin
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role === 'admin') {
      const adminCount = await prisma.user.count({
        where: { role: 'admin' },
      });

      if (adminCount === 1) {
        return NextResponse.json(
          { error: 'Cannot delete the last admin user' },
          { status: 400 }
        );
      }
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
