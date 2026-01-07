import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const all = searchParams.get('all');

    let query: any = {
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: 'asc',
      },
    };

    // If requesting with full data for display
    if (!all) {
      const donors = await prisma.donor.findMany(query);
      return NextResponse.json(donors);
    }

    // For refreshing donor list in frontend
    const donors = await prisma.donor.findMany({
      include: {
        donations: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(donors);
  } catch (error) {
    console.error('Error fetching donors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donors' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, status, totalGiving, lastGiftAmount } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if donor already exists
    const existingDonor = await prisma.donor.findUnique({
      where: { email },
    });

    if (existingDonor) {
      return NextResponse.json(
        { error: 'Donor with this email already exists' },
        { status: 409 }
      );
    }

    // Create donor
    const donor = await prisma.donor.create({
      data: {
        name,
        email,
        status: status || 'Active',
      },
      include: {
        donations: true,
      },
    });

    // If last gift amount is provided, create a donation record
    if (lastGiftAmount && lastGiftAmount > 0) {
      await prisma.donation.create({
        data: {
          donorId: donor.id,
          campaignId: (await prisma.campaign.findFirst({ select: { id: true } }))?.id || '',
          amount: lastGiftAmount,
          date: new Date(),
        },
      });
    }

    return NextResponse.json(donor, { status: 201 });
  } catch (error) {
    console.error('Error creating donor:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

