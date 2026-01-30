'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import AddDonorModal from '@/components/AddDonorModal';

interface Donor {
  id: string;
  name: string;
  email: string;
  status: string;
  totalGiving: number;
  lastGift: number | null;
  donations: any[];
}

interface DonorsClientProps {
  initialDonors: Donor[];
}

export default function DonorsClient({ initialDonors }: DonorsClientProps) {
  const [donors, setDonors] = useState(initialDonors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const losingThresholdDays = 150;

  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'Active': '#4caf50',
      'Lapsed': '#ff9800',
      'Major': '#2196f3',
      'Losing': '#f59e0b',
    };
    return statusMap[status] || '#999';
  };

  const getDerivedStatus = (donor: Donor) => {
    if (donor.lastGift) {
      const daysSinceLastGift = Math.floor(
        (Date.now() - donor.lastGift) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceLastGift > losingThresholdDays) return 'Losing';
    }
    if (donor.status === 'Prospect') return 'Losing';
    return donor.status;
  };

  const handleDeleteDonor = async (donorId: string, donorName: string) => {
    if (!confirm(`Are you sure you want to delete ${donorName}? This will also delete all their donations and tasks.`)) {
      return;
    }

    setDeletingId(donorId);
    try {
      const response = await fetch(`/api/donors/${donorId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDonors(donors.filter(d => d.id !== donorId));
      } else {
        const error = await response.json();
        alert(`Failed to delete donor: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting donor:', error);
      alert('Failed to delete donor. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredDonors = donors.filter((donor) => {
    const matchesSearch =
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'All Status' || getDerivedStatus(donor) === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleAddDonorSuccess = async () => {
    // Refresh the donors list
    try {
      const response = await fetch('/api/donors?all=true');
      if (response.ok) {
        const updatedDonors = await response.json();
        // Calculate totals for new donors
        const donorsWithTotals = updatedDonors.map((donor: any) => ({
          ...donor,
          totalGiving: 0,
          lastGift: null,
          donations: [],
        }));
        setDonors(donorsWithTotals);
      }
    } catch (error) {
      console.error('Failed to refresh donors:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Donors</h1>
          <p className={styles.subtitle}>Manage your donor relationships</p>
        </div>
        <button
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Add Donor
        </button>
      </div>

      <AddDonorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddDonorSuccess}
      />

      <div className={styles.filterSection}>
        <input
          type="text"
          placeholder="Search donors by name or email..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className={styles.filterSelect}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Lapsed</option>
          <option>Losing</option>
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Donor</th>
              <th>Last Gift</th>
              <th>Total Giving</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonors.length > 0 ? (
              filteredDonors.map((donor) => {
                const derivedStatus = getDerivedStatus(donor);
                return (
                <tr key={donor.id}>
                  <td>
                    <div className={styles.donorCell}>
                      <div className={styles.avatar}>{donor.name.charAt(0)}</div>
                      <div>
                        <p className={styles.donorName}>{donor.name}</p>
                        <p className={styles.email}>{donor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {donor.lastGift ? (
                      <>
                        <p className={styles.amount}>
                          ${donor.donations
                            .find(
                              (d: any) =>
                                new Date(d.date).getTime() === donor.lastGift
                            )
                            ?.amount.toLocaleString()}
                        </p>
                        <p className={styles.date}>
                          {new Date(donor.lastGift).toISOString().split('T')[0]}
                        </p>
                      </>
                    ) : (
                      <p className={styles.noData}>No donations</p>
                    )}
                  </td>
                  <td>
                    <span className={styles.totalGiving}>
                      ${donor.totalGiving.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span
                      className={styles.statusBadge}
                      style={{ color: getStatusColor(derivedStatus) }}
                    >
                      {derivedStatus}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <Link
                        href={`/donors/${donor.id}`}
                        className={styles.actionLink}
                      >
                        View Profile
                      </Link>
                      <button
                        onClick={() => handleDeleteDonor(donor.id, donor.name)}
                        disabled={deletingId === donor.id}
                        className={styles.deleteButton}
                        title="Delete donor"
                      >
                        {deletingId === donor.id ? '...' : '🗑️'}
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className={styles.noResults}>
                  No donors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
