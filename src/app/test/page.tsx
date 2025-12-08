'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ClientThemeProvider from '../../components/ClientThemeProvider';
import ULBSelectionDemo from '../../components/ULBSelectionDemo';

export default function TestPage() {
  const [showULBDemo, setShowULBDemo] = useState(false);

  return (
    <ClientThemeProvider>
      <Box sx={{ p: 4 }}>
        <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            KMDS ERP - Feature Test Page
          </Typography>
          
          <Typography variant="body1" gutterBottom sx={{ mb: 4 }}>
            This page is used to test features without hydration issues.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
            <Button
              variant="contained"
              onClick={() => setShowULBDemo(true)}
              sx={{ px: 4, py: 1.5 }}
            >
              Test ULB Selection Feature
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => window.location.href = '/'}
              sx={{ px: 4, py: 1.5 }}
            >
              Back to Main App
            </Button>
          </Box>

          {showULBDemo && (
            <Box sx={{ mt: 4 }}>
              <ULBSelectionDemo />
            </Box>
          )}
        </Paper>
      </Box>
    </ClientThemeProvider>
  );
}