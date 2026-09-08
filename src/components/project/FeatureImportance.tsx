import { Card, CardContent, Typography, List, ListItem, ListItemText, Box, Chip, Stack } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import type { DelayFactor } from '@/types/prediction';

interface FeatureImportanceProps {
  factors: DelayFactor[];
}

export default function FeatureImportance({ factors }: FeatureImportanceProps) {
  const sorted = [...factors].sort((a, b) => b.importance - a.importance).slice(0, 8);
  const maxImportance = Math.max(...sorted.map((f) => f.importance), 0.01);

  return (
    <Card sx={{ borderRadius: 1, border: '1px solid #e2e8f0', borderTop: '3px solid #0b2545', bgcolor: '#ffffff', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.78rem' }}>
            Parametric Root-Cause Factor Breakdown
          </Typography>
          <Chip label="SHAP Empirical Attribution" size="small" sx={{ height: 22, fontSize: '0.68rem', fontWeight: 700, color: '#1d4ed8', bgcolor: '#eff6ff', border: '1px solid #bfdbfe' }} />
        </Stack>

        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2, fontSize: '0.74rem' }}>
          Variance decomposition of primary statutory, physical, and fiscal bottlenecks impacting project schedule
        </Typography>

        <List dense disablePadding>
          {sorted.map((factor) => {
            const isNegative = factor.direction === 'increases_delay';
            const color = isNegative ? '#b91c1c' : '#15803d';

            return (
              <ListItem key={factor.name} disableGutters sx={{ py: 0.8, borderBottom: '1px solid #f1f5f9' }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {isNegative ? (
                          <ArrowUpward sx={{ fontSize: 16, color }} />
                        ) : (
                          <ArrowDownward sx={{ fontSize: 16, color }} />
                        )}
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.82rem' }}>
                          {factor.displayName}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="caption" sx={{ fontWeight: 700, color, fontSize: '0.72rem' }}>
                          {isNegative ? '+ Slippage Driver' : '- Risk Mitigation'}
                        </Typography>
                        <Chip
                          label={String(factor.value)}
                          size="small"
                          sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700, bgcolor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#0f172a' }}
                        />
                      </Stack>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.6 }}>
                      <Box
                        sx={{
                          height: 5,
                          borderRadius: 0.5,
                          bgcolor: '#f1f5f9',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${(factor.importance / maxImportance) * 100}%`,
                            bgcolor: color,
                            borderRadius: 0.5,
                          }}
                        />
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
}
