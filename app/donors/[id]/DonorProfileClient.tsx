'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface Donation {
  id: string;
  amount: number;
  date: string;
  campaign: { id: string; name: string } | null;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  priority: string;
  status: string;
}

interface Donor {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  donations: Donation[];
  tasks: Task[];
}

interface DonorProfileClientProps {
  donor: Donor;
}

export default function DonorProfileClient({ donor }: DonorProfileClientProps) {
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);

  const totalGiving = donor.donations.reduce((sum, d) => sum + d.amount, 0);
  const donationCount = donor.donations.length;
  const lastDonationDate = donor.donations.length > 0 ? new Date(donor.donations[0].date) : null;
  const losingThresholdDays = 150;
  const daysSinceLastDonation = lastDonationDate
    ? Math.floor((Date.now() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const derivedStatus = daysSinceLastDonation !== null && daysSinceLastDonation > losingThresholdDays
    ? 'Losing'
    : donor.status === 'Prospect'
      ? 'Losing'
      : donor.status;

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'Active': '#4caf50',
      'Lapsed': '#ff9800',
      'Losing': '#f59e0b',
    };
    return colorMap[status] || '#999';
  };

  const handleSendThankYou = () => {
    setShowThankYouMessage(true);
    setTimeout(() => setShowThankYouMessage(false), 4000);
  };

  return (
    <div className={styles.container}>
      {showThankYouMessage && (
        <div className={styles.thankYouToast}>
          ✓ Thank you email sent to {donor.name}! Message: "Thank you {donor.name} for donating, your contribution will positively affect our cost!"
        </div>
      )}

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
              style={{ backgroundColor: getStatusColor(derivedStatus) }}
            >
              {derivedStatus}
            </span>
            <div className={styles.metaBadges}>
              <span className={styles.metaBadge}>Last contacted: —</span>
              <span className={styles.metaBadge}>Next follow-up: —</span>
            </div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={handleSendThankYou}
            className={styles.thankYouButton}
            title="Send thank you message"
          >
            📧 Send Thank You
          </button>
          <Link href={`/donors/${donor.id}/insights`} className={styles.insightsButton}>
            🤖 AI Insights
          </Link>
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
                {donor.donations.map((donation) => (
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
            {donor.tasks.map((task) => (
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
