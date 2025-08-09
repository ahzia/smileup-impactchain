#!/usr/bin/env node

console.log('🔧 Vercel Database URL Generator');
console.log('================================');
console.log('');

console.log('📋 To fix the prepared statement error on Vercel, you need to:');
console.log('');

console.log('1. Go to your Supabase Dashboard');
console.log('   https://supabase.com/dashboard');
console.log('');

console.log('2. Select your project');
console.log('');

console.log('3. Navigate to Settings > Database');
console.log('');

console.log('4. Find the "Connection pooling" section');
console.log('');

console.log('5. Copy the connection pooling URL (it should look like):');
console.log('   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres');
console.log('');

console.log('6. Add these parameters to the URL:');
console.log('   ?pgbouncer=true&connection_limit=1&pool_timeout=20&prepared_statements=false');
console.log('');

console.log('7. Final URL should look like:');
console.log('   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&pool_timeout=20&prepared_statements=false');
console.log('');

console.log('8. Update your Vercel environment variable DATABASE_URL with this URL');
console.log('');

console.log('🔧 Alternative (if no connection pooling):');
console.log('Use the direct connection with URL encoding:');
console.log('DATABASE_URL=postgresql://postgres:nGLXeC%212ash%40%215r@db.qteeytrnhunqxahmhuea.supabase.co:5432/postgres');
console.log('');

console.log('⚠️  Key Points:');
console.log('- The prepared_statements=false parameter is crucial');
console.log('- This tells Prisma not to use prepared statements');
console.log('- This eliminates the naming conflicts in connection pools');
console.log('- Local development will continue to work as is');
console.log('');

console.log('🚀 After updating the environment variable:');
console.log('1. Redeploy your application');
console.log('2. The prepared statement error should be resolved');
console.log('3. Your API endpoints should work properly'); 