# MomCoin App - IONOS Deployment Guide

## Prerequisites

- IONOS Web Hosting Plus (or higher) with Node.js support
- FTP/SFTP credentials from IONOS
- Domain configured (app.momcoined.com)

## Step 1: Prepare the App for Production

### 1.1 Create `.env.local` file

Copy `env.example` to `.env.local` and fill in all values:

```bash
cp env.example .env.local
```

**Required Environment Variables:**

- Firebase credentials (from Firebase Console)
- `NEXT_PUBLIC_BASESCAN_API_KEY=` (Your Basescan API Key)
- `NEXT_PUBLIC_NEYNAR_API_KEY=` (Your Neynar API Key)
- `GOOGLE_API_KEY=` (Your Gemini API key)

### 1.2 Build the Application

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

## Step 2: IONOS Deployment Options

### Option A: Node.js Hosting (Recommended)

If your IONOS plan supports Node.js:

1. **Upload Files via SFTP:**
   - Upload entire project folder (including `.next`, `node_modules`, `package.json`)
   - Connect via SFTP to your IONOS server

2. **Install Dependencies on Server:**

   ```bash
   npm install --production
   ```

3. **Start the App:**

   ```bash
   npm start
   ```

4. **Configure Process Manager (PM2):**

   ```bash
   npm install -g pm2
   pm2 start npm --name "momcoin" -- start
   pm2 save
   pm2 startup
   ```

### Option B: Static Export (If Node.js Not Available)

If IONOS only supports static HTML:

1. **Update `next.config.ts`:**

   ```typescript
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   };
   ```

2. **Build Static Site:**

   ```bash
   npm run build
   ```

3. **Upload `out` folder:**
   - The `out` folder contains all static files
   - Upload to your IONOS web root (usually `/html` or `/public_html`)

**⚠️ Limitations of Static Export:**

- No API routes (webhooks, token stats won't work)
- No server-side rendering
- Firebase/Neynar calls will be client-side only

## Step 3: Configure Domain & SSL

1. **Point Domain to IONOS:**
   - In your domain registrar, set DNS to IONOS nameservers
   - Or add A record pointing to IONOS IP

2. **Enable SSL:**
   - In IONOS control panel, enable SSL/HTTPS for `app.momcoined.com`
   - Use Let's Encrypt (free)

## Step 4: Environment Variables on IONOS

If using Node.js hosting:

1. Create `.env.production` file on server
2. Add all environment variables
3. Restart the app

## Step 5: Post-Deployment Checklist

- [ ] Test wallet connection (Coinbase Wallet)
- [ ] Test daily claim functionality
- [ ] Verify Firebase data storage
- [ ] Test referral link generation
- [ ] Check Basescan API (token stats)
- [ ] Verify Farcaster Frame in Warpcast
- [ ] Test social tasks (X, Telegram, Farcaster)

## Troubleshooting

### Issue: "Module not found" errors

**Solution:** Run `npm install` on the server

### Issue: API routes not working

**Solution:** Ensure Node.js hosting is enabled, not static hosting

### Issue: Environment variables not loading

**Solution:** Check `.env.production` file exists and has correct values

### Issue: Build fails

**Solution:** Check `next.config.ts` and ensure all dependencies are installed

## Alternative: Deploy to Vercel (Recommended)

If IONOS doesn't support Node.js well, consider Vercel (free tier):

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Point `app.momcoined.com` to Vercel

**Advantages:**

- Automatic deployments
- Built-in SSL
- Edge functions
- Better Next.js support

## Support

For IONOS-specific issues:

- Contact IONOS support for Node.js setup
- Check IONOS documentation for deployment guides
