import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { donorId, amount, campaignId } = body;

    // Validation
    if (!donorId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: donorId and amount are required' },
        { status: 400 }
      );
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    // Check if donor exists
    const donor = await prisma.donor.findUnique({
      where: { id: donorId },
    });

    if (!donor) {
      return NextResponse.json(
        { error: `Donor with ID ${donorId} not found` },
        { status: 404 }
      );
    }

    // Check if campaign exists (if provided)
    if (campaignId) {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) {
        return NextResponse.json(
          { error: `Campaign with ID ${campaignId} not found` },
          { status: 404 }
        );
      }
    }

    // Create donation
    const donation = await prisma.donation.create({
      data: {
        amount,
        donorId,
        campaignId: campaignId || null,
      },
      include: {
        donor: true,
        campaign: true,
      },
    });

    // Update campaign raised amount if applicable
    if (campaignId) {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          raised: {
            increment: amount,
          },
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Donation created successfully',
        donation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const donations = await prisma.donation.findMany({
      include: {
        donor: true,
        campaign: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json({ donations }, { status: 200 });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
