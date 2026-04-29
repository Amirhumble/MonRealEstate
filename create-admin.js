// Quick script to create an admin user for testing
import fetch from 'node-fetch';

const createAdmin = async () => {
  try {
    const response = await fetch('http://localhost:4444/api/auth/create-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Admin User',
        email: 'admin@monrealestate.com',
        password: 'admin123'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Admin created successfully:', data);
    } else {
      console.log('❌ Error creating admin:', data);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
};

createAdmin();