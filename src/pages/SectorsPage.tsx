import { Box, Grid, Card, CardContent, Typography, Skeleton, LinearProgress, Stack, Chip, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSectors } from '@/hooks/useSectors';
import ErrorAlert from '@/components/common/ErrorAlert';
import { formatCurrency } from '@/utils/formatters';
import { SECTOR_COLORS } from '@/utils/constants';

export default function SectorsPage() {
  const { data, isLoading, error, refetch } = useSectors();
  const navigate = useNavigate();

  if (error) return <ErrorAlert message="Failed to load sectors." onRetry={refetch} />;

  return (
    <Box>
      {/* Official Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2.2,
          mb: 3,
          borderRadius: 1,
          border: '1px solid #e2e8f0',
          borderLeft: '4px solid #0b2545',
          bgcolor: '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 800, color: '#0b2545', textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.68rem' }}>
          NATIONAL INFRASTRUCTURE SECTORS
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.3 }}>
          Sectoral Progress & Schedule Slippage Oversight
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.2 }}>
          Comprehensive review across Roads & Highways, Railways, Power, Water Resources, Urban Development, and Telecom
        </Typography>
      </Paper>

      {isLoading ? (
        <Grid container spacing={2.5}>
          {[...Array(6)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={190} sx={{ bgcolor: '#e2e8f0', borderRadius: 1 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2.5}>
          {data?.map((sector) => {
            const color = SECTOR_COLORS[sector.name] ?? '#0b2545';
            return (
              <Grid item xs={12} sm={6} md={4} key={sector.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    bgcolor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderTop: `3px solid ${color}`,
                    borderRadius: 1,
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      borderColor: '#cbd5e1',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                  onClick={() => navigate(`/sectors/${sector.id}`)}
                >
                  <CardContent sx={{ p: 2.2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                        {sector.name}
                      </Typography>
                      <Chip
                        label={`${sector.projectCount} Projects`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          bgcolor: `${color}14`,
                          color,
                          border: `1px solid ${color}35`,
                          borderRadius: 0.5,
                        }}
                      />
                    </Stack>

                    <Stack spacing={1.5}>
                      <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>Physical Progress</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a' }}>{sector.avgProgress}%</Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={sector.avgProgress}
                          sx={{ height: 5, borderRadius: 0.5, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: color } }}
                        />
                      </Box>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>Sanctioned Budget</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a' }}>{formatCurrency(sector.totalBudget)}</Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>Weighted Slippage</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: sector.avgDelay > 180 ? '#b91c1c' : '#c2410c' }}>
                          {sector.avgDelay} days (~{Math.round(sector.avgDelay / 30)} mo)
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>Critical / At Risk</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: sector.atRiskCount > 0 ? '#b91c1c' : '#15803d' }}>
                          {sector.atRiskCount} Escalate{sector.atRiskCount === 1 ? 'd' : 'd'}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
