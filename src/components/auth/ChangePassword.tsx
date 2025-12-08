'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Alert,
  Fade,
  InputAdornment
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock
} from '@mui/icons-material';

interface ChangePasswordProps {
  onBack: () => void;
  currentUserPassword?: string; // In real app, this would be validated server-side
}

interface PasswordVisibility {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ 
  onBack,
  currentUserPassword = 'admin123' // Mock current password for demo
}) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState<PasswordVisibility>({
    current: false,
    new: false,
    confirm: false
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const togglePasswordVisibility = (field: keyof PasswordVisibility) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = (): string[] => {
    const validationErrors: string[] = [];

    // Check if all fields are filled
    if (!formData.currentPassword) {
      validationErrors.push('Current password is required');
    }
    if (!formData.newPassword) {
      validationErrors.push('New password is required');
    }
    if (!formData.confirmPassword) {
      validationErrors.push('Confirm password is required');
    }

    // Validate current password
    if (formData.currentPassword && formData.currentPassword !== currentUserPassword) {
      validationErrors.push('Current password entered is incorrect');
    }

    // Validate new password confirmation
    if (formData.newPassword && formData.confirmPassword && 
        formData.newPassword !== formData.confirmPassword) {
      validationErrors.push('"New Password" and "Confirm New Password" does not match');
    }

    // Additional password strength validation (optional)
    if (formData.newPassword && formData.newPassword.length < 6) {
      validationErrors.push('New password must be at least 6 characters long');
    }

    return validationErrors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      
      // Clear new password and confirm password fields if they don't match
      if (validationErrors.some(error => error.includes('does not match'))) {
        setFormData(prev => ({
          ...prev,
          newPassword: '',
          confirmPassword: ''
        }));
      }
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real application, you would make an API call here
      console.log('Password change request:', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setSuccessMessage('Password has been successfully updated!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Optionally redirect back after success
      setTimeout(() => {
        onBack();
      }, 2000);

    } catch (error) {
      setErrors(['An error occurred while updating your password. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Fade in timeout={800}>
        <Box>
            {/* Change Password Header */}
            <Box sx={{
              bgcolor: '#002147',
              color: 'white',
              py: 2,
              px: 3,
              borderRadius: '8px 8px 0 0',
              background: 'linear-gradient(to right, #002147, #0f172a)'
            }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 600,
                textAlign: 'center'
              }}>
                Change Password
              </Typography>
            </Box>

            <Paper 
              elevation={3} 
              sx={{ 
                p: 4,
                borderRadius: '0 0 8px 8px',
                border: '1px solid #e2e8f0'
              }}
            >
              <Typography variant="h6" sx={{ 
                mb: 4, 
                textAlign: 'center',
                color: '#0f172a',
                fontWeight: 600
              }}>
                Change Password
              </Typography>

              {/* Success Message */}
              {successMessage && (
                <Alert 
                  severity="success" 
                  sx={{ mb: 3 }}
                  onClose={() => setSuccessMessage('')}
                >
                  {successMessage}
                </Alert>
              )}

              {/* Error Messages */}
              {errors.length > 0 && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 3 }}
                  onClose={() => setErrors([])}
                >
                  <Box>
                    {errors.map((error, index) => (
                      <Typography key={index} variant="body2">
                        • {error}
                      </Typography>
                    ))}
                  </Box>
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                {/* Current Password */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ 
                    mb: 1, 
                    fontWeight: 600,
                    color: '#374151'
                  }}>
                    Current Password
                  </Typography>
                  <TextField
                    fullWidth
                    type={showPassword.current ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={handleInputChange('currentPassword')}
                    placeholder="Current Password"
                    required
                    error={errors.some(error => error.includes('Current password'))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#6b7280' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility('current')}
                            edge="end"
                            sx={{ color: '#6b7280' }}
                          >
                            {showPassword.current ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#002147',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#002147',
                        }
                      }
                    }}
                  />
                </Box>

                {/* New Password */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ 
                    mb: 1, 
                    fontWeight: 600,
                    color: '#374151'
                  }}>
                    New Password
                  </Typography>
                  <TextField
                    fullWidth
                    type={showPassword.new ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={handleInputChange('newPassword')}
                    placeholder="New Password"
                    required
                    error={errors.some(error => error.includes('New password'))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#6b7280' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility('new')}
                            edge="end"
                            sx={{ color: '#6b7280' }}
                          >
                            {showPassword.new ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#002147',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#002147',
                        }
                      }
                    }}
                  />
                </Box>

                {/* Confirm New Password */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body1" sx={{ 
                    mb: 1, 
                    fontWeight: 600,
                    color: '#374151'
                  }}>
                    Confirm New Password
                  </Typography>
                  <TextField
                    fullWidth
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    placeholder="Confirm New Password"
                    required
                    error={errors.some(error => error.includes('Confirm'))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#6b7280' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility('confirm')}
                            edge="end"
                            sx={{ color: '#6b7280' }}
                          >
                            {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#002147',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#002147',
                        }
                      }
                    }}
                  />
                </Box>

                {/* Action Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  justifyContent: 'center',
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={onBack}
                    sx={{
                      color: '#6b7280',
                      borderColor: '#d1d5db',
                      fontWeight: 600,
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      minWidth: 150,
                      '&:hover': {
                        borderColor: '#9ca3af',
                        bgcolor: '#f9fafb'
                      }
                    }}
                  >
                    Back to Dashboard
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{
                      bgcolor: '#002147',
                      color: 'white',
                      fontWeight: 600,
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      minWidth: 200,
                      '&:hover': {
                        bgcolor: '#0f172a',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0, 33, 71, 0.4)'
                      },
                      '&:disabled': {
                        bgcolor: '#9ca3af',
                        color: 'white'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    {isLoading ? 'Updating Password...' : 'Set New Password'}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Container>
    );
};

export default ChangePassword;