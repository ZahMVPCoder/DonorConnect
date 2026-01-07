'use client';

import Link from 'next/link';
import styles from './lesson-01.module.css';

export default function Lesson01Page() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link href="/lessons">Lessons</Link>
          <span>/</span>
          <span>Lesson 01</span>
        </div>
        <h1 className={styles.title}>POST Donation Endpoint</h1>
        <p className={styles.subtitle}>
          Build a POST API route that handles donation creation with proper validation and database integration.
        </p>
      </div>

      <div className={styles.content}>
        {/* Learning Objectives */}
        <section className={styles.section}>
          <h2>Learning Objectives</h2>
          <ul className={styles.objectivesList}>
            <li>Extract data from POST request body</li>
            <li>Implement input validation</li>
            <li>Perform database lookups with Prisma</li>
            <li>Handle errors and return appropriate HTTP status codes</li>
            <li>Create database records</li>
          </ul>
        </section>

        {/* Success Criteria */}
        <section className={styles.section}>
          <h2>Success Criteria</h2>
          <ul className={styles.criteriaList}>
            <li><span className={styles.checkmark}>✅</span> POST request with valid data creates donation</li>
            <li><span className={styles.checkmark}>✅</span> Invalid donor ID returns 404 with clear message</li>
            <li><span className={styles.checkmark}>✅</span> Negative amount is rejected</li>
            <li><span className={styles.checkmark}>✅</span> Missing required fields return 400 error</li>
          </ul>
        </section>

        {/* Prerequisites */}
        <section className={styles.section}>
          <h2>Prerequisites</h2>
          <div className={styles.card}>
            <h3>Before starting this lesson, you should understand:</h3>
            <ul>
              <li>Basic JavaScript/TypeScript syntax</li>
              <li>REST API concepts (HTTP methods, status codes)</li>
              <li>Next.js API routes fundamentals</li>
              <li>Basic SQL concepts (SELECT, INSERT, UPDATE)</li>
              <li>JSON data structures</li>
            </ul>
          </div>
        </section>

        {/* Getting Started */}
        <section className={styles.section}>
          <h2>Getting Started</h2>
          <div className={styles.card}>
            <h3>The Challenge</h3>
            <p>
              You need to create an API endpoint that accepts POST requests to create new donations.
              The endpoint must validate the incoming data, check that the donor exists, and save the
              donation to the database while updating the campaign's raised amount.
            </p>
          </div>
        </section>

        {/* Implementation Guide */}
        <section className={styles.section}>
          <h2>Implementation Guide</h2>

          <div className={styles.card}>
            <h3>Step 1: Understanding the Donation Model</h3>
            <div className={styles.codeBlock}>
              <pre>{`// Prisma Schema
model Donation {
  id        String   @id @default(cuid())
  donorId   String
  campaignId String
  amount    Float
  date      DateTime @default(now())
  message   String?
  
  donor     Donor    @relation(fields: [donorId], references: [id])
  campaign  Campaign @relation(fields: [campaignId], references: [id])
}`}</pre>
            </div>
            <p>
              The Donation model has required fields for <code>donorId</code>, <code>campaignId</code>,
              and <code>amount</code>. The <code>message</code> field is optional.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Step 2: Create the API Route</h3>
            <div className={styles.codeBlock}>
              <pre>{`// app/api/donations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { donorId, campaignId, amount, message } = body;

    // Validate required fields
    if (!donorId || !campaignId || amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate amount is positive
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Check if donor exists
    const donor = await prisma.donor.findUnique({
      where: { id: donorId }
    });

    if (!donor) {
      return NextResponse.json(
        { error: 'Donor not found' },
        { status: 404 }
      );
    }

    // Create the donation
    const donation = await prisma.donation.create({
      data: {
        donorId,
        campaignId,
        amount,
        message: message || null
      }
    });

    // Update campaign's raised amount
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        raised: {
          increment: amount
        }
      }
    });

    return NextResponse.json(donation, { status: 201 });
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}`}</pre>
            </div>
          </div>

          <div className={styles.card}>
            <h3>Step 3: Key Validation Checks</h3>
            <ul>
              <li><strong>Required Fields:</strong> Check all required fields are present</li>
              <li><strong>Data Types:</strong> Ensure amount is a number</li>
              <li><strong>Business Logic:</strong> Amount must be positive</li>
              <li><strong>Database Integrity:</strong> Verify donor exists before creating donation</li>
              <li><strong>Error Responses:</strong> Return appropriate HTTP status codes</li>
            </ul>
          </div>
        </section>

        {/* Testing */}
        <section className={styles.section}>
          <h2>Testing Your Implementation</h2>

          <div className={styles.card}>
            <h3>Test 1: Valid Donation</h3>
            <p className={styles.testLabel}>Expected: 201 Created</p>
            <div className={styles.codeBlock}>
              <pre>{`curl -X POST http://localhost:3000/api/donations \\
  -H "Content-Type: application/json" \\
  -d '{
    "donorId": "donor_123",
    "campaignId": "campaign_456",
    "amount": 50,
    "message": "Great cause!"
  }'`}</pre>
            </div>
            <p className={styles.response}>
              Response: <code>{`{ "id": "...", "donorId": "donor_123", "campaignId": "campaign_456", "amount": 50, "message": "Great cause!", "date": "..." }`}</code>
            </p>
          </div>

          <div className={styles.card}>
            <h3>Test 2: Missing Required Fields</h3>
            <p className={styles.testLabel}>Expected: 400 Bad Request</p>
            <div className={styles.codeBlock}>
              <pre>{`curl -X POST http://localhost:3000/api/donations \\
  -H "Content-Type: application/json" \\
  -d '{
    "donorId": "donor_123"
  }'`}</pre>
            </div>
            <p className={styles.response}>
              Response: <code>{`{ "error": "Missing required fields" }`}</code>
            </p>
          </div>

          <div className={styles.card}>
            <h3>Test 3: Invalid Donor ID</h3>
            <p className={styles.testLabel}>Expected: 404 Not Found</p>
            <div className={styles.codeBlock}>
              <pre>{`curl -X POST http://localhost:3000/api/donations \\
  -H "Content-Type: application/json" \\
  -d '{
    "donorId": "invalid_id",
    "campaignId": "campaign_456",
    "amount": 50
  }'`}</pre>
            </div>
            <p className={styles.response}>
              Response: <code>{`{ "error": "Donor not found" }`}</code>
            </p>
          </div>

          <div className={styles.card}>
            <h3>Test 4: Negative Amount</h3>
            <p className={styles.testLabel}>Expected: 400 Bad Request</p>
            <div className={styles.codeBlock}>
              <pre>{`curl -X POST http://localhost:3000/api/donations \\
  -H "Content-Type: application/json" \\
  -d '{
    "donorId": "donor_123",
    "campaignId": "campaign_456",
    "amount": -50
  }'`}</pre>
            </div>
            <p className={styles.response}>
              Response: <code>{`{ "error": "Amount must be greater than 0" }`}</code>
            </p>
          </div>
        </section>

        {/* Common Mistakes */}
        <section className={styles.section}>
          <h2>Common Mistakes to Avoid</h2>
          <div className={styles.mistakesList}>
            <div className={styles.mistake}>
              <h3>❌ Not Validating Input Types</h3>
              <p>Always check that the amount is actually a number and is not null/undefined.</p>
            </div>
            <div className={styles.mistake}>
              <h3>❌ Missing Database Existence Check</h3>
              <p>Create donations for donors that don't exist, causing foreign key constraint errors.</p>
            </div>
            <div className={styles.mistake}>
              <h3>❌ Not Updating Campaign Amount</h3>
              <p>Forgetting to increment the campaign's raised amount after creating a donation.</p>
            </div>
            <div className={styles.mistake}>
              <h3>❌ Wrong HTTP Status Codes</h3>
              <p>Using 200 OK for successful creation instead of 201 Created.</p>
            </div>
            <div className={styles.mistake}>
              <h3>❌ No Error Handling</h3>
              <p>Not catching database errors, causing unhandled promise rejections.</p>
            </div>
          </div>
        </section>

        {/* Key Concepts */}
        <section className={styles.section}>
          <h2>Key Concepts Explained</h2>
          
          <div className={styles.conceptGrid}>
            <div className={styles.concept}>
              <h3>POST Requests</h3>
              <p>Used to create new resources on the server. The data is sent in the request body as JSON.</p>
            </div>
            <div className={styles.concept}>
              <h3>Status Codes</h3>
              <p>
                <strong>201 Created:</strong> Request succeeded, new resource created<br/>
                <strong>400 Bad Request:</strong> Invalid input<br/>
                <strong>404 Not Found:</strong> Resource doesn't exist<br/>
                <strong>500 Server Error:</strong> Server error occurred
              </p>
            </div>
            <div className={styles.concept}>
              <h3>Prisma Queries</h3>
              <p>
                <strong>findUnique:</strong> Find one record by unique field<br/>
                <strong>create:</strong> Create a new record<br/>
                <strong>update:</strong> Modify existing record
              </p>
            </div>
            <div className={styles.concept}>
              <h3>Input Validation</h3>
              <p>Always validate user input before using it. Check for required fields, correct types, and valid ranges.</p>
            </div>
          </div>
        </section>

        {/* Challenges */}
        <section className={styles.section}>
          <h2>Challenge Yourself</h2>
          <div className={styles.challenges}>
            <div className={styles.challenge}>
              <h3>Challenge 1: Add Campaign Validation</h3>
              <p>
                Extend the endpoint to also verify that the campaign exists before creating the donation.
              </p>
            </div>
            <div className={styles.challenge}>
              <h3>Challenge 2: Add Amount Limits</h3>
              <p>
                Validate that the donation amount is within reasonable limits (e.g., max $1,000,000).
              </p>
            </div>
            <div className={styles.challenge}>
              <h3>Challenge 3: Transaction Support</h3>
              <p>
                Use Prisma transactions to ensure donation creation and campaign update happen together.
              </p>
            </div>
            <div className={styles.challenge}>
              <h3>Challenge 4: Add Logging</h3>
              <p>
                Implement request logging to track all donation creations for auditing purposes.
              </p>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className={styles.section}>
          <h2>Resources & Further Reading</h2>
          <ul className={styles.resourcesList}>
            <li><strong>Next.js Documentation:</strong> <code>https://nextjs.org/docs/app/building-your-application/routing/route-handlers</code></li>
            <li><strong>Prisma Documentation:</strong> <code>https://www.prisma.io/docs/orm/reference/prisma-client-reference</code></li>
            <li><strong>HTTP Status Codes:</strong> <code>https://developer.mozilla.org/en-US/docs/Web/HTTP/Status</code></li>
            <li><strong>REST API Design:</strong> <code>https://restfulapi.net/</code></li>
            <li><strong>Input Validation:</strong> <code>https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html</code></li>
          </ul>
        </section>

        {/* Navigation */}
        <div className={styles.navigation}>
          <Link href="/lessons" className={styles.backButton}>
            ← Back to Lessons
          </Link>
          <button className={styles.completeButton} onClick={() => alert('Great work! Lesson completed!')}>
            Mark as Complete ✓
          </button>
        </div>
      </div>
    </div>
  );
}
