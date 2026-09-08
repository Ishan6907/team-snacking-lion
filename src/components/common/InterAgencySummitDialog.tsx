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
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Groups,
  CheckCircle,
  Close,
  EventAvailable,
  LocationOn,
} from '@mui/icons-material';

interface InterAgencySummitDialogProps {
  open: boolean;
  onClose: () => void;
  projectCode?: string;
  projectName?: string;
}

export default function InterAgencySummitDialog({
  open,
  onClose,
  projectCode = 'NHAI-DEL-MUM-P4',
  projectName = 'Delhi-Mumbai Expressway (Vadodara–Kim Section Package 4)',
}: InterAgencySummitDialogProps) {
  const [scheduling, setScheduling] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  const handleSchedule = () => {
    setScheduling(true);
    setTimeout(() => {
      setScheduling(false);
      setScheduled(true);
    }, 800);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 1.5 } }}>
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
                color: '#38bdf8',
              }}
            >
              <Groups fontSize="small" />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.8rem' }}>
                MoRTH Inter-Agency Summit
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                PARIVESH &bull; PM GATISHAKTI NETWORK PLANNING GROUP (NPG)
              </Typography>
            </Box>
          </Stack>
          <Button size="small" onClick={onClose} sx={{ minWidth: 'auto', color: '#94a3b8', '&:hover': { color: '#ffffff' } }}>
            <Close fontSize="small" />
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: '#f8fafc' }}>
        {scheduled ? (
          <Alert
            severity="success"
            icon={<CheckCircle fontSize="inherit" />}
            sx={{ mb: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontWeight: 600 }}
          >
            Inter-Agency Summit summons successfully issued to MoEFCC, NHAI, Gujarat Forest Dept, and Concessionaire. Calendar invites synced via NIC GovMail.
          </Alert>
        ) : null}

        <Box sx={{ bgcolor: '#ffffff', p: 2, borderRadius: 1, border: '1px solid #e2e8f0', mb: 2 }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>
            Escalated Package Dossier
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>
            {projectCode} &bull; {projectName}
          </Typography>

          <Divider sx={{ my: 1.5 }} />

          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>
            Mandatory Summit Attendees
          </Typography>
          <Stack spacing={0.6} sx={{ mt: 0.8 }}>
            <Chip label="1. Secretary, Ministry of Environment, Forest & Climate Change (MoEFCC)" size="small" sx={{ justifyContent: 'flex-start', bgcolor: '#f8fafc', height: 24, fontSize: '0.72rem' }} />
            <Chip label="2. Member (Projects), National Highways Authority of India (NHAI)" size="small" sx={{ justifyContent: 'flex-start', bgcolor: '#f8fafc', height: 24, fontSize: '0.72rem' }} />
            <Chip label="3. Principal Chief Conservator of Forests (PCCF), Gujarat State" size="small" sx={{ justifyContent: 'flex-start', bgcolor: '#f8fafc', height: 24, fontSize: '0.72rem' }} />
            <Chip label="4. District Collector & LAO, Vadodara District" size="small" sx={{ justifyContent: 'flex-start', bgcolor: '#f8fafc', height: 24, fontSize: '0.72rem' }} />
            <Chip label="5. Executive Director & Project Head, Dilip Buildcon Ltd." size="small" sx={{ justifyContent: 'flex-start', bgcolor: '#f8fafc', height: 24, fontSize: '0.72rem' }} />
          </Stack>
        </Box>

        <Box sx={{ bgcolor: '#ffffff', p: 2, borderRadius: 1, border: '1px solid #e2e8f0' }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <EventAvailable sx={{ fontSize: 16, color: '#0f172a' }} />
            <Typography variant="caption" sx={{ color: '#0f172a', fontWeight: 800, fontSize: '0.72rem' }}>
              Scheduled Hearing: Thursday, 14:30 IST &bull; Hybrid Video Conference
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <LocationOn sx={{ fontSize: 16, color: '#64748b' }} />
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
              Venue: Transport Bhawan Committee Room 301, New Delhi / NIC GovMeet
            </Typography>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <Button size="small" onClick={onClose} sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.74rem', textTransform: 'none' }}>
          Close
        </Button>
        <Button
          size="small"
          variant="contained"
          disabled={scheduling || scheduled}
          startIcon={scheduling ? <CircularProgress size={16} color="inherit" /> : scheduled ? <CheckCircle fontSize="small" /> : <Groups fontSize="small" />}
          onClick={handleSchedule}
          sx={{
            bgcolor: scheduled ? '#15803d' : '#0f172a',
            color: '#ffffff',
            '&:hover': { bgcolor: scheduled ? '#166534' : '#1e293b' },
            fontWeight: 800,
            fontSize: '0.74rem',
            textTransform: 'none',
            px: 2,
          }}
        >
          {scheduling ? 'Issuing Summons…' : scheduled ? 'Summit Convened' : 'Convene Inter-Agency Summit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
