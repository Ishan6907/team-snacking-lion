import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsApi } from '@/api/alerts';
import type { AlertFilters } from '@/types/alert';

export function useAlerts(filters: AlertFilters) {
  return useQuery({
    queryKey: ['alerts', filters],
    queryFn: () => alertsApi.list(filters),
  });
}

export function useUnreadAlertCount() {
  return useQuery({
    queryKey: ['alerts-unread-count'],
    queryFn: () => alertsApi.getUnreadCount(),
    refetchInterval: 60_000,
  });
}

export function useMarkAlertRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (alertId: string) => alertsApi.markAsRead(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alerts-unread-count'] });
    },
  });
}
