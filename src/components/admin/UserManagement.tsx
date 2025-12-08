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
import {
    Add,
    UploadFile,
    Edit,
    Close,
    Download
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
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#374151', mb: 1 }}>
                        Employee / User Details
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Manage system users, create new employees, or bulk upload via Excel.
                    </Typography>
                </Box>

                {/* Toolbar */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 3 }}>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreateNew}
                        sx={{ 
                            bgcolor: THEME_BLUE, 
                            fontWeight: 600, 
                            '&:hover': { bgcolor: '#001a38' }, 
                            textTransform: 'none',
                            borderRadius: '6px',
                            px: 3,
                            py: 1,
                            fontSize: '0.875rem'
                        }}
                    >
                        Create New User
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<UploadFile />}
                        onClick={() => setIsUploadOpen(true)}
                        sx={{ 
                            bgcolor: THEME_BLUE, 
                            fontWeight: 600, 
                            '&:hover': { bgcolor: '#001a38' }, 
                            textTransform: 'none',
                            borderRadius: '6px',
                            px: 3,
                            py: 1,
                            fontSize: '0.875rem'
                        }}
                    >
                        Add Users through Excel Sheet
                    </Button>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: 380 }}>
                        <TextField
                            placeholder="Search User / Employee"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': { 
                                    borderRadius: '6px', 
                                    bgcolor: 'white',
                                    fontSize: '0.875rem'
                                }
                            }}
                            fullWidth
                            size="small"
                        />
                        <Button 
                            variant="contained" 
                            sx={{ 
                                bgcolor: THEME_BLUE, 
                                borderRadius: '6px', 
                                textTransform: 'none', 
                                px: 3,
                                py: 1,
                                fontSize: '0.875rem',
                                '&:hover': { bgcolor: '#001a38' }
                            }}
                        >
                            Search
                        </Button>
                    </Box>
                </Box>
                
                {/* Table */}
                <Paper sx={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <Box sx={{ bgcolor: THEME_BLUE, px: 3, py: 2, color: 'white' }}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: '1rem' }}>Employee List</Typography>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                                    {['ID', 'Name', 'Designation', 'ULB', 'Mobile', 'Status', 'Actions'].map(head => (
                                        <TableCell 
                                            key={head} 
                                            sx={{ 
                                                fontWeight: 700, 
                                                color: '#334155',
                                                fontSize: '0.9rem',
                                                py: 2,
                                                borderBottom: '2px solid #e2e8f0'
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
                                            '&:hover': { bgcolor: '#f1f5f9' },
                                            '&:last-child td, &:last-child th': { border: 0 }
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 500, color: '#334155' }}>{emp.id}</TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={600} color="#1e293b">{emp.name}</Typography>
                                                <Typography variant="caption" color="#64748b">{emp.email}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ color: '#475569' }}>{emp.designation}</TableCell>
                                        <TableCell sx={{ color: '#475569' }}>{emp.ulbName}</TableCell>
                                        <TableCell sx={{ color: '#475569' }}>{emp.mobile}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={emp.status}
                                                size="small"
                                                color={emp.status === 'Active' ? 'success' : 'default'}
                                                variant="outlined"
                                                sx={{
                                                    fontWeight: 600,
                                                    borderRadius: 4
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Edit Details">
                                                <IconButton 
                                                    size="small" 
                                                    color="primary" 
                                                    onClick={() => handleEdit(emp)}
                                                    sx={{
                                                        bgcolor: 'rgba(0, 33, 71, 0.05)',
                                                        '&:hover': { bgcolor: 'rgba(0, 33, 71, 0.1)' }
                                                    }}
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
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
                borderRadius: 8, 
                height: '48px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                '& fieldset': { borderColor: '#e2e8f0' },
                '&:hover fieldset': { borderColor: '#cbd5e1' },
                '&.Mui-focused fieldset': { borderColor: THEME_BLUE, borderWidth: 2 }
            },
            '& .MuiInputBase-input': { py: 1.5, px: 2, fontSize: '16px' },
            '& .MuiInputLabel-root': { 
                fontSize: '16px',
                fontWeight: 500,
                color: '#475569',
                '&.Mui-focused': { color: THEME_BLUE }
            }
        };

        const renderFieldRow = (label: string, field: keyof Employee, type: string = 'text', options: string[] = []) => (
            <Box key={field} sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ width: '35%', textAlign: 'right', pr: 3 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155' }}>{label}</Typography>
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
            <Box sx={{ bgcolor: 'white', minHeight: '100%', pb: 6 }}>
                <Box sx={{ bgcolor: THEME_BLUE, p: 2, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, fontSize: '1.25rem' }}>Employee / User Details</Typography>
                    <IconButton size="small" sx={{ color: 'white' }} onClick={() => setView('list')}><Close /></IconButton>
                </Box>

                <Container maxWidth="lg" sx={{ py: 5 }}>
                    <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {/* Column 1 */}
                        <Box sx={{ flex: 1, minWidth: 300 }}>
                            {renderFieldRow("User Name", 'name')}
                            {renderFieldRow("Email Id", 'email', 'email')}
                            {renderFieldRow("Recruitment\nType", 'recruitmentType', 'select', ['Permanent', 'Contract', 'Temporary'])}
                            {renderFieldRow("Ward Name", 'wardName', 'select', ['Ward 1', 'Ward 2', 'Ward 3'])}
                            {renderFieldRow("Employee\nID/Code", 'id')}
                            {renderFieldRow("Exit Date", 'exitDate', 'date')}
                        </Box>

                        {/* Column 2 */}
                        <Box sx={{ flex: 1, minWidth: 300 }}>
                            {renderFieldRow("Date of Birth", 'dob', 'date')}
                            {renderFieldRow("Address", 'address')}
                            {renderFieldRow("Joining Date", 'joiningDate', 'date')}
                            {renderFieldRow("Section Name", 'sectionName', 'select', ['Health', 'Revenue', 'Admin'])}
                            {renderFieldRow("Reason for Exit", 'reasonForExit')}
                        </Box>

                        {/* Column 3 */}
                        <Box sx={{ flex: 1, minWidth: 300 }}>
                            {renderFieldRow("Mobile Number", 'mobile')}
                            {renderFieldRow("Pin Code", 'pinCode')}
                            {renderFieldRow("ULB Name", 'ulbName', 'select', ['BBMP', 'Mysore City Corp'])}
                            {renderFieldRow("Designation", 'designation', 'select', ['Inspector', 'Manager', 'Clerk'])}
                            {renderFieldRow("Status", 'status', 'select', ['Active', 'Inactive'])}
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                        {/* Only "Save" button in Green as per screenshot */}
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: '#00b050',
                                color: 'white',
                                fontWeight: 'bold',
                                px: 8,
                                py: 1.8,
                                fontSize: '1.1rem',
                                '&:hover': { bgcolor: '#009040' },
                                textTransform: 'none',
                                borderRadius: 8,
                                boxShadow: '0 4px 6px rgba(0, 176, 80, 0.2)'
                            }}
                            onClick={handleSave}
                        >
                            Save
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
