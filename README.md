# DonorConnect - Donor Management System

A modern, full-featured donor management platform for nonprofits and fundraisers. Built with Next.js, TypeScript, Prisma, and PostgreSQL (Neon).

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=flat-square)

## 🌟 Features

### Core Functionality
- **Donor Management** - Track donors, manage relationships, and monitor engagement
- **Donation Tracking** - Record and view all donations with campaign attribution
- **Campaign Management** - Create campaigns, track progress, and monitor fundraising goals
- **Task Management** - Organize follow-ups, thank yous, and administrative tasks

### Role-Based Access Control
- **Admin Users** - Full system access including user management and role assignment
- **Staff Users** - Can manage donors, record donations, and view campaigns
- **Protected Endpoints** - Admin-only endpoints require proper authorization

### AI-Powered Insights
- **Donor Analysis** - Intelligent analysis of donor giving patterns
- **Smart Recommendations** - AI-generated personalized follow-up recommendations
- **Donor Segmentation** - Automatic classification (Major Donor, Regular Donor, Prospect, etc.)
- **Actionable Insights** - Priority-ranked recommendations for engagement strategies

### Modern UI/UX
- Beautiful gradient design system
- Responsive layout for all devices
- Real-time data visualization
- Intuitive navigation and user experience

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Database**: PostgreSQL via Neon
- **ORM**: Prisma 5.7+
- **Authentication**: bcryptjs + HTTP cookies
- **Styling**: CSS Modules with modern design system
- **Deployment**: Vercel

## 📋 Project Structure

```
.
├── app/
│   ├── api/              # API endpoints
│   │   ├── auth/         # Authentication endpoints (signup, signin)
│   │   ├── admin/        # Admin-only endpoints (user management)
│   │   ├── ai/           # AI integration endpoints (donor insights)
│   │   ├── donors/       # Donor management APIs
│   │   ├── donations/    # Donation APIs
│   │   ├── campaigns/    # Campaign APIs
│   │   └── dashboard/    # Dashboard data APIs
│   ├── admin/            # Admin dashboard pages
│   ├── auth/             # Authentication pages (signup, signin)
│   ├── donors/           # Donor management pages
│   ├── campaigns/        # Campaign management pages
│   ├── donations/        # Donation management pages
│   ├── tasks/            # Task management pages
│   └── page.tsx          # Home/Dashboard
├── components/           # Reusable React components
│   ├── Navigation.tsx    # Main navigation
│   └── AddDonorModal.tsx # Modal for adding donors
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   └── auth.ts           # Authorization helpers
├── prisma/
│   ├── schema.prisma     # Database schema definition
│   └── migrations/       # Database migration files
├── public/               # Static assets
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (Neon recommended)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ZahMVPCoder/DonorConnect.git
   cd Dono-Management-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your Neon database connection string:
   ```
   DATABASE_URL="postgresql://user:password@host:port/database"
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to http://localhost:3000

## 📊 Database Schema

### Users Table
- `id`: Unique identifier (UUID)
- `email`: User email (unique, indexed)
- `username`: Username (unique, indexed)
- `password`: Hashed password (bcrypt)
- `role`: 'admin' or 'staff' (default: 'staff')
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### Donors Table
- `id`: Unique identifier (UUID)
- `name`: Donor name (indexed)
- `email`: Donor email (unique, indexed)
- `status`: 'Active', 'Lapsed', or 'Prospect'
- `createdAt`: Record creation timestamp
- `updatedAt`: Last update timestamp
- Relations: Many donations, many tasks

### Donations Table
- `id`: Unique identifier (UUID)
- `amount`: Donation amount in cents/base currency
- `date`: Donation date
- `donorId`: Foreign key to Donor (indexed)
- `campaignId`: Foreign key to Campaign (optional, indexed)
- `createdAt`: Record creation timestamp
- `updatedAt`: Last update timestamp

### Campaigns Table
- `id`: Unique identifier (UUID)
- `name`: Campaign name
- `status`: 'Active', 'Completed', or 'Paused'
- `goal`: Campaign goal amount
- `raised`: Current amount raised
- `startDate`: Campaign start date
- `endDate`: Campaign end date
- `createdAt`: Record creation timestamp
- `updatedAt`: Last update timestamp
- Relations: Many donations

### Tasks Table
- `id`: Unique identifier (UUID)
- `title`: Task title
- `description`: Task description (optional)
- `status`: 'Pending' or 'Completed'
- `priority`: 'Low', 'Medium', or 'High'
- `type`: Task type (Thank You, Follow-up, Administrative)
- `dueDate`: Due date
- `donorId`: Related donor (optional, indexed)
- `createdAt`: Record creation timestamp
- `updatedAt`: Last update timestamp

## 🔐 Authentication & Authorization

### User Roles
- **Admin**: Full system access, user management, role assignment, dashboard analytics
- **Staff**: Donor and donation management, campaign viewing, basic reporting

### Protected Routes
- `/admin` - Admin dashboard (admin only)
- `/api/admin/users` - User management API (admin only)
- `/api/ai/donor-insights` - AI insights (authenticated users)

### How It Works
1. User signs up with email, username, and password
2. Password is hashed with bcrypt (10 salt rounds) before storing in database
3. On login, bcrypt verifies the password matches the stored hash
4. Authentication cookie is set in browser for session management
5. User role is stored in database and checked on each admin request
6. Protected endpoints verify role before returning data

## 🤖 AI Integration

### Donor Insights System
The app includes an intelligent donor analysis engine that powers the Insights feature:

**Analyzes Donor Data:**
- Total giving amount and donation count
- Average gift size and giving frequency
- Donation trends (increasing, stable, decreasing)
- Days since last donation
- Engagement metrics

**Automatic Donor Segmentation:**
- **Prospect**: No donations yet, needs initial outreach
- **Recent Donor**: 1-2 donations, high potential for cultivation
- **Regular Donor**: 3+ donations, consistent supporter
- **Major Donor**: 5+ donations AND $1000+ lifetime giving

**Smart Recommendations (Priority-Ranked):**

1. **Lapsed Donors** (High Priority)
   - Recommends re-engagement strategy for donors inactive 90+ days
   - Suggests personalized outreach approach
   - Includes suggested message templates

2. **Major Donors** (High Priority)
   - Identifies top supporters for VIP treatment
   - Recommends scheduled thank you calls
   - Suggests exclusive recognition opportunities

3. **New Donors** (Medium Priority)
   - Welcomes new supporters with personalized message
   - Recommends sending thank you card
   - Suggests sharing impact stories

4. **Growing Donors** (Medium Priority)
   - Identifies donors with increasing gift amounts
   - Recommends cultivation strategies
   - Suggests major gift solicitation timeline

**Access:**
- Navigate to `/donors/[id]/insights` to view AI-generated insights for any donor
- Admin dashboard displays AI insights summary across all donors
- API endpoint: `POST /api/ai/donor-insights`

**Example API Response:**
```json
{
  "donor": {
    "name": "Sarah Johnson",
    "email": "sarah@example.com",
    "status": "Active"
  },
  "metrics": {
    "totalDonations": 4500,
    "donationCount": 6,
    "averageDonation": 750,
    "daysLastDonation": 35
  },
  "segment": "Major Donor",
  "recommendations": [
    {
      "priority": "high",
      "title": "Schedule Thank You Call",
      "message": "Sarah Johnson is a major donor with consistent support. A personal thank you call would strengthen the relationship.",
      "action": "Schedule 30-min call this week"
    }
  ]
}
```

## API Endpoints

### Authentication Endpoints

**POST `/api/auth/signup`**
- Register new user account
- Body: `{ email, username, password }`
- Returns: `{ success, message, user }`

**POST `/api/auth/signin`**
- Login existing user
- Body: `{ email, password }`
- Returns: `{ success, message, user }`

### Admin Endpoints

**GET `/api/admin/users`**
- List all users (admin only)
- Returns: `{ users: [...] }`

**PUT `/api/admin/users`**
- Update user role (admin only)
- Body: `{ userId, role }`
- Returns: `{ success, message, user }`

**DELETE `/api/admin/users`**
- Delete user (admin only)
- Body: `{ userId }`
- Returns: `{ success, message }`

### AI Endpoints

**POST `/api/ai/donor-insights`**
- Generate insights for a donor
- Body: `{ donorId }`
- Returns: `{ donor, metrics, segment, recommendations }`

### Donor Endpoints

**GET `/api/donors`**
- List all donors with stats
- Returns: `{ donors: [...], total }`

**POST `/api/donors`**
- Create new donor
- Body: `{ name, email, status }`
- Returns: `{ success, message, donor }`

### Donation Endpoints

**GET `/api/donations`**
- List all donations
- Returns: `{ donations: [...] }`

**POST `/api/donations`**
- Record new donation
- Body: `{ donorId, amount, campaignId?, date }`
- Returns: `{ success, message, donation }`

## 🚀 Deployment

### Deploy to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed step-by-step instructions.

**Quick Steps:**
1. Push code to GitHub (already done: https://github.com/ZahMVPCoder/DonorConnect)
2. Go to https://vercel.com/dashboard
3. Click "Add New..." → "Project"
4. Select `ZahMVPCoder/DonorConnect` repository
5. Add environment variable: `DATABASE_URL` with your Neon connection string
6. Click "Deploy"
7. Your app will be live in minutes!

**Post-Deployment:**
- Create admin user: `UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com'`
- Test all features in production
- Monitor logs and performance

## 🛠 Available Scripts

```bash
# Development
npm run dev                  # Start dev server on :3000

# Production
npm run build               # Build optimized production bundle
npm start                   # Start production server

# Database
npx prisma migrate dev      # Create and apply migrations
npx prisma studio          # Open Prisma Studio (visual DB browser)
npx prisma generate        # Regenerate Prisma client types
npx prisma db seed         # Run seed script

# Linting & Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Role-based access control on both frontend and backend
- ✅ Protected API endpoints with authorization middleware
- ✅ Secure HTTP-only cookies for session management
- ✅ Input validation on all API endpoints
- ✅ SQL injection prevention (via Prisma ORM)
- ✅ Environment variables for sensitive data
- ✅ CSRF token support (can be added)

## 📱 Responsive Design

- Mobile-first CSS approach
- Breakpoints optimized for all device sizes
- Touch-friendly interface elements
- Tested on mobile, tablet, and desktop
- Accessible color contrasts
- Keyboard navigation support

## 🎨 Design System

**Color Palette:**
- Primary Gradient: #667eea (blue) → #764ba2 (purple)
- Primary Accent: #667eea
- Secondary Accent: #764ba2
- Background: #ffffff
- Text: #333333
- Borders: #e0e0e0

**Typography:**
- Font Family: System fonts (-apple-system, Segoe UI, Roboto)
- Base Size: 16px
- Line Height: 1.6

**Components:**
- Consistent spacing (8px grid system)
- Smooth transitions: `all 0.3s ease`
- Box shadows for depth
- Border radius: 10-12px for cards

## 📈 Performance Optimizations

- Next.js 14 with App Router
- Static Site Generation (SSG) where applicable
- Incremental Static Regeneration (ISR)
- Image optimization with next/image
- Font optimization (system fonts for fast loading)
- Automatic code splitting per route
- Production build optimization

## 🧪 Testing

Basic testing setup (extend as needed):
```bash
npm test
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct in `.env.local`
- Ensure Neon database is active and accepting connections
- Check network connectivity to database host

### Authentication Problems
- Clear browser cookies and localStorage
- Verify email/password are correct
- Check user exists in database via Prisma Studio

### Deployment Issues
See [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💬 Support & Questions

- 📖 Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- 🔍 Review API documentation section above
- 📧 Open an issue on GitHub for bugs or feature requests
- 💡 Check project discussions for community support

## 🙏 Acknowledgments

- **Next.js** - React framework for production
- **Neon** - Serverless PostgreSQL platform
- **Prisma** - Next-generation ORM
- **bcryptjs** - Password hashing library
- **TypeScript** - Type-safe JavaScript

---

**Made with ❤️ for nonprofit organizations and fundraisers worldwide**

**Live Demo:** [View on Vercel](https://dono-management-system.vercel.app)

**Repository:** https://github.com/ZahMVPCoder/DonorConnect
