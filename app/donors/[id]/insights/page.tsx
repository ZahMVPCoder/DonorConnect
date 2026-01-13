'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './insights.module.css';

interface DonorInsights {
  donor: {
    name: string;
    email: string;
    status: string;
  };
  metrics: {
    totalDonations: number;
    donationCount: number;
    averageDonation: number;
    lastDonationDate: string | null;
    lastDonationDaysAgo: number | null;
  };
  segment: string;
  donationHistory: Array<{ amount: number; date: string; campaign: string }>;
  upcomingTasks: Array<{ title: string; dueDate: string }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    message: string;
    action: string;
  }>;
}

export default function DonorInsights() {
  const params = useParams();
  const donorId = params?.id as string;
  const [insights, setInsights] = useState<DonorInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch('/api/ai/donor-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ donorId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch insights');
        }

        const data = await response.json();
        setInsights(data);
      } catch (err) {
        setError('Failed to load donor insights');
      } finally {
        setLoading(false);
      }
    };

    if (donorId) {
      fetchInsights();
    }
  }, [donorId]);

  if (loading) {
    return <div className={styles.container}>Loading insights...</div>;
  }

  if (error || !insights) {
    return <div className={styles.container}><div className={styles.error}>{error || 'Failed to load insights'}</div></div>;
  }

  return (
    <div className={styles.container}>
      <Link href="/donors" className={styles.backLink}>← Back to Donors</Link>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{insights.donor.name}</h1>
          <p className={styles.subtitle}>{insights.donor.email}</p>
        </div>
        <div className={styles.segmentBadge}>
          <span>{insights.segment}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <h3>Total Donations</h3>
          <div className={styles.metricValue}>${insights.metrics.totalDonations.toLocaleString()}</div>
          <p className={styles.metricSubtext}>{insights.metrics.donationCount} donations</p>
        </div>
        <div className={styles.metricCard}>
          <h3>Average Gift</h3>
          <div className={styles.metricValue}>${insights.metrics.averageDonation.toLocaleString()}</div>
          <p className={styles.metricSubtext}>per donation</p>
        </div>
        <div className={styles.metricCard}>
          <h3>Last Donation</h3>
          <div className={styles.metricValue}>
            {insights.metrics.lastDonationDaysAgo !== null ? `${insights.metrics.lastDonationDaysAgo} days ago` : 'Never'}
          </div>
          <p className={styles.metricSubtext}>
            {insights.metrics.lastDonationDate ? new Date(insights.metrics.lastDonationDate).toLocaleDateString() : 'N/A'}
          </p>
        </div>
        <div className={styles.metricCard}>
          <h3>Status</h3>
          <div className={styles.metricValue}>{insights.donor.status}</div>
          <p className={styles.metricSubtext}>current status</p>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className={styles.section}>
        <h2>🤖 AI-Powered Recommendations</h2>
        <div className={styles.recommendationsList}>
          {insights.recommendations.map((rec, idx) => (
            <div key={idx} className={`${styles.recommendationCard} ${styles[rec.priority]}`}>
              <div className={styles.recHeader}>
                <span className={styles.priorityBadge}>{rec.priority.toUpperCase()}</span>
                <span className={styles.action}>{rec.action}</span>
              </div>
              <p className={styles.message}>{rec.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Donation History */}
      <div className={styles.section}>
        <h2>Recent Donations</h2>
        <div className={styles.donationList}>
          {insights.donationHistory.map((donation, idx) => (
            <div key={idx} className={styles.donationItem}>
              <div>
                <div className={styles.donationAmount}>${donation.amount.toLocaleString()}</div>
                <div className={styles.donationCampaign}>{donation.campaign}</div>
              </div>
              <div className={styles.donationDate}>
                {new Date(donation.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Tasks */}
      {insights.upcomingTasks.length > 0 && (
        <div className={styles.section}>
          <h2>Upcoming Tasks</h2>
          <div className={styles.taskList}>
            {insights.upcomingTasks.map((task, idx) => (
              <div key={idx} className={styles.taskItem}>
                <div className={styles.taskTitle}>{task.title}</div>
                <div className={styles.taskDate}>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
