#!/usr/bin/env node

/**
 * Test Authentication Flow
 * 
 * This script tests the complete authentication flow to identify issues:
 * 1. Login with demo account
 * 2. Test token validation
 * 3. Test API calls with authentication
 * 4. Test token refresh
 */

require('dotenv').config({ path: '.env.local' });

const BASE_URL = 'http://localhost:3000';

async function testAuthFlow() {
  console.log('🧪 Testing Authentication Flow...\n');

  let accessToken = null;
  let refreshToken = null;

  try {
    // Step 1: Test Login
    console.log('1️⃣ Testing Login...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'demo@smileup.com',
        password: 'demo123'
      })
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      console.error('❌ Login failed:', errorData);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    console.log('   - User:', loginData.data.user.name);
    console.log('   - Access Token Length:', loginData.data.accessToken.length);
    console.log('   - Refresh Token Length:', loginData.data.refreshToken.length);

    accessToken = loginData.data.accessToken;
    refreshToken = loginData.data.refreshToken;

    // Step 2: Test API call with valid token
    console.log('\n2️⃣ Testing API call with valid token...');
    const feedResponse = await fetch(`${BASE_URL}/api/feed`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (feedResponse.ok) {
      const feedData = await feedResponse.json();
      console.log('✅ Feed API call successful');
      console.log('   - Posts count:', feedData.posts?.length || 0);
    } else {
      console.error('❌ Feed API call failed:', feedResponse.status);
    }

    // Step 3: Test donation API with valid token
    console.log('\n3️⃣ Testing donation API with valid token...');
    
    // Get a real post ID from the database
    let realPostId = null;
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      const post = await prisma.feedPost.findFirst();
      if (post) {
        realPostId = post.id;
        console.log('   - Using real post ID:', realPostId);
      }
      await prisma.$disconnect();
    } catch (error) {
      console.log('   - Could not get real post ID, using placeholder');
      realPostId = 'test-post-id';
    }
    
    const donateResponse = await fetch(`${BASE_URL}/api/feed/${realPostId}/donate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ amount: 1 })
    });

    if (donateResponse.ok) {
      const donateData = await donateResponse.json();
      console.log('✅ Donation API call successful');
      console.log('   - Response:', donateData);
    } else {
      const errorData = await donateResponse.json();
      console.log('⚠️  Donation API call result:', donateResponse.status);
      console.log('   - Error:', errorData);
    }

    // Step 4: Test token refresh
    console.log('\n4️⃣ Testing token refresh...');
    const refreshResponse = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken })
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      console.log('✅ Token refresh successful');
      console.log('   - New access token length:', refreshData.data.accessToken.length);
      
      // Test API call with new token
      const newFeedResponse = await fetch(`${BASE_URL}/api/feed`, {
        headers: {
          'Authorization': `Bearer ${refreshData.data.accessToken}`
        }
      });

      if (newFeedResponse.ok) {
        console.log('✅ API call with refreshed token successful');
      } else {
        console.error('❌ API call with refreshed token failed:', newFeedResponse.status);
      }
    } else {
      const errorData = await refreshResponse.json();
      console.error('❌ Token refresh failed:', errorData);
    }

    // Step 5: Test expired/invalid token
    console.log('\n5️⃣ Testing expired/invalid token...');
    const invalidTokenResponse = await fetch(`${BASE_URL}/api/feed`, {
      headers: {
        'Authorization': 'Bearer invalid_token_here'
      }
    });

    if (invalidTokenResponse.status === 401) {
      console.log('✅ Invalid token properly rejected (401)');
    } else {
      console.log('⚠️  Invalid token response:', invalidTokenResponse.status);
    }

    // Step 6: Test without token
    console.log('\n6️⃣ Testing API call without token...');
    const noTokenResponse = await fetch(`${BASE_URL}/api/feed`);
    
    if (noTokenResponse.ok) {
      console.log('✅ Public feed accessible without token');
    } else {
      console.log('⚠️  Feed requires authentication:', noTokenResponse.status);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }

  console.log('\n🏁 Authentication flow test completed!');
}

// Run the test
testAuthFlow().catch(console.error); 