'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Back Home
        </Link>
        <h1 className={styles.title}>The Problem We're Solving</h1>
        <p className={styles.subtitle}>Understanding why donors fall through the cracks</p>
      </div>

      {/* Problem Overview */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>The Real Challenge Facing Nonprofits</h2>
        <div className={styles.content}>
          <p className={styles.problemStatement}>
            Nonprofits today struggle to manage donor relationships effectively because they lack a centralized system 
            to track donor information, giving history, and engagement activities. This fragmented approach—using 
            spreadsheets, emails, and scattered notes—leads to missed follow-ups, incomplete donor records, poor 
            fundraising reporting, and ultimately, lost funding opportunities.
          </p>
        </div>
      </section>

      {/* Why It Matters */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Why This Problem Matters for Nonprofits</h2>
        <div className={styles.gridContent}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>💰</div>
            <h3>Lost Revenue</h3>
            <p>
              Nonprofits lose millions in potential donations because donors aren't properly tracked or nurtured. 
              A lapsed donor might be ready to give again, but without proper records, they're forgotten.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>⏰</div>
            <h3>Wasted Time</h3>
            <p>
              Staff spend hours manually updating spreadsheets, searching for donor information across multiple 
              systems, and recreating reports. This administrative burden takes away from mission-critical work.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>📉</div>
            <h3>Poor Decision Making</h3>
            <p>
              Without comprehensive donor analytics, leadership can't make data-driven decisions about fundraising 
              strategies, campaign focus, or resource allocation.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>😞</div>
            <h3>Donor Frustration</h3>
            <p>
              Donors receive duplicate thank-you letters, forgotten follow-ups, or irrelevant solicitations. 
              This poor experience damages donor relationships and retention.
            </p>
          </div>
        </div>
      </section>

      {/* Who Is Affected */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Who Is Affected by This Problem?</h2>
        <div className={styles.affectedList}>
          <div className={styles.affectedItem}>
            <div className={styles.affectedBullet}>👥</div>
            <div>
              <h4>Nonprofit Executive Directors & Development Teams</h4>
              <p>
                They shoulder the responsibility of fund raising while managing limited budgets and staff. 
                Losing donors or missing opportunities directly impacts their organization's mission fulfillment.
              </p>
            </div>
          </div>

          <div className={styles.affectedItem}>
            <div className={styles.affectedBullet}>🎯</div>
            <div>
              <h4>Individual Fundraisers & Consultants</h4>
              <p>
                Professionals who manage fundraising for multiple organizations need efficient systems to track 
                prospects, maintain relationships, and demonstrate ROI on their efforts.
              </p>
            </div>
          </div>

          <div className={styles.affectedItem}>
            <div className={styles.affectedBullet}>🏢</div>
            <div>
              <h4>Small & Mid-Size Nonprofits</h4>
              <p>
                Organizations with limited IT budgets often can't afford expensive CRM solutions, forcing them 
                to use outdated tools that don't meet their needs.
              </p>
            </div>
          </div>

          <div className={styles.affectedItem}>
            <div className={styles.affectedBullet}>💡</div>
            <div>
              <h4>The Communities They Serve</h4>
              <p>
                When nonprofits lose donors due to poor management, the communities dependent on their services 
                suffer. Less funding means fewer programs, fewer people helped, less impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Consequences */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What Happens if the Problem Isn't Solved?</h2>
        <div className={styles.consequencesList}>
          <div className={styles.consequence}>
            <div className={styles.consequenceNumber}>1</div>
            <div className={styles.consequenceText}>
              <strong>Donor Attrition Accelerates</strong><br/>
              Without proper follow-up systems, donors feel forgotten. Studies show that 45% of lapsed donors 
              would give again with proper engagement. Nonprofits lose repeat donors who could become major 
              supporters.
            </div>
          </div>

          <div className={styles.consequence}>
            <div className={styles.consequenceNumber}>2</div>
            <div className={styles.consequenceText}>
              <strong>Fundraising Inefficiency Grows</strong><br/>
              Manual processes waste 10-15 hours per week per staff member on administrative tasks that 
              should be automated, reducing time available for actual fundraising and donor cultivation.
            </div>
          </div>

          <div className={styles.consequence}>
            <div className={styles.consequenceNumber}>3</div>
            <div className={styles.consequenceText}>
              <strong>Strategic Opportunities Are Missed</strong><br/>
              Without data insights, organizations can't identify major donor prospects, optimal solicitation 
              times, or winning campaign strategies. They make decisions based on gut feeling, not data.
            </div>
          </div>

          <div className={styles.consequence}>
            <div className={styles.consequenceNumber}>4</div>
            <div className={styles.consequenceText}>
              <strong>Organizational Growth Stalls</strong><br/>
              When fundraising is inefficient and based on manual processes, the organization can't scale. 
              They hit a ceiling where they can't manage more donors or bigger campaigns.
            </div>
          </div>

          <div className={styles.consequence}>
            <div className={styles.consequenceNumber}>5</div>
            <div className={styles.consequenceText}>
              <strong>Community Impact Declines</strong><br/>
              Less funding means fewer programs, fewer people helped, less community impact. The ultimate 
              cost is borne by the vulnerable populations these nonprofits serve.
            </div>
          </div>
        </div>
      </section>

      {/* Why Dono Is Different */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Why Dono is Different</h2>
        <div className={styles.differenceContainer}>
          <div className={styles.differenceContent}>
            <h3>Concrete Example: AI-Powered Donor Insights</h3>
            <p className={styles.differenceIntro}>
              Unlike traditional CRM systems that simply store data, Dono uses AI to <strong>actively help you make better 
              decisions</strong>. Here's a real example:
            </p>

            <div className={styles.comparisonTable}>
              <div className={styles.comparisonRow}>
                <div className={styles.comparisonHeader}>Traditional CRM System:</div>
                <div className={styles.comparisonContent}>
                  <p>
                    You look up John Smith in your database. You see: "3 donations, $2,500 total, last gave 6 months ago." 
                    Now what? You have to manually analyze this data and decide what to do.
                  </p>
                </div>
              </div>

              <div className={styles.comparisonRow}>
                <div className={styles.comparisonContent}>
                  <p>
                    → Spent 15 minutes analyzing John's data<br/>
                    → Might miss important patterns<br/>
                    → Decision might be suboptimal
                  </p>
                </div>
              </div>

              <div className={styles.comparisonDivider}>VS</div>

              <div className={styles.comparisonRow}>
                <div className={styles.comparisonHeader}>Dono with AI Insights:</div>
                <div className={styles.comparisonContent}>
                  <p>
                    You click "View Insights" on John's profile. Dono instantly shows:
                  </p>
                  <ul className={styles.donoBenefits}>
                    <li>🎯 <strong>Segment:</strong> "Major Donor" (5+ donations, $1000+ total)</li>
                    <li>📈 <strong>Pattern:</strong> Donation amounts are increasing (showing growing commitment)</li>
                    <li>⏰ <strong>Alert:</strong> "At-risk - 180 days since last donation"</li>
                    <li>🤖 <strong>AI Recommendation:</strong> "Schedule thank-you call this week. John is a major donor showing growth—VIP treatment recommended. Consider inviting to exclusive donor event."</li>
                  </ul>
                </div>
              </div>

              <div className={styles.comparisonRow}>
                <div className={styles.comparisonContent}>
                  <p>
                    → 2 seconds to get full analysis<br/>
                    → AI never misses patterns<br/>
                    → Clear actionable next step<br/>
                    → Increases likelihood of major gift
                  </p>
                </div>
              </div>
            </div>

            <p className={styles.differenceConclusion}>
              This is the key difference: Dono doesn't just store data—it <strong>thinks about your donors</strong> 
              and tells you exactly what to do to build stronger relationships and increase funding.
            </p>
          </div>

          <div className={styles.differenceHighlights}>
            <h4>Why This Matters:</h4>
            <ul className={styles.highlightsList}>
              <li>
                <strong>⚡ Speed:</strong> What used to take 15 minutes now takes 2 seconds per donor
              </li>
              <li>
                <strong>🎯 Accuracy:</strong> AI patterns are more reliable than human analysis
              </li>
              <li>
                <strong>📊 Scalability:</strong> Analyze 100 or 1,000 donors the same way
              </li>
              <li>
                <strong>💰 Revenue:</strong> Better insights = better donor cultivation = more donations
              </li>
              <li>
                <strong>😊 Experience:</strong> Staff spend time on relationship-building, not data analysis
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to Solve This Problem?</h2>
        <p className={styles.ctaText}>
          Join nonprofits that have already transformed their fundraising with Dono. 
          Start tracking donors smarter, not harder.
        </p>
        <Link href="/auth/signup" className={styles.ctaButton}>
          Get Started Free
        </Link>
      </section>
    </div>
  );
}
