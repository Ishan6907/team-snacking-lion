import { Box, Grid, Card, CardContent, Typography, Skeleton, LinearProgress, Stack, Chip } from '@mui/material';
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
      <Typography variant="h4" sx={{ mb: 3 }}>Sectors</Typography>

      {isLoading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={180} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {data?.map((sector) => {
            const color = SECTOR_COLORS[sector.name] ?? '#90A4AE';
            return (
              <Grid item xs={12} sm={6} md={4} key={sector.id}>
                <Card
                  sx={{ cursor: 'pointer', '&:hover': { borderColor: color, boxShadow: `0 0 0 1px ${color}40` }, transition: 'all 0.2s' }}
                  onClick={() => navigate(`/sectors/${sector.id}`)}
                >
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                      <Typography variant="h6" fontWeight={600}>{sector.name}</Typography>
                      <Chip label={`${sector.projectCount} projects`} size="small" sx={{ bgcolor: `${color}18`, color }} />
                    </Stack>

                    <Stack spacing={1.5}>
                      <Box>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">Avg Progress</Typography>
                          <Typography variant="body2" fontWeight={600}>{sector.avgProgress}%</Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={sector.avgProgress} sx={{ height: 6, borderRadius: 3, mt: 0.5 }} />
                      </Box>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Budget</Typography>
                        <Typography variant="body2" fontWeight={600}>{formatCurrency(sector.totalBudget)}</Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Avg Delay</Typography>
                        <Typography variant="body2" fontWeight={600} color={sector.avgDelay > 180 ? 'error.main' : 'text.primary'}>
                          {sector.avgDelay} days
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">At Risk</Typography>
                        <Typography variant="body2" fontWeight={600} color={sector.atRiskCount > 0 ? 'error.main' : 'success.main'}>
                          {sector.atRiskCount}
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
