'use client';

import { useState, useEffect } from 'react';
import styles from './AddDonationModal.module.css';

interface Donor {
  id: string;
  name: string;
  email: string;
}

interface Campaign {
  id: string;
  name: string;
}

interface AddDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddDonationModal({ isOpen, onClose, onSuccess }: AddDonationModalProps) {
  const [formData, setFormData] = useState({
    donorId: '',
    campaignId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [donors, setDonors] = useState<Donor[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      const [donorsRes, campaignsRes] = await Promise.all([
        fetch('/api/donors'),
        fetch('/api/campaigns'),
      ]);

      if (donorsRes.ok && campaignsRes.ok) {
        const donorsData = await donorsRes.json();
        const campaignsData = await campaignsRes.json();
        setDonors(donorsData);
        setCampaigns(campaignsData);
      }
    } catch (err) {
      setError('Failed to load donors and campaigns');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (!formData.donorId || !formData.campaignId || !formData.amount) {
        setError('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        setError('Amount must be a positive number');
        setSubmitting(false);
        return;
      }

      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: formData.donorId,
          campaignId: formData.campaignId,
          amount: amount,
          date: formData.date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to add donation');
        setSubmitting(false);
        return;
      }

      // Get donor name for success message
      const donorName = donors.find(d => d.id === formData.donorId)?.name || 'Donor';

      setSuccess(`✓ Donation of $${amount.toFixed(2)} from "${donorName}" has been successfully added!`);
      setFormData({
        donorId: '',
        campaignId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
      });

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Add New Donation</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {loading ? (
          <div className={styles.loading}>Loading donors and campaigns...</div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="donorId">
                Donor <span className={styles.required}>*</span>
              </label>
              <select
                id="donorId"
                name="donorId"
                value={formData.donorId}
                onChange={handleChange}
                required
                className={styles.input}
              >
                <option value="">Select a donor...</option>
                {donors.map((donor) => (
                  <option key={donor.id} value={donor.id}>
                    {donor.name} ({donor.email})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="campaignId">
                Campaign <span className={styles.required}>*</span>
              </label>
              <select
                id="campaignId"
                name="campaignId"
                value={formData.campaignId}
                onChange={handleChange}
                required
                className={styles.input}
              >
                <option value="">Select a campaign...</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="amount">
                Amount (USD) <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="date">
                Date <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.submitButton} disabled={submitting}>
                {submitting ? 'Adding Donation...' : 'Add Donation'}
              </button>
              <button type="button" className={styles.cancelButton} onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
