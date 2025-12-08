'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
  Slide,
  Snackbar,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import {
  Business,
  Person,
  Badge,
  LocationOn,
  ArrowForward,
  SwapHoriz
} from '@mui/icons-material';

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

interface SelectULBProps {
  userInfo: UserInfo;
  onULBSelected: (selectedULB: ULBMapping) => void;
  onSwitchULB?: () => void;
}

const SelectULB: React.FC<SelectULBProps> = ({ 
  userInfo, 
  onULBSelected,
  onSwitchULB
}) => {
  const [selectedULB, setSelectedULB] = useState<string>('');
  const [alertInfo, setAlertInfo] = useState<{
    show: boolean;
    message: string;
    severity: 'error' | 'success' | 'warning';
  }>({
    show: false,
    message: '',
    severity: 'error'
  });

  const showAlert = (message: string, severity: 'error' | 'success' | 'warning' = 'error') => {
    setAlertInfo({ show: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlertInfo(prev => ({ ...prev, show: false }));
  };

  const handleContinue = () => {
    // Validation: User must select a ULB
    if (!selectedULB) {
      showAlert('Please select ULB to proceed');
      return;
    }

    const selectedULBData = userInfo.ulbMappings.find(ulb => ulb.ulbId === selectedULB);
    if (selectedULBData) {
      onULBSelected(selectedULBData);
    }
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedULB(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            color: '#1976d2',
            mb: 1
          }}
        >
          Select ULB
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Choose your preferred ULB to continue
        </Typography>
      </Box>

      <Box display="flex" gap={3}>
        {/* Main Selection Panel */}
        <Paper elevation={3} sx={{ flex: 1, p: 3 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Business sx={{ color: '#1976d2', mr: 2, fontSize: 28 }} />
            <Typography variant="h6" fontWeight={600}>
              Available ULBs
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" mb={3}>
            You have access to multiple ULBs. Please select one to continue with your session.
          </Typography>

          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              value={selectedULB}
              onChange={handleRadioChange}
              sx={{ gap: 2 }}
            >
              {userInfo.ulbMappings.map((ulb) => (
                <Card 
                  key={ulb.ulbId}
                  variant="outlined"
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: selectedULB === ulb.ulbId ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    backgroundColor: selectedULB === ulb.ulbId ? '#f3f7ff' : 'white',
                    '&:hover': {
                      backgroundColor: '#f8f9fa',
                      borderColor: '#1976d2'
                    }
                  }}
                  onClick={() => setSelectedULB(ulb.ulbId)}
                >
                  <CardContent sx={{ py: 2 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center" flex={1}>
                        <FormControlLabel
                          value={ulb.ulbId}
                          control={<Radio sx={{ color: '#1976d2' }} />}
                          label=""
                          sx={{ m: 0, mr: 2 }}
                        />
                        
                        <Box flex={1}>
                          <Typography variant="h6" fontWeight={600} color="#1976d2">
                            {ulb.ulbName}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={2} mt={1}>
                            <Chip
                              label={ulb.roleType}
                              size="small"
                              color="primary"
                              variant="outlined"
                              icon={<Badge />}
                            />
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {ulb.district}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </FormControl>

          <Box mt={4} display="flex" justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={handleContinue}
              endIcon={<ArrowForward />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                }
              }}
            >
              Continue
            </Button>
          </Box>
        </Paper>

        {/* User Info Sidebar */}
        <Paper elevation={3} sx={{ width: 320, p: 3 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Person sx={{ color: '#1976d2', mr: 2, fontSize: 28 }} />
            <Typography variant="h6" fontWeight={600}>
              User Information
            </Typography>
          </Box>

          <Box textAlign="center" mb={3}>
            <Avatar
              sx={{ 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 2, 
                bgcolor: '#1976d2',
                fontSize: '2rem'
              }}
            >
              {userInfo.employeeName.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6" fontWeight={600} color="#1976d2">
              {userInfo.employeeName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Employee ID: {userInfo.employeeId}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={2}>
              Access Summary
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Total ULBs:</Typography>
              <Chip 
                label={userInfo.ulbMappings.length} 
                size="small" 
                color="primary"
              />
            </Box>
            {selectedULB && (
              <>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Selected ULB:</Typography>
                  <Typography variant="body2" fontWeight={600} color="#1976d2">
                    {userInfo.ulbMappings.find(ulb => ulb.ulbId === selectedULB)?.ulbName}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="body2">Access Type:</Typography>
                  <Typography variant="body2" fontWeight={600} color="#1976d2">
                    {userInfo.ulbMappings.find(ulb => ulb.ulbId === selectedULB)?.roleType}
                  </Typography>
                </Box>
              </>
            )}
          </Box>

          {/* Switch ULB Button - Only show if onSwitchULB is provided */}
          {onSwitchULB && (
            <>
              <Divider sx={{ my: 3 }} />
              <Button
                variant="outlined"
                fullWidth
                onClick={onSwitchULB}
                startIcon={<SwapHoriz />}
                sx={{
                  textTransform: 'none',
                  py: 1.5,
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#f3f7ff',
                    borderColor: '#1565c0'
                  }
                }}
              >
                Switch ULB
              </Button>
            </>
          )}
        </Paper>
      </Box>

      {/* Alert Snackbar */}
      <Snackbar
        open={alertInfo.show}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alertInfo.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SelectULB;