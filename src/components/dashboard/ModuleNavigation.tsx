'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Breadcrumbs,
  IconButton,
  Chip
} from '@mui/material';
import {
  Home,
  Business,
  Water,
  ElectricalServices,
  LocalGasStation,
  Build,
  Assessment,
  People,
  LocationCity,
  AccountBalance,
  Traffic,
  Park,
  School,
  LocalHospital,
  ShoppingCart,
  Security,
  ChevronRight
} from '@mui/icons-material';

// Types for modules and submenus
interface SubMenu {
  id: string;
  name: string;
  description: string;
  component?: React.ComponentType;
}

interface Module {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  subMenus: SubMenu[];
}

// Mock modules data
const MODULES: Module[] = [
  {
    id: 'utility-management',
    name: 'Utility Management',
    description: 'Manage water, electricity, gas and other utilities',
    icon: <ElectricalServices />,
    color: '#1976d2',
    subMenus: [
      { id: 'water-connection', name: 'Water Connection Request', description: 'Apply for new water connections' },
      { id: 'electricity-connection', name: 'Electricity Connection Request', description: 'Apply for electrical connections' },
      { id: 'gas-pipeline', name: 'Gas Pipeline Request', description: 'Request gas pipeline connections' },
      { id: 'utility-maintenance', name: 'Utility Maintenance', description: 'Report utility issues and maintenance' }
    ]
  },
  {
    id: 'property-management',
    name: 'Property Management',
    description: 'Property registration, tax collection and assessment',
    icon: <Business />,
    color: '#388e3c',
    subMenus: [
      { id: 'property-registration', name: 'Property Registration', description: 'Register new properties' },
      { id: 'property-tax', name: 'Property Tax Collection', description: 'Collect and manage property taxes' },
      { id: 'property-assessment', name: 'Property Assessment', description: 'Assess property values' },
      { id: 'ownership-transfer', name: 'Ownership Transfer', description: 'Transfer property ownership' }
    ]
  },
  {
    id: 'public-works',
    name: 'Public Works',
    description: 'Road maintenance, infrastructure development',
    icon: <Build />,
    color: '#f57c00',
    subMenus: [
      { id: 'road-maintenance', name: 'Road Maintenance', description: 'Maintain and repair roads' },
      { id: 'infrastructure-development', name: 'Infrastructure Development', description: 'Plan and execute infrastructure projects' },
      { id: 'street-lighting', name: 'Street Lighting', description: 'Manage street lighting systems' },
      { id: 'drainage-system', name: 'Drainage System', description: 'Maintain drainage infrastructure' }
    ]
  },
  {
    id: 'citizen-services',
    name: 'Citizen Services',
    description: 'Birth certificates, licenses and citizen support',
    icon: <People />,
    color: '#7b1fa2',
    subMenus: [
      { id: 'birth-certificate', name: 'Birth Certificate', description: 'Issue birth certificates' },
      { id: 'death-certificate', name: 'Death Certificate', description: 'Issue death certificates' },
      { id: 'trade-license', name: 'Trade License', description: 'Issue and renew trade licenses' },
      { id: 'citizen-complaints', name: 'Citizen Complaints', description: 'Handle citizen grievances' }
    ]
  },
  {
    id: 'health-sanitation',
    name: 'Health & Sanitation',
    description: 'Public health, waste management and sanitation',
    icon: <LocalHospital />,
    color: '#d32f2f',
    subMenus: [
      { id: 'waste-management', name: 'Waste Management', description: 'Manage waste collection and disposal' },
      { id: 'public-health', name: 'Public Health Programs', description: 'Implement health initiatives' },
      { id: 'sanitation-services', name: 'Sanitation Services', description: 'Maintain cleanliness and sanitation' },
      { id: 'health-inspection', name: 'Health Inspection', description: 'Conduct health and safety inspections' }
    ]
  },
  {
    id: 'finance-accounts',
    name: 'Finance & Accounts',
    description: 'Budget management, revenue collection and accounting',
    icon: <AccountBalance />,
    color: '#00796b',
    subMenus: [
      { id: 'budget-planning', name: 'Budget Planning', description: 'Plan and allocate budgets' },
      { id: 'revenue-collection', name: 'Revenue Collection', description: 'Collect various taxes and fees' },
      { id: 'expense-tracking', name: 'Expense Tracking', description: 'Track and manage expenses' },
      { id: 'financial-reports', name: 'Financial Reports', description: 'Generate financial statements' }
    ]
  }
];

interface ModuleNavigationProps {
  userInfo: {
    employeeId: string;
    employeeName: string;
    ulbMappings: any[];
  };
  selectedULB: {
    ulbId: string;
    ulbName: string;
    roleType: string;
    district: string;
  };
}

const ModuleNavigation: React.FC<ModuleNavigationProps> = ({ userInfo, selectedULB }) => {
  const [currentView, setCurrentView] = useState<'modules' | 'submenus' | 'content'>('modules');
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedSubMenu, setSelectedSubMenu] = useState<SubMenu | null>(null);

  const handleModuleClick = (module: Module) => {
    setSelectedModule(module);
    setCurrentView('submenus');
  };

  const handleSubMenuClick = (subMenu: SubMenu) => {
    setSelectedSubMenu(subMenu);
    setCurrentView('content');
  };

  const handleHomeClick = () => {
    setCurrentView('modules');
    setSelectedModule(null);
    setSelectedSubMenu(null);
  };

  const renderBreadcrumb = () => (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Breadcrumbs separator={<ChevronRight />} sx={{ color: '#374151' }}>
        <Button
          onClick={handleHomeClick}
          startIcon={<Home />}
          sx={{ 
            color: currentView === 'modules' ? '#1976d2' : '#6b7280',
            fontWeight: currentView === 'modules' ? 600 : 400,
            textTransform: 'none',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
          }}
        >
          Home
        </Button>
        
        {selectedModule && (
          <Button
            onClick={() => setCurrentView('submenus')}
            sx={{ 
              color: currentView === 'submenus' ? '#1976d2' : '#6b7280',
              fontWeight: currentView === 'submenus' ? 600 : 400,
              textTransform: 'none',
              '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
            }}
          >
            {selectedModule.name}
          </Button>
        )}
        
        {selectedSubMenu && (
          <Typography sx={{ color: '#1976d2', fontWeight: 600 }}>
            {selectedSubMenu.name}
          </Typography>
        )}
      </Breadcrumbs>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip 
          label={selectedULB.ulbName} 
          size="small" 
          sx={{ 
            bgcolor: '#e3f2fd', 
            color: '#1976d2',
            fontWeight: 500
          }} 
        />
        <Chip 
          label={selectedULB.roleType} 
          size="small" 
          variant="outlined"
          sx={{ borderColor: '#1976d2', color: '#1976d2' }}
        />
      </Box>
    </Box>
  );

  const renderModules = () => (
    <Box>
      {/* Module Navigation Bar */}
      <Box sx={{ 
        bgcolor: '#002147', 
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {MODULES.map((module) => (
            <Button
              key={module.id}
              onClick={() => handleModuleClick(module)}
              sx={{
                color: 'white',
                textTransform: 'none',
                px: 3,
                py: 2,
                fontSize: '0.9rem',
                fontWeight: 500,
                borderRadius: 0,
                flexGrow: 1,
                minWidth: 'fit-content',
                borderRight: '1px solid rgba(255,255,255,0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)'
                },
                '&:last-child': {
                  borderRight: 'none'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                  {module.icon}
                </Box>
                {module.name}
              </Box>
            </Button>
          ))}
        </Box>
      </Box>
      
      {/* Main Content Area */}
      <Box sx={{ mt: 4, p: 6, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
          Welcome to {selectedULB.ulbName}
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
          Select a module from the navigation bar above to access its services and functionalities
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Chip 
            label={`${MODULES.length} Modules Available`}
            sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 500 }}
          />
          <Chip 
            label={`Role: ${selectedULB.roleType}`}
            variant="outlined"
            sx={{ borderColor: '#1976d2', color: '#1976d2' }}
          />
        </Box>
      </Box>
    </Box>
  );

  const renderSubMenus = () => {
    if (!selectedModule) return null;

    return (
      <Box>
        {/* Module Navigation Bar - Only show selected module */}
        <Box sx={{ 
          bgcolor: '#002147', 
          borderRadius: '6px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          mb: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              sx={{
                color: 'white',
                textTransform: 'none',
                px: 3,
                py: 2,
                fontSize: '0.9rem',
                fontWeight: 600,
                borderRadius: 0,
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.15)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                  {selectedModule.icon}
                </Box>
                {selectedModule.name}
              </Box>
            </Button>
            
            {/* Submenu Navigation */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', flexGrow: 1 }}>
              {selectedModule.subMenus.map((subMenu, index) => (
                <Button
                  key={subMenu.id}
                  onClick={() => handleSubMenuClick(subMenu)}
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    textTransform: 'none',
                    px: 2.5,
                    py: 2,
                    fontSize: '0.85rem',
                    fontWeight: 400,
                    borderRadius: 0,
                    borderLeft: index === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white'
                    }
                  }}
                >
                  {subMenu.name}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Module Description */}
        <Box sx={{ mb: 4, p: 4, bgcolor: '#f8fafc', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
            {selectedModule.name}
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
            {selectedModule.description}
          </Typography>
          <Typography variant="body2" sx={{ color: '#9ca3af' }}>
            Click on any service above to access its functionality
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderContent = () => {
    if (!selectedModule || !selectedSubMenu) return null;

    return (
      <Box>
        <Paper sx={{ p: 4, borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: `${selectedModule.color}15`,
                color: selectedModule.color,
                mr: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {selectedModule.icon}
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
                {selectedSubMenu.name}
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b' }}>
                {selectedSubMenu.description}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 6, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: '#64748b', mb: 2 }}>
              {selectedSubMenu.name} Interface
            </Typography>
            <Typography variant="body1" sx={{ color: '#9ca3af', mb: 4 }}>
              This is where the specific functionality for "{selectedSubMenu.name}" would be implemented.
              The interface would contain forms, tables, and other components specific to this service.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => setCurrentView('submenus')}
                sx={{ textTransform: 'none' }}
              >
                Back to Services
              </Button>
              <Button
                variant="contained"
                onClick={handleHomeClick}
                sx={{ 
                  textTransform: 'none',
                  bgcolor: selectedModule.color,
                  '&:hover': { bgcolor: selectedModule.color + 'dd' }
                }}
              >
                Go to Home
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {renderBreadcrumb()}
      
      {currentView === 'modules' && renderModules()}
      {currentView === 'submenus' && renderSubMenus()}
      {currentView === 'content' && renderContent()}
    </Box>
  );
};

export default ModuleNavigation;