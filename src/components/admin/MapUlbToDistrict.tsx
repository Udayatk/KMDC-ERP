'use client';

import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Autocomplete,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Chip,
    Container
} from '@mui/material';
import { CheckBoxOutlineBlank, CheckBox } from '@mui/icons-material';

// --- Types ---
interface Mapping {
    id: number;
    district: string;
    ulb: string;
}

// --- Mock Data ---
const DISTRICTS = [
    'Bengaluru Urban',
    'Bengaluru Rural',
    'Mysuru',
    'Hassan',
    'Shivamogga',
    'Tumakuru',
    'Belagavi',
    'Hubballi-Dharwad'
];

const ALL_ULBS = [
    'BBMP', 'Mysore City Corp', 'Hassan CMC', 'Shivamogga City Corp',
    'Tumakuru Corp', 'Belagavi Corp', 'Hubballi-Dharwad Corp',
    'Nelamangala CMC', 'Hoskote CMC', 'Hunsur CMC', 'Arsikere CMC',
    'Bhadravathi CMC', 'Tiptur CMC', 'Gokak CMC'
];

const THEME_BLUE = '#002147'; // Dark Navy Blue
const THEME_RED = '#ff0000'; // Standard bright red from screenshot

const MapUlbToDistrict: React.FC = () => {
    // State
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
    const [selectedUlbs, setSelectedUlbs] = useState<string[]>([]);
    const [mappings, setMappings] = useState<Mapping[]>([
        { id: 1, district: 'Hassan', ulb: 'Hassan' },
        { id: 2, district: 'Mysuru', ulb: 'Mysore City Corp' },
        { id: 3, district: 'Shivamogga', ulb: 'Shivamogga City Corp' }
    ]);

    // Validation/Filtering Logic
    const mappedUlbNames = useMemo(() => new Set(mappings.map(m => m.ulb)), [mappings]);

    const availableUlbs = useMemo(() => {
        return ALL_ULBS.filter(ulb => !mappedUlbNames.has(ulb) || selectedUlbs.includes(ulb));
    }, [mappedUlbNames, selectedUlbs]);

    const handleAdd = () => {
        if (!selectedDistrict || selectedUlbs.length === 0) {
            alert('Please select a District and at least one ULB.');
            return;
        }

        const newMappings: Mapping[] = selectedUlbs.map((ulb, index) => ({
            id: Date.now() + index,
            district: selectedDistrict,
            ulb: ulb
        }));

        setMappings(prev => [...prev, ...newMappings]);
        setSelectedDistrict(null);
        setSelectedUlbs([]);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this mapping?')) {
            setMappings(prev => prev.filter(m => m.id !== id));
        }
    };

    const icon = <CheckBoxOutlineBlank fontSize="small" />;
    const checkedIcon = <CheckBox fontSize="small" />;

    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', p: 4, bgcolor: '#f1f5f9', minHeight: '100%' }}>
            {/* Single Main Card Container */}
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: '1200px',
                    borderRadius: 3,
                    overflow: 'hidden',
                    bgcolor: 'white',
                    p: 5,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
                }}
            >
                {/* Header Blue Bar */}
                <Box
                    sx={{
                        bgcolor: THEME_BLUE,
                        py: 2,
                        borderRadius: 2,
                        mb: 5,
                        textAlign: 'center',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                >
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                        Map ULBs to District
                    </Typography>
                </Box>

                {/* Input Row */}
                <Box sx={{ display: 'flex', gap: 3, mb: 5, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Autocomplete
                        options={DISTRICTS}
                        value={selectedDistrict}
                        onChange={(event, newValue) => setSelectedDistrict(newValue)}
                        sx={{ flex: 1, minWidth: 250 }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="District Name"
                                placeholder="Select District Name"
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

                    <Autocomplete
                        multiple
                        options={availableUlbs}
                        disableCloseOnSelect
                        value={selectedUlbs}
                        onChange={(event, newValue) => setSelectedUlbs(newValue)}
                        getOptionLabel={(option) => option}
                        renderOption={(props, option, { selected }) => (
                            <li {...props}>
                                <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                />
                                {option}
                            </li>
                        )}
                        sx={{ flex: 2, minWidth: 300 }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="ULB Names"
                                placeholder="Select ULB Name (Multi Selection)"
                                sx={{
                                    '& .MuiOutlinedInput-root': { 
                                        borderRadius: 8,
                                        bgcolor: 'white',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                    }
                                }}
                            />
                        )}
                        renderTags={(value, getTagProps) => {
                            const numTags = value.length;
                            const limit = 3;
                            return (
                                <>
                                    {value.slice(0, limit).map((option, index) => (
                                        <Chip 
                                            label={option} 
                                            size="small" 
                                            {...getTagProps({ index })}
                                            sx={{
                                                borderRadius: 4,
                                                fontWeight: 500
                                            }}
                                        />
                                    ))}
                                    {numTags > limit && <Chip label={`+${numTags - limit}`} size="small" />}
                                </>
                            );
                        }}
                    />

                    <Button
                        variant="contained"
                        onClick={handleAdd}
                        sx={{
                            bgcolor: THEME_BLUE,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 6,
                            py: 1.8,
                            borderRadius: 8,
                            minWidth: '120px',
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

                {/* Separator Line */}
                <Box sx={{ borderBottom: '2px solid #e2e8f0', mb: 4 }} />

                {/* Table */}
                <TableContainer
                    component={Box}
                    sx={{
                        border: '1px solid #e2e8f0',
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.03)'
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: THEME_BLUE }}>
                                <TableCell sx={{ color: 'white', fontWeight: 700, width: '10%', pl: 3, py: 2 }}>Sl No</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 700, width: '35%', py: 2 }}>District Name</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 700, width: '40%', py: 2 }}>ULB Name</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 700, textAlign: 'center', py: 2 }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mappings.map((row, index) => (
                                <TableRow 
                                    key={row.id} 
                                    sx={{ 
                                        '&:nth-of-type(odd)': { bgcolor: 'white' },
                                        '&:nth-of-type(even)': { bgcolor: '#f8fafc' },
                                        '&:hover': { bgcolor: '#f1f5f9' }
                                    }}
                                >
                                    <TableCell sx={{ pl: 3, py: 2, fontWeight: 500, color: '#334155' }}>{index + 1}</TableCell>
                                    <TableCell sx={{ py: 2, fontWeight: 600, color: '#1e293b' }}>{row.district}</TableCell>
                                    <TableCell sx={{ py: 2, color: '#475569' }}>{row.ulb}</TableCell>
                                    <TableCell sx={{ textAlign: 'center', py: 2 }}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => handleDelete(row.id)}
                                            sx={{
                                                textTransform: 'none',
                                                minWidth: '90px',
                                                bgcolor: THEME_RED,
                                                borderRadius: 6,
                                                fontWeight: 600,
                                                boxShadow: '0 2px 4px rgba(255, 0, 0, 0.1)',
                                                '&:hover': { 
                                                    bgcolor: '#cc0000', 
                                                    boxShadow: '0 4px 6px rgba(255, 0, 0, 0.15)'
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {mappings.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                                        <Typography variant="h6" sx={{ mb: 1 }}>No mappings found</Typography>
                                        <Typography variant="body2">Add your first ULB to District mapping using the form above</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Paper>
        </Box>
    );
};

export default MapUlbToDistrict;
