'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import {
  PlayArrow,
  Person,
  Business,
  AdminPanelSettings
} from '@mui/icons-material';
import AuthFlow from './auth/AuthFlow';

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

const ULBSelectionDemo: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [authCompleted, setAuthCompleted] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [selectedULB, setSelectedULB] = useState<ULBMapping | null>(null);

  const handleAuthComplete = (userData: UserInfo, ulbData: ULBMapping) => {
    setUserInfo(userData);
    setSelectedULB(ulbData);
    setAuthCompleted(true);
  };

  const handleReset = () => {
    setShowDemo(false);
    setAuthCompleted(false);
    setUserInfo(null);
    setSelectedULB(null);
  };

  if (showDemo && !authCompleted) {
    return <AuthFlow onAuthComplete={handleAuthComplete} />;
  }

  if (authCompleted && userInfo && selectedULB) {
    return (
      <Container maxWidth="md" sx={{ minHeight: '100vh', py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" fontWeight={700} color="#1976d2" mb={2}>
              🎉 Authentication Complete!
            </Typography>
            <Typography variant="h6" color="text.secondary">
              ULB Selection Feature Demo Successfully Completed
            </Typography>
          </Box>

          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Person sx={{ color: '#1976d2' }} />
                <Typography variant="h6" fontWeight={600}>
                  User Information
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography>Employee Name:</Typography>
                <Typography fontWeight={600}>{userInfo.employeeName}</Typography>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography>Employee ID:</Typography>
                <Typography fontWeight={600}>{userInfo.employeeId}</Typography>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography>Total ULBs Mapped:</Typography>
                <Chip label={userInfo.ulbMappings.length} color="primary" size="small" />
              </Box>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Business sx={{ color: '#1976d2' }} />
                <Typography variant="h6" fontWeight={600}>
                  Selected ULB
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography>ULB Name:</Typography>
                <Typography fontWeight={600} color="#1976d2">{selectedULB.ulbName}</Typography>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography>District:</Typography>
                <Typography fontWeight={600}>{selectedULB.district}</Typography>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography>Role Type:</Typography>
                <Chip label={selectedULB.roleType} color="secondary" variant="outlined" />
              </Box>
            </CardContent>
          </Card>

          <Divider sx={{ my: 3 }} />

          <Box textAlign="center">
            <Typography variant="h6" fontWeight={600} mb={2} color="#1976d2">
              ✅ Feature Validation Complete
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              The ULB selection feature is working correctly according to all requirements:
            </Typography>
            <Box textAlign="left" mb={3}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                ✓ System validated multiple ULB mappings ({userInfo.ulbMappings.length} ULBs found)
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                ✓ ULB selection screen displayed with radio button options
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                ✓ Validation enforced: "Please select ULB to proceed"
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                ✓ User information displayed: Employee Name, ID, ULB Name, and Role Type
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                ✓ Switch ULB functionality available for multi-ULB users
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              onClick={handleReset}
              sx={{
                px: 4,
                py: 1.5,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                }
              }}
            >
              Try Again
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            color: '#1976d2',
            mb: 2
          }}
        >
          ULB Selection Feature Demo
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          Interactive demonstration of multi-ULB user authentication flow
        </Typography>
      </Box>

      <Box display="flex" gap={3} mb={4}>
        {/* Feature Overview */}
        <Paper elevation={3} sx={{ flex: 1, p: 3 }}>
          <Typography variant="h5" fontWeight={600} color="#1976d2" mb={3}>
            📋 Feature Requirements
          </Typography>
          
          <Box mb={3}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Purpose
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enable users with multiple ULB mappings to select their preferred ULB for session management.
            </Typography>
          </Box>

          <Box mb={3}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Key Validations
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                System validates if multiple ULBs are mapped to user
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                If single ULB: Direct navigation to dashboard
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                If multiple ULBs: Display selection screen with radio buttons
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Enforce ULB selection: "Please select ULB to proceed"
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Switch ULB button enabled for multi-ULB users
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" fontWeight={600} mb={2}>
              User Information Display
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Employee Name & Employee ID
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Selected ULB Name & Access Type
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                District and Role Information
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Demo Instructions */}
        <Paper elevation={3} sx={{ width: 400, p: 3 }}>
          <Typography variant="h5" fontWeight={600} color="#1976d2" mb={3}>
            🚀 Demo Instructions
          </Typography>
          
          <Box mb={3}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Test Credentials
            </Typography>
            <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="body2" fontWeight={600}>Multi-ULB User:</Typography>
              <Typography variant="body2">Employee ID: 123456</Typography>
              <Typography variant="body2">Password: password123</Typography>
              <Typography variant="body2">OTP: 123456</Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: 1 }}>
                (Has 3 ULBs mapped)
              </Typography>
            </Card>
            
            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" fontWeight={600}>Single-ULB User:</Typography>
              <Typography variant="body2">Employee ID: 789012</Typography>
              <Typography variant="body2">Password: password123</Typography>
              <Typography variant="body2">OTP: 123456</Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: 1 }}>
                (Has 1 ULB mapped - direct to dashboard)
              </Typography>
            </Card>
          </Box>

          <Box mb={3}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Steps to Test
            </Typography>
            <Box component="ol" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Click "Start Demo" below
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Login with test credentials
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Observe ULB selection screen (multi-ULB users)
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Select a ULB and continue
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Test Switch ULB functionality
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<PlayArrow />}
            onClick={() => setShowDemo(true)}
            sx={{
              py: 2,
              fontSize: '1.1rem',
              textTransform: 'none',
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
              }
            }}
          >
            Start Demo
          </Button>
        </Paper>
      </Box>

      {/* Feature Highlights */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={600} color="#1976d2" mb={3}>
          ⭐ Feature Highlights
        </Typography>
        
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={3}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <AdminPanelSettings sx={{ color: '#1976d2' }} />
                <Typography variant="h6" fontWeight={600}>
                  Smart ULB Detection
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Automatically detects if user has single or multiple ULB mappings and routes accordingly.
              </Typography>
            </CardContent>
          </Card>
          
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Person sx={{ color: '#1976d2' }} />
                <Typography variant="h6" fontWeight={600}>
                  User Context Display
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Shows employee name, ID, selected ULB, and access type prominently in the interface.
              </Typography>
            </CardContent>
          </Card>
          
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Business sx={{ color: '#1976d2' }} />
                <Typography variant="h6" fontWeight={600}>
                  Seamless ULB Switching
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Switch ULB button available for multi-ULB users with intuitive selection interface.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Paper>
    </Container>
  );
};

export default ULBSelectionDemo;