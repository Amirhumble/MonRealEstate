#!/usr/bin/env node

/**
 * Simple test script to verify JWT authentication system
 * Run with: node test-auth.js
 */

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4444/api';

// Test credentials
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'testpassword123'
};

let accessToken = null;
let cookies = null;

async function makeRequest(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
      ...(cookies && { 'Cookie': cookies }),
      ...options.headers
    }
  });

  // Extract cookies from response
  if (response.headers.get('set-cookie')) {
    cookies = response.headers.get('set-cookie');
  }

  return response;
}

async function testAuthFlow() {
  console.log('🚀 Testing JWT Authentication System\n');

  try {
    // 1. Test Registration
    console.log('1. Testing Registration...');
    const registerResponse = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(testUser)
    });

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      accessToken = registerData.accessToken;
      console.log('✅ Registration successful');
      console.log(`   Access Token: ${accessToken.substring(0, 20)}...`);
      console.log(`   User: ${registerData.user.name} (${registerData.user.email})`);
    } else {
      const error = await registerResponse.json();
      console.log(`❌ Registration failed: ${error.message}`);
      
      // Try login instead
      console.log('\n2. Trying Login instead...');
      const loginResponse = await makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        accessToken = loginData.accessToken;
        console.log('✅ Login successful');
        console.log(`   Access Token: ${accessToken.substring(0, 20)}...`);
      } else {
        const loginError = await loginResponse.json();
        console.log(`❌ Login failed: ${loginError.message}`);
        return;
      }
    }

    // 2. Test Protected Route
    console.log('\n3. Testing Protected Route...');
    const profileResponse = await makeRequest('/auth/profile');
    
    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      console.log('✅ Profile access successful');
      console.log(`   User: ${profileData.user.name} (${profileData.user.role})`);
    } else {
      console.log('❌ Profile access failed');
    }

    // 3. Test Token Refresh
    console.log('\n4. Testing Token Refresh...');
    const refreshResponse = await makeRequest('/auth/refresh', {
      method: 'POST'
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      const newAccessToken = refreshData.accessToken;
      console.log('✅ Token refresh successful');
      console.log(`   New Access Token: ${newAccessToken.substring(0, 20)}...`);
      console.log(`   Tokens are different: ${accessToken !== newAccessToken}`);
      accessToken = newAccessToken;
    } else {
      const refreshError = await refreshResponse.json();
      console.log(`❌ Token refresh failed: ${refreshError.message}`);
    }

    // 4. Test Logout
    console.log('\n5. Testing Logout...');
    const logoutResponse = await makeRequest('/auth/logout', {
      method: 'POST'
    });

    if (logoutResponse.ok) {
      console.log('✅ Logout successful');
      
      // Try to access protected route after logout
      console.log('\n6. Testing Protected Route After Logout...');
      const postLogoutResponse = await makeRequest('/auth/profile');
      
      if (postLogoutResponse.status === 401) {
        console.log('✅ Protected route correctly blocked after logout');
      } else {
        console.log('❌ Protected route still accessible after logout');
      }
    } else {
      console.log('❌ Logout failed');
    }

    console.log('\n🎉 Authentication system test completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${API_BASE}/auth/profile`);
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running. Please start the backend server first:');
    console.log('   cd backend && npm run dev');
    return;
  }

  await testAuthFlow();
}

main().catch(console.error);