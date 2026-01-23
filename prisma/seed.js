import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.donor.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const hashedPassword = await bcrypt.hash('lpuser1', 10);
  await prisma.user.create({
    data: {
      email: 'rob@launchpadphilly.org',
      username: 'robdemo',
      password: hashedPassword,
      role: 'admin',
    },
  });

  // Create donors
  const donors = await Promise.all([
    prisma.donor.create({
      data: {
        name: 'John Smith',
        email: 'john.smith@email.com',
        status: 'Active',
      },
    }),
    prisma.donor.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        status: 'Active',
      },
    }),
    prisma.donor.create({
      data: {
        name: 'Mike Davis',
        email: 'mdavis@email.com',
        status: 'Major',
      },
    }),
    prisma.donor.create({
      data: {
        name: 'Emily Brown',
        email: 'ebrown@email.com',
        status: 'Lapsed',
      },
    }),
    prisma.donor.create({
      data: {
        name: 'Robert Wilson',
        email: 'rwilson@email.com',
        status: 'Active',
      },
    }),
  ]);

  // Create campaigns
  const campaigns = await Promise.all([
    prisma.campaign.create({
      data: {
        name: 'Annual Fund 2025',
        status: 'Active',
        goal: 20000,
        raised: 12450,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
      },
    }),
    prisma.campaign.create({
      data: {
        name: 'Building Fund',
        status: 'Active',
        goal: 50000,
        raised: 18200,
        startDate: new Date('2025-06-01'),
        endDate: new Date('2026-06-30'),
      },
    }),
    prisma.campaign.create({
      data: {
        name: 'Education Programs',
        status: 'Active',
        goal: 15000,
        raised: 8500,
        startDate: new Date('2025-09-01'),
        endDate: new Date('2025-12-31'),
      },
    }),
  ]);

  // Create donations
  await Promise.all([
    prisma.donation.create({
      data: {
        amount: 500,
        date: new Date('2025-12-15'),
        donorId: donors[0].id,
        campaignId: campaigns[0].id,
      },
    }),
    prisma.donation.create({
      data: {
        amount: 250,
        date: new Date('2025-12-14'),
        donorId: donors[1].id,
        campaignId: campaigns[1].id,
      },
    }),
    prisma.donation.create({
      data: {
        amount: 1000,
        date: new Date('2025-12-13'),
        donorId: donors[2].id,
        campaignId: campaigns[0].id,
      },
    }),
    prisma.donation.create({
      data: {
        amount: 100,
        date: new Date('2025-12-08'),
        donorId: donors[3].id,
        campaignId: campaigns[2].id,
      },
    }),
    prisma.donation.create({
      data: {
        amount: 300,
        date: new Date('2025-12-10'),
        donorId: donors[4].id,
        campaignId: campaigns[0].id,
      },
    }),
  ]);

  // Create tasks
  await Promise.all([
    prisma.task.create({
      data: {
        title: 'Thank you call - John Smith ($500 donation)',
        type: 'Thank You',
        priority: 'High',
        status: 'Pending',
        dueDate: new Date('2025-12-17'),
        donorId: donors[0].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Follow-up email - Sarah Johnson',
        type: 'Follow-up',
        priority: 'Medium',
        status: 'Pending',
        dueDate: new Date('2025-12-18'),
        donorId: donors[1].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Send quarterly report to board',
        type: 'Administrative',
        priority: 'High',
        status: 'Pending',
        dueDate: new Date('2025-12-20'),
      },
    }),
  ]);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
