
import prisma from '@/lib/prisma';
import styles from './page.module.css';
import Link from 'next/link';
import DonorsList from './DonorsList';

export const dynamic = 'force-dynamic';

export default async function DonorsPage() {
  const donors = await prisma.donor.findMany({
    include: {
      donations: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const donorsWithTotal = donors.map((donor: any) => ({
    ...donor,
    totalGiving: donor.donations.reduce((sum: number, d: any) => sum + d.amount, 0),
    lastGift: donor.donations.length > 0
      ? Math.max(...donor.donations.map((d: any) => new Date(d.date).getTime()))
      : null,
  }));

  return (
    <DonorsList initialDonors={donorsWithTotal} />
  );
}

