#!/usr/bin/env node

/**
 * Test Database Connection Script
 * 
 * This script tests the database connection and provides helpful feedback
 * for troubleshooting connection issues.
 */

require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...\n');

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.log('💡 Please add DATABASE_URL to your .env.local file');
    process.exit(1);
  }

  console.log('✅ DATABASE_URL is configured');
  console.log(`📊 Database URL: ${process.env.DATABASE_URL.replace(/:[^:@]*@/, ':***@')}\n`);

  const prisma = new PrismaClient();

  try {
    // Test connection
    console.log('🔄 Testing connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful!\n');

    // Test basic query
    console.log('🔄 Testing basic query...');
    const userCount = await prisma.user.count();
    console.log(`✅ Query successful! Found ${userCount} users\n`);

    // Test schema
    console.log('🔄 Testing schema...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log('✅ Schema accessible! Available tables:');
    tables.forEach(table => {
      console.log(`   - ${table.table_name}`);
    });

    console.log('\n🎉 Database connection test completed successfully!');
    console.log('💡 You can now run the application with: npm run dev');

  } catch (error) {
    console.error('\n❌ Database connection failed!');
    console.error('Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   1. Make sure PostgreSQL is running');
      console.log('   2. Check if the database exists');
      console.log('   3. Verify your DATABASE_URL format');
      console.log('   4. Try: brew services start postgresql (macOS)');
    } else if (error.code === 'P1001') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   1. Check your DATABASE_URL format');
      console.log('   2. Verify database credentials');
      console.log('   3. Ensure database exists');
      console.log('   4. Try: createdb smileup');
    } else if (error.code === 'P1017') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   1. Database server rejected the connection');
      console.log('   2. Check firewall settings');
      console.log('   3. Verify database is accepting connections');
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testDatabaseConnection().catch(console.error); 