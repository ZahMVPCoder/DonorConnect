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

    const campaigns = await prisma.campaign.findMany({
      where: {
        userId: userId,
        status: 'Active',
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('auth-user')?.value;

    if (!authCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = authCookie;
    const body = await request.json();
    const { name, goal, startDate, endDate, status } = body;

    if (!name || !goal || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Name, goal, start date, and end date are required' },
        { status: 400 }
      );
    }

    const parsedGoal = parseFloat(goal);
    if (isNaN(parsedGoal) || parsedGoal <= 0) {
      return NextResponse.json(
        { error: 'Goal must be a positive number' },
        { status: 400 }
      );
    }

    const parsedStart = new Date(startDate);
    const parsedEnd = new Date(endDate);
    if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
      return NextResponse.json(
        { error: 'Invalid start or end date' },
        { status: 400 }
      );
    }

    if (parsedEnd < parsedStart) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        goal: parsedGoal,
        raised: 0,
        status: status || 'Active',
        startDate: parsedStart,
        endDate: parsedEnd,
        userId,
      },
      include: {
        donations: true,
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
