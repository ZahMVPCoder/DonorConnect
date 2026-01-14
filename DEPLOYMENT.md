# DonorConnect - Deployment Guide

## Deploy to Vercel

### Prerequisites
- A Vercel account (free at https://vercel.com)
- Your GitHub repository connected to Vercel
- Neon database set up and running

### Step-by-Step Deployment

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import from GitHub**
   - Select your `DonorConnect` repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: Leave as default (or set to `Dono-Management-System` if in subdirectory)
   - Click "Continue"

4. **Set Environment Variables**
   Add these variables under "Environment Variables":
   
   ```
   DATABASE_URL=your_neon_connection_string_here
   ```
   
   Get your Neon connection string from:
   - Go to https://console.neon.tech
   - Select your project
   - Click "Connection string"
   - Copy the full PostgreSQL connection URL

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (2-5 minutes)
   - You'll get a live URL like `https://yourproject.vercel.app`

### Post-Deployment Setup

1. **Run Database Migrations**
   - Connect to your project via SSH (or run migrations locally)
   - Ensure all Prisma migrations have been applied to your Neon database

2. **Create First Admin User**
   - Sign up through the app
   - Manually update the user role in Neon SQL Editor:
     ```sql
     UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
     ```

3. **Test Features**
   - Sign in with your admin account
   - Visit `/admin` to manage users
   - Try creating donors and viewing AI insights
   - Verify staff members have appropriate access

### Environment Variables Needed

```
DATABASE_URL=postgresql://user:password@host:port/database
```

### Features Included

✅ **Role-Based Access Control**
- Admin users can manage other users and change roles
- Staff users can view and manage donors
- Protected admin endpoints

✅ **AI-Powered Donor Insights**
- Analyzes donor giving patterns
- Generates personalized recommendations
- Identifies major donors, lapsed donors, and growth opportunities

✅ **Admin Dashboard**
- Manage team members
- Assign roles (Admin/Staff)
- View user activity

✅ **Real Data Management**
- PostgreSQL database with Neon
- Secure password hashing with bcrypt
- Full donor and donation tracking

### Monitoring & Logs

- Check deployment logs in Vercel dashboard
- Monitor database connections in Neon dashboard
- Use Vercel analytics for user activity

### Troubleshooting

**Issue**: Database connection failed
- Solution: Verify DATABASE_URL is correct and includes all parameters
- Check IP whitelist in Neon settings

**Issue**: Migrations not applied
- Solution: Ensure DATABASE_URL is set and run `npx prisma migrate deploy`

**Issue**: Admin features not showing
- Solution: Verify user role is set to 'admin' in database

### Support

For issues:
1. Check Vercel logs: Dashboard → Project → Deployments → View logs
2. Check Neon status: https://console.neon.tech
3. Review error messages in browser console

---

**Your live application is now deployed and ready to use!**
