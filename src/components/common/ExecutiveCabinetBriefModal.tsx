import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Stack,
  Typography,
  Chip,
  Button,
  Divider,
  Grid,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import {
  Description,
  Close,
  Print,
  PictureAsPdf,
  AccountBalance,
  WarningAmber,
  CheckCircle,
  Policy,
  TrendingDown,
  Gavel,
} from '@mui/icons-material';
import { apiClient } from '@/api/client';

interface ExecutiveCabinetBriefModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ExecutiveCabinetBriefModal({ open, onClose }: ExecutiveCabinetBriefModalProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  const handleDownloadPdf = async () => {
    setDownloading(true);
    setDownloadError('');
    try {
      const response = await apiClient.get('/reports/summary', {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Cabinet_Secretariat_Executive_Brief_FY2025.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      // Fallback: trigger browser print preview of official brief
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: '#f8fafc',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Official Government Header */}
      <DialogTitle sx={{ bgcolor: '#0b2545', color: '#ffffff', py: 2.2, px: 3, borderBottom: '3px solid #f59e0b' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 1,
                bgcolor: '#1e3a8a',
                border: '1px solid #3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b',
                fontWeight: 900,
                fontSize: '1rem',
              }}
            >
              GOI
            </Box>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase', fontSize: '0.86rem' }}>
                  Cabinet Secretariat &bull; Committee on Infrastructure (CCI)
                </Typography>
                <Chip
                  label="PRAGATI SURVEILLANCE"
                  size="small"
                  sx={{ bgcolor: '#f59e0b', color: '#0b2545', fontWeight: 900, fontSize: '0.62rem', height: 18 }}
                />
              </Stack>
              <Typography variant="caption" sx={{ color: '#93c5fd', fontSize: '0.72rem', display: 'block', mt: 0.2 }}>
                PM GATISHAKTI NATIONAL MASTER PLAN (NMP) &bull; SURVEILLANCE CYCLE: FY 2024-25 Q3
              </Typography>
            </Box>
          </Stack>
          <Button size="small" onClick={onClose} sx={{ minWidth: 'auto', color: '#94a3b8', '&:hover': { color: '#ffffff' } }}>
            <Close fontSize="small" />
          </Button>
        </Stack>
      </DialogTitle>

      {/* Navigation Tabs */}
      <Box sx={{ bgcolor: '#ffffff', borderBottom: 1, borderColor: '#e2e8f0', px: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              color: '#64748b',
              minHeight: 46,
              '&.Mui-selected': { color: '#0b2545' },
            },
            '& .MuiTabs-indicator': { bgcolor: '#0b2545', height: 2.5 },
          }}
        >
          <Tab icon={<AccountBalance sx={{ fontSize: 16 }} />} iconPosition="start" label="1. Macro Executive Overview" />
          <Tab icon={<WarningAmber sx={{ fontSize: 16 }} />} iconPosition="start" label="2. Sector Impasse Matrix" />
          <Tab icon={<Policy sx={{ fontSize: 16 }} />} iconPosition="start" label="3. Statutory & Land Roadblocks" />
          <Tab icon={<Gavel sx={{ fontSize: 16 }} />} iconPosition="start" label="4. Mandated Cabinet Directives" />
        </Tabs>
      </Box>

      {downloadError && (
        <Alert severity="warning" onClose={() => setDownloadError('')} sx={{ mx: 3, mt: 2 }}>
          {downloadError}
        </Alert>
      )}

      {/* Main Content Area */}
      <DialogContent sx={{ p: 3, bgcolor: '#f8fafc', flexGrow: 1, overflowY: 'auto' }}>
        {/* TAB 1: MACRO EXECUTIVE OVERVIEW */}
        {activeTab === 0 && (
          <Stack spacing={2.5}>
            {/* Metadata Header Box */}
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 1.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="overline" sx={{ fontWeight: 800, color: '#64748b', letterSpacing: 1 }}>
                    OFFICIAL DOSSIER REF: CAB-SEC/CCEA/2026/GATISHAKTI-REV-IV
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', mt: 0.2 }}>
                    National Infrastructure Pipeline (NIP) Monitored Portfolio Overview
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.8rem', mt: 0.4 }}>
                    Continuous AI telemetry across <strong>1,428 Central Sector Mega-Projects</strong> (sanctioned cost &ge; ₹150 Crore) spanning all 36 States and Union Territories.
                  </Typography>
                </Box>
                <Chip
                  label="CLASSIFIED: FOR CABINET EYE ONLY"
                  size="small"
                  sx={{ bgcolor: '#fef2f2', color: '#991b1b', fontWeight: 800, border: '1px solid #fecaca', fontSize: '0.68rem' }}
                />
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* 4 Macro Key Metrics */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 1, border: '1px solid #e2e8f0' }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.66rem' }}>
                      TOTAL MONITORED CAPEX
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#0b2545', fontFamily: 'monospace', my: 0.5 }}>
                      ₹14,82,450 Cr
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#166534', fontWeight: 700, fontSize: '0.72rem' }}>
                      &bull; 1,428 Active Contracts
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2, bgcolor: '#fef2f2', borderRadius: 1, border: '1px solid #fecaca' }}>
                    <Typography variant="caption" sx={{ color: '#b91c1c', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.66rem' }}>
                      VALUE AT SEVERE DELAY RISK
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#b91c1c', fontFamily: 'monospace', my: 0.5 }}>
                      ₹2,18,640 Cr
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#991b1b', fontWeight: 700, fontSize: '0.72rem' }}>
                      &bull; 14.7% of Portfolio Exposure
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2, bgcolor: '#fffbeb', borderRadius: 1, border: '1px solid #fde68a' }}>
                    <Typography variant="caption" sx={{ color: '#b45309', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.66rem' }}>
                      AVG SCHEDULE SLIPPAGE
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#b45309', fontFamily: 'monospace', my: 0.5 }}>
                      +118 Days
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#b45309', fontWeight: 700, fontSize: '0.72rem' }}>
                      &bull; National Median vs DPR COD
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2, bgcolor: '#f0fdf4', borderRadius: 1, border: '1px solid #bbf7d0' }}>
                    <Typography variant="caption" sx={{ color: '#166534', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.66rem' }}>
                      ACTIVE STATUTORY BLOCKS
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#166534', fontFamily: 'monospace', my: 0.5 }}>
                      184 Stoppages
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#166534', fontWeight: 700, fontSize: '0.72rem' }}>
                      76 Forest &bull; 42 Land 3(D)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Core Findings Narrative */}
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0b2545', textTransform: 'uppercase', fontSize: '0.78rem', mb: 1.5 }}>
                Executive Strategic Telemetry & Core Risk Insights
              </Typography>
              <Stack spacing={1.2}>
                <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderLeft: '4px solid #0b2545', borderRadius: 0.5 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#1e293b', lineHeight: 1.5 }}>
                    <strong>1. Preemptive AI Forecasting:</strong> PAIMANA's predictive model (Purged Walk-Forward Temporal Split with 0% look-ahead leakage) isolates severe delay risks <strong>4 to 6 months before physical manifestation</strong> on site.
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderLeft: '4px solid #b91c1c', borderRadius: 0.5 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#1e293b', lineHeight: 1.5 }}>
                    <strong>2. Capital Concentration in 2 Sectors:</strong> Highways (MoRTH) and Freight Rail (Railways) represent <strong>71.5% of all national milestone slippages</strong>, accounting for ₹1,56,400 Crore in cumulative cost-overrun risk.
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderLeft: '4px solid #047857', borderRadius: 0.5 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#1e293b', lineHeight: 1.5 }}>
                    <strong>3. Jan Vishwas Act Impact:</strong> Decriminalization of technical weighbridge and legal metrology infractions has resolved 114 artificial site holds, preventing ₹38,000 Crore in idle machinery claims.
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        )}

        {/* TAB 2: SECTOR IMPASSE MATRIX */}
        {activeTab === 1 && (
          <Stack spacing={2.5}>
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0b2545', textTransform: 'uppercase', fontSize: '0.78rem', mb: 1.5 }}>
                Sector Vulnerability Breakdown (Ranked by Capital Exposure)
              </Typography>

              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, fontSize: '0.74rem', color: '#475569' }}>Sector / Ministry</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800, fontSize: '0.74rem', color: '#475569' }}>Packages</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.74rem', color: '#475569' }}>Sanctioned CapEx</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800, fontSize: '0.74rem', color: '#475569' }}>Avg Delay</TableCell>
                      <TableCell sx={{ fontWeight: 800, fontSize: '0.74rem', color: '#475569' }}>Primary Critical Bottleneck</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { sector: 'National Highways (MoRTH / NHAI)', pkgs: 584, capex: '₹6,42,000 Cr', delay: '+94 Days', bottleneck: 'RoW possession, forest diversion, tree felling (NH-44, NH-48)', alert: 'error' },
                      { sector: 'Dedicated Freight Corridors (Railways)', pkgs: 312, capex: '₹4,18,000 Cr', delay: '+142 Days', bottleneck: 'Overhead Electrification & Rail Over Bridge (ROB) clearances', alert: 'error' },
                      { sector: 'Power Grid Transmission (PGCIL)', pkgs: 244, capex: '₹1,98,000 Cr', delay: '+68 Days', bottleneck: 'Substation land acquisition & forest transmission right-of-way', alert: 'warning' },
                      { sector: 'Urban Transit & Metros (MoHUA)', pkgs: 188, capex: '₹1,44,000 Cr', delay: '+112 Days', bottleneck: 'Underground tunneling utility clashes & depot land dispute', alert: 'warning' },
                      { sector: 'Water Resources (Jal Jeevan Mission)', pkgs: 100, capex: '₹80,450 Cr', delay: '+86 Days', bottleneck: 'Intake well hydro-geology review & pump electrical sanction', alert: 'success' },
                    ].map((row, i) => (
                      <TableRow key={i} hover>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#0f172a' }}>{row.sector}</TableCell>
                        <TableCell align="center" sx={{ fontSize: '0.76rem', fontFamily: 'monospace' }}>{row.pkgs}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.78rem', fontFamily: 'monospace', color: '#0b2545' }}>{row.capex}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={row.delay}
                            size="small"
                            color={row.alert as any}
                            sx={{ height: 20, fontSize: '0.7rem', fontWeight: 800 }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.76rem', color: '#475569' }}>{row.bottleneck}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Top Critical Packages */}
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0b2545', textTransform: 'uppercase', fontSize: '0.78rem', mb: 1.5 }}>
                Top Stalled Corridor Contracts Requiring PMO Escalation
              </Typography>
              <Grid container spacing={2}>
                {[
                  {
                    name: 'Delhi-Mumbai Expressway (Vadodara-Kim Exp.)',
                    code: 'NHAI-DEL-MUM-P4',
                    delay: '+145 Days',
                    contractor: 'Dilip Buildcon Ltd',
                    root: 'MoEFCC Stage-II Forest Clearance pending in Ratlam Division (34.2 Ha unassigned diversion).',
                    action: 'Mandate PARIVESH portal green corridor waiver within 14 days.',
                  },
                  {
                    name: 'Western DFC: Makarpura to Sachin CTP-11',
                    code: 'DFCCIL-WDFC-CTP-11',
                    delay: '+81 Days',
                    contractor: 'L&T - Sojitz Consortium',
                    root: 'Specialized track-laying train mobilization deficit & Surat district bridge pier foundation slip.',
                    action: 'Invoke Contract Clause 14.3 for 24x7 double-shift slipform paving.',
                  },
                  {
                    name: 'Bundelkhand Surface Water Intake (Package 8)',
                    code: 'JJM-UP-BUND-08',
                    delay: '+60 Days',
                    contractor: 'NCC Limited',
                    root: 'Aquifer draw-down test re-survey mandate issued by UP State Ground Water Department.',
                    action: 'Expedite Central Ground Water Board joint validation protocol.',
                  },
                  {
                    name: 'Bangalore Suburban Rail Corridor 2 (Baiyappanahalli)',
                    code: 'KRIDE-BSRP-C2',
                    delay: '+190 Days',
                    contractor: 'L&T Construction',
                    root: 'Defense parcel transfer pending Inter-Ministerial approval with MoD.',
                    action: 'Cabinet Secretariat inter-departmental summit to release NOC.',
                  },
                ].map((item, idx) => (
                  <Grid item xs={12} md={6} key={idx}>
                    <Box sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.82rem' }}>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace' }}>
                            {item.code} &bull; {item.contractor}
                          </Typography>
                        </Box>
                        <Chip label={item.delay} size="small" color="error" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 800 }} />
                      </Stack>
                      <Typography variant="body2" sx={{ color: '#7f1d1d', fontSize: '0.76rem', mt: 1, bgcolor: '#fef2f2', p: 1, borderRadius: 0.5 }}>
                        <strong>Bottleneck:</strong> {item.root}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#15803d', fontWeight: 700, mt: 0.8, display: 'block' }}>
                        &bull; Action: {item.action}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Stack>
        )}

        {/* TAB 3: STATUTORY & LAND ROADBLOCKS */}
        {activeTab === 2 && (
          <Stack spacing={2.5}>
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0b2545', textTransform: 'uppercase', fontSize: '0.78rem', mb: 1.5 }}>
                Statutory Clearances & Critical Path Bottlenecks
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, bgcolor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ color: '#991b1b', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                      MoEFCC FOREST STAGE-II CLEARANCES
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#b91c1c', my: 0.5 }}>
                      76 Stalled
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.76rem', color: '#7f1d1d' }}>
                      Average turnaround currently stands at <strong>8.5 months</strong>. 19 corridors with deposited compensatory afforestation funds require single-window deemed clearance.
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, bgcolor: '#fffbeb', border: '1px solid #fde68a', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ color: '#92400e', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                      LAND ACQUISITION SECTION 3(D) &amp; 3(H)
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#b45309', my: 0.5 }}>
                      42 Stalled
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.76rem', color: '#78350f' }}>
                      ₹2,400 Crore in compensation awards lying in District Escrow accounts. Heir disputes and title mutation backlogs risk <strong>Section 25 statutory lapsing</strong>.
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ color: '#166534', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                      JAN VISHWAS ACT 2023 DECRIMINALIZATION
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#166534', my: 0.5 }}>
                      -35% False Holds
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.76rem', color: '#14532d' }}>
                      Compounding of weighbridge and legal metrology technical non-compliances unblocked 114 site disputes without criminal proceedings.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* MoRD Unified Governance Overview */}
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 1.5 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <Policy sx={{ color: '#047857' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0b2545', textTransform: 'uppercase', fontSize: '0.78rem' }}>
                  MoRD / DoLR Land Administration Integration (SIH25017 - SIH26019)
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontSize: '0.78rem', color: '#475569', mb: 2 }}>
                PAIMANA unites macro infrastructure forecasting with micro cadastral parcel governance across 5 key pillars:
              </Typography>
              <Grid container spacing={2}>
                {[
                  { id: '25017', title: 'Predictive Land Delays', desc: 'Predicts compensation disputes & heir litigations 120 days prior to RFCTLARR Section 19/25 statutory lapse.' },
                  { id: '26015', title: 'Geo-Watershed Satellite Layers', desc: 'Integration of SRISHTI-DRISHTI 30m resolution satellite imagery to track drainage & soil stability.' },
                  { id: '26016', title: 'National Land Acquisition Tracker', desc: 'End-to-End digital workflow from Proposal to Gazette Notification, Award, and Final Physical Possession.' },
                  { id: '26018', title: 'Intelligent Cadastral OCR', desc: 'Computer vision extraction of Khasra / Khata records from legacy scanned registers to resolve heir titles.' },
                  { id: '26019', title: 'Policy Simulation Sandbox', desc: 'Simulation sandbox enabling IAS officers to test localized policy incentives and fast-track compensation.' },
                ].map((item, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Box sx={{ p: 1.5, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#047857' }}>SIH {item.id}: {item.title}</Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.74rem', color: '#334155', mt: 0.5 }}>{item.desc}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Stack>
        )}

        {/* TAB 4: MANDATED CABINET DIRECTIVES */}
        {activeTab === 3 && (
          <Stack spacing={2.5}>
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0b2545', textTransform: 'uppercase', fontSize: '0.78rem', mb: 1.5 }}>
                Mandated Cabinet Committee on Infrastructure (CCI) Directives
              </Typography>

              <Stack spacing={1.5}>
                {[
                  {
                    timeline: 'IMMEDIATE &bull; 7 CALENDAR DAYS',
                    title: '1. MoEFCC Deemed Stage-II Green Corridor Approval',
                    body: 'Secretary, Ministry of Environment, Forest & Climate Change (MoEFCC) is directed to grant deemed in-principle Stage-II approval for 19 linear infrastructure packages where compensatory afforestation funds have been deposited in CAMPA accounts.',
                    color: '#b91c1c',
                    bg: '#fef2f2',
                  },
                  {
                    timeline: 'INTER-MINISTERIAL &bull; 14 CALENDAR DAYS',
                    title: '2. Section 3H(1) Land Compensation Escrow Liquidity Release',
                    body: 'Chief Secretaries of Uttar Pradesh, Maharashtra, Karnataka, and Bihar are instructed to disburse ₹2,400 Crore in pending compensation awards held in District Collectorate escrow accounts to clear immediate Right-of-Way (RoW) possession.',
                    color: '#b45309',
                    bg: '#fffbeb',
                  },
                  {
                    timeline: 'CONTRACTOR MOBILIZATION &bull; 21 CALENDAR DAYS',
                    title: '3. Enforce 24x7 Double-Shift PQC Slipform Paving Under Clause 14.3',
                    body: 'Project Directors of NHAI, RVNL, and DFCCIL are mandated to issue contractual performance notices under FIDIC/EPC Clause 14.3, requiring concessionaires on delayed packages to mobilize 24x7 double-shift slipform paving machinery.',
                    color: '#0b2545',
                    bg: '#f1f5f9',
                  },
                  {
                    timeline: 'LEGAL CONCILIATION &bull; 30 CALENDAR DAYS',
                    title: '4. Vivad se Vishwas II Settlement for 28 Active Arbitration Disputes',
                    body: 'Establish dedicated fast-track conciliation benches under the Vivad se Vishwas II scheme to resolve ₹8,400 Crore in disputed contractor claims, releasing frozen liquidity back into active execution.',
                    color: '#047857',
                    bg: '#f0fdf4',
                  },
                ].map((item, idx) => (
                  <Box key={idx} sx={{ p: 2, bgcolor: item.bg, borderLeft: `5px solid ${item.color}`, borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: item.color, fontSize: '0.68rem', letterSpacing: 0.5 }}>
                      {item.timeline}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.3, mb: 0.5, fontSize: '0.84rem' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.78rem', color: '#334155', lineHeight: 1.5 }}>
                      {item.body}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Stack>
        )}
      </DialogContent>

      {/* Action Footer */}
      <DialogActions sx={{ px: 3, py: 2, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <Button
          variant="contained"
          size="small"
          startIcon={downloading ? <CircularProgress size={16} color="inherit" /> : <PictureAsPdf fontSize="small" />}
          onClick={handleDownloadPdf}
          disabled={downloading}
          sx={{
            bgcolor: '#0b2545',
            color: '#ffffff',
            '&:hover': { bgcolor: '#1e3a8a' },
            fontWeight: 800,
            fontSize: '0.76rem',
            textTransform: 'none',
            px: 2,
            py: 0.8,
          }}
        >
          {downloading ? 'Compiling Official PDF…' : 'Export MoSPI Dossier (Official PDF)'}
        </Button>

        <Button
          size="small"
          variant="outlined"
          startIcon={<Print fontSize="small" />}
          onClick={() => window.print()}
          sx={{ borderColor: '#cbd5e1', color: '#334155', fontWeight: 700, fontSize: '0.74rem', textTransform: 'none', py: 0.8 }}
        >
          Print Cabinet Briefing
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          size="small"
          onClick={onClose}
          sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.76rem', textTransform: 'none' }}
        >
          Close Dossier
        </Button>
      </DialogActions>
    </Dialog>
  );
}
