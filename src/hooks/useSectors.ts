import { useQuery } from '@tanstack/react-query';
import { sectorsApi } from '@/api/sectors';

export function useSectors() {
  return useQuery({
    queryKey: ['sectors'],
    queryFn: () => sectorsApi.list(),
  });
}

export function useSector(sectorId: string) {
  return useQuery({
    queryKey: ['sector', sectorId],
    queryFn: () => sectorsApi.getById(sectorId),
    enabled: !!sectorId,
  });
}
