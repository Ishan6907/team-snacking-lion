import { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Chip,
  Button,
  Breadcrumbs,
  Link as MuiLink,
  Autocomplete,
  TextField,
} from '@mui/material';
import {
  WarningAmber,
  CameraAlt,
  Public,
} from '@mui/icons-material';
import { Link, useSearchParams, useParams, useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import CabinetEscalationDialog from '@/components/common/CabinetEscalationDialog';
import LiquidatedDamagesDialog from '@/components/common/LiquidatedDamagesDialog';
import InterAgencySummitDialog from '@/components/common/InterAgencySummitDialog';
import { ALL_1428_PROJECTS, ProjectRow } from '@/data/inventoryData';

export default function MilestoneAnalysisPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams<{ projectId?: string }>();
  const navigate = useNavigate();

  // Dialog states
  const [escalationNoticeSent, setEscalationNoticeSent] = useState(false);
  const [cabinetModalOpen, setCabinetModalOpen] = useState(false);
  const [ldModalOpen, setLdModalOpen] = useState(false);
  const [summitModalOpen, setSummitModalOpen] = useState(false);

  // Active Project ID from URL query or route param (fallback to Delhi-Mumbai)
  const activeProjectId = searchParams.get('id') || params.projectId || 'NHAI-DEL-MUM-P4';

  const project = useMemo<ProjectRow>(() => {
    return ALL_1428_PROJECTS.find((p) => p.id === activeProjectId) || ALL_1428_PROJECTS[0];
  }, [activeProjectId]);

  const handleSwitchProject = (newId: string) => {
    setSearchParams({ id: newId });
    setEscalationNoticeSent(false);
  };

  // Dynamically calculate disbursed CapEx
  const capexDisbursed = useMemo(() => {
    return Math.round(project.outlayCr * (project.actualPct / 100) * 10) / 10;
  }, [project]);

  // Sector-specific Execution Velocity Metric
  const velocityMetric = useMemo(() => {
    switch (project.sector) {
      case 'Railways':
        return {
          title: 'TRACK LAYING PACE',
          current: `${(project.actualPct * 0.04).toFixed(1)} km/wk`,
          required: '3.8 km/wk',
          desc: 'Ballast & Continuous Welded Rail',
        };
      case 'Power':
        return {
          title: 'TOWER ERECTION PACE',
          current: `${Math.round(project.actualPct * 0.35)} towers/mo`,
          required: '42 towers/mo',
          desc: 'High-Tension Stringing Uptime: 62%',
        };
      case 'Water':
        return {
          title: 'PIPE LAYING PACE',
          current: `${(project.actualPct * 0.06).toFixed(1)} km/wk`,
          required: '7.5 km/wk',
          desc: 'Trenching & Hydrotesting Rate: 58%',
        };
      case 'Urban Development':
        return {
          title: 'GIRDER LAUNCHING',
          current: `${Math.round(project.actualPct * 0.15)} spans/mo`,
          required: '18 spans/mo',
          desc: 'Segmental Viaduct Crane Availability: 60%',
        };
      case 'Highways':
      default:
        return {
          title: 'PQC PAVING RATE',
          current: `${Math.round(project.actualPct * 7.2)} m/d`,
          required: '850 m/d',
          desc: 'Paver Fleet Availability: 54%',
        };
    }
  }, [project]);

  // Sector-specific Milestone Progression
  const milestones = useMemo(() => {
    const p = project.actualPct;
    if (project.sector === 'Railways') {
      return [
        { name: 'M1: Track Formation & Earthwork', status: p >= 30 ? 'Done' : 'In Progress', target: '25% Target (Formation ready)', isDone: p >= 30, isStall: false },
        { name: 'M2: Rail Flyovers & Major Bridges', status: p >= 60 ? 'Done' : p >= 30 ? 'In Progress' : 'Pending', target: '50% Target (Structural span)', isDone: p >= 60, isStall: false },
        { name: 'M3: Track Laying & Ballasting', status: p < 75 && project.predictedDelayDays > 30 ? 'CRITICAL STALL' : p >= 75 ? 'Done' : 'Active', target: `75% Target (+${Math.round(project.predictedDelayDays * 0.65)}d delay)`, isDone: p >= 75, isStall: p < 75 && project.predictedDelayDays > 30 },
        { name: 'M4: 25kV OHE & Signalling COD', status: `+${project.predictedDelayDays}d Risk`, target: '100% Commissioned', isDone: false, isStall: false, isRisk: true },
      ];
    }
    if (project.sector === 'Water') {
      return [
        { name: 'M1: Raw Water Intake Works', status: p >= 30 ? 'Done' : 'In Progress', target: '25% Target (River Intake well)', isDone: p >= 30, isStall: false },
        { name: 'M2: Water Treatment Plant (WTP)', status: p >= 55 ? 'Done' : p >= 30 ? 'In Progress' : 'Pending', target: '50% Target (Civil structures)', isDone: p >= 55, isStall: false },
        { name: 'M3: Feeder Pipeline Trunk Route', status: p < 70 && project.predictedDelayDays > 30 ? 'CRITICAL STALL' : p >= 70 ? 'Done' : 'Active', target: `70% Target (+${Math.round(project.predictedDelayDays * 0.7)}d bottleneck)`, isDone: p >= 70, isStall: p < 70 && project.predictedDelayDays > 30 },
        { name: 'M4: FHTC Tap Commissioning', status: `+${project.predictedDelayDays}d Risk`, target: '100% Flow Certified', isDone: false, isStall: false, isRisk: true },
      ];
    }
    if (project.sector === 'Power') {
      return [
        { name: 'M1: Tower Foundation Piling', status: p >= 30 ? 'Done' : 'In Progress', target: '30% Target (Stubs cast)', isDone: p >= 30, isStall: false },
        { name: 'M2: High-Tension Tower Erection', status: p >= 65 ? 'Done' : p >= 30 ? 'In Progress' : 'Pending', target: '65% Target (Lattice assembled)', isDone: p >= 65, isStall: false },
        { name: 'M3: Conductor Stringing & OPGW', status: p < 85 && project.predictedDelayDays > 30 ? 'CRITICAL STALL' : p >= 85 ? 'Done' : 'Active', target: `85% Target (+${Math.round(project.predictedDelayDays * 0.75)}d delay)`, isDone: p >= 85, isStall: p < 85 && project.predictedDelayDays > 30 },
        { name: 'M4: 800kV Substation Energization', status: `+${project.predictedDelayDays}d Risk`, target: '100% Grid Charged', isDone: false, isStall: false, isRisk: true },
      ];
    }
    // Default Highways
    return [
      { name: 'M1: Earthwork & GSB', status: p >= 25 ? 'Done' : 'In Progress', target: '20% Target (+12d slip absorbed)', isDone: p >= 25, isStall: false },
      { name: 'M2: Major Bridges & Structures', status: p >= 50 ? 'Done' : p >= 25 ? 'In Progress' : 'Pending', target: '40% Target (+38d delay approved)', isDone: p >= 50, isStall: false },
      { name: 'M3: PQC Paving Head', status: p < 75 && project.predictedDelayDays > 30 ? 'CRITICAL STALL' : p >= 75 ? 'Done' : 'Active', target: `70% Target (+${Math.round(project.predictedDelayDays * 0.65)}d bottleneck)`, isDone: p >= 75, isStall: p < 75 && project.predictedDelayDays > 30 },
      { name: 'M4: Final Toll COD', status: `+${project.predictedDelayDays}d Risk`, target: '100% Toll Ready', isDone: false, isStall: false, isRisk: true },
    ];
  }, [project]);

  // Dynamic S-Curve Data
  const scurveData = useMemo(() => {
    const act = project.actualPct;
    const plan = project.plannedPct;
    return [
      { stage: 'Q1 23 (Appointed)', planned: 5, actual: 5, forecast: 5 },
      { stage: 'Q2 23', planned: 18, actual: 16, forecast: 16 },
      { stage: 'Q3 23 (M1)', planned: 32, actual: Math.min(act, 28), forecast: Math.min(act, 28) },
      { stage: 'Q4 23', planned: 46, actual: Math.min(act, 40), forecast: Math.min(act, 40) },
      { stage: 'Q1 24 (M2)', planned: 60, actual: Math.min(act, 50), forecast: Math.min(act, 50) },
      { stage: 'Q2 24', planned: 72, actual: Math.min(act, 56), forecast: Math.min(act, 56) },
      { stage: 'Q3 24 (Today)', planned: plan, actual: act, forecast: act },
      { stage: 'Q4 24 (Planned COD)', planned: 100, actual: null, forecast: Math.min(92, act + 18) },
      { stage: 'Q1 25', planned: 100, actual: null, forecast: Math.min(98, act + 32) },
      { stage: 'Q2 25 (Forecast COD)', planned: 100, actual: null, forecast: 100 },
    ];
  }, [project]);

  // Dynamic SHAP Root-Cause Decompositions
  const shapFactors = useMemo(() => {
    const slip = project.predictedDelayDays || 12;
    const f1Days = Math.round(slip * 0.46);
    const f2Days = Math.round(slip * 0.31);
    const f3Days = Math.max(1, slip - f1Days - f2Days);

    return [
      {
        rank: '#1 ROOT FACTOR',
        name: project.criticalBlocker,
        days: `+${f1Days} Days`,
        attribution: '46% Attribution',
        weight: '0.462',
        color: '#be123c',
        desc: `Critical path statutory or right-of-way impedance: "${project.criticalBlocker}" across chainage ${project.chainage} in ${project.state}. Precluding full construction mobilization.`,
      },
      {
        rank: '#2 FACTOR',
        name: `Geotechnical & Regional Monsoonal Inundation (${project.state})`,
        days: `+${f2Days} Days`,
        attribution: '31% Attribution',
        weight: '0.314',
        color: '#1d4ed8',
        desc: `Excess precipitation and subsurface water table saturation recorded across project footprint in ${project.state}. Sub-grade earthworks restricted; supply chain haul routes affected.`,
      },
      {
        rank: '#3 FACTOR',
        name: `Contractor Specialized Machinery Deficit (${project.contractor})`,
        days: `+${f3Days} Days`,
        attribution: '23% Attribution',
        weight: '0.224',
        color: '#475569',
        desc: `${project.contractor} plant uptime and heavy machinery mobilization pacing below required milestone baseline for ${project.name}.`,
      },
    ];
  }, [project]);

  // Dynamic Statutory Approvals
  const statutoryApprovals = useMemo(() => {
    return [
      { name: project.criticalBlocker, status: 'BLOCKED', color: '#b91c1c', desc: `Pending statutory clearance with State / Central authorities in ${project.state}` },
      { name: 'Eco-Sensitive Zone & Wildlife NOC', status: 'CLEARED', color: '#15803d', desc: 'NBWL & State Wildlife Board clearance confirmed' },
      { name: `Right-of-Way Land Gazette 3(A)/3(D)`, status: project.criticalBlocker.toLowerCase().includes('land') ? 'BLOCKED' : 'UNDER REVIEW', color: project.criticalBlocker.toLowerCase().includes('land') ? '#b91c1c' : '#0284c7', desc: `CALA valuation & possession ongoing across ${project.chainage}` },
      { name: 'Power Line & Utility Shifting NOC', status: 'COMPLETED', color: '#15803d', desc: 'Discom & Transmission line relocation certified on site' },
    ];
  }, [project]);

  return (
    <Box sx={{ color: '#0f172a', pb: 4 }}>
      {/* Top Breadcrumbs & Model Badge Strip */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} sx={{ mb: 1.5 }}>
        <Breadcrumbs sx={{ '& .MuiBreadcrumbs-separator': { color: '#94a3b8' } }}>
          <MuiLink component={Link} to="/inventory" underline="hover" sx={{ color: '#64748b', fontSize: '0.74rem', fontWeight: 600 }}>
            National Inventory
          </MuiLink>
          <Typography sx={{ color: '#64748b', fontSize: '0.74rem', fontWeight: 600 }}>
            {project.sector} &bull; {project.state}
          </Typography>
          <Typography sx={{ color: '#0f172a', fontSize: '0.74rem', fontWeight: 800, fontFamily: 'monospace' }}>
            {project.id}
          </Typography>
        </Breadcrumbs>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Button
            size="small"
            variant="outlined"
            startIcon={<Public fontSize="small" />}
            onClick={() => navigate(`/verification?id=${encodeURIComponent(project.id)}`)}
            sx={{
              borderColor: '#0284c7',
              color: '#0284c7',
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'none',
              py: 0.3,
            }}
          >
            🌌 View 3D Space Recon &amp; GIS
          </Button>
          <Chip
            label="● ML Live Model v4.28 [SHAP Inference Active] • NIC-GIS Synced"
            size="small"
            sx={{
              height: 20,
              fontSize: '0.62rem',
              fontWeight: 800,
              bgcolor: '#f1f5f9',
              color: '#0284c7',
              border: '1px solid #cbd5e1',
              fontFamily: 'monospace',
            }}
          />
        </Stack>
      </Stack>

      {/* Main Dossier Header Banner with Quick Package Switcher */}
      <Paper
        elevation={0}
        sx={{
          p: 2.2,
          mb: 2,
          borderRadius: 1,
          border: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={7.5}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.6, flexWrap: 'wrap', gap: 0.5 }}>
              <Chip label={`${project.agency} • ${project.contractMode}`} size="small" sx={{ height: 20, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#0f172a', color: '#ffffff' }} />
              <Chip label={project.chainage} size="small" sx={{ height: 20, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', fontFamily: 'monospace' }} />
              <Chip label={`${project.state} Jurisdiction`} size="small" sx={{ height: 20, fontSize: '0.62rem', fontWeight: 700, bgcolor: '#eff6ff', color: '#1d4ed8' }} />
            </Stack>

            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.25rem', lineHeight: 1.2, mb: 0.8 }}>
              {project.name}
            </Typography>

            <Stack direction="row" spacing={2.5} flexWrap="wrap" sx={{ color: '#64748b', fontSize: '0.74rem' }}>
              <Typography variant="caption" sx={{ fontSize: '0.74rem' }}>
                EPC Contractor: <strong style={{ color: '#0f172a' }}>{project.contractor}</strong>
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.74rem' }}>
                Sanctioned: <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>₹{project.outlayCr.toLocaleString('en-IN')}.00 Cr</strong>
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.74rem' }}>
                Forecast Variance: <strong style={{ color: project.predictedDelayDays >= 90 ? '#b91c1c' : '#d97706' }}>+{project.predictedDelayDays} Days</strong>
              </Typography>
            </Stack>
          </Grid>

          {/* Right Action & Quick Switcher Box */}
          <Grid item xs={12} md={4.5}>
            <Box
              sx={{
                p: 1.8,
                bgcolor: project.predictedDelayDays >= 90 ? '#fff1f2' : '#fffbeb',
                border: project.predictedDelayDays >= 90 ? '1px solid #fecdd3' : '1px solid #fde68a',
                borderLeft: project.predictedDelayDays >= 90 ? '4px solid #be123c' : '4px solid #d97706',
                borderRadius: 1,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <WarningAmber sx={{ fontSize: 18, color: project.predictedDelayDays >= 90 ? '#be123c' : '#d97706' }} />
                  <Typography variant="caption" sx={{ fontWeight: 900, color: project.predictedDelayDays >= 90 ? '#be123c' : '#d97706', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.5 }}>
                    {project.riskSeverity.toUpperCase()} DELAY PROJECTED
                  </Typography>
                </Stack>
              </Stack>

              <Typography variant="body2" sx={{ fontWeight: 800, color: project.predictedDelayDays >= 90 ? '#9f1239' : '#92400e', fontSize: '0.85rem', mb: 1 }}>
                +{project.predictedDelayDays} Days &bull; Confidence {project.confidencePct}% (Level 4 Escalation)
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setCabinetModalOpen(true)}
                  sx={{
                    bgcolor: '#ffffff',
                    borderColor: '#fecdd3',
                    color: '#9f1239',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    textTransform: 'none',
                    py: 0.4,
                  }}
                >
                  Cabinet Notice
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => {
                    setEscalationNoticeSent(true);
                    setLdModalOpen(true);
                  }}
                  sx={{
                    bgcolor: '#be123c',
                    color: '#ffffff',
                    '&:hover': { bgcolor: '#9f1239' },
                    fontWeight: 800,
                    fontSize: '0.7rem',
                    textTransform: 'none',
                    py: 0.4,
                  }}
                >
                  {escalationNoticeSent ? 'Notice Dispatched' : 'Invoke Cl. 27 Damages'}
                </Button>
              </Stack>

              {/* Searchable Autocomplete Project Switcher across all 1,428 packages */}
              <Autocomplete
                size="small"
                fullWidth
                options={ALL_1428_PROJECTS}
                value={project}
                onChange={(_, newValue) => {
                  if (newValue) {
                    handleSwitchProject(newValue.id);
                  }
                }}
                getOptionLabel={(option) => `${option.id} - ${option.name} (${option.state})`}
                filterOptions={(options, { inputValue }) => {
                  const q = inputValue.toLowerCase().trim();
                  if (!q) return options.slice(0, 50);
                  return options
                    .filter(
                      (p) =>
                        p.id.toLowerCase().includes(q) ||
                        p.name.toLowerCase().includes(q) ||
                        p.state.toLowerCase().includes(q) ||
                        p.contractor.toLowerCase().includes(q) ||
                        (p.agency && p.agency.toLowerCase().includes(q))
                    )
                    .slice(0, 50);
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.id} style={{ fontSize: '0.72rem', padding: '5px 8px' }}>
                    <Box sx={{ width: '100%' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '0.72rem', color: '#0f172a' }}>
                          {option.id}
                        </Typography>
                        <Chip label={option.state} size="small" sx={{ height: 16, fontSize: '0.58rem', fontWeight: 700 }} />
                      </Stack>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {option.name}
                      </Typography>
                    </Box>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search Highway Code..."
                    sx={{
                      '& .MuiInputBase-root': {
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        bgcolor: '#ffffff',
                        height: 32,
                      },
                    }}
                  />
                )}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 4 Metric Highlights Cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6} sm={3}>
          <Paper elevation={0} sx={{ p: 1.8, borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase' }}>
              PLANNED WORK
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', fontFamily: 'monospace', fontSize: '1.35rem', my: 0.3 }}>
              {project.plannedPct.toFixed(1)}%
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
              Baseline DPR Schedule
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Paper elevation={0} sx={{ p: 1.8, borderRadius: 1, border: '1px solid #fecdd3', bgcolor: '#fff1f2' }}>
            <Typography variant="caption" sx={{ color: '#9f1239', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase' }}>
              ACTUAL WORK
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#9f1239', fontFamily: 'monospace', fontSize: '1.35rem', my: 0.3 }}>
              {project.actualPct.toFixed(1)}% <span style={{ fontSize: '0.85rem', color: '#be123c' }}>{project.progressDiffLabel}</span>
            </Typography>
            <Typography variant="caption" sx={{ color: '#9f1239', fontSize: '0.68rem' }}>
              Physical Audit ({project.agency})
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Paper elevation={0} sx={{ p: 1.8, borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase' }}>
              CAPEX DISBURSED
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', fontFamily: 'monospace', fontSize: '1.35rem', my: 0.3 }}>
              ₹{capexDisbursed.toLocaleString('en-IN')} Cr
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
              {project.actualPct}% of ₹{project.outlayCr} Cr Outlay
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Paper elevation={0} sx={{ p: 1.8, borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase' }}>
              {velocityMetric.title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#c2410c', fontFamily: 'monospace', fontSize: '1.35rem', my: 0.3 }}>
              {velocityMetric.current} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Req: {velocityMetric.required}</span>
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
              {velocityMetric.desc}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Analysis Workspace */}
      <Grid container spacing={2}>
        {/* Left 8 Columns: Linear S-Curve + Milestone Cards + SHAP Attribution */}
        <Grid item xs={12} lg={8}>
          {/* Linear Physical Progress S-Curve */}
          <Paper elevation={0} sx={{ p: 2.5, mb: 2, borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>
              Linear Physical Progress S-Curve
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem', display: 'block', mb: 1 }}>
              Cumulative Planned vs. Verified Progress &amp; Monte-Carlo Projection for {project.name}
            </Typography>

            <Box sx={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scurveData} margin={{ top: 10, right: 20, bottom: 5, left: -15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="stage" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 10 }} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      borderRadius: 4,
                      fontSize: 12,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '0.74rem', fontWeight: 600 }} />
                  <Line type="monotone" dataKey="planned" name="Planned DPR" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="actual" name="Actual Execution" stroke="#0284c7" strokeWidth={2.8} dot={{ r: 3.5, fill: '#0284c7' }} connectNulls={false} />
                  <Line type="monotone" dataKey="forecast" name="ML Forecast Slips" stroke="#ef4444" strokeDasharray="3 3" strokeWidth={2} dot={{ r: 3.5, fill: '#ef4444' }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>

            {/* 4 Milestone Progression Cards Below S-Curve */}
            <Grid container spacing={1.5} sx={{ mt: 1 }}>
              {milestones.map((m, idx) => (
                <Grid item xs={6} sm={3} key={idx}>
                  <Box
                    sx={{
                      p: 1.2,
                      bgcolor: m.isDone ? '#f0fdf4' : m.isStall ? '#fef2f2' : m.isRisk ? '#fff1f2' : '#f8fafc',
                      border: m.isStall ? '2px solid #ef4444' : m.isDone ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                      borderRadius: 0.8,
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" sx={{ fontWeight: 800, color: m.isStall ? '#b91c1c' : '#0f172a', fontSize: '0.72rem' }}>
                        {m.name.slice(0, 18)}...
                      </Typography>
                      <Chip
                        label={m.status}
                        size="small"
                        sx={{
                          height: 16,
                          fontSize: '0.55rem',
                          fontWeight: 800,
                          bgcolor: m.isDone ? '#dcfce7' : m.isStall ? '#b91c1c' : '#be123c',
                          color: m.isDone ? '#15803d' : '#ffffff',
                        }}
                      />
                    </Stack>
                    <Typography variant="caption" sx={{ color: m.isDone ? '#15803d' : m.isStall ? '#b91c1c' : '#64748b', fontSize: '0.68rem', display: 'block', mt: 0.2 }}>
                      {m.target}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Predictive Root-Cause Attribution Engine */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>
                  Predictive Root-Cause Attribution Engine
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
                  SHAP Value decomposition of +{project.predictedDelayDays} days projected slippage for {project.id}
                </Typography>
              </Box>

              <Chip
                label="Algorithm: XGBoost-Regressor v4.28 | R² = 0.914"
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  bgcolor: '#f1f5f9',
                  color: '#0f172a',
                  fontFamily: 'monospace',
                  border: '1px solid #cbd5e1',
                }}
              />
            </Stack>

            <Stack spacing={2} sx={{ mt: 2 }}>
              {shapFactors.map((factor, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1.5,
                    bgcolor: idx === 0 ? '#fff1f2' : idx === 1 ? '#eff6ff' : '#f8fafc',
                    border: idx === 0 ? '1px solid #fecdd3' : idx === 1 ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                    borderRadius: 1,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label={factor.rank} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800, bgcolor: factor.color, color: '#ffffff' }} />
                      <Typography variant="body2" sx={{ fontWeight: 800, color: factor.color, fontSize: '0.82rem' }}>
                        {factor.name}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label={factor.days} size="small" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 800, bgcolor: factor.color, color: '#ffffff' }} />
                      <Chip label={factor.attribution} size="small" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 800, bgcolor: '#ffffff', color: factor.color, border: `1px solid ${factor.color}` }} />
                    </Stack>
                  </Stack>
                  <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.74rem', display: 'block', lineHeight: 1.45, mb: 1 }}>
                    {factor.desc}
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box sx={{ width: '80%', height: 6, bgcolor: '#f1f5f9', borderRadius: 1, overflow: 'hidden' }}>
                      <Box sx={{ width: factor.attribution.split('%')[0] + '%', height: '100%', bgcolor: factor.color }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace', fontSize: '0.68rem' }}>
                      Weight: {factor.weight}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Right 4 Columns: Approvals Matrix + Field Drone Orthomosaic + Escalation Directory */}
        <Grid item xs={12} lg={4}>
          {/* Statutory Approvals Matrix */}
          <Paper elevation={0} sx={{ p: 2.2, mb: 2, borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.82rem' }}>
                Statutory Approvals Matrix
              </Typography>
              <Chip label="1 Critical Block" size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800, bgcolor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }} />
            </Stack>

            <Stack spacing={1.5}>
              {statutoryApprovals.map((app, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1.2,
                    bgcolor: app.status === 'BLOCKED' ? '#fff1f2' : '#f8fafc',
                    border: app.status === 'BLOCKED' ? '1px solid #fecdd3' : '1px solid #e2e8f0',
                    borderRadius: 0.8,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" sx={{ fontWeight: 800, color: app.color, fontSize: '0.74rem' }}>
                      ● {app.name.slice(0, 32)}
                    </Typography>
                    <Chip
                      label={app.status}
                      size="small"
                      sx={{
                        height: 16,
                        fontSize: '0.55rem',
                        fontWeight: 900,
                        bgcolor: app.status === 'BLOCKED' ? '#b91c1c' : app.status === 'CLEARED' || app.status === 'COMPLETED' ? '#dcfce7' : '#eff6ff',
                        color: app.status === 'BLOCKED' ? '#ffffff' : app.status === 'CLEARED' || app.status === 'COMPLETED' ? '#15803d' : '#0284c7',
                      }}
                    />
                  </Stack>
                  <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.68rem', display: 'block', mt: 0.3 }}>
                    {app.desc}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* Field Drone Orthomosaic Card */}
          <Paper elevation={0} sx={{ p: 2.2, mb: 2, borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CameraAlt sx={{ fontSize: 16, color: '#0f172a' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.82rem' }}>
                  Field Drone &amp; Satellite Orthomosaic
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontFamily: 'monospace' }}>
                Synced: Today
              </Typography>
            </Stack>

            <Box
              sx={{
                width: '100%',
                height: 150,
                borderRadius: 1,
                bgcolor: '#0f172a',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                border: '1px solid #334155',
              }}
            >
              <Box sx={{ position: 'absolute', width: '100%', height: 40, bgcolor: '#334155', transform: 'rotate(-8deg)' }}>
                <Box sx={{ width: '100%', height: 2, borderTop: '2px dashed #94a3b8', mt: 2.3 }} />
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  top: 35,
                  left: '45%',
                  width: 90,
                  height: 48,
                  border: '2px solid #ef4444',
                  bgcolor: 'rgba(239, 68, 68, 0.2)',
                  borderRadius: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                }}
              >
                <Typography variant="caption" sx={{ color: '#ffffff', fontWeight: 900, fontSize: '0.55rem', bgcolor: '#be123c', px: 0.5, py: 0.1 }}>
                  CRITICAL ZONE
                </Typography>
              </Box>

              <Box sx={{ position: 'absolute', bottom: 8, left: 8, right: 8, p: 0.8, bgcolor: 'rgba(15,23,42,0.85)', borderRadius: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.65rem' }}>
                  {project.chainage} Workface
                </Typography>
                <Chip label="Telemetry Active" size="small" sx={{ height: 16, fontSize: '0.55rem', fontWeight: 800, bgcolor: '#0284c7', color: '#ffffff' }} />
              </Box>
            </Box>

            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#64748b', fontSize: '0.68rem', fontFamily: 'monospace' }}>
              Corridor: {project.name} &bull; {project.state}
            </Typography>
          </Paper>

          {/* Escalation Directory */}
          <Paper elevation={0} sx={{ p: 2.2, borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.82rem' }}>
                Escalation Directory
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                {project.agency} Nodal Command
              </Typography>
            </Stack>

            <Stack spacing={1.5}>
              <Box sx={{ p: 1.2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 0.8 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.74rem', display: 'block' }}>
                  Shri Arvind Patel, GM (Tech)
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                  Project Director &bull; {project.agency} PIU {project.state}
                </Typography>
              </Box>

              <Box sx={{ p: 1.2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 0.8 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.74rem', display: 'block' }}>
                  Independent Engineer (Authority)
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                  {project.ministry} Quality Assurance Cell
                </Typography>
              </Box>

              <Box sx={{ p: 1.2, bgcolor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 0.8 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#9f1239', fontSize: '0.74rem' }}>
                    Contractor Operations Head
                  </Typography>
                  <Chip label="NOTICE SERVED" size="small" sx={{ height: 16, fontSize: '0.55rem', fontWeight: 800, bgcolor: '#be123c', color: '#ffffff' }} />
                </Stack>
                <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.68rem', display: 'block' }}>
                  {project.contractor}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="small"
                onClick={() => setSummitModalOpen(true)}
                sx={{
                  bgcolor: '#0f172a',
                  color: '#ffffff',
                  '&:hover': { bgcolor: '#1e293b' },
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  textTransform: 'none',
                  py: 0.8,
                }}
              >
                Initiate {project.agency} Inter-Agency Summit
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Interactive Sovereign Action Dialogs */}
      <CabinetEscalationDialog
        open={cabinetModalOpen}
        onClose={() => setCabinetModalOpen(false)}
        projectCode={project.id}
        projectName={project.name}
        outlayCr={project.outlayCr}
        slipDays={project.predictedDelayDays}
        primaryBlocker={project.criticalBlocker}
      />

      <LiquidatedDamagesDialog
        open={ldModalOpen}
        onClose={() => setLdModalOpen(false)}
        projectCode={project.id}
        projectName={project.name}
        contractor={project.contractor}
        outlayCr={project.outlayCr}
        slipDays={project.predictedDelayDays}
      />

      <InterAgencySummitDialog
        open={summitModalOpen}
        onClose={() => setSummitModalOpen(false)}
        projectCode={project.id}
        projectName={project.name}
      />
    </Box>
  );
}
