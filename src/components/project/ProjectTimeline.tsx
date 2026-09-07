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
      label: 'Project Start',
      color: '#1565C0',
      isPast: new Date(project.startDate) <= now,
    },
    {
      date: project.expectedCompletion,
      label: 'Expected Completion',
      color: '#2E7D32',
      isPast: new Date(project.expectedCompletion) <= now,
    },
  ];

  if (project.revisedCompletion) {
    events.push({
      date: project.revisedCompletion,
      label: 'Revised Completion',
      color: '#D32F2F',
      isPast: new Date(project.revisedCompletion) <= now,
    });
  }

  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Project Timeline
        </Typography>
        <Stack spacing={0}>
          {events.map((event, idx) => (
            <Box key={idx} sx={{ display: 'flex', gap: 2, pb: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Circle sx={{ fontSize: 14, color: event.color, opacity: event.isPast ? 1 : 0.4 }} />
                {idx < events.length - 1 && (
                  <Box sx={{ width: 2, flexGrow: 1, bgcolor: 'divider', my: 0.5 }} />
                )}
              </Box>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {event.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
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
