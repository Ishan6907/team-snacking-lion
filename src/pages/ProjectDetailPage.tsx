import { Box, Grid, Skeleton, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import ProjectHeader from '@/components/project/ProjectHeader';
import ProjectTimeline from '@/components/project/ProjectTimeline';
import PredictionCard from '@/components/project/PredictionCard';
import FeatureImportance from '@/components/project/FeatureImportance';
import FactorWaterfallChart from '@/components/project/FactorWaterfallChart';
import RiskTrendChart from '@/components/project/RiskTrendChart';
import ErrorAlert from '@/components/common/ErrorAlert';
import { useProject } from '@/hooks/useProjects';
import { usePrediction, usePredictionTrend } from '@/hooks/usePredictions';

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const projectQuery = useProject(projectId ?? '');
  const predictionQuery = usePrediction(projectId ?? '');
  const trendQuery = usePredictionTrend(projectId ?? '');

  if (projectQuery.error) {
    return <ErrorAlert message="Failed to load project details." onRetry={() => projectQuery.refetch()} />;
  }

  if (projectQuery.isLoading) {
    return (
      <Box>
        <Skeleton variant="rounded" height={100} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={300} />
      </Box>
    );
  }

  const project = projectQuery.data;
  if (!project) return <Typography>Project not found.</Typography>;

  return (
    <Box>
      <ProjectHeader project={project} />

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Timeline */}
        <Grid item xs={12}>
          <ProjectTimeline project={project} />
        </Grid>

        {/* Prediction Card + Feature Importance */}
        <Grid item xs={12} md={4}>
          {predictionQuery.isLoading ? (
            <Skeleton variant="rounded" height={350} />
          ) : predictionQuery.data ? (
            <PredictionCard prediction={predictionQuery.data} />
          ) : null}
        </Grid>
        <Grid item xs={12} md={8}>
          {predictionQuery.isLoading ? (
            <Skeleton variant="rounded" height={350} />
          ) : predictionQuery.data ? (
            <FeatureImportance factors={predictionQuery.data.factors} />
          ) : null}
        </Grid>

        {/* Factor Waterfall */}
        <Grid item xs={12}>
          {predictionQuery.data ? (
            <FactorWaterfallChart factors={predictionQuery.data.factors} />
          ) : null}
        </Grid>

        {/* Risk Trend */}
        <Grid item xs={12}>
          {trendQuery.isLoading ? (
            <Skeleton variant="rounded" height={350} />
          ) : trendQuery.data ? (
            <RiskTrendChart data={trendQuery.data} />
          ) : null}
        </Grid>
      </Grid>
    </Box>
  );
}
