import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function DELETE(
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

    // Check if donor exists and belongs to this user
    const donor = await prisma.donor.findUnique({
      where: { 
        id,
        userId: userId,
      },
      include: {
        donations: true,
        tasks: true,
      },
    });

    if (!donor) {
      return NextResponse.json(
        { error: 'Donor not found or access denied' },
        { status: 404 }
      );
    }

    // Delete related tasks first
    await prisma.task.deleteMany({
      where: { donorId: id },
    });

    // Update campaigns to decrement raised amounts for deleted donations
    for (const donation of donor.donations) {
      if (donation.campaignId) {
        await prisma.campaign.update({
          where: { id: donation.campaignId },
          data: {
            raised: {
              decrement: donation.amount,
            },
          },
        });
      }
    }

    // Delete donations
    await prisma.donation.deleteMany({
      where: { donorId: id },
    });

    // Delete the donor
    await prisma.donor.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Donor deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting donor:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
