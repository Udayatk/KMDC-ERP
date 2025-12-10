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
import { Add } from '@mui/icons-material';

// --- Types ---
interface MappingRow {
    id: number;
    ulbType: string;
    section: string;
    role: string;
    level: string;
}

// --- Mock Data ---
const MOCK_ULB_TYPES = ['City Corporation', 'CMC', 'TMC', 'TP'];
const MOCK_SECTIONS = ['Engineering', 'Health', 'Revenue', 'Administration', 'Town Planning'];
const MOCK_ROLES = ['JE', 'AE', 'AEE', 'EE', 'DC', 'Commissioner', 'Health Inspector', 'Revenue Inspector', 'Chief Officer'];
const MOCK_LEVELS = ['Level 0', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];

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

const MapLevelsToRoles: React.FC = () => {
    // Form State
    const [ulbType, setUlbType] = useState<string | null>(null);
    const [section, setSection] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [level, setLevel] = useState<string | null>(null);

    // Data State
    const [mappings, setMappings] = useState<MappingRow[]>([
        { id: 1, ulbType: 'CMC', section: 'Engineering', role: 'JE', level: 'Level 5' },
        { id: 2, ulbType: 'CMC', section: 'Engineering', role: 'AE', level: 'Level 4' },
        { id: 3, ulbType: 'CMC', section: 'Engineering', role: 'AEE', level: 'Level 3' },
        { id: 4, ulbType: 'CMC', section: 'Engineering', role: 'EE', level: 'Level 2' },
        { id: 5, ulbType: 'CMC', section: 'Engineering', role: 'DC', level: 'Level 1' },
        { id: 6, ulbType: 'CMC', section: 'Engineering', role: 'Commissioner', level: 'Level 0' },
    ]);

    const [notification, setNotification] = useState<{ open: boolean; message: string; type: 'success' | 'error' | 'info' }>({
        open: false,
        message: '',
        type: 'success'
    });

    // Handlers
    const handleAdd = () => {
        if (!ulbType || !section || !role || !level) {
            setNotification({ open: true, message: 'Please select all fields', type: 'error' });
            return;
        }

        // Validation: System should not allow user to add the same Role to add different Levels in Same section.
        // Check if there is already an entry for this (ULB Type + Section + Role)
        const conflict = mappings.some(
            m => m.ulbType === ulbType && m.section === section && m.role === role
        );

        if (conflict) {
            setNotification({
                open: true,
                message: `The Role '${role}' is already mapped in '${section}' for '${ulbType}'. Cannot add different Level.`,
                type: 'error'
            });
            return;
        }

        const newMapping: MappingRow = {
            id: Date.now(),
            ulbType,
            section,
            role,
            level
        };

        setMappings([...mappings, newMapping]);
        setNotification({ open: true, message: 'Role mapped successfully', type: 'success' });
    };

    const handleDelete = (id: number) => {
        setMappings(mappings.filter(m => m.id !== id));
        setNotification({ open: true, message: 'Mapping removed successfully', type: 'info' });
    };

    return (
        <Fade in={true}>
            <Box sx={{ maxWidth: '100%', mx: 'auto', p: { xs: PADDING.XS, sm: PADDING.SM, md: PADDING.MD } }}>
                <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
                    {/* Header */}
                    <Box sx={{ bgcolor: THEME_BLUE, py: 2.5, px: 4 }}>
                        <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>
                            Map Levels to Roles
                        </Typography>
                    </Box>

                    {/* Controls Row */}
                    <Box sx={{ p: { xs: PADDING.MD, sm: PADDING.LG, md: PADDING.XL }, bgcolor: '#fff' }}>
                        <Box sx={{ display: 'flex', gap: GRID_SPACING.LG, alignItems: 'center', flexWrap: 'wrap' }}>
                            <Box sx={{ flex: 1, minWidth: 200 }}>
                                <Autocomplete
                                    fullWidth
                                    options={MOCK_ULB_TYPES}
                                    value={ulbType}
                                    onChange={(_, newValue) => setUlbType(newValue)}
                                    renderInput={(params) => (
                                        <TextField 
                                            {...params} 
                                            label="ULB Type" 
                                            variant="outlined" 
                                            sx={{
                                                '& .MuiOutlinedInput-root': { 
                                                    borderRadius: 8,
                                                    bgcolor: 'white',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 200 }}>
                                <Autocomplete
                                    fullWidth
                                    options={MOCK_SECTIONS}
                                    value={section}
                                    onChange={(_, newValue) => setSection(newValue)}
                                    renderInput={(params) => (
                                        <TextField 
                                            {...params} 
                                            label="Section" 
                                            variant="outlined" 
                                            sx={{
                                                '& .MuiOutlinedInput-root': { 
                                                    borderRadius: 8,
                                                    bgcolor: 'white',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 200 }}>
                                <Autocomplete
                                    fullWidth
                                    options={MOCK_ROLES}
                                    value={role}
                                    onChange={(_, newValue) => setRole(newValue)}
                                    renderInput={(params) => (
                                        <TextField 
                                            {...params} 
                                            label="Role" 
                                            variant="outlined" 
                                            sx={{
                                                '& .MuiOutlinedInput-root': { 
                                                    borderRadius: 8,
                                                    bgcolor: 'white',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 200 }}>
                                <Autocomplete
                                    fullWidth
                                    options={MOCK_LEVELS}
                                    value={level}
                                    onChange={(_, newValue) => setLevel(newValue)}
                                    renderInput={(params) => (
                                        <TextField 
                                            {...params} 
                                            label="Level" 
                                            variant="outlined" 
                                            sx={{
                                                '& .MuiOutlinedInput-root': { 
                                                    borderRadius: 8,
                                                    bgcolor: 'white',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={{ flex: 0.8, minWidth: 150 }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleAdd}
                                    sx={{
                                        bgcolor: THEME_BLUE,
                                        height: '56px',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderRadius: 8,
                                        boxShadow: '0 4px 6px rgba(0, 33, 71, 0.15)',
                                        '&:hover': { 
                                            bgcolor: '#001a38',
                                            boxShadow: '0 6px 8px rgba(0, 33, 71, 0.2)'
                                        }
                                    }}
                                >
                                    Add Mapping
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    {/* Divider/Spacing - Matches screenshot separator line */}
                    <Box sx={{ height: 2, bgcolor: '#e2e8f0', mx: { xs: MARGIN.MD, sm: MARGIN.LG, md: MARGIN.XL } }} />

                    {/* Table */}
                    <Box sx={{ p: { xs: PADDING.MD, sm: PADDING.LG, md: PADDING.XL } }}>
                        <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 3, boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: THEME_BLUE }}>
                                        <TableCell sx={{ color: 'white', fontWeight: 700, width: '80px', textAlign: 'center', py: 2 }}>Sl No</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 700, textAlign: 'center', py: 2 }}>ULB Type</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 700, textAlign: 'center', py: 2 }}>Section</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 700, textAlign: 'center', py: 2 }}>Role</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 700, textAlign: 'center', py: 2 }}>Level</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 700, textAlign: 'center', py: 2, width: '150px' }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mappings.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 8, color: '#94a3b8' }}>
                                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>No mappings found</Typography>
                                                <Typography variant="body2">Add your first role mapping using the form above</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        mappings.map((row, index) => (
                                            <TableRow 
                                                key={row.id} 
                                                sx={{ 
                                                    '&:nth-of-type(odd)': { bgcolor: 'white' },
                                                    '&:nth-of-type(even)': { bgcolor: '#f8fafc' },
                                                    '&:hover': { bgcolor: '#f1f5f9' }
                                                }}
                                            >
                                                <TableCell align="center" sx={{ fontWeight: 500, color: '#334155', py: 2 }}>{index + 1}</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 600, color: '#1e293b', py: 2 }}>{row.ulbType}</TableCell>
                                                <TableCell align="center" sx={{ color: '#475569', py: 2 }}>{row.section}</TableCell>
                                                <TableCell align="center" sx={{ color: '#475569', py: 2 }}>{row.role}</TableCell>
                                                <TableCell align="center" sx={{ color: '#475569', py: 2 }}>{row.level}</TableCell>
                                                <TableCell align="center" sx={{ py: 2 }}>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        onClick={() => handleDelete(row.id)}
                                                        sx={{
                                                            bgcolor: THEME_ERROR,
                                                            color: 'white',
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            px: 3,
                                                            py: 1,
                                                            borderRadius: 6,
                                                            boxShadow: '0 2px 4px rgba(255, 0, 0, 0.1)',
                                                            '&:hover': { 
                                                                bgcolor: '#d32f2f',
                                                                boxShadow: '0 4px 6px rgba(255, 0, 0, 0.15)'
                                                            }
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
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

export default MapLevelsToRoles;
