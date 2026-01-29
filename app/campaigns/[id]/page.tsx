import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import CampaignDetailsClient from './CampaignDetailsClient';

export const dynamic = 'force-dynamic';

export default async function CampaignDetailsPage({ params }: { params: { id: string } }) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: params.id },
    include: {
      donations: {
        include: {
          donor: true,
        },
        orderBy: {
          date: 'desc',
        },
      },
      user: {
        select: {
          username: true,
          email: true,
        },
      },
    },
  });

  if (!campaign) {
    notFound();
  }

  // Serialize dates for client component
  const serializedCampaign = {
    ...campaign,
    startDate: campaign.startDate.toISOString(),
    endDate: campaign.endDate.toISOString(),
    donations: campaign.donations.map((donation) => ({
      ...donation,
      date: donation.date.toISOString(),
    })),
  };

  return <CampaignDetailsClient campaign={serializedCampaign} />;
}
