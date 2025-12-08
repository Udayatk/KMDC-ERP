'use client';

import React, { useState } from 'react';
import LoginPage from './LoginPage';
import SelectULB from './SelectULB';

interface ULBMapping {
  ulbId: string;
  ulbName: string;
  roleType: string;
  district: string;
}

interface UserInfo {
  employeeId: string;
  employeeName: string;
  ulbMappings: ULBMapping[];
}

interface AuthFlowProps {
  onAuthComplete?: (userInfo: UserInfo, selectedULB: ULBMapping) => void;
}

const AuthFlow: React.FC<AuthFlowProps> = ({ onAuthComplete }) => {
  const [currentStep, setCurrentStep] = useState<'login' | 'selectULB' | 'dashboard'>('login');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [selectedULB, setSelectedULB] = useState<ULBMapping | null>(null);

  // Mock user data with different scenarios
  const mockUsers: { [key: string]: UserInfo } = {
    '123456': {
      employeeId: '123456',
      employeeName: 'John Doe',
      ulbMappings: [
        {
          ulbId: 'ulb001',
          ulbName: 'Bangalore City Corporation',
          roleType: 'Super Admin',
          district: 'Bangalore Urban'
        },
        {
          ulbId: 'ulb002',
          ulbName: 'Mysore City Corporation',
          roleType: 'Admin',
          district: 'Mysore'
        },
        {
          ulbId: 'ulb003',
          ulbName: 'Hubli-Dharwad Municipal Corporation',
          roleType: 'Officer',
          district: 'Dharwad'
        }
      ]
    },
    '789012': {
      employeeId: '789012',
      employeeName: 'Jane Smith',
      ulbMappings: [
        {
          ulbId: 'ulb004',
          ulbName: 'Mangalore City Corporation',
          roleType: 'Admin',
          district: 'Dakshina Kannada'
        }
      ]
    }
  };

  const handleLoginSuccess = () => {
    // Mock: Get user info based on employee ID
    // In real implementation, this would come from the login API response
    const employeeId = '123456'; // This would come from login form
    const userData = mockUsers[employeeId];

    if (userData) {
      setUserInfo(userData);
      
      // System should validate if there are multiple ULB (more than 1) mapped to user
      if (userData.ulbMappings.length > 1) {
        // If there are more than 1 ULB mapped, system should display the ULB selection
        setCurrentStep('selectULB');
      } else {
        // If there are no multiple ULB mapped, system should navigate to dashboard
        const singleULB = userData.ulbMappings[0];
        setSelectedULB(singleULB);
        if (onAuthComplete) {
          onAuthComplete(userData, singleULB);
        }
        setCurrentStep('dashboard');
      }
    }
  };

  const handleULBSelected = (selectedULBData: ULBMapping) => {
    setSelectedULB(selectedULBData);
    if (userInfo && onAuthComplete) {
      onAuthComplete(userInfo, selectedULBData);
    }
    setCurrentStep('dashboard');
  };

  const handleSwitchULB = () => {
    // "Switch ULB" button when clicked should direct the user to select ULB selection landing page
    setCurrentStep('selectULB');
    setSelectedULB(null);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
      
      case 'selectULB':
        return userInfo ? (
          <SelectULB 
            userInfo={userInfo}
            onULBSelected={handleULBSelected}
            onSwitchULB={selectedULB ? handleSwitchULB : undefined}
          />
        ) : null;
      
      case 'dashboard':
        // This would render the main dashboard
        // For now, we'll just show a placeholder
        return (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <h2>Welcome to Dashboard</h2>
            {userInfo && selectedULB && (
              <div style={{ textAlign: 'center' }}>
                <p><strong>Employee:</strong> {userInfo.employeeName} ({userInfo.employeeId})</p>
                <p><strong>ULB:</strong> {selectedULB.ulbName}</p>
                <p><strong>Role:</strong> {selectedULB.roleType}</p>
                {userInfo.ulbMappings.length > 1 && (
                  <button 
                    onClick={handleSwitchULB}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginTop: '20px'
                    }}
                  >
                    Switch ULB
                  </button>
                )}
              </div>
            )}
          </div>
        );
      
      default:
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return <>{renderCurrentStep()}</>;
};

export default AuthFlow;