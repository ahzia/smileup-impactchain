const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

function validateEnvironment() {
  console.log('🔍 Validating Hedera Environment Variables...\n');

  const required = [
    'HEDERA_OPERATOR_ID',
    'HEDERA_OPERATOR_PRIVATE_KEY',
    'HEDERA_OPERATOR_PUBLIC_KEY',
    'HEDERA_NETWORK'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`  - ${key}`));
    console.error('\nPlease add these to your .env.local file');
    process.exit(1);
  }

  console.log('✅ All required environment variables are set');
  
  // Validate Account ID format
  const accountId = process.env.HEDERA_OPERATOR_ID;
  if (!accountId.match(/^\d+\.\d+\.\d+$/)) {
    console.error('❌ Invalid HEDERA_OPERATOR_ID format. Expected: 0.0.123456');
    console.error(`   Found: ${accountId}`);
    process.exit(1);
  }

  console.log('✅ Account ID format is valid');

  // Validate Private Key format (should be DER encoded)
  const privateKey = process.env.HEDERA_OPERATOR_PRIVATE_KEY;
  if (!privateKey.startsWith('302e020100300506032b657004220420')) {
    console.log('⚠️  Private key format may not be DER encoded');
    console.log('   Expected to start with: 302e020100300506032b657004220420');
    console.log(`   Found: ${privateKey.substring(0, 32)}...`);
  } else {
    console.log('✅ Private key format appears to be DER encoded');
  }

  // Validate Public Key format (should be DER encoded)
  const publicKey = process.env.HEDERA_OPERATOR_PUBLIC_KEY;
  if (!publicKey.startsWith('302a300506032b6570032100')) {
    console.log('⚠️  Public key format may not be DER encoded');
    console.log('   Expected to start with: 302a300506032b6570032100');
    console.log(`   Found: ${publicKey.substring(0, 32)}...`);
  } else {
    console.log('✅ Public key format appears to be DER encoded');
  }

  // Validate Network
  const network = process.env.HEDERA_NETWORK;
  if (!['testnet', 'mainnet'].includes(network)) {
    console.error('❌ Invalid HEDERA_NETWORK. Must be "testnet" or "mainnet"');
    console.error(`   Found: ${network}`);
    process.exit(1);
  }

  console.log(`✅ Network is set to: ${network}`);

  // Display summary
  console.log('\n📊 Environment Summary:');
  console.log(`   Account ID: ${accountId}`);
  console.log(`   Network: ${network}`);
  console.log(`   Private Key: ${privateKey.substring(0, 32)}...`);
  console.log(`   Public Key: ${publicKey.substring(0, 32)}...`);

  console.log('\n✅ Environment validation completed successfully!');
}

validateEnvironment(); 