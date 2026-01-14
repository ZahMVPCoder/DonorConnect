'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import AddDonationModal from '@/components/AddDonationModal';

interface Donor {
  id: string;
  name: string;
  email: string;
}

interface Donation {
  id: string;
  amount: number;
  date: string;
  donorId: string;
  campaignId: string | null;
  donor: Donor;
  campaign: { id: string; name: string } | null;
}

interface DonationAggregated {
  donor: Donor;
  donations: Donation[];
  totalAmount: number;
  totalGifts: number;
  riskLevel: string;
}

export default function DonationsList() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [aggregatedData, setAggregatedData] = useState<Map<string, DonationAggregated>>(new Map());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedDonor, setSelectedDonor] = useState<string>('All Donors');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await fetch('/api/donations');
      if (response.ok) {
        const data = await response.json();
        setDonations(data);
        aggregateDonationData(data);
      }
    } catch (error) {
      console.error('Failed to fetch donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const aggregateDonationData = (donationList: Donation[]) => {
    const map = new Map<string, DonationAggregated>();

    donationList.forEach((donation) => {
      const donorId = donation.donor.id;
      if (!map.has(donorId)) {
        map.set(donorId, {
          donor: donation.donor,
          donations: [],
          totalAmount: 0,
          totalGifts: 0,
          riskLevel: '',
        });
      }

      const data = map.get(donorId)!;
      data.donations.push(donation);
      data.totalAmount += donation.amount;
      data.totalGifts = data.donations.length;

      // Calculate risk level based on giving patterns
      const daysSinceLastGift = new Date().getTime() - new Date(data.donations[0].date).getTime();
      const daysSince = daysSinceLastGift / (1000 * 60 * 60 * 24);
      
      if (daysSince > 365) {
        data.riskLevel = 'High';
      } else if (daysSince > 180) {
        data.riskLevel = 'Medium';
      } else {
        data.riskLevel = 'Low';
      }
    });

    setAggregatedData(map);
  };

  const handleAddDonationSuccess = async () => {
    await fetchDonations();
    setSuccessMessage('✓ Donation has been successfully saved to the database!');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const handleDeleteDonation = async (donationId: string) => {
    if (!confirm('Are you sure you want to delete this donation?')) return;

    try {
      const response = await fetch(`/api/donations/${donationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchDonations();
        setSuccessMessage('✓ Donation has been deleted!');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 4000);
      }
    } catch (error) {
      console.error('Failed to delete donation:', error);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High':
        return '#f44336';
      case 'Medium':
        return '#ff9800';
      case 'Low':
        return '#4caf50';
      default:
        return '#999';
    }
  };

  const filteredData = Array.from(aggregatedData.values()).filter((item) => {
    const matchesSearch =
      item.donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.donor.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDonor =
      selectedDonor === 'All Donors' || item.donor.id === selectedDonor;

    return matchesSearch && matchesDonor;
  });

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loadingMessage}>Loading donations...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {showSuccessToast && (
        <div className={styles.successToast}>
          {successMessage}
        </div>
      )}

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Donations</h1>
          <p className={styles.subtitle}>View and manage all donations by donor</p>
        </div>
        <button
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Add Donation
        </button>
      </div>

      <AddDonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddDonationSuccess}
      />

      <div className={styles.filterSection}>
        <input
          type="text"
          placeholder="Search donors by name or email..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Donor Name</th>
              <th>Email</th>
              <th>Total Gifts</th>
              <th>Total Amount</th>
              <th>Risk Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.donor.id}>
                  <td>
                    <div className={styles.donorCell}>
                      <div className={styles.avatar}>{item.donor.name.charAt(0)}</div>
                      <span>{item.donor.name}</span>
                    </div>
                  </td>
                  <td>{item.donor.email}</td>
                  <td>
                    <span className={styles.badgeCount}>{item.totalGifts}</span>
                  </td>
                  <td>
                    <span className={styles.amount}>${item.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </td>
                  <td>
                    <span
                      className={styles.riskBadge}
                      style={{ color: getRiskColor(item.riskLevel), borderColor: getRiskColor(item.riskLevel) }}
                    >
                      {item.riskLevel}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Link
                        href={`/donors/${item.donor.id}`}
                        className={styles.actionLink}
                      >
                        View Profile
                      </Link>
                      <button
                        className={styles.deleteButton}
                        onClick={() => {
                          // Find the most recent donation for this donor to delete
                          const mostRecent = item.donations.sort(
                            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                          )[0];
                          handleDeleteDonation(mostRecent.id);
                        }}
                        title="Delete most recent donation"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={styles.noResults}>
                  {donations.length === 0 ? 'No donations yet. Add one to get started!' : 'No results found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {donations.length > 0 && (
        <div className={styles.summarySection}>
          <h3>Summary</h3>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <strong>Total Donations</strong>
              <p>{donations.length}</p>
            </div>
            <div className={styles.summaryItem}>
              <strong>Total Amount Raised</strong>
              <p>${donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className={styles.summaryItem}>
              <strong>Unique Donors</strong>
              <p>{aggregatedData.size}</p>
            </div>
            <div className={styles.summaryItem}>
              <strong>Average Gift Size</strong>
              <p>${(donations.reduce((sum, d) => sum + d.amount, 0) / donations.length).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
