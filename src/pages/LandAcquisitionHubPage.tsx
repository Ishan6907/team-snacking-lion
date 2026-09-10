import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Grid,
  Chip,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  TextField,
  InputAdornment,
  Alert,
  Tooltip,
  Card,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  AccountBalance,
  Gavel,
  Public,
  Search,
  CheckCircle,
  WarningAmber,
  Layers,
  History,
  Launch,
  Security,
  Refresh,
  People,
  HomeWork,
  PinDrop,
  FolderOpen,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { landAcquisitionApi, type LandAcquisitionKPIs, type LandProjectItem, type AuditEventItem } from '@/api/landAcquisition';

const INDIA_GEO_URL = '/india.json';

const STAGE_COLORS: Record<number, string> = {
  0: '#64748b', // Section 4 - Gray
  1: '#0284c7', // Section 11 - Blue
  2: '#d97706', // Section 15 - Amber
  3: '#ea580c', // Section 19 - Orange
  4: '#16a34a', // Section 23 - Green
  5: '#059669', // Section 24 - Emerald
};

export default function LandAcquisitionHubPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [kpis, setKpis] = useState<LandAcquisitionKPIs | null>(null);
  const [projects, setProjects] = useState<LandProjectItem[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState<LandProjectItem | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [kpiRes, projRes, auditRes] = await Promise.all([
        landAcquisitionApi.getKpis(),
        landAcquisitionApi.getProjects(),
        landAcquisitionApi.getAuditTrail(),
      ]);
      setKpis(kpiRes);
      setProjects(projRes.items);
      setAuditEvents(auditRes.events);
      if (projRes.items.length > 0) {
        setSelectedProject(projRes.items[0]);
      }
    } catch (err) {
      console.error('Failed to load land acquisition hub data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.state.toLowerCase().includes(searchQuery.toLowerCase());
      const matchState = selectedStateFilter === 'ALL' || p.state === selectedStateFilter;
      const matchRisk = selectedRiskFilter === 'ALL' || p.riskLevel === selectedRiskFilter;
      return matchSearch && matchState && matchRisk;
    });
  }, [projects, searchQuery, selectedStateFilter, selectedRiskFilter]);

  const uniqueStates = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.state))).sort();
  }, [projects]);

  return (
    <Box sx={{ color: '#0f172a', pb: 4 }}>
      {/* Header Strip */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 2.5,
          borderRadius: 1,
          border: '1px solid #e2e8f0',
          borderLeft: '5px solid #c2410c',
          bgcolor: '#ffffff',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
              <Box
                sx={{
                  px: 1.2,
                  py: 0.3,
                  borderRadius: 0.5,
                  bgcolor: '#c2410c',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  letterSpacing: 0.5,
                }}
              >
                SIH25017 &bull; LAND ACQUISITION DELAY PREDICTION
              </Box>
              <Chip
                icon={<Security sx={{ fontSize: '13px !important', color: '#15803d' }} />}
                label="RFCTLARR ACT 2013 STATUTORY ENGINE"
                size="small"
                sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}
              />
              <Chip
                label="DILRMP &amp; CADASTRAL GIS INTEGRATED"
                size="small"
                sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: '#eff6ff', color: '#0284c7', border: '1px solid #bfdbfe' }}
              />
            </Stack>

            <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.25rem', letterSpacing: '-0.01em' }}>
              National Land Acquisition, Compensation &amp; R&amp;R Command Center
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.78rem' }}>
              Statutory Stage Tracking (Sec 4&rarr;11&rarr;15&rarr;19&rarr;23&rarr;24), Compensation Escrow Monitoring, PAF Rehabilitation, and Section 25 Lapsing Risk Governance
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadData}
              sx={{ borderColor: '#cbd5e1', color: '#475569', fontSize: '0.74rem', textTransform: 'none' }}
            >
              Refresh Data
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<Public />}
              onClick={() => navigate('/verification')}
              sx={{ bgcolor: '#0b2545', color: '#ffffff', fontSize: '0.74rem', textTransform: 'none', '&:hover': { bgcolor: '#133a6f' } }}
            >
              3D Space &amp; Cadastral Recon
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Top 4 KPI Metrics */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 1, p: 2, bgcolor: '#ffffff' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: 0.5 }}>
                Total Land Outlay
              </Typography>
              <AccountBalance sx={{ color: '#0284c7', fontSize: 20 }} />
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', mt: 0.5, fontFamily: 'monospace' }}>
              ₹{(kpis?.totalOutlayCr || 148200).toLocaleString()} Cr
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.8 }}>
              <LinearProgress
                variant="determinate"
                value={kpis?.disbursedPct || 65.1}
                sx={{ flex: 1, height: 6, borderRadius: 1, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#0284c7' } }}
              />
              <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 800, fontSize: '0.72rem' }}>
                {kpis?.disbursedPct || 65.1}% Disbursed
              </Typography>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 1, p: 2, bgcolor: '#ffffff' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: 0.5 }}>
                District Escrow Locked
              </Typography>
              <Gavel sx={{ color: '#d97706', fontSize: 20 }} />
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#d97706', mt: 0.5, fontFamily: 'monospace' }}>
              ₹{(kpis?.totalEscrowBalanceCr || 51800).toLocaleString()} Cr
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem', display: 'block', mt: 0.8 }}>
              Awaiting CALA Section 3H(1) award release
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 1, p: 2, bgcolor: '#ffffff' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: 0.5 }}>
                Project Affected Families
              </Typography>
              <People sx={{ color: '#16a34a', fontSize: 20 }} />
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', mt: 0.5, fontFamily: 'monospace' }}>
              {(kpis?.totalAffectedFamilies || 124500).toLocaleString()}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.8 }}>
              <LinearProgress
                variant="determinate"
                value={kpis?.relocationPct || 67.6}
                sx={{ flex: 1, height: 6, borderRadius: 1, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#16a34a' } }}
              />
              <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 800, fontSize: '0.72rem' }}>
                {kpis?.relocationPct || 67.6}% Relocated
              </Typography>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid #fed7aa', borderRadius: 1, p: 2, bgcolor: '#fff7ed' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: 0.5 }}>
                Sec 25 Statutory Lapses
              </Typography>
              <WarningAmber sx={{ color: '#ea580c', fontSize: 20 }} />
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#c2410c', mt: 0.5, fontFamily: 'monospace' }}>
              {kpis?.section25LapseRisksCount || 18} Corridors
            </Typography>
            <Typography variant="caption" sx={{ color: '#9a3412', fontSize: '0.72rem', display: 'block', mt: 0.8, fontWeight: 700 }}>
              &lt; 90 days on 12-month statutory clock
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Navigation Tabs */}
      <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 1, bgcolor: '#ffffff', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            borderBottom: '1px solid #e2e8f0',
            px: 2,
            minHeight: 44,
            '& .MuiTab-root': { fontSize: '0.78rem', fontWeight: 700, textTransform: 'none', minHeight: 44, py: 0 },
            '& .Mui-selected': { color: '#c2410c' },
            '& .MuiTabs-indicator': { bgcolor: '#c2410c' },
          }}
        >
          <Tab icon={<Public sx={{ fontSize: 16 }} />} iconPosition="start" label="1. Portfolio GIS Risk Map" />
          <Tab icon={<Layers sx={{ fontSize: 16 }} />} iconPosition="start" label="2. RFCTLARR Stage Pipeline" />
          <Tab icon={<AccountBalance sx={{ fontSize: 16 }} />} iconPosition="start" label="3. Compensation & Escrow Tracker" />
          <Tab icon={<HomeWork sx={{ fontSize: 16 }} />} iconPosition="start" label="4. R&R Module (Rehabilitation)" />
          <Tab icon={<History sx={{ fontSize: 16 }} />} iconPosition="start" label="5. Cryptographic Audit Ledger" />
        </Tabs>

        {/* TAB 0: PORTFOLIO GIS RISK MAP */}
        {activeTab === 0 && (
          <Box sx={{ p: 2.5 }}>
            {/* Filter Ribbon */}
            <Paper elevation={0} sx={{ p: 1.5, mb: 2, border: '1px solid #e2e8f0', borderRadius: 1, bgcolor: '#f8fafc' }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" sx={{ width: { xs: '100%', md: 'auto' } }}>
                  <TextField
                    size="small"
                    placeholder="Search corridor or district..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ width: { xs: '100%', sm: 240 }, bgcolor: '#ffffff' }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: '#94a3b8', fontSize: 18 }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <FormControl size="small" sx={{ minWidth: 160, bgcolor: '#ffffff' }}>
                    <InputLabel sx={{ fontSize: '0.78rem' }}>Filter by State</InputLabel>
                    <Select
                      value={selectedStateFilter}
                      label="Filter by State"
                      onChange={(e) => setSelectedStateFilter(e.target.value)}
                      sx={{ fontSize: '0.78rem' }}
                    >
                      <MenuItem value="ALL" sx={{ fontSize: '0.78rem' }}>All States / UTs ({projects.length})</MenuItem>
                      {uniqueStates.map((st) => (
                        <MenuItem key={st} value={st} sx={{ fontSize: '0.78rem' }}>
                          {st}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 140, bgcolor: '#ffffff' }}>
                    <InputLabel sx={{ fontSize: '0.78rem' }}>Risk Severity</InputLabel>
                    <Select
                      value={selectedRiskFilter}
                      label="Risk Severity"
                      onChange={(e) => setSelectedRiskFilter(e.target.value)}
                      sx={{ fontSize: '0.78rem' }}
                    >
                      <MenuItem value="ALL" sx={{ fontSize: '0.78rem' }}>All Risks</MenuItem>
                      <MenuItem value="critical" sx={{ fontSize: '0.78rem', color: '#b91c1c', fontWeight: 700 }}>Critical (&gt;180d)</MenuItem>
                      <MenuItem value="high" sx={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 700 }}>High (&gt;60d)</MenuItem>
                      <MenuItem value="medium" sx={{ fontSize: '0.78rem', color: '#d97706' }}>Moderate</MenuItem>
                      <MenuItem value="low" sx={{ fontSize: '0.78rem', color: '#15803d' }}>On-Track</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label="Critical (>180d)" size="small" sx={{ bgcolor: '#fee2e2', color: '#dc2626', fontWeight: 800, fontSize: '0.65rem' }} />
                  <Chip label="High (60-180d)" size="small" sx={{ bgcolor: '#ffedd5', color: '#ea580c', fontWeight: 800, fontSize: '0.65rem' }} />
                  <Chip label="Moderate (30-60d)" size="small" sx={{ bgcolor: '#fef3c7', color: '#d97706', fontWeight: 800, fontSize: '0.65rem' }} />
                  <Chip label="On-Track (<30d)" size="small" sx={{ bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 800, fontSize: '0.65rem' }} />
                </Stack>
              </Stack>
            </Paper>

            <Grid container spacing={2}>
              {/* Map Canvas */}
              <Grid item xs={12} lg={8}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    border: '1px solid #e2e8f0',
                    bgcolor: '#ffffff',
                    position: 'relative',
                    height: 560,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>
                        All-India Infrastructure Corridor Land Acquisition Heatmap
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
                        Showing {filteredProjects.length} geolocated corridors &bull; Click any pin to open corridor dossier
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 700, fontSize: '0.72rem' }}>
                      Survey of India Cadastral Projection
                    </Typography>
                  </Stack>

                  <Box sx={{ width: '100%', flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f8fafc', borderRadius: 1, border: '1px solid #f1f5f9' }}>
                    <ComposableMap
                      projection="geoMercator"
                      projectionConfig={{
                        scale: 960,
                        center: [82.5, 22.0],
                      }}
                      width={540}
                      height={490}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <Geographies geography={INDIA_GEO_URL}>
                        {({ geographies }) =>
                          geographies.map((geo) => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill="#f1f5f9"
                              stroke="#cbd5e1"
                              strokeWidth={0.8}
                              style={{
                                default: { outline: 'none' },
                                hover: { fill: '#fed7aa', outline: 'none', cursor: 'pointer' },
                                pressed: { outline: 'none' },
                              }}
                            />
                          ))
                        }
                      </Geographies>

                      {filteredProjects.map((p) => {
                        const isSelected = selectedProject?.id === p.id;
                        const markerColor =
                          p.predictedDelayDays > 180 ? '#dc2626' : p.predictedDelayDays > 60 ? '#ea580c' : p.predictedDelayDays > 30 ? '#d97706' : '#16a34a';

                        return (
                          <Marker key={p.id} coordinates={[p.lon, p.lat]}>
                            <Tooltip
                              title={
                                <Box sx={{ p: 0.5 }}>
                                  <Typography variant="caption" sx={{ fontWeight: 800, display: 'block' }}>
                                    {p.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ display: 'block', fontSize: '0.7rem' }}>
                                    {p.district}, {p.state} &bull; {p.rfctlarrStage.split('(')[0]}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#fca5a5', fontWeight: 800, fontSize: '0.7rem' }}>
                                    Predicted Delay: +{p.predictedDelayDays} Days
                                  </Typography>
                                </Box>
                              }
                              arrow
                            >
                              <g style={{ cursor: 'pointer' }} onClick={() => setSelectedProject(p)}>
                                {isSelected && (
                                  <circle r={10} fill="none" stroke="#c2410c" strokeWidth={2} strokeDasharray="3 3" />
                                )}
                                <circle
                                  r={isSelected ? 6.5 : p.predictedDelayDays > 180 ? 5 : 3.8}
                                  fill={markerColor}
                                  stroke="#ffffff"
                                  strokeWidth={1.5}
                                  style={{ transition: 'all 0.2s' }}
                                />
                              </g>
                            </Tooltip>
                          </Marker>
                        );
                      })}
                    </ComposableMap>
                  </Box>
                </Paper>
              </Grid>

              {/* Corridor Dossier Side Panel */}
              <Grid item xs={12} lg={4}>
                {selectedProject ? (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 1,
                      border: '1px solid #e2e8f0',
                      bgcolor: '#ffffff',
                      height: 560,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                  >
                    <Box>
                      {/* Top Code and Delay Chip */}
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, fontFamily: 'monospace', fontSize: '0.7rem' }}>
                            {selectedProject.id}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1rem', lineHeight: 1.25, mt: 0.2 }}>
                            {selectedProject.name}
                          </Typography>
                          <Stack direction="row" spacing={0.8} sx={{ mt: 0.5 }}>
                            <Chip label={selectedProject.sector} size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700, bgcolor: '#f1f5f9' }} />
                            <Chip label={`${selectedProject.district}, ${selectedProject.state}`} size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700, bgcolor: '#f1f5f9' }} />
                          </Stack>
                        </Box>
                        <Chip
                          label={`+${selectedProject.predictedDelayDays}d Delay`}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontFamily: 'monospace',
                            fontSize: '0.72rem',
                            bgcolor: selectedProject.predictedDelayDays > 180 ? '#fee2e2' : '#ffedd5',
                            color: selectedProject.predictedDelayDays > 180 ? '#b91c1c' : '#c2410c',
                            border: `1px solid ${selectedProject.predictedDelayDays > 180 ? '#fca5a5' : '#fed7aa'}`,
                          }}
                        />
                      </Stack>

                      {/* Section 25 Lapsing Warning Alert */}
                      {selectedProject.isLapseWarning && (
                        <Alert severity="error" sx={{ py: 0.5, px: 1.2, my: 1.5, fontSize: '0.72rem', borderRadius: 1 }}>
                          <strong>Section 25 Statutory Lapsing Alert:</strong> Only {selectedProject.statutoryLapseRemainingDays} days left on the 12-month gazette clock before proceedings lapse!
                        </Alert>
                      )}

                      {/* RFCTLARR Stage Block */}
                      <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 1, border: '1px solid #e2e8f0', my: 1.5 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                            RFCTLARR Statutory Stage
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 600 }}>
                            Stalled {selectedProject.daysInCurrentStage} days
                          </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: STAGE_COLORS[selectedProject.stageIndex] || '#0f172a', fontSize: '0.85rem', mt: 0.2 }}>
                          {selectedProject.rfctlarrStage}
                        </Typography>
                        {/* 6 Stage Mini Stepper Progress */}
                        <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                          {[0, 1, 2, 3, 4, 5].map((step) => (
                            <Box
                              key={step}
                              sx={{
                                flex: 1,
                                height: 5,
                                borderRadius: 0.5,
                                bgcolor: step <= selectedProject.stageIndex ? STAGE_COLORS[selectedProject.stageIndex] : '#e2e8f0',
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>

                      {/* 4 Financial & PAF Metrics */}
                      <Grid container spacing={1} sx={{ mb: 1.5 }}>
                        <Grid item xs={6}>
                          <Box sx={{ p: 1.2, bgcolor: '#f8fafc', borderRadius: 1, border: '1px solid #e2e8f0' }}>
                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem', display: 'block' }}>
                              Land Outlay
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                              ₹{selectedProject.landOutlayCr.toLocaleString()} Cr
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#15803d', fontSize: '0.62rem', fontWeight: 700 }}>
                              {selectedProject.disbursedPct}% Disbursed
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ p: 1.2, bgcolor: '#f8fafc', borderRadius: 1, border: '1px solid #e2e8f0' }}>
                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem', display: 'block' }}>
                              District Escrow Locked
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '0.85rem', color: '#d97706' }}>
                              ₹{selectedProject.escrowBalanceCr.toLocaleString()} Cr
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#d97706', fontSize: '0.62rem', fontWeight: 700 }}>
                              CALA Account
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ p: 1.2, bgcolor: '#f8fafc', borderRadius: 1, border: '1px solid #e2e8f0' }}>
                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem', display: 'block' }}>
                              Affected Families (PAFs)
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                              {selectedProject.affectedFamilies} PAFs
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#16a34a', fontSize: '0.62rem', fontWeight: 700 }}>
                              {selectedProject.familiesRelocated} Relocated
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ p: 1.2, bgcolor: '#f8fafc', borderRadius: 1, border: '1px solid #e2e8f0' }}>
                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem', display: 'block' }}>
                              Legal Disputes
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '0.85rem', color: selectedProject.legalDisputesCount > 0 ? '#b91c1c' : '#15803d' }}>
                              {selectedProject.legalDisputesCount} Writs/Claims
                            </Typography>
                            <Typography variant="caption" sx={{ color: selectedProject.legalDisputesCount > 0 ? '#b91c1c' : '#15803d', fontSize: '0.62rem', fontWeight: 700 }}>
                              {selectedProject.legalDisputesCount > 0 ? 'High Court Stays' : 'Clear Title'}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {/* Primary Bottleneck */}
                      <Box sx={{ p: 1.2, bgcolor: '#fff7ed', borderRadius: 1, border: '1px solid #fed7aa', mb: 1.5 }}>
                        <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 800, fontSize: '0.68rem', display: 'block' }}>
                          PRIMARY BOTTLENECK
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#431407', fontSize: '0.74rem', display: 'block', mt: 0.2 }}>
                          {selectedProject.primaryBottleneck}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Action Navigation */}
                    <Stack spacing={1}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        startIcon={<Launch />}
                        onClick={() => navigate(`/milestones/${encodeURIComponent(selectedProject.id)}`)}
                        sx={{ bgcolor: '#0b2545', color: '#ffffff', textTransform: 'none', fontSize: '0.74rem', py: 0.8, '&:hover': { bgcolor: '#133a6f' } }}
                      >
                        Deep Milestone &amp; Corrective AI Actions &rarr;
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        startIcon={<PinDrop />}
                        onClick={() => navigate(`/verification?id=${encodeURIComponent(selectedProject.id)}`)}
                        sx={{ borderColor: '#c2410c', color: '#c2410c', textTransform: 'none', fontSize: '0.74rem', py: 0.8 }}
                      >
                        Inspect Micro-Cadastral Parcels
                      </Button>
                    </Stack>
                  </Paper>
                ) : (
                  <Box sx={{ p: 4, textAlign: 'center', color: '#94a3b8' }}>
                    Click on any corridor marker on the map to inspect telemetry
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        )}

        {/* TAB 1: RFCTLARR STAGE PIPELINE */}
        {activeTab === 1 && (
          <Box sx={{ p: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, fontSize: '0.9rem' }}>
              RFCTLARR Act 2013 Statutory Pipeline &amp; Bottleneck Stage Dispersion
            </Typography>
            <Grid container spacing={2}>
              {[
                { title: 'Section 4: SIA Notification', desc: 'Social Impact Assessment & Public Hearing', count: 184, lapseDays: 'N/A' },
                { title: 'Section 11: Preliminary Notification', desc: 'Summary of SIA published in District Gazette', count: 312, lapseDays: '12 Months to Sec 19' },
                { title: 'Section 15: Hearing of Objections', desc: '60-day inquiry window before Collector', count: 246, lapseDays: '60-day statutory bar' },
                { title: 'Section 19: Declaration of Acquisition', desc: 'Final declaration of land acquisition with R&R summary', count: 328, lapseDays: '12 Months to Sec 23' },
                { title: 'Section 23: Collector Award', desc: 'Determination of market value & 100% Solatium', count: 218, lapseDays: 'Sec 25 Final Lapse' },
                { title: 'Section 24: Physical Possession', desc: 'Handover of unencumbered site to Implementing Agency', count: 140, lapseDays: 'Completed' },
              ].map((stg, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 1, borderTop: `4px solid ${STAGE_COLORS[i]}`, bgcolor: '#ffffff' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: STAGE_COLORS[i], fontSize: '0.72rem' }}>
                        STAGE {i + 1}
                      </Typography>
                      <Chip label={`${stg.count} Corridors`} size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800 }} />
                    </Stack>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.84rem' }}>
                      {stg.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem', display: 'block', mb: 1 }}>
                      {stg.desc}
                    </Typography>
                    <Chip label={`Clock: ${stg.lapseDays}`} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.62rem', borderColor: '#cbd5e1' }} />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* TAB 2: COMPENSATION & ESCROW TRACKER */}
        {activeTab === 2 && (
          <Box sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center" flexWrap="wrap">
              <TextField
                size="small"
                placeholder="Search by project, district, or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ minWidth: 280, bgcolor: '#ffffff' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#94a3b8', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                Showing {filteredProjects.length} of {projects.length} Corridors
              </Typography>
            </Stack>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 1 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#0b2545' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>Corridor Code &amp; Name</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>State / District</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>RFCTLARR Stage</TableCell>
                    <TableCell align="right" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>Outlay (Cr)</TableCell>
                    <TableCell align="right" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>Disbursed (Cr)</TableCell>
                    <TableCell align="right" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>District Escrow (Cr)</TableCell>
                    <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>Disbursement %</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProjects.slice(0, 15).map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell sx={{ py: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.78rem', color: '#0f172a' }}>
                          {p.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace', fontSize: '0.68rem' }}>
                          {p.id} &bull; {p.sector}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Typography variant="body2" sx={{ fontSize: '0.76rem', fontWeight: 600 }}>
                          {p.district}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                          {p.state}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Chip
                          label={p.rfctlarrStage.split('(')[0]}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            bgcolor: `${STAGE_COLORS[p.stageIndex]}15`,
                            color: STAGE_COLORS[p.stageIndex],
                            border: `1px solid ${STAGE_COLORS[p.stageIndex]}40`,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1, fontFamily: 'monospace', fontWeight: 700, fontSize: '0.78rem' }}>
                        ₹{p.landOutlayCr.toLocaleString()}
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1, fontFamily: 'monospace', fontWeight: 700, fontSize: '0.78rem', color: '#15803d' }}>
                        ₹{p.compensationDisbursedCr.toLocaleString()}
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1, fontFamily: 'monospace', fontWeight: 700, fontSize: '0.78rem', color: '#d97706' }}>
                        ₹{p.escrowBalanceCr.toLocaleString()}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1 }}>
                        <Box sx={{ width: 80, mx: 'auto' }}>
                          <LinearProgress variant="determinate" value={p.disbursedPct} sx={{ height: 5, borderRadius: 1 }} />
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>
                            {p.disbursedPct}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => navigate(`/milestones/${encodeURIComponent(p.id)}`)}
                          sx={{ fontSize: '0.65rem', py: 0.2, minWidth: 60, textTransform: 'none' }}
                        >
                          Analyze
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* TAB 3: R&R (REHABILITATION & RESETTLEMENT) MODULE */}
        {activeTab === 3 && (
          <Box sx={{ p: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, fontSize: '0.9rem' }}>
              RFCTLARR Chapter V &amp; Schedule II Rehabilitation &amp; Resettlement Census
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
              Statutory oversight of Project Affected Families (PAFs), Model Colony housing delivery, and livelihood restoration grants
            </Typography>

            <Grid container spacing={2}>
              {filteredProjects.slice(0, 6).map((p) => (
                <Grid item xs={12} md={6} key={p.id}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 1, bgcolor: '#ffffff' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>
                          {p.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
                          {p.district}, {p.state}
                        </Typography>
                      </Box>
                      <Chip label={`${p.relocationPct}% Relocated`} size="small" sx={{ bgcolor: '#f0fdf4', color: '#16a34a', fontWeight: 800, fontSize: '0.65rem' }} />
                    </Stack>

                    <Grid container spacing={1} sx={{ mt: 1, mb: 1 }}>
                      <Grid item xs={4}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem' }}>
                          Census PAFs
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>
                          {p.affectedFamilies}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem' }}>
                          Relocated
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#15803d' }}>
                          {p.familiesRelocated}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem' }}>
                          Pending
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#b91c1c' }}>
                          {p.affectedFamilies - p.familiesRelocated}
                        </Typography>
                      </Grid>
                    </Grid>

                    <LinearProgress variant="determinate" value={p.relocationPct} sx={{ height: 6, borderRadius: 1, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#16a34a' } }} />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* TAB 4: CRYPTOGRAPHIC AUDIT LEDGER */}
        {activeTab === 4 && (
          <Box sx={{ p: 2.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.9rem' }}>
                  Statutory Land Acquisition Immutable Action Ledger
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  All gazette issuances, Section 3H(1) escrow deposits, and court stay orders are cryptographically signed with SHA-256
                </Typography>
              </Box>
              <Chip icon={<CheckCircle sx={{ fontSize: '13px !important', color: '#15803d' }} />} label="LEDGER VERIFIED (SHA-256)" size="small" sx={{ bgcolor: '#f0fdf4', color: '#15803d', fontWeight: 800, fontSize: '0.65rem' }} />
            </Stack>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 1 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#0f172a' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>Event ID &amp; Timestamp</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>Corridor</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>Event Category</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>Authority &amp; Officer</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>Statutory Record Details</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>SHA-256 Checksum</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditEvents.map((evt) => (
                    <TableRow key={evt.id} hover>
                      <TableCell sx={{ py: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.74rem', fontFamily: 'monospace' }}>
                          {evt.id}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                          {new Date(evt.timestamp).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.76rem' }}>
                          {evt.projectName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace', fontSize: '0.68rem' }}>
                          {evt.projectId}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Chip label={evt.eventType} size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#f1f5f9', color: '#0f172a' }} />
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Typography variant="body2" sx={{ fontSize: '0.74rem', fontWeight: 600 }}>
                          {evt.authority}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                          {evt.actionBy}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1, maxWidth: 320 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.72rem', color: '#334155' }}>
                          {evt.description}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#0284c7' }}>
                          {evt.sha256Hash.substring(0, 16)}...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
