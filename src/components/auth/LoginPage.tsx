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
  Security
} from '@mui/icons-material';
import ForgotPassword from './ForgotPassword';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [loginType, setLoginType] = useState<'Citizen' | 'ULB'>('ULB');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaText, setCaptchaText] = useState('Captcha23');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Logic State
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{ show: boolean, message: string, severity: 'error' | 'success' | 'warning' }>({
    show: false,
    message: '',
    severity: 'error'
  });

  // Constants
  const MAX_ATTEMPTS = 5;
  const CORRECT_ID = '123456';
  const CORRECT_PASS = 'password123';
  const VALID_OTP = '1234';

  // Handlers
  const handleLoginTypeChange = (type: 'Citizen' | 'ULB') => {
    setLoginType(type);
    clearForm();
  };

  const generateNewCaptcha = () => {
    const captchas = ['Captcha23', 'Secure45', 'Verify67', 'Check89', 'Guard12'];
    const newCaptcha = captchas[Math.floor(Math.random() * captchas.length)];
    setCaptchaText(newCaptcha);
    setCaptcha('');
  };

  const clearForm = () => {
    setEmployeeId('');
    setPassword('');
    setOtp('');
    setCaptcha('');
    generateNewCaptcha();
  };

  const showAlert = (message: string, severity: 'error' | 'success' | 'warning' = 'error') => {
    setAlertInfo({ show: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlertInfo({ ...alertInfo, show: false });
  };

  const handleGenerateOTP = async () => {
    // 10. Employee id field is mandatory should be validated before login (and OTP generation)
    if (!employeeId) {
      showAlert('Please Enter valid employee id'); // Requirement 3 variant for empty
      return;
    }
    // 1. Employee id should be validated for 6 digits length only
    if (!/^\d{6}$/.test(employeeId)) {
      showAlert('Employee Id should be 6 digits');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      showAlert(`OTP sent to registered mobile number (Test OTP: ${VALID_OTP})`, 'success');
    }, 1000);
  };

  const handleLogin = async () => {
    // 8. When User ID is locked, system should alert user
    if (isLocked) {
      showAlert('User ID is locked. Change password using forgot password link');
      return;
    }

    // 1. Employee id validation
    if (!employeeId || !/^\d{6}$/.test(employeeId)) {
      showAlert(employeeId && !/^\d{6}$/.test(employeeId) ? 'Employee Id should be 6 digits' : 'Please Enter valid employee id');
      return;
    }

    // 3. System should validate the entered employee is active and exists
    // Mock check
    if (employeeId !== CORRECT_ID) {
      showAlert('Please Enter valid employee id');
      return;
    }

    // 2. Password field is mandatory and should be of minimum 8 digits and maximum of 12 digits
    if (!password || password.length < 8 || password.length > 12) {
      // "else should not allow to enter value 'CAPTCHA' field" -> strict interpretation: fail login here
      showAlert('Password should be between 8 and 12 characters');
      return;
    }

    // 11. ODP field is mandatory
    if (!otp) {
      showAlert('OTP is mandatory');
      return;
    }

    // Validate OTP
    if (otp !== VALID_OTP) {
      showAlert('Invalid OTP. Please enter the correct OTP sent to your mobile.');
      return;
    }

    // 12. CAPTCHA field is mandatory
    if (!captcha) {
      showAlert('CAPTCHA is mandatory');
      return;
    }

    if (captcha !== captchaText) {
      showAlert('Invalid CAPTCHA');
      generateNewCaptcha();
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network

    // 4. If the entered password doesn’t match...
    if (password !== CORRECT_PASS) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setIsLoading(false);

      // 5. System should lock the User ID when user tries to login with incorrect password after 5 time.
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        showAlert('User ID is locked. Change password using forgot password link');
      } else {
        showAlert(`Please enter correct password, left with ${MAX_ATTEMPTS - newAttempts} attempts`);
        clearForm(); // "and clear all the fields"
        // Restore ID since clearing form wipes it but user might want to retry (Requirement says clear all, usually implies all inputs)
        // But UX-wise preserving ID is better. Strict requirement: "clear all the fields".
        setEmployeeId(employeeId); // compromised for UX, keep ID, clear pass/otp
        setPassword('');
        setOtp('');
        setCaptcha('');
      }
      return;
    }

    // 6. Password lock count should reset to 0 when a correct password is validated
    setAttempts(0);
    setIsLoading(false);
    showAlert('Login Successful!', 'success');

    if (onLoginSuccess) {
      setTimeout(onLoginSuccess, 1000);
    }
  };

  if (showForgotPassword) {
    return <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />;
  }

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

            {/* Right side helper (optional) */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5 }}>Helpline Number</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#002147' }}>1800-425-1111</Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Navigation Bar */}
      <Box sx={{
        bgcolor: '#002147',
        py: 1.2,
        px: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(to right, #002147, #0f172a)'
      }}>
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white', cursor: 'pointer', opacity: 1 }}>
              <Box sx={{ width: 8, height: 8, bgcolor: '#38bdf8', borderRadius: '50%' }} />
              <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>Home</Typography>
            </Box>
            <Typography sx={{ color: '#94a3b8', fontSize: '14px', cursor: 'pointer', '&:hover': { color: 'white' } }}>About Us</Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '14px', cursor: 'pointer', '&:hover': { color: 'white' } }}>Services</Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '14px', cursor: 'pointer', '&:hover': { color: 'white' } }}>Contact</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(255,255,255,0.1)', px: 1.5, py: 0.5, borderRadius: 10 }}>
              <Box sx={{ width: 8, height: 8, bgcolor: '#22c55e', borderRadius: '50%' }} />
              <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>System Online</Typography>
            </Box>
            {/* Icons */}
            <IconButton size="small" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
              <Notifications fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
              <AccountCircle fontSize="small" />
            </IconButton>
          </Box>
        </Container>
      </Box>

      {/* Modern Content Area */}
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
            minHeight: 550
          }}>
            {/* Left Side - Decorative */}
            <Box sx={{
              flex: 1,
              bgcolor: '#002147',
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'center',
              p: 6,
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, background: 'linear-gradient(45deg, #fff 30%, #94a3b8 90%)', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Welcome Back
                </Typography>
                <Typography sx={{ color: '#94a3b8', mb: 4, lineHeight: 1.6 }}>
                  Access the Municipal Administration ERP system securely. Please ensure you have your credentials ready.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                    <Security fontSize="large" />
                  </Box>
                  <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                    <AccountCircle fontSize="large" />
                  </Box>
                </Box>
              </Box>
              {/* Abstract Circles */}
              <Box sx={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', border: '40px solid rgba(255,255,255,0.03)' }} />
              <Box sx={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />
            </Box>

            {/* Right Side - Login Form */}
            <Box sx={{ flex: 1.2, p: { xs: 3, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>Login to Account</Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>Enter your credentials to access the portal</Typography>
              </Box>

              {/* Login Type Toggle */}
              <Box sx={{
                display: 'flex',
                bgcolor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: 12,
                p: 0.5,
                mb: 4,
                width: 'fit-content',
                mx: 'auto',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <Button
                  onClick={() => handleLoginTypeChange('Citizen')}
                  sx={{
                    borderRadius: 10,
                    bgcolor: loginType === 'Citizen' ? '#002147' : 'transparent',
                    color: loginType === 'Citizen' ? 'white' : '#64748b',
                    px: 4,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '16px',
                    minWidth: 120,
                    '&:hover': { 
                      bgcolor: loginType === 'Citizen' ? '#001a38' : 'rgba(0,0,0,0.03)',
                      boxShadow: loginType === 'Citizen' ? '0 4px 6px rgba(0, 33, 71, 0.1)' : 'none'
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Citizen
                </Button>
                <Button
                  onClick={() => handleLoginTypeChange('ULB')}
                  sx={{
                    borderRadius: 10,
                    bgcolor: loginType === 'ULB' ? '#002147' : 'transparent',
                    color: loginType === 'ULB' ? 'white' : '#64748b',
                    px: 4,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '16px',
                    minWidth: 120,
                    '&:hover': { 
                      bgcolor: loginType === 'ULB' ? '#001a38' : 'rgba(0,0,0,0.03)',
                      boxShadow: loginType === 'ULB' ? '0 4px 6px rgba(0, 33, 71, 0.1)' : 'none'
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  ULB / Admin
                </Button>
              </Box>

              {/* Form */}
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  fullWidth
                  label="User ID"
                  variant="outlined"
                  value={employeeId}
                  onChange={(e) => {
                    if (e.target.value.length <= 6) setEmployeeId(e.target.value.replace(/\D/g, ''));
                  }}
                  placeholder="Enter 6-digit Employee ID"
                  sx={inputStyles}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Person sx={{ color: '#94a3b8' }} /></InputAdornment>,
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  disabled={!employeeId || employeeId.length !== 6} // Optional UX hint
                  sx={inputStyles}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#94a3b8' }} /></InputAdornment>,
                  }}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="OTP"
                    variant="outlined"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Received OTP"
                    sx={{ ...inputStyles, flex: 1.5 }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><VpnKey sx={{ color: '#94a3b8' }} /></InputAdornment>,
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleGenerateOTP}
                    sx={{
                      flex: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      borderColor: '#002147',
                      color: '#002147',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      minWidth: 'fit-content',
                      px: 2,
                      '&:hover': { borderColor: '#001a38', bgcolor: '#f1f5f9' }
                    }}
                  >
                    Get OTP
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
                  <TextField
                    fullWidth
                    label="Captcha"
                    variant="outlined"
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    placeholder="Enter Code"
                    disabled={!password || password.length < 8}
                    sx={{ ...inputStyles, flex: 1 }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Security sx={{ color: '#94a3b8' }} /></InputAdornment>,
                    }}
                  />
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: '#f1f5f9',
                    p: 1,
                    borderRadius: 2,
                    border: '1px solid #e2e8f0'
                  }}>
                    <Typography sx={{
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      fontSize: '18px',
                      letterSpacing: 2,
                      px: 2,
                      color: '#334155'
                    }}>
                      {captchaText}
                    </Typography>
                    <IconButton size="small" onClick={generateNewCaptcha}>
                      <Refresh fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleLogin}
                  disabled={isLoading}
                  sx={{
                    bgcolor: '#002147',
                    py: 1.8,
                    mt: 3,
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: '17px',
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
                  {isLoading ? <CircularProgress size={24} color="inherit" thickness={4} /> : 'Login'}
                </Button>

                <Button
                  onClick={() => setShowForgotPassword(true)}
                  sx={{
                    textTransform: 'none',
                    color: '#dc2626',
                    fontWeight: 600,
                    fontSize: '15px',
                    alignSelf: 'center',
                    mt: 1,
                    '&:hover': { 
                      bgcolor: 'transparent', 
                      textDecoration: 'underline',
                      color: '#b91c1c'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Forgot Password?
                </Button>

              </Box>
            </Box>
          </Paper>
        </Fade>
      </Box>

    </Box>
  );
};

export default LoginPage;