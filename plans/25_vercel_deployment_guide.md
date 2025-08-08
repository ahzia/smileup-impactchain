# 🚀 Vercel Deployment Guide for SmileUp ImpactChain

## 📋 Prerequisites

- ✅ **Database**: Already deployed (PostgreSQL)
- ✅ **Environment Variables**: Configured locally
- ✅ **GitHub Repository**: Code is in a Git repository
- ✅ **Vercel Account**: [Sign up at vercel.com](https://vercel.com)

## 🎯 Deployment Steps

### 1. **Prepare Your Repository**

Ensure your code is committed and pushed to GitHub:

```bash
# Check current status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Prepare for Vercel deployment"

# Push to GitHub
git push origin main
```

### 2. **Configure Environment Variables**

Before deploying, you need to set up environment variables in Vercel. You'll need to add all the variables from your `.env.local` file.

#### **Required Environment Variables:**

```env
# Database
DATABASE_URL="your_postgresql_connection_string"

# JWT Authentication
JWT_ACCESS_SECRET="your_jwt_access_secret"
JWT_REFRESH_SECRET="your_jwt_refresh_secret"

# Hedera Blockchain
HEDERA_OPERATOR_ID="your_hedera_operator_id"
HEDERA_OPERATOR_PRIVATE_KEY="your_hedera_operator_private_key"
HEDERA_SMILES_TOKEN_ID="your_smiles_token_id"
HEDERA_NETWORK="testnet" # or "mainnet"

# Wallet Encryption
WALLET_ENCRYPTION_KEY="your_wallet_encryption_key"

# DialogFlow (Optional - for AI chat)
NEXT_PUBLIC_DIALOGFLOW_API_KEY="your_dialogflow_api_key"

# WalletConnect (Optional - for external wallet integration)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="your_wallet_connect_project_id"
```

### 3. **Deploy to Vercel**

#### **Option A: Deploy via Vercel Dashboard**

1. **Connect Repository**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository containing your SmileUp ImpactChain code

2. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `smileup-impactchain` (if your project is in a subdirectory)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

3. **Add Environment Variables**:
   - In the project settings, go to "Environment Variables"
   - Add each variable from your `.env.local` file
   - Make sure to add them to all environments (Production, Preview, Development)

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application

#### **Option B: Deploy via Vercel CLI**

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd smileup-impactchain
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Set up environment variables
   - Deploy

### 4. **Post-Deployment Configuration**

#### **Database Migration**

After deployment, you need to run database migrations:

```bash
# Using Vercel CLI
vercel env pull .env.local
npx prisma db push

# Or via Vercel Dashboard
# Go to your project → Functions → Create a new API route for migration
```

#### **Verify Deployment**

1. **Check Build Logs**: Ensure no build errors
2. **Test Functionality**: 
   - User authentication
   - Database connections
   - Blockchain interactions
   - AI chat functionality

### 5. **Custom Domain (Optional)**

1. **Add Domain**:
   - Go to your Vercel project dashboard
   - Navigate to "Domains"
   - Add your custom domain

2. **Configure DNS**:
   - Follow Vercel's DNS configuration instructions
   - Update your domain's nameservers or add DNS records

## 🔧 Troubleshooting

### **Common Issues & Solutions**

#### **1. Build Failures**

**Issue**: Build fails during deployment
**Solution**:
```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm run build --verbose
# Ensure all dependencies are in package.json
```

#### **2. Environment Variables Not Working**

**Issue**: App can't access environment variables
**Solution**:
- Verify all variables are added to Vercel dashboard
- Check variable names match exactly
- Ensure variables are added to all environments

#### **3. Database Connection Issues**

**Issue**: Can't connect to database
**Solution**:
- Verify `DATABASE_URL` is correct
- Check database allows external connections
- Ensure database is accessible from Vercel's servers

#### **4. Hedera Network Issues**

**Issue**: Blockchain operations fail
**Solution**:
- Verify `HEDERA_NETWORK` is set correctly
- Check operator credentials are valid
- Ensure token ID is correct

### **4. Performance Optimization**

#### **Enable Vercel Analytics**

```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to your app
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### **Optimize Images**

```bash
# Use Next.js Image optimization
import Image from 'next/image';

<Image
  src="/your-image.jpg"
  alt="Description"
  width={500}
  height={300}
  priority
/>
```

## 📊 Monitoring & Analytics

### **Vercel Analytics**
- Real-time performance metrics
- User behavior tracking
- Error monitoring

### **Database Monitoring**
- Monitor database performance
- Check connection pool usage
- Track query performance

## 🔄 Continuous Deployment

### **Automatic Deployments**
- Every push to `main` branch triggers deployment
- Preview deployments for pull requests
- Automatic rollback on failures

### **Environment Management**
- Production: `main` branch
- Preview: `develop` branch
- Development: feature branches

## 🚀 Final Checklist

- ✅ [ ] Code committed and pushed to GitHub
- ✅ [ ] Environment variables configured in Vercel
- ✅ [ ] Database connection string updated
- ✅ [ ] Build successful
- ✅ [ ] All features tested
- ✅ [ ] Custom domain configured (if needed)
- ✅ [ ] Analytics enabled
- ✅ [ ] Team members have access

## 📞 Support

If you encounter issues:

1. **Check Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
2. **Review Build Logs**: In Vercel dashboard
3. **Test Locally**: `npm run build` and `npm start`
4. **Check Environment Variables**: Verify all are set correctly

## 🎉 Deployment Complete!

Your SmileUp ImpactChain application is now live on Vercel! 

**Next Steps**:
1. Share the deployment URL with your team
2. Set up monitoring and analytics
3. Configure custom domain if needed
4. Set up CI/CD for future updates

---

*Last Updated: [Current Date]*
*Version: 1.0* 