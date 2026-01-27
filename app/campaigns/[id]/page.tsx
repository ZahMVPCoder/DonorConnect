import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import styles from './page.module.css';

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

  const progress = Math.round((campaign.raised / campaign.goal) * 100);
  const donorCount = new Set(campaign.donations.map((d) => d.donorId)).size;
  const avgDonation = campaign.donations.length > 0 
    ? campaign.raised / campaign.donations.length 
    : 0;

  const daysRemaining = Math.ceil(
    (new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className={styles.container}>
      <Link href="/campaigns" className={styles.backLink}>
        ← Back to Campaigns
      </Link>

      {/* Campaign Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>{campaign.name}</h1>
          <span className={styles.statusBadge} data-status={campaign.status.toLowerCase()}>
            {campaign.status}
          </span>
        </div>
        
        <div className={styles.headerStats}>
          <div className={styles.mainStat}>
            <span className={styles.raised}>${campaign.raised.toLocaleString()}</span>
            <span className={styles.goal}> raised of ${campaign.goal.toLocaleString()} goal</span>
          </div>
          
          <div className={styles.progress}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <span className={styles.progressPercent}>{progress}%</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{donorCount}</span>
            <span className={styles.statLabel}>Donors</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>${Math.round(avgDonation).toLocaleString()}</span>
            <span className={styles.statLabel}>Avg. Donation</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{campaign.donations.length}</span>
            <span className={styles.statLabel}>Total Donations</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📅</div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>
              {daysRemaining > 0 ? daysRemaining : 0}
            </span>
            <span className={styles.statLabel}>Days Remaining</span>
          </div>
        </div>
      </div>

      {/* Campaign Details */}
      <div className={styles.detailsSection}>
        <h2 className={styles.sectionTitle}>Campaign Details</h2>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Start Date</span>
            <span className={styles.detailValue}>
              {new Date(campaign.startDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>End Date</span>
            <span className={styles.detailValue}>
              {new Date(campaign.endDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Campaign Owner</span>
            <span className={styles.detailValue}>{campaign.user.username}</span>
          </div>
          
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Status</span>
            <span className={styles.detailValue}>{campaign.status}</span>
          </div>
        </div>
      </div>

      {/* Recent Donations */}
      <div className={styles.donationsSection}>
        <h2 className={styles.sectionTitle}>Recent Donations</h2>
        
        {campaign.donations.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No donations yet for this campaign.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {campaign.donations.map((donation) => (
                  <tr key={donation.id}>
                    <td>
                      <Link href={`/donors/${donation.donor.id}`} className={styles.donorLink}>
                        {donation.donor.name}
                      </Link>
                    </td>
                    <td>{donation.donor.email}</td>
                    <td className={styles.amount}>
                      ${donation.amount.toLocaleString()}
                    </td>
                    <td>
                      {new Date(donation.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
