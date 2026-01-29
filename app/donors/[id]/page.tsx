import prisma from '@/lib/prisma';
import Link from 'next/link';
import DonorProfileClient from './DonorProfileClient';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

interface Params {
  id: string;
}

export default async function DonorProfilePage({ params }: { params: Params }) {
  const { id } = params;

  const donor = await prisma.donor.findUnique({
    where: { id },
    include: {
      donations: {
        include: {
          campaign: true,
        },
        orderBy: {
          date: 'desc',
        },
      },
      tasks: {
        orderBy: {
          dueDate: 'asc',
        },
      },
    },
  });

  if (!donor) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h1>Donor Not Found</h1>
          <p>The donor you're looking for doesn't exist.</p>
          <Link href="/donors" className={styles.backLink}>
            Back to Donors
          </Link>
        </div>
      </div>
    );
  }

  // Serialize dates for client component
  const serializedDonor = {
    ...donor,
    createdAt: donor.createdAt.toISOString(),
    updatedAt: donor.updatedAt.toISOString(),
    donations: donor.donations.map((donation) => ({
      ...donation,
      date: donation.date.toISOString(),
      createdAt: donation.createdAt.toISOString(),
      updatedAt: donation.updatedAt.toISOString(),
    })),
    tasks: donor.tasks.map((task) => ({
      ...task,
      dueDate: task.dueDate.toISOString(),
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    })),
  };

  return <DonorProfileClient donor={serializedDonor} />;
}
