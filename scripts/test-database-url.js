#!/usr/bin/env node

const { URL } = require('url');

// Test the URL encoding
const originalUrl = "postgresql://postgres:nGLXeC!2ash@!5r@db.qteeytrnhunqxahmhuea.supabase.co:5432/postgres";
const encodedUrl = "postgresql://postgres:nGLXeC%212ash%40%215r@db.qteeytrnhunqxahmhuea.supabase.co:5432/postgres";

console.log('🔍 Database URL Validation');
console.log('========================');

console.log('\n❌ Original URL (with special characters):');
console.log(originalUrl);

console.log('\n✅ Encoded URL (URL-safe):');
console.log(encodedUrl);

console.log('\n🔧 Manual encoding:');
console.log('! -> %21');
console.log('@ -> %40');

console.log('\n📋 For Vercel Environment Variables:');
console.log('DATABASE_URL=' + encodedUrl);

// Test URL parsing
try {
  const url = new URL(encodedUrl);
  console.log('\n✅ URL parsing successful:');
  console.log('Protocol:', url.protocol);
  console.log('Hostname:', url.hostname);
  console.log('Port:', url.port);
  console.log('Database:', url.pathname.slice(1));
} catch (error) {
  console.log('\n❌ URL parsing failed:', error.message);
}

console.log('\n💡 Instructions:');
console.log('1. Copy the encoded URL above');
console.log('2. Go to your Vercel dashboard');
console.log('3. Navigate to Settings > Environment Variables');
console.log('4. Update DATABASE_URL with the encoded version');
console.log('5. Redeploy your application'); 