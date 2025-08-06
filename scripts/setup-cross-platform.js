const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🔄 Setting up cross-platform environment...\n');

// Detect platform
const platform = os.platform();
const isWindows = platform === 'win32';
const isMac = platform === 'darwin';

console.log(`📱 Detected platform: ${platform} (${isWindows ? 'Windows' : isMac ? 'macOS' : 'Linux'})`);

// Create environment file
const envPath = path.join(__dirname, '../.env.local');
const envContent = `# Cross-Platform Database Configuration
# Generated for ${platform}

# Database Configuration
${isWindows 
  ? 'DATABASE_URL="postgresql://postgres:your_postgres_password@localhost:5432/smileup_dev"'
  : 'DATABASE_URL="postgresql://your_username@localhost:5432/smileup_dev"'
}

# JWT Configuration
JWT_ACCESS_SECRET=smileup-access-secret-key-2024
JWT_REFRESH_SECRET=smileup-refresh-secret-key-2024

# Hedera Configuration (for wallet features)
HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID=0.0.123456
HEDERA_OPERATOR_PRIVATE_KEY=302e020100300506032b657004220420...
HEDERA_SMILES_TOKEN_ID=0.0.123456

# WalletConnect Configuration
NEXT_PUBLIC_HEDERA_NETWORK=testnet
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-wallet-connect-project-id
NEXT_PUBLIC_HEDERA_SMILES_TOKEN_ID=0.0.123456

# Wallet Encryption
WALLET_ENCRYPTION_KEY=your-wallet-encryption-key-here
`;

// Write environment file
fs.writeFileSync(envPath, envContent);
console.log('✅ Environment file created: .env.local');

// Platform-specific instructions
console.log('\n📋 Platform-specific setup instructions:');

if (isWindows) {
  console.log(`
🪟 Windows Setup:
1. Install PostgreSQL 14.18 from: https://www.postgresql.org/download/windows/
2. During installation, set a password for the 'postgres' user
3. Update .env.local with your PostgreSQL password
4. Create database: psql -U postgres -c "CREATE DATABASE smileup_dev;"
5. Push schema: npx prisma db push
6. Generate client: npx prisma generate
7. Restore data: node scripts/database-restore.js database-backups/latest-backup.json
`);
} else {
  console.log(`
🍎 macOS/Linux Setup:
1. Install PostgreSQL: brew install postgresql (macOS) or sudo apt-get install postgresql (Linux)
2. Start service: brew services start postgresql (macOS) or sudo systemctl start postgresql (Linux)
3. Create database: createdb smileup_dev
4. Push schema: npx prisma db push
5. Generate client: npx prisma generate
6. Restore data: node scripts/database-restore.js database-backups/latest-backup.json
`);
}

console.log(`
🔧 Common Commands:
- Check PostgreSQL: ${isWindows ? 'sc query postgresql-x64-14' : 'brew services list | grep postgresql'}
- Connect to database: ${isWindows ? 'psql -U postgres -d smileup_dev' : 'psql -d smileup_dev'}
- Start development: npm run dev
- Open database GUI: npx prisma studio

📚 Documentation:
- Windows Guide: plans/15_windows_database_setup_guide.md
- Cross-Platform Guide: plans/16_cross_platform_troubleshooting.md
- General Guide: plans/13_ui_developer_database_guide.md
`);

console.log('\n✨ Cross-platform setup completed!');
console.log('📝 Remember to update .env.local with your actual database credentials.'); 