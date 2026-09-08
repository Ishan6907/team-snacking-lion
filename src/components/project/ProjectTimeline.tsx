import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import { Circle } from '@mui/icons-material';
import type { Project } from '@/types/project';
import { formatDate } from '@/utils/formatters';

interface ProjectTimelineProps {
  project: Project;
}

interface TimelineEvent {
  date: string;
  label: string;
  color: string;
  isPast: boolean;
}

export default function ProjectTimeline({ project }: ProjectTimelineProps) {
  const now = new Date();
  const events: TimelineEvent[] = [
    {
      date: project.startDate,
      label: 'Sanctioned Commencement',
      color: '#0284c7',
      isPast: new Date(project.startDate) <= now,
    },
    {
      date: project.expectedCompletion,
      label: 'Original Target Completion',
      color: '#15803d',
      isPast: new Date(project.expectedCompletion) <= now,
    },
  ];

  if (project.revisedCompletion) {
    events.push({
      date: project.revisedCompletion,
      label: 'Revised Target Milestone (Delayed)',
      color: '#b91c1c',
      isPast: new Date(project.revisedCompletion) <= now,
    });
  }

  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card sx={{ borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.78rem', mb: 2 }}>
          Milestone Progression Trajectory
        </Typography>
        <Stack spacing={0}>
          {events.map((event, idx) => (
            <Box key={idx} sx={{ display: 'flex', gap: 2, pb: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Circle sx={{ fontSize: 13, color: event.color, opacity: event.isPast ? 1 : 0.45 }} />
                {idx < events.length - 1 && (
                  <Box sx={{ width: 2, flexGrow: 1, bgcolor: '#e2e8f0', my: 0.5 }} />
                )}
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>
                  {event.label}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {formatDate(event.date)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
