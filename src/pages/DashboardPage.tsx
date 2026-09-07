import { useState } from 'react';
import { Grid, Typography, Box, Skeleton } from '@mui/material';
import KPICards from '@/components/dashboard/KPICards';
import PortfolioSummaryTable from '@/components/project/PortfolioSummaryTable';
import AlertsFeed from '@/components/dashboard/AlertsFeed';
import IndiaHeatmap from '@/components/dashboard/IndiaHeatmap';
import SectorBarChart from '@/components/dashboard/SectorBarChart';
import DelayDistributionChart from '@/components/dashboard/DelayDistributionChart';
import ErrorAlert from '@/components/common/ErrorAlert';
import { useProjects, useProjectsByState } from '@/hooks/useProjects';
import { usePortfolioSummary } from '@/hooks/usePredictions';
import { useAlerts } from '@/hooks/useAlerts';
import type { ProjectFilters } from '@/types/project';

export default function DashboardPage() {
  const [filters, setFilters] = useState<ProjectFilters>({ page: 0, pageSize: 10 });
  const projectsQuery = useProjects(filters);
  const stateQuery = useProjectsByState();
  const portfolioQuery = usePortfolioSummary();
  const alertsQuery = useAlerts({ page: 0, pageSize: 5 });

  const portfolio = portfolioQuery.data;
  const anyError = projectsQuery.error || portfolioQuery.error;

  if (anyError) {
    return <ErrorAlert message="Failed to load dashboard data. The app is running in demo mode." onRetry={() => { projectsQuery.refetch(); portfolioQuery.refetch(); }} />;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      {/* KPI Cards */}
      <Box sx={{ mb: 3 }}>
        {portfolioQuery.isLoading ? (
          <Grid container spacing={3}>
            {[...Array(4)].map((_, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton variant="rounded" height={120} />
              </Grid>
            ))}
          </Grid>
        ) : portfolio ? (
          <KPICards
            totalProjects={portfolio.totalProjects}
            atRiskCount={portfolio.atRiskCount}
            avgPredictedDelay={portfolio.avgPredictedDelay}
          />
        ) : null}
      </Box>

      {/* Main grid */}
      <Grid container spacing={3}>
        {/* Project Table */}
        <Grid item xs={12}>
          <PortfolioSummaryTable
            projects={projectsQuery.data?.items ?? []}
            total={projectsQuery.data?.total ?? 0}
            page={filters.page}
            pageSize={filters.pageSize}
            onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
            onPageSizeChange={(s) => setFilters((f) => ({ ...f, pageSize: s, page: 0 }))}
            isLoading={projectsQuery.isLoading}
          />
        </Grid>

        {/* Heatmap + Sector Chart */}
        <Grid item xs={12} md={6}>
          {stateQuery.isLoading ? (
            <Skeleton variant="rounded" height={400} />
          ) : stateQuery.data ? (
            <IndiaHeatmap data={stateQuery.data} />
          ) : null}
        </Grid>
        <Grid item xs={12} md={6}>
          {portfolio ? (
            <SectorBarChart data={portfolio.sectorBreakdown} />
          ) : (
            <Skeleton variant="rounded" height={400} />
          )}
        </Grid>

        {/* Delay Distribution + Alerts */}
        <Grid item xs={12} md={6}>
          {portfolio ? (
            <DelayDistributionChart data={portfolio.delayDistribution} />
          ) : (
            <Skeleton variant="rounded" height={350} />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <AlertsFeed alerts={alertsQuery.data?.items ?? []} />
        </Grid>
      </Grid>
    </Box>
  );
}
