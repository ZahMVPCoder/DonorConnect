'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './Navigation.module.css';

export default function Navigation() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    // Clear auth cookie
    document.cookie = 'auth-user=; path=/; max-age=0';
    setUser(null);
    window.location.href = '/welcome';
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.icon}>💲</span>
          Donor CRM
        </Link>
        <ul className={styles.links}>
          {user ? (
            <>
              <li>
                <Link href="/">Dashboard</Link>
              </li>
              <li>
                <Link href="/donors">Donors</Link>
              </li>
              <li>
                <Link href="/campaigns">Campaigns</Link>
              </li>
              <li>
                <Link href="/tasks">Tasks</Link>
              </li>
              <li className={styles.userSection}>
                <span className={styles.userDisplay}>You/{user.username}!</span>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/auth/signin">Sign In</Link>
              </li>
              <li>
                <Link href="/auth/signup" className={styles.signUpLink}>
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
