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
    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
      <Breadcrumbs separator={<ChevronRight sx={{ color: '#94a3b8' }} />} sx={{ color: '#374151', flex: 1 }}>
        <Button
          onClick={handleHomeClick}
          startIcon={<Home sx={{ fontSize: '1.2rem' }} />}
          sx={{
            color: currentView === 'modules' ? '#002147' : '#64748b',
            fontWeight: currentView === 'modules' ? 700 : 500,
            textTransform: 'none',
            fontSize: '1rem',
            px: 1.5,
            py: 1,
            borderRadius: 12,
            '&:hover': { backgroundColor: 'rgba(0, 33, 71, 0.08)', color: '#002147' }
          }}
        >
          Home
        </Button>

        {selectedModule && (
          <Button
            onClick={() => setCurrentView('submenus')}
            sx={{
              color: currentView === 'submenus' ? '#002147' : '#64748b',
              fontWeight: currentView === 'submenus' ? 700 : 500,
              textTransform: 'none',
              fontSize: '1rem',
              px: 1.5,
              py: 1,
              borderRadius: 12,
              '&:hover': { backgroundColor: 'rgba(0, 33, 71, 0.08)', color: '#002147' }
            }}
          >
            {selectedModule.name}
          </Button>
        )}

        {selectedSubMenu && (
          <Typography sx={{ color: '#002147', fontWeight: 700, fontSize: '1rem' }}>
            {selectedSubMenu.name}
          </Typography>
        )}
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Chip
          label={selectedULB.ulbName}
          size="small"
          sx={{
            bgcolor: '#e3f2fd',
            color: '#002147',
            fontWeight: 600,
            borderRadius: 12,
            px: 1.5,
            py: 1
          }}
        />
        <Chip
          label={selectedULB.roleType}
          size="small"
          variant="outlined"
          sx={{
            borderColor: '#002147',
            color: '#002147',
            fontWeight: 600,
            borderRadius: 12,
            px: 1.5,
            py: 1
          }}
        />
      </Box>
    </Box>
  );

  const renderModules = () => (
    <Box>
      {/* Module Navigation Bar */}
      <Box sx={{
        bgcolor: '#002147',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {MODULES.map((module) => (
            <Button
              key={module.id}
              onClick={() => handleModuleClick(module)}
              sx={{
                color: 'white',
                textTransform: 'none',
                px: { xs: 2, sm: 3 },
                py: 2.5,
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                fontWeight: 600,
                borderRadius: 0,
                flexGrow: 1,
                minWidth: 'fit-content',
                borderRight: '1px solid rgba(255,255,255,0.15)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.15)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                },
                '&:last-child': {
                  borderRight: 'none'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ fontSize: { xs: '16px', sm: '20px' }, display: 'flex', alignItems: 'center' }}>
                  {module.icon}
                </Box>
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  {module.name}
                </Box>
              </Box>
            </Button>
          ))}
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ mt: 5, p: { xs: 3, sm: 5, md: 6 }, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 3 }}>
          Welcome to {selectedULB.ulbName}
        </Typography>
        <Typography variant="h6" sx={{ color: '#64748b', mb: 4, fontWeight: 400 }}>
          Select a module from the navigation bar above to access its services and functionalities
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2.5 }}>
          <Chip
            label={`${MODULES.length} Modules Available`}
            sx={{
              bgcolor: '#e3f2fd',
              color: '#1976d2',
              fontWeight: 600,
              borderRadius: 12,
              px: 2,
              py: 1.5,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          />
          <Chip
            label={`Role: ${selectedULB.roleType}`}
            variant="outlined"
            sx={{
              borderColor: '#1976d2',
              color: '#1976d2',
              fontWeight: 600,
              borderRadius: 12,
              px: 2,
              py: 1.5
            }}
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
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          mb: 4
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Button
              sx={{
                color: 'white',
                textTransform: 'none',
                px: { xs: 2, sm: 3 },
                py: 2.5,
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 700,
                borderRadius: 0,
                bgcolor: 'rgba(255,255,255,0.15)',
                minWidth: { xs: '100%', sm: 'fit-content' },
                justifyContent: { xs: 'center', sm: 'flex-start' },
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ fontSize: { xs: '20px', sm: '22px' }, display: 'flex', alignItems: 'center' }}>
                  {selectedModule.icon}
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'inline' } }}>
                  {selectedModule.name}
                </Box>
              </Box>
            </Button>

            {/* Submenu Navigation */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', flexGrow: 1 }}>
              {selectedModule.subMenus.map((subMenu, index) => (
                <Button
                  key={subMenu.id}
                  onClick={() => handleSubMenuClick(subMenu)}
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    textTransform: 'none',
                    px: { xs: 2, sm: 3 },
                    py: 2.5,
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                    fontWeight: 500,
                    borderRadius: 0,
                    borderLeft: index === 0 ? '1px solid rgba(255,255,255,0.15)' : 'none',
                    borderRight: '1px solid rgba(255,255,255,0.15)',
                    minWidth: { xs: '50%', sm: 'fit-content' },
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.15)',
                      color: 'white',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {subMenu.name}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Module Description */}
        <Box sx={{ mb: 5, p: { xs: 3, sm: 4, md: 5 }, bgcolor: '#f8fafc', borderRadius: 3, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 2 }}>
            {selectedModule.name}
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748b', mb: 4, fontWeight: 400 }}>
            {selectedModule.description}
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8' }}>
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
        <Paper sx={{ p: { xs: 3, sm: 4, md: 5 }, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: `${selectedModule.color}15`,
                color: selectedModule.color,
                mr: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
              }}
            >
              {selectedModule.icon}
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
                {selectedSubMenu.name}
              </Typography>
              <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400 }}>
                {selectedSubMenu.description}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: { xs: 4, sm: 5, md: 6 }, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Typography variant="h5" sx={{ color: '#0f172a', mb: 3, fontWeight: 700 }}>
              {selectedSubMenu.name} Interface
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', mb: 5, fontSize: '1.1rem', lineHeight: 1.7 }}>
              This is where the specific functionality for "{selectedSubMenu.name}" would be implemented.
              The interface would contain forms, tables, and other components specific to this service.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                onClick={() => setCurrentView('submenus')}
                sx={{
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: '1rem',
                  borderColor: '#002147',
                  color: '#002147',
                  '&:hover': {
                    borderColor: '#001a38',
                    bgcolor: 'rgba(0, 33, 71, 0.05)',
                    boxShadow: '0 4px 6px rgba(0, 33, 71, 0.1)'
                  }
                }}
              >
                Back to Services
              </Button>
              <Button
                variant="contained"
                onClick={handleHomeClick}
                sx={{
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: '1rem',
                  bgcolor: selectedModule.color,
                  '&:hover': {
                    bgcolor: selectedModule.color + 'dd',
                    boxShadow: `0 4px 12px ${selectedModule.color}40`
                  }
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