'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  IconButton,
  Paper,
  InputAdornment,
  Fade,
  Alert,
  Slide,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Refresh,
  AccountCircle,
  Notifications,
  Person,
  Lock,
  VpnKey,
  Security,
  ArrowBack
} from '@mui/icons-material';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  // Steps: 1: Enter ID -> 2: Enter OTP/Captcha -> 3: Set Password
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    employeeId: '',
    otp: '',
    captcha: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [captchaText, setCaptchaText] = useState('Captcha23');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [alertInfo, setAlertInfo] = useState<{ show: boolean, message: string, severity: 'error' | 'success' | 'warning' }>({
    show: false,
    message: '',
    severity: 'error'
  });

  // Mock Data
  const VALID_ID = '123456';
  const VALID_OTP = '1234';

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const showAlert = (message: string, severity: 'error' | 'success' | 'warning' = 'error') => {
    setAlertInfo({ show: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlertInfo({ ...alertInfo, show: false });
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
      otp: '',
      captcha: '',
      newPassword: '',
      confirmPassword: ''
    });
    setStep(1);
    generateNewCaptcha();
  };

  // --- Handlers ---

  const handleGenerateOTP = async () => {
    // Validation
    if (!formData.employeeId) {
      showAlert('Employee ID is mandatory');
      return;
    }
    if (formData.employeeId !== VALID_ID) {
      showAlert('Entered Employee Id does not exist or ID is not active');
      return;
    }

    setIsLoading(true);
    // Simulate API
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);

    showAlert('OTP sent to registered mobile number', 'success');
    setResendTimer(30);
    setStep(2);
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      showAlert('OTP is mandatory');
      return;
    }
    if (!formData.captcha) {
      showAlert('CAPTCHA is mandatory');
      return;
    }

    // Mock OTP Check
    if (formData.otp !== VALID_OTP) {
      showAlert('Incorrect OTP');
      return;
    }

    // Captcha Check
    if (formData.captcha !== captchaText) {
      showAlert('Incorrect CAPTCHA, please re-enter');
      generateNewCaptcha();
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setIsLoading(false);

    showAlert('OTP Verified. Please set new password.', 'success');
    setStep(3);
  };

  const handleSetNewPassword = async () => {
    // 14. All fields mandatory
    if (!formData.newPassword || !formData.confirmPassword) {
      showAlert('All fields are mandatory to set new password');
      return;
    }

    // 13. Match Check
    if (formData.newPassword !== formData.confirmPassword) {
      showAlert('"New Password" and "Confirm New Password" does not match');
      return;
    }

    // 15. Length Check (8-12)
    if (formData.newPassword.length < 8 || formData.newPassword.length > 12) {
      showAlert('New password length must be between 8 and 12 characters');
      return;
    }

    // 16. Complexity Check
    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!complexityRegex.test(formData.newPassword)) {
      showAlert('Password must contain 1 Capital, 1 small, 1 special char and 1 number');
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsLoading(false);

    showAlert('Password updated successfully!', 'success');
    setTimeout(() => {
      onBackToLogin();
    }, 1500);
  };


  // Enhanced Input Styling
  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
      bgcolor: '#ffffff',
      '& fieldset': { 
        borderColor: '#cbd5e1', 
        borderWidth: 1,
        transition: 'all 0.2s ease-in-out'
      },
      '&:hover fieldset': { 
        borderColor: '#94a3b8',
        boxShadow: '0 0 0 4px rgba(0, 33, 71, 0.05)'
      },
      '&.Mui-focused fieldset': { 
        borderColor: '#002147', 
        borderWidth: 2,
        boxShadow: '0 0 0 4px rgba(0, 33, 71, 0.1)'
      },
      transition: 'all 0.2s ease-in-out',
      fontSize: '16px',
      '& .MuiInputBase-input': { 
        py: 1.5,
        px: 1.5
      }
    },
    '& .MuiInputLabel-root': { 
      color: '#64748b',
      fontWeight: 500,
      fontSize: '16px'
    },
    '& .MuiInputLabel-root.Mui-focused': { 
      color: '#002147',
      fontWeight: 600
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f1f5f9', display: 'flex', flexDirection: 'column' }}>
      <Snackbar
        open={alertInfo.show}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alertInfo.severity} sx={{ width: '100%', boxShadow: 3 }}>
          {alertInfo.message}
        </Alert>
      </Snackbar>

      {/* Top Accessibility Bar */}
      <Box sx={{ bgcolor: '#1e293b', color: '#cbd5e1', py: 0.5, px: 3, display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #334155' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="caption" sx={{ fontSize: '11px', mr: 2 }}>Skip to Main Content</Typography>
          {['A', 'A', '-', 'A', '+', 'En'].map((text, index) => (
            <Box
              key={index}
              component="button"
              sx={{
                border: '1px solid #475569',
                bgcolor: 'transparent',
                color: 'inherit',
                px: 1,
                fontSize: '10px',
                borderRadius: 0.5,
                cursor: 'pointer',
                '&:hover': { bgcolor: '#334155', color: 'white' },
                transition: 'all 0.2s'
              }}
            >
              {text}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Main Header */}
      <Box sx={{ bgcolor: 'white', py: 2, borderBottom: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'relative', zIndex: 10 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 0.5,
                  mr: 1
                }}
              >
                <img src="/images/karnataka_emblem.png" alt="Karnataka Government Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
                  Directorate of Municipal Administration
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#002147', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', mt: 0.5 }}>
                  Government of Karnataka
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5 }}>Helpline Number</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#002147' }}>1800-425-1111</Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Navigation Bar - Simpler for Forgot Password */}
      <Box sx={{ bgcolor: '#002147', height: 10, background: 'linear-gradient(to right, #002147, #0f172a)' }} />

      {/* Main Content */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 50%, #f8fafc 0%, #e2e8f0 100%)',
        p: 2
      }}>
        <Fade in timeout={800}>
          <Paper elevation={0} sx={{
            maxWidth: 900,
            width: '100%',
            display: 'flex',
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            bgcolor: 'white',
            minHeight: 500
          }}>
            {/* Left Side - Decorative */}
            <Box sx={{
              flex: 1,
              bgcolor: '#0f172a',
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'center',
              p: 6,
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#e2e8f0' }}>
                  Password Recovery
                </Typography>
                <Typography sx={{ color: '#94a3b8', mb: 4, lineHeight: 1.6 }}>
                  Reset your password securely. Follow the steps to verify your identity and restore access to your account.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: step >= 1 ? '#38bdf8' : '#94a3b8' }}>
                    <Box sx={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: '50%', 
                      border: '2px solid currentColor', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 'bold',
                      bgcolor: step >= 1 ? 'rgba(56, 189, 248, 0.1)' : 'transparent'
                    }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '16px' }}>1</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: step >= 1 ? 600 : 400, fontSize: '16px' }}>Verify Identity</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: step >= 2 ? '#38bdf8' : '#94a3b8' }}>
                    <Box sx={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: '50%', 
                      border: '2px solid currentColor', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 'bold',
                      bgcolor: step >= 2 ? 'rgba(56, 189, 248, 0.1)' : 'transparent'
                    }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '16px' }}>2</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: step >= 2 ? 600 : 400, fontSize: '16px' }}>Verify OTP</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: step >= 3 ? '#38bdf8' : '#94a3b8' }}>
                    <Box sx={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: '50%', 
                      border: '2px solid currentColor', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 'bold',
                      bgcolor: step >= 3 ? 'rgba(56, 189, 248, 0.1)' : 'transparent'
                    }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '16px' }}>3</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: step >= 3 ? 600 : 400, fontSize: '16px' }}>Set New Password</Typography>
                  </Box>
                </Box>
              </Box>
              {/* Abstract Circles */}
              <Box sx={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', border: '40px solid rgba(255,255,255,0.03)' }} />
            </Box>

            {/* Right Side - Form */}
            <Box sx={{ flex: 1.2, p: { xs: 3, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

              <Box sx={{ mb: 4 }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={onBackToLogin}
                  sx={{ 
                    color: '#64748b', 
                    mb: 2, 
                    fontWeight: 600,
                    '&:hover': { 
                      color: '#0f172a',
                      bgcolor: 'rgba(0, 0, 0, 0.03)'
                    },
                    textTransform: 'none',
                    borderRadius: 8
                  }}
                >
                  Back to Login
                </Button>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {step === 1 ? 'Forgot Password?' : step === 2 ? 'Enter Verification Code' : 'Create New Password'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
                  {step === 1 ? 'Enter your Employee ID to receive an OTP.' :
                    step === 2 ? 'We sent a code to your registered mobile number.' :
                      'Your new password must be different from previous used passwords.'}
                </Typography>
              </Box>

              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

                {/* Step 1: ID */}
                {step === 1 && (
                  <>
                    <TextField
                      fullWidth
                      label="Employee ID"
                      variant="outlined"
                      value={formData.employeeId}
                      onChange={(e) => {
                        if (e.target.value.length <= 6) setFormData({ ...formData, employeeId: e.target.value.replace(/\D/g, '') });
                      }}
                      placeholder="Enter 6-digit ID"
                      sx={inputStyles}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Person sx={{ color: '#94a3b8' }} /></InputAdornment>,
                      }}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleGenerateOTP}
                      disabled={isLoading}
                      sx={{
                        bgcolor: '#002147',
                        py: 1.8,
                        mt: 2,
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: '16px',
                        textTransform: 'none',
                        boxShadow: '0 4px 6px rgba(0, 33, 71, 0.1), 0 1px 3px rgba(0, 33, 71, 0.08)',
                        '&:hover': { 
                          bgcolor: '#001a38',
                          boxShadow: '0 10px 15px rgba(0, 33, 71, 0.15), 0 4px 6px rgba(0, 33, 71, 0.1)'
                        },
                        '&:disabled': {
                          bgcolor: '#64748b',
                          boxShadow: 'none'
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      {isLoading ? <CircularProgress size={24} color="inherit" thickness={4} /> : 'Generate OTP'}
                    </Button>
                  </>
                )}

                {/* Step 2: OTP */}
                {step === 2 && (
                  <>
                    <TextField
                      fullWidth
                      label="OTP"
                      variant="outlined"
                      value={formData.otp}
                      onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                      placeholder="Enter OTP"
                      sx={inputStyles}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><VpnKey sx={{ color: '#94a3b8' }} /></InputAdornment>,
                      }}
                    />

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
                      <TextField
                        fullWidth
                        label="Captcha"
                        variant="outlined"
                        value={formData.captcha}
                        onChange={(e) => setFormData({ ...formData, captcha: e.target.value })}
                        placeholder="Code"
                        sx={{ ...inputStyles, flex: 1 }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><Security sx={{ color: '#94a3b8' }} /></InputAdornment>,
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#f1f5f9', p: 1, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                        <Typography sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '18px', px: 1 }}>{captchaText}</Typography>
                        <IconButton size="small" onClick={generateNewCaptcha}><Refresh fontSize="small" /></IconButton>
                      </Box>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleVerifyOTP}
                      disabled={isLoading}
                      sx={{
                        bgcolor: '#002147',
                        py: 1.8,
                        mt: 2,
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: '16px',
                        textTransform: 'none',
                        boxShadow: '0 4px 6px rgba(0, 33, 71, 0.1), 0 1px 3px rgba(0, 33, 71, 0.08)',
                        '&:hover': { 
                          bgcolor: '#001a38',
                          boxShadow: '0 10px 15px rgba(0, 33, 71, 0.15), 0 4px 6px rgba(0, 33, 71, 0.1)'
                        },
                        '&:disabled': {
                          bgcolor: '#64748b',
                          boxShadow: 'none'
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      {isLoading ? <CircularProgress size={24} color="inherit" thickness={4} /> : 'Validate OTP'}
                    </Button>

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Button
                        disabled={resendTimer > 0}
                        onClick={handleGenerateOTP}
                        sx={{ textTransform: 'none', fontSize: '13px' }}
                      >
                        {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                      </Button>
                    </Box>
                  </>
                )}

                {/* Step 3: Password */}
                {step === 3 && (
                  <>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      variant="outlined"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder="8-12 chars, 1 Cap, 1 Num, 1 Spec"
                      sx={inputStyles}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#94a3b8' }} /></InputAdornment>,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      type="password"
                      variant="outlined"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Re-enter password"
                      sx={inputStyles}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#94a3b8' }} /></InputAdornment>,
                      }}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleSetNewPassword}
                      disabled={isLoading}
                      sx={{
                        bgcolor: '#002147',
                        py: 1.8,
                        mt: 2,
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: '16px',
                        textTransform: 'none',
                        boxShadow: '0 4px 6px rgba(0, 33, 71, 0.1), 0 1px 3px rgba(0, 33, 71, 0.08)',
                        '&:hover': { 
                          bgcolor: '#001a38',
                          boxShadow: '0 10px 15px rgba(0, 33, 71, 0.15), 0 4px 6px rgba(0, 33, 71, 0.1)'
                        },
                        '&:disabled': {
                          bgcolor: '#64748b',
                          boxShadow: 'none'
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      {isLoading ? <CircularProgress size={24} color="inherit" thickness={4} /> : 'Set New Password'}
                    </Button>
                  </>
                )}

                {/* Cancel Button */}
                <Button
                  onClick={onBackToLogin}
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: '#cbd5e1',
                    color: '#64748b',
                    py: 1.5,
                    borderRadius: 8,
                    '&:hover': { 
                      borderColor: '#94a3b8', 
                      bgcolor: 'rgba(0, 0, 0, 0.03)', 
                      color: '#1e293b' 
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Cancel
                </Button>

              </Box>
            </Box>
          </Paper>
        </Fade>
      </Box>

    </Box>
  );
};

export default ForgotPassword;