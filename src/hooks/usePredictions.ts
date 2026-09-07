import { useQuery } from '@tanstack/react-query';
import { predictionsApi } from '@/api/predictions';

export function usePrediction(projectId: string) {
  return useQuery({
    queryKey: ['prediction', projectId],
    queryFn: () => predictionsApi.getForProject(projectId),
    enabled: !!projectId,
  });
}

export function usePredictionTrend(projectId: string) {
  return useQuery({
    queryKey: ['prediction-trend', projectId],
    queryFn: () => predictionsApi.getTrend(projectId),
    enabled: !!projectId,
  });
}

export function usePortfolioSummary() {
  return useQuery({
    queryKey: ['portfolio-summary'],
    queryFn: () => predictionsApi.getPortfolioSummary(),
  });
}
