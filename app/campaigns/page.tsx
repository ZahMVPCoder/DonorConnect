import prisma from '@/lib/prisma';
import CampaignsClient from './CampaignsClient';

export const dynamic = 'force-dynamic';

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    include: {
      donations: true,
    },
  });

  // Serialize dates for client component
  const serializedCampaigns = campaigns.map((campaign) => ({
    ...campaign,
    startDate: campaign.startDate.toISOString(),
    endDate: campaign.endDate.toISOString(),
    donations: campaign.donations.map((donation) => ({
      ...donation,
      date: donation.date.toISOString(),
    })),
  }));

  return <CampaignsClient initialCampaigns={serializedCampaigns} />;
}
