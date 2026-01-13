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

    // Get current month dates
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Calculate total raised this month
    const thisMonthDonations = await prisma.donation.findMany({
      where: {
        donor: {
          // Optionally filter by user if donations had a userId field
        },
        date: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
      select: {
        amount: true,
      },
    });

    const totalRaisedThisMonth = thisMonthDonations.reduce((sum, d) => sum + d.amount, 0);

    // Get recent donations
    const recentDonations = await prisma.donation.findMany({
      take: 3,
      orderBy: { date: 'desc' },
      include: {
        donor: true,
        campaign: true,
      },
    });

    // Count new donors this month
    const newDonorsThisMonth = await prisma.donor.count({
      where: {
        createdAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    });

    // Count lapsed donors (no donations in last 90 days)
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const donorsWithRecentDonations = await prisma.donation.findMany({
      where: {
        date: {
          gte: ninetyDaysAgo,
        },
      },
      select: {
        donorId: true,
      },
      distinct: ['donorId'],
    });

    const recentDonorIds = donorsWithRecentDonations.map(d => d.donorId);
    const lapsedDonors = await prisma.donor.count({
      where: {
        id: {
          notIn: recentDonorIds,
        },
      },
    });

    // Get campaigns for goal progress
    const campaigns = await prisma.campaign.findMany({
      select: {
        goal: true,
        raised: true,
      },
    });

    const totalGoal = campaigns.reduce((sum, c) => sum + c.goal, 0);
    const totalRaised = campaigns.reduce((sum, c) => sum + c.raised, 0);
    const goalProgress = totalGoal > 0 ? Math.round((totalRaised / totalGoal) * 100) : 0;

    return NextResponse.json({
      totalRaisedThisMonth,
      goalProgress,
      goalAmount: totalGoal,
      newDonors: newDonorsThisMonth,
      lapsedDonors,
      recentDonations: recentDonations.map(d => ({
        id: d.id,
        amount: d.amount,
        date: d.date,
        donorName: d.donor.name,
        campaignName: d.campaign?.name || 'General',
      })),
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
