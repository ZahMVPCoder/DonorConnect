'use client';

import { useState } from 'react';
import styles from './AddCampaignModal.module.css';

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

interface AddCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (campaign: Campaign) => void;
}

export default function AddCampaignModal({ isOpen, onClose, onSuccess }: AddCampaignModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'Active',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      if (!formData.name || !formData.goal || !formData.startDate || !formData.endDate) {
        setError('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      const goal = parseFloat(formData.goal);
      if (isNaN(goal) || goal <= 0) {
        setError('Goal must be a positive number');
        setSubmitting(false);
        return;
      }

      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setError('Please enter valid dates');
        setSubmitting(false);
        return;
      }

      if (end < start) {
        setError('End date must be after start date');
        setSubmitting(false);
        return;
      }

      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          goal,
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create campaign');
        setSubmitting(false);
        return;
      }

      const newCampaign: Campaign = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        donations: data.donations || [],
      };

      setSuccess(`✓ Campaign "${formData.name}" has been created successfully!`);
      setFormData({
        name: '',
        goal: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'Active',
      });

      setTimeout(() => {
        onSuccess(newCampaign);
        onClose();
      }, 1200);
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
          <h2>Create Campaign</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">
              Campaign Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Spring Appeal"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="goal">
              Fundraising Goal <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="0"
              min="1"
              step="0.01"
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="startDate">
                Start Date <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="endDate">
                End Date <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
            </select>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}