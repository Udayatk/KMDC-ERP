'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  Container,
  InputAdornment,
  IconButton,
  CircularProgress,
  Slide,
  Snackbar,
  Chip,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Divider,
  Avatar,
  Stack
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Refresh, 
  Security, 
  Person, 
  Phone, 
  VpnKey,
  CheckCircle,
  ErrorOutline,
  AccountBalance,
  Groups
} from '@mui/icons-material';
import ForgotPassword from './ForgotPassword';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const LoginPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(1); // ULB Login tab
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    password: '',
    otp: '',
    captcha: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [captchaText, setCaptchaText] = useState('Captcha23');
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setShowForgotPassword(false);
    clearForm();
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    
    // Employee ID validation - only allow 6 digits
    if (field === 'employeeId') {
      if (value.length > 6 || !/^\d*$/.test(value)) {
        return;
      }
    }
    
    // Password length validation
    if (field === 'password') {
      if (value.length > 12) {
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Employee ID validation
    if (!formData.employeeId) {
      newErrors.employeeId = 'Employee ID is mandatory';
    } else if (formData.employeeId.length !== 6) {
      newErrors.employeeId = 'Employee Id should be 6 digits';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is mandatory';
    } else if (formData.password.length < 8 || formData.password.length > 12) {
      newErrors.password = 'Password should be between 8 and 12 characters';
    }

    // OTP validation
    if (!formData.otp) {
      newErrors.otp = 'OTP is mandatory';
    }

    // CAPTCHA validation
    if (!formData.captcha) {
      newErrors.captcha = 'CAPTCHA is mandatory';
    } else if (formData.captcha !== captchaText) {
      newErrors.captcha = 'Incorrect CAPTCHA, please re-enter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (isLocked) {
      setErrors({ general: 'User ID is locked. Change password using forgot password link' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate login validation
      const isValidEmployee = formData.employeeId === '123456'; // Mock validation
      const isValidPassword = formData.password === 'password123'; // Mock validation

      if (!isValidEmployee) {
        setErrors({ general: 'Please Enter valid employee id' });
        return;
      }

      if (!isValidPassword) {
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);
        
        if (newAttemptCount >= 5) {
          setIsLocked(true);
          setErrors({ general: 'User ID is locked. Change password using forgot password link' });
        } else {
          setErrors({ 
            general: `Please enter correct password, left with ${5 - newAttemptCount} attempts` 
          });
        }
        clearForm();
        return;
      }

      // Reset attempt count on successful login
      setAttemptCount(0);
      setSuccessMessage('Login successful! Redirecting to dashboard...');
      
      // Simulate redirect delay
      setTimeout(() => {
        console.log('Redirecting to dashboard...');
        // Here you would typically redirect to dashboard
      }, 1500);
      
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const generateOTP = async () => {
    if (!formData.employeeId || formData.employeeId.length !== 6) {
      setErrors({ employeeId: 'Please enter a valid 6-digit Employee ID first' });
      return;
    }
    
    setOtpLoading(true);
    setErrors({});
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOtpSent(true);
      setSuccessMessage('OTP sent to your registered mobile number!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ general: 'Failed to send OTP. Please try again.' });
    } finally {
      setOtpLoading(false);
    }
  };

  const generateNewCaptcha = () => {
    const captchas = ['Captcha23', 'Secure45', 'Verify67', 'Check89', 'Guard12'];
    const newCaptcha = captchas[Math.floor(Math.random() * captchas.length)];
    setCaptchaText(newCaptcha);
    setFormData(prev => ({ ...prev, captcha: '' }));
  };

  const clearForm = () => {
    setFormData({
      employeeId: '',
      password: '',
      otp: '',
      captcha: ''
    });
    setErrors({});
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    clearForm();
  };

  if (showForgotPassword) {
    return <ForgotPassword onBackToLogin={handleBackToLogin} />;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.1)',
        zIndex: 1
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'float 20s ease-in-out infinite',
        zIndex: 0
      },
      '@keyframes float': {
        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
        '50%': { transform: 'translateY(-20px) rotate(180deg)' }
      }
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 2 }}>
        {/* Header */}
        <Slide direction="down" in={true} timeout={800}>
          <Paper elevation={12} sx={{ 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            color: 'white', 
            p: { xs: 2, md: 3 }, 
            mb: 2,
            borderRadius: 4,
            boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
            border: '2px solid rgba(255,255,255,0.2)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 2, md: 0 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              animation: 'shimmer 3s ease-in-out infinite',
            },
            '@keyframes shimmer': {
              '0%': { left: '-100%' },
              '100%': { left: '100%' }
            }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, textAlign: { xs: 'center', md: 'left' } }}>
              <Box sx={{
                width: { xs: 50, md: 70 },
                height: { xs: 50, md: 70 },
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(255,215,0,0.5)',
                fontSize: { xs: '20px', md: '28px' },
                fontWeight: 'bold',
                color: '#1e3a8a',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  animation: 'pulse 2s ease-in-out infinite'
                },
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)', opacity: 1 },
                  '50%': { transform: 'scale(1.1)', opacity: 0.7 }
                }
              }}>
                🏛️
              </Box>
              <Box>
                <Typography variant={{ xs: 'h5', md: 'h4' }} fontWeight="700" sx={{ 
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  letterSpacing: '0.5px',
                  background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Directorate of Municipal Administration
                </Typography>
                <Typography variant={{ xs: 'body1', md: 'h6' }} sx={{ 
                  opacity: 0.9,
                  fontWeight: 300,
                  letterSpacing: '1px',
                  mt: 0.5
                }}>
                  GOVERNMENT OF KARNATAKA
                </Typography>
                <Chip 
                  label="ERP System v2.0" 
                  size="small" 
                  sx={{ 
                    mt: 1, 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontSize: '10px' 
                  }} 
                />
              </Box>
            </Box>
            <Tooltip title="Access Employee Portal" arrow>
              <Button 
                variant="contained" 
                sx={{ 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: 3,
                  px: { xs: 3, md: 4 },
                  py: 1.5,
                  fontSize: { xs: '14px', md: '16px' },
                  fontWeight: 600,
                  textTransform: 'none',
                  minWidth: { xs: 'auto', md: '120px' },
                  '&:hover': { 
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%)',
                    transform: 'translateY(-2px) scale(1.05)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                    borderColor: 'rgba(255,255,255,0.5)'
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                🚀 Portal →
              </Button>
            </Tooltip>
        </Paper>

        {/* Navigation Bar */}
        <Paper elevation={4} sx={{ 
          background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)', 
          color: 'white', 
          p: 2, 
          mb: 3,
          borderRadius: 2,
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 500, letterSpacing: '0.5px' }}>🏠 Home</Typography>
        </Paper>

        {/* Login Form */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper elevation={12} sx={{ 
            width: '100%', 
            maxWidth: 520, 
            p: 4,
            borderRadius: 4,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.2)'
          }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                mb: 2
              }}>
                🔐 Employee Login Portal
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip 
                  icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4ade80', animation: 'pulse 2s infinite' }} />}
                  label="System Online" 
                  color="success" 
                  variant="outlined"
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  {new Date().toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              centered 
              sx={{ 
                mb: 4,
                '& .MuiTabs-indicator': {
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  height: 3,
                  borderRadius: 2
                }
              }}
            >
              <Tab 
                label="👤 Citizen" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: '16px',
                  textTransform: 'none',
                  borderRadius: 2,
                  mx: 1,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, rgba(30,58,138,0.1) 0%, rgba(59,130,246,0.1) 100%)',
                    color: '#1e3a8a'
                  }
                }} 
              />
              <Tab 
                label="🏢 ULB Login" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: '16px',
                  textTransform: 'none',
                  borderRadius: 2,
                  mx: 1,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, rgba(30,58,138,0.1) 0%, rgba(59,130,246,0.1) 100%)',
                    color: '#1e3a8a'
                  }
                }} 
              />
            </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Typography align="center" color="text.secondary">
              Citizen login functionality will be implemented here.
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {errors.general && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 3,
                  '& .MuiAlert-icon': {
                    fontSize: '24px'
                  }
                }}
              >
                {errors.general}
              </Alert>
            )}
            
            {successMessage && (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 3,
                  '& .MuiAlert-icon': {
                    fontSize: '24px'
                  }
                }}
              >
                {successMessage}
              </Alert>
            )}

              {/* Info Card */}
              <Card elevation={2} sx={{ 
                mb: 3, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                border: '1px solid #2196f3'
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                    💡 <strong>Demo Credentials:</strong> Employee ID: 123456, Password: password123
                  </Typography>
                </CardContent>
              </Card>
              
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="👤 User ID"
                  value={formData.employeeId}
                  onChange={handleInputChange('employeeId')}
                  error={!!errors.employeeId}
                  helperText={errors.employeeId}
                  fullWidth
                  inputProps={{ maxLength: 6 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.8)',
                      '&:hover fieldset': {
                        borderColor: '#3b82f6',
                        borderWidth: 2
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1e3a8a',
                        borderWidth: 2
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500
                    }
                  }}
                />

                <TextField
                  label="🔒 Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={!!errors.password}
                  helperText={errors.password}
                  fullWidth
                  inputProps={{ maxLength: 12, minLength: 8 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.8)',
                      '&:hover fieldset': {
                        borderColor: '#3b82f6',
                        borderWidth: 2
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1e3a8a',
                        borderWidth: 2
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{
                            color: '#1e3a8a',
                            '&:hover': {
                              background: 'rgba(30,58,138,0.1)'
                            }
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <Button
                  variant="contained"
                  onClick={generateOTP}
                  disabled={otpLoading || otpSent}
                  sx={{ 
                    background: (otpLoading || otpSent) ? '#64748b' : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                    borderRadius: 3,
                    py: 1.5,
                    fontSize: '16px',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: (otpLoading || otpSent) ? 'none' : '0 4px 16px rgba(30,58,138,0.3)',
                    minHeight: '48px',
                    '&:hover': { 
                      background: (otpLoading || otpSent) ? '#64748b' : 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                      transform: (otpLoading || otpSent) ? 'none' : 'translateY(-2px)',
                      boxShadow: (otpLoading || otpSent) ? 'none' : '0 6px 20px rgba(30,58,138,0.4)'
                    },
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                >
                  {otpLoading ? (
                    <>
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      Sending OTP...
                    </>
                  ) : otpSent ? (
                    '✅ OTP Sent'
                  ) : (
                    '📱 Generate OTP'
                  )}
                </Button>

                <TextField
                  label="📱 OTP"
                  value={formData.otp}
                  onChange={handleInputChange('otp')}
                  error={!!errors.otp}
                  helperText={errors.otp}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.8)',
                      '&:hover fieldset': {
                        borderColor: '#3b82f6',
                        borderWidth: 2
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1e3a8a',
                        borderWidth: 2
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500
                    }
                  }}
                />

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <TextField
                    label="🔤 CAPTCHA"
                    value={formData.captcha}
                    onChange={handleInputChange('captcha')}
                    error={!!errors.captcha}
                    helperText={errors.captcha}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        background: 'rgba(255,255,255,0.8)',
                        '&:hover fieldset': {
                          borderColor: '#3b82f6',
                          borderWidth: 2
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1e3a8a',
                          borderWidth: 2
                        }
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500
                      }
                    }}
                  />
                  <Paper elevation={3} sx={{ 
                    border: '2px solid #e5e7eb', 
                    p: 2, 
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
                    minWidth: '120px',
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'monospace',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#1e3a8a',
                    borderRadius: 3,
                    letterSpacing: '2px'
                  }}>
                    {captchaText}
                  </Paper>
                  <IconButton 
                    onClick={generateNewCaptcha} 
                    title="Generate new CAPTCHA"
                    sx={{
                      mt: 1,
                      color: '#1e3a8a',
                      background: 'rgba(30,58,138,0.1)',
                      borderRadius: 2,
                      '&:hover': {
                        background: 'rgba(30,58,138,0.2)',
                        transform: 'rotate(180deg)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Refresh />
                  </IconButton>
                </Box>

                <Button
                  variant="contained"
                  onClick={handleLogin}
                  disabled={isLocked || isLoading}
                  sx={{ 
                    background: (isLocked || isLoading) ? '#64748b' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    borderRadius: 3,
                    py: 2,
                    fontSize: '18px',
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: (isLocked || isLoading) ? 'none' : '0 4px 16px rgba(5,150,105,0.4)',
                    minHeight: '56px',
                    position: 'relative',
                    '&:hover': { 
                      background: (isLocked || isLoading) ? '#64748b' : 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                      transform: (isLocked || isLoading) ? 'none' : 'translateY(-2px) scale(1.02)',
                      boxShadow: (isLocked || isLoading) ? 'none' : '0 8px 25px rgba(5,150,105,0.6)'
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    '&::before': isLoading ? {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      animation: 'shimmer 1.5s ease-in-out infinite',
                    } : {}
                  }}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
                      Authenticating...
                    </>
                  ) : isLocked ? (
                    '🔒 Account Locked'
                  ) : (
                    '🚀 Login to Dashboard'
                  )}
                </Button>

                <Button
                  onClick={handleForgotPasswordClick}
                  sx={{ 
                    color: '#dc2626',
                    textTransform: 'none', 
                    fontSize: '16px',
                    fontWeight: 500,
                    borderRadius: 2,
                    py: 1,
                    '&:hover': {
                      background: 'rgba(220,38,38,0.1)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  🔑 Forgot Password ?
                </Button>
              </Box>
            </TabPanel>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;