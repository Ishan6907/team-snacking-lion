import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Skeleton,
  Divider,
} from '@mui/material';
import {
  ErrorOutline,
  WarningAmber,
  InfoOutlined,
  DoneAll,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAlerts, useMarkAlertRead } from '@/hooks/useAlerts';
import ErrorAlert from '@/components/common/ErrorAlert';
import { formatDate } from '@/utils/formatters';
import type { AlertSeverity } from '@/types/alert';

const severityIcons: Record<AlertSeverity, React.ReactNode> = {
  critical: <ErrorOutline />,
  warning: <WarningAmber />,
  info: <InfoOutlined />,
};
const severityColors: Record<AlertSeverity, string> = {
  critical: '#D32F2F',
  warning: '#ED6C02',
  info: '#1565C0',
};

export default function AlertsPage() {
  const [severity, setSeverity] = useState<AlertSeverity | 'all'>('all');
  const navigate = useNavigate();
  const markRead = useMarkAlertRead();
  const { data, isLoading, error, refetch } = useAlerts({
    page: 0,
    pageSize: 50,
    severity: severity === 'all' ? undefined : severity,
  });

  if (error) return <ErrorAlert message="Failed to load alerts." onRetry={refetch} />;

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">Alerts</Typography>
        <ToggleButtonGroup
          value={severity}
          exclusive
          onChange={(_, v) => v && setSeverity(v)}
          size="small"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="critical">Critical</ToggleButton>
          <ToggleButton value="warning">Warning</ToggleButton>
          <ToggleButton value="info">Info</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Card>
        <CardContent>
          {isLoading ? (
            <Stack spacing={1}>
              {[...Array(5)].map((_, i) => <Skeleton key={i} variant="rounded" height={60} />)}
            </Stack>
          ) : !data?.items.length ? (
            <Typography color="text.secondary" textAlign="center" py={4}>
              No alerts found.
            </Typography>
          ) : (
            <List disablePadding>
              {data.items.map((alert, idx) => (
                <Box key={alert.id}>
                  {idx > 0 && <Divider />}
                  <ListItem
                    sx={{
                      cursor: 'pointer',
                      bgcolor: alert.isRead ? 'transparent' : 'action.hover',
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.selected' },
                    }}
                    onClick={() => navigate(`/projects/${alert.projectId}`)}
                    secondaryAction={
                      !alert.isRead ? (
                        <Button size="small" startIcon={<DoneAll />} onClick={(e) => { e.stopPropagation(); markRead.mutate(alert.id); }}>
                          Mark read
                        </Button>
                      ) : undefined
                    }
                  >
                    <ListItemIcon sx={{ color: severityColors[alert.severity], minWidth: 40 }}>
                      {severityIcons[alert.severity]}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" fontWeight={600}>{alert.title}</Typography>
                          <Chip label={alert.severity} size="small" sx={{ height: 20, fontSize: 11, bgcolor: `${severityColors[alert.severity]}18`, color: severityColors[alert.severity] }} />
                        </Stack>
                      }
                      secondary={`${alert.projectName} · ${alert.sector} · ${formatDate(alert.createdAt)}`}
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
