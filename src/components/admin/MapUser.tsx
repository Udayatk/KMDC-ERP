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
    Grid,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Tooltip,
    IconButton,
    Card,
    CardContent,
    LinearProgress,
    Badge
} from '@mui/material';
import {
    Search,
    Clear,
    Add,
    Edit,
    Delete,
    Menu as MenuIcon,
    Person,
    Business,
    Assignment,
    CheckCircle,
    Cancel,
    Refresh,
    Info
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
    currentUlb?: string;
    hasExistingAccess: boolean;
}

interface MappedRole {
    id: number;
    employeeId: string;
    employeeName: string;
    ulbName: string;
    section: string;
    userType: string;
    role: string;
    level: string;
    mappedMenus: string[];
    isActive: boolean;
    assignedDate: string;
    lastModified: string;
    assignedBy: string;
    auditTrail: AuditEntry[];
}

interface AuditEntry {
    action: string;
    timestamp: string;
    performedBy: string;
    details: string;
}

interface MenuItem {
    id: string;
    name: string;
    category: string;
    description: string;
}

// --- Mock Data ---
const MOCK_EMPLOYEES: Employee[] = [
    { id: 'EMP001', name: 'Ramesh Kumar', section: 'Engineering', recruitmentType: 'Permanent', designation: 'Junior Engineer', ulbName: 'Bengaluru', wardName: 'Ward 1', currentUlb: 'Bengaluru', hasExistingAccess: true },
    { id: 'EMP002', name: 'Suresh Patil', section: 'Health', recruitmentType: 'Contract', designation: 'Health Inspector', ulbName: 'Mysuru', wardName: 'Ward 5', currentUlb: 'Mysuru', hasExistingAccess: false },
    { id: '1234', name: 'ABCD', section: 'Administration', recruitmentType: 'Permanent', designation: 'Clerk', ulbName: 'Nagamangala', wardName: 'Ward 10', hasExistingAccess: false },
    { id: 'EMP003', name: 'Priya Sharma', section: 'Finance', recruitmentType: 'Permanent', designation: 'Accountant', ulbName: 'Hassan', wardName: 'Ward 3', currentUlb: 'Hassan', hasExistingAccess: true },
    { id: 'EMP004', name: 'Ravi Gowda', section: 'Administration', recruitmentType: 'Contract', designation: 'Assistant', ulbName: 'Tumakuru', wardName: 'Ward 7', hasExistingAccess: false },
    { id: 'EMP005', name: 'Lakshmi Devi', section: 'Health', recruitmentType: 'Permanent', designation: 'Medical Officer', ulbName: 'Bengaluru', wardName: 'Ward 2', currentUlb: 'Bengaluru', hasExistingAccess: true },
];

const MOCK_ULBS = ['Bengaluru', 'Mysuru', 'Nagamangala', 'Hassan', 'Tumakuru'];
const MOCK_SECTIONS = ['Engineering', 'Health', 'Administration', 'Finance', 'Revenue', 'Legal', 'Planning'];
const MOCK_ROLES = ['JE', 'AE', 'AEE', 'Health Inspector', 'Revenue Inspector', 'Clerk', 'Accountant', 'Medical Officer', 'Assistant'];
const MOCK_LEVELS = ['Level 0', 'Level 1', 'Level 2', 'Level 3'];
const MOCK_USER_TYPES = ['ULB Employee', 'ULB Head'];

const MOCK_MENUS: MenuItem[] = [
    { id: 'dashboard', name: 'Dashboard', category: 'Core', description: 'Main dashboard access' },
    { id: 'user_management', name: 'User Management', category: 'Administration', description: 'Manage system users' },
    { id: 'reports', name: 'Reports', category: 'Analytics', description: 'Generate and view reports' },
    { id: 'settings', name: 'Settings', category: 'Configuration', description: 'System configuration' },
    { id: 'audit_logs', name: 'Audit Logs', category: 'Security', description: 'View system audit trails' },
    { id: 'notifications', name: 'Notifications', category: 'Communication', description: 'Manage notifications' },
    { id: 'file_management', name: 'File Management', category: 'Documents', description: 'Manage documents and files' },
    { id: 'workflow', name: 'Workflow', category: 'Process', description: 'Workflow management' },
    { id: 'approvals', name: 'Approvals', category: 'Process', description: 'Handle approvals' },
    { id: 'inventory', name: 'Inventory', category: 'Resources', description: 'Manage inventory items' }
];

const THEME_BLUE = '#002147';
const THEME_RED = '#ff0000';
const THEME_GREEN = '#00c853';

const MapUser: React.FC = () => {
    // Search State
    const [searchQuery, setSearchQuery] = useState<Employee | null>(null);
    const [employeeDetails, setEmployeeDetails] = useState<Employee | null>(null);

    // Form State
    const [preferredUlb, setPreferredUlb] = useState<string | null>(null);
    const [preferredSection, setPreferredSection] = useState<string | null>(null);
    const [userType, setUserType] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [level, setLevel] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState<string>('');
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
    const [existingAccess, setExistingAccess] = useState<MappedRole[]>([]);

    // Grid State
    const [mappedRoles, setMappedRoles] = useState<MappedRole[]>([
        { 
            id: 1,
            employeeId: 'EMP001',
            employeeName: 'Ramesh Kumar',
            ulbName: 'Nelamangala', 
            section: 'Engineering',
            userType: 'ULB Head', 
            role: 'AE', 
            level: 'Level 0',
            mappedMenus: ['dashboard', 'user_management'],
            isActive: true,
            assignedDate: '2024-01-15',
            lastModified: '2024-01-15',
            assignedBy: 'Super Admin',
            auditTrail: [
                {
                    action: 'ROLE_ASSIGNED',
                    timestamp: '2024-01-15 10:30:00',
                    performedBy: 'Super Admin',
                    details: 'ULB Head role assigned for Nelamangala'
                }
            ]
        }
    ]);

    // Dialog states
    const [menuDialogOpen, setMenuDialogOpen] = useState(false);
    const [selectedRoleForMenu, setSelectedRoleForMenu] = useState<MappedRole | null>(null);
    const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

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
        
        // Set employee details
        setEmployeeDetails(searchQuery);
        
        // Pre-populate preferred ULB based on requirement 14 & 15
        if (!searchQuery.hasExistingAccess && searchQuery.ulbName) {
            // If no ULB mapped, pre-set current ULB to Preferred ULB and make it editable
            setPreferredUlb(searchQuery.ulbName);
        } else {
            // If ULB already assigned, allow selection from dropdown
            setPreferredUlb(null);
        }
        
        // Set preferred section based on employee's section
        setPreferredSection(searchQuery.section);
        
        // Fetch and display existing access for the employee
        const employeeExistingAccess = mappedRoles.filter(role => role.employeeId === searchQuery.id);
        setExistingAccess(employeeExistingAccess);
        
        setNotification({ 
            open: true, 
            message: `Employee ${searchQuery.name} loaded successfully. ${employeeExistingAccess.length > 0 ? `Found ${employeeExistingAccess.length} existing access record(s).` : 'No existing access found.'}`, 
            type: 'success' 
        });
    };

    const handleClear = () => {
        setSearchQuery(null);
        setEmployeeDetails(null);
        setPreferredUlb(null);
        setPreferredSection(null);
        setUserType(null);
        setRole(null);
        setLevel(null);
        setSearchInput('');
        setFilteredEmployees([]);
        setExistingAccess([]);
        setNotification({ open: true, message: 'Search results cleared. Ready for new search.', type: 'info' });
    };

    // --- Add Handler with Complete Validation ---
    const handleAdd = () => {
        // Validation 1: Employee must be selected
        if (!employeeDetails) {
            setNotification({ open: true, message: 'Please search and select an employee first', type: 'error' });
            return;
        }

        // Validation 2: All mandatory fields must be selected
        if (!preferredUlb || !preferredSection || !userType || !role) {
            setNotification({ open: true, message: 'Please select all mandatory fields (Preferred ULB, Preferred Section, User Type, Role)', type: 'error' });
            return;
        }

        // Validation 3: ULB Head restriction - only one ULB Head per ULB
        if (userType === 'ULB Head') {
            const existingHead = mappedRoles.find(m => m.ulbName === preferredUlb && m.userType === 'ULB Head' && m.isActive);
            if (existingHead) {
                setNotification({ 
                    open: true, 
                    message: `Access Denied: ${preferredUlb} already has a designated ULB Head (${existingHead.employeeName}).`, 
                    type: 'error' 
                });
                return;
            }
        }

        // Validation 4: Prevent duplicate role assignment
        const isDuplicate = mappedRoles.some(m => 
            m.employeeId === employeeDetails.id && 
            m.ulbName === preferredUlb && 
            m.role === role && 
            m.userType === userType &&
            m.isActive
        );
        if (isDuplicate) {
            setNotification({ open: true, message: 'This role is already assigned to same employee', type: 'error' });
            return;
        }

        // Validation 5: Prevent ULB Head and ULB Employee roles for same employee in same ULB
        const conflictingRole = mappedRoles.find(m => 
            m.employeeId === employeeDetails.id && 
            m.ulbName === preferredUlb && 
            m.userType !== userType &&
            m.isActive
        );
        if (conflictingRole) {
            setNotification({
                open: true,
                message: `This Role is already assigned to ${employeeDetails.name} in ${preferredUlb} ULB`,
                type: 'error'
            });
            return;
        }

        // Create new role with complete audit trail
        const currentTimestamp = new Date().toISOString();
        const newRole: MappedRole = {
            id: Date.now(),
            employeeId: employeeDetails.id,
            employeeName: employeeDetails.name,
            ulbName: preferredUlb,
            section: preferredSection,
            userType,
            role,
            level: level || '-',
            mappedMenus: [],
            isActive: true,
            assignedDate: currentTimestamp.split('T')[0],
            lastModified: currentTimestamp.split('T')[0],
            assignedBy: 'Super Admin', // In real app, this would come from logged-in user
            auditTrail: [
                {
                    action: 'ROLE_ASSIGNED',
                    timestamp: currentTimestamp,
                    performedBy: 'Super Admin',
                    details: `${userType} role '${role}' assigned for ${preferredUlb} in ${preferredSection} section`
                }
            ]
        };

        setMappedRoles([...mappedRoles, newRole]);
        
        // Update existing access display
        const updatedExistingAccess = [...existingAccess, newRole];
        setExistingAccess(updatedExistingAccess);
        
        setNotification({ 
            open: true, 
            message: `Role assigned successfully. ${employeeDetails.name} now has ${userType} access to ${preferredUlb}.`, 
            type: 'success' 
        });
        
        // Clear form after successful addition
        setUserType(null);
        setRole(null);
        setLevel(null);
    };

    // --- Search Input Handler for Auto-complete ---
    const handleSearchInputChange = (value: string) => {
        setSearchInput(value);
        
        if (value.length >= 4) {
            // Filter employees based on first 4 digits of ID or first 4 characters of name
            const filtered = MOCK_EMPLOYEES.filter(emp => 
                emp.id.toLowerCase().startsWith(value.toLowerCase()) ||
                emp.name.toLowerCase().startsWith(value.toLowerCase())
            );
            setFilteredEmployees(filtered);
        } else {
            setFilteredEmployees([]);
        }
    };

    const handleRevoke = (id: number) => {
        const roleToRevoke = mappedRoles.find(r => r.id === id);
        if (!roleToRevoke) return;

        // Add audit trail for revocation
        const updatedRole = {
            ...roleToRevoke,
            isActive: false,
            lastModified: new Date().toISOString().split('T')[0],
            auditTrail: [
                ...roleToRevoke.auditTrail,
                {
                    action: 'ACCESS_REVOKED',
                    timestamp: new Date().toISOString(),
                    performedBy: 'Super Admin',
                    details: `Access revoked for ${roleToRevoke.userType} role in ${roleToRevoke.ulbName}`
                }
            ]
        };

        // Update the role to inactive instead of removing completely (for audit purposes)
        setMappedRoles(mappedRoles.map(r => r.id === id ? updatedRole : r));
        
        // Update existing access display if current employee is selected
        if (employeeDetails && employeeDetails.id === roleToRevoke.employeeId) {
            setExistingAccess(existingAccess.map(r => r.id === id ? updatedRole : r));
        }
        
        setNotification({ 
            open: true, 
            message: `Access revoked successfully. ${roleToRevoke.employeeName} will be logged out if currently active.`, 
            type: 'info' 
        });
    };

    const handleToggleStatus = (id: number) => {
        setMappedRoles(mappedRoles.map(role => 
            role.id === id 
                ? { ...role, isActive: !role.isActive, lastModified: new Date().toISOString().split('T')[0] }
                : role
        ));
        const role = mappedRoles.find(r => r.id === id);
        setNotification({ 
            open: true, 
            message: `Role ${role?.isActive ? 'deactivated' : 'activated'} successfully`, 
            type: 'info' 
        });
    };

    const handleOpenMenuDialog = (role: MappedRole) => {
        setSelectedRoleForMenu(role);
        setSelectedMenus([...role.mappedMenus]);
        setMenuDialogOpen(true);
    };

    const handleCloseMenuDialog = () => {
        setMenuDialogOpen(false);
        setSelectedRoleForMenu(null);
        setSelectedMenus([]);
    };

    const handleMenuToggle = (menuId: string) => {
        setSelectedMenus(prev => 
            prev.includes(menuId) 
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    const handleSaveMenuMapping = async () => {
        if (!selectedRoleForMenu) return;
        
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setMappedRoles(mappedRoles.map(role => 
            role.id === selectedRoleForMenu.id 
                ? { ...role, mappedMenus: [...selectedMenus], lastModified: new Date().toISOString().split('T')[0] }
                : role
        ));
        
        setNotification({ open: true, message: 'Menu mapping updated successfully', type: 'success' });
        setIsLoading(false);
        handleCloseMenuDialog();
    };

    const getMenusByCategory = () => {
        const categories: Record<string, MenuItem[]> = {};
        MOCK_MENUS.forEach(menu => {
            if (!categories[menu.category]) categories[menu.category] = [];
            categories[menu.category].push(menu);
        });
        return categories;
    };

    const DetailItem = ({ label, value }: { label: string, value: string }) => (
        <Box sx={{ mb: 1 }}>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5, fontWeight: 500 }}>
                {label}
            </Typography>
            <Box sx={{
                bgcolor: '#f1f5f9',
                p: 1,
                borderRadius: 1,
                border: '1px solid #cbd5e1',
                minHeight: '35px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                    {value || '-'}
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Fade in={true}>
            <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
                <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    {/* Header */}
                    <Box sx={{ bgcolor: THEME_BLUE, py: 2, px: 3 }}>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>
                            Map User - Role and Menu Mapping
                        </Typography>
                    </Box>

                    <Box sx={{ p: 4 }}>
                        {/* Search Section with Validation */}
                        <Card sx={{ mb: 4, border: '2px solid #3b82f6' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Search sx={{ color: THEME_BLUE }} />
                                    <Typography variant="h6" sx={{ color: THEME_BLUE, fontWeight: 600 }}>
                                        Employee Search (Super Admin Access)
                                    </Typography>
                                </Box>
                                
                                <Alert severity="info" sx={{ mb: 3 }}>
                                    <Typography variant="body2">
                                        <strong>Search Instructions:</strong> Enter at least 4 digits of Employee ID or 4 characters of Employee Name to auto-display results.
                                    </Typography>
                                </Alert>

                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                                    <Autocomplete
                                        sx={{ minWidth: 450, flex: 1 }}
                                        options={searchInput.length >= 4 ? filteredEmployees : MOCK_EMPLOYEES}
                                        getOptionLabel={(option) => `${option.name} (${option.id}) - ${option.designation}`}
                                        value={searchQuery}
                                        onChange={(_, newValue) => {
                                            setSearchQuery(newValue);
                                            if (newValue) {
                                                setSearchInput(`${newValue.name} (${newValue.id})`);
                                            }
                                        }}
                                        onInputChange={(_, value) => handleSearchInputChange(value)}
                                        inputValue={searchInput}
                                        renderOption={(props, option) => {
                                            const { key, ...otherProps } = props;
                                            return (
                                                <Box component="li" key={key} {...otherProps} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid #e2e8f0' }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                    <Box>
                                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                            {option.name} ({option.id})
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                            {option.designation} • {option.ulbName} • {option.section}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Chip 
                                                            label={option.hasExistingAccess ? 'Has Access' : 'No Access'} 
                                                            size="small" 
                                                            color={option.hasExistingAccess ? 'success' : 'default'}
                                                        />
                                                        <Chip 
                                                            label={option.recruitmentType} 
                                                            size="small" 
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                </Box>
                                            </Box>
                                            );
                                        }}
                                        renderInput={(params) => (
                                            <TextField 
                                                {...params} 
                                                label="Search User / Employee *" 
                                                placeholder="Enter 4+ digits of ID or 4+ characters of name..."
                                                variant="outlined" 
                                                size="medium"
                                                required
                                                error={searchInput.length > 0 && searchInput.length < 4}
                                                helperText={searchInput.length > 0 && searchInput.length < 4 ? 'Minimum 4 characters required' : ''}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '&:hover fieldset': { borderColor: THEME_BLUE },
                                                        '&.Mui-focused fieldset': { borderColor: THEME_BLUE }
                                                    }
                                                }}
                                            />
                                        )}
                                        noOptionsText={searchInput.length < 4 ? "Enter at least 4 characters" : "No employees found"}
                                    />
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={handleSearch}
                                        startIcon={<Search />}
                                        disabled={!searchQuery}
                                        sx={{ 
                                            bgcolor: THEME_BLUE, 
                                            textTransform: 'none', 
                                            px: 3,
                                            minWidth: 120,
                                            '&:hover': { bgcolor: '#001a38' },
                                            '&:disabled': { bgcolor: '#94a3b8', color: 'white' }
                                        }}
                                    >
                                        Search
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={handleClear}
                                        startIcon={<Refresh />}
                                        sx={{ 
                                            color: '#64748b', 
                                            borderColor: '#cbd5e1', 
                                            textTransform: 'none', 
                                            px: 3,
                                            minWidth: 120,
                                            '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' } 
                                        }}
                                    >
                                        Clear & Reload
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>

                        <Divider sx={{ mb: 4 }} />

                        {/* Employee Details Section */}
                        <Card sx={{ mb: 4, border: employeeDetails ? '2px solid #10b981' : '1px solid #e2e8f0' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <Person sx={{ color: THEME_BLUE }} />
                                    <Typography variant="h6" sx={{ color: THEME_BLUE, fontWeight: 600 }}>
                                        Employee Details (Non-Editable)
                                    </Typography>
                                    {employeeDetails && (
                                        <Chip 
                                            label="Auto-Populated" 
                                            color="success" 
                                            size="small" 
                                            icon={<CheckCircle />}
                                        />
                                    )}
                                </Box>
                                {!employeeDetails ? (
                                    <Box sx={{ 
                                        textAlign: 'center', 
                                        py: 6, 
                                        color: '#64748b',
                                        bgcolor: '#f8fafc',
                                        borderRadius: 2,
                                        border: '2px dashed #cbd5e1'
                                    }}>
                                        <Person sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                                            No Employee Selected
                                        </Typography>
                                        <Typography variant="body2">
                                            Search and select an employee to auto-populate their details
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={3}><DetailItem label="Employee ID" value={employeeDetails.id} /></Grid>
                                        <Grid item xs={12} md={3}><DetailItem label="Employee Name" value={employeeDetails.name} /></Grid>
                                        <Grid item xs={12} md={3}><DetailItem label="Section" value={employeeDetails.section} /></Grid>
                                        <Grid item xs={12} md={3}><DetailItem label="Recruitment Type" value={employeeDetails.recruitmentType} /></Grid>
                                        <Grid item xs={12} md={3}><DetailItem label="Designation" value={employeeDetails.designation} /></Grid>
                                        <Grid item xs={12} md={3}><DetailItem label="Current ULB" value={employeeDetails.ulbName} /></Grid>
                                        <Grid item xs={12} md={3}><DetailItem label="Ward Name" value={employeeDetails.wardName} /></Grid>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ mb: 1 }}>
                                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5, fontWeight: 500 }}>
                                                    Access Status
                                                </Typography>
                                                <Chip 
                                                    label={employeeDetails.hasExistingAccess ? `Has Access (${existingAccess.filter(a => a.isActive).length} active)` : 'No Access'}
                                                    color={employeeDetails.hasExistingAccess ? 'success' : 'default'}
                                                    size="small"
                                                    sx={{ fontWeight: 600 }}
                                                    icon={employeeDetails.hasExistingAccess ? <CheckCircle /> : <Cancel />}
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                )}
                            </CardContent>
                        </Card>

                        {/* Existing Access Display - Requirement 6 */}
                        {employeeDetails && existingAccess.length > 0 && (
                            <Card sx={{ mb: 4, border: '1px solid #f59e0b', bgcolor: '#fffbeb' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <Assignment sx={{ color: '#f59e0b' }} />
                                        <Typography variant="h6" sx={{ color: '#f59e0b', fontWeight: 600 }}>
                                            Current Application Access
                                        </Typography>
                                        <Badge badgeContent={existingAccess.filter(a => a.isActive).length} color="warning">
                                            <Typography variant="body2" sx={{ color: '#92400e', fontWeight: 500 }}>
                                                Active Roles
                                            </Typography>
                                        </Badge>
                                    </Box>
                                    
                                    <Alert severity="warning" sx={{ mb: 2 }}>
                                        This employee already has the following access in the application:
                                    </Alert>
                                    
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {existingAccess.map((access, index) => (
                                            <Chip
                                                key={index}
                                                label={`${access.userType} - ${access.ulbName} (${access.role})`}
                                                color={access.isActive ? 'warning' : 'default'}
                                                variant={access.isActive ? 'filled' : 'outlined'}
                                                size="small"
                                                sx={{ fontWeight: 500 }}
                                            />
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        )}

                        <Divider sx={{ mb: 4 }} />

                        {/* Role Assignment Section */}
                        <Card sx={{ mb: 4, border: '2px solid #3b82f6' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <Assignment sx={{ color: THEME_BLUE }} />
                                    <Typography variant="h6" sx={{ color: THEME_BLUE, fontWeight: 600 }}>
                                        Grant/Revoke Application Access
                                    </Typography>
                                    <Tooltip title="Assign ULB access and roles with proper validation">
                                        <IconButton size="small">
                                            <Info sx={{ fontSize: 18, color: '#64748b' }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                
                                {!employeeDetails ? (
                                    <Box sx={{ 
                                        textAlign: 'center', 
                                        py: 4, 
                                        color: '#64748b',
                                        bgcolor: '#f8fafc',
                                        borderRadius: 2,
                                        border: '2px dashed #cbd5e1'
                                    }}>
                                        <Assignment sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            Please select an employee first to assign roles
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box>
                                        <Alert severity="info" sx={{ mb: 3 }}>
                                            <Typography variant="body2">
                                                <strong>Selected Employee:</strong> {employeeDetails.name} ({employeeDetails.id}) - {employeeDetails.designation}
                                                <br />
                                                <strong>Current ULB:</strong> {employeeDetails.ulbName || 'Not Assigned'} | 
                                                <strong> Section:</strong> {employeeDetails.section}
                                            </Typography>
                                        </Alert>
                                        
                                        <Grid container spacing={3} alignItems="flex-end">
                                            <Grid item xs={12} md={2.4}>
                                                <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', mb: 1, display: 'block' }}>
                                                    Preferred ULB * 
                                                    <Tooltip title={!employeeDetails.hasExistingAccess ? "Pre-set from current ULB and editable" : "Select from dropdown list"}>
                                                        <Info sx={{ fontSize: 12, ml: 0.5, color: '#64748b' }} />
                                                    </Tooltip>
                                                </Typography>
                                                <Autocomplete
                                                    fullWidth
                                                    size="small"
                                                    options={MOCK_ULBS}
                                                    value={preferredUlb}
                                                    onChange={(_, val) => setPreferredUlb(val)}
                                                    renderInput={(params) => (
                                                        <TextField 
                                                            {...params} 
                                                            variant="outlined" 
                                                            required
                                                            sx={{ 
                                                                bgcolor: 'white',
                                                                '& .MuiOutlinedInput-root': {
                                                                    '&:hover fieldset': { borderColor: THEME_BLUE },
                                                                    '&.Mui-focused fieldset': { borderColor: THEME_BLUE }
                                                                }
                                                            }} 
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={2.4}>
                                                <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', mb: 1, display: 'block' }}>
                                                    Preferred Section *
                                                    <Tooltip title="Pre-populated from employee section">
                                                        <Info sx={{ fontSize: 12, ml: 0.5, color: '#64748b' }} />
                                                    </Tooltip>
                                                </Typography>
                                                <Autocomplete
                                                    fullWidth
                                                    size="small"
                                                    options={MOCK_SECTIONS}
                                                    value={preferredSection}
                                                    onChange={(_, val) => setPreferredSection(val)}
                                                    renderInput={(params) => (
                                                        <TextField 
                                                            {...params} 
                                                            variant="outlined" 
                                                            required
                                                            sx={{ 
                                                                bgcolor: 'white',
                                                                '& .MuiOutlinedInput-root': {
                                                                    '&:hover fieldset': { borderColor: THEME_BLUE },
                                                                    '&.Mui-focused fieldset': { borderColor: THEME_BLUE }
                                                                }
                                                            }} 
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={2.4}>
                                                <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', mb: 1, display: 'block' }}>
                                                    User Type *
                                                    <Tooltip title="ULB Employee or ULB Head (only one Head per ULB)">
                                                        <Info sx={{ fontSize: 12, ml: 0.5, color: '#64748b' }} />
                                                    </Tooltip>
                                                </Typography>
                                                <Autocomplete
                                                    fullWidth
                                                    size="small"
                                                    options={preferredUlb ? MOCK_USER_TYPES : []}
                                                    value={userType}
                                                    onChange={(_, val) => setUserType(val)}
                                                    disabled={!preferredUlb}
                                                    renderInput={(params) => (
                                                        <TextField 
                                                            {...params} 
                                                            variant="outlined" 
                                                            required
                                                            placeholder={!preferredUlb ? "Select ULB first" : ""}
                                                            sx={{ 
                                                                bgcolor: 'white',
                                                                '& .MuiOutlinedInput-root': {
                                                                    '&:hover fieldset': { borderColor: THEME_BLUE },
                                                                    '&.Mui-focused fieldset': { borderColor: THEME_BLUE }
                                                                }
                                                            }} 
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={2.4}>
                                                <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', mb: 1, display: 'block' }}>
                                                    Role *
                                                </Typography>
                                                <Autocomplete
                                                    fullWidth
                                                    size="small"
                                                    options={MOCK_ROLES}
                                                    value={role}
                                                    onChange={(_, val) => setRole(val)}
                                                    renderInput={(params) => (
                                                        <TextField 
                                                            {...params} 
                                                            variant="outlined" 
                                                            required
                                                            sx={{ 
                                                                bgcolor: 'white',
                                                                '& .MuiOutlinedInput-root': {
                                                                    '&:hover fieldset': { borderColor: THEME_BLUE },
                                                                    '&.Mui-focused fieldset': { borderColor: THEME_BLUE }
                                                                }
                                                            }} 
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={2.4}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    onClick={handleAdd}
                                                    startIcon={<Add />}
                                                    disabled={!preferredUlb || !preferredSection || !userType || !role}
                                                    sx={{
                                                        bgcolor: THEME_BLUE,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        height: '40px',
                                                        '&:hover': { bgcolor: '#001a38' },
                                                        '&:disabled': { bgcolor: '#94a3b8', color: 'white' }
                                                    }}
                                                >
                                                    Add ULB and Role
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        
                                        <Box sx={{ mt: 2, p: 2, bgcolor: '#f0f9ff', borderRadius: 1, border: '1px solid #bae6fd' }}>
                                            <Typography variant="caption" sx={{ color: '#0369a1', display: 'block', mb: 1 }}>
                                                <strong>Validation Notes:</strong>
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#0369a1', fontSize: '0.8rem' }}>
                                                • Only one ULB Head allowed per ULB • Cannot assign both ULB Head and Employee roles to same person in same ULB<br/>
                                                • All fields marked with * are mandatory • System will validate and prevent duplicate assignments
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>

                        {/* Assigned Roles Table */}
                        <Card sx={{ border: '1px solid #e2e8f0' }}>
                            <CardContent sx={{ p: 0 }}>
                                <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Business sx={{ color: THEME_BLUE }} />
                                            <Typography variant="h6" sx={{ color: THEME_BLUE, fontWeight: 600 }}>
                                                Assigned Roles & Permissions
                                            </Typography>
                                        </Box>
                                        <Badge badgeContent={mappedRoles.length} color="primary" sx={{ '& .MuiBadge-badge': { bgcolor: THEME_BLUE } }}>
                                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                                                Total Assignments
                                            </Typography>
                                        </Badge>
                                    </Box>
                                    {employeeDetails && (
                                        <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
                                            Role assignments for <strong>{employeeDetails.name}</strong> ({employeeDetails.id})
                                        </Typography>
                                    )}
                                </Box>

                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: THEME_BLUE }}>
                                                <TableCell sx={{ color: 'white', fontWeight: 700, width: '60px', textAlign: 'center' }}>Sl No</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Employee</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 700 }}>ULB Name</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Section</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 700 }}>User Type</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Role</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 700, textAlign: 'center' }}>Status</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 700, textAlign: 'center' }}>Menus</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 700, textAlign: 'center' }}>Assigned Date</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 700, textAlign: 'center' }}>Assigned By</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 700, textAlign: 'center', width: '180px' }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {mappedRoles.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={11} align="center" sx={{ py: 8 }}>
                                                        <Box sx={{ color: '#64748b' }}>
                                                            <Assignment sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                                                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                                                                No Roles Assigned
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                Select an employee and assign roles to get started
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                // Show only active roles in the main view, with option to show all
                                                mappedRoles.filter(row => row.isActive || !employeeDetails || row.employeeId === employeeDetails.id).map((row, index) => (
                                                    <TableRow 
                                                        key={row.id} 
                                                        sx={{ 
                                                            '&:nth-of-type(odd)': { bgcolor: '#f8fafc' }, 
                                                            '&:hover': { bgcolor: '#f1f5f9' },
                                                            opacity: row.isActive ? 1 : 0.6,
                                                            border: !row.isActive ? '1px solid #fbbf24' : 'none'
                                                        }}
                                                    >
                                                        <TableCell align="center" sx={{ fontWeight: 500, color: '#64748b' }}>
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                    {row.employeeName}
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                                    {row.employeeId}
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Business sx={{ fontSize: 16, color: '#64748b' }} />
                                                                {row.ulbName}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell sx={{ fontWeight: 500 }}>{row.section}</TableCell>
                                                        <TableCell>
                                                            <Chip 
                                                                label={row.userType} 
                                                                size="small"
                                                                color={row.userType === 'ULB Head' ? 'primary' : 'default'}
                                                                sx={{ fontWeight: 500 }}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={{ fontWeight: 500 }}>{row.role}</TableCell>
                                                        <TableCell align="center">
                                                            <Chip 
                                                                label={row.isActive ? 'Active' : 'Revoked'} 
                                                                size="small"
                                                                color={row.isActive ? 'success' : 'warning'}
                                                                icon={row.isActive ? <CheckCircle /> : <Cancel />}
                                                                sx={{ fontWeight: 600 }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Badge 
                                                                badgeContent={row.mappedMenus.length} 
                                                                color="info"
                                                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                                            >
                                                                <MenuIcon sx={{ color: '#64748b' }} />
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell align="center" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                                                            {row.assignedDate}
                                                        </TableCell>
                                                        <TableCell align="center" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                                                            {row.assignedBy}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                                                                {row.isActive && (
                                                                    <Tooltip title="Map menus">
                                                                        <Button
                                                                            variant="contained"
                                                                            size="small"
                                                                            onClick={() => handleOpenMenuDialog(row)}
                                                                            sx={{
                                                                                bgcolor: THEME_GREEN,
                                                                                textTransform: 'none',
                                                                                fontWeight: 600,
                                                                                boxShadow: 'none',
                                                                                minWidth: 'auto',
                                                                                px: 1,
                                                                                '&:hover': { bgcolor: '#00a344' }
                                                                            }}
                                                                        >
                                                                            <MenuIcon sx={{ fontSize: 14 }} />
                                                                        </Button>
                                                                    </Tooltip>
                                                                )}
                                                                {row.isActive && (
                                                                    <Tooltip title="Revoke access (will logout user)">
                                                                        <Button
                                                                            variant="contained"
                                                                            size="small"
                                                                            onClick={() => {
                                                                                if (window.confirm(`Are you sure you want to revoke ${row.employeeName}'s access to ${row.ulbName}? This will immediately log out the user and remove all permissions.`)) {
                                                                                    handleRevoke(row.id);
                                                                                }
                                                                            }}
                                                                            sx={{
                                                                                bgcolor: THEME_RED,
                                                                                textTransform: 'none',
                                                                                fontWeight: 600,
                                                                                boxShadow: 'none',
                                                                                minWidth: 'auto',
                                                                                px: 1,
                                                                                '&:hover': { bgcolor: '#d32f2f' }
                                                                            }}
                                                                        >
                                                                            <Delete sx={{ fontSize: 14 }} />
                                                                        </Button>
                                                                    </Tooltip>
                                                                )}
                                                                {!row.isActive && (
                                                                    <Tooltip title="Access already revoked">
                                                                        <Chip 
                                                                            label="Revoked" 
                                                                            size="small" 
                                                                            color="warning"
                                                                            sx={{ fontSize: '0.75rem' }}
                                                                        />
                                                                    </Tooltip>
                                                                )}
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Box>
                </Paper>

                {/* Menu Mapping Dialog */}
                <Dialog 
                    open={menuDialogOpen} 
                    onClose={handleCloseMenuDialog}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle sx={{ 
                        bgcolor: THEME_BLUE, 
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <MenuIcon />
                        <Box>
                            <Typography component="div" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>Menu Mapping</Typography>
                            {selectedRoleForMenu && (
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    {selectedRoleForMenu.role} - {selectedRoleForMenu.ulbName}
                                </Typography>
                            )}
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ p: 3 }}>
                        {isLoading && <LinearProgress sx={{ mb: 2 }} />}
                        
                        <Alert severity="info" sx={{ mb: 3 }}>
                            Select the menus and features that this role should have access to. Changes will be applied immediately.
                        </Alert>

                        <Typography variant="h6" sx={{ mb: 2, color: THEME_BLUE, fontWeight: 600 }}>
                            Available Menus
                        </Typography>
                        
                        {Object.entries(getMenusByCategory()).map(([category, menus]) => (
                            <Box key={category} sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" sx={{ 
                                    mb: 2, 
                                    fontWeight: 600, 
                                    color: '#374151',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <Chip 
                                        label={category} 
                                        size="small" 
                                        sx={{ bgcolor: THEME_BLUE, color: 'white' }}
                                    />
                                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                                        ({menus.filter(menu => selectedMenus.includes(menu.id)).length}/{menus.length} selected)
                                    </Typography>
                                </Typography>
                                
                                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8fafc' }}>
                                    <FormGroup>
                                        {menus.map((menu) => (
                                            <FormControlLabel
                                                key={menu.id}
                                                control={
                                                    <Checkbox
                                                        checked={selectedMenus.includes(menu.id)}
                                                        onChange={() => handleMenuToggle(menu.id)}
                                                        sx={{
                                                            color: THEME_BLUE,
                                                            '&.Mui-checked': { color: THEME_BLUE }
                                                        }}
                                                    />
                                                }
                                                label={
                                                    <Box>
                                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                            {menu.name}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                            {menu.description}
                                                        </Typography>
                                                    </Box>
                                                }
                                                sx={{ mb: 1 }}
                                            />
                                        ))}
                                    </FormGroup>
                                </Paper>
                            </Box>
                        ))}

                        <Box sx={{ mt: 3, p: 2, bgcolor: '#f0f9ff', borderRadius: 1, border: '1px solid #bae6fd' }}>
                            <Typography variant="body2" sx={{ color: '#0369a1' }}>
                                <strong>Selected Menus:</strong> {selectedMenus.length === 0 ? 'None' : 
                                selectedMenus.map(id => MOCK_MENUS.find(m => m.id === id)?.name).join(', ')}
                            </Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, gap: 2 }}>
                        <Button 
                            onClick={handleCloseMenuDialog}
                            variant="outlined"
                            sx={{ 
                                color: '#64748b', 
                                borderColor: '#cbd5e1',
                                '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSaveMenuMapping}
                            variant="contained"
                            disabled={isLoading}
                            sx={{ 
                                bgcolor: THEME_BLUE,
                                '&:hover': { bgcolor: '#001a38' }
                            }}
                        >
                            {isLoading ? 'Saving...' : 'Save Menu Mapping'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Notification */}
                <Snackbar
                    open={notification.open}
                    autoHideDuration={4000}
                    onClose={() => setNotification({ ...notification, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert severity={notification.type} onClose={() => setNotification({ ...notification, open: false })} variant="filled">
                        {notification.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Fade>
    );
};

export default MapUser;
