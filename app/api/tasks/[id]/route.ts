import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // Check if task exists and belongs to this user
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.userId !== userId) {
      return NextResponse.json(
        { error: 'Task not found or access denied' },
        { status: 404 }
      );
    }

    // Update task status
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        status: status || task.status,
      },
      include: {
        donor: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}
