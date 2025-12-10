'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Fade,
    Tooltip,
    Autocomplete,
    Container
} from '@mui/material';
import { TYPOGRAPHY, COLORS } from '../shared/typography';
import { PADDING, MARGIN, GRID_SPACING, BUTTON_SIZES } from '../shared/responsive';
import {
    Add,
    UploadFile,
    Edit,
    Close,
    Download,
    Assignment,
    Search
} from '@mui/icons-material';

// --- Types ---
interface Employee {
    id: string;
    name: string;
    dob: string;
    mobile: string;
    email: string;
    address: string;
    pinCode: string;
    recruitmentType: string;
    joiningDate: string;
    ulbName: string;
    wardName: string;
    ulbDistrict: string;
    sectionName: string;
    subSectionName: string;
    designation: string;
    exitDate?: string;
    reasonForExit?: string;
    status: 'Active' | 'Inactive';
}

// --- Mock Data ---
const MOCK_EMPLOYEES: Employee[] = [
    {
        id: 'EMP001',
        name: 'Ramesh Kumar',
        dob: '1985-05-15',
        mobile: '9876543210',
        email: 'ramesh.k@karnataka.gov.in',
        address: '123, MG Road, Bengaluru',
        pinCode: '560001',
        recruitmentType: 'Permanent',
        joiningDate: '2010-06-01',
        ulbName: 'BBMP',
        wardName: 'Ward 1',
        ulbDistrict: 'Bengaluru Urban',
        sectionName: 'Health',
        subSectionName: 'Sanitation',
        designation: 'Health Inspector',
        status: 'Active'
    }
];

const THEME_BLUE = '#002147'; // Dark Navy Blue
const THEME_ACCENT = '#1976d2'; // Secondary blue for accents
const THEME_SUCCESS = '#00c853'; // Success green
const THEME_WARNING = '#ffab00'; // Warning amber
const THEME_ERROR = '#d50000'; // Error red
const THEME_LIGHT_BG = '#f8fafc'; // Light background
const THEME_DARK_TEXT = '#0f172a'; // Dark text
const THEME_MEDIUM_TEXT = '#64748b'; // Medium text

const UserManagement: React.FC = () => {
    // State
    const [view, setView] = useState<'list' | 'form'>('list');
    const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    // Form State
    const initialFormState: Employee = {
        id: '',
        name: '',
        dob: '',
        mobile: '',
        email: '',
        address: '',
        pinCode: '',
        recruitmentType: '',
        joiningDate: '',
        ulbName: '',
        wardName: '',
        ulbDistrict: '',
        sectionName: '',
        subSectionName: '',
        designation: '',
        exitDate: '',
        reasonForExit: '',
        status: 'Active'
    };
    const [formData, setFormData] = useState<Employee>(initialFormState);
    const [isEditable, setIsEditable] = useState(true);

    // Helpers
    const handleInputChange = (field: keyof Employee, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = (data: Employee) => {
        if (!data.name || !data.dob || !data.mobile || !data.ulbName) {
            alert('Please fill mandatory fields');
            return false;
        }
        return true;
    };

    const handleCreateNew = () => {
        setFormData(initialFormState);
        setIsEditable(true);
        setView('form');
    };

    const handleEdit = (emp: Employee) => {
        setFormData(emp);
        setIsEditable(true);
        setView('form');
    };

    const handleSave = () => {
        if (!validateForm(formData)) return;

        // Upsert logic
        const existingIndex = employees.findIndex(e => e.id === formData.id);
        if (existingIndex >= 0) {
            const updated = [...employees];
            updated[existingIndex] = formData;
            setEmployees(updated);
            alert('User details updated successfully');
        } else {
            const newId = formData.id || `EMP${Math.floor(Math.random() * 10000)}`;
            setEmployees([...employees, { ...formData, id: newId }]);
            alert(`User created successfully with ID: ${newId}`);
        }
        setView('list');
    };

    // --- Sub-Components ---
    const renderList = () => (
        <Fade in={true}>
            <Box sx={{ p: { xs: PADDING.XS, sm: PADDING.SM, md: PADDING.MD } }}>
                {/* Header */}
                <Box sx={{ mb: MARGIN.LG }}>
                    <Typography variant="h4" sx={{ ...TYPOGRAPHY.HEADER_MEDIUM, color: COLORS.DARK_TEXT, mb: MARGIN.SM }}>
                        Employee / User Details
                    </Typography>
                    <Typography variant="h6" sx={{ ...TYPOGRAPHY.BODY_LARGE, color: COLORS.MEDIUM_TEXT }}>
                        Manage system users, create new employees, or bulk upload via Excel.
                    </Typography>
                </Box>

                {/* Toolbar */}
                <Box sx={{ display: 'flex', gap: GRID_SPACING.LG, alignItems: 'center', flexWrap: 'wrap', mb: MARGIN.LG }}>
                    <Button
                        variant="contained"
                        startIcon={<Add sx={{ fontSize: 20 }} />}
                        onClick={handleCreateNew}
                        sx={{ 
                            bgcolor: THEME_BLUE, 
                            fontWeight: 600, 
                            textTransform: 'none',
                            borderRadius: '12px',
                            px: 3.5,
                            py: 1.5,
                            fontSize: '1rem',
                            boxShadow: '0 4px 6px rgba(0, 33, 71, 0.15)',
                            '&:hover': { 
                                bgcolor: '#001a38',
                                boxShadow: '0 6px 12px rgba(0, 33, 71, 0.25)'
                            }
                        }}
                    >
                        Create New User
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<UploadFile sx={{ fontSize: 20 }} />}
                        onClick={() => setIsUploadOpen(true)}
                        sx={{ 
                            bgcolor: THEME_BLUE, 
                            fontWeight: 600, 
                            textTransform: 'none',
                            borderRadius: '12px',
                            px: 3.5,
                            py: 1.5,
                            fontSize: '1rem',
                            boxShadow: '0 4px 6px rgba(0, 33, 71, 0.15)',
                            '&:hover': { 
                                bgcolor: '#001a38',
                                boxShadow: '0 6px 12px rgba(0, 33, 71, 0.25)'
                            }
                        }}
                    >
                        Add Users through Excel Sheet
                    </Button>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', width: { xs: '100%', sm: 380 } }}>
                        <TextField
                            placeholder="Search User / Employee"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': { 
                                    borderRadius: '12px', 
                                    bgcolor: 'white',
                                    fontSize: '1rem',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                }
                            }}
                            fullWidth
                            size="medium"
                        />
                        <Button 
                            variant="contained" 
                            startIcon={<Search sx={{ fontSize: 20 }} />}
                            sx={{ 
                                bgcolor: THEME_BLUE, 
                                borderRadius: '12px', 
                                textTransform: 'none', 
                                px: 3.5,
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600,
                                boxShadow: '0 4px 6px rgba(0, 33, 71, 0.15)',
                                '&:hover': { 
                                    bgcolor: '#001a38',
                                    boxShadow: '0 6px 12px rgba(0, 33, 71, 0.25)'
                                }
                            }}
                        >
                            Search
                        </Button>
                    </Box>
                </Box>
                
                {/* Table */}
                <Paper sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <Box sx={{ bgcolor: THEME_BLUE, px: 4, py: 2.5, color: 'white' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1.25rem' }}>Employee List</Typography>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                                    {['ID', 'Name', 'Designation', 'ULB', 'Mobile', 'Status', 'Actions'].map(head => (
                                        <TableCell 
                                            key={head} 
                                            sx={{ 
                                                ...TYPOGRAPHY.CAPTION_LARGE,
                                                color: COLORS.DARK_TEXT,
                                                py: 2.5,
                                                borderBottom: `2px solid ${COLORS.BORDER}`,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}
                                        >
                                            {head}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employees.filter(e =>
                                    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    e.id.toLowerCase().includes(searchQuery.toLowerCase())
                                ).map((emp, index) => (
                                    <TableRow 
                                        key={emp.id} 
                                        hover
                                        sx={{
                                            bgcolor: index % 2 === 0 ? 'white' : '#f8fafc',
                                            '&:hover': { bgcolor: '#f1f5f9', boxShadow: 'inset 4px 0 0 #002147' },
                                            '&:last-child td, &:last-child th': { border: 0 }
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 600, color: '#0f172a', py: 2 }}>{emp.id}</TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ ...TYPOGRAPHY.BODY_LARGE, fontWeight: 600, color: COLORS.DARK_TEXT }}>{emp.name}</Typography>
                                                <Typography variant="body2" sx={{ ...TYPOGRAPHY.BODY_MEDIUM, color: COLORS.MEDIUM_TEXT }}>{emp.email}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ color: '#475569', fontWeight: 500 }}>{emp.designation}</TableCell>
                                        <TableCell sx={{ color: '#475569', fontWeight: 500 }}>{emp.ulbName}</TableCell>
                                        <TableCell sx={{ color: '#475569', fontWeight: 500 }}>{emp.mobile}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={emp.status}
                                                size="small"
                                                color={emp.status === 'Active' ? 'success' : 'default'}
                                                variant="outlined"
                                                sx={{
                                                    fontWeight: 600,
                                                    borderRadius: 12,
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderColor: emp.status === 'Active' ? '#16a34a' : '#94a3b8',
                                                    color: emp.status === 'Active' ? '#166534' : '#64748b'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                                                <Tooltip title="Edit Details">
                                                    <IconButton 
                                                        size="medium" 
                                                        color="primary" 
                                                        onClick={() => handleEdit(emp)}
                                                        sx={{
                                                            bgcolor: 'rgba(0, 33, 71, 0.08)',
                                                            '&:hover': { bgcolor: 'rgba(0, 33, 71, 0.15)', transform: 'translateY(-1px)' },
                                                            borderRadius: 3,
                                                            transition: 'all 0.2s ease-in-out'
                                                        }}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Assign Modules">
                                                    <IconButton 
                                                        size="medium" 
                                                        color="secondary" 
                                                        onClick={() => {
                                                            // In a real implementation, this would navigate to the Assign Modules view
                                                            alert(`Navigate to Assign Modules for ${emp.name}`);
                                                        }}
                                                        sx={{
                                                            bgcolor: 'rgba(25, 118, 210, 0.08)',
                                                            '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.15)', transform: 'translateY(-1px)' },
                                                            borderRadius: 3,
                                                            transition: 'all 0.2s ease-in-out'
                                                        }}
                                                    >
                                                        <Assignment />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </Fade>
    );

    const renderForm = () => {
        const fieldStyle = {
            '& .MuiOutlinedInput-root': { 
                bgcolor: 'white', 
                borderRadius: 12, 
                height: '56px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                '& fieldset': { borderColor: COLORS.BORDER, borderWidth: 1 },
                '&:hover fieldset': { borderColor: '#cbd5e1', borderWidth: 1 },
                '&.Mui-focused fieldset': { borderColor: THEME_BLUE, borderWidth: 2 },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            },
            '& .MuiInputBase-input': { py: 1.8, px: 2.5, ...TYPOGRAPHY.BODY_LARGE },
            '& .MuiInputLabel-root': { 
                ...TYPOGRAPHY.BODY_LARGE,
                fontWeight: 500,
                color: '#475569',
                '&.Mui-focused': { color: THEME_BLUE, fontWeight: 600 }
            }
        };

        const renderFieldRow = (label: string, field: keyof Employee, type: string = 'text', options: string[] = []) => (
            <Box key={field} sx={{ display: 'flex', alignItems: 'center', mb: 3.5 }}>
                <Box sx={{ width: '35%', textAlign: 'right', pr: 3 }}>
                    <Typography variant="body1" sx={{ ...TYPOGRAPHY.CAPTION_LARGE, fontWeight: 600, color: COLORS.DARK_TEXT }}>{label}</Typography>
                </Box>
                <Box sx={{ width: '65%' }}>
                    {type === 'select' ? (
                        <TextField
                            select fullWidth
                            value={(formData as any)[field] || ''}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            disabled={!isEditable}
                            sx={fieldStyle}
                        >
                            {options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                        </TextField>
                    ) : (
                        <TextField
                            fullWidth
                            type={type}
                            value={(formData as any)[field] || ''}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            disabled={!isEditable}
                            sx={fieldStyle}
                            InputLabelProps={type === 'date' ? { shrink: true } : {}}
                        />
                    )}
                </Box>
            </Box>
        );

        return (
            <Box sx={{ bgcolor: 'white', minHeight: '100%', pb: 8 }}>
                <Box sx={{ bgcolor: THEME_BLUE, p: 2.5, px: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, fontSize: '1.5rem' }}>Employee / User Details</Typography>
                    <IconButton size="medium" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }, borderRadius: 3 }} onClick={() => setView('list')}><Close sx={{ fontSize: 28 }} /></IconButton>
                </Box>

                <Container maxWidth="lg" sx={{ py: PADDING.XL }}>
                    <Box sx={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {/* Column 1 */}
                        <Box sx={{ flex: 1, minWidth: 320, p: 3, bgcolor: '#f8fafc', borderRadius: 3, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                            {renderFieldRow("User Name", 'name')}
                            {renderFieldRow("Email Id", 'email', 'email')}
                            {renderFieldRow("Recruitment\nType", 'recruitmentType', 'select', ['Permanent', 'Contract', 'Temporary'])}
                            {renderFieldRow("Ward Name", 'wardName', 'select', ['Ward 1', 'Ward 2', 'Ward 3'])}
                            {renderFieldRow("Employee\nID/Code", 'id')}
                            {renderFieldRow("Exit Date", 'exitDate', 'date')}
                        </Box>

                        {/* Column 2 */}
                        <Box sx={{ flex: 1, minWidth: 320, p: 3, bgcolor: '#f8fafc', borderRadius: 3, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                            {renderFieldRow("Date of Birth", 'dob', 'date')}
                            {renderFieldRow("Address", 'address')}
                            {renderFieldRow("Joining Date", 'joiningDate', 'date')}
                            {renderFieldRow("Section Name", 'sectionName', 'select', ['Health', 'Revenue', 'Admin'])}
                            {renderFieldRow("Reason for Exit", 'reasonForExit')}
                        </Box>

                        {/* Column 3 */}
                        <Box sx={{ flex: 1, minWidth: 320, p: 3, bgcolor: '#f8fafc', borderRadius: 3, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                            {renderFieldRow("Mobile Number", 'mobile')}
                            {renderFieldRow("Pin Code", 'pinCode')}
                            {renderFieldRow("ULB Name", 'ulbName', 'select', ['BBMP', 'Mysore City Corp'])}
                            {renderFieldRow("Designation", 'designation', 'select', ['Inspector', 'Manager', 'Clerk'])}
                            {renderFieldRow("Status", 'status', 'select', ['Active', 'Inactive'])}
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: MARGIN.XL }}>
                        {/* Only "Save" button in Green as per screenshot */}
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: '#00b050',
                                color: 'white',
                                fontWeight: 700,
                                px: 10,
                                py: 2,
                                fontSize: '1.2rem',
                                textTransform: 'none',
                                borderRadius: 12,
                                boxShadow: '0 6px 12px rgba(0, 176, 80, 0.3)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': { 
                                    bgcolor: '#009040',
                                    boxShadow: '0 8px 16px rgba(0, 176, 80, 0.4)',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                            onClick={handleSave}
                        >
                            Save Employee Details
                        </Button>
                    </Box>
                </Container>
            </Box>
        );
    };

    return (
        <Box sx={{ p: view === 'form' && isEditable ? 0 : 0, bgcolor: 'white', minHeight: '100%' }}>
            {view === 'list' ? renderList() : renderForm()}

            <Dialog 
                open={isUploadOpen} 
                onClose={() => setIsUploadOpen(false)} 
                maxWidth="sm" 
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }
                }}
            >
                <DialogTitle 
                    sx={{ 
                        bgcolor: THEME_BLUE, 
                        color: 'white', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        py: 2.5,
                        px: 3
                    }}
                >
                    <Typography component="div" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>Upload Users via Excel</Typography>
                    <IconButton size="small" onClick={() => setIsUploadOpen(false)} sx={{ color: 'white' }}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1rem' }}>
                            Download the template to ensure your data is formatted correctly before uploading.
                        </Typography>

                        <Button
                            variant="outlined"
                            startIcon={<Download />}
                            sx={{ 
                                mb: 5, 
                                textTransform: 'none', 
                                borderRadius: 8, 
                                borderColor: THEME_BLUE, 
                                color: THEME_BLUE,
                                py: 1.5,
                                px: 4,
                                fontWeight: 600,
                                '&:hover': { borderColor: '#001a38', bgcolor: 'rgba(0, 33, 71, 0.05)' }
                            }}
                        >
                            Download Excel Template
                        </Button>

                        <Box
                            sx={
                                {
                                    border: `2px dashed ${THEME_BLUE}`,
                                    borderRadius: 12,
                                    p: 6,
                                    bgcolor: '#f8fafc',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2.5,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { 
                                        bgcolor: '#f1f5f9', 
                                        borderColor: '#001a38',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(0, 33, 71, 0.1)'
                                    }
                                }
                            }
                        >
                            <UploadFile sx={{ fontSize: 56, color: THEME_BLUE, opacity: 0.8 }} />
                            <Box>
                                <Typography variant="h6" fontWeight={600} color="#1e293b" sx={{ mb: 1 }}>Click or Drag file to upload</Typography>
                                <Typography variant="body2" color="#64748b">Support for .xlsx, .xls files</Typography>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
                    <Button 
                        onClick={() => setIsUploadOpen(false)} 
                        sx={{ 
                            color: '#64748b', 
                            fontWeight: 600,
                            px: 3,
                            py: 1.5,
                            borderRadius: 6,
                            textTransform: 'none'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setIsUploadOpen(false)}
                        sx={{ 
                            bgcolor: THEME_BLUE, 
                            fontWeight: 600, 
                            px: 5, 
                            py: 1.5,
                            borderRadius: 6,
                            textTransform: 'none',
                            '&:hover': { bgcolor: '#001a38' } 
                        }}
                    >
                        Upload Data
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserManagement;
