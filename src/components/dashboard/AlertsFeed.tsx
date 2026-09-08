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
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { Alert, AlertSeverity } from '@/types/alert';
import { formatDate } from '@/utils/formatters';

const severityConfig: Record<AlertSeverity, { icon: ReactNode; color: string; bg: string }> = {
  critical: { icon: <ErrorOutline fontSize="small" />, color: '#b91c1c', bg: '#fef2f2' },
  warning: { icon: <WarningAmber fontSize="small" />, color: '#c2410c', bg: '#fff7ed' },
  info: { icon: <InfoOutlined fontSize="small" />, color: '#1d4ed8', bg: '#eff6ff' },
};

interface AlertsFeedProps {
  alerts: Alert[];
}

export default function AlertsFeed({ alerts }: AlertsFeedProps) {
  const navigate = useNavigate();

  return (
    <Card sx={{ borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
      <CardHeader
        title={
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.78rem' }}>
            Active Escalations & Flash Alerts
          </Typography>
        }
        action={
          <Button
            size="small"
            endIcon={<ArrowForward fontSize="small" />}
            onClick={() => navigate('/alerts')}
            sx={{ color: '#0b2545', fontSize: '0.74rem', fontWeight: 800 }}
          >
            All Alerts ({alerts.length})
          </Button>
        }
        sx={{ pb: 1 }}
      />
      <CardContent sx={{ pt: 0, px: 2, pb: 2 }}>
        {alerts.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
            No active escalations recorded
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
                    mb: 0.8,
                    p: 1.2,
                    cursor: 'pointer',
                    bgcolor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.15s ease',
                    '&:hover': { bgcolor: '#f1f5f9', borderColor: '#cbd5e1' },
                  }}
                  onClick={() => navigate(`/projects/${alert.projectId}`)}
                >
                  <ListItemIcon sx={{ color: config.color, minWidth: 32 }}>
                    {config.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.8rem' }}>
                          {alert.title}
                        </Typography>
                        <Chip
                          label={alert.severity.toUpperCase()}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.6rem',
                            fontWeight: 800,
                            letterSpacing: 0.5,
                            bgcolor: config.bg,
                            color: config.color,
                            border: `1px solid ${config.color}35`,
                            borderRadius: 0.5,
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem', display: 'block', mt: 0.2 }}>
                        {alert.projectName} &bull; {formatDate(alert.createdAt)}
                      </Typography>
                    }
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
