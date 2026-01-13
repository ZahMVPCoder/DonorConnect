import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// AI-powered donor insights endpoint
export async function POST(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('auth-user')?.value;

    if (!authCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { donorId } = body;

    if (!donorId) {
      return NextResponse.json(
        { error: 'donorId is required' },
        { status: 400 }
      );
    }

    // Fetch donor data with donation history
    const donor = await prisma.donor.findUnique({
      where: { id: donorId },
      include: {
        donations: {
          orderBy: { date: 'desc' },
          take: 10,
          include: {
            campaign: true,
          },
        },
        tasks: {
          orderBy: { dueDate: 'desc' },
          take: 5,
        },
      },
    });

    if (!donor) {
      return NextResponse.json(
        { error: 'Donor not found' },
        { status: 404 }
      );
    }

    // Calculate donor insights
    const insights = generateDonorInsights(donor);

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error generating donor insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}

interface DonationWithCampaign {
  amount: number;
  date: Date;
  campaign: { name: string } | null;
}

interface Task {
  title: string;
  dueDate: Date;
}

interface DonorWithDetails {
  name: string;
  email: string;
  status: string;
  createdAt: Date;
  donations: DonationWithCampaign[];
  tasks: Task[];
}

function generateDonorInsights(donor: DonorWithDetails) {
  // Calculate metrics
  const totalDonations = donor.donations.reduce((sum, d) => sum + d.amount, 0);
  const donationCount = donor.donations.length;
  const averageDonation = donationCount > 0 ? totalDonations / donationCount : 0;
  const lastDonationDate = donor.donations.length > 0 ? donor.donations[0].date : null;
  const lastDonationDaysAgo = lastDonationDate 
    ? Math.floor((new Date().getTime() - new Date(lastDonationDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Determine donor segment
  let segment = 'Prospect';
  if (donationCount >= 5 && totalDonations >= 1000) segment = 'Major Donor';
  else if (donationCount >= 3 && totalDonations >= 500) segment = 'Regular Donor';
  else if (donationCount >= 1) segment = 'Recent Donor';

  // Generate recommendations
  const recommendations = generateRecommendations(donor, lastDonationDaysAgo);

  return {
    donor: {
      name: donor.name,
      email: donor.email,
      status: donor.status,
    },
    metrics: {
      totalDonations,
      donationCount,
      averageDonation: Math.round(averageDonation * 100) / 100,
      lastDonationDate,
      lastDonationDaysAgo,
    },
    segment,
    donationHistory: donor.donations.slice(0, 5).map(d => ({
      amount: d.amount,
      date: d.date,
      campaign: d.campaign?.name || 'General',
    })),
    upcomingTasks: donor.tasks.slice(0, 3),
    recommendations,
  };
}

function generateRecommendations(donor: DonorWithDetails, lastDonationDaysAgo: number | null) {
  const recommendations = [];

  // Check for lapsed donors
  if (lastDonationDaysAgo && lastDonationDaysAgo > 90) {
    recommendations.push({
      priority: 'high',
      message: `${donor.name} hasn't donated in ${lastDonationDaysAgo} days. Consider a personalized re-engagement email highlighting recent impact.`,
      action: 'Send re-engagement email',
    });
  }

  // Check for major donors
  const totalDonations = donor.donations.reduce((sum, d) => sum + d.amount, 0);
  if (donor.donations.length >= 5 && totalDonations >= 1000) {
    recommendations.push({
      priority: 'high',
      message: `${donor.name} is a major donor. Schedule a thank you call to strengthen the relationship and discuss giving plans.`,
      action: 'Schedule thank you call',
    });
  }

  // Check for recent donors
  if (donor.donations.length === 1) {
    recommendations.push({
      priority: 'medium',
      message: `${donor.name} is a new donor. Send a personalized thank you and share how their donation creates impact.`,
      action: 'Send welcome email',
    });
  }

  // Check for growing donors
  if (donor.donations.length >= 2) {
    const recentDonation = donor.donations[0].amount;
    const previousDonation = donor.donations[1].amount;
    if (recentDonation > previousDonation) {
      recommendations.push({
        priority: 'medium',
        message: `${donor.name} increased their donation. Acknowledge their growing commitment and explore increased giving opportunities.`,
        action: 'Reach out about giving levels',
      });
    }
  }

  // Default recommendation
  if (recommendations.length === 0) {
    recommendations.push({
      priority: 'low',
      message: `Continue regular engagement with ${donor.name} to maintain the donor relationship.`,
      action: 'Maintain regular contact',
    });
  }

  return recommendations;
}
