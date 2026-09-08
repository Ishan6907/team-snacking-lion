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
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Send,
  GetApp,
  CheckCircle,
  Close,
  AccountBalance,
  WarningAmber,
  Print,
} from '@mui/icons-material';

interface CabinetEscalationDialogProps {
  open: boolean;
  onClose: () => void;
  projectCode?: string;
  projectName?: string;
  outlayCr?: number;
  slipDays?: number;
  primaryBlocker?: string;
}

export default function CabinetEscalationDialog({
  open,
  onClose,
  projectCode = 'NHAI-DEL-MUM-P4',
  projectName = 'Delhi-Mumbai Expressway (Vadodara–Kim Section Package 4)',
  outlayCr = 2840,
  slipDays = 145,
  primaryBlocker = 'MoEFCC Stage-II Forest Diversion at Ch. 214+000 (Ratlam Forest Div)',
}: CabinetEscalationDialogProps) {
  const [dispatching, setDispatching] = useState(false);
  const [dispatched, setDispatched] = useState(false);
  const [directives, setDirectives] = useState({
    forestDirective: true,
    paverMobilization: true,
    escrowDeposit: true,
    weeklyNodalReview: false,
  });

  const handleDispatch = () => {
    setDispatching(true);
    setTimeout(() => {
      setDispatching(false);
      setDispatched(true);
    }, 900);
  };

  const handleDownloadMemo = () => {
    const memoContent = `GOVERNMENT OF INDIA
CABINET SECRETARIAT • PROJECT MONITORING CELL
RASHTRAPATI BHAVAN, NEW DELHI

MEMORANDUM REF: CCEA/PRAGATI/2026/MORTH-${projectCode}
DATE: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
PRIORITY: HIGH ESCALATION (LEVEL 4 STATUTORY OVERRUN)

SUBJECT: INTER-MINISTERIAL ESCALATION FOR ${projectCode} — ${projectName.toUpperCase()}

1. PROJECT SUMMARY:
   - Executing Agency: National Highways Authority of India (NHAI) / MoRTH
   - Sanctioned Outlay: Rs. ${outlayCr.toLocaleString('en-IN')} Crore
   - Projected Schedule Slip: +${slipDays} Days vs DPR Baseline
   - Critical Blocker: ${primaryBlocker}

2. STATUTORY DIRECTIVES ISSUED:
   ${directives.forestDirective ? '[X] MoEFCC & Gujarat State Forest Dept directed to issue Stage-II felling clearance within 14 days.' : '[ ] Forest directive not selected.'}
   ${directives.paverMobilization ? '[X] Concessionaire directed to mobilize 2nd Slipform Concrete Paver under Contract Clause 14.3.' : '[ ] Paver mobilization not selected.'}
   ${directives.escrowDeposit ? '[X] District Collector directed to disburse compensation from Section 3H(1) escrow.' : '[ ] Escrow disbursement not selected.'}
   ${directives.weeklyNodalReview ? '[X] Mandate 48-hour inter-ministerial virtual compliance hearings.' : ''}

3. DISPATCH CONFIRMATION:
   - Dispatched via PMO PRAGATI e-Samiksha Gateway
   - Portal Transaction ID: PRG-2026-${Math.floor(Math.random() * 90000 + 10000)}
   - Officer: Shri Rakesh Sharma, IAS | Joint Secretary (Infrastructure Monitoring)

-------------------------------------------------------------------------
Authorized Signatory | Government of India
`;
    const blob = new Blob([memoContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cabinet_Escalation_Note_${projectCode}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 1.5 } }}>
      {/* Official Government Header */}
      <DialogTitle sx={{ bgcolor: '#0f172a', color: '#ffffff', py: 2, px: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 1,
                bgcolor: '#1e293b',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b',
              }}
            >
              <AccountBalance fontSize="small" />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.82rem' }}>
                Cabinet Secretariat &bull; Infrastructure Monitoring Cell
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.72rem' }}>
                PMO PRAGATI E-SAMIKSHA INTER-MINISTERIAL ESCALATION MEMORANDUM
              </Typography>
            </Box>
          </Stack>

          <Button size="small" onClick={onClose} sx={{ minWidth: 'auto', color: '#94a3b8', '&:hover': { color: '#ffffff' } }}>
            <Close fontSize="small" />
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: '#f8fafc' }}>
        {dispatched ? (
          <Alert
            severity="success"
            icon={<CheckCircle fontSize="inherit" />}
            sx={{ mb: 2.5, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontWeight: 600 }}
          >
            Formal Memorandum successfully dispatched to PMO PRAGATI portal. Reference Code:{' '}
            <Box component="span" sx={{ fontFamily: 'monospace', fontWeight: 800 }}>
              PRG-2026-MORTH-8841
            </Box>
            . Digital receipt logged in PMIS Audit Trail.
          </Alert>
        ) : (
          <Box sx={{ mb: 2, p: 1.5, bgcolor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <WarningAmber sx={{ color: '#be123c', fontSize: 18 }} />
              <Typography variant="caption" sx={{ color: '#9f1239', fontWeight: 700, fontSize: '0.74rem' }}>
                CRITICAL INTER-MINISTERIAL ESCALATION: Initiating formal PMO action note for Schedule Slip &gt;90 Days.
              </Typography>
            </Stack>
          </Box>
        )}

        {/* Project Dossier Card */}
        <Box sx={{ bgcolor: '#ffffff', p: 2, borderRadius: 1, border: '1px solid #e2e8f0', mb: 2.5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                Monitored Mega-Project Package
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>
                {projectName}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                <Chip label={projectCode} size="small" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 800, bgcolor: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1' }} />
                <Chip label={`₹${outlayCr.toLocaleString('en-IN')} Cr Outlay`} size="small" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700, bgcolor: '#f8fafc' }} />
                <Chip label={`+${slipDays}d Schedule Slip`} size="small" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 800, bgcolor: '#fee2e2', color: '#b91c1c' }} />
              </Stack>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{ bgcolor: '#f8fafc', p: 1.5, borderRadius: 1, border: '1px solid #e2e8f0' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                  Escalation Target
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.78rem' }}>
                  Cabinet Secretariat / PMO
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>
                  Routing: MoEFCC &bull; MoRTH &bull; NHAI HQ
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 1.5 }} />

          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>
            Primary Statutory Bottleneck
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#be123c', mt: 0.2, fontSize: '0.8rem' }}>
            {primaryBlocker}
          </Typography>
        </Box>

        {/* Action Directives to Include in Cabinet Note */}
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Statutory Action Directives (Include in Note)
        </Typography>

        <Stack spacing={0.8} sx={{ bgcolor: '#ffffff', p: 1.5, borderRadius: 1, border: '1px solid #e2e8f0' }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={directives.forestDirective}
                onChange={(e) => setDirectives({ ...directives, forestDirective: e.target.checked })}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: '0.76rem', color: '#334155' }}>
                <strong>MoEFCC Directive:</strong> Request PMO Single-Window fast-track for State-II Forest Clearances (Ratlam Division) within 14 calendar days.
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={directives.paverMobilization}
                onChange={(e) => setDirectives({ ...directives, paverMobilization: e.target.checked })}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: '0.76rem', color: '#334155' }}>
                <strong>Contractual Remedy:</strong> Mandate Concessionaire (Dilip Buildcon Ltd.) to deploy 2nd Slipform Concrete Paver under Contract Clause 14.3.
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={directives.escrowDeposit}
                onChange={(e) => setDirectives({ ...directives, escrowDeposit: e.target.checked })}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: '0.76rem', color: '#334155' }}>
                <strong>District Collectorate:</strong> Direct Vadodara Land Acquisition Officer to deposit pending Section 3H(1) award compensation in escrow.
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={directives.weeklyNodalReview}
                onChange={(e) => setDirectives({ ...directives, weeklyNodalReview: e.target.checked })}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: '0.76rem', color: '#334155' }}>
                <strong>Inter-Ministerial Virtual Review:</strong> Schedule weekly compliance check by Cabinet Joint Secretary.
              </Typography>
            }
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<GetApp fontSize="small" />}
          onClick={handleDownloadMemo}
          sx={{ borderColor: '#cbd5e1', color: '#334155', fontWeight: 700, fontSize: '0.74rem', textTransform: 'none' }}
        >
          Download Memorandum (.TXT)
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<Print fontSize="small" />}
          onClick={() => window.print()}
          sx={{ borderColor: '#cbd5e1', color: '#334155', fontWeight: 700, fontSize: '0.74rem', textTransform: 'none' }}
        >
          Print
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          size="small"
          onClick={onClose}
          sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.74rem', textTransform: 'none' }}
        >
          Close
        </Button>
        <Button
          size="small"
          variant="contained"
          disabled={dispatching || dispatched}
          startIcon={dispatching ? <CircularProgress size={16} color="inherit" /> : dispatched ? <CheckCircle fontSize="small" /> : <Send fontSize="small" />}
          onClick={handleDispatch}
          sx={{
            bgcolor: dispatched ? '#15803d' : '#be123c',
            color: '#ffffff',
            '&:hover': { bgcolor: dispatched ? '#166534' : '#9f1239' },
            fontWeight: 800,
            fontSize: '0.74rem',
            textTransform: 'none',
            px: 2,
          }}
        >
          {dispatching ? 'Dispatching to PRAGATI…' : dispatched ? 'Dispatched to PMO' : 'Dispatch to PMO PRAGATI'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
