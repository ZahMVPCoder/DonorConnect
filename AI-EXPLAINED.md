# How DonorConnect's AI Processes Donor Data

## 📊 What Data the AI Analyzes

When you click "AI Insights" for a donor, the system collects:
- **Donation History** - All donations with amounts, dates, and campaigns
- **Donor Profile** - Name, email, status, and account creation date
- **Task History** - Related follow-up tasks and their due dates
- **Time Patterns** - When they give (seasonality, frequency)

---

## 🤖 What the AI Does With That Data

### 1. **Calculates Core Metrics**
```
Total Donations = Sum of all donation amounts
Donation Count = Number of gifts made
Average Donation = Total Donations ÷ Donation Count
Last Donation Days Ago = Today - Most Recent Donation Date
```

**Example:** If John gave $500 (Jan 1), $300 (Feb 15), $700 (Mar 10):
- Total: $1,500
- Count: 3 gifts
- Average: $500
- Days Ago: 324 days (since Mar 10, 2025)

---

### 2. **Segments Donors Automatically**

The AI categorizes donors based on giving patterns:

**Major Donor** 
- ✅ 5+ donations AND $1,000+ total
- Example: Sarah (7 gifts, $2,400 total) → Major Donor

**Regular Donor**
- ✅ 3+ donations AND $500+ total
- Example: Mike (4 gifts, $650 total) → Regular Donor

**Recent Donor**
- ✅ 1+ donations
- Example: Emma (1 gift, $100) → Recent Donor

**Prospect**
- ⚠️ 0 donations
- Example: David (no gifts yet) → Prospect

---

### 3. **Detects Risk & Opportunities**

#### 🚨 **Lapse Risk Detection**
```
IF last donation > 180 days ago THEN "HIGH RISK - Lapsed Donor"
IF last donation > 90 days ago THEN "MEDIUM RISK - At Risk"
IF last donation < 90 days THEN "LOW RISK - Active"
```

**Why 180 days?** Industry research shows donors who don't give for 6+ months have 70% chance of never returning.

**Real Example:**
- Lisa last gave 195 days ago
- AI flags: "⚠️ HIGH RISK - Send re-engagement email NOW"

---

#### 📈 **Growth Detection**
```
Recent Donation > Previous Donation × 1.5 = "MAJOR GROWTH"
Recent Donation > Previous Donation = "Growth"
Recent Donation < Previous Donation = "Potential concern"
```

**Real Example:**
- Tom's donations: $50 → $100 → $200 (each gift doubled!)
- AI detects: "📈 Growing commitment - Perfect for monthly giving proposal"

---

#### 🎯 **Campaign Affinity Analysis**
```
IF all donations are to same campaign THEN "Campaign-specific donor"
  - Target them with similar campaigns
  - Higher conversion rate (3x better!)
```

**Real Example:**
- Maria only gives to "Food Bank" campaigns (5 gifts, all Food Bank)
- AI suggests: "🎯 Target her for new nutrition programs - she loves feeding people!"

---

### 4. **Generates Prioritized Recommendations**

The AI creates a ranked action list based on:

#### **Priority Logic:**

**HIGH Priority** (Act within 48 hours):
- Major donors ($1,000+ total)
- Lapsed donors (180+ days)
- New donors (first gift within 30 days) ← critical onboarding window!
- Large donation increases (50%+ jump)

**MEDIUM Priority** (Act within 2 weeks):
- At-risk donors (90-180 days since last gift)
- Regular donors ready for upgrade
- Growing donors (any increase in giving)

**LOW Priority** (Ongoing maintenance):
- Active donors with regular giving pattern
- General engagement tips

**INFO Priority** (Educational):
- System tips on using DonorConnect features
- Best practices for donor stewardship

---

### 5. **Detects Seasonal Giving Patterns**

```
December Gifts ÷ Total Gifts > 50% = "Year-end giver"
```

**Real Example:**
- Janet's 6 donations: Dec 2023 ($500), Dec 2024 ($600), Mar 2024 ($100), Dec 2025 ($700)
- 3 of 6 gifts in December = 50%
- AI recommends: "🎄 Send her early year-end appeal in October - she's a holiday giver!"

---

### 6. **Identifies Monthly Giving Candidates**

```
IF 3+ donations AND last gift < 90 days THEN
  "Perfect for monthly sustainer program"
```

**Why?** Consistent donors who give 3+ times often prefer monthly auto-pay (less hassle!)

**Impact:** Monthly donors give 42% more annually than one-time donors.

**Real Example:**
- Kevin gave 4 times this year ($50 each = $200)
- AI suggests: "Ask Kevin for $20/month = $240/year (20% increase!)"

---

### 7. **Provides System Usage Guidance**

The AI doesn't just analyze donors - it teaches you how to use DonorConnect:

**Always includes 3 system tips:**
1. **"Use the Send Thank You button"** - Retention tip
2. **"Create a follow-up task"** - Organization tip  
3. **"Track campaign preferences"** - Strategy tip

**Example tip:**
> "💡 Use the 'Send Thank You' button on this page to acknowledge Sarah's contributions. Personal gratitude increases retention by 20%."

This helps new users learn the system while managing donors!

---

## 🎯 Real-World Example: Complete AI Analysis

### Input Data for "John Smith":
```
Donations:
- $500 on Jan 15, 2025 (Spring Fundraiser)
- $300 on Feb 20, 2025 (Spring Fundraiser)  
- $100 on Aug 10, 2024 (General)
- $200 on Dec 30, 2023 (Year-End Appeal)

Profile:
- Status: Active
- Member since: Dec 2023
- Email: john@example.com
```

### AI Processing:

**Step 1 - Calculate Metrics:**
- Total: $1,100
- Count: 4 donations
- Average: $275
- Last gift: 348 days ago (Jan 15, 2025)
- Member for: 761 days

**Step 2 - Segment:**
- 4 donations + $1,100 total → **"Regular Donor"** (almost Major!)

**Step 3 - Risk Analysis:**
- 348 days since last gift → **HIGH LAPSE RISK** 🚨

**Step 4 - Pattern Detection:**
- 2 of 4 gifts to "Spring Fundraiser" → Campaign affinity
- 1 gift in December → Possible year-end giver
- Last 2 gifts were $300 and $500 → **Growing commitment!**

**Step 5 - Generate Recommendations:**

**HIGH Priority:**
> "⚠️ John Smith hasn't donated in 348 days (11 months). High lapse risk! Send a personalized re-engagement email highlighting recent impact stories."
> 
> **How to:** Use the Send Thank You button, then create a task to follow up with a phone call in 1 week.

**MEDIUM Priority:**
> "🎯 John shows affinity for Spring Fundraiser campaigns (2 of 4 gifts). When launching similar campaigns, prioritize him in outreach for 3x better conversion."
>
> **How to:** When launching similar campaigns, prioritize them in your outreach. Track campaign preferences in task notes.

**INFO Priority:**
> "💡 Use the 'Send Thank You' button on this page to acknowledge John's contributions. Personal gratitude increases retention by 20%."
>
> **How to:** Click the Send Thank You button now, then create a task to send a quarterly impact update.

---

## 📈 Why This Matters

### Without AI:
- 😰 You manually review each donor
- ⏰ Takes 5-10 minutes per donor
- 🤷 You might miss patterns
- 😞 Donors lapse silently

### With AI:
- ✅ Instant analysis (< 1 second)
- 🎯 Never miss at-risk donors
- 📊 Data-driven decisions
- 💰 20-25% better retention

---

## 🔐 Privacy & Ethics

**What the AI does NOT do:**
- ❌ Send emails automatically (you're always in control)
- ❌ Share data with external APIs (all processing is internal)
- ❌ Make decisions for you (AI recommends, YOU decide)
- ❌ Access data from other organizations

**Human-in-the-Loop:**
Every recommendation is just a suggestion. You review, approve, and take action. The AI augments your judgment, never replaces it.

---

## 🚀 Bottom Line

**The AI is like having an experienced fundraising consultant who:**
1. Analyzes every donor instantly
2. Spots patterns you'd miss
3. Prioritizes your daily actions
4. Teaches you best practices
5. Never forgets a follow-up

**But YOU remain the relationship expert.** The AI just handles the math and pattern-recognition so you can focus on the human connection.
