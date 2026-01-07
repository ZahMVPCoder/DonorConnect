import prisma from '@/lib/prisma';
import styles from './page.module.css';
import Link from 'next/link';

export default async function TasksPage() {
  const tasks = await prisma.task.findMany({
    include: { donor: true },
    orderBy: { dueDate: 'asc' },
  });

  const stats = {
    pending: tasks.filter((t: any) => t.status === 'Pending').length,
    completed: tasks.filter((t: any) => t.status === 'Completed').length,
    highPriority: tasks.filter((t: any) => t.priority === 'High').length,
  };

  const pendingTasks = tasks.filter((t: any) => t.status === 'Pending');

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tasks & Follow-ups</h1>
      <p className={styles.subtitle}>Manage donor engagement and administrative tasks</p>

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
          <button className={`${styles.tab} ${styles.active}`}>All Tasks</button>
          <button className={styles.tab}>Pending</button>
          <button className={styles.tab}>Completed</button>
        </div>
        <select className={styles.sortSelect}>
          <option>Sort by: Due Date</option>
          <option>Sort by: Priority</option>
          <option>Sort by: Status</option>
        </select>
      </div>

      {/* Task List */}
      <div className={styles.taskList}>
        {pendingTasks.map((task: any) => (
          <div key={task.id} className={styles.taskCard}>
            <div className={styles.taskCheckbox}>
              <input type="checkbox" />
            </div>
            <div className={styles.taskContent}>
              <h3 className={styles.taskTitle}>{task.title}</h3>
              <div className={styles.taskMeta}>
                <span className={styles.taskDate}>
                  📅 {new Date(task.dueDate).toISOString().split('T')[0]}
                </span>
                {task.donor && (
                  <Link href={`/donors/${task.donorId}`} className={styles.donorLink}>
                    View Donor
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
        ))}
      </div>
    </div>
  );
}
