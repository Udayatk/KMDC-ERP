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
    Chip,
    Divider
} from '@mui/material';
import { 
    PersonAdd, 
    Delete, 
    Search, 
    Person, 
    Badge, 
    Work, 
    LocationOn,
    Assignment,
    Engineering,
    AccountBalance,
    Security,
    Verified
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

interface MappedRole {
    id: number;
    ulbName: string;
    userType: string;
    role: string;
    level: string;
}

// --- Mock Data ---
const MOCK_EMPLOYEES: Employee[] = [
    { id: 'EMP001', name: 'Ramesh Kumar', section: 'Engineering', recruitmentType: 'Permanent', designation: 'Junior Engineer', ulbName: 'Bengaluru', wardName: 'Ward 1' },
    { id: 'EMP002', name: 'Suresh Patil', section: 'Health', recruitmentType: 'Contract', designation: 'Health Inspector', ulbName: 'Mysuru', wardName: 'Ward 5' },
    { id: '1234', name: 'ABCD', section: 'Administration', recruitmentType: 'Permanent', designation: 'Clerk', ulbName: 'Nagamangala', wardName: 'Ward 10' },
    { id: 'EMP003', name: 'Priya Sharma', section: 'Revenue', recruitmentType: 'Permanent', designation: 'Revenue Inspector', ulbName: 'Hassan', wardName: 'Ward 3' },
    { id: 'EMP004', name: 'Rajesh Gupta', section: 'Town Planning', recruitmentType: 'Contract', designation: 'Planning Assistant', ulbName: 'Shivamogga', wardName: 'Ward 7' },
];

const MOCK_ULBS = ['Bengaluru', 'Mysuru', 'Nagamangala', 'Hassan', 'Tumakuru', 'Shivamogga', 'Belagavi'];
const MOCK_ROLES = ['JE', 'AE', 'AEE', 'Health Inspector', 'Revenue Inspector', 'Clerk', 'Planning Assistant', 'Commissioner'];
const MOCK_LEVELS = ['Level 0', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
const MOCK_USER_TYPES = ['ULB Employee', 'ULB Head'];

// Using shared constants
import { COLORS, TYPOGRAPHY } from '../shared/typography';
import { PADDING, MARGIN, GRID_SPACING } from '../shared/responsive';

const THEME_BLUE = COLORS.PRIMARY_DARK;
const THEME_ACCENT = COLORS.PRIMARY_ACCENT;
const THEME_SUCCESS = COLORS.SUCCESS;
const THEME_WARNING = COLORS.WARNING;
const THEME_ERROR = COLORS.ERROR;
const THEME_LIGHT_BG = COLORS.LIGHT_BACKGROUND;
const THEME_DARK_TEXT = COLORS.DARK_TEXT;
const THEME_MEDIUM_TEXT = COLORS.MEDIUM_TEXT;

const MapUser: React.FC = () => {
    // Search State
    const [searchQuery, setSearchQuery] = useState<Employee | null>(null);
    const [employeeDetails, setEmployeeDetails] = useState<Employee | null>(null);

    // Form State
    const [preferredUlb, setPreferredUlb] = useState<string | null>(null);
    const [userType, setUserType] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [level, setLevel] = useState<string | null>(null);

    // Grid State
    const [mappedRoles, setMappedRoles] = useState<MappedRole[]>([
        { id: 1, ulbName: 'Nelamangala', userType: '-', role: 'ULB Head', level: 'Level 0' }, // Sample existing data
        { id: 2, ulbName: 'Bengaluru', userType: 'ULB Employee', role: 'JE', level: 'Level 4' },
        { id: 3, ulbName: 'Mysuru', userType: 'ULB Employee', role: 'Health Inspector', level: 'Level 3' }
    ]);

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
        if (searchQuery.ulbName) {
            setPreferredUlb(searchQuery.ulbName);
        }
    };

    const handleClear = () => {
        setSearchQuery(null);
        setEmployeeDetails(null);
        setPreferredUlb(null);
        setUserType(null);
        setRole(null);
        setLevel(null);
    };

    // --- Add Handler ---
    const handleAdd = () => {
        if (!employeeDetails) {
            setNotification({ open: true, message: 'Please search and select an employee first', type: 'error' });
            return;
        }

        if (!preferredUlb || !userType || !role) {
            setNotification({ open: true, message: 'Please select all mandatory fields (Preferred ULB, User Type, Role)', type: 'error' });
            return;
        }

        if (userType === 'ULB Head') {
            const existingHead = mappedRoles.find(m => m.ulbName === preferredUlb && m.userType === 'ULB Head');
            if (existingHead) {
                setNotification({ open: true, message: `Access Denied: ${preferredUlb} already has a designated ULB Head.`, type: 'error' });
                return;
            }
        }

        const isDuplicate = mappedRoles.some(m => m.ulbName === preferredUlb && m.role === role && m.userType === userType);
        if (isDuplicate) {
            setNotification({ open: true, message: 'This role is already assigned to same employee', type: 'error' });
            return;
        }

        const hasHeadRole = mappedRoles.some(m => m.userType === 'ULB Head' && m.ulbName === preferredUlb);
        const hasEmployeeRole = mappedRoles.some(m => m.userType === 'ULB Employee' && m.ulbName === preferredUlb);

        if ((userType === 'ULB Head' && hasEmployeeRole) || (userType === 'ULB Employee' && hasHeadRole)) {
            setNotification({
                open: true,
                message: `This Role is already assigned to ${employeeDetails.name} in ${preferredUlb} ULB`,
                type: 'error'
            });
            return;
        }

        const newRole: MappedRole = {
            id: Date.now(),
            ulbName: preferredUlb,
            userType,
            role,
            level: level || '-'
        };

        setMappedRoles([...mappedRoles, newRole]);
        setNotification({ open: true, message: 'Role added successfully', type: 'success' });
    };

    const handleRevoke = (id: number) => {
        setMappedRoles(mappedRoles.filter(r => r.id !== id));
        setNotification({ open: true, message: 'Access revoked successfully', type: 'info' });
    };

    const DetailItem = ({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) => (
        <Box sx={{ mb: MARGIN.MD }}>
            <Typography variant="caption" sx={{ ...TYPOGRAPHY.CAPTION_LARGE, color: THEME_MEDIUM_TEXT, display: 'block', mb: 1, fontWeight: 600 }}>
                {icon} {label}
            </Typography>
            <Box sx={{
                bgcolor: '#f1f5f9',
                p: 2,
                borderRadius: 2,
                border: '1px solid #cbd5e1',
                minHeight: '45px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <Typography variant="body1" sx={{ ...TYPOGRAPHY.BODY_LARGE, fontWeight: 700, color: '#334155' }}>
                    {value || '-'}
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Fade in={true}>
            <Box sx={{ maxWidth: '100%', mx: 'auto', p: { xs: PADDING.XS, sm: PADDING.SM, md: PADDING.MD } }}>
                <Paper elevation={8} sx={{ 
                    borderRadius: 4, 
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
                }}>
                    {/* Header */}
                    <Box sx={{ 
                        bgcolor: THEME_BLUE, 
                        py: 4, 
                        px: 4,
                        textAlign: 'center',
                        position: 'relative'
                    }}>
                        <Box sx={{ 
                            position: 'absolute', 
                            top: 16, 
                            left: 16, 
                            bgcolor: 'rgba(255,255,255,0.15)', 
                            p: 1, 
                            borderRadius: '50%',
                            width: 48,
                            height: 48,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Security sx={{ color: 'white', fontSize: 28 }} />
                        </Box>
                        <Typography variant="h4" sx={{ 
                            color: 'white', 
                            fontWeight: 800,
                            mb: 1,
                            background: 'linear-gradient(45deg, #fff 30%, #cbd5e1 90%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            User Role Mapping
                        </Typography>
                        <Typography variant="h6" sx={{ 
                            color: '#e2e8f0', 
                            fontWeight: 500
                        }}>
                            Assign roles and permissions to employees across different ULBs
                        </Typography>
                    </Box>

                    <Box sx={{ p: { xs: PADDING.SM, sm: PADDING.MD, md: PADDING.LG } }}>
                        {/* Stats Summary */}
                        <Box sx={{ 
                            display: 'flex', 
                            gap: GRID_SPACING.LG, 
                            mb: MARGIN.LG, 
                            flexWrap: 'wrap' 
                        }}>
                            <Paper elevation={2} sx={{ 
                                p: 2.5, 
                                borderRadius: 3, 
                                flex: 1, 
                                minWidth: 180,
                                border: '1px solid #e2e8f0',
                                bgcolor: 'rgba(0, 33, 71, 0.03)'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Person sx={{ 
                                        fontSize: 32, 
                                        color: THEME_BLUE,
                                        mr: 1.5
                                    }} />
                                    <Box>
                                        <Typography variant="h5" sx={{ 
                                            fontWeight: 700, 
                                            color: THEME_BLUE 
                                        }}>
                                            {mappedRoles.length}
                                        </Typography>
                                        <Typography variant="body2" sx={{ 
                                            color: '#64748b' 
                                        }}>
                                            Roles Assigned
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                            
                            <Paper elevation={2} sx={{ 
                                p: 2.5, 
                                borderRadius: 3, 
                                flex: 1, 
                                minWidth: 180,
                                border: '1px solid #e2e8f0',
                                bgcolor: 'rgba(0, 33, 71, 0.03)'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccountBalance sx={{ 
                                        fontSize: 32, 
                                        color: THEME_BLUE,
                                        mr: 1.5
                                    }} />
                                    <Box>
                                        <Typography variant="h5" sx={{ 
                                            fontWeight: 700, 
                                            color: THEME_BLUE 
                                        }}>
                                            {new Set(mappedRoles.map(m => m.ulbName)).size}
                                        </Typography>
                                        <Typography variant="body2" sx={{ 
                                            color: '#64748b' 
                                        }}>
                                            ULBs Covered
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                            
                            <Paper elevation={2} sx={{ 
                                p: 2.5, 
                                borderRadius: 3, 
                                flex: 1, 
                                minWidth: 180,
                                border: '1px solid #e2e8f0',
                                bgcolor: 'rgba(0, 33, 71, 0.03)'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Work sx={{ 
                                        fontSize: 32, 
                                        color: THEME_BLUE,
                                        mr: 1.5
                                    }} />
                                    <Box>
                                        <Typography variant="h5" sx={{ 
                                            fontWeight: 700, 
                                            color: THEME_BLUE 
                                        }}>
                                            {new Set(mappedRoles.map(m => m.role)).size}
                                        </Typography>
                                        <Typography variant="body2" sx={{ 
                                            color: '#64748b' 
                                        }}>
                                            Unique Roles
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>

                        {/* Search Section */}
                        <Box sx={{ 
                            display: 'flex', 
                            gap: GRID_SPACING.MD, 
                            justifyContent: 'center', 
                            mb: MARGIN.LG, 
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <Autocomplete
                                sx={{ width: 450 }}
                                options={MOCK_EMPLOYEES}
                                getOptionLabel={(option) => `${option.name} (${option.id})`}
                                value={searchQuery}
                                onChange={(_, newValue) => setSearchQuery(newValue)}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        label="Search User / Employee" 
                                        variant="outlined" 
                                        size="medium"
                                        sx={{
                                            '& .MuiOutlinedInput-root': { 
                                                borderRadius: 12,
                                                bgcolor: 'white',
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                                                '& fieldset': { borderColor: '#e2e8f0' },
                                                '&:hover fieldset': { borderColor: '#cbd5e1' }
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
                                                    <Typography variant="body1" fontWeight={600} color="#0f172a">
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
                                size="large"
                                startIcon={<Search />}
                                onClick={handleSearch}
                                sx={{ 
                                    bgcolor: THEME_BLUE, 
                                    textTransform: 'none', 
                                    px: 4, 
                                    py: 1.5,
                                    borderRadius: 12,
                                    fontWeight: 700,
                                    fontSize: '16px',
                                    boxShadow: '0 4px 12px rgba(0, 33, 71, 0.2)',
                                    '&:hover': { 
                                        bgcolor: '#001a38',
                                        boxShadow: '0 6px 16px rgba(0, 33, 71, 0.3)'
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                Search
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={handleClear}
                                sx={{ 
                                    color: '#64748b', 
                                    borderColor: '#cbd5e1', 
                                    textTransform: 'none', 
                                    px: 4, 
                                    py: 1.5,
                                    borderRadius: 12,
                                    fontWeight: 700,
                                    fontSize: '16px',
                                    '&:hover': { 
                                        borderColor: '#94a3b8', 
                                        bgcolor: '#f8fafc',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                Clear
                            </Button>
                        </Box>

                        <Divider sx={{ mb: 5, borderColor: '#cbd5e1' }} />

                        {/* Basic Details Section */}
                        {employeeDetails && (
                            <Box sx={{ mb: MARGIN.LG }}>
                                <Typography variant="h5" sx={{ 
                                    color: THEME_BLUE, 
                                    fontWeight: 800, 
                                    mb: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <Person sx={{ fontSize: 28 }} />
                                    Employee Details
                                </Typography>
                                <Paper variant="outlined" sx={{ 
                                    p: 3, 
                                    bgcolor: '#fff', 
                                    borderRadius: 3, 
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                }}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                        <Box sx={{ flex: '1 1 300px' }}>
                                            <DetailItem 
                                                label="Employee ID/Code" 
                                                value={employeeDetails?.id || ''} 
                                                icon={<Badge sx={{ fontSize: 18, mr: 1 }} />}
                                            />
                                            <DetailItem 
                                                label="User Name" 
                                                value={employeeDetails?.name || ''} 
                                                icon={<Person sx={{ fontSize: 18, mr: 1 }} />}
                                            />
                                            <DetailItem 
                                                label="Ward Name" 
                                                value={employeeDetails?.wardName || ''} 
                                                icon={<LocationOn sx={{ fontSize: 18, mr: 1 }} />}
                                            />
                                        </Box>
                                        <Box sx={{ flex: '1 1 300px' }}>
                                            <DetailItem 
                                                label="Section Name" 
                                                value={employeeDetails?.section || ''} 
                                                icon={<Engineering sx={{ fontSize: 18, mr: 1 }} />}
                                            />
                                            <DetailItem 
                                                label="Recruitment Type" 
                                                value={employeeDetails?.recruitmentType || ''} 
                                                icon={<Work sx={{ fontSize: 18, mr: 1 }} />}
                                            />
                                            <DetailItem 
                                                label="ULB Name" 
                                                value={employeeDetails?.ulbName || ''} 
                                                icon={<AccountBalance sx={{ fontSize: 18, mr: 1 }} />}
                                            />
                                        </Box>
                                        <Box sx={{ flex: '1 1 300px' }}>
                                            <DetailItem 
                                                label="Designation" 
                                                value={employeeDetails?.designation || ''} 
                                                icon={<Assignment sx={{ fontSize: 18, mr: 1 }} />}
                                            />
                                        </Box>
                                    </Box>
                                </Paper>
                            </Box>
                        )}

                        <Divider sx={{ mb: 5, borderColor: '#cbd5e1' }} />

                        {/* Map Roles Section */}
                        <Box sx={{ mb: MARGIN.LG }}>
                            <Typography variant="h5" sx={{ 
                                color: THEME_BLUE, 
                                fontWeight: 800, 
                                mb: 3,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <Assignment sx={{ fontSize: 28 }} />
                                Map Preferred ULB's
                            </Typography>
                            <Paper variant="outlined" sx={{ 
                                p: 3, 
                                bgcolor: 'rgba(248, 250, 252, 0.7)', 
                                borderRadius: 3, 
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-end' }}>
                                    <Box sx={{ flex: '1 1 250px' }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 1.5, fontSize: '16px' }}>
                                            Preferred ULB *
                                        </Typography>
                                        <Autocomplete
                                            fullWidth
                                            size="medium"
                                            options={MOCK_ULBS}
                                            value={preferredUlb}
                                            onChange={(_, val) => setPreferredUlb(val)}
                                            renderInput={(params) => (
                                                <TextField 
                                                    {...params} 
                                                    variant="outlined" 
                                                    sx={{ 
                                                        bgcolor: 'white',
                                                        '& .MuiOutlinedInput-root': { 
                                                            borderRadius: 12,
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                            '& fieldset': { borderColor: '#e2e8f0' },
                                                            '&:hover fieldset': { borderColor: '#cbd5e1' }
                                                        }
                                                    }} 
                                                />
                                            )}
                                        />
                                    </Box>
                                    <Box sx={{ flex: '1 1 250px' }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 1.5, fontSize: '16px' }}>
                                            User Type *
                                        </Typography>
                                        <Autocomplete
                                            fullWidth
                                            size="medium"
                                            options={MOCK_USER_TYPES}
                                            value={userType}
                                            onChange={(_, val) => setUserType(val)}
                                            renderInput={(params) => (
                                                <TextField 
                                                    {...params} 
                                                    variant="outlined" 
                                                    sx={{ 
                                                        bgcolor: 'white',
                                                        '& .MuiOutlinedInput-root': { 
                                                            borderRadius: 12,
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                            '& fieldset': { borderColor: '#e2e8f0' },
                                                            '&:hover fieldset': { borderColor: '#cbd5e1' }
                                                        }
                                                    }} 
                                                />
                                            )}
                                        />
                                    </Box>
                                    <Box sx={{ flex: '1 1 200px' }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 1.5, fontSize: '16px' }}>
                                            Role *
                                        </Typography>
                                        <Autocomplete
                                            fullWidth
                                            size="medium"
                                            options={MOCK_ROLES}
                                            value={role}
                                            onChange={(_, val) => setRole(val)}
                                            renderInput={(params) => (
                                                <TextField 
                                                    {...params} 
                                                    variant="outlined" 
                                                    sx={{ 
                                                        bgcolor: 'white',
                                                        '& .MuiOutlinedInput-root': { 
                                                            borderRadius: 12,
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                            '& fieldset': { borderColor: '#e2e8f0' },
                                                            '&:hover fieldset': { borderColor: '#cbd5e1' }
                                                        }
                                                    }} 
                                                />
                                            )}
                                        />
                                    </Box>
                                    <Box sx={{ flex: '1 1 200px' }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 1.5, fontSize: '16px' }}>
                                            Level
                                        </Typography>
                                        <Autocomplete
                                            fullWidth
                                            size="medium"
                                            options={MOCK_LEVELS}
                                            value={level}
                                            onChange={(_, val) => setLevel(val)}
                                            renderInput={(params) => (
                                                <TextField 
                                                    {...params} 
                                                    variant="outlined" 
                                                    sx={{ 
                                                        bgcolor: 'white',
                                                        '& .MuiOutlinedInput-root': { 
                                                            borderRadius: 12,
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                            '& fieldset': { borderColor: '#e2e8f0' },
                                                            '&:hover fieldset': { borderColor: '#cbd5e1' }
                                                        }
                                                    }} 
                                                />
                                            )}
                                        />
                                    </Box>
                                    <Box sx={{ flex: '1 1 200px' }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            startIcon={<PersonAdd />}
                                            onClick={handleAdd}
                                            sx={{
                                                bgcolor: THEME_BLUE,
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                height: '56px',
                                                fontSize: '16px',
                                                borderRadius: 12,
                                                boxShadow: '0 4px 12px rgba(0, 33, 71, 0.2)',
                                                '&:hover': { 
                                                    bgcolor: '#001a38',
                                                    boxShadow: '0 6px 16px rgba(0, 33, 71, 0.3)'
                                                }
                                            }}
                                        >
                                            Add Role
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>

                        {/* Table */}
                        <TableContainer component={Paper} elevation={0} sx={{ 
                            border: '1px solid #e2e8f0', 
                            borderRadius: 3,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: THEME_BLUE }}>
                                        <TableCell sx={{ 
                                            color: 'white', 
                                            fontWeight: 700, 
                                            width: '60px', 
                                            textAlign: 'center',
                                            py: 2.5,
                                            fontSize: '16px'
                                        }}>
                                            #
                                        </TableCell>
                                        <TableCell sx={{ 
                                            color: 'white', 
                                            fontWeight: 700,
                                            py: 2.5,
                                            fontSize: '16px'
                                        }}>
                                            ULB Name
                                        </TableCell>
                                        <TableCell sx={{ 
                                            color: 'white', 
                                            fontWeight: 700,
                                            py: 2.5,
                                            fontSize: '16px'
                                        }}>
                                            User Type
                                        </TableCell>
                                        <TableCell sx={{ 
                                            color: 'white', 
                                            fontWeight: 700,
                                            py: 2.5,
                                            fontSize: '16px'
                                        }}>
                                            Role
                                        </TableCell>
                                        <TableCell sx={{ 
                                            color: 'white', 
                                            fontWeight: 700,
                                            py: 2.5,
                                            fontSize: '16px'
                                        }}>
                                            Level
                                        </TableCell>
                                        <TableCell sx={{ 
                                            color: 'white', 
                                            fontWeight: 700, 
                                            textAlign: 'center', 
                                            width: '280px',
                                            py: 2.5,
                                            fontSize: '16px'
                                        }}>
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mappedRoles.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 8, color: '#64748b' }}>
                                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                                                    No roles mapped
                                                </Typography>
                                                <Typography variant="h6">
                                                    Search for an employee and assign roles using the form above
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        mappedRoles.map((row, index) => (
                                            <TableRow key={row.id} sx={{ 
                                                '&:nth-of-type(odd)': { bgcolor: '#f8fafc' }, 
                                                '&:hover': { bgcolor: '#f1f5f9' },
                                                '& td': { py: 2.5 }
                                            }}>
                                                <TableCell align="center" sx={{ 
                                                    fontWeight: 600, 
                                                    color: '#475569',
                                                    fontSize: '16px'
                                                }}>
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell sx={{ 
                                                    fontWeight: 700, 
                                                    color: '#1e293b',
                                                    fontSize: '16px'
                                                }}>
                                                    {row.ulbName}
                                                </TableCell>
                                                <TableCell sx={{ 
                                                    fontSize: '16px',
                                                    color: '#334155'
                                                }}>
                                                    <Chip 
                                                        label={row.userType} 
                                                        icon={row.userType === 'ULB Head' ? <Verified /> : undefined}
                                                        sx={{ 
                                                            bgcolor: row.userType === 'ULB Head' ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 33, 71, 0.1)', 
                                                            color: row.userType === 'ULB Head' ? '#ff0000' : THEME_BLUE, 
                                                            fontWeight: 700,
                                                            fontSize: '14px',
                                                            py: 1,
                                                            px: 1.5,
                                                            borderRadius: 12
                                                        }} 
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ 
                                                    fontSize: '16px',
                                                    color: '#334155'
                                                }}>
                                                    {row.role}
                                                </TableCell>
                                                <TableCell sx={{ 
                                                    fontSize: '16px',
                                                    color: '#334155'
                                                }}>
                                                    <Chip 
                                                        label={row.level} 
                                                        sx={{ 
                                                            bgcolor: 'rgba(0, 200, 83, 0.1)', 
                                                            color: '#00c853', 
                                                            fontWeight: 700,
                                                            fontSize: '14px',
                                                            py: 1,
                                                            px: 1.5,
                                                            borderRadius: 12
                                                        }} 
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            sx={{
                                                                bgcolor: THEME_ACCENT,
                                                                textTransform: 'none',
                                                                fontWeight: 700,
                                                                boxShadow: 'none',
                                                                px: 3,
                                                                py: 1,
                                                                borderRadius: 12,
                                                                fontSize: '14px',
                                                                '&:hover': { 
                                                                    bgcolor: '#1565c0',
                                                                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
                                                                }
                                                            }}
                                                        >
                                                            Map Menus
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            startIcon={<Delete />}
                                                            onClick={() => handleRevoke(row.id)}
                                                            sx={{
                                                                bgcolor: THEME_ERROR,
                                                                textTransform: 'none',
                                                                fontWeight: 700,
                                                                boxShadow: 'none',
                                                                px: 3,
                                                                py: 1,
                                                                borderRadius: 12,
                                                                fontSize: '14px',
                                                                '&:hover': { 
                                                                    bgcolor: '#d32f2f',
                                                                    boxShadow: '0 4px 12px rgba(255, 0, 0, 0.2)'
                                                                }
                                                            }}
                                                        >
                                                            Revoke
                                                        </Button>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
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
                            fontSize: '15px',
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

export default MapUser;