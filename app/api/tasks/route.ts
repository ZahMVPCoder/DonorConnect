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
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit');

    // Get tasks for this user
    const tasks = await prisma.task.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        dueDate: 'asc',
      },
      take: limit ? parseInt(limit) : undefined,
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

export async function POST(request: NextRequest) {
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
    const body = await request.json();
    const { title, description, type, priority, dueDate, donorId } = body;

    // Validation
    if (!title || !dueDate) {
      return NextResponse.json(
        { error: 'Title and due date are required' },
        { status: 400 }
      );
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        type: type || 'Follow-up',
        priority: priority || 'Medium',
        status: 'Pending',
        dueDate: new Date(dueDate),
        donorId: donorId || null,
        userId: userId,
      },
      include: {
        donor: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
