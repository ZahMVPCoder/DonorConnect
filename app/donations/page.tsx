'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

interface Donor {
  id: string;
  name: string;
  email: string;
}

interface Campaign {
  id: string;
  name: string;
}

export default function LogDonationPage() {
  const router = useRouter();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    donorId: '',
    campaignId: '',
    amount: '',
    message: '',
  });

  // Fetch donors and campaigns
  useEffect(() => {
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

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      // Validate form
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
          message: formData.message || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to log donation');
        setSubmitting(false);
        return;
      }

      setSuccess('Donation logged successfully!');
      // Reset form
      setFormData({
        donorId: '',
        campaignId: '',
        amount: '',
        message: '',
      });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingMessage}>Loading donors and campaigns...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Log a Donation</h1>
        <p className={styles.subtitle}>Record a new donation to your fundraising campaigns</p>
      </div>

      <div className={styles.formWrapper}>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

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
            <label htmlFor="message">Note (Optional)</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Add a note about this donation (e.g., 'In honor of...')"
              rows={4}
              className={styles.textarea}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton} disabled={submitting}>
              {submitting ? 'Logging Donation...' : 'Log Donation'}
            </button>
            <Link href="/" className={styles.cancelButton}>
              Cancel
            </Link>
          </div>
        </form>

        <div className={styles.infoBox}>
          <h3>💡 Tips</h3>
          <ul>
            <li>Select the donor who made the donation</li>
            <li>Choose which campaign this donation supports</li>
            <li>Enter the donation amount in USD</li>
            <li>Add optional notes for future reference</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
