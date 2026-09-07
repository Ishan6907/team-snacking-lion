import { useState } from 'react';
import { Box, Typography, Skeleton, Button, Stack } from '@mui/material';
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
  if (sectorQuery.isLoading) return <Skeleton variant="rounded" height={400} />;

  const sector = sectorQuery.data;

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/sectors')}>Back</Button>
        <Typography variant="h4">{sector?.name ?? 'Sector'}</Typography>
      </Stack>

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
