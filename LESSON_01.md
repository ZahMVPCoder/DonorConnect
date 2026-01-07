# Lesson 01: POST Donation Endpoint

## Overview

This lesson focuses on building a POST API route that handles donation creation with proper validation and database integration using Prisma.

## Learning Objectives

By completing this lesson, you will understand:

1. ✅ How to extract and validate data from a POST request body
2. ✅ How to implement input validation (required fields, data types, ranges)
3. ✅ How to perform database lookups with Prisma
4. ✅ How to handle errors and return appropriate HTTP status codes
5. ✅ How to create and update database records
6. ✅ How to return meaningful error messages to clients

## Task

Implement a POST endpoint at `/api/donations` that:

1. **Validates Request Data**:
   - Checks for required fields: `donorId` and `amount`
   - Validates that `amount` is a positive number
   - Optional field: `campaignId`

2. **Performs Database Lookups**:
   - Verifies the donor exists before creating a donation
   - Verifies the campaign exists (if provided)
   - Returns appropriate 404 errors if not found

3. **Creates Donation Records**:
   - Creates a new donation in the database
   - Links it to the donor
   - Links it to a campaign (if provided)
   - Updates the campaign's raised amount (if applicable)

4. **Handles Errors Gracefully**:
   - Returns 400 for validation errors
   - Returns 404 for missing donors/campaigns
   - Returns 500 for server errors
   - Includes descriptive error messages

## Success Criteria

- ✅ POST request with valid data creates donation (201)
- ✅ Invalid donor ID returns 404 with clear message
- ✅ Negative amount is rejected (400)
- ✅ Missing required fields return 400 error
- ✅ Campaign is updated with the donation amount
- ✅ Response includes created donation details

## Implementation

The endpoint is located at `app/api/donations/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { donorId, amount, campaignId } = body;

    // Validation
    if (!donorId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: donorId and amount are required' },
        { status: 400 }
      );
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    // Check if donor exists
    const donor = await prisma.donor.findUnique({
      where: { id: donorId },
    });

    if (!donor) {
      return NextResponse.json(
        { error: `Donor with ID ${donorId} not found` },
        { status: 404 }
      );
    }

    // Check if campaign exists (if provided)
    if (campaignId) {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) {
        return NextResponse.json(
          { error: `Campaign with ID ${campaignId} not found` },
          { status: 404 }
        );
      }
    }

    // Create donation
    const donation = await prisma.donation.create({
      data: {
        amount,
        donorId,
        campaignId: campaignId || null,
      },
      include: {
        donor: true,
        campaign: true,
      },
    });

    // Update campaign raised amount if applicable
    if (campaignId) {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          raised: {
            increment: amount,
          },
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Donation created successfully',
        donation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Testing the Endpoint

### Example 1: Valid Donation

**Request:**
```bash
curl -X POST http://localhost:3000/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "donorId": "donor-123",
    "amount": 500,
    "campaignId": "campaign-456"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Donation created successfully",
  "donation": {
    "id": "donation-789",
    "amount": 500,
    "date": "2025-12-15T10:30:00.000Z",
    "donorId": "donor-123",
    "campaignId": "campaign-456",
    "donor": { ... },
    "campaign": { ... }
  }
}
```

### Example 2: Missing Donor

**Request:**
```bash
curl -X POST http://localhost:3000/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "donorId": "invalid-id",
    "amount": 500
  }'
```

**Response (404):**
```json
{
  "error": "Donor with ID invalid-id not found"
}
```

### Example 3: Negative Amount

**Request:**
```bash
curl -X POST http://localhost:3000/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "donorId": "donor-123",
    "amount": -100
  }'
```

**Response (400):**
```json
{
  "error": "Amount must be a positive number"
}
```

### Example 4: Missing Fields

**Request:**
```bash
curl -X POST http://localhost:3000/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500
  }'
```

**Response (400):**
```json
{
  "error": "Missing required fields: donorId and amount are required"
}
```

## Key Concepts

### 1. Request Body Parsing
```typescript
const body = await req.json();
const { donorId, amount, campaignId } = body;
```
Extract JSON data from the POST request body.

### 2. Input Validation
```typescript
if (!donorId || !amount) {
  return NextResponse.json(
    { error: 'Missing required fields' },
    { status: 400 }
  );
}

if (typeof amount !== 'number' || amount <= 0) {
  return NextResponse.json(
    { error: 'Amount must be a positive number' },
    { status: 400 }
  );
}
```
Validate data types and constraints before processing.

### 3. Database Lookups
```typescript
const donor = await prisma.donor.findUnique({
  where: { id: donorId },
});

if (!donor) {
  return NextResponse.json(
    { error: 'Donor not found' },
    { status: 404 }
  );
}
```
Check if related records exist before creating new ones.

### 4. Creating Records
```typescript
const donation = await prisma.donation.create({
  data: {
    amount,
    donorId,
    campaignId: campaignId || null,
  },
  include: {
    donor: true,
    campaign: true,
  },
});
```
Create a new record and include related data in the response.

### 5. Updating Related Records
```typescript
if (campaignId) {
  await prisma.campaign.update({
    where: { id: campaignId },
    data: {
      raised: {
        increment: amount,
      },
    },
  });
}
```
Update related records to maintain data consistency.

### 6. HTTP Status Codes
- `201`: Created (successful creation)
- `400`: Bad Request (validation error)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

## Challenges & Extensions

1. **Add Request Logging**: Log all incoming requests for debugging
2. **Add Rate Limiting**: Prevent abuse by limiting requests per IP
3. **Add Authentication**: Secure the endpoint with JWT tokens
4. **Add Pagination**: Return paginated results for GET requests
5. **Add Filtering**: Allow filtering donations by date range or campaign
6. **Add Unit Tests**: Write tests for validation and error handling

## Next Steps

Once comfortable with this lesson, explore:
- GET endpoints with query parameters
- PUT/PATCH endpoints for updating records
- DELETE endpoints with proper authorization
- Complex database queries with Prisma
- Error handling middleware
- Request validation libraries (e.g., Zod, Joi)

## Resources

- [Next.js API Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [HTTP Status Codes Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [REST API Best Practices](https://restfulapi.net/)
