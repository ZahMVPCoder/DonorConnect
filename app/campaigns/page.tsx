import Link from 'next/link';
import prisma from '@/lib/prisma';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    include: {
      donations: true,
    },
  });

  const stats = {
    totalGoal: campaigns.reduce((sum: number, c: any) => sum + c.goal, 0),
    totalRaised: campaigns.reduce((sum: number, c: any) => sum + c.raised, 0),
    totalDonors: new Set(
      campaigns.flatMap((c: any) => c.donations.map((d: any) => d.donorId))
    ).size,
    avgDonation:
      campaigns.length > 0
        ? campaigns.reduce((sum: number, c: any) => sum + c.raised, 0) /
          campaigns.flatMap((c: any) => c.donations).length
        : 0,
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Campaigns</h1>
      <p className={styles.subtitle}>Track fundraising campaigns and goal progress</p>

      {/* Campaign Cards */}
      <div className={styles.campaignsGrid}>
        {campaigns.map((campaign: any) => {
          const progress = Math.round((campaign.raised / campaign.goal) * 100);
          const donorCount = new Set(
            campaign.donations.map((d: any) => d.donorId)
          ).size;

          return (
            <div key={campaign.id} className={styles.campaignCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.campaignName}>{campaign.name}</h3>
                <span className={styles.statusBadge}>{campaign.status}</span>
              </div>

              <div className={styles.progress}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className={styles.progressPercent}>{progress}%</span>
              </div>

              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.label}>Raised</span>
                  <span className={styles.value}>
                    ${campaign.raised.toLocaleString()}
                  </span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.label}>Goal</span>
                  <span className={styles.value}>
                    ${campaign.goal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className={styles.details}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Donors</span>
                  <span className={styles.detailValue}>{donorCount}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>End Date</span>
                  <span className={styles.detailValue}>
                    {new Date(campaign.endDate).toISOString().split('T')[0]}
                  </span>
                </div>
              </div>

              <Link href={`/campaigns/${campaign.id}`} className={styles.viewDetailsButton}>
                View Details
              </Link>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className={styles.summarySection}>
        <h2 className={styles.summaryTitle}>Campaign Summary</h2>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <h4>Total Goal</h4>
            <p className={styles.summaryValue}>
              ${stats.totalGoal.toLocaleString()}
            </p>
          </div>
          <div className={styles.summaryCard}>
            <h4>Total Raised</h4>
            <p className={styles.summaryValue}>
              ${stats.totalRaised.toLocaleString()}
            </p>
          </div>
          <div className={styles.summaryCard}>
            <h4>Total Donors</h4>
            <p className={styles.summaryValue}>{stats.totalDonors}</p>
          </div>
          <div className={styles.summaryCard}>
            <h4>Avg. Donation</h4>
            <p className={styles.summaryValue}>
              ${Math.round(stats.avgDonation).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Campaign Donations */}
      <div className={styles.recentDonationsSection}>
        <h2 className={styles.sectionTitle}>Recent Campaign Donations</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Donor</th>
                <th>Amount</th>
                <th>Campaign</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {campaigns
                .flatMap((campaign: any) =>
                  campaign.donations.map((donation: any) => ({
                    ...donation,
                    campaignName: campaign.name,
                  }))
                )
                .sort(
                  (a: any, b: any) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .slice(0, 5)
                .map((donation: any, idx: number) => (
                  <tr key={idx}>
                    <td>John Smith</td>
                    <td>${donation.amount.toLocaleString()}</td>
                    <td>{donation.campaignName}</td>
                    <td>{new Date(donation.date).toISOString().split('T')[0]}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
