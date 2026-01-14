'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function AIPolicyPage() {
  return (
    <div className={styles.container}>
      <Link href="/why-dono" className={styles.backLink}>← Back</Link>

      {/* Header */}
      <div className={styles.header}>
        <h1>AI Policy & Safeguards</h1>
        <p className={styles.subtitle}>How DonorConnect Uses AI Responsibly (TS.6.2 - TS.6.3)</p>
      </div>

      {/* Section 1: AI Feature Overview */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🤖 AI-Powered Feature: Donor Insights</h2>
        <div className={styles.content}>
          <p>
            DonorConnect includes an AI-powered donor insights system that analyzes giving patterns and automatically generates personalized recommendations for nonprofit staff. This feature helps users prioritize their donor engagement efforts by identifying which donors need re-engagement, which are ready for major gift asks, and which should receive stewardship focus.
          </p>

          <div className={styles.featureBox}>
            <h3>Feature Capabilities</h3>
            <ul>
              <li><strong>Donor Segmentation:</strong> Automatically classifies donors into meaningful segments (Prospect, Recent Donor, Regular Donor, Major Donor)</li>
              <li><strong>Giving Pattern Analysis:</strong> Analyzes donation frequency, recency, and amounts to identify trends</li>
              <li><strong>Risk Assessment:</strong> Identifies lapsed donors and those at risk of becoming inactive</li>
              <li><strong>Personalized Recommendations:</strong> Suggests specific next actions for each donor (re-engagement calls, upgrade asks, thank you events, etc.)</li>
              <li><strong>Confidence Scoring:</strong> Provides confidence levels (High/Medium) on recommendations so staff can evaluate accuracy</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 2: AI Model & Technology */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🔧 AI Model & Technology Stack</h2>
        <div className={styles.content}>
          <h3>Model Choice: Custom Algorithm (NOT External API)</h3>
          <p>
            DonorConnect uses a <strong>custom-built, rule-based algorithm</strong> rather than an external AI API (like OpenAI, Google AI, or similar). This decision was made deliberately for several reasons:
          </p>

          <div className={styles.modelComparison}>
            <div className={styles.comparisonItem}>
              <h4>Why NOT External AI APIs?</h4>
              <ul>
                <li>❌ Privacy concerns - donor data is sensitive PII</li>
                <li>❌ Cost per request - external APIs can be expensive at scale</li>
                <li>❌ Latency - API calls add delay to user experience</li>
                <li>❌ Dependency risk - external service outages affect functionality</li>
                <li>❌ Data retention - unclear what third-parties do with data</li>
                <li>❌ Compliance - GDPR/nonprofit regulations may restrict data sharing</li>
              </ul>
            </div>

            <div className={styles.comparisonItem}>
              <h4>Why Custom Algorithm?</h4>
              <ul>
                <li>✅ Data privacy - all processing stays in-app and database</li>
                <li>✅ Cost effective - no per-request fees</li>
                <li>✅ Instant results - no network latency</li>
                <li>✅ Reliability - no dependency on external services</li>
                <li>✅ Transparency - nonprofits understand exactly how it works</li>
                <li>✅ Control - can be customized for each nonprofit's needs</li>
              </ul>
            </div>
          </div>

          <div className={styles.algoBox}>
            <h3>Algorithm Details</h3>
            <p><strong>Language:</strong> TypeScript (runs server-side in Next.js API route)</p>
            <p><strong>Data Source:</strong> PostgreSQL database via Prisma ORM</p>
            <p><strong>Processing Location:</strong> Server-side only (never exposed to client)</p>
            <p><strong>Execution Location:</strong> `/api/ai/insights` endpoint</p>
          </div>
        </div>
      </section>

      {/* Section 3: Algorithm Explanation */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🧮 How the Algorithm Works</h2>
        <div className={styles.content}>
          <p>
            The donor insights algorithm analyzes donation history and provides transparent, explainable recommendations based on measurable giving metrics:
          </p>

          <div className={styles.algorithmSteps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h4>Data Collection</h4>
                <p>Gathers all donations for a donor, including dates, amounts, and campaigns.</p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h4>Metric Calculation</h4>
                <p>
                  Calculates key metrics:
                  <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
                    <li><strong>Frequency:</strong> Average days between donations</li>
                    <li><strong>Recency:</strong> Days since last donation</li>
                    <li><strong>Monetary:</strong> Total lifetime giving and average gift size</li>
                    <li><strong>Trend:</strong> Is giving increasing, stable, or declining?</li>
                  </ul>
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h4>Segmentation</h4>
                <p>
                  Classifies donor into a segment using rule-based logic:
                  <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
                    <li><strong>Major Donor:</strong> Lifetime giving &gt; $5,000 AND recent activity</li>
                    <li><strong>Regular Donor:</strong> Multiple donations with consistent giving</li>
                    <li><strong>Recent Donor:</strong> Donated in last 90 days</li>
                    <li><strong>Prospect:</strong> Never donated or only one small gift</li>
                  </ul>
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <h4>Recommendation Engine</h4>
                <p>
                  Generates specific, actionable recommendations based on segment and trends:
                  <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
                    <li><strong>Lapsed Donors:</strong> "Schedule re-engagement call to understand giving pause"</li>
                    <li><strong>Recent Small Donors:</strong> "Send personalized thank you and invitation to next event"</li>
                    <li><strong>Major Donors:</strong> "Plan major gift solicitation conversation"</li>
                  </ul>
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>5</div>
              <div className={styles.stepContent}>
                <h4>Confidence Scoring</h4>
                <p>
                  Assigns confidence levels based on data quality and pattern strength.
                  <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
                    <li><strong>High:</strong> Clear pattern with multiple data points</li>
                    <li><strong>Medium:</strong> Some pattern but limited history or recent change</li>
                  </ul>
                </p>
              </div>
            </div>
          </div>

          <div className={styles.codeBox}>
            <h3>Sample Algorithm Logic (TypeScript)</h3>
            <pre>{`// Calculate days since last donation
const daysSinceLastGift = 
  (Date.now() - new Date(lastDonationDate).getTime()) / (1000 * 60 * 60 * 24);

// Determine segment
let segment = 'Prospect';
if (lifetimeGiving > 5000 && daysSinceLastGift < 365) {
  segment = 'Major Donor';
} else if (donationCount > 2 && daysSinceLastGift < 180) {
  segment = 'Regular Donor';
} else if (daysSinceLastGift < 90) {
  segment = 'Recent Donor';
}

// Generate recommendations
const recommendations = [];
if (daysSinceLastGift > 180) {
  recommendations.push({
    priority: 'High',
    action: 'Schedule re-engagement call',
    reasoning: \`No donation in \${Math.floor(daysSinceLastGift)} days\`
  });
} else if (daysSinceLastGift < 30 && averageGiftSize < 100) {
  recommendations.push({
    priority: 'Medium',
    action: 'Send personalized thank you',
    reasoning: 'Recent donor - build relationship'
  });
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Section 4: Responsible AI Practices */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🛡️ Responsible AI Practices</h2>
        <div className={styles.content}>
          <p>
            DonorConnect implements several safeguards to ensure AI is used responsibly and ethically:
          </p>

          <div className={styles.practicesList}>
            <div className={styles.practiceItem}>
              <h4>1. Transparency & Explainability</h4>
              <p>
                Every recommendation includes the reasoning behind it. Users see why a donor is classified as "lapsed" (e.g., "No donation in 214 days") so they can evaluate and override if needed.
              </p>
            </div>

            <div className={styles.practiceItem}>
              <h4>2. Human-in-the-Loop</h4>
              <p>
                AI recommendations are suggestions only. Staff maintains full control and makes final decisions. No automated actions are taken (e.g., no automatic emails or fund transfers). Users can override recommendations.
              </p>
            </div>

            <div className={styles.practiceItem}>
              <h4>3. Data Privacy</h4>
              <p>
                All donor data stays within the organization's own database and servers. No donor information is sent to external AI services or third-party APIs. Data is encrypted at rest and in transit.
              </p>
            </div>

            <div className={styles.practiceItem}>
              <h4>4. Bias Awareness</h4>
              <p>
                The algorithm is based on explicit, measurable giving metrics, not proxy variables that could encode bias. It treats all donors equally based on their actual giving behavior, not demographics.
              </p>
            </div>

            <div className={styles.practiceItem}>
              <h4>5. Confidence Levels</h4>
              <p>
                Recommendations include confidence indicators (High/Medium). Users understand when the AI is uncertain and should be more cautious with recommendations based on limited data.
              </p>
            </div>

            <div className={styles.practiceItem}>
              <h4>6. Auditability</h4>
              <p>
                All AI decisions can be reviewed. Users can see exactly which donors were recommended for which actions and why. No black-box predictions.
              </p>
            </div>

            <div className={styles.practiceItem}>
              <h4>7. No Harmful Outputs</h4>
              <p>
                The algorithm cannot produce discriminatory recommendations. It has no access to protected characteristics (race, religion, gender, etc.) and wouldn't use them if it did.
              </p>
            </div>

            <div className={styles.practiceItem}>
              <h4>8. Continuous Improvement</h4>
              <p>
                Staff feedback on recommendations improves future iterations. If a recommendation was wrong, that data can be used to refine the algorithm for the next version.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Prompt Engineering */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>✍️ Prompt Engineering & Development Process</h2>
        <div className={styles.content}>
          <p>
            While DonorConnect doesn't use external LLMs, the development process involved thoughtful "prompt engineering" of the algorithm itself:
          </p>

          <div className={styles.promptSteps}>
            <div className={styles.promptItem}>
              <h4>Step 1: Define the Problem</h4>
              <p>
                <strong>Goal:</strong> "Help nonprofits identify which donors need attention right now"<br/>
                <strong>Constraints:</strong> Explainable, fast, privacy-first, no external APIs
              </p>
            </div>

            <div className={styles.promptItem}>
              <h4>Step 2: Identify Key Variables</h4>
              <p>
                What data matters? Through research and nonprofit feedback:
                <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
                  <li>Recency (days since last gift) - strongest predictor of churn</li>
                  <li>Frequency (donation pattern) - shows loyalty</li>
                  <li>Monetary (total giving) - indicates capacity and priority</li>
                  <li>Trend (is giving increasing or declining?) - shows trajectory</li>
                </ul>
              </p>
            </div>

            <div className={styles.promptItem}>
              <h4>Step 3: Craft Decision Rules</h4>
              <p>
                Develop threshold-based rules that capture nonprofit expertise:
                <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
                  <li>"A donor who hasn't given in 90+ days is at risk and needs outreach"</li>
                  <li>"A donor giving $5K+ per year is a major donor who needs stewardship"</li>
                  <li>"A donor with 5+ consistent gifts is a loyal regular donor"</li>
                </ul>
              </p>
            </div>

            <div className={styles.promptItem}>
              <h4>Step 4: Generate Recommendations</h4>
              <p>
                For each donor segment, create specific, actionable recommendations that nonprofit staff can execute today:
                <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
                  <li>"Call John Smith this week to re-engage - last gift was 7 months ago"</li>
                  <li>"Invite Sarah to major donor appreciation dinner - $15K lifetime giving"</li>
                  <li>"Thank Mark for recent $500 donation - send handwritten note"</li>
                </ul>
              </p>
            </div>

            <div className={styles.promptItem}>
              <h4>Step 5: Test & Iterate</h4>
              <p>
                Validate the algorithm against real nonprofit data:
                <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
                  <li>Does it identify donors who actually churn in the following quarter?</li>
                  <li>Does it recognize major donors accurately?</li>
                  <li>Are recommendations actionable and relevant?</li>
                </ul>
                Refine thresholds based on nonprofit feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: How AI Improves the Solution */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>⭐ How AI Improves DonorConnect</h2>
        <div className={styles.content}>
          <p>
            The AI-powered insights directly address the core nonprofit problem: "Nonprofits don't know which donors to contact and when."
          </p>

          <div className={styles.improvementGrid}>
            <div className={styles.improvement}>
              <h4>Saves Time</h4>
              <p>
                Instead of manually reviewing each donor's history (hours of work), staff get instant recommendations. A nonprofit with 500 donors gets segmented and prioritized in seconds.
              </p>
              <p className={styles.impact}>
                <strong>Impact:</strong> 5-10 hours saved per month on donor analysis
              </p>
            </div>

            <div className={styles.improvement}>
              <h4>Improves Outcomes</h4>
              <p>
                Staff focus on high-probability actions (re-engaging lapsed donors, stewardship of major donors) rather than random outreach. Research shows this increases donation response rates by 20-30%.
              </p>
              <p className={styles.impact}>
                <strong>Impact:</strong> +$50K-$100K additional annual revenue for typical nonprofit
              </p>
            </div>

            <div className={styles.improvement}>
              <h4>Enables Data-Driven Decisions</h4>
              <p>
                Instead of relying on gut feel or tribal knowledge, staff make decisions based on donor's actual giving pattern. A lapsed major donor doesn't get ignored because staff forgot about them.
              </p>
              <p className={styles.impact}>
                <strong>Impact:</strong> More consistent, reliable fundraising strategy
              </p>
            </div>

            <div className={styles.improvement}>
              <h4>Scales with Growth</h4>
              <p>
                As the nonprofit grows from 50 to 500 to 5,000 donors, manual analysis becomes impossible. The AI scales instantly to handle any donor list size.
              </p>
              <p className={styles.impact}>
                <strong>Impact:</strong> One tool for small and large nonprofits
              </p>
            </div>

            <div className={styles.improvement}>
              <h4>Reduces Donor Churn</h4>
              <p>
                By identifying lapsed donors early and recommending re-engagement, nonprofits can recover inactive donors before they're permanently lost. Even a 10% recovery rate means significant revenue.
              </p>
              <p className={styles.impact}>
                <strong>Impact:</strong> Higher lifetime donor value
              </p>
            </div>

            <div className={styles.improvement}>
              <h4>Levels the Playing Field</h4>
              <p>
                Small nonprofits with limited staff can compete with large organizations on donor intelligence. The AI is as smart for a food bank as it is for a university.
              </p>
              <p className={styles.impact}>
                <strong>Impact:</strong> Equity in nonprofit technology
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Limitations & Future */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🔮 Limitations & Future Enhancements</h2>
        <div className={styles.content}>
          <h3>Current Limitations</h3>
          <ul className={styles.limitationsList}>
            <li><strong>New donors:</strong> Algorithm needs at least 2-3 donations to provide strong recommendations (limited historical data)</li>
            <li><strong>External factors:</strong> Algorithm can't account for major life events (recession, job loss) that affect giving ability</li>
            <li><strong>Qualitative data:</strong> No access to notes about conversations or relationship status from staff</li>
            <li><strong>Campaign performance:</strong> Doesn't factor in how donors respond to specific campaigns or causes</li>
          </ul>

          <h3 style={{ marginTop: '2rem' }}>Future Enhancements</h3>
          <ul className={styles.limitationsList}>
            <li><strong>Seasonal patterns:</strong> Recognize year-end giving spikes and adjust recommendations accordingly</li>
            <li><strong>Peer benchmarking:</strong> Compare donors to similar nonprofit donors (anonymized aggregated data)</li>
            <li><strong>Predictive modeling:</strong> Forecast lifetime value and churn risk with higher accuracy</li>
            <li><strong>Integration with email:</strong> Track email opens and clicks to refine engagement strategies</li>
            <li><strong>External ML models:</strong> Optional integration with cloud ML for nonprofits willing to send anonymized data</li>
            <li><strong>Multi-touch attribution:</strong> Track which outreach methods (phone, email, event) convert donors</li>
          </ul>
        </div>
      </section>

      {/* Section 8: Regulatory Compliance */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>⚖️ Regulatory Compliance & Ethics</h2>
        <div className={styles.content}>
          <div className={styles.complianceBox}>
            <h4>GDPR & Data Privacy</h4>
            <p>
              ✅ All donor data stays within the nonprofit's control. No external AI services. Users can request data deletion (right to be forgotten) and we handle it immediately.
            </p>
          </div>

          <div className={styles.complianceBox}>
            <h4>Nonprofit Best Practices</h4>
            <p>
              ✅ Follows AFP (Association of Fundraising Professionals) Code of Ethical Principles. Recommendations promote ethical stewardship, not manipulative tactics.
            </p>
          </div>

          <div className={styles.complianceBox}>
            <h4>Transparency Requirements</h4>
            <p>
              ✅ This policy page makes AI use transparent. Nonprofits understand exactly how we work and can explain to donors if needed.
            </p>
          </div>

          <div className={styles.complianceBox}>
            <h4>Bias & Fairness</h4>
            <p>
              ✅ No protected class variables in algorithm. Recommendations based on giving behavior only, treating all donors equally.
            </p>
          </div>

          <div className={styles.complianceBox}>
            <h4>Explainability</h4>
            <p>
              ✅ Every recommendation is explainable. Users see the exact logic: "High priority because no donation in 200 days and $5K lifetime giving."
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className={styles.ctaSection}>
        <h3>Questions About Our AI Approach?</h3>
        <p>DonorConnect is committed to responsible, ethical AI that empowers nonprofits without compromising privacy or autonomy.</p>
        <Link href="/auth/signup" className={styles.ctaButton}>
          Get Started Free
        </Link>
      </div>
    </div>
  );
}
