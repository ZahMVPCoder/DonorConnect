'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function WhyDonoPage() {
  return (
    <div className={styles.container}>
      <Link href="/about" className={styles.backLink}>← Back</Link>

      {/* Header */}
      <div className={styles.header}>
        <h1>Why Dono</h1>
        <p className={styles.subtitle}>Planning, Design Decisions, and System Architecture</p>
      </div>

      {/* Section 1: Solution Idea */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Solution Idea</h2>
        <div className={styles.content}>
          <p>
            Dono is a centralized donor management platform that helps nonprofits organize, analyze, and act on donor information in one place. Rather than scattering donor data across multiple tools (spreadsheets, emails, donation platforms, social media), Dono brings everything together with intelligent features designed specifically for nonprofit teams.
          </p>
          <div className={styles.ideaBox}>
            <h3>What Dono Does</h3>
            <ul>
              <li><strong>Centralizes donor information:</strong> Single source of truth for all donor contact details, giving history, and communication</li>
              <li><strong>Tracks donations in real-time:</strong> Record every donation, track progress toward campaign goals, and see revenue trends</li>
              <li><strong>Powers intelligent decisions:</strong> AI-driven insights segment donors and recommend next actions (re-engagement, upgrade, stewardship)</li>
              <li><strong>Automates follow-up tasks:</strong> Create and assign tasks for thank you calls, renewal outreach, event invitations, etc.</li>
              <li><strong>Enables team collaboration:</strong> Multiple staff can access and update donor records with role-based access control</li>
              <li><strong>Scales with the organization:</strong> Works for small nonprofits starting with 50 donors or large organizations managing thousands</li>
            </ul>
          </div>
          <p style={{ marginTop: '1.5rem' }}>
            <strong>Why this approach?</strong> Nonprofits don't need complex enterprise CRM systems. They need something simple, affordable, and built for their specific workflows. Dono strips away unnecessary complexity and focuses on the core activities that drive fundraising success.
          </p>
        </div>
      </section>

      {/* Section 2: Key Features & Why We Chose Them */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Key Features & Design Reasoning</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>👥</div>
            <h3>Donor Profiles</h3>
            <p className={styles.featureWhy}>
              <strong>Why:</strong> Nonprofits need a 360° view of each donor. We store contact info, giving history, status, and notes so staff can see the complete relationship at a glance.
            </p>
            <p className={styles.featureBenefit}>
              <strong>Benefit:</strong> Avoids duplicate asks, enables personalized communication, and reduces time searching through spreadsheets.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💳</div>
            <h3>Donation Tracking</h3>
            <p className={styles.featureWhy}>
              <strong>Why:</strong> Recording donations is core to fundraising, but nonprofits need more than just amounts. We track dates, campaigns, frequency patterns to understand giving behavior.
            </p>
            <p className={styles.featureBenefit}>
              <strong>Benefit:</strong> Real-time revenue visibility, campaign ROI analysis, and identification of trending donors.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎯</div>
            <h3>AI Donor Insights</h3>
            <p className={styles.featureWhy}>
              <strong>Why:</strong> Nonprofits struggle to decide who to contact and when. We built an AI system that analyzes giving patterns and suggests the best action for each donor (re-engage lapsed, upgrade recent donors, steward major donors).
            </p>
            <p className={styles.featureBenefit}>
              <strong>Benefit:</strong> Transforms raw data into actionable recommendations, saving hours of manual analysis and improving success rates.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>✅</div>
            <h3>Task Management</h3>
            <p className={styles.featureWhy}>
              <strong>Why:</strong> Insights are useless without execution. We built a task system so staff can create follow-up tasks and track completion.
            </p>
            <p className={styles.featureBenefit}>
              <strong>Benefit:</strong> Closes the gap between insight and action, ensures recommendations are actually executed, and creates accountability.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3>Campaign Tracking</h3>
            <p className={styles.featureWhy}>
              <strong>Why:</strong> Nonprofits run specific fundraising campaigns (year-end appeal, spring fundraiser). We needed to link donations to campaigns to measure success.
            </p>
            <p className={styles.featureBenefit}>
              <strong>Benefit:</strong> Campaign ROI visibility, performance comparison, and data-driven campaign planning.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔐</div>
            <h3>Role-Based Access</h3>
            <p className={styles.featureWhy}>
              <strong>Why:</strong> Nonprofits have different staff levels (volunteers, staff, administrators). We built role controls (Admin, Staff) to protect sensitive data while enabling collaboration.
            </p>
            <p className={styles.featureBenefit}>
              <strong>Benefit:</strong> Secure data access, prevents accidental modifications, maintains audit trail for sensitive operations.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Expected Challenges & Solutions */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Challenges Anticipated & Our Solutions</h2>
        <div className={styles.challengesList}>
          <div className={styles.challengeItem}>
            <div className={styles.challengeNumber}>1</div>
            <div className={styles.challengeContent}>
              <h3>Data Migration from Legacy Systems</h3>
              <p>
                <strong>Challenge:</strong> Existing nonprofits have donor data scattered across spreadsheets, Google Sheets, or outdated systems. Manually entering thousands of records is impractical.
              </p>
              <p>
                <strong>Our Solution:</strong> Designed the system with API endpoints that accept bulk donor uploads. While version 1.0 focuses on UI-based entry, the foundation supports CSV import scripts for future versions. The database schema is flexible to map data from various sources.
              </p>
            </div>
          </div>

          <div className={styles.challengeItem}>
            <div className={styles.challengeNumber}>2</div>
            <div className={styles.challengeContent}>
              <h3>User Adoption & Training</h3>
              <p>
                <strong>Challenge:</strong> Nonprofit staff may resist new tools or lack technical skills. Complex interfaces cause low adoption.
              </p>
              <p>
                <strong>Our Solution:</strong> Prioritized simplicity and intuitive design. The interface focuses on core tasks (view donors, record donations, review insights) without overwhelming menus. Added role-based views so staff only see relevant features. Clear labels and on-screen guidance reduce training time.
              </p>
            </div>
          </div>

          <div className={styles.challengeItem}>
            <div className={styles.challengeNumber}>3</div>
            <div className={styles.challengeContent}>
              <h3>AI Accuracy & Trustworthiness</h3>
              <p>
                <strong>Challenge:</strong> Nonprofits need to trust donor recommendations. Inaccurate AI suggestions could damage relationships or waste resources.
              </p>
              <p>
                <strong>Our Solution:</strong> Built the AI engine using transparent, explainable algorithms (not black-box ML). The system considers specific metrics: donation frequency, recency, amount, and trends. Each recommendation includes reasoning so staff can verify and override if needed. Recommendations show confidence levels (High/Medium).
              </p>
            </div>
          </div>

          <div className={styles.challengeItem}>
            <div className={styles.challengeNumber}>4</div>
            <div className={styles.challengeContent}>
              <h3>Data Privacy & Security</h3>
              <p>
                <strong>Challenge:</strong> Donor data is sensitive. Nonprofits need assurance that PII is protected from breaches and unauthorized access.
              </p>
              <p>
                <strong>Our Solution:</strong> Implemented password hashing (bcryptjs with 10 salt rounds) so passwords are never stored in plain text. Role-based access control ensures staff can't access admin functions. Hosted on Vercel with automatic HTTPS encryption in transit. Environment variables keep database credentials separate from code.
              </p>
            </div>
          </div>

          <div className={styles.challengeItem}>
            <div className={styles.challengeNumber}>5</div>
            <div className={styles.challengeContent}>
              <h3>Scalability & Performance</h3>
              <p>
                <strong>Challenge:</strong> The system needs to handle both small nonprofits (50 donors) and large organizations (100K+ donors) without slowing down.
              </p>
              <p>
                <strong>Our Solution:</strong> Built on PostgreSQL, a robust database that handles millions of records efficiently. Used Prisma ORM for optimized queries. Designed API endpoints to return paginated results rather than loading entire datasets. The UI uses client-side rendering where appropriate to reduce server load.
              </p>
            </div>
          </div>

          <div className={styles.challengeItem}>
            <div className={styles.challengeNumber}>6</div>
            <div className={styles.challengeContent}>
              <h3>Cost Concerns for Nonprofits</h3>
              <p>
                <strong>Challenge:</strong> Nonprofits operate on tight budgets. Expensive SaaS tools are out of reach.
              </p>
              <p>
                <strong>Our Solution:</strong> Built Dono to run on affordable infrastructure. Vercel's free tier supports small organizations, while Neon PostgreSQL offers generous free tier for data storage. This allows nonprofits to start for free and scale costs as they grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: System Summary */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>System Summary: Pages & Data Architecture</h2>
        
        <div className={styles.architectureBox}>
          <h3>Frontend Pages & Routes</h3>
          <div className={styles.pagesList}>
            <div className={styles.pageGroup}>
              <h4>Public Pages (No Login Required)</h4>
              <ul>
                <li><strong>/</strong> - Home page with problem statement, solution, and CTA</li>
                <li><strong>/about</strong> - About page explaining the nonprofit problem</li>
                <li><strong>/why-dono</strong> - This page (planning & reasoning)</li>
                <li><strong>/auth/signin</strong> - Login page</li>
                <li><strong>/auth/signup</strong> - Account creation page</li>
              </ul>
            </div>

            <div className={styles.pageGroup}>
              <h4>Authenticated Pages (Login Required)</h4>
              <ul>
                <li><strong>/dashboard</strong> - Shows summary metrics (total raised, goal progress)</li>
                <li><strong>/donors</strong> - List of all donors with search and filter</li>
                <li><strong>/donors/[id]</strong> - Individual donor profile with donation history</li>
                <li><strong>/donors/[id]/insights</strong> - AI recommendations for that donor</li>
                <li><strong>/donations</strong> - Record and view all donations</li>
                <li><strong>/campaigns</strong> - Create and track fundraising campaigns</li>
                <li><strong>/tasks</strong> - Task management (create, assign, complete follow-ups)</li>
                <li><strong>/admin</strong> - Admin-only user management dashboard</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.architectureBox}>
          <h3>Database Tables & Relationships</h3>
          <div className={styles.dbSchema}>
            <div className={styles.tableItem}>
              <h4>Users Table</h4>
              <p><strong>Purpose:</strong> Store staff credentials and roles</p>
              <p><strong>Fields:</strong> id, email, username, password (hashed), role (admin/staff), createdAt, updatedAt</p>
              <p><strong>Why:</strong> Enables authentication and role-based access control</p>
            </div>

            <div className={styles.tableItem}>
              <h4>Donors Table</h4>
              <p><strong>Purpose:</strong> Core entity storing donor information</p>
              <p><strong>Fields:</strong> id, name, email, status (Active/Lapsed/Prospect), createdAt, updatedAt</p>
              <p><strong>Why:</strong> Central hub for all donor data; status enables AI segmentation</p>
            </div>

            <div className={styles.tableItem}>
              <h4>Donations Table</h4>
              <p><strong>Purpose:</strong> Track every financial transaction</p>
              <p><strong>Fields:</strong> id, amount, date, donorId (FK), campaignId (FK), createdAt, updatedAt</p>
              <p><strong>Why:</strong> Links donations to donors and campaigns; enables revenue analysis</p>
            </div>

            <div className={styles.tableItem}>
              <h4>Campaigns Table</h4>
              <p><strong>Purpose:</strong> Organize fundraising initiatives</p>
              <p><strong>Fields:</strong> id, name, status, goal, raised, startDate, endDate, createdAt, updatedAt</p>
              <p><strong>Why:</strong> Tracks campaign-specific goals and performance; enables ROI analysis</p>
            </div>

            <div className={styles.tableItem}>
              <h4>Tasks Table</h4>
              <p><strong>Purpose:</strong> Manage follow-up actions and workflow</p>
              <p><strong>Fields:</strong> id, title, description, status, priority (High/Medium/Low), type, dueDate, donorId (FK), createdAt, updatedAt</p>
              <p><strong>Why:</strong> Ensures insights are converted to actions; tracks accountability</p>
            </div>
          </div>
        </div>

        <div className={styles.dataFlowBox}>
          <h3>Key Data Flows</h3>
          <div className={styles.flowItem}>
            <strong>Donation Recording Flow:</strong>
            <div className={styles.flowSteps}>
              <div>1. Staff navigates to Donations page</div>
              <div>2. Enters donor name, amount, date, optional campaign</div>
              <div>3. API validates data and saves to Donations table</div>
              <div>4. Donation is linked to Donor and Campaign (if applicable)</div>
              <div>5. Campaign "raised" total updates automatically</div>
              <div>6. Next time donor insights load, AI recognizes the new donation</div>
            </div>
          </div>

          <div className={styles.flowItem}>
            <strong>AI Insight Generation Flow:</strong>
            <div className={styles.flowSteps}>
              <div>1. Staff clicks "View Insights" on donor profile</div>
              <div>2. API fetches donor's donation history</div>
              <div>3. AI algorithm analyzes: frequency, recency, amount, trends</div>
              <div>4. Segmentation logic assigns status: Prospect / Recent Donor / Regular Donor / Major Donor</div>
              <div>5. Recommendation engine suggests next action based on segment</div>
              <div>6. Insights page displays metrics, recommendations, and donation history</div>
            </div>
          </div>

          <div className={styles.flowItem}>
            <strong>Task Execution Flow:</strong>
            <div className={styles.flowSteps}>
              <div>1. Staff views AI recommendation (e.g., "Re-engage lapsed donor")</div>
              <div>2. Creates a task: "Call John Smith about renewal"</div>
              <div>3. Assigns priority (High) and due date (next week)</div>
              <div>4. Task appears on Tasks page and donor profile</div>
              <div>5. Staff completes task and marks as done</div>
              <div>6. Completed tasks tracked for accountability and reporting</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Design Philosophy */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Design Philosophy</h2>
        <div className={styles.philosophyBox}>
          <h3>Simplicity First</h3>
          <p>
            We removed anything that doesn't directly serve the nonprofit's core mission. No vanity metrics, no confusing dashboards, no features that require 3-hour training. Every button and page has a clear purpose.
          </p>

          <h3>Data-Driven Decision Making</h3>
          <p>
            Rather than asking nonprofits to guess which donors to contact, we provide concrete data and intelligent recommendations. Staff make faster, better decisions based on actual giving patterns.
          </p>

          <h3>Workflow, Not Friction</h3>
          <p>
            The system matches nonprofit workflows, not the other way around. Recording a donation takes seconds. Creating a follow-up task is one click. No unnecessary steps.
          </p>

          <h3>Transparency & Control</h3>
          <p>
            AI recommendations aren't black boxes. Staff sees exactly why a donor is recommended for re-engagement. They can override recommendations and trust the system to learn from feedback.
          </p>

          <h3>Scalability Built In</h3>
          <p>
            Architecture designed for growth. Small nonprofits start for free on Vercel/Neon. As they grow to thousands of donors, infrastructure scales without redesign.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className={styles.ctaSection}>
        <h3>Ready to see Dono in action?</h3>
        <Link href="/auth/signup" className={styles.ctaButton}>
          Get Started Free
        </Link>
      </div>
    </div>
  );
}
