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
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from '@mui/material';
import {
  CompareArrows,
  Close,
  GetApp,
} from '@mui/icons-material';
import { ProjectRow } from '@/data/inventoryData';

interface PackageComparisonDialogProps {
  open: boolean;
  onClose: () => void;
  selectedProjects: ProjectRow[];
}

export default function PackageComparisonDialog({
  open,
  onClose,
  selectedProjects,
}: PackageComparisonDialogProps) {
  const handleExportComparison = () => {
    const headers = ['Package ID', 'Corridor Name', 'State', 'Agency', 'Contractor', 'Sanctioned Outlay (Cr)', 'Actual %', 'Planned %', 'Variance %', 'Forecast Slip (Days)', 'Severity'];
    const rows = selectedProjects.map((p) => [
      `"${p.id}"`,
      `"${p.name}"`,
      `"${p.state}"`,
      `"${p.agency}"`,
      `"${p.contractor}"`,
      p.outlayCr,
      p.actualPct,
      p.plannedPct,
      p.progressDiff,
      p.predictedDelayDays,
      `"${p.riskSeverity}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `package_baseline_comparison_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 1.5 } }}>
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
              <CompareArrows fontSize="small" />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.82rem' }}>
                Multi-Package Baseline &amp; Schedule Slippage Comparison
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                Cross-Package DPR Milestone Variance &bull; {selectedProjects.length} Packages Monitored
              </Typography>
            </Box>
          </Stack>
          <Button size="small" onClick={onClose} sx={{ minWidth: 'auto', color: '#94a3b8', '&:hover': { color: '#ffffff' } }}>
            <Close fontSize="small" />
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: '#f8fafc' }}>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 1 }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#0f172a' }}>
              <TableRow>
                <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>Package ID</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>Corridor / Location</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>Agency / Contractor</TableCell>
                <TableCell align="right" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>Outlay (₹ Cr)</TableCell>
                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>Actual / Planned</TableCell>
                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>Progress Gap</TableCell>
                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>Projected Slip</TableCell>
                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>Severity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProjects.map((p) => {
                const isCritical = p.predictedDelayDays >= 90;
                const isModerate = p.predictedDelayDays >= 31 && p.predictedDelayDays < 90;
                return (
                  <TableRow key={p.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: '#f8fafc' } }}>
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.74rem' }}>{p.id}</TableCell>
                    <TableCell sx={{ fontSize: '0.74rem', maxWidth: 220 }}>
                      <strong>{p.name}</strong>
                      <Typography variant="caption" sx={{ display: 'block', color: '#64748b' }}>
                        {p.state} &bull; {p.chainage}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.74rem' }}>
                      {p.contractor}
                      <Typography variant="caption" sx={{ display: 'block', color: '#64748b' }}>
                        {p.agency} ({p.sector})
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '0.74rem' }}>
                      ₹{p.outlayCr.toLocaleString('en-IN')} Cr
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.74rem' }}>
                      <strong>{p.actualPct}%</strong> vs {p.plannedPct}%
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.74rem', fontWeight: 800, color: p.progressDiff < 0 ? '#b91c1c' : '#15803d' }}>
                      {p.progressDiff}%
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.74rem', fontWeight: 800, color: isCritical ? '#b91c1c' : isModerate ? '#d97706' : '#15803d' }}>
                      +{p.predictedDelayDays} Days
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={p.riskSeverity.toUpperCase()}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          bgcolor: isCritical ? '#fee2e2' : isModerate ? '#fef3c7' : '#dcfce7',
                          color: isCritical ? '#b91c1c' : isModerate ? '#d97706' : '#15803d',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<GetApp fontSize="small" />}
          onClick={handleExportComparison}
          sx={{ borderColor: '#cbd5e1', color: '#334155', fontWeight: 700, fontSize: '0.74rem', textTransform: 'none' }}
        >
          Export Comparison (.CSV)
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button size="small" onClick={onClose} sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.74rem', textTransform: 'none' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
