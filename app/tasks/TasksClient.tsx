'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import AddTaskModal from '@/components/AddTaskModal';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  type: string;
  dueDate: string;
  donorId?: string;
  donor?: {
    name: string;
  };
}

export default function TasksClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('All Tasks');
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskSuccess = () => {
    fetchTasks();
  };

  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const stats = {
    pending: tasks.filter((t) => t.status === 'Pending').length,
    completed: tasks.filter((t) => t.status === 'Completed').length,
    highPriority: tasks.filter((t) => t.priority === 'High').length,
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'Pending') return task.status === 'Pending';
    if (filter === 'Completed') return task.status === 'Completed';
    return true;
  });

  if (loading) {
    return <div className={styles.container}>Loading tasks...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <div>
          <h1 className={styles.title}>Tasks & Follow-ups</h1>
          <p className={styles.subtitle}>Manage donor engagement and administrative tasks</p>
        </div>
        <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
          + Add Task
        </button>
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleTaskSuccess}
      />

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏱</div>
          <h3>Pending Tasks</h3>
          <p className={styles.statNumber}>{stats.pending}</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✓</div>
          <h3>Completed</h3>
          <p className={styles.statNumber}>{stats.completed}</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>!</div>
          <h3>High Priority</h3>
          <p className={styles.statNumber}>{stats.highPriority}</p>
        </div>
      </div>

      {/* Filters and Tabs */}
      <div className={styles.taskHeader}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${filter === 'All Tasks' ? styles.active : ''}`}
            onClick={() => setFilter('All Tasks')}
          >
            All Tasks
          </button>
          <button
            className={`${styles.tab} ${filter === 'Pending' ? styles.active : ''}`}
            onClick={() => setFilter('Pending')}
          >
            Pending
          </button>
          <button
            className={`${styles.tab} ${filter === 'Completed' ? styles.active : ''}`}
            onClick={() => setFilter('Completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className={styles.taskList}>
        {filteredTasks.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <h3>No tasks yet</h3>
            <p>Click the "+ Add Task" button above to create your first task</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`${styles.taskCard} ${
                task.status === 'Completed' ? styles.completed : ''
              }`}
            >
              <div className={styles.taskCheckbox}>
                <input
                  type="checkbox"
                  checked={task.status === 'Completed'}
                  onChange={() => handleToggleStatus(task.id, task.status)}
                />
              </div>
              <div className={styles.taskContent}>
                <h3 className={styles.taskTitle}>{task.title}</h3>
                {task.description && (
                  <p className={styles.taskDescription}>{task.description}</p>
                )}
                <div className={styles.taskMeta}>
                  <span className={styles.taskDate}>
                    📅 {new Date(task.dueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  {task.donor && (
                    <Link href={`/donors/${task.donorId}`} className={styles.donorLink}>
                      👤 {task.donor.name}
                    </Link>
                  )}
                </div>
              </div>
              <div className={styles.taskActions}>
                <span
                  className={`${styles.priority} ${styles[task.priority.toLowerCase()]}`}
                >
                  {task.priority}
                </span>
                <span className={styles.taskType}>{task.type}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
