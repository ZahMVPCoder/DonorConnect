# Lessons & Learning Path

Welcome to the Donor CRM Management System Learning Path! This is a practical, hands-on course for building RESTful APIs with Next.js and Prisma.

## Course Overview

This course teaches you how to build a complete donor management system with proper API design, database operations, and authentication. Each lesson builds on the previous one with real-world scenarios.

## Course Lessons

### [Lesson 01: POST Donation Endpoint](/lessons/lesson-01)
**Difficulty: Beginner**

Build a POST API route that handles donation creation with proper validation and database integration.

**Duration:** 30-45 minutes

**Learning Objectives:**
- Extract data from POST request body
- Implement input validation
- Perform database lookups with Prisma
- Handle errors and return appropriate HTTP status codes
- Create database records
- Update related records (campaigns)

**Success Criteria:**
- ✅ POST request with valid data creates donation
- ✅ Invalid donor ID returns 404 with clear message
- ✅ Negative amount is rejected
- ✅ Missing required fields return 400 error
- ✅ Campaign raised amount is updated
- ✅ Response includes created donation details

[Start Lesson 01 →](/lessons/lesson-01)

---

### [Lesson 02: GET Donations with Filtering](#) (Coming Soon)
**Difficulty: Beginner**

Retrieve donations with query parameters, filtering, and pagination.

---

### [Lesson 03: Authentication & Authorization](#) (Coming Soon)
**Difficulty: Intermediate**

Implement JWT-based authentication and protect API routes.

---

### [Lesson 04: Advanced Database Queries](#) (Coming Soon)
**Difficulty: Intermediate**

Learn complex Prisma queries with relationships and aggregations.

---

## Prerequisites

- **Node.js** v16 or higher
- **Basic JavaScript** knowledge (ES6+)
- **Understanding of REST APIs** (GET, POST, PUT, DELETE)
- **Familiarity with async/await** (helpful but not required)

## Tech Stack

- **Next.js 14** - React framework with built-in API routes
- **Prisma 5** - Modern database ORM with excellent TypeScript support
- **SQLite** - Lightweight database perfect for learning
- **bcryptjs** - Password hashing for security
- **TypeScript** - Type-safe JavaScript

## Project Setup

If you haven't set up the project yet, follow these steps:

```bash
# 1. Clone the repository
git clone <repository-url>
cd dono-management-system

# 2. Install dependencies
npm install

# 3. Set up the database
npx prisma migrate dev --name init

# 4. Seed sample data
node prisma/seed.js

# 5. Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application!

## Database Schema

The project works with the following entities:

### User
Represents a user account in the system.

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Donor
Represents a person making donations.

```prisma
model Donor {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  status    String   @default("Active")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  donations Donation[]
  tasks     Task[]
}
```

### Donation
Records of donations made by donors.

```prisma
model Donation {
  id         String   @id @default(cuid())
  amount     Float
  date       DateTime @default(now())
  donorId    String
  campaignId String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  donor    Donor     @relation(fields: [donorId], references: [id])
  campaign Campaign? @relation(fields: [campaignId], references: [id])
}
```

### Campaign
Optional donation campaigns for organizing fundraising efforts.

```prisma
model Campaign {
  id         String   @id @default(cuid())
  name       String
  status     String   @default("Active")
  goal       Float
  raised     Float    @default(0)
  startDate  DateTime
  endDate    DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  donations Donation[]
}
```

### Task
Represents follow-up tasks for donors.

```prisma
model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  status      String   @default("Pending")
  priority    String   @default("Medium")
  type        String   @default("Follow-up")
  dueDate     DateTime
  donorId     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  donor Donor? @relation(fields: [donorId], references: [id])
}
```

## Learning Path Progression

```
┌─────────────────────────────────────────┐
│ Beginner: API Fundamentals              │
├─────────────────────────────────────────┤
│ ✓ Lesson 01: POST Donation Endpoint     │
│ ○ Lesson 02: GET with Filtering         │
│ ○ Lesson 03: Error Handling             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ Intermediate: Advanced APIs             │
├─────────────────────────────────────────┤
│ ○ Lesson 04: Authentication             │
│ ○ Lesson 05: Complex Queries            │
│ ○ Lesson 06: Transactions               │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ Advanced: Production Ready              │
├─────────────────────────────────────────┤
│ ○ Lesson 07: Testing & Validation      │
│ ○ Lesson 08: Performance Optimization   │
│ ○ Lesson 09: Deployment & DevOps       │
└─────────────────────────────────────────┘
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

## Getting Help

- Check the lesson's "Common Issues" section
- Review the "Testing the API" section with example curl commands
- Look at the codebase examples in the project

## Next Steps

Ready to get started? [Begin Lesson 01 →](/lessons/lesson-01)

---

**Happy Learning! 🚀**
