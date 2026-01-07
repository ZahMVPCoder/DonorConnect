import prisma from '@/lib/prisma';
import styles from './page.module.css';
import Link from 'next/link';

export default async function Dashboard() {
  const donations = await prisma.donation.findMany({
    include: { donor: true, campaign: true },
    orderBy: { date: 'desc' },
    take: 3,
  });

  const tasks = await prisma.task.findMany({
    where: { status: 'Pending' },
    include: { donor: true },
    orderBy: { dueDate: 'asc' },
    take: 3,
  });

  const totalRaised = await prisma.donation.aggregate({
    _sum: { amount: true },
  });

  const campaigns = await prisma.campaign.findMany();
  const totalGoal = campaigns.reduce((sum: number, c: any) => sum + c.goal, 0);
  const totalCampaignRaised = campaigns.reduce((sum: number, c: any) => sum + c.raised, 0);

  const newDonorsThisMonth = await prisma.donor.count({
    where: {
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
  });

  const lapsedDonors = await prisma.donor.count({
    where: { status: 'Lapsed' },
  });

  const goalProgress = Math.round((totalCampaignRaised / totalGoal) * 100);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>
      <p className={styles.subtitle}>Overview of donor engagement and fundraising progress</p>

      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <h3>Total Raised This Month</h3>
          <p className={styles.metricValue}>${totalRaised._sum.amount?.toLocaleString() || 0}</p>
          <span className={styles.trend}>+15%</span>
        </div>
        <div className={styles.metricCard}>
          <h3>Goal Progress</h3>
          <p className={styles.metricValue}>{goalProgress}%</p>
          <p className={styles.metricSubtext}>of ${totalGoal.toLocaleString()}</p>
        </div>
        <div className={styles.metricCard}>
          <h3>New Donors</h3>
          <p className={styles.metricValue}>{newDonorsThisMonth}</p>
          <p className={styles.metricSubtext}>this month</p>
        </div>
        <div className={styles.metricCard}>
          <h3>Lapsed Donors</h3>
          <p className={styles.metricValue}>{lapsedDonors}</p>
          <p className={styles.metricSubtext}>needs follow-up</p>
        </div>
      </div>

      {/* Recent Donations & Upcoming Tasks */}
      <div className={styles.twoColumnLayout}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Recent Donations</h2>
            <Link href="/donations" className={styles.button}>
              Log Donation
            </Link>
          </div>
          <div className={styles.donationsList}>
            {donations.map((donation: any) => (
              <div key={donation.id} className={styles.donationItem}>
                <div>
                  <p className={styles.donorName}>{donation.donor.name}</p>
                  <p className={styles.campaignName}>{donation.campaign?.name || 'General'}</p>
                </div>
                <div className={styles.donationAmount}>
                  <span>${donation.amount}</span>
                  <span className={styles.donationDate}>
                    {new Date(donation.date).toISOString().split('T')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Upcoming Tasks</h2>
            <Link href="/tasks" className={styles.viewAllLink}>
              View All
            </Link>
          </div>
          <div className={styles.tasksList}>
            {tasks.map((task: any) => (
              <div key={task.id} className={styles.taskItem}>
                <div>
                  <p className={styles.taskTitle}>{task.title}</p>
                  <span className={styles.taskDate}>
                    {new Date(task.dueDate).toISOString().split('T')[0]}
                  </span>
                </div>
                <span className={`${styles.priority} ${styles[task.priority.toLowerCase()]}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
