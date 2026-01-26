import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from auth cookie
    const authCookie = request.cookies.get('auth-user')?.value;

    if (!authCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = authCookie;

    // Get upcoming tasks for this user (pending tasks, ordered by due date)
    const tasks = await prisma.task.findMany({
      where: {
        userId: userId,
        status: 'Pending',
      },
      orderBy: {
        dueDate: 'asc',
      },
      take: 5,
      include: {
        donor: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
