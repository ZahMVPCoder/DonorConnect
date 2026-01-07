'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function LessonsPage() {
  const lessons = [
    {
      id: 1,
      title: 'POST Donation Endpoint',
      difficulty: 'Beginner',
      duration: '30-45 minutes',
      description: 'Build a POST API route that handles donation creation with proper validation and database integration.',
      objectives: [
        'Extract data from POST request body',
        'Implement input validation',
        'Perform database lookups with Prisma',
        'Handle errors and return appropriate HTTP status codes',
        'Create database records',
      ],
      href: '/lessons/lesson-01',
      status: 'available',
    },
    {
      id: 2,
      title: 'GET Donations with Filtering',
      difficulty: 'Beginner',
      duration: '40-50 minutes',
      description: 'Retrieve donations with query parameters, filtering, and pagination.',
      objectives: [
        'Handle query parameters',
        'Implement filtering logic',
        'Add pagination support',
        'Return paginated results',
      ],
      href: '#',
      status: 'coming-soon',
    },
    {
      id: 3,
      title: 'Authentication & Authorization',
      difficulty: 'Intermediate',
      duration: '50-60 minutes',
      description: 'Implement JWT-based authentication and protect API routes.',
      objectives: [
        'Create JWT tokens',
        'Implement middleware',
        'Protect routes with authentication',
        'Handle authorization',
      ],
      href: '#',
      status: 'coming-soon',
    },
    {
      id: 4,
      title: 'Advanced Database Queries',
      difficulty: 'Intermediate',
      duration: '60+ minutes',
      description: 'Learn complex Prisma queries with relationships and aggregations.',
      objectives: [
        'Join multiple tables',
        'Aggregate data',
        'Optimize query performance',
        'Handle complex relationships',
      ],
      href: '#',
      status: 'coming-soon',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Learning Path</h1>
        <p className={styles.subtitle}>Master API development with Next.js and Prisma</p>
      </div>

      {/* Course Overview */}
      <div className={styles.overview}>
        <h2>Welcome to the Donor CRM Learning Path</h2>
        <p>
          This hands-on course teaches you how to build a complete donation management system with 
          proper API design, database operations, and authentication. Each lesson builds on the previous 
          one with real-world scenarios.
        </p>
      </div>

      {/* Lessons Grid */}
      <div className={styles.lessonsGrid}>
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className={`${styles.lessonCard} ${
              lesson.status === 'coming-soon' ? styles.comingSoon : ''
            }`}
          >
            <div className={styles.lessonHeader}>
              <h3 className={styles.lessonTitle}>
                Lesson {lesson.id}: {lesson.title}
              </h3>
              <div className={styles.badges}>
                <span className={styles.difficulty}>{lesson.difficulty}</span>
                <span className={styles.duration}>⏱ {lesson.duration}</span>
              </div>
            </div>

            <p className={styles.description}>{lesson.description}</p>

            <div className={styles.objectives}>
              <h4>Learning Objectives:</h4>
              <ul>
                {lesson.objectives.map((objective, idx) => (
                  <li key={idx}>✓ {objective}</li>
                ))}
              </ul>
            </div>

            {lesson.status === 'available' ? (
              <Link href={lesson.href} className={styles.startButton}>
                Start Lesson →
              </Link>
            ) : (
              <button className={styles.comingSoonButton} disabled>
                Coming Soon
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Learning Path Visualization */}
      <div className={styles.pathSection}>
        <h2>Learning Path Progression</h2>
        <div className={styles.pathVisualization}>
          <div className={styles.level}>
            <div className={styles.levelTitle}>Beginner: API Fundamentals</div>
            <div className={styles.lessons}>
              <div className={styles.pathLesson + ' ' + styles.complete}>Lesson 01: POST Endpoint</div>
              <div className={styles.pathLesson}>Lesson 02: GET with Filtering</div>
              <div className={styles.pathLesson}>Lesson 03: Error Handling</div>
            </div>
          </div>

          <div className={styles.arrow}>↓</div>

          <div className={styles.level}>
            <div className={styles.levelTitle}>Intermediate: Advanced APIs</div>
            <div className={styles.lessons}>
              <div className={styles.pathLesson}>Lesson 04: Authentication</div>
              <div className={styles.pathLesson}>Lesson 05: Complex Queries</div>
              <div className={styles.pathLesson}>Lesson 06: Transactions</div>
            </div>
          </div>

          <div className={styles.arrow}>↓</div>

          <div className={styles.level}>
            <div className={styles.levelTitle}>Advanced: Production Ready</div>
            <div className={styles.lessons}>
              <div className={styles.pathLesson}>Lesson 07: Testing</div>
              <div className={styles.pathLesson}>Lesson 08: Performance</div>
              <div className={styles.pathLesson}>Lesson 09: Deployment</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className={styles.techStack}>
        <h2>Tech Stack</h2>
        <div className={styles.techGrid}>
          <div className={styles.techItem}>
            <span className={styles.techIcon}>⚛️</span>
            <span className={styles.techName}>Next.js 14</span>
            <span className={styles.techDesc}>React framework with API routes</span>
          </div>
          <div className={styles.techItem}>
            <span className={styles.techIcon}>💾</span>
            <span className={styles.techName}>Prisma</span>
            <span className={styles.techDesc}>Modern database ORM</span>
          </div>
          <div className={styles.techItem}>
            <span className={styles.techIcon}>📊</span>
            <span className={styles.techName}>SQLite</span>
            <span className={styles.techDesc}>Lightweight database</span>
          </div>
          <div className={styles.techItem}>
            <span className={styles.techIcon}>🔐</span>
            <span className={styles.techName}>TypeScript</span>
            <span className={styles.techDesc}>Type-safe JavaScript</span>
          </div>
        </div>
      </div>
    </div>
  );
}
