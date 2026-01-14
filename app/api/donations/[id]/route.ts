import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if donation exists
    const donation = await prisma.donation.findUnique({
      where: { id },
      include: { campaign: true },
    });

    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      );
    }

    // If donation was linked to a campaign, decrement the raised amount
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

    // Delete the donation
    await prisma.donation.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Donation deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting donation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
