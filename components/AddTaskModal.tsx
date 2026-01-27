'use client';

import { useState, useEffect } from 'react';
import styles from './AddTaskModal.module.css';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTaskModal({ isOpen, onClose, onSuccess }: AddTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Follow-up',
    priority: 'Medium',
    dueDate: '',
    donorId: '',
  });
  const [donors, setDonors] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fetch donors for dropdown
      fetch('/api/donors')
        .then((res) => res.json())
        .then((data) => setDonors(data))
        .catch((err) => console.error('Failed to fetch donors:', err));
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      if (!formData.title || !formData.dueDate) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          donorId: formData.donorId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create task');
        setLoading(false);
        return;
      }

      // Show success message
      setSuccess(`✓ Task "${formData.title}" has been created successfully!`);
      setFormData({
        title: '',
        description: '',
        type: 'Follow-up',
        priority: 'Medium',
        dueDate: '',
        donorId: '',
      });

      // Wait 2 seconds, then close and refresh
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess('');
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
          <h2>Create New Task</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">
              Task Title <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Thank you call - John Smith"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional details about this task..."
              rows={3}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="type">Task Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Thank You">Thank You</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Administrative">Administrative</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="dueDate">
                Due Date <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="donorId">Associated Donor (Optional)</label>
              <select
                id="donorId"
                name="donorId"
                value={formData.donorId}
                onChange={handleChange}
              >
                <option value="">None</option>
                {donors.map((donor) => (
                  <option key={donor.id} value={donor.id}>
                    {donor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
