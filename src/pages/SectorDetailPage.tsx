import { useState } from 'react';
import { Box, Typography, Skeleton, Button, Stack, Paper } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSector } from '@/hooks/useSectors';
import { useProjects } from '@/hooks/useProjects';
import PortfolioSummaryTable from '@/components/project/PortfolioSummaryTable';
import ErrorAlert from '@/components/common/ErrorAlert';
import type { ProjectFilters } from '@/types/project';

export default function SectorDetailPage() {
  const { sectorId } = useParams<{ sectorId: string }>();
  const navigate = useNavigate();
  const sectorQuery = useSector(sectorId ?? '');
  const [filters, setFilters] = useState<ProjectFilters>({ page: 0, pageSize: 10, sector: sectorQuery.data?.name });
  const projectsQuery = useProjects({ ...filters, sector: sectorQuery.data?.name });

  if (sectorQuery.error) return <ErrorAlert message="Failed to load sector." onRetry={() => sectorQuery.refetch()} />;
  if (sectorQuery.isLoading) return <Skeleton variant="rounded" height={400} sx={{ bgcolor: '#e2e8f0' }} />;

  const sector = sectorQuery.data;

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 1,
          border: '1px solid #e2e8f0',
          borderLeft: '4px solid #0b2545',
          bgcolor: '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBack fontSize="small" />}
            onClick={() => navigate('/sectors')}
            sx={{
              borderColor: '#cbd5e1',
              color: '#0b2545',
              fontSize: '0.74rem',
              fontWeight: 800,
              '&:hover': { borderColor: '#0b2545', bgcolor: '#f1f5f9' },
            }}
          >
            Sectors Index
          </Button>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.65rem' }}>
              SECTOR REPOSITORY
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
              {sector?.name ?? 'Infrastructure Sector'}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <PortfolioSummaryTable
        projects={projectsQuery.data?.items ?? []}
        total={projectsQuery.data?.total ?? 0}
        page={filters.page}
        pageSize={filters.pageSize}
        onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
        onPageSizeChange={(s) => setFilters((f) => ({ ...f, pageSize: s, page: 0 }))}
        isLoading={projectsQuery.isLoading}
      />
    </Box>
  );
}
