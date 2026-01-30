import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default function ReportsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reports</h1>
        <p className={styles.subtitle}>
          Quick snapshots of fundraising performance (placeholders).
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Monthly Donations</h3>
            <span className={styles.badge}>Chart</span>
          </div>
          <div className={styles.chartPlaceholder}>
            <div className={styles.chartBar} style={{ height: '40%' }} />
            <div className={styles.chartBar} style={{ height: '65%' }} />
            <div className={styles.chartBar} style={{ height: '30%' }} />
            <div className={styles.chartBar} style={{ height: '80%' }} />
            <div className={styles.chartBar} style={{ height: '55%' }} />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Campaign Progress</h3>
            <span className={styles.badge}>Chart</span>
          </div>
          <div className={styles.progressList}>
            <div className={styles.progressItem}>
              <span>Spring Appeal</span>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: '72%' }} />
              </div>
            </div>
            <div className={styles.progressItem}>
              <span>Scholarship Fund</span>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: '48%' }} />
              </div>
            </div>
            <div className={styles.progressItem}>
              <span>Emergency Relief</span>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: '86%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Donor Retention</h3>
            <span className={styles.badge}>Chart</span>
          </div>
          <div className={styles.donut}>
            <div className={styles.donutInner}>
              <div className={styles.donutValue}>68%</div>
              <div className={styles.donutLabel}>Retained</div>
            </div>
          </div>
          <div className={styles.tipBox}>
            <div className={styles.tipHeader}>
              <span className={styles.aiBadge}>🤖 AI Insight</span>
              <span className={styles.tipLabel}>Based on current stats</span>
            </div>
            <p>
              Retention is 68%. If it drops below 60%, take action. Average
              customer retention rates across industries typically range from
              70% to 80%.
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Top Sources</h3>
            <span className={styles.badge}>Chart</span>
          </div>
          <div className={styles.sourceList}>
            <div className={styles.sourceItem}>
              <span>Online Giving</span>
              <strong>42%</strong>
            </div>
            <div className={styles.sourceItem}>
              <span>Events</span>
              <strong>28%</strong>
            </div>
            <div className={styles.sourceItem}>
              <span>Mail</span>
              <strong>18%</strong>
            </div>
            <div className={styles.sourceItem}>
              <span>Major Gifts</span>
              <strong>12%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}