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

    // Fetch donor data with donation history (verify it belongs to this user)
    const donor = await prisma.donor.findUnique({
      where: { 
        id: donorId,
        userId: authCookie,
      },
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
  const totalDonations = donor.donations.reduce((sum, d) => sum + d.amount, 0);
  const donationCount = donor.donations.length;

  // System tips - always include helpful guidance
  const systemTips = [];
  
  systemTips.push({
    priority: 'info',
    category: 'System Features',
    message: `💡 Use the "Send Thank You" button on this page to acknowledge ${donor.name}'s contributions. Personal gratitude increases retention by 20%.`,
    action: 'Send Thank You Message',
  });

  systemTips.push({
    priority: 'info',
    category: 'Task Management',
    message: `📋 Create a task to follow up with ${donor.name}. Go to Tasks → Add Task and link it to this donor for organized relationship management.`,
    action: 'Create Follow-up Task',
  });

  if (donationCount > 0) {
    systemTips.push({
      priority: 'info',
      category: 'Campaign Tracking',
      message: `📊 Track which campaigns resonate with ${donor.name}. Visit the Campaigns page to see their giving patterns across different initiatives.`,
      action: 'View Campaign Analytics',
    });
  }

  // Check for lapsed donors
  if (lastDonationDaysAgo && lastDonationDaysAgo > 180) {
    recommendations.push({
      priority: 'high',
      category: 'Retention Alert',
      message: `⚠️ ${donor.name} hasn't donated in ${lastDonationDaysAgo} days (${Math.round(lastDonationDaysAgo/30)} months). High lapse risk! Send a personalized re-engagement email highlighting recent impact stories.`,
      action: 'Send Re-engagement Email',
      howTo: 'Use the Send Thank You button, then create a task to follow up with a phone call in 1 week.',
    });
  } else if (lastDonationDaysAgo && lastDonationDaysAgo > 90) {
    recommendations.push({
      priority: 'medium',
      category: 'Engagement Opportunity',
      message: `📅 ${donor.name} last gave ${lastDonationDaysAgo} days ago (${Math.round(lastDonationDaysAgo/30)} months). Reach out with a campaign update before they become lapsed.`,
      action: 'Send Campaign Update',
      howTo: 'Create a task reminder to call them this week and share recent success stories.',
    });
  }

  // Check for major donors
  if (donationCount >= 5 && totalDonations >= 1000) {
    recommendations.push({
      priority: 'high',
      category: 'VIP Relationship',
      message: `⭐ ${donor.name} is a major donor ($${totalDonations.toLocaleString()} total). Schedule a thank you call to strengthen the relationship and discuss legacy giving or planned giving opportunities.`,
      action: 'Schedule VIP Thank You Call',
      howTo: 'Create a high-priority task to call within 48 hours. Use the Donations page to reference their specific contributions.',
    });
  } else if (donationCount >= 3 && totalDonations >= 500) {
    recommendations.push({
      priority: 'medium',
      category: 'Major Donor Prospect',
      message: `🎯 ${donor.name} shows major donor potential ($${totalDonations.toLocaleString()} total, ${donationCount} gifts). Consider inviting them to an exclusive donor appreciation event or proposing a naming opportunity.`,
      action: 'Upgrade Cultivation Strategy',
      howTo: 'Add a task to send a personal invitation to your next donor event. Track their response in the task notes.',
    });
  }

  // Check for recent donors
  if (donationCount === 1 && lastDonationDaysAgo && lastDonationDaysAgo <= 30) {
    recommendations.push({
      priority: 'high',
      category: 'New Donor Onboarding',
      message: `🎉 ${donor.name} just made their first donation! Critical 30-day window: Send a warm welcome email and impact story. First-time donor experience determines 70% of retention.`,
      action: 'Send Welcome Package',
      howTo: 'Use Send Thank You button now, then create a 2-week follow-up task to share an impact report.',
    });
  }

  // Check for growing donors
  if (donationCount >= 2) {
    const recentDonation = donor.donations[0].amount;
    const previousDonation = donor.donations[1].amount;
    if (recentDonation > previousDonation * 1.5) {
      recommendations.push({
        priority: 'high',
        category: 'Giving Growth',
        message: `📈 ${donor.name} increased their donation from $${previousDonation.toLocaleString()} to $${recentDonation.toLocaleString()} (+${Math.round((recentDonation/previousDonation - 1) * 100)}%)! Acknowledge their growing commitment immediately.`,
        action: 'Celebrate Their Growth',
        howTo: 'Send a personalized thank you highlighting the specific impact of their increased gift. Create a task to explore monthly giving.',
      });
    } else if (recentDonation > previousDonation) {
      recommendations.push({
        priority: 'medium',
        category: 'Giving Growth',
        message: `💚 ${donor.name} increased their donation from $${previousDonation.toLocaleString()} to $${recentDonation.toLocaleString()}. Great sign of deepening commitment!`,
        action: 'Acknowledge Increased Giving',
        howTo: 'Send thank you message and create a task to propose a giving level upgrade next quarter.',
      });
    }
  }

  // Check for consistent donors
  if (donationCount >= 3 && lastDonationDaysAgo && lastDonationDaysAgo <= 90) {
    const avgDonation = totalDonations / donationCount;
    recommendations.push({
      priority: 'medium',
      category: 'Loyal Supporter',
      message: `🏆 ${donor.name} is a consistent supporter (${donationCount} gifts, avg $${Math.round(avgDonation)}). Perfect candidate for monthly sustainer program. Monthly donors give 42% more annually!`,
      action: 'Propose Monthly Giving',
      howTo: 'Create a task to send monthly giving proposal. Use Campaigns page to show them their total impact.',
    });
  }

  // Check for campaign affinity
  if (donationCount >= 2) {
    const campaigns = donor.donations.map(d => d.campaign?.name).filter(Boolean);
    const uniqueCampaigns = new Set(campaigns);
    if (campaigns.length > 0 && uniqueCampaigns.size === 1) {
      recommendations.push({
        priority: 'medium',
        category: 'Campaign Affinity',
        message: `🎯 ${donor.name} only gives to "${campaigns[0]}" campaigns. They have a clear passion area! Target similar campaigns for higher conversion.`,
        action: 'Campaign-Specific Outreach',
        howTo: 'When launching similar campaigns, prioritize them in your outreach. Track campaign preferences in task notes.',
      });
    }
  }

  // Seasonal giving pattern
  if (donationCount >= 2) {
    const months = donor.donations.map(d => new Date(d.date).getMonth());
    const decemberGifts = months.filter(m => m === 11).length;
    if (decemberGifts >= donationCount * 0.5) {
      recommendations.push({
        priority: 'low',
        category: 'Giving Pattern',
        message: `🎄 ${donor.name} is a year-end giver (${decemberGifts}/${donationCount} gifts in December). Plan special year-end appeal for them in Q4.`,
        action: 'Year-End Campaign Targeting',
        howTo: 'Create a task in October to send them early year-end campaign preview and tax benefit info.',
      });
    }
  }

  // Default positive engagement
  if (recommendations.length === 0 && donationCount > 0 && lastDonationDaysAgo && lastDonationDaysAgo <= 90) {
    recommendations.push({
      priority: 'low',
      category: 'Regular Engagement',
      message: `✅ ${donor.name} is actively engaged. Continue regular updates and impact stories to maintain this healthy relationship.`,
      action: 'Maintain Regular Contact',
      howTo: 'Send quarterly impact updates. Use the Campaigns page to track their interests and tailor communications.',
    });
  }

  // If truly no donations yet
  if (donationCount === 0) {
    recommendations.push({
      priority: 'medium',
      category: 'Prospect Cultivation',
      message: `🌱 ${donor.name} is a prospect with no donations yet. Nurture the relationship with mission stories and low-barrier engagement opportunities.`,
      action: 'Prospect Cultivation Strategy',
      howTo: 'Create a task to invite them to a tour or volunteer opportunity. Use Donations page to record their first gift when it comes.',
    });
  }

  return [...recommendations, ...systemTips];
}
