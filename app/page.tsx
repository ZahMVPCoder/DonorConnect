'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface User {
  id: string;
  email: string;
  username: string;
}

interface DashboardStats {
  totalRaisedThisMonth: number;
  goalProgress: number;
  goalAmount: number;
  newDonors: number;
  lapsedDonors: number;
  recentDonations: Array<{
    id: string;
    amount: number;
    date: string;
    donorName: string;
    campaignName: string;
  }>;
}

interface Task {
  title: string;
  date: string;
  priority: 'High' | 'Medium' | 'Low';
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const mockTasks: Task[] = [
    { title: 'Thank you call - John Smith', date: '2025-12-17', priority: 'High' },
    { title: 'Follow-up email - Sarah Johnson', date: '2025-12-18', priority: 'Medium' },
    { title: 'Quarterly report to board', date: '2025-12-20', priority: 'High' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setLoading(false);
          return;
        }

        const userData = JSON.parse(userStr);
        setUser(userData);

        // Fetch dashboard stats
        const statsResponse = await fetch('/api/dashboard/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        } else if (statsResponse.status === 401) {
          // User not authenticated in database
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className={styles.container}><p>Loading...</p></div>;
  }

  // Show welcome page for non-authenticated users
  if (!user) {
    return <WelcomePage />;
  }

  // Show dashboard for authenticated users
  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Overview of donor engagement and fundraising progress</p>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      {stats && (
        <>
          {/* Metrics Grid */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <h3>Total Raised This Month</h3>
              <div className={styles.metricValue}>${stats.totalRaisedThisMonth.toLocaleString()}</div>
              <div className={styles.trend}>📈 +15%</div>
            </div>
            <div className={styles.metricCard}>
              <h3>Goal Progress</h3>
              <div className={styles.metricValue}>{stats.goalProgress}%</div>
              <div className={styles.metricSubtext}>of ${stats.goalAmount.toLocaleString()}</div>
            </div>
            <div className={styles.metricCard}>
              <h3>New Donors</h3>
              <div className={styles.metricValue}>{stats.newDonors}</div>
              <div className={styles.metricSubtext}>this month</div>
            </div>
            <div className={styles.metricCard}>
              <h3>Lapsed Donors</h3>
              <div className={styles.metricValue}>{stats.lapsedDonors}</div>
              <div className={styles.metricSubtext}>needs follow-up</div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className={styles.twoColumnLayout}>
            {/* Recent Donations */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Recent Donations</h2>
                <button className={styles.button}>Log Donation</button>
              </div>
              <div className={styles.donationsList}>
                {stats.recentDonations.map((donation) => (
                  <div key={donation.id} className={styles.donationItem}>
                    <div>
                      <div className={styles.donorName}>{donation.donorName}</div>
                      <div className={styles.campaignName}>{donation.campaignName}</div>
                    </div>
                    <div className={styles.donationRight}>
                      <div className={styles.donationAmount}>${donation.amount.toLocaleString()}</div>
                      <div className={styles.donationDate}>
                        {new Date(donation.date).toISOString().split('T')[0]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Upcoming Tasks</h2>
                <Link href="/tasks" className={styles.viewAllLink}>View All</Link>
              </div>
              <div className={styles.tasksList}>
                {mockTasks.map((task, index) => (
                  <div key={index} className={styles.taskItem}>
                    <div>
                      <div className={styles.taskTitle}>{task.title}</div>
                      <div className={styles.taskDate}>{task.date}</div>
                    </div>
                    <span className={`${styles.priorityBadge} ${styles[task.priority.toLowerCase()]}`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function WelcomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '80px 20px 60px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px', fontSize: '80px' }}>💝</div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '15px', background: 'linear-gradient(135deg, #333 0%, #667eea 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dono</h1>
        <p style={{ fontSize: '1.3rem', color: '#999', marginBottom: '30px' }}>Donor Management Made Simple</p>
        <p style={{ fontSize: '1.05rem', color: '#666', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
          Streamline your donor relationships, track campaigns, and maximize fundraising impact with an all-in-one platform built for nonprofits and fundraisers.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth/signin" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '14px 40px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1rem',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
            display: 'inline-block',
          }} onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = 'translateY(-2px)'; (e.target as HTMLElement).style.boxShadow = '0 6px 25px rgba(102, 126, 234, 0.4)'; }} onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = 'translateY(0)'; (e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)'; }}>
            Sign In
          </Link>
          <Link href="/auth/signup" style={{
            background: '#f0f4ff',
            color: '#667eea',
            padding: '14px 40px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1rem',
            border: '2px solid rgba(102, 126, 234, 0.2)',
            transition: 'all 0.3s ease',
            display: 'inline-block',
          }} onMouseEnter={(e) => { (e.target as HTMLElement).style.background = '#e8ecff'; (e.target as HTMLElement).style.borderColor = 'rgba(102, 126, 234, 0.4)'; }} onMouseLeave={(e) => { (e.target as HTMLElement).style.background = '#f0f4ff'; (e.target as HTMLElement).style.borderColor = 'rgba(102, 126, 234, 0.2)'; }}>
            Get Started Free
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 20px', background: 'white', borderRadius: '20px', marginBottom: '60px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', textAlign: 'center', marginBottom: '60px', color: '#333' }}>Why Choose Dono?</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
          {/* Feature 1 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>👥</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '12px', color: '#333' }}>Donor Management</h3>
            <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Track and manage all your donors in one centralized place. Monitor giving history, engagement levels, and build stronger relationships.
            </p>
          </div>

          {/* Feature 2 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>🎯</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '12px', color: '#333' }}>Campaign Tracking</h3>
            <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Create and monitor fundraising campaigns with real-time progress tracking. Visualize your progress toward goals instantly.
            </p>
          </div>

          {/* Feature 3 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>✅</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '12px', color: '#333' }}>Task Management</h3>
            <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Stay organized with follow-ups and reminders. Never miss a donor engagement opportunity with intelligent task prioritization.
            </p>
          </div>

          {/* Feature 4 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>📊</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '12px', color: '#333' }}>Analytics Dashboard</h3>
            <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Get insights into your fundraising performance. Comprehensive metrics and reports to make data-driven decisions.
            </p>
          </div>

          {/* Feature 5 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>🔒</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '12px', color: '#333' }}>Secure & Reliable</h3>
            <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Your donor data is protected with enterprise-grade security. Rest assured your information is safe and backed up.
            </p>
          </div>

          {/* Feature 6 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>⚡</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '12px', color: '#333' }}>Easy to Use</h3>
            <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Intuitive interface requires no technical knowledge. Get up and running in minutes, not hours.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px', marginBottom: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
          <div style={{ textAlign: 'center', background: 'white', padding: '40px 30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', border: '1px solid rgba(102, 126, 234, 0.1)' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' }}>500+</div>
            <p style={{ fontSize: '1rem', color: '#666', fontWeight: '600' }}>Organizations</p>
          </div>
          <div style={{ textAlign: 'center', background: 'white', padding: '40px 30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', border: '1px solid rgba(102, 126, 234, 0.1)' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' }}>50K+</div>
            <p style={{ fontSize: '1rem', color: '#666', fontWeight: '600' }}>Donors Tracked</p>
          </div>
          <div style={{ textAlign: 'center', background: 'white', padding: '40px 30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', border: '1px solid rgba(102, 126, 234, 0.1)' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' }}>$100M+</div>
            <p style={{ fontSize: '1rem', color: '#666', fontWeight: '600' }}>Funds Raised</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ textAlign: 'center', padding: '60px 20px 80px', maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '20px', color: '#333' }}>Ready to Boost Your Fundraising?</h2>
        <p style={{ fontSize: '1rem', color: '#666', marginBottom: '40px', lineHeight: '1.6' }}>
          Join hundreds of nonprofits and fundraisers who have transformed their donor relationships with Dono. Start free today—no credit card required.
        </p>
        <Link href="/auth/signup" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '16px 48px',
          borderRadius: '10px',
          textDecoration: 'none',
          fontWeight: '700',
          fontSize: '1.05rem',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
          transition: 'all 0.3s ease',
          display: 'inline-block',
        }} onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = 'translateY(-2px)'; (e.target as HTMLElement).style.boxShadow = '0 6px 25px rgba(102, 126, 234, 0.4)'; }} onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = 'translateY(0)'; (e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)'; }}>
          Create Your Free Account
        </Link>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(102, 126, 234, 0.1)', padding: '40px 20px', textAlign: 'center', color: '#999' }}>
        <p style={{ marginBottom: '15px', fontSize: '0.95rem' }}>© 2026 Dono. All rights reserved.</p>
        <p style={{ fontSize: '0.85rem' }}>Built with ❤️ for nonprofits and fundraisers worldwide</p>
      </div>
    </div>
  );
}
