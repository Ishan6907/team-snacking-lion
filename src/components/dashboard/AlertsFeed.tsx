import type { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Button,
  Box,
} from '@mui/material';
import {
  ErrorOutline,
  WarningAmber,
  InfoOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { Alert, AlertSeverity } from '@/types/alert';
import { formatDate } from '@/utils/formatters';

const severityConfig: Record<AlertSeverity, { icon: ReactNode; color: string }> = {
  critical: { icon: <ErrorOutline />, color: '#D32F2F' },
  warning: { icon: <WarningAmber />, color: '#ED6C02' },
  info: { icon: <InfoOutlined />, color: '#1565C0' },
};

interface AlertsFeedProps {
  alerts: Alert[];
}

export default function AlertsFeed({ alerts }: AlertsFeedProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader
        title="Recent Alerts"
        action={
          <Button size="small" onClick={() => navigate('/alerts')}>
            View All
          </Button>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {alerts.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
            No active alerts
          </Typography>
        ) : (
          <List dense disablePadding>
            {alerts.slice(0, 5).map((alert) => {
              const config = severityConfig[alert.severity];
              return (
                <ListItem
                  key={alert.id}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={() => navigate(`/projects/${alert.projectId}`)}
                >
                  <ListItemIcon sx={{ color: config.color, minWidth: 36 }}>
                    {config.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight={600}>
                          {alert.title}
                        </Typography>
                        <Chip label={alert.severity} size="small" sx={{ height: 20, fontSize: 11 }} />
                      </Box>
                    }
                    secondary={`${alert.projectName} · ${formatDate(alert.createdAt)}`}
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
