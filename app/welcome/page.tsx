'use client';

import Link from 'next/link';
import styles from './welcome.module.css';

export default function WelcomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logo}>💝</div>
          <h1 className={styles.title}>Dono</h1>
          <p className={styles.tagline}>Donor Management Made Simple</p>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <h2>Welcome to Dono</h2>
          <p>
            Manage your donor relationships, track campaigns, and build lasting connections with your supporters.
            Dono is your all-in-one platform for donor engagement and fundraising success.
          </p>

          {/* Features */}
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>👥</div>
              <h3>Donor Management</h3>
              <p>Track and manage all your donors in one place. Monitor giving history and engagement levels.</p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>Campaign Tracking</h3>
              <p>Create and monitor fundraising campaigns. Track progress toward your goals in real-time.</p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>✅</div>
              <h3>Task Management</h3>
              <p>Stay organized with follow-ups and reminders. Never miss a donor engagement opportunity.</p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Analytics Dashboard</h3>
              <p>Get insights into your fundraising performance with comprehensive metrics and reports.</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={styles.buttons}>
            <Link href="/auth/signin" className={styles.signInButton}>
              Sign In
            </Link>
            <Link href="/auth/signup" className={styles.signUpButton}>
              Create Account
            </Link>
          </div>

          {/* Additional Info */}
          <div className={styles.footer}>
            <p>Don't have an account? <Link href="/auth/signup">Sign up</Link> to get started today.</p>
            <p>Already have an account? <Link href="/auth/signin">Sign in</Link> here.</p>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className={styles.decoration1}></div>
      <div className={styles.decoration2}></div>
    </div>
  );
}
