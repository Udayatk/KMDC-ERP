'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
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
    Container,
    Divider,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Search,
    TransferWithinAStation,
    Close,
    Upload,
    Visibility,
    CheckCircle,
    Cancel,
    Download,
    History
} from '@mui/icons-material';

// --- Types ---
interface Employee {
    id: string;
    name: string;
    section: string;
    recruitmentType: string;
    designation: string;
    ulbName: string;
    mobile: string;
    email: string;
    status: 'Active' | 'Transferred' | 'Pending';
}

interface TransferDetails {
    toUlbName: string;
    transferDate: string;
    transferType: string;
    reason: string;
    transferOrder: File | null;
}

interface TransferHistory {
    id: string;
    fromDate: string;
    toDate: string;
    workingUlb: string;
    transferredTo: string;
    transferType: string;
    transferReason: string;
    hasTransferOrder: boolean;
    status: 'Completed' | 'Pending' | 'Rejected';
}

interface PendingTransfer {
    id: string;
    employeeId: string;
    employeeName: string;
    fromUlb: string;
    transferDate: string;
    transferType: string;
    reason: string;
    status: 'Pending' | 'Accepted' | 'Rejected';
    remarks?: string;
}

// --- Mock Data ---
const MOCK_EMPLOYEES: Employee[] = [
    {
        id: 'EMP001',
        name: 'Ramesh Kumar',
        section: 'Health',
        recruitmentType: 'Permanent',
        designation: 'Health Inspector',
        ulbName: 'BBMP',
        mobile: '9876543210',
        email: 'ramesh.k@karnataka.gov.in',
        status: 'Active'
    },
    {
        id: 'EMP002',
        name: 'Priya Sharma',
        section: 'Revenue',
        recruitmentType: 'Contract',
        designation: 'Revenue Officer',
        ulbName: 'Mysore City Corporation',
        mobile: '9876543211',
        email: 'priya.s@karnataka.gov.in',
        status: 'Active'
    }
];

const MOCK_TRANSFER_HISTORY: TransferHistory[] = [
    {
        id: 'TH001',
        fromDate: '2020-01-15',
        toDate: '2023-05-30',
        workingUlb: 'Hubli-Dharwad Municipal Corporation',
        transferredTo: 'BBMP',
        transferType: 'Administrative Transfer',
        transferReason: 'Administrative requirement',
        hasTransferOrder: true,
        status: 'Completed'
    }
];

const MOCK_PENDING_TRANSFERS: PendingTransfer[] = [
    {
        id: 'PT001',
        employeeId: 'EMP003',
        employeeName: 'Suresh Reddy',
        fromUlb: 'Belgaum City Corporation',
        transferDate: '2024-01-15',
        transferType: 'Administrative Transfer',
        reason: 'Administrative requirement',
        status: 'Pending'
    }
];

const ULB_OPTIONS = [
    'BBMP',
    'Mysore City Corporation',
    'Hubli-Dharwad Municipal Corporation',
    'Belgaum City Corporation',
    'Mangalore City Corporation',
    'Gulbarga City Corporation'
];

const TRANSFER_TYPES = [
    'Administrative Transfer',
    'Promotion Transfer',
    'Disciplinary Transfer',
    'Request Transfer',
    'Mutual Transfer'
];

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

const TransferEmployee: React.FC = () => {
    // State
    const [view, setView] = useState<'search' | 'transfer' | 'pending'>('search');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [transferHistory, setTransferHistory] = useState<TransferHistory[]>(MOCK_TRANSFER_HISTORY);
    const [pendingTransfers, setPendingTransfers] = useState<PendingTransfer[]>(MOCK_PENDING_TRANSFERS);
    const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Transfer Form State
    const initialTransferState: TransferDetails = {
        toUlbName: '',
        transferDate: '',
        transferType: '',
        reason: '',
        transferOrder: null
    };
    const [transferData, setTransferData] = useState<TransferDetails>(initialTransferState);

    // Helpers
    const handleEmployeeSearch = () => {
        setIsLoading(true);
        setTimeout(() => {
            const employee = MOCK_EMPLOYEES.find(emp =>
                emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSelectedEmployee(employee || null);
            setIsLoading(false);
        }, 500);
    };

    const handleTransferInputChange = (field: keyof TransferDetails, value: any) => {
        setTransferData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateTransferForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!transferData.toUlbName) {
            newErrors.toUlbName = 'Please select a valid destination ULB.';
        } else if (transferData.toUlbName === selectedEmployee?.ulbName) {
            newErrors.toUlbName = 'Destination ULB cannot be the same as current ULB.';
        }

        if (!transferData.transferDate) {
            newErrors.transferDate = 'Please enter a valid transfer date.';
        } else {
            const selectedDate = new Date(transferData.transferDate);
            const today = new Date();
            if (selectedDate > today) {
                newErrors.transferDate = 'Transfer date cannot be a future date.';
            }
        }

        if (!transferData.transferType) {
            newErrors.transferType = 'Please select transfer type.';
        }

        if (!transferData.reason || transferData.reason.length < 5) {
            newErrors.reason = 'Please provide a valid transfer reason (minimum 5 characters).';
        }

        if (!transferData.transferOrder) {
            newErrors.transferOrder = 'Please upload a valid transfer order in PDF format (max 5MB).';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setErrors(prev => ({ ...prev, transferOrder: 'Only PDF files are allowed.' }));
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            setErrors(prev => ({ ...prev, transferOrder: 'File size should not exceed 5MB.' }));
            return;
        }

        setTransferData(prev => ({ ...prev, transferOrder: file }));
        setErrors(prev => ({ ...prev, transferOrder: '' }));
    };

    const handleTransferSubmit = () => {
        if (!validateTransferForm()) {
            alert('Please fill all mandatory fields before submitting.');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            // Add to transfer history
            const newHistoryEntry: TransferHistory = {
                id: `TH${Date.now()}`,
                fromDate: new Date().toISOString().split('T')[0],
                toDate: transferData.transferDate,
                workingUlb: selectedEmployee!.ulbName,
                transferredTo: transferData.toUlbName,
                transferType: transferData.transferType,
                transferReason: transferData.reason,
                hasTransferOrder: true,
                status: 'Pending'
            };

            setTransferHistory(prev => [newHistoryEntry, ...prev]);
            setIsTransferDialogOpen(false);
            setTransferData(initialTransferState);
            setIsLoading(false);
            alert('Employee transfer details submitted successfully.');
        }, 1000);
    };

    const handleAcceptTransfer = (transferId: string, remarks: string = '') => {
        setPendingTransfers(prev =>
            prev.map(transfer =>
                transfer.id === transferId
                    ? { ...transfer, status: 'Accepted', remarks }
                    : transfer
            )
        );
        alert('Transfer accepted successfully.');
    };

    const handleRejectTransfer = (transferId: string, remarks: string) => {
        if (!remarks.trim()) {
            alert('Please provide remarks for rejection.');
            return;
        }

        setPendingTransfers(prev =>
            prev.map(transfer =>
                transfer.id === transferId
                    ? { ...transfer, status: 'Rejected', remarks }
                    : transfer
            )
        );
        alert('Transfer rejected successfully. Alert sent to transferring ULB.');
    };

    // --- Sub-Components ---
    const renderSearchView = () => (
        <Fade in={true}>
            <Box>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        Transfer Employee
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Manage employee transfers between ULBs within the district.
                    </Typography>
                </Box>

                {/* Search Section */}
                <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
                    <Typography variant="h6" sx={{ mb: 3, color: '#1e293b', fontWeight: 600 }}>
                        Search Employee
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
                        <TextField
                            placeholder="Enter first 4 digits of employee ID or first 4 characters of name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                flexGrow: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    bgcolor: 'white',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                }
                            }}
                            size="medium"
                        />
                        <Button
                            variant="contained"
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Search />}
                            onClick={handleEmployeeSearch}
                            disabled={isLoading || searchQuery.length < 4}
                            sx={{
                                bgcolor: THEME_BLUE,
                                fontWeight: 600,
                                '&:hover': { bgcolor: '#001a38' },
                                textTransform: 'none',
                                borderRadius: 8,
                                px: 4,
                                py: 1.5,
                                boxShadow: '0 4px 6px rgba(0, 33, 71, 0.1)'
                            }}
                        >
                            Search
                        </Button>
                    </Box>

                    {searchQuery.length > 0 && searchQuery.length < 4 && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Please enter at least 4 characters to search.
                        </Alert>
                    )}
                </Paper>

                {/* Employee Details */}
                {selectedEmployee && (
                    <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
                        <Typography variant="h6" sx={{ mb: 3, color: '#1e293b', fontWeight: 600 }}>
                            Employee Details
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', mb: 2 }}>
                                    <Typography sx={{ width: 150, fontWeight: 600, color: '#475569' }}>Employee ID:</Typography>
                                    <Typography sx={{ color: '#1e293b' }}>{selectedEmployee.id}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', mb: 2 }}>
                                    <Typography sx={{ width: 150, fontWeight: 600, color: '#475569' }}>Employee Name:</Typography>
                                    <Typography sx={{ color: '#1e293b' }}>{selectedEmployee.name}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', mb: 2 }}>
                                    <Typography sx={{ width: 150, fontWeight: 600, color: '#475569' }}>Section:</Typography>
                                    <Typography sx={{ color: '#1e293b' }}>{selectedEmployee.section}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', mb: 2 }}>
                                    <Typography sx={{ width: 150, fontWeight: 600, color: '#475569' }}>Recruitment Type:</Typography>
                                    <Typography sx={{ color: '#1e293b' }}>{selectedEmployee.recruitmentType}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', mb: 2 }}>
                                    <Typography sx={{ width: 150, fontWeight: 600, color: '#475569' }}>Designation:</Typography>
                                    <Typography sx={{ color: '#1e293b' }}>{selectedEmployee.designation}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', mb: 2 }}>
                                    <Typography sx={{ width: 150, fontWeight: 600, color: '#475569' }}>ULB Name:</Typography>
                                    <Typography sx={{ color: '#1e293b' }}>{selectedEmployee.ulbName}</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                startIcon={<TransferWithinAStation />}
                                onClick={() => setIsTransferDialogOpen(true)}
                                sx={{
                                    bgcolor: THEME_BLUE,
                                    fontWeight: 600,
                                    '&:hover': { bgcolor: '#001a38' },
                                    textTransform: 'none',
                                    borderRadius: 8,
                                    px: 4,
                                    py: 1.5,
                                    boxShadow: '0 4px 6px rgba(0, 33, 71, 0.1)'
                                }}
                            >
                                Transfer Employee
                            </Button>
                        </Box>
                    </Paper>
                )}

                {/* Transfer History */}
                {selectedEmployee && transferHistory.length > 0 && (
                    <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Box sx={{ bgcolor: THEME_BLUE, p: 2.5, color: 'white' }}>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: '1.1rem' }}>
                                Transfer History
                            </Typography>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                                        {['From Date', 'To Date', 'Working ULB', 'Transferred To', 'Transfer Type', 'Transfer Reason', 'Transfer Order', 'Status'].map(head => (
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
                                    {transferHistory.map((history, index) => (
                                        <TableRow
                                            key={history.id}
                                            hover
                                            sx={{
                                                bgcolor: index % 2 === 0 ? 'white' : '#f8fafc',
                                                '&:hover': { bgcolor: '#f1f5f9' }
                                            }}
                                        >
                                            <TableCell sx={{ color: '#475569' }}>{history.fromDate}</TableCell>
                                            <TableCell sx={{ color: '#475569' }}>{history.toDate}</TableCell>
                                            <TableCell sx={{ color: '#475569' }}>{history.workingUlb}</TableCell>
                                            <TableCell sx={{ color: '#475569' }}>{history.transferredTo}</TableCell>
                                            <TableCell sx={{ color: '#475569' }}>{history.transferType}</TableCell>
                                            <TableCell sx={{ color: '#475569' }}>{history.transferReason}</TableCell>
                                            <TableCell>
                                                {history.hasTransferOrder ? (
                                                    <Tooltip title="View Transfer Order">
                                                        <IconButton size="small" color="primary">
                                                            <Visibility fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary">
                                                        No Order
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={history.status}
                                                    size="small"
                                                    color={history.status === 'Completed' ? 'success' : history.status === 'Pending' ? 'warning' : 'error'}
                                                    variant="outlined"
                                                    sx={{ fontWeight: 600, borderRadius: 4 }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setView('pending')}
                        sx={{
                            borderColor: THEME_BLUE,
                            color: THEME_BLUE,
                            fontWeight: 600,
                            '&:hover': { borderColor: '#001a38', bgcolor: 'rgba(0, 33, 71, 0.05)' },
                            textTransform: 'none',
                            borderRadius: 8,
                            px: 4,
                            py: 1.5
                        }}
                    >
                        View Pending Transfers ({pendingTransfers.filter(t => t.status === 'Pending').length})
                    </Button>
                </Box>
            </Box>
        </Fade>
    );

    const renderPendingTransfers = () => (
        <Fade in={true}>
            <Box>
                {/* Header */}
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
                            Pending Transfers
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                            Accept or reject employee transfers from other ULBs.
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        onClick={() => setView('search')}
                        sx={{
                            borderColor: THEME_BLUE,
                            color: THEME_BLUE,
                            fontWeight: 600,
                            '&:hover': { borderColor: '#001a38', bgcolor: 'rgba(0, 33, 71, 0.05)' },
                            textTransform: 'none',
                            borderRadius: 8,
                            px: 3,
                            py: 1.5
                        }}
                    >
                        Back to Transfer
                    </Button>
                </Box>

                {/* Pending Transfers Table */}
                <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <Box sx={{ bgcolor: THEME_BLUE, p: 2.5, color: 'white' }}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: '1.1rem' }}>
                            Incoming Transfer Requests
                        </Typography>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                                    {['Employee ID', 'Employee Name', 'From ULB', 'Transfer Date', 'Transfer Type', 'Reason', 'Status', 'Actions'].map(head => (
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
                                {pendingTransfers.map((transfer, index) => (
                                    <TableRow
                                        key={transfer.id}
                                        hover
                                        sx={{
                                            bgcolor: index % 2 === 0 ? 'white' : '#f8fafc',
                                            '&:hover': { bgcolor: '#f1f5f9' }
                                        }}
                                    >
                                        <TableCell sx={{ color: '#475569', fontWeight: 500 }}>{transfer.employeeId}</TableCell>
                                        <TableCell sx={{ color: '#1e293b', fontWeight: 600 }}>{transfer.employeeName}</TableCell>
                                        <TableCell sx={{ color: '#475569' }}>{transfer.fromUlb}</TableCell>
                                        <TableCell sx={{ color: '#475569' }}>{transfer.transferDate}</TableCell>
                                        <TableCell sx={{ color: '#475569' }}>{transfer.transferType}</TableCell>
                                        <TableCell sx={{ color: '#475569', maxWidth: 200 }}>
                                            <Tooltip title={transfer.reason}>
                                                <Typography noWrap sx={{ cursor: 'pointer' }}>
                                                    {transfer.reason}
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={transfer.status}
                                                size="small"
                                                color={transfer.status === 'Accepted' ? 'success' : transfer.status === 'Rejected' ? 'error' : 'warning'}
                                                variant="outlined"
                                                sx={{ fontWeight: 600, borderRadius: 4 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {transfer.status === 'Pending' && (
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="Accept Transfer">
                                                        <IconButton
                                                            size="small"
                                                            color="success"
                                                            onClick={() => handleAcceptTransfer(transfer.id)}
                                                            sx={{ bgcolor: 'rgba(46, 125, 50, 0.1)' }}
                                                        >
                                                            <CheckCircle fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Reject Transfer">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => {
                                                                const remarks = prompt('Please provide rejection reason:');
                                                                if (remarks) handleRejectTransfer(transfer.id, remarks);
                                                            }}
                                                            sx={{ bgcolor: 'rgba(211, 47, 47, 0.1)' }}
                                                        >
                                                            <Cancel fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            )}
                                            {transfer.remarks && (
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                                    Remarks: {transfer.remarks}
                                                </Typography>
                                            )}
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

    return (
        <Box sx={{ p: 3 }}>
            {view === 'search' ? renderSearchView() : renderPendingTransfers()}

            {/* Transfer Dialog */}
            <Dialog
                open={isTransferDialogOpen}
                onClose={() => setIsTransferDialogOpen(false)}
                maxWidth="md"
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
                    <Typography component="div" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
                        Transfer Employee - {selectedEmployee?.name}
                    </Typography>
                    <IconButton size="small" onClick={() => setIsTransferDialogOpen(false)} sx={{ color: 'white' }}>
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ p: 4 }}>
                    {/* Employee Basic Details */}
                    <Typography variant="h6" sx={{ mb: 2, color: '#1e293b', fontWeight: 600 }}>
                        Employee Basic Details
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                        <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                            <TextField
                                label="Employee ID"
                                value={selectedEmployee?.id || ''}
                                disabled
                                fullWidth
                                size="small"
                            />
                        </Box>
                        <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                            <TextField
                                label="Employee Name"
                                value={selectedEmployee?.name || ''}
                                disabled
                                fullWidth
                                size="small"
                            />
                        </Box>
                        <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                            <TextField
                                label="Section"
                                value={selectedEmployee?.section || ''}
                                disabled
                                fullWidth
                                size="small"
                            />
                        </Box>
                        <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                            <TextField
                                label="Current ULB"
                                value={selectedEmployee?.ulbName || ''}
                                disabled
                                fullWidth
                                size="small"
                            />
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Transferring Details */}
                    <Typography variant="h6" sx={{ mb: 2, color: '#1e293b', fontWeight: 600 }}>
                        Transfer Details
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                            <TextField
                                select
                                label="To ULB Name *"
                                value={transferData.toUlbName}
                                onChange={(e) => handleTransferInputChange('toUlbName', e.target.value)}
                                error={!!errors.toUlbName}
                                helperText={errors.toUlbName}
                                fullWidth
                                size="small"
                                sx={{ mb: 2 }}
                            >
                                {ULB_OPTIONS.filter(ulb => ulb !== selectedEmployee?.ulbName).map(ulb => (
                                    <MenuItem key={ulb} value={ulb}>{ulb}</MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                            <TextField
                                type="date"
                                label="Date of Transfer *"
                                value={transferData.transferDate}
                                onChange={(e) => handleTransferInputChange('transferDate', e.target.value)}
                                error={!!errors.transferDate}
                                helperText={errors.transferDate}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                                sx={{ mb: 2 }}
                            />
                        </Box>
                        <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                            <TextField
                                select
                                label="Transfer Type *"
                                value={transferData.transferType}
                                onChange={(e) => handleTransferInputChange('transferType', e.target.value)}
                                error={!!errors.transferType}
                                helperText={errors.transferType}
                                fullWidth
                                size="small"
                                sx={{ mb: 2 }}
                            >
                                {TRANSFER_TYPES.map(type => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                            <input
                                accept=".pdf"
                                style={{ display: 'none' }}
                                id="transfer-order-upload"
                                type="file"
                                onChange={handleFileUpload}
                            />
                            <label htmlFor="transfer-order-upload">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    fullWidth
                                    startIcon={<Upload />}
                                    sx={{
                                        height: 40,
                                        borderColor: errors.transferOrder ? 'error.main' : 'rgba(0,0,0,0.23)',
                                        color: errors.transferOrder ? 'error.main' : 'text.primary'
                                    }}
                                >
                                    {transferData.transferOrder ? 'Order Uploaded' : 'Upload Transfer Order *'}
                                </Button>
                            </label>
                            {errors.transferOrder && (
                                <Typography variant="caption" color="error" sx={{ ml: 1.5, mt: 0.5, display: 'block' }}>
                                    {errors.transferOrder}
                                </Typography>
                            )}
                            {transferData.transferOrder && (
                                <Typography variant="caption" color="success.main" sx={{ ml: 1.5, mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <CheckCircle fontSize="inherit" /> {transferData.transferOrder.name}
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{ flex: '1 1 100%', minWidth: '200px' }}>
                            <TextField
                                label="Transfer Reason *"
                                multiline
                                rows={3}
                                value={transferData.reason}
                                onChange={(e) => handleTransferInputChange('reason', e.target.value)}
                                error={!!errors.reason}
                                helperText={errors.reason}
                                fullWidth
                                size="small"
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 4, py: 3, bgcolor: '#f8fafc' }}>
                    <Button
                        onClick={() => setIsTransferDialogOpen(false)}
                        disabled={isLoading}
                        sx={{ color: '#64748b' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleTransferSubmit}
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                        sx={{
                            bgcolor: THEME_BLUE,
                            paddingX: 4,
                            '&:hover': { bgcolor: '#001a38' }
                        }}
                    >
                        {isLoading ? 'Processing...' : 'Submit Transfer'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TransferEmployee;



