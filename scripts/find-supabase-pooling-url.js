#!/usr/bin/env node

console.log('🔍 Supabase Connection Pooling Guide');
console.log('====================================');
console.log('');

console.log('📋 Steps to find your connection pooling URL:');
console.log('');
console.log('1. Go to your Supabase Dashboard');
console.log('   https://supabase.com/dashboard');
console.log('');
console.log('2. Select your project');
console.log('');
console.log('3. Navigate to Settings > Database');
console.log('');
console.log('4. Scroll down to "Connection pooling" section');
console.log('');
console.log('5. Look for a URL that looks like:');
console.log('   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres');
console.log('');
console.log('6. Copy that URL and update your Vercel DATABASE_URL');
console.log('');

console.log('🔧 Alternative: If connection pooling is not available, try:');
console.log('postgresql://postgres:nGLXeC%212ash%40%215r@db.qteeytrnhunqxahmhuea.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1&pool_timeout=20');
console.log('');

console.log('⚠️  Common Issues:');
console.log('- Database might be paused (check Supabase dashboard)');
console.log('- IP restrictions might be blocking Vercel');
console.log('- Connection pooling might be disabled');
console.log('- Database might be in a different region');
console.log('');

console.log('📞 If issues persist:');
console.log('1. Check Supabase status: https://status.supabase.com/');
console.log('2. Verify database is active in Supabase dashboard');
console.log('3. Try enabling connection pooling in Supabase settings');
console.log('4. Contact Supabase support if needed'); 