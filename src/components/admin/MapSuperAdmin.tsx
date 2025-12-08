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
    Alert
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';

// --- Types ---
interface Employee {
    id: string;
    name: string;
    designation: string;
}

interface MappedAdmin {
    id: number;
    employeeName: string;
    employeeCode: string;
    district: string;
    designation: string;
}

// --- Mock Data ---
const MOCK_DISTRICTS = [
    'Bengaluru Urban', 'Bengaluru Rural', 'Mysore', 'Hassan', 'Shivamogga', 'Tumakuru', 'Belagavi'
];

const MOCK_EMPLOYEES: Employee[] = [
    { id: '123456', name: 'ABCD', designation: 'Project Director' },
    { id: '123321', name: 'QRST', designation: 'Project Director' },
    { id: '67545', name: 'MNOP', designation: 'Project Director' },
    { id: 'EMP001', name: 'Ramesh Kumar', designation: 'Health Inspector' },
    { id: 'EMP002', name: 'Suresh Patil', designation: 'Chief Officer' },
];

const THEME_BLUE = '#002147';
const THEME_RED = '#ff0000';

const MapSuperAdmin: React.FC = () => {
    // State
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
    const [mappedAdmins, setMappedAdmins] = useState<MappedAdmin[]>([
        { id: 1, employeeName: 'ABCD', employeeCode: '123456', district: 'Hassan', designation: 'Project Director' },
        { id: 2, employeeName: 'QRST', employeeCode: '123321', district: 'Mysore', designation: 'Project Director' },
        { id: 3, employeeName: 'MNOP', employeeCode: '67545', district: 'Shivamogga', designation: 'Project Director' }
    ]);
    const [notification, setNotification] = useState<{ open: boolean; message: string; type: 'success' | 'error' | 'info' }>({
        open: false,
        message: '',
        type: 'success'
    });

    // Handlers
    const handleAddAdmin = () => {
        if (!selectedEmployee || !selectedDistrict) {
            setNotification({ open: true, message: 'Please select both Employee and District', type: 'error' });
            return;
        }

        // Check duplicates
        const exists = mappedAdmins.some(
            a => a.employeeCode === selectedEmployee.id && a.district === selectedDistrict
        );
        if (exists) {
            setNotification({ open: true, message: 'This employee is already mapped as Super Admin for this district', type: 'error' });
            return;
        }

        const newAdmin: MappedAdmin = {
            id: Date.now(),
            employeeName: selectedEmployee.name,
            employeeCode: selectedEmployee.id,
            district: selectedDistrict,
            designation: selectedEmployee.designation
        };

        setMappedAdmins([...mappedAdmins, newAdmin]);
        setNotification({ open: true, message: 'Super Admin added successfully', type: 'success' });
    };

    const handleRevoke = (id: number) => {
        setMappedAdmins(mappedAdmins.filter(admin => admin.id !== id));
        setNotification({ open: true, message: 'Access revoked successfully', type: 'info' });
    };

    return (
        <Fade in={true}>
            <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
                <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    {/* Header */}
                    <Box sx={{ bgcolor: THEME_BLUE, py: 2, px: 3 }}>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>
                            Super Admins Mapping
                        </Typography>
                    </Box>

                    {/* Controls */}
                    <Box sx={{ p: 3 }}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0', mb: 3 }}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, width: '100%' }}>
                                <Box sx={{ flex: '1 1 300px' }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#475569', fontWeight: 600 }}>
                                        Select Employee
                                    </Typography>
                                    <Autocomplete
                                        fullWidth
                                        options={MOCK_EMPLOYEES}
                                        getOptionLabel={(option) => `${option.name} - ${option.id}`}
                                        value={selectedEmployee}
                                        onChange={(_, newValue) => setSelectedEmployee(newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Search by name or employee code"
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        '&:hover fieldset': {
                                                            borderColor: '#002147',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderWidth: '2px',
                                                            borderColor: '#002147',
                                                            boxShadow: '0 0 0 1px #002147',
                                                        },
                                                    },
                                                }}
                                            />
                                        )}
                                        renderOption={(props, option) => {
                                            const { key, ...otherProps } = props;
                                            return (
                                                <li key={key} {...otherProps}>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={600} color="#0f172a">
                                                            {option.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="#64748b" display="block">
                                                            {option.id} • {option.designation}
                                                        </Typography>
                                                    </Box>
                                                </li>
                                            );
                                        }}
                                    />
                                </Box>
                                <Box sx={{ flex: '1 1 250px' }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#475569', fontWeight: 600 }}>
                                        Select District
                                    </Typography>
                                    <Autocomplete
                                        fullWidth
                                        options={MOCK_DISTRICTS}
                                        value={selectedDistrict}
                                        onChange={(_, newValue) => setSelectedDistrict(newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Select district"
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        '&:hover fieldset': {
                                                            borderColor: '#002147',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderWidth: '2px',
                                                            borderColor: '#002147',
                                                            boxShadow: '0 0 0 1px #002147',
                                                        },
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                </Box>
                                <Box sx={{ flex: '1 1 200px', display: 'flex', alignItems: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={handleAddAdmin}
                                        startIcon={<PersonAdd />}
                                        sx={{
                                            bgcolor: THEME_BLUE,
                                            height: '42px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px rgba(0, 33, 71, 0.1)',
                                            '&:hover': { 
                                                bgcolor: '#001a38',
                                                boxShadow: '0 6px 8px rgba(0, 33, 71, 0.15)',
                                            }
                                        }}
                                    >
                                        Add Super Admin
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>

                    {/* Table Section */}
                    <Box sx={{ px: 3, pb: 3 }}>
                        <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: THEME_BLUE }}>
                                            <TableCell sx={{ color: 'white', fontWeight: 700, width: '80px', textAlign: 'center' }}>Sl No</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 700 }}>Employee Name - Code</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 700 }}>ULB District</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 700 }}>Designation</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 700, textAlign: 'center', width: '150px' }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {mappedAdmins.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 8, color: '#64748b' }}>
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                        No Super Admins mapped yet.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            mappedAdmins.map((admin, index) => (
                                                <TableRow 
                                                    key={admin.id} 
                                                    sx={{ 
                                                        '&:nth-of-type(odd)': { bgcolor: '#f8fafc' }, 
                                                        '&:hover': { bgcolor: '#f1f5f9' },
                                                        '& td': { py: 2 }
                                                    }}
                                                >
                                                    <TableCell align="center" sx={{ fontWeight: 500, color: '#475569' }}>{index + 1}</TableCell>
                                                    <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                        {admin.employeeName} - {admin.employeeCode}
                                                    </TableCell>
                                                    <TableCell>{admin.district}</TableCell>
                                                    <TableCell>{admin.designation}</TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => handleRevoke(admin.id)}
                                                            sx={{
                                                                bgcolor: THEME_RED,
                                                                color: 'white',
                                                                textTransform: 'none',
                                                                fontWeight: 600,
                                                                minWidth: '90px',
                                                                borderRadius: '6px',
                                                                boxShadow: '0 2px 4px rgba(255,0,0,0.1)',
                                                                '&:hover': { 
                                                                    bgcolor: '#d32f2f', 
                                                                    boxShadow: '0 4px 6px rgba(255,0,0,0.2)',
                                                                }
                                                            }}
                                                        >
                                                            Revoke
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Box>
                </Paper>

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

export default MapSuperAdmin;