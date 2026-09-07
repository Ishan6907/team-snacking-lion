import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '@/api/projects';
import type { ProjectFilters } from '@/types/project';

export function useProjects(filters: ProjectFilters) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectsApi.list(filters),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
  });
}

export function useProjectsByState() {
  return useQuery({
    queryKey: ['projects-by-state'],
    queryFn: () => projectsApi.getByState(),
  });
}
