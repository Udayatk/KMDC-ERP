'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Autocomplete,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fade,
  Snackbar,
  Alert,
  Checkbox,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  Search,
  Person,
  Badge,
  Work,
  LocationOn,
  Assignment,
  Engineering,
  AccountBalance,
  Save
} from '@mui/icons-material';

// --- Types ---
interface Employee {
  id: string;
  name: string;
  section: string;
  recruitmentType: string;
  designation: string;
  ulbName: string;
  wardName: string;
}

interface MenuItem {
  id: string;
  name: string;
  view: boolean;
  create: boolean;
  reviewVerify: boolean;
  approve: boolean;
}

interface ModuleData {
  [key: string]: MenuItem[];
}

// --- Mock Data ---
const MOCK_EMPLOYEES: Employee[] = [
  { id: 'EMP001', name: 'Ramesh Kumar', section: 'Engineering', recruitmentType: 'Permanent', designation: 'Junior Engineer', ulbName: 'Bengaluru', wardName: 'Ward 1' },
  { id: 'EMP002', name: 'Suresh Patil', section: 'Health', recruitmentType: 'Contract', designation: 'Health Inspector', ulbName: 'Mysuru', wardName: 'Ward 5' },
  { id: '1234', name: 'ABCD', section: 'Administration', recruitmentType: 'Permanent', designation: 'Clerk', ulbName: 'Nagamangala', wardName: 'Ward 10' },
  { id: 'EMP003', name: 'Priya Sharma', section: 'Revenue', recruitmentType: 'Permanent', designation: 'Revenue Inspector', ulbName: 'Hassan', wardName: 'Ward 3' },
  { id: 'EMP004', name: 'Rajesh Gupta', section: 'Town Planning', recruitmentType: 'Contract', designation: 'Planning Assistant', ulbName: 'Shivamogga', wardName: 'Ward 7' },
];

const MODULES_DATA: ModuleData = {
  'Admin': [
    { id: 'admin1', name: 'User Management', view: true, create: false, reviewVerify: false, approve: false },
    { id: 'admin2', name: 'Role Assignment', view: true, create: true, reviewVerify: false, approve: true },
    { id: 'admin3', name: 'System Configuration', view: true, create: false, reviewVerify: false, approve: false },
  ],
  'E-Sweekruthi': [
    { id: 'esweek1', name: 'Application Processing', view: true, create: true, reviewVerify: true, approve: false },
    { id: 'esweek2', name: 'Document Verification', view: true, create: false, reviewVerify: true, approve: true },
    { id: 'esweek3', name: 'Certificate Generation', view: true, create: true, reviewVerify: false, approve: true },
  ],
  'IFMS (RBAS)': [
    { id: 'ifms1', name: 'Create Bill', view: true, create: false, reviewVerify: false, approve: false },
    { id: 'ifms2', name: 'File Set up', view: true, create: false, reviewVerify: false, approve: true },
    { id: 'ifms3', name: 'Procurement Order', view: false, create: false, reviewVerify: true, approve: true },
    { id: 'ifms4', name: 'Budget Allocation', view: true, create: true, reviewVerify: true, approve: false },
  ],
  'Trade License': [
    { id: 'trade1', name: 'License Application', view: true, create: true, reviewVerify: false, approve: false },
    { id: 'trade2', name: 'License Renewal', view: true, create: false, reviewVerify: true, approve: true },
    { id: 'trade3', name: 'License Verification', view: true, create: false, reviewVerify: true, approve: false },
  ],
  'Jalanidhi': [
    { id: 'jala1', name: 'Water Connection', view: true, create: true, reviewVerify: false, approve: true },
    { id: 'jala2', name: 'Bill Generation', view: true, create: false, reviewVerify: false, approve: false },
    { id: 'jala3', name: 'Payment Processing', view: true, create: false, reviewVerify: true, approve: true },
  ],
  'Utility Management': [
    { id: 'util1', name: 'Service Request', view: true, create: true, reviewVerify: false, approve: false },
    { id: 'util2', name: 'Complaint Management', view: true, create: true, reviewVerify: true, approve: false },
    { id: 'util3', name: 'Asset Tracking', view: true, create: false, reviewVerify: false, approve: true },
  ],
  'Asset Management': [
    { id: 'asset1', name: 'Asset Registration', view: true, create: true, reviewVerify: true, approve: true },
    { id: 'asset2', name: 'Asset Transfer', view: true, create: false, reviewVerify: true, approve: true },
    { id: 'asset3', name: 'Asset Disposal', view: true, create: true, reviewVerify: true, approve: true },
  ],
  "Schemes for ULB's and CC's": [
    { id: 'scheme1', name: 'Scheme Creation', view: true, create: true, reviewVerify: false, approve: true },
    { id: 'scheme2', name: 'Beneficiary Management', view: true, create: true, reviewVerify: true, approve: false },
    { id: 'scheme3', name: 'Fund Disbursement', view: true, create: false, reviewVerify: true, approve: true },
  ],
};

// Using shared constants
import { COLORS } from '../shared/typography';
import { PADDING, MARGIN, GRID_SPACING } from '../shared/responsive';

const THEME_BLUE = COLORS.PRIMARY_DARK;
const THEME_ACCENT = COLORS.PRIMARY_ACCENT;
const THEME_SUCCESS = COLORS.SUCCESS;
const THEME_WARNING = COLORS.WARNING;
const THEME_ERROR = COLORS.ERROR;
const THEME_LIGHT_BG = COLORS.LIGHT_BACKGROUND;
const THEME_DARK_TEXT = COLORS.DARK_TEXT;
const THEME_MEDIUM_TEXT = COLORS.MEDIUM_TEXT;

const AssignModules: React.FC = () => {
  // Search State
  const [searchQuery, setSearchQuery] = useState<Employee | null>(null);
  const [employeeDetails, setEmployeeDetails] = useState<Employee | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState(0);
  const moduleKeys = Object.keys(MODULES_DATA);

  // Menu Items State
  const [menuItems, setMenuItems] = useState<ModuleData>(MODULES_DATA);
  const [isSaving, setIsSaving] = useState(false);

  const [notification, setNotification] = useState<{ open: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    type: 'success'
  });

  // --- Search Handler ---
  const handleSearch = () => {
    if (!searchQuery) {
      setNotification({ open: true, message: 'Please select an employee to search', type: 'error' });
      return;
    }
    setEmployeeDetails(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery(null);
    setEmployeeDetails(null);
  };

  // --- Tab Change Handler ---
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // --- Permission Toggle Handlers ---
  const handlePermissionToggle = (moduleKey: string, menuId: string, permission: keyof Omit<MenuItem, 'id' | 'name'>) => {
    setMenuItems(prev => ({
      ...prev,
      [moduleKey]: prev[moduleKey].map(item =>
        item.id === menuId
          ? { ...item, [permission]: !item[permission] }
          : item
      )
    }));
  };

  // --- Save Handler ---
  const handleSave = () => {
    if (!employeeDetails) {
      setNotification({ open: true, message: 'Please search and select an employee first', type: 'error' });
      return;
    }

    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setNotification({
        open: true,
        message: 'Module permissions saved successfully!',
        type: 'success'
      });
    }, 1000);
  };

  const InfoField = ({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) => (
    <Box sx={{ minWidth: '200px' }}>
      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5, fontWeight: 600 }}>
        {label}
      </Typography>
      <Box sx={{
        bgcolor: '#f8fafc',
        p: 1.5,
        borderRadius: 1,
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        {icon}
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
          {value || '-'}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Fade in={true}>
      <Box sx={{ maxWidth: '100%', mx: 'auto', p: { xs: PADDING.XS, sm: PADDING.SM, md: PADDING.MD } }}>
        <Paper elevation={3} sx={{
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}>
          {/* Header */}
          <Box sx={{
            bgcolor: THEME_BLUE,
            py: 3,
            px: 4,
            borderBottom: '3px solid #003366'
          }}>
            <Typography variant="h5" sx={{
              color: 'white',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Assignment sx={{ fontSize: 28 }} />
              Map User - Menu Mapping
            </Typography>
          </Box>

          <Box sx={{ p: { xs: PADDING.SM, sm: PADDING.MD, md: PADDING.LG } }}>
            {/* Search Section */}
            <Box sx={{
              display: 'flex',
              gap: 2,
              mb: MARGIN.LG,
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <Autocomplete
                sx={{ flex: 1, minWidth: 300 }}
                options={MOCK_EMPLOYEES}
                getOptionLabel={(option) => `${option.name} (${option.id})`}
                value={searchQuery}
                onChange={(_, newValue) => setSearchQuery(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search User / Employee"
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                        bgcolor: 'white'
                      }
                    }}
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <li key={key} {...otherProps}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Person sx={{ mr: 2, color: '#64748b' }} />
                        <Box>
                          <Typography variant="body2" fontWeight={600} color="#0f172a">
                            {option.name}
                          </Typography>
                          <Typography variant="caption" color="#64748b">
                            {option.id} • {option.designation}
                          </Typography>
                        </Box>
                      </Box>
                    </li>
                  );
                }}
              />
              <Button
                variant="contained"
                startIcon={<Search />}
                onClick={handleSearch}
                sx={{
                  bgcolor: THEME_BLUE,
                  textTransform: 'none',
                  px: 3,
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: '#001a38'
                  }
                }}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={handleClear}
                sx={{
                  color: '#64748b',
                  borderColor: '#cbd5e1',
                  textTransform: 'none',
                  px: 3,
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#94a3b8',
                    bgcolor: '#f8fafc'
                  }
                }}
              >
                Clear
              </Button>
            </Box>

            {/* Employee Details Section */}
            {employeeDetails && (
              <>
                <Paper variant="outlined" sx={{
                  p: { xs: PADDING.SM, sm: PADDING.MD, md: PADDING.LG },
                  mb: MARGIN.MD,
                  bgcolor: '#fafbfc',
                  border: '1px solid #e2e8f0'
                }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <InfoField
                      label="Employee ID/Code"
                      value={employeeDetails.id}
                      icon={<Badge sx={{ fontSize: 16, color: THEME_BLUE }} />}
                    />
                    <InfoField
                      label="User Name"
                      value={employeeDetails.name}
                      icon={<Person sx={{ fontSize: 16, color: THEME_BLUE }} />}
                    />
                    <InfoField
                      label="ULB Name"
                      value={employeeDetails.ulbName}
                      icon={<AccountBalance sx={{ fontSize: 16, color: THEME_BLUE }} />}
                    />
                    <InfoField
                      label="Ward Name"
                      value={employeeDetails.wardName}
                      icon={<LocationOn sx={{ fontSize: 16, color: THEME_BLUE }} />}
                    />
                  </Box>
                  <Divider sx={{ my: MARGIN.SM }} />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <InfoField
                      label="Section Name"
                      value={employeeDetails.section}
                      icon={<Engineering sx={{ fontSize: 16, color: THEME_BLUE }} />}
                    />
                    <InfoField
                      label="Designation"
                      value={employeeDetails.designation}
                      icon={<Work sx={{ fontSize: 16, color: THEME_BLUE }} />}
                    />
                  </Box>
                </Paper>

                {/* Module Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: MARGIN.MD }}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '14px',
                        minHeight: 48,
                        color: '#64748b',
                        '&.Mui-selected': {
                          color: THEME_BLUE,
                          fontWeight: 700
                        }
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: THEME_BLUE,
                        height: 3
                      }
                    }}
                  >
                    {moduleKeys.map((module, index) => (
                      <Tab key={index} label={module} />
                    ))}
                  </Tabs>
                </Box>

                {/* Permissions Table */}
                <TableContainer component={Paper} elevation={0} sx={{
                  border: '1px solid #e2e8f0',
                  mb: MARGIN.MD
                }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: THEME_BLUE }}>
                        <TableCell sx={{
                          color: 'white',
                          fontWeight: 700,
                          py: 2,
                          fontSize: '14px',
                          minWidth: 250
                        }}>
                          Menu Name
                        </TableCell>
                        <TableCell align="center" sx={{
                          color: 'white',
                          fontWeight: 700,
                          py: 2,
                          fontSize: '14px',
                          width: 120
                        }}>
                          View
                        </TableCell>
                        <TableCell align="center" sx={{
                          color: 'white',
                          fontWeight: 700,
                          py: 2,
                          fontSize: '14px',
                          width: 120
                        }}>
                          Create
                        </TableCell>
                        <TableCell align="center" sx={{
                          color: 'white',
                          fontWeight: 700,
                          py: 2,
                          fontSize: '14px',
                          width: 150
                        }}>
                          Review/Verify
                        </TableCell>
                        <TableCell align="center" sx={{
                          color: 'white',
                          fontWeight: 700,
                          py: 2,
                          fontSize: '14px',
                          width: 120
                        }}>
                          Approve
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {menuItems[moduleKeys[activeTab]].map((item, index) => (
                        <TableRow
                          key={item.id}
                          sx={{
                            '&:nth-of-type(odd)': { bgcolor: '#f8fafc' },
                            '&:nth-of-type(even)': { bgcolor: '#ffffff' },
                            '&:hover': { bgcolor: '#f1f5f9' }
                          }}
                        >
                          <TableCell sx={{
                            fontWeight: 600,
                            color: '#1e293b',
                            fontSize: '14px',
                            py: 1.5
                          }}>
                            {item.name}
                          </TableCell>
                          <TableCell align="center" sx={{ py: 1.5 }}>
                            <Checkbox
                              checked={item.view}
                              onChange={() => handlePermissionToggle(moduleKeys[activeTab], item.id, 'view')}
                              sx={{
                                color: '#cbd5e1',
                                '&.Mui-checked': {
                                  color: THEME_BLUE
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell align="center" sx={{ py: 1.5 }}>
                            <Checkbox
                              checked={item.create}
                              onChange={() => handlePermissionToggle(moduleKeys[activeTab], item.id, 'create')}
                              sx={{
                                color: '#cbd5e1',
                                '&.Mui-checked': {
                                  color: THEME_BLUE
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell align="center" sx={{ py: 1.5 }}>
                            <Checkbox
                              checked={item.reviewVerify}
                              onChange={() => handlePermissionToggle(moduleKeys[activeTab], item.id, 'reviewVerify')}
                              sx={{
                                color: '#cbd5e1',
                                '&.Mui-checked': {
                                  color: THEME_BLUE
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell align="center" sx={{ py: 1.5 }}>
                            <Checkbox
                              checked={item.approve}
                              onChange={() => handlePermissionToggle(moduleKeys[activeTab], item.id, 'approve')}
                              sx={{
                                color: '#cbd5e1',
                                '&.Mui-checked': {
                                  color: THEME_BLUE
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Save Button */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: MARGIN.LG }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={isSaving}
                    sx={{
                      bgcolor: THEME_SUCCESS,
                      textTransform: 'none',
                      fontWeight: 700,
                      px: 6,
                      py: 1.5,
                      fontSize: '16px',
                      borderRadius: 1,
                      boxShadow: '0 4px 12px rgba(0, 200, 83, 0.3)',
                      '&:hover': {
                        bgcolor: '#009624',
                        boxShadow: '0 6px 16px rgba(0, 200, 83, 0.4)'
                      },
                      '&.Mui-disabled': {
                        bgcolor: 'rgba(0, 200, 83, 0.3)',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }
                    }}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </Box>
              </>
            )}

            {/* No Employee Selected Message */}
            {!employeeDetails && (
              <Box sx={{
                textAlign: 'center',
                py: 8,
                color: '#64748b'
              }}>
                <Person sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  No Employee Selected
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Please search and select an employee to assign module permissions
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={5000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity={notification.type}
            onClose={() => setNotification({ ...notification, open: false })}
            variant="filled"
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              minWidth: '300px'
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default AssignModules;