'use client';

import { useState } from 'react';
import styles from './AddDonorModal.module.css';

interface AddDonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddDonorModal({ isOpen, onClose, onSuccess }: AddDonorModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'Active',
    lastGiftAmount: '',
    totalGiving: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      if (!formData.name || !formData.email) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Validate numeric fields if provided
      if (formData.lastGiftAmount && isNaN(Number(formData.lastGiftAmount))) {
        setError('Last gift amount must be a valid number');
        setLoading(false);
        return;
      }
      if (formData.totalGiving && isNaN(Number(formData.totalGiving))) {
        setError('Total giving must be a valid number');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          lastGiftAmount: formData.lastGiftAmount ? Number(formData.lastGiftAmount) : null,
          totalGiving: formData.totalGiving ? Number(formData.totalGiving) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to add donor');
        setLoading(false);
        return;
      }

      // Show success message
      setSuccess(`✓ Donor "${formData.name}" has been successfully added to your database!`);
      setFormData({ name: '', email: '', status: 'Active', lastGiftAmount: '', totalGiving: '' });
      
      // Wait 2 seconds, then close and refresh
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Add New Donor</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {success && <div className={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">
              Donor Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Smith"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">
              Email Address <span className={styles.required}>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Lapsed">Lapsed</option>
              <option value="Prospect">Prospect</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="totalGiving">Total Giving (Optional)</label>
            <input
              type="number"
              id="totalGiving"
              name="totalGiving"
              value={formData.totalGiving}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastGiftAmount">Last Gift Amount (Optional)</label>
            <input
              type="number"
              id="lastGiftAmount"
              name="lastGiftAmount"
              value={formData.lastGiftAmount}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Adding Donor...' : 'Add Donor'}
            </button>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
