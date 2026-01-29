'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface Campaign {
  id: string;
  name: string;
  status: string;
  goal: number;
  raised: number;
  startDate: string;
  endDate: string;
  donations: any[];
}

interface CampaignsClientProps {
  initialCampaigns: Campaign[];
}

export default function CampaignsClient({ initialCampaigns }: CampaignsClientProps) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');

  const stats = {
    totalGoal: campaigns.reduce((sum, c) => sum + c.goal, 0),
    totalRaised: campaigns.reduce((sum, c) => sum + c.raised, 0),
    totalDonors: new Set(
      campaigns.flatMap((c) => c.donations.map((d) => d.donorId))
    ).size,
    avgDonation:
      campaigns.length > 0
        ? campaigns.reduce((sum, c) => sum + c.raised, 0) /
          campaigns.flatMap((c) => c.donations).length
        : 0,
  };

  const showToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const handleMarkComplete = async (campaignId: string) => {
    if (!confirm('Mark this campaign as complete?')) return;

    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' }),
      });

      if (response.ok) {
        const updated = await response.json();
        setCampaigns(campaigns.map(c => c.id === campaignId ? { ...c, status: 'Completed' } : c));
        showToast('✓ Campaign marked as complete!');
      }
    } catch (error) {
      console.error('Failed to update campaign:', error);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCampaigns(campaigns.filter(c => c.id !== campaignId));
        showToast('✓ Campaign has been deleted!');
      }
    } catch (error) {
      console.error('Failed to delete campaign:', error);
    }
  };

  const openAdjustModal = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setAdjustAmount('');
    setShowAdjustModal(true);
  };

  const handleAdjustRaised = async () => {
    if (!selectedCampaign || !adjustAmount) return;

    const amount = parseFloat(adjustAmount);
    if (isNaN(amount)) {
      alert('Please enter a valid number');
      return;
    }

    const newRaised = selectedCampaign.raised + amount;
    if (newRaised < 0) {
      alert('Raised amount cannot be negative');
      return;
    }

    try {
      const response = await fetch(`/api/campaigns/${selectedCampaign.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raised: newRaised }),
      });

      if (response.ok) {
        setCampaigns(campaigns.map(c => 
          c.id === selectedCampaign.id ? { ...c, raised: newRaised } : c
        ));
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

      {showAdjustModal && selectedCampaign && (
        <div className={styles.modalOverlay} onClick={() => setShowAdjustModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Adjust Raised Amount</h2>
            <p>Campaign: {selectedCampaign.name}</p>
            <p>Current: ${selectedCampaign.raised.toLocaleString()}</p>
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

      <h1 className={styles.title}>Campaigns</h1>
      <p className={styles.subtitle}>Track fundraising campaigns and goal progress</p>

      {/* Campaign Cards */}
      <div className={styles.campaignsGrid}>
        {campaigns.map((campaign) => {
          const progress = Math.round((campaign.raised / campaign.goal) * 100);
          const donorCount = new Set(
            campaign.donations.map((d) => d.donorId)
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

              <div className={styles.campaignActions}>
                <Link href={`/campaigns/${campaign.id}`} className={styles.viewDetailsButton}>
                  View Details
                </Link>
                <button
                  onClick={() => openAdjustModal(campaign)}
                  className={styles.adjustButton}
                  title="Adjust raised amount"
                >
                  Adjust $
                </button>
                {campaign.status !== 'Completed' && (
                  <button
                    onClick={() => handleMarkComplete(campaign.id)}
                    className={styles.completeButton}
                    title="Mark as complete"
                  >
                    Complete
                  </button>
                )}
                <button
                  onClick={() => handleDeleteCampaign(campaign.id)}
                  className={styles.deleteButton}
                  title="Delete campaign"
                >
                  Delete
                </button>
              </div>
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
                .flatMap((campaign) =>
                  campaign.donations.map((donation) => ({
                    ...donation,
                    campaignName: campaign.name,
                  }))
                )
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .slice(0, 5)
                .map((donation, idx) => (
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
