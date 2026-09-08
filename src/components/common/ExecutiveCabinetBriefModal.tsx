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
} from '@mui/material';
import {
  Description,
  Close,
  Print,
  GetApp,
} from '@mui/icons-material';

interface ExecutiveCabinetBriefModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ExecutiveCabinetBriefModal({ open, onClose }: ExecutiveCabinetBriefModalProps) {
  const handleDownloadBrief = () => {
    const briefContent = `GOVERNMENT OF INDIA • CABINET SECRETARIAT
PM GATISHAKTI NATIONAL MASTER PLAN (NMP)
EXECUTIVE INFRASTRUCTURE PORTFOLIO BRIEF — FY 2024-25 Q3

================================================================================
1. EXECUTIVE SUMMARY & MACRO TELEMETRY
================================================================================
- Total Monitored CapEx Book: Rs. 14,82,450 Crore (1,428 Active Packages)
- Value at Severe Delay Risk (>90 Days): Rs. 2,18,640 Crore (14.7% of Portfolio)
- National Average Schedule Slippage: +118 Calendar Days vs Original DPR COD
- Active Inter-Agency Statutory Bottlenecks: 184 Across All 36 States & UTs
  * MoEFCC Forest Stage-II: 76 Active Blocks
  * Section 3(D) Land Acquisition & Arbitration: 42 Active Blocks
  * High-Voltage Utility Relocation: 46 Active Blocks
  * Defense & Railway Clearances: 20 Active Blocks

================================================================================
2. SECTOR VULNERABILITY BREAKDOWN
================================================================================
- Highways (MoRTH / NHAI): 584 Packages | Rs. 6,42,000 Cr | 186 Critical Delays
- Dedicated Freight Corridors (Railways): 312 Packages | Rs. 4,18,000 Cr | 94 Critical Delays
- Power Transmission (PGCIL): 244 Packages | Rs. 1,98,000 Cr | 42 Critical Delays
- Urban Transit & Metros: 188 Packages | Rs. 1,44,000 Cr | 58 Critical Delays
- Water Infrastructure (Jal Jeevan): 100 Packages | Rs. 80,450 Cr | 48 Critical Delays

================================================================================
3. IMMEDIATE INTER-MINISTERIAL ACTIONS MANDATED
================================================================================
1. Single-Window MoEFCC Tree Felling Clearance: Expedite 19 Stage-II approvals.
2. Section 3H(1) Land Compensation Escrow: Release Rs. 2,400 Cr in disputed awards.
3. Concessionaire Shift Pattern Enforcement: Mandate double-shift PQC slipform paving.

Generated via PAIMANA Sovereign Infrastructure Suite on ${new Date().toLocaleDateString('en-IN')}.
`;
    const blob = new Blob([briefContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cabinet_Executive_Brief_FY2024_25.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 1.5 } }}>
      <DialogTitle sx={{ bgcolor: '#0f172a', color: '#ffffff', py: 2, px: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1,
                bgcolor: '#1e293b',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b',
              }}
            >
              <Description fontSize="small" />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.82rem' }}>
                Cabinet Secretariat &bull; Executive Infrastructure Brief
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                PM GATISHAKTI NATIONAL MASTER PLAN (NMP) &bull; CONFIDENTIAL BRIEFING
              </Typography>
            </Box>
          </Stack>
          <Button size="small" onClick={onClose} sx={{ minWidth: 'auto', color: '#94a3b8', '&:hover': { color: '#ffffff' } }}>
            <Close fontSize="small" />
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: '#f8fafc' }}>
        <Paper elevation={0} sx={{ p: 3, bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                Document Ref: CCEA/2026/GATISHAKTI-Q3-01
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem', mt: 0.2 }}>
                National Mega-Infrastructure Portfolio Executive Brief
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.74rem' }}>
                Surveillance Period: FY 2024-25 Q3 &bull; 1,428 Central Sector Contracts Across All 36 States &amp; UTs
              </Typography>
            </Box>
            <Chip label="CABINET BRIEF (OFFICIAL)" size="small" sx={{ height: 22, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }} />
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* 4 Key Pillars */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ bgcolor: '#f8fafc', p: 1.5, borderRadius: 1, border: '1px solid #e2e8f0' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.62rem' }}>
                  Total Monitored CapEx
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.98rem' }}>
                  ₹14,82,450 Cr
                </Typography>
                <Typography variant="caption" sx={{ color: '#15803d', fontWeight: 700, fontSize: '0.68rem' }}>
                  1,428 Packages Active
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box sx={{ bgcolor: '#fef2f2', p: 1.5, borderRadius: 1, border: '1px solid #fecaca' }}>
                <Typography variant="caption" sx={{ color: '#b91c1c', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.62rem' }}>
                  Value at Severe Risk
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#b91c1c', fontSize: '0.98rem' }}>
                  ₹2,18,640 Cr
                </Typography>
                <Typography variant="caption" sx={{ color: '#b91c1c', fontWeight: 700, fontSize: '0.68rem' }}>
                  14.7% Portfolio Exposure
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box sx={{ bgcolor: '#fffbeb', p: 1.5, borderRadius: 1, border: '1px solid #fde68a' }}>
                <Typography variant="caption" sx={{ color: '#b45309', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.62rem' }}>
                  Average Forecast Slip
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#b45309', fontSize: '0.98rem' }}>
                  +118 Days
                </Typography>
                <Typography variant="caption" sx={{ color: '#b45309', fontWeight: 700, fontSize: '0.68rem' }}>
                  National Median
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box sx={{ bgcolor: '#f8fafc', p: 1.5, borderRadius: 1, border: '1px solid #e2e8f0' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.62rem' }}>
                  Active Bottlenecks
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.98rem' }}>
                  184 Blockers
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.68rem' }}>
                  76 MoEFCC &bull; 42 Land 3(D)
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.8rem', textTransform: 'uppercase', mb: 1 }}>
            Mandated Cabinet Committee Interventions
          </Typography>
          <Stack spacing={0.8}>
            <Box sx={{ p: 1, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontSize: '0.76rem', color: '#334155' }}>
                <strong>1. MoEFCC PARIVESH Fast-Track:</strong> Mandate single-window clearance for 19 high-priority forest diversion corridors within 14 calendar days.
              </Typography>
            </Box>
            <Box sx={{ p: 1, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontSize: '0.76rem', color: '#334155' }}>
                <strong>2. State Land Escrow Liquidity:</strong> Instruct State Chief Secretaries to disburse ₹2,400 Cr in compensation from Section 3H(1) escrow accounts.
              </Typography>
            </Box>
            <Box sx={{ p: 1, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontSize: '0.76rem', color: '#334155' }}>
                <strong>3. Concessionaire Mobilization Directive:</strong> Direct NHAI and RVNL project directors to enforce Contract Clause 14.3 for 24x7 slipform concrete paving.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<GetApp fontSize="small" />}
          onClick={handleDownloadBrief}
          sx={{ borderColor: '#cbd5e1', color: '#334155', fontWeight: 700, fontSize: '0.74rem', textTransform: 'none' }}
        >
          Download Brief (.TXT)
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<Print fontSize="small" />}
          onClick={() => window.print()}
          sx={{ borderColor: '#cbd5e1', color: '#334155', fontWeight: 700, fontSize: '0.74rem', textTransform: 'none' }}
        >
          Print Brief
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button size="small" onClick={onClose} sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.74rem', textTransform: 'none' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
