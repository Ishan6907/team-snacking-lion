import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Stack,
  Typography,
  Button,
  Divider,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Gavel,
  CheckCircle,
  Close,
  WarningAmber,
  AccountBalance,
  ReceiptLong,
} from '@mui/icons-material';

interface LiquidatedDamagesDialogProps {
  open: boolean;
  onClose: () => void;
  projectCode?: string;
  projectName?: string;
  contractor?: string;
  outlayCr?: number;
  slipDays?: number;
}

export default function LiquidatedDamagesDialog({
  open,
  onClose,
  projectCode = 'NHAI-DEL-MUM-P4',
  projectName = 'Delhi-Mumbai Expressway (Vadodara–Kim Section Package 4)',
  contractor = 'Dilip Buildcon Ltd.',
  outlayCr = 2840,
  slipDays = 145,
}: LiquidatedDamagesDialogProps) {
  const [invoking, setInvoking] = useState(false);
  const [invoked, setInvoked] = useState(false);

  // Clause 27 calculation: 0.05% of contract value per week of unexcused delay, capped at 10%
  const contractValueCr = outlayCr;
  const weeklyRatePct = 0.05;
  const weeksDelayed = Math.max(1, Math.round(slipDays / 7));
  const rawDamageCr = (contractValueCr * (weeklyRatePct / 100)) * weeksDelayed;
  const maxCapCr = contractValueCr * 0.10; // 10% statutory cap
  const assessedDamageCr = Math.min(rawDamageCr, maxCapCr);

  const handleInvoke = () => {
    setInvoking(true);
    setTimeout(() => {
      setInvoking(false);
      setInvoked(true);
    }, 850);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 1.5 } }}>
      <DialogTitle sx={{ bgcolor: '#881337', color: '#ffffff', py: 2, px: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1,
                bgcolor: '#4c0519',
                border: '1px solid #9f1239',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fecdd3',
              }}
            >
              <Gavel fontSize="small" />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.8rem' }}>
                Contractual Enforcement &bull; Clause 27
              </Typography>
              <Typography variant="caption" sx={{ color: '#fda4af', fontSize: '0.7rem' }}>
                FORMAL NOTICE OF LIQUIDATED DAMAGES &amp; PERFORMANCE BANK GUARANTEE LIEN
              </Typography>
            </Box>
          </Stack>
          <Button size="small" onClick={onClose} sx={{ minWidth: 'auto', color: '#fda4af', '&:hover': { color: '#ffffff' } }}>
            <Close fontSize="small" />
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: '#f8fafc' }}>
        {invoked ? (
          <Alert
            severity="success"
            icon={<CheckCircle fontSize="inherit" />}
            sx={{ mb: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontWeight: 600 }}
          >
            Statutory 14-day cure notice issued to {contractor}. Performance Bank Guarantee lien registered in PMIS gateway.
          </Alert>
        ) : (
          <Box sx={{ mb: 2, p: 1.5, bgcolor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <WarningAmber sx={{ color: '#be123c', fontSize: 18 }} />
              <Typography variant="caption" sx={{ color: '#9f1239', fontWeight: 700, fontSize: '0.74rem' }}>
                LEGAL PROCEEDING: Invoking liquidated damages for unexcused schedule slip of +{slipDays} calendar days.
              </Typography>
            </Stack>
          </Box>
        )}

        <Box sx={{ bgcolor: '#ffffff', p: 2, borderRadius: 1, border: '1px solid #e2e8f0', mb: 2 }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>
            Target Concessionaire &bull; Contract Package
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>
            {contractor} &bull; {projectCode}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
            {projectName}
          </Typography>

          <Divider sx={{ my: 1.5 }} />

          <Grid container spacing={1.5}>
            <Grid item xs={6}>
              <Box sx={{ bgcolor: '#f8fafc', p: 1.2, borderRadius: 1, border: '1px solid #e2e8f0' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.62rem' }}>
                  Contract Sanction Outlay
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                  ₹{outlayCr.toLocaleString('en-IN')} Cr
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ bgcolor: '#fef2f2', p: 1.2, borderRadius: 1, border: '1px solid #fecaca' }}>
                <Typography variant="caption" sx={{ color: '#b91c1c', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.62rem' }}>
                  Assessed Liquidated Damages
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, color: '#b91c1c', fontSize: '0.9rem' }}>
                  ₹{assessedDamageCr.toFixed(2)} Cr
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ bgcolor: '#ffffff', p: 2, borderRadius: 1, border: '1px solid #e2e8f0' }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>
            Statutory Cure Notice Provisions
          </Typography>
          <Stack spacing={0.8} sx={{ mt: 1 }}>
            <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptLong sx={{ fontSize: 16, color: '#0f172a' }} />
              14-Day Mandatory Cure Window provided to mobilize second paving train.
            </Typography>
            <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountBalance sx={{ fontSize: 16, color: '#0f172a' }} />
              State Bank of India Performance Bank Guarantee (BG-SBI-2020-0914) encashable on default.
            </Typography>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <Button size="small" onClick={onClose} sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.74rem', textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          size="small"
          variant="contained"
          disabled={invoking || invoked}
          startIcon={invoking ? <CircularProgress size={16} color="inherit" /> : invoked ? <CheckCircle fontSize="small" /> : <Gavel fontSize="small" />}
          onClick={handleInvoke}
          sx={{
            bgcolor: invoked ? '#15803d' : '#881337',
            color: '#ffffff',
            '&:hover': { bgcolor: invoked ? '#166534' : '#4c0519' },
            fontWeight: 800,
            fontSize: '0.74rem',
            textTransform: 'none',
            px: 2,
          }}
        >
          {invoking ? 'Issuing Statutory Notice…' : invoked ? 'Notice Dispatched' : 'Issue Formal Cl. 27 Cure Notice'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
