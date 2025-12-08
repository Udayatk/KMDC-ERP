'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Fade,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  Alert
} from '@mui/material';
import {
  AccountCircle,
  Notifications,
  ExitToApp,
  People,
  PersonAdd,
  Map,
  AdminPanelSettings,
  AccountTree,
  Assignment,
  TransferWithinAStation,
  SwapHoriz,
  Business,
  Badge,
  LocationOn,
  Close
} from '@mui/icons-material';
import UserManagement from '../admin/UserManagement';
import MapUlbToDistrict from '../admin/MapUlbToDistrict';
import MapSuperAdmin from '../admin/MapSuperAdmin';
import MapLevelsToRoles from '../admin/MapLevelsToRoles';
import MapUser from '../admin/MapUser';
import TransferEmployee from '../admin/TransferEmployee';
import ChangePassword from '../auth/ChangePassword';
import ModuleNavigation from './ModuleNavigation';

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

interface DashboardProps {
  userInfo: UserInfo;
  selectedULB: ULBMapping;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userInfo, selectedULB, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showSwitchULB, setShowSwitchULB] = useState(false);
  const [selectedNewULB, setSelectedNewULB] = useState<string>('');

  const [currentView, setCurrentView] = useState<'modules' | 'employees' | 'map-ulb' | 'map-super-admin' | 'map-levels' | 'map-user' | 'transfer-employee' | 'change-password'>('modules');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleChangePassword = () => {
    setCurrentView('change-password');
    handleClose();
  };

  const handleBackToDashboard = () => {
    setCurrentView('modules');
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
  };

  const handleSwitchULB = () => {
    if (!selectedNewULB) {
      return;
    }
    // In a real application, this would update the user's selected ULB
    // For now, we'll just close the dialog
    setShowSwitchULB(false);
    setSelectedNewULB('');
    // Reload the page or redirect to ULB selection
    window.location.reload();
  };

  const handleCloseSwitchULB = () => {
    setShowSwitchULB(false);
    setSelectedNewULB('');
  };

  const navItems = [
    { id: 'modules', label: 'Modules', icon: <Business /> },
    { id: 'employees', label: 'User Management', icon: <People /> },
    { id: 'map-ulb', label: 'ULB Mapping', icon: <Map /> },
    { id: 'map-super-admin', label: 'Super Admin', icon: <AdminPanelSettings /> },
    { id: 'map-levels', label: 'Levels & Roles', icon: <AccountTree /> },
    { id: 'map-user', label: 'User Mapping', icon: <Assignment /> },
    { id: 'transfer-employee', label: 'Transfer Employee', icon: <TransferWithinAStation /> },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#002147', color: 'white' }}>
      {/* Sidebar Header */}
      <Box sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        bgcolor: '#001a38'
      }}>
        <AdminPanelSettings sx={{ color: '#60a5fa', fontSize: 32 }} />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1, fontSize: '1.1rem' }}>
            Admin Panel
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            v2.0 dashboard
          </Typography>
        </Box>
      </Box>

      {/* Navigation List */}
      <Box sx={{ flexGrow: 1, py: 3, px: 2, overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <Box key={item.id} sx={{ mb: 1 }}>
              <Button
                fullWidth
                onClick={() => {
                  setCurrentView(item.id as any);
                  setMobileOpen(false);
                }}
                startIcon={React.cloneElement(item.icon, {
                  sx: {
                    color: isActive ? 'white' : '#94a3b8',
                    fontSize: 24
                  }
                })}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  color: isActive ? 'white' : '#cbd5e1',
                  bgcolor: isActive ? '#1976d2' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.95rem',
                  py: 1.8,
                  px: 2.5,
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: isActive ? '#1565c0' : 'rgba(255,255,255,0.05)',
                    color: 'white',
                    transform: 'translateX(4px)'
                  }
                }}
              >
                {item.label}
              </Button>
            </Box>
          );
        })}
      </Box>

      {/* Sidebar Footer / User Quick Info */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', bgcolor: '#001a38' }}>
        <Box sx={{
          bgcolor: 'rgba(255,255,255,0.05)',
          borderRadius: 2,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              flexShrink: 0
            }}
          >
            <Business fontSize="small" />
          </Box>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.2 }}>
              {selectedULB.ulbName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#60a5fa', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              {selectedULB.roleType}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0f2f5', display: 'flex', flexDirection: 'column' }}>

      {/* Top Accessibility Bar */}
      <Box sx={{ bgcolor: '#0f172a', color: '#94a3b8', py: 0.5, px: 3, display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #1e293b', zIndex: 1201 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="caption" sx={{ fontSize: '11px', cursor: 'pointer', '&:hover': { color: 'white' } }}>Skip to Main Content</Typography>
          <Box sx={{ width: '1px', height: '12px', bgcolor: '#334155' }} />
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {['A', 'A', '-', 'A', '+', 'En'].map((text, index) => (
              <Box key={index} component="button" sx={{ border: '1px solid #334155', bgcolor: 'transparent', color: 'inherit', px: 0.8, fontSize: '10px', borderRadius: 0.5 }}>{text}</Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Main Header */}
      <Box sx={{
        bgcolor: 'white',
        height: 80,
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center'
      }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Mobile Menu Button */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { md: 'none' }, mr: 1, color: '#002147' }}
              >
                <Assignment />
              </IconButton>

              <img src="/images/karnataka_emblem.png" alt="Logo" style={{ height: 48, objectFit: 'contain' }} />
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
                  Directorate of Municipal Administration
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem' }}>
                  Government of Karnataka
                </Typography>
              </Box>
            </Box>

            {/* Header Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {userInfo.ulbMappings.length > 1 && (
                <Button
                  onClick={() => setShowSwitchULB(true)}
                  startIcon={<SwapHoriz />}
                  sx={{
                    textTransform: 'none',
                    color: '#64748b',
                    fontWeight: 600,
                    mr: 1,
                    display: { xs: 'none', md: 'flex' },
                    '&:hover': { color: '#1976d2', bgcolor: '#f0f9ff' }
                  }}
                >
                  Switch ULB
                </Button>
              )}

              <IconButton size="small" sx={{ color: '#64748b', transition: 'all 0.2s', '&:hover': { color: '#0f172a', bgcolor: '#f1f5f9' } }}>
                <Notifications />
              </IconButton>

              <Box
                onClick={handleMenu}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  py: 0.5,
                  px: 1,
                  borderRadius: 8,
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: '#f8fafc' }
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', display: { xs: 'none', sm: 'block' } }}>
                  {userInfo.employeeName}
                </Typography>
                <Box sx={{ position: 'relative' }}>
                  <AccountCircle sx={{ fontSize: 40, color: '#002147' }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Layout Body */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>

        {/* Desktop Sidebar */}
        <Box
          component="nav"
          sx={{ width: { md: 300 }, flexShrink: { md: 0 }, display: { xs: 'none', md: 'block' } }}
        >
          {drawerContent}
        </Box>

        {/* Mobile Sidebar (Drawer) */}
        <Box component="nav">
          <Dialog
            open={mobileOpen}
            onClose={handleDrawerToggle}
            fullScreen
            sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDialog-paper': { m: 0, width: '85%', maxWidth: 320, height: '100%', borderRadius: '0 16px 16px 0' } }}
          >
            {drawerContent}
          </Dialog>
        </Box>

        {/* Content Area */}
        <Box sx={{ flexGrow: 1, p: 4, width: { md: `calc(100% - 300px)` }, overflowY: 'auto', height: 'calc(100vh - 83px)', bgcolor: '#f8fafc' }}>
          <Fade in timeout={400} key={currentView}>
            <Box sx={{ maxWidth: '1600px', mx: 'auto' }}>
              {/* Simple Session Status Bar */}
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                  Welcome back, <Box component="span" sx={{ fontWeight: 600, color: '#0f172a' }}>{userInfo.employeeName}</Box>
                </Typography>
                <Chip
                  label="Active Session"
                  size="small"
                  sx={{
                    height: 24,
                    borderRadius: 1,
                    bgcolor: '#dcfce7',
                    color: '#166534',
                    fontWeight: 600,
                    border: '1px solid #bbf7d0',
                    fontSize: '0.75rem'
                  }}
                />
              </Box>

              {currentView === 'modules' ? <ModuleNavigation userInfo={userInfo} selectedULB={selectedULB} /> :
                currentView === 'employees' ? <UserManagement /> :
                  currentView === 'map-ulb' ? <MapUlbToDistrict /> :
                    currentView === 'map-super-admin' ? <MapSuperAdmin /> :
                      currentView === 'map-levels' ? <MapLevelsToRoles /> :
                        currentView === 'map-user' ? <MapUser /> :
                          currentView === 'transfer-employee' ? <TransferEmployee /> :
                            currentView === 'change-password' ? <ChangePassword onBack={handleBackToDashboard} /> : null
              }
            </Box>
          </Fade>
        </Box>
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{userInfo.employeeName}</Typography>
          <Typography variant="caption" color="text.secondary">{userInfo.employeeId}</Typography>
        </Box>
        <MenuItem onClick={handleClose}>
          <AccountCircle sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} /> Profile
        </MenuItem>
        <MenuItem onClick={handleChangePassword}>
          <Badge sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} /> Change Password
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ExitToApp sx={{ mr: 2, fontSize: 20 }} /> Logout
        </MenuItem>
      </Menu>

      {/* Switch ULB Dialog */}
      <Dialog
        open={showSwitchULB}
        onClose={handleCloseSwitchULB}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SwapHoriz sx={{ color: '#1976d2' }} />
            <Typography variant="h6" fontWeight={600}>
              Switch ULB
            </Typography>
          </Box>
          <IconButton onClick={handleCloseSwitchULB} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pb: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Select a different ULB to continue your session. This will reload the application with the new ULB context.
          </Alert>

          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              value={selectedNewULB}
              onChange={(e) => setSelectedNewULB(e.target.value)}
              sx={{ gap: 1 }}
            >
              {userInfo.ulbMappings
                .filter(ulb => ulb.ulbId !== selectedULB.ulbId)
                .map((ulb) => (
                  <Card
                    key={ulb.ulbId}
                    variant="outlined"
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      border: selectedNewULB === ulb.ulbId ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      backgroundColor: selectedNewULB === ulb.ulbId ? '#f3f7ff' : 'white',
                      '&:hover': {
                        backgroundColor: '#f8f9fa',
                        borderColor: '#1976d2'
                      }
                    }}
                    onClick={() => setSelectedNewULB(ulb.ulbId)}
                  >
                    <CardContent sx={{ py: 2 }}>
                      <Box display="flex" alignItems="center">
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
                    </CardContent>
                  </Card>
                ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseSwitchULB}>
            Cancel
          </Button>
          <Button
            onClick={handleSwitchULB}
            variant="contained"
            disabled={!selectedNewULB}
            sx={{
              px: 3,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
              }
            }}
          >
            Switch ULB
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;