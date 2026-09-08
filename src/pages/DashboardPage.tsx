import { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  WarningAmber,
  PictureAsPdf,
  FilterList,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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
import ExecutiveCabinetBriefModal from '@/components/common/ExecutiveCabinetBriefModal';
import { useRiskThresholds, calculatePortfolioMetrics } from '@/utils/thresholds';
import { ALL_1428_PROJECTS } from '@/data/inventoryData';

// Cumulative CapEx S-Curve Data (FY 2024-25 in Lakh Crores)
const S_CURVE_DATA = [
  { month: 'Apr 24', plannedDPR: 1.2, actualOutlay: 1.15, mlForecast: 1.15 },
  { month: 'May 24', plannedDPR: 2.5, actualOutlay: 2.3, mlForecast: 2.3 },
  { month: 'Jun 24', plannedDPR: 3.9, actualOutlay: 3.5, mlForecast: 3.5 },
  { month: 'Jul 24', plannedDPR: 5.4, actualOutlay: 4.8, mlForecast: 4.8 },
  { month: 'Aug 24', plannedDPR: 7.1, actualOutlay: 6.1, mlForecast: 6.1 },
  { month: 'Sep 24', plannedDPR: 8.8, actualOutlay: 7.3, mlForecast: 7.2 },
  { month: 'Oct 24', plannedDPR: 10.35, actualOutlay: 8.48, mlForecast: 8.48 },
  { month: 'Nov 24', plannedDPR: 11.8, actualOutlay: null, mlForecast: 9.6 },
  { month: 'Dec 24', plannedDPR: 13.2, actualOutlay: null, mlForecast: 10.8 },
  { month: 'Jan 25', plannedDPR: 14.82, actualOutlay: null, mlForecast: 12.1 },
  { month: 'Feb 25', plannedDPR: 14.82, actualOutlay: null, mlForecast: 13.1 },
  { month: 'Mar 25', plannedDPR: 14.82, actualOutlay: null, mlForecast: 14.1 },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [sectorFilter, setSectorFilter] = useState('All 6 Priority Sectors');
  const [briefModalOpen, setBriefModalOpen] = useState(false);

  const thresholds = useRiskThresholds();
  const riskMetrics = useMemo(() => {
    return calculatePortfolioMetrics(ALL_1428_PROJECTS, thresholds);
  }, [thresholds]);

  return (
    <Box sx={{ color: '#0f172a' }}>
      {/* Sovereign Header Monitor Banner */}
      <Box sx={{ mb: 2.5 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1.5}>
          <Box>
            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 0.4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: -0.5 }}>
                Executive Portfolio Overview
              </Typography>
              <Chip
                label="● LIVE PM-GATISHAKTI TELEMETRY"
                size="small"
                sx={{
                  bgcolor: '#dcfce7',
                  color: '#15803d',
                  fontWeight: 800,
                  fontSize: '0.65rem',
                  letterSpacing: 0.5,
                  borderRadius: '3px',
                  height: 20,
                }}
              />
            </Stack>
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>
              National Infrastructure Pipeline (NIP) Monitored Book • 1,428 Mega Projects (&gt;₹500 Cr)
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              size="small"
              variant="outlined"
              startIcon={<FilterList fontSize="small" />}
              onClick={() => setSectorFilter(prev => prev === 'All 6 Priority Sectors' ? 'Highways Only' : 'All 6 Priority Sectors')}
              sx={{
                borderColor: '#cbd5e1',
                color: '#334155',
                bgcolor: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'none',
                py: 0.5,
              }}
            >
              FY 2024-25 Q3 (Oct-Dec) &bull; {sectorFilter}
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<PictureAsPdf fontSize="small" />}
              onClick={() => setBriefModalOpen(true)}
              sx={{
                bgcolor: '#0f172a',
                color: '#ffffff',
                '&:hover': { bgcolor: '#1e293b' },
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'none',
                py: 0.6,
                px: 1.5,
              }}
            >
              Cabinet Brief (PDF)
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Top 4 Sovereign KPI Ribbon */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        {/* KPI 1: Total CapEx */}
        <Grid item xs={12} sm={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 1,
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}>
              TOTAL PORTFOLIO CAPEX
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', fontFamily: 'monospace', fontSize: '1.45rem', my: 0.4 }}>
              ₹14,82,450 Cr
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
                1,428 Active Packages
              </Typography>
              <Chip label="+3.8% MoM" size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800, bgcolor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }} />
            </Stack>
          </Paper>
        </Grid>

        {/* KPI 2: Severe Delay Risk */}
        <Grid item xs={12} sm={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 1,
              border: '1px solid #fecaca',
              borderLeft: '4px solid #ef4444',
              bgcolor: '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ color: '#b91c1c', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                VALUE AT SEVERE DELAY RISK (≥{thresholds.criticalDelay}d)
              </Typography>
              <WarningAmber sx={{ fontSize: 16, color: '#ef4444' }} />
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#b91c1c', fontFamily: 'monospace', fontSize: '1.45rem', my: 0.4 }}>
              ₹{Math.round(riskMetrics.severeRiskCapExCr).toLocaleString('en-IN')} Cr
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
                {riskMetrics.severeRiskPct.toFixed(1)}% of monitored book
              </Typography>
              <Chip
                label={`${riskMetrics.criticalCount} High-Risk Projects`}
                size="small"
                onClick={() => navigate('/inventory')}
                sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800, bgcolor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', cursor: 'pointer' }}
                title="View in Master Inventory"
              />
            </Stack>
          </Paper>
        </Grid>

        {/* KPI 3: Projected Schedule Slip */}
        <Grid item xs={12} sm={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 1,
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}>
              AVG PROJECTED SCHEDULE SLIP
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#c2410c', fontFamily: 'monospace', fontSize: '1.45rem', my: 0.4 }}>
              +{riskMetrics.avgDelay} <Typography component="span" variant="body2" sx={{ fontWeight: 700, color: '#64748b' }}>Days vs DPR</Typography>
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
                National Median 151d
              </Typography>
              <Chip label="-14d post-escalation" size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800, bgcolor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }} />
            </Stack>
          </Paper>
        </Grid>

        {/* KPI 4: Critical Bottlenecks */}
        <Grid item xs={12} sm={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 1,
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}>
              CRITICAL BOTTLENECKS
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', fontFamily: 'monospace', fontSize: '1.45rem', my: 0.4 }}>
              184 <Typography component="span" variant="body2" sx={{ fontWeight: 700, color: '#64748b' }}>Active Blocks</Typography>
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', display: 'block' }}>
              76 Forest (Stage-II) &bull; 42 Land 3(D) &bull; 46 Utility
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Grid: S-Curve & Early Warnings */}
      <Grid container spacing={2}>
        {/* Left 8 Columns: CapEx S-Curve & Sector Vulnerability Matrix */}
        <Grid item xs={12} lg={8}>
          {/* Cumulative CapEx S-Curve Chart */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 2,
              borderRadius: 1,
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>
                  Cumulative CapEx S-Curve &amp; ML Delay Trajectory (FY 2024-25)
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
                  Cumulative CapEx (₹ Lakh Crore) &bull; Verified Temporal F1: 87.3% &bull; Severe Recall: 92.3% &bull; Monte Carlo 10,000 runs
                </Typography>
              </Box>

              {/* In-Chart Deficit Callout */}
              <Box sx={{ p: 1, bgcolor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#b91c1c', display: 'block', fontSize: '0.68rem', fontFamily: 'monospace' }}>
                  Projected FY Deficit: ₹1,64,300 Cr
                </Typography>
                <Typography variant="caption" sx={{ color: '#991b1b', fontSize: '0.62rem' }}>
                  Aligns with delayed portfolio avg
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ width: '100%', height: 280, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={S_CURVE_DATA} margin={{ top: 10, right: 20, bottom: 5, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} unit="L Cr" />
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
                  <Line type="monotone" dataKey="plannedDPR" name="Planned DPR" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="actualOutlay" name="Actual Outlay" stroke="#0f172a" strokeWidth={2.5} dot={{ r: 3, fill: '#0f172a' }} connectNulls={false} />
                  <Line type="monotone" dataKey="mlForecast" name="ML Forecast Slips" stroke="#ef4444" strokeDasharray="3 3" strokeWidth={2} dot={{ r: 3, fill: '#ef4444' }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>

            <Box sx={{ mt: 1.5, p: 1.2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 0.8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.72rem' }}>
                Current Outlay: <strong>₹8.48L Cr achieved</strong> vs <strong>₹10.35L Cr milestone target</strong>
              </Typography>
              <Typography variant="caption" sx={{ color: '#0284c7', fontSize: '0.68rem', fontWeight: 700 }}>
                PM GatiShakti Dynamic S-Curve Model
              </Typography>
            </Box>
          </Paper>

          {/* Sector Vulnerability Matrix & Key Stoppages */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 1,
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>
                Sector Vulnerability Matrix &amp; Key Stoppages
              </Typography>
              <Chip label="Cabinet Watchlist Active" size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#eff6ff', color: '#1d4ed8' }} />
            </Stack>

            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                    <th style={{ padding: '8px 6px', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>SECTOR / MINISTRY</th>
                    <th style={{ padding: '8px 6px', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>PACKAGES</th>
                    <th style={{ padding: '8px 6px', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>CAPEX</th>
                    <th style={{ padding: '8px 6px', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>AVG DELAY</th>
                    <th style={{ padding: '8px 6px', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>PRIMARY BOTTLENECK FACTOR</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 6px', fontWeight: 700, color: '#0f172a' }}>National Highways (MoRTH)</td>
                    <td style={{ padding: '10px 6px', fontFamily: 'monospace' }}>612</td>
                    <td style={{ padding: '10px 6px', fontFamily: 'monospace', fontWeight: 700 }}>₹7,42,800 Cr</td>
                    <td style={{ padding: '10px 6px', fontFamily: 'monospace', fontWeight: 800, color: '#c2410c' }}>+94d</td>
                    <td style={{ padding: '10px 6px', color: '#475569' }}>RoW acquisition &amp; tree felling (NH-44, NH-48)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 6px', fontWeight: 700, color: '#0f172a' }}>Dedicated Freight Corridors (Railways)</td>
                    <td style={{ padding: '10px 6px', fontFamily: 'monospace' }}>384</td>
                    <td style={{ padding: '10px 6px', fontFamily: 'monospace', fontWeight: 700 }}>₹3,14,200 Cr</td>
                    <td style={{ padding: '10px 6px', fontFamily: 'monospace', fontWeight: 800, color: '#b91c1c' }}>+142d</td>
                    <td style={{ padding: '10px 6px', color: '#475569' }}>Overhead Electrification &amp; Major Rail Over Bridges</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 6px', fontWeight: 700, color: '#0f172a' }}>Power Grid &amp; Green Energy Corridors</td>
                    <td style={{ padding: '10px 6px', fontFamily: 'monospace' }}>216</td>
                    <td style={{ padding: '10px 6px', fontFamily: 'monospace', fontWeight: 700 }}>₹1,88,500 Cr</td>
                    <td style={{ padding: '10px 6px', fontFamily: 'monospace', fontWeight: 800, color: '#15803d' }}>+48d</td>
                    <td style={{ padding: '10px 6px', color: '#475569' }}>Right-of-Way tower footing in Western Ghats</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 6px', fontWeight: 700, color: '#0f172a' }}>Jal Jeevan Mission (Bulk Water / Intakes)</td>
                    <td style={{ padding: '10px 6px', fontFamily: 'monospace' }}>412</td>
                    <td style={{ padding: '10px 6px', fontFamily: 'monospace', fontWeight: 700 }}>₹2,37,150 Cr</td>
                    <td style={{ padding: '10px 6px', fontFamily: 'monospace', fontWeight: 800, color: '#c2410c' }}>+65d</td>
                    <td style={{ padding: '10px 6px', color: '#475569' }}>State share counter-disbursement &amp; DI pipe delivery</td>
                  </tr>
                </tbody>
              </table>
            </Box>

            <Divider sx={{ my: 1.5, borderColor: '#e2e8f0' }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                Showing 4 of 6 primary monitored infrastructure domains
              </Typography>
              <Typography
                variant="caption"
                onClick={() => navigate('/inventory')}
                sx={{ color: '#0284c7', fontWeight: 700, cursor: 'pointer', fontSize: '0.72rem', '&:hover': { textDecoration: 'underline' } }}
              >
                View granular breakdown by State PWD / Zone &rarr;
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        {/* Right 4 Columns: Early Warnings & Statutory Clearance Pipeline */}
        <Grid item xs={12} lg={4}>
          {/* Critical Delay Early Warnings (Next 30D) */}
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
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.82rem' }}>
                Critical Delay Early Warnings
              </Typography>
              <Chip label="3 Requires Cabinet Action" size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800, bgcolor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }} />
            </Stack>

            <Stack spacing={1.5}>
              {/* Item 1 */}
              <Box sx={{ p: 1.5, bgcolor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#9f1239', fontFamily: 'monospace', fontSize: '0.72rem' }}>
                    NHAI-DEL-MUM-P4
                  </Typography>
                  <Chip label="+145 Days" size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#be123c', color: '#ffffff' }} />
                </Stack>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.78rem', lineHeight: 1.3 }}>
                  Delhi-Mumbai Expressway (Vadodara–Kim Exp.)
                </Typography>
                <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.7rem', display: 'block', mt: 0.4, lineHeight: 1.35 }}>
                  <strong>Root Cause:</strong> MoEFCC Stage-II Forest Clearance pending in Ratlam Division (34.2 Ha unassigned diversion).
                </Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.66rem' }}>Contractor: Dilip Buildcon Ltd.</Typography>
                  <Button
                    size="small"
                    onClick={() => navigate('/milestones')}
                    sx={{ color: '#9f1239', fontWeight: 800, fontSize: '0.68rem', textTransform: 'none', p: 0 }}
                  >
                    Escalate to PMO &rarr;
                  </Button>
                </Stack>
              </Box>

              {/* Item 2 */}
              <Box sx={{ p: 1.5, bgcolor: '#fffbeb', border: '1px solid #fde68a', borderRadius: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#92400e', fontFamily: 'monospace', fontSize: '0.72rem' }}>
                    DFCCIL-WDFC-CTP-11
                  </Typography>
                  <Chip label="+81 Days" size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#d97706', color: '#ffffff' }} />
                </Stack>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.78rem', lineHeight: 1.3 }}>
                  Western DFC: Makarpura to Sachin CTP-11
                </Typography>
                <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.7rem', display: 'block', mt: 0.4, lineHeight: 1.35 }}>
                  <strong>Root Cause:</strong> Specialized track-laying train mobilization deficit &amp; Surat district bridge pier foundation slip.
                </Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.66rem' }}>Contractor: L&amp;T - Sojitz</Typography>
                  <Button
                    size="small"
                    onClick={() => navigate('/inventory')}
                    sx={{ color: '#92400e', fontWeight: 800, fontSize: '0.68rem', textTransform: 'none', p: 0 }}
                  >
                    Audit Resource Plan &rarr;
                  </Button>
                </Stack>
              </Box>

              {/* Item 3 */}
              <Box sx={{ p: 1.5, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', fontFamily: 'monospace', fontSize: '0.72rem' }}>
                    JJM-UP-BUND-08
                  </Typography>
                  <Chip label="+60 Days" size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#f59e0b', color: '#0f172a' }} />
                </Stack>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.78rem', lineHeight: 1.3 }}>
                  Bundelkhand Surface Water Intake (Package 8)
                </Typography>
                <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.7rem', display: 'block', mt: 0.4, lineHeight: 1.35 }}>
                  <strong>Root Cause:</strong> Aquifer draw-down test re-survey mandate issued by UP State Ground Water Department.
                </Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.66rem' }}>Contractor: NCC Limited</Typography>
                  <Button
                    size="small"
                    onClick={() => navigate('/inventory')}
                    sx={{ color: '#0284c7', fontWeight: 800, fontSize: '0.68rem', textTransform: 'none', p: 0 }}
                  >
                    Issue Clarification &rarr;
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Paper>

          {/* Statutory Clearance Pipeline Status */}
          <Paper
            elevation={0}
            sx={{
              p: 2.2,
              borderRadius: 1,
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.82rem' }}>
                Statutory Clearance Pipeline Status
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                Avg turnaround: 114d
              </Typography>
            </Stack>

            <Stack spacing={2}>
              {/* Clearance 1: MoEFCC */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.72rem' }}>
                    MoEFCC Forest Stage-II Clearances
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#b91c1c', fontFamily: 'monospace', fontSize: '0.68rem' }}>
                    76 Pending (Avg 4.8m)
                  </Typography>
                </Stack>
                <LinearProgress variant="determinate" value={65} sx={{ height: 6, borderRadius: 1, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#b91c1c' } }} />
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.4 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.64rem' }}>Cleared: 142</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.64rem' }}>In Review: 71</Typography>
                  <Typography variant="caption" sx={{ color: '#b91c1c', fontWeight: 700, fontSize: '0.64rem' }}>Critical (&gt;180d): 76</Typography>
                </Stack>
              </Box>

              {/* Clearance 2: Land Acquisition 3(D) */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.72rem' }}>
                    Land Acquisition Section 3(D) Notifications
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#c2410c', fontFamily: 'monospace', fontSize: '0.68rem' }}>
                    42 Stuck (Avg 6.2m)
                  </Typography>
                </Stack>
                <LinearProgress variant="determinate" value={78} sx={{ height: 6, borderRadius: 1, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#c2410c' } }} />
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.4 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.64rem' }}>Awarded: 486</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.64rem' }}>CALA Process: 129</Typography>
                  <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700, fontSize: '0.64rem' }}>Litigation: 42</Typography>
                </Stack>
              </Box>

              {/* Clearance 3: CRS */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.72rem' }}>
                    CRS (Railway Safety) Approvals
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#0284c7', fontFamily: 'monospace', fontSize: '0.68rem' }}>
                    28 Inspection Queue
                  </Typography>
                </Stack>
                <LinearProgress variant="determinate" value={88} sx={{ height: 6, borderRadius: 1, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#0284c7' } }} />
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.4 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.64rem' }}>Inspected &amp; Passed: 214</Typography>
                  <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 700, fontSize: '0.64rem' }}>Active Joint: 28</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.64rem' }}>Defects Remediated: 4</Typography>
                </Stack>
              </Box>

              {/* Clearance 4: MoD */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.72rem' }}>
                    Ministry of Defence Working Permission / Land Swap
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#15803d', fontFamily: 'monospace', fontSize: '0.68rem' }}>
                    18 In-Principle
                  </Typography>
                </Stack>
                <LinearProgress variant="determinate" value={82} sx={{ height: 6, borderRadius: 1, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#15803d' } }} />
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.4 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.64rem' }}>In-Principle NOC: 64</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.64rem' }}>Equal Value Land: 28</Typography>
                  <Typography variant="caption" sx={{ color: '#b91c1c', fontWeight: 700, fontSize: '0.64rem' }}>In Escalation: 18</Typography>
                </Stack>
              </Box>
            </Stack>

            <Divider sx={{ my: 1.5, borderColor: '#e2e8f0' }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem' }}>
                Direct API link to PM GatiShakti NMP Clearance Gateway
              </Typography>
              <Typography
                variant="caption"
                onClick={() => navigate('/verification')}
                sx={{ color: '#0284c7', fontWeight: 700, cursor: 'pointer', fontSize: '0.68rem', '&:hover': { textDecoration: 'underline' } }}
              >
                Open Inter-Agency Matrix &rarr;
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      <ExecutiveCabinetBriefModal open={briefModalOpen} onClose={() => setBriefModalOpen(false)} />
    </Box>
  );
}
