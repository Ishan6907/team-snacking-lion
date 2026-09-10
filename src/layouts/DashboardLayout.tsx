import { useState, useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Stack,
  Chip,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as AlertsIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  AccountTree,
  Speed,
  TrendingUp,
  Park,
  AssignmentTurnedIn,
  Gavel,
  CheckCircle,
  Science,
  AccountBalance,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import PaimanaLogo from '@/components/common/PaimanaLogo';
import CommandPaletteModal from '@/components/common/CommandPaletteModal';
import { isMoEFCCForestProject } from '@/pages/ForestClearancePage';
import { ALL_1428_PROJECTS } from '@/data/inventoryData';
import { useUnreadAlertCount } from '@/hooks/useAlerts';
import { useRiskThresholds, calculatePortfolioMetrics } from '@/utils/thresholds';

const DRAWER_WIDTH = 250;

const TOP_NAV_TABS = [
  { label: 'Executive Portfolio', path: '/', badge: null },
  { label: 'Master Project Inventory', path: '/inventory', badge: '1,428' },
  { label: 'Milestone & Root-Cause Analysis', path: '/milestones', badge: null },
  { label: 'What-If Delay Simulator', path: '/simulator', badge: 'ML v4.2' },
  { label: 'Governance & Audits', path: '/settings', badge: null },
];

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const thresholds = useRiskThresholds();
  const portfolioMetrics = useMemo(() => {
    return calculatePortfolioMetrics(ALL_1428_PROJECTS, thresholds);
  }, [thresholds]);

  // Dynamic badge counts
  const moefccCount = useMemo(() => ALL_1428_PROJECTS.filter(isMoEFCCForestProject).length, []);
  const landAcqCount = useMemo(
    () =>
      ALL_1428_PROJECTS.filter((p) => {
        const b = (p.criticalBlocker || '').toLowerCase();
        return b.includes('land') || b.includes('3a') || b.includes('3d') || b.includes('cala') || b.includes('possession') || b.includes('compensation');
      }).length,
    []
  );
  const arbitrationCount = useMemo(
    () =>
      ALL_1428_PROJECTS.filter((p) => {
        const b = (p.criticalBlocker || '').toLowerCase();
        return b.includes('arbitration') || b.includes('litigation') || b.includes('court') || b.includes('dispute') || b.includes('claims');
      }).length,
    []
  );
  const { data: unreadCount } = useUnreadAlertCount();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>
      {/* Sidebar Header: Corridor Workspaces */}
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.65rem', letterSpacing: 0.5, textTransform: 'uppercase' }}>
          CORRIDOR WORKSPACES
        </Typography>
        <Chip
          label="All India"
          size="small"
          onClick={() => navigate('/inventory')}
          sx={{
            height: 20,
            fontSize: '0.62rem',
            fontWeight: 800,
            bgcolor: '#f1f5f9',
            color: '#0f172a',
            border: '1px solid #cbd5e1',
            cursor: 'pointer',
          }}
        />
      </Box>

      {/* Priority Programs Section */}
      <Box sx={{ px: 2, pt: 2, pb: 0.8 }}>
        <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', fontSize: '0.65rem', letterSpacing: 0.8, textTransform: 'uppercase' }}>
          PRIORITY PROGRAMS
        </Typography>
      </Box>

      <List dense sx={{ px: 1.2 }}>
        <ListItem disablePadding sx={{ mb: 0.4 }}>
          <ListItemButton
            selected={location.pathname === '/'}
            onClick={() => navigate('/')}
            sx={{
              borderRadius: 1,
              py: 0.7,
              px: 1.2,
              '&.Mui-selected': { bgcolor: '#0f172a', color: '#ffffff', '& .MuiListItemIcon-root': { color: '#ffffff' } },
            }}
          >
            <ListItemIcon sx={{ minWidth: 28, color: location.pathname === '/' ? '#ffffff' : '#64748b' }}>
              <DashboardIcon sx={{ fontSize: 17 }} />
            </ListItemIcon>
            <ListItemText primary="National Command View" primaryTypographyProps={{ fontSize: '0.78rem', fontWeight: 600 }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 0.4 }}>
          <ListItemButton
            selected={location.pathname === '/inventory'}
            onClick={() => navigate('/inventory')}
            sx={{
              borderRadius: 1,
              py: 0.7,
              px: 1.2,
              '&.Mui-selected': { bgcolor: '#0f172a', color: '#ffffff', '& .MuiListItemIcon-root': { color: '#ffffff' } },
            }}
          >
            <ListItemIcon sx={{ minWidth: 28, color: location.pathname === '/inventory' ? '#ffffff' : '#64748b' }}>
              <AccountTree sx={{ fontSize: 17 }} />
            </ListItemIcon>
            <ListItemText primary="NHAI / MoRTH Projects" primaryTypographyProps={{ fontSize: '0.78rem', fontWeight: 600 }} />
            <Chip label="1,428" size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800, bgcolor: location.pathname === '/inventory' ? 'rgba(255,255,255,0.2)' : '#f1f5f9', color: location.pathname === '/inventory' ? '#ffffff' : '#475569' }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 0.4 }}>
          <ListItemButton
            selected={location.pathname === '/milestones'}
            onClick={() => navigate('/milestones')}
            sx={{
              borderRadius: 1,
              py: 0.7,
              px: 1.2,
              '&.Mui-selected': { bgcolor: '#0f172a', color: '#ffffff', '& .MuiListItemIcon-root': { color: '#ffffff' } },
            }}
          >
            <ListItemIcon sx={{ minWidth: 28, color: location.pathname === '/milestones' ? '#ffffff' : '#64748b' }}>
              <Speed sx={{ fontSize: 17 }} />
            </ListItemIcon>
            <ListItemText primary="Delay Diagnostics" primaryTypographyProps={{ fontSize: '0.78rem', fontWeight: 600 }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 0.4 }}>
          <ListItemButton
            selected={location.pathname === '/simulator'}
            onClick={() => navigate('/simulator')}
            sx={{
              borderRadius: 1,
              py: 0.7,
              px: 1.2,
              '&.Mui-selected': { bgcolor: '#0f172a', color: '#ffffff', '& .MuiListItemIcon-root': { color: '#ffffff' } },
            }}
          >
            <ListItemIcon sx={{ minWidth: 28, color: location.pathname === '/simulator' ? '#ffffff' : '#64748b' }}>
              <TrendingUp sx={{ fontSize: 17 }} />
            </ListItemIcon>
            <ListItemText primary="CapEx Monte Carlo Model" primaryTypographyProps={{ fontSize: '0.78rem', fontWeight: 600 }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 0.4 }}>
          <ListItemButton
            selected={location.pathname === '/how-it-works'}
            onClick={() => navigate('/how-it-works')}
            sx={{
              borderRadius: 1,
              py: 0.7,
              px: 1.2,
              '&.Mui-selected': { bgcolor: '#0f172a', color: '#ffffff', '& .MuiListItemIcon-root': { color: '#ffffff' } },
            }}
          >
            <ListItemIcon sx={{ minWidth: 28, color: location.pathname === '/how-it-works' ? '#ffffff' : '#64748b' }}>
              <Science sx={{ fontSize: 17 }} />
            </ListItemIcon>
            <ListItemText primary="How It Works" primaryTypographyProps={{ fontSize: '0.78rem', fontWeight: 600 }} />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider sx={{ my: 1.5, borderColor: '#e2e8f0' }} />

      {/* Inter-Agency Clearance Section */}
      <Box sx={{ px: 2, pb: 0.8 }}>
        <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', fontSize: '0.65rem', letterSpacing: 0.8, textTransform: 'uppercase' }}>
          INTER-AGENCY CLEARANCE
        </Typography>
      </Box>

      <List dense sx={{ px: 1.2, flexGrow: 1 }}>
        <ListItem disablePadding sx={{ mb: 0.4 }}>
          <ListItemButton
            selected={location.pathname === '/clearances/forest'}
            onClick={() => navigate('/clearances/forest')}
            sx={{
              borderRadius: 1,
              py: 0.7,
              px: 1.2,
              '&.Mui-selected': { bgcolor: '#0f172a', color: '#ffffff', '& .MuiListItemIcon-root': { color: '#ffffff' } },
            }}
          >
            <ListItemIcon sx={{ minWidth: 28, color: location.pathname === '/clearances/forest' ? '#ffffff' : '#ef4444' }}>
              <Park sx={{ fontSize: 17 }} />
            </ListItemIcon>
            <ListItemText primary="MoEFCC & Forest Stage-II" primaryTypographyProps={{ fontSize: '0.78rem', fontWeight: 600 }} />
            <Chip
              label={String(moefccCount)}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.62rem',
                fontWeight: 800,
                bgcolor: location.pathname === '/clearances/forest' ? 'rgba(255,255,255,0.2)' : '#fef2f2',
                color: location.pathname === '/clearances/forest' ? '#ffffff' : '#b91c1c',
              }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 0.4 }}>
          <ListItemButton
            selected={location.pathname === '/land-hub'}
            onClick={() => navigate('/land-hub')}
            sx={{
              borderRadius: 1,
              py: 0.7,
              px: 1.2,
              '&.Mui-selected': { bgcolor: '#c2410c', color: '#ffffff', '& .MuiListItemIcon-root': { color: '#ffffff' } },
            }}
          >
            <ListItemIcon sx={{ minWidth: 28, color: location.pathname === '/land-hub' ? '#ffffff' : '#c2410c' }}>
              <AccountBalance sx={{ fontSize: 17 }} />
            </ListItemIcon>
            <ListItemText primary="Land & R&R Hub (25017)" primaryTypographyProps={{ fontSize: '0.78rem', fontWeight: 700 }} />
            <Chip
              label="SIH25017"
              size="small"
              sx={{
                height: 18,
                fontSize: '0.58rem',
                fontWeight: 800,
                bgcolor: location.pathname === '/land-hub' ? 'rgba(255,255,255,0.2)' : '#ffedd5',
                color: location.pathname === '/land-hub' ? '#ffffff' : '#c2410c',
              }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 0.4 }}>
          <ListItemButton
            selected={location.pathname === '/verification' || location.pathname === '/land-gis'}
            onClick={() => navigate('/verification')}
            sx={{
              borderRadius: 1,
              py: 0.7,
              px: 1.2,
              '&.Mui-selected': { bgcolor: '#0f172a', color: '#ffffff', '& .MuiListItemIcon-root': { color: '#ffffff' } },
            }}
          >
            <ListItemIcon sx={{ minWidth: 28, color: (location.pathname === '/verification' || location.pathname === '/land-gis') ? '#ffffff' : '#c2410c' }}>
              <AssignmentTurnedIn sx={{ fontSize: 17 }} />
            </ListItemIcon>
            <ListItemText primary="Land Acquisition 3(D)" primaryTypographyProps={{ fontSize: '0.78rem', fontWeight: 600 }} />
            <Chip
              label={String(landAcqCount)}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.62rem',
                fontWeight: 800,
                bgcolor: (location.pathname === '/verification' || location.pathname === '/land-gis') ? 'rgba(255,255,255,0.2)' : '#fff7ed',
                color: (location.pathname === '/verification' || location.pathname === '/land-gis') ? '#ffffff' : '#c2410c',
              }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 0.4 }}>
          <ListItemButton
            selected={location.pathname === '/arbitration-claims'}
            onClick={() => navigate('/arbitration-claims')}
            sx={{
              borderRadius: 1,
              py: 0.7,
              px: 1.2,
              '&.Mui-selected': { bgcolor: '#0f172a', color: '#ffffff', '& .MuiListItemIcon-root': { color: '#ffffff' } },
            }}
          >
            <ListItemIcon sx={{ minWidth: 28, color: location.pathname === '/arbitration-claims' ? '#ffffff' : '#64748b' }}>
              <Gavel sx={{ fontSize: 17 }} />
            </ListItemIcon>
            <ListItemText primary="Arbitration & Claims" primaryTypographyProps={{ fontSize: '0.78rem', fontWeight: 600 }} />
            <Chip
              label={String(arbitrationCount)}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.62rem',
                fontWeight: 800,
                bgcolor: location.pathname === '/arbitration-claims' ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                color: location.pathname === '/arbitration-claims' ? '#ffffff' : '#475569',
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Bottom Pinned Badge */}
      <Box sx={{ p: 1.8, borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <CheckCircle sx={{ fontSize: 16, color: '#15803d' }} />
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.72rem', display: 'block' }}>
              Problem Statement 11 &bull; SIH 2026
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem' }}>
              Explainable AI &bull; NIC BharatNet
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', bgcolor: '#f1f5f9' }}>
      <CssBaseline />

      {/* Top 1px Sovereign Header Line */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: '#ffffff',
          color: '#0f172a',
          borderBottom: '1px solid #e2e8f0',
          zIndex: 1200,
        }}
      >
        {/* Tier 1: Main Header Bar */}
        <Toolbar sx={{ minHeight: '52px !important', px: { xs: 1.5, sm: 2.5 }, gap: 1.5 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ display: { sm: 'none' }, color: '#0f172a' }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo & Portal Identity */}
          <Stack direction="row" spacing={1.2} alignItems="center">
            <PaimanaLogo size={32} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.84rem', lineHeight: 1.2, color: '#0f172a', letterSpacing: '-0.01em' }}>
                PAIMANA <span style={{ color: '#64748b', fontWeight: 500 }}>| National Infrastructure Delay Forecasting &amp; Risk Intelligence</span>
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: '#64748b', fontSize: '0.65rem', fontWeight: 600, letterSpacing: 0.3 }}>
                MoRTH / NITI AAYOG PORTAL &bull; PM GATISHAKTI NMP
              </Typography>
            </Box>
          </Stack>

          {/* Center Search Input Trigger */}
          <Box sx={{ mx: 'auto', display: { xs: 'none', md: 'block' }, width: '100%', maxWidth: 360 }}>
            <Box
              onClick={() => setSearchOpen(true)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1.5,
                py: 0.6,
                borderRadius: 1,
                bgcolor: '#f8fafc',
                border: '1px solid #cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': { borderColor: '#0f172a', bgcolor: '#ffffff' },
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <SearchIcon sx={{ fontSize: 16, color: '#64748b' }} />
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                  Search projects, NH corridor
                </Typography>
              </Stack>
              <Box sx={{ px: 0.6, py: 0.1, bgcolor: '#e2e8f0', borderRadius: 0.5, fontSize: '0.62rem', fontWeight: 700, fontFamily: 'monospace', color: '#475569' }}>
                Ctrl+K
              </Box>
            </Box>
          </Box>

          {/* Right Status Badges & Profile */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* GIS Latency Pill */}
            <Chip
              label={
                <Stack direction="row" spacing={0.8} alignItems="center">
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#15803d' }} />
                  <span>PM GatiShakti GIS <strong>42ms</strong></span>
                </Stack>
              }
              size="small"
              sx={{
                height: 24,
                fontSize: '0.68rem',
                bgcolor: '#f0fdf4',
                color: '#15803d',
                border: '1px solid #bbf7d0',
                display: { xs: 'none', lg: 'inline-flex' },
              }}
            />

            {/* Notifications Bell */}
            <Badge badgeContent={unreadCount ?? 0} color="error" invisible={!unreadCount}>
              <IconButton size="small" onClick={() => navigate('/alerts')} sx={{ p: 0.6, border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                <AlertsIcon sx={{ fontSize: 18, color: '#475569' }} />
              </IconButton>
            </Badge>

            {/* Officer Profile Card */}
            <Box
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                cursor: 'pointer',
                p: 0.4,
                pl: 1,
                borderRadius: 1,
                border: '1px solid #e2e8f0',
                bgcolor: '#f8fafc',
                '&:hover': { bgcolor: '#f1f5f9' },
              }}
            >
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: '#0f172a',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                }}
              >
                RS
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' }, pr: 0.5, textAlign: 'left' }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.74rem', display: 'block', lineHeight: 1.1 }}>
                  Shri Rakesh Sharma, IAS
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.64rem', display: 'block' }}>
                  Joint Secretary (Monitoring)
                </Typography>
              </Box>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: { width: 220, mt: 1, borderRadius: 1, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
              }}
            >
              <MenuItem onClick={() => { setAnchorEl(null); navigate('/settings'); }}>
                <SettingsIcon fontSize="small" sx={{ mr: 1.2, color: '#64748b' }} />
                Governance &amp; Audits
              </MenuItem>
              <Divider sx={{ borderColor: '#e2e8f0' }} />
              <MenuItem onClick={() => { setAnchorEl(null); logout(); navigate('/login'); }} sx={{ color: '#dc2626' }}>
                <LogoutIcon fontSize="small" sx={{ mr: 1.2 }} />
                Sign Out
              </MenuItem>
            </Menu>
          </Stack>
        </Toolbar>

        {/* Tier 2: Top Navigation Tabs + CapEx Metrics Ribbon */}
        <Box
          sx={{
            borderTop: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            px: { xs: 1.5, sm: 2.5 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            overflowX: 'auto',
          }}
        >
          {/* Nav Tabs */}
          <Stack direction="row" spacing={0.5} sx={{ minWidth: 'max-content' }}>
            {TOP_NAV_TABS.map((tab) => {
              const active = location.pathname === tab.path || (tab.path === '/milestones' && location.pathname.startsWith('/projects'));
              return (
                <Button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  sx={{
                    px: 1.8,
                    py: 1,
                    minHeight: 38,
                    fontSize: '0.74rem',
                    fontWeight: active ? 800 : 600,
                    color: active ? '#0f172a' : '#64748b',
                    borderBottom: active ? '2px solid #0f172a' : '2px solid transparent',
                    borderRadius: 0,
                    textTransform: 'none',
                    '&:hover': { color: '#0f172a', bgcolor: '#f8fafc' },
                  }}
                >
                  <Stack direction="row" spacing={0.8} alignItems="center">
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <Box
                        sx={{
                          px: 0.7,
                          py: 0.1,
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          borderRadius: 0.5,
                          bgcolor: active ? '#0f172a' : '#f1f5f9',
                          color: active ? '#ffffff' : '#475569',
                          border: active ? 'none' : '1px solid #cbd5e1',
                          fontFamily: 'monospace',
                        }}
                      >
                        {tab.badge}
                      </Box>
                    )}
                  </Stack>
                </Button>
              );
            })}
          </Stack>

          {/* Right Sub-metrics Ribbon */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ display: { xs: 'none', xl: 'flex' }, py: 0.6 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontFamily: 'monospace' }}>
              CAPEX: <strong style={{ color: '#0f172a' }}>₹14.82L Cr</strong>
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ height: 12, my: 'auto', borderColor: '#cbd5e1' }} />
            <Typography
              variant="caption"
              onClick={() => navigate('/settings')}
              sx={{ color: '#b91c1c', fontSize: '0.68rem', fontFamily: 'monospace', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              title={`Flagged at ≥${thresholds.criticalDelay} days delay. Click to configure threshold.`}
            >
              CRITICAL DELAYS (≥{thresholds.criticalDelay}d): <strong>{portfolioMetrics.criticalCount}</strong>
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ height: 12, my: 'auto', borderColor: '#cbd5e1' }} />
            <Typography variant="caption" sx={{ color: '#c2410c', fontSize: '0.68rem', fontFamily: 'monospace' }}>
              AVG OVERRUN: <strong>+{portfolioMetrics.avgDelay}d</strong>
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ height: 12, my: 'auto', borderColor: '#cbd5e1' }} />
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontFamily: 'monospace' }}>
              FY 2024-25 Q3
            </Typography>
          </Stack>
        </Box>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: '1px solid #e2e8f0' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: '1px solid #e2e8f0', top: 92 },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Main Content Viewport */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2.5 },
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          mt: '94px',
          bgcolor: '#f1f5f9',
          minHeight: 'calc(100vh - 94px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
        <Box sx={{ mt: 3, pt: 1.5, pb: 1, borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
            Smart India Hackathon 2026 &bull; Problem Statement 11: Explainable AI techniques to ensure transparency in prediction results
          </Typography>
        </Box>
      </Box>

      {/* Global Command Search Modal (Ctrl+K) */}
      <CommandPaletteModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </Box>
  );
}
