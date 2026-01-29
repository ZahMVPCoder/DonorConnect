'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

interface Donation {
  id: string;
  amount: number;
  date: string;
  donor: {
    id: string;
    name: string;
    email: string;
  };
}

interface Campaign {
  id: string;
  name: string;
  status: string;
  goal: number;
  raised: number;
  startDate: string;
  endDate: string;
  donations: Donation[];
  user: {
    username: string;
    email: string;
  };
}

interface CampaignDetailsClientProps {
  campaign: Campaign;
}

export default function CampaignDetailsClient({ campaign: initialCampaign }: CampaignDetailsClientProps) {
  const router = useRouter();
  const [campaign, setCampaign] = useState(initialCampaign);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState('');

  const progress = Math.round((campaign.raised / campaign.goal) * 100);
  const donorCount = new Set(campaign.donations.map((d) => d.donorId)).size;
  const avgDonation = campaign.donations.length > 0 
    ? campaign.raised / campaign.donations.length 
    : 0;

  const daysRemaining = Math.ceil(
    (new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const showToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const handleMarkComplete = async () => {
    if (!confirm('Mark this campaign as complete?')) return;

    try {
      const response = await fetch(`/api/campaigns/${campaign.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' }),
      });

      if (response.ok) {
        setCampaign({ ...campaign, status: 'Completed' });
        showToast('✓ Campaign marked as complete!');
      }
    } catch (error) {
      console.error('Failed to update campaign:', error);
    }
  };

  const handleDeleteCampaign = async () => {
    if (!confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/campaigns/${campaign.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast('✓ Campaign deleted! Redirecting...');
        setTimeout(() => router.push('/campaigns'), 1500);
      }
    } catch (error) {
      console.error('Failed to delete campaign:', error);
    }
  };

  const handleAdjustRaised = async () => {
    if (!adjustAmount) return;

    const amount = parseFloat(adjustAmount);
    if (isNaN(amount)) {
      alert('Please enter a valid number');
      return;
    }

    const newRaised = campaign.raised + amount;
    if (newRaised < 0) {
      alert('Raised amount cannot be negative');
      return;
    }

    try {
      const response = await fetch(`/api/campaigns/${campaign.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raised: newRaised }),
      });

      if (response.ok) {
        setCampaign({ ...campaign, raised: newRaised });
        showToast(`✓ Campaign amount ${amount > 0 ? 'increased' : 'decreased'} by $${Math.abs(amount).toLocaleString()}!`);
        setShowAdjustModal(false);
      }
    } catch (error) {
      console.error('Failed to adjust campaign:', error);
    }
  };

  return (
    <div className={styles.container}>
      {showSuccessToast && (
        <div className={styles.successToast}>
          {successMessage}
        </div>
      )}

      {showAdjustModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAdjustModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Adjust Raised Amount</h2>
            <p>Campaign: {campaign.name}</p>
            <p>Current: ${campaign.raised.toLocaleString()}</p>
            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                Enter amount to add (use negative for subtraction):
              </label>
              <input
                type="number"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                placeholder="e.g., 500 or -100"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '16px'
                }}
              />
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                onClick={handleAdjustRaised}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Confirm
              </button>
              <button
                onClick={() => setShowAdjustModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button
            onClick={() => setShowAdjustModal(true)}
            className={styles.adjustButton}
          >
            Adjust Amount
          </button>
          {campaign.status !== 'Completed' && (
            <button
              onClick={handleMarkComplete}
              className={styles.completeButton}
            >
              Mark as Complete
            </button>
          )}
          <button
            onClick={handleDeleteCampaign}
            className={styles.deleteButton}
          >
            Delete Campaign
          </button>
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
