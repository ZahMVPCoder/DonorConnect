import prisma from '@/lib/prisma';
import Link from 'next/link';
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

  const totalGiving = donor.donations.reduce((sum: number, d: any) => sum + d.amount, 0);
  const donationCount = donor.donations.length;
  const lastDonationDate = donor.donations.length > 0 ? new Date(donor.donations[0].date) : null;

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'Active': '#4caf50',
      'Lapsed': '#ff9800',
      'Prospect': '#2196f3',
    };
    return colorMap[status] || '#999';
  };

  return (
    <div className={styles.container}>
      <Link href="/donors" className={styles.backLink}>
        ← Back to Donors
      </Link>

      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div className={styles.profileInfo}>
          <div className={styles.avatar}>{donor.name.charAt(0)}</div>
          <div>
            <h1 className={styles.name}>{donor.name}</h1>
            <p className={styles.email}>{donor.email}</p>
            <span
              className={styles.status}
              style={{ backgroundColor: getStatusColor(donor.status) }}
            >
              {donor.status}
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <h3>Total Giving</h3>
          <p className={styles.metricValue}>${totalGiving.toLocaleString()}</p>
        </div>
        <div className={styles.metricCard}>
          <h3>Number of Donations</h3>
          <p className={styles.metricValue}>{donationCount}</p>
        </div>
        <div className={styles.metricCard}>
          <h3>Last Donation</h3>
          <p className={styles.metricValue}>
            {lastDonationDate ? lastDonationDate.toISOString().split('T')[0] : 'Never'}
          </p>
        </div>
        <div className={styles.metricCard}>
          <h3>Member Since</h3>
          <p className={styles.metricValue}>
            {new Date(donor.createdAt).toISOString().split('T')[0]}
          </p>
        </div>
      </div>

      {/* Donation History */}
      <div className={styles.section}>
        <h2>Donation History</h2>
        {donor.donations.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Campaign</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {donor.donations.map((donation: any) => (
                  <tr key={donation.id}>
                    <td>{new Date(donation.date).toISOString().split('T')[0]}</td>
                    <td>{donation.campaign?.name || 'General'}</td>
                    <td className={styles.amount}>${donation.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={styles.noData}>No donations recorded yet.</p>
        )}
      </div>

      {/* Tasks */}
      <div className={styles.section}>
        <h2>Related Tasks</h2>
        {donor.tasks.length > 0 ? (
          <div className={styles.tasksList}>
            {donor.tasks.map((task: any) => (
              <div key={task.id} className={styles.taskCard}>
                <div>
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                  <p className={styles.taskDate}>
                    Due: {new Date(task.dueDate).toISOString().split('T')[0]}
                  </p>
                </div>
                <div className={styles.taskMeta}>
                  <span className={styles.priority}>{task.priority}</span>
                  <span className={styles.taskStatus}>{task.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noData}>No tasks assigned to this donor.</p>
        )}
      </div>
    </div>
  );
}
