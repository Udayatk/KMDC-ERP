'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ClientThemeProvider from '../components/ClientThemeProvider';

// Dynamically import components to prevent hydration issues
const LoginPage = dynamic(() => import('../components/auth/LoginPage'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '16px',
      color: '#666'
    }}>
      Loading...
    </div>
  )
});

const Dashboard = dynamic(() => import('../components/dashboard/Dashboard'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '16px',
      color: '#666'
    }}>
      Loading...
    </div>
  )
});

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Mock user data to prevent the undefined error
  const mockUserInfo = {
    employeeId: 'EMP001',
    employeeName: 'Demo User',
    ulbMappings: [
      {
        ulbId: 'ulb001',
        ulbName: 'Demo Municipal Corporation',
        roleType: 'Super Admin',
        district: 'Demo District'
      },
      {
        ulbId: 'ulb002',
        ulbName: 'Demo Municipal Council',
        roleType: 'Admin',
        district: 'Demo District'
      }
    ]
  };

  const mockSelectedULB = {
    ulbId: 'ulb001',
    ulbName: 'Demo Municipal Corporation',
    roleType: 'Super Admin',
    district: 'Demo District'
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Prevent hydration mismatch by only rendering client components after mount
  if (!isMounted) {
    return (
      <ClientThemeProvider>
        <main style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{ 
            fontSize: '16px',
            color: '#666'
          }}>
            Loading...
          </div>
        </main>
      </ClientThemeProvider>
    );
  }

  return (
    <ClientThemeProvider>
      <main>
        {isAuthenticated ? (
          <Dashboard 
            userInfo={mockUserInfo}
            selectedULB={mockSelectedULB}
            onLogout={handleLogout} 
          />
        ) : (
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        )}
      </main>
    </ClientThemeProvider>
  );
}