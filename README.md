# Donor CRM Management System

A modern Donor CRM application built with Next.js and Prisma, designed to manage donor relationships, track fundraising campaigns, and handle administrative tasks.

## Features

- **Dashboard**: Overview of donor engagement and fundraising progress
- **Donors Management**: Manage donor profiles and track their contribution history
- **Campaigns**: Track multiple fundraising campaigns with goal progress
- **Tasks & Follow-ups**: Manage donor engagement tasks and administrative work
- **REST API**: Endpoints for managing donations, donors, and campaigns

## Tech Stack

- **Framework**: Next.js 14
- **Database**: Prisma with SQLite
- **Styling**: CSS Modules
- **Language**: TypeScript

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── donations/
│   │       └── route.ts          # POST donation endpoint
│   ├── donors/
│   │   ├── page.tsx              # Donors list page
│   │   └── page.module.css
│   ├── campaigns/
│   │   ├── page.tsx              # Campaigns page
│   │   └── page.module.css
│   ├── tasks/
│   │   ├── page.tsx              # Tasks & follow-ups page
│   │   └── page.module.css
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Dashboard page
│   ├── page.module.css
│   └── globals.css
├── components/
│   ├── Navigation.tsx            # Navigation component
│   └── Navigation.module.css
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.js                   # Database seeding script
├── .env.local                    # Environment variables
├── next.config.js
├── tsconfig.json
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd dono-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npm run prisma:migrate
   ```

4. Seed the database with sample data:
   ```bash
   npm run seed
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Donor
- `id`: Unique identifier
- `name`: Donor name
- `email`: Email address (unique)
- `status`: Active, Lapsed, Major, or Prospect
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Donation
- `id`: Unique identifier
- `amount`: Donation amount
- `date`: Donation date
- `donorId`: Reference to Donor
- `campaignId`: Reference to Campaign (optional)

### Campaign
- `id`: Unique identifier
- `name`: Campaign name
- `status`: Active, Completed, or Paused
- `goal`: Fundraising goal amount
- `raised`: Amount raised so far
- `startDate`: Campaign start date
- `endDate`: Campaign end date

### Task
- `id`: Unique identifier
- `title`: Task title
- `description`: Task description (optional)
- `status`: Pending or Completed
- `priority`: Low, Medium, or High
- `type`: Thank You, Follow-up, or Administrative
- `dueDate`: Due date for the task
- `donorId`: Reference to Donor (optional)

## API Endpoints

### POST /api/donations
Create a new donation record.

**Request Body:**
```json
{
  "donorId": "string",
  "amount": number,
  "campaignId": "string" (optional)
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Donation created successfully",
  "donation": { ... }
}
```

**Error Responses:**
- `400`: Missing required fields or invalid amount
- `404`: Donor or campaign not found
- `500`: Internal server error

### GET /api/donations
Retrieve all donations with donor and campaign information.

**Response (200):**
```json
{
  "donations": [ ... ]
}
```

## Pages

### Dashboard
Overview of:
- Total amount raised this month
- Campaign goal progress
- New donors this month
- Lapsed donors needing follow-up
- Recent donations
- Upcoming tasks

### Donors
Complete donor management interface with:
- Searchable donor list
- Status filtering
- Donation history
- Total giving tracking

### Campaigns
Campaign tracking with:
- Campaign cards showing progress
- Overall campaign statistics
- Recent campaign donations

### Tasks & Follow-ups
Task management featuring:
- Task statistics
- Filter by status (Pending, Completed)
- Priority indicators
- Task types (Thank You, Follow-up, Administrative)

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint
- `npm run prisma:generate`: Generate Prisma client
- `npm run prisma:migrate`: Run database migrations
- `npm run prisma:studio`: Open Prisma Studio
- `npm run seed`: Seed database with sample data

## Learning Objectives

This project demonstrates:
- Building REST API endpoints in Next.js
- Input validation and error handling
- Database operations with Prisma
- Server-side data fetching with Next.js
- Building responsive UI with CSS Modules
- TypeScript usage in a full-stack application

## Lessons Covered

### Lesson 01: POST Donation Endpoint
- Extract and validate request body data
- Perform database lookups with Prisma
- Handle HTTP status codes appropriately
- Create and update database records
- Return meaningful error messages

## Environment Variables

Create a `.env.local` file in the root directory:
```
DATABASE_URL="file:./dev.db"
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
