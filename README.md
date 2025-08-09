# SmileUp - Blockchain-Powered Social Impact Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Hedera](https://img.shields.io/badge/Hedera-Hashgraph-green)](https://hedera.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.13.0-purple)](https://www.prisma.io/)

> Transform passive social media engagement into real-world impact through seamless blockchain-powered donations.

## 🎯 **Overview**

SmileUp is a TikTok-style social feed where every interaction can become a meaningful contribution to environmental and social causes. Built on Hedera blockchain, it provides transparent, real-time micro-donations with immutable proof of impact.

### **Key Features**
- 🎥 **TikTok-style Social Feed** with environmental content
- 😊 **Facebook-style Reactions** - Hold smile button to donate 1-100 Smiles
- ⛓️ **Real-time Blockchain** - Every donation recorded on Hedera
- 👥 **Transparent Community Wallets** - Public transaction history
- 🤖 **AI-Powered Engagement** - Context and education through AI chat
- 🎮 **Gamification** - Missions, rewards, and leaderboards
- 📱 **Mobile-Responsive** - Works seamlessly on all devices

## 🏆 **Achievements**
- **2x Hackathon Winner** - Proven market validation
- **$2.3 Trillion Market Opportunity** - UN Sustainable Development Goals
- **4.9 Billion Potential Users** - Global social media audience

## 🌐 **Live Demo & Resources**

- **🚀 Live Application**: [https://smileup-impactchain.vercel.app/](https://smileup-impactchain.vercel.app/)
- **📊 Pitch Deck**: [Google Drive](https://drive.google.com/drive/folders/1n4SjoQuEVZ9q6MNBwcBk423hulTz-NOf)
- **🎬 Demo Video**: [YouTube](https://www.youtube.com/watch?v=E-JnVdnLjwc)

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL 14+
- Hedera Testnet Account
- Git

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd smileup-impactchain
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Setup**
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/smileup"

# JWT Authentication
JWT_ACCESS_SECRET="your-access-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# Hedera Configuration
HEDERA_OPERATOR_ID="0.0.xxxxx"
HEDERA_OPERATOR_PRIVATE_KEY="302e020100300506032b657004220420xxxxxxxx"
HEDERA_SMILES_TOKEN_ID="0.0.xxxxx"
HEDERA_NETWORK="testnet"

# Wallet Encryption
WALLET_ENCRYPTION_KEY="your-32-character-encryption-key"

# AI Integration
NEXT_PUBLIC_DIALOGFLOW_API_KEY="your-dialogflow-api-key"

# Optional: WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your-walletconnect-project-id"
```

### **4. Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database
npm run seed
```

### **5. Start Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📋 **Detailed Setup Guide**

### **Database Configuration**

#### **Local PostgreSQL Setup**
```bash
# macOS (using Homebrew)
brew install postgresql
brew services start postgresql

# Create database
createdb smileup

# Windows
# Download and install PostgreSQL from https://www.postgresql.org/download/windows/
# Create database through pgAdmin or command line
```

#### **Cloud Database (Supabase)**
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings > Database
4. Update `DATABASE_URL` in `.env.local`

### **Hedera Configuration**

#### **1. Create Hedera Testnet Account**
1. Visit [portal.hedera.com](https://portal.hedera.com)
2. Create account and get:
   - Account ID (e.g., `0.0.123456`)
   - Private Key

#### **2. Deploy Smiles Token**
```bash
# Run token deployment script
node mint-test-tokens.js
```

#### **3. Update Environment Variables**
```env
HEDERA_OPERATOR_ID="your-account-id"
HEDERA_OPERATOR_PRIVATE_KEY="your-private-key"
HEDERA_SMILES_TOKEN_ID="deployed-token-id"
```

### **AI Integration (DialogFlow)**

#### **1. Create DialogFlow Project**
1. Visit [dialogflow.cloud.google.com](https://dialogflow.cloud.google.com)
2. Create new project
3. Get API key from Settings > General

#### **2. Update Environment Variable**
```env
NEXT_PUBLIC_DIALOGFLOW_API_KEY="your-dialogflow-api-key"
```

## 🛠 **Available Scripts**

### **Development**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### **Database Management**
```bash
npm run seed         # Seed database with sample data
npm run db:push      # Push schema changes to database
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio
```

### **Deployment**
```bash
npm run deploy:check # Check deployment readiness
npm run deploy:build # Build for deployment
npm run deploy:vercel # Deploy to Vercel
```

### **Database Backup/Restore**
```bash
npm run db:backup    # Create database backup
npm run db:restore   # Restore from backup
npm run db:fresh     # Setup fresh database
```

## 🏗 **Project Structure**

```
smileup-impactchain/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── feed/           # Feed page
│   │   ├── profile/        # Profile page
│   │   └── ...
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── feed/          # Feed-related components
│   │   ├── ui/            # UI components
│   │   └── ...
│   ├── lib/               # Utility libraries
│   │   ├── database/      # Database configuration
│   │   ├── hedera/        # Hedera integration
│   │   ├── services/      # Business logic services
│   │   └── ...
│   └── contexts/          # React contexts
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── plans/                 # Project documentation
├── scripts/               # Utility scripts
└── database-backups/      # Database backups
```

## 🔧 **Configuration**

### **Environment Variables**

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `JWT_ACCESS_SECRET` | JWT access token secret | ✅ |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | ✅ |
| `HEDERA_OPERATOR_ID` | Hedera account ID | ✅ |
| `HEDERA_OPERATOR_PRIVATE_KEY` | Hedera private key | ✅ |
| `HEDERA_SMILES_TOKEN_ID` | Smiles token ID | ✅ |
| `WALLET_ENCRYPTION_KEY` | 32-character encryption key | ✅ |
| `NEXT_PUBLIC_DIALOGFLOW_API_KEY` | DialogFlow API key | ❌ |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID | ❌ |

### **Database Schema**

Key models include:
- **User** - User accounts and profiles
- **Community** - Environmental organizations
- **FeedPost** - Social media content
- **CustodialWallet** - User wallets
- **CommunityWallet** - Organization wallets
- **Mission** - Gamified challenges
- **Reward** - Marketplace items

## 🚀 **Deployment**

### **Vercel Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Environment Variables for Production**
Set all environment variables in Vercel dashboard:
1. Go to Project Settings > Environment Variables
2. Add all variables from `.env.local`
3. Ensure `DATABASE_URL` points to production database

### **Database Migration**
```bash
# Generate migration
npx prisma migrate dev --name migration-name

# Deploy migration
npx prisma migrate deploy
```

## 🧪 **Testing**

### **API Testing**
```bash
# Test authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@smileup.com","password":"demo123"}'

# Test feed API
curl http://localhost:3000/api/feed

# Test donation
curl -X POST http://localhost:3000/api/feed/[post-id]/donate \
  -H "Authorization: Bearer [token]" \
  -H "Content-Type: application/json" \
  -d '{"amount":5}'
```

### **Database Testing**
```bash
# Open Prisma Studio
npm run db:studio

# Check database connection
npm run db:check
```

## 📚 **Documentation**

### **API Documentation**
- [API Routes Overview](plans/10_API_documentation.md)
- [Authentication Guide](plans/09_authentication_enhancement_report.md)
- [Blockchain Integration](plans/20_blockchain_integration_implementation.md)

### **Development Guides**
- [Database Setup](plans/13_ui_developer_database_guide.md)
- [Cross-Platform Setup](plans/16_cross_platform_troubleshooting.md)
- [Vercel Deployment](plans/25_vercel_deployment_guide.md)

### **Demo & Presentation**
- [5-Minute Demo Script](plans/32_5_minute_demo_script.md)
- [Pitch Deck Content](plans/33_pitch_deck_content.md)
- [AI Video Script](plans/36_ai_video_script_summary.md)

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### **Code Standards**
- Use TypeScript for all new code
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Database Connection Issues**
```bash
# Check database connection
npm run db:check

# Reset database
npm run db:fresh
```

#### **Hedera Integration Issues**
```bash
# Check token association
curl http://localhost:3000/api/test/check-token-association

# Recreate wallets
curl http://localhost:3000/api/test/recreate-wallets
```

#### **Build Issues**
```bash
# Clear cache
rm -rf .next
npm run build

# Check TypeScript
npm run type-check
```

### **Getting Help**
- Check [plans/](plans/) directory for detailed guides
- Review [scripts/](scripts/) for utility scripts
- Open an issue with detailed error description

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Hedera Hashgraph** for blockchain infrastructure
- **Next.js** for the React framework
- **Prisma** for database ORM
- **DialogFlow** for AI integration
- **Vercel** for deployment platform

---

**SmileUp - Where Engagement Meets Impact** 🌱✨
