import prisma from '@/lib/prisma';
import CampaignsClient from './CampaignsClient';

export const dynamic = 'force-dynamic';

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    include: {
      donations: true,
    },
  });

  return <CampaignsClient initialCampaigns={campaigns} />;
}
