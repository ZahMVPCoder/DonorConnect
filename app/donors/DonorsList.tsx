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

interface DonorsListProps {
  initialDonors: Donor[];
}

export default function DonorsList({ initialDonors }: DonorsListProps) {
  const [donors, setDonors] = useState(initialDonors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'Active': '#4caf50',
      'Lapsed': '#ff9800',
      'Major': '#2196f3',
    };
    return statusMap[status] || '#999';
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
        setSuccessMessage(`✓ ${donorName} has been deleted successfully!`);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 4000);
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
      filterStatus === 'All Status' || donor.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleAddDonorSuccess = async () => {
    // Refresh the donors list
    try {
      const response = await fetch('/api/donors?all=true');
      if (response.ok) {
        const updatedDonors = await response.json();
        // Calculate totals for all donors
        const donorsWithTotals = updatedDonors.map((donor: any) => ({
          ...donor,
          totalGiving: donor.donations.reduce((sum: number, d: any) => sum + d.amount, 0),
          lastGift: donor.donations.length > 0
            ? Math.max(...donor.donations.map((d: any) => new Date(d.date).getTime()))
            : null,
        }));
        setDonors(donorsWithTotals);
        
        // Show success toast
        setSuccessMessage(`✓ Donor has been successfully saved to the database!`);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 4000);
      }
    } catch (error) {
      console.error('Failed to refresh donors:', error);
    }
  };

  return (
    <div className={styles.container}>
      {showSuccessToast && (
        <div className={styles.successToast}>
          {successMessage}
        </div>
      )}
      
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
          <option>Prospect</option>
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
              filteredDonors.map((donor) => (
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
                      style={{ color: getStatusColor(donor.status) }}
                    >
                      {donor.status}
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
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.noResults}>
                  {searchTerm || filterStatus !== 'All Status' ? (
                    'No donors found matching your filters'
                  ) : (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}>👥</div>
                      <h3>No donors yet</h3>
                      <p>Click the "+ Add Donor" button above to add your first donor</p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
