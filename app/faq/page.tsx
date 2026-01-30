import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default function FaqPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Staff FAQ</h1>
        <p className={styles.subtitle}>
          Quick answers for day-to-day donor management tasks.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>How do I add a new donor?</h3>
          <p>
            Go to the Donors page and click “+ Add Donor”. Fill in name, email,
            and status, then save.
          </p>
        </div>

        <div className={styles.card}>
          <h3>Where do I log a donation?</h3>
          <p>
            Open the Donations page and click “+ Add Donation”. Link the donor
            and campaign, then set the amount and date.
          </p>
        </div>

        <div className={styles.card}>
          <h3>How do I know who needs follow-up?</h3>
          <p>
            Check the Dashboard and Tasks pages. Lapsed donors and high priority
            tasks surface at the top.
          </p>
        </div>

        <div className={styles.card}>
          <h3>What do the donor status badges mean?</h3>
          <p>
            Active = engaged recently, Lapsed = no recent activity, Prospect =
            new or not yet converted.
          </p>
        </div>

        <div className={styles.card}>
          <h3>How do I update a campaign total?</h3>
          <p>
            Open a campaign and use the “Adjust Raised Amount” option to add
            offline gifts.
          </p>
        </div>

        <div className={styles.card}>
          <h3>Is the AI making final decisions?</h3>
          <p>
            No. AI provides recommendations, but staff make the final outreach
            decisions.
          </p>
        </div>
      </div>
    </div>
  );
}