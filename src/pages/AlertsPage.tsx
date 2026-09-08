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
  Paper,
} from '@mui/material';
import {
  ErrorOutline,
  WarningAmber,
  InfoOutlined,
  DoneAll,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAlerts, useMarkAlertRead, useMarkAllAlertsRead } from '@/hooks/useAlerts';
import ErrorAlert from '@/components/common/ErrorAlert';
import { formatDate } from '@/utils/formatters';
import type { AlertSeverity } from '@/types/alert';

const severityIcons: Record<AlertSeverity, React.ReactNode> = {
  critical: <ErrorOutline fontSize="small" />,
  warning: <WarningAmber fontSize="small" />,
  info: <InfoOutlined fontSize="small" />,
};
const severityColors: Record<AlertSeverity, string> = {
  critical: '#f87171',
  warning: '#fbbf24',
  info: '#38bdf8',
};

export default function AlertsPage() {
  const [severity, setSeverity] = useState<AlertSeverity | 'all'>('all');
  const navigate = useNavigate();
  const markRead = useMarkAlertRead();
  const markAllRead = useMarkAllAlertsRead();
  const { data, isLoading, error, refetch } = useAlerts({
    page: 0,
    pageSize: 50,
    severity: severity === 'all' ? undefined : severity,
  });

  if (error) return <ErrorAlert message="Failed to load alerts." onRetry={refetch} />;

  return (
    <Box>
      {/* Official Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2.2,
          mb: 3,
          borderRadius: 1,
          border: '1px solid #e2e8f0',
          borderLeft: '4px solid #0b2545',
          bgcolor: '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#0b2545', textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.68rem' }}>
              ESCALATION TELEMETRY FEED
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.3 }}>
              Central Sector Flash Alerts & Bottlenecks
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.2 }}>
              Statutory land acquisition delays, cost overrun warnings, and environmental clearance stall notifications
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            <Button
              size="small"
              variant="outlined"
              startIcon={<DoneAll fontSize="small" />}
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending || !data?.items.some((a) => !a.isRead)}
              sx={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color: '#0b2545',
                borderColor: '#cbd5e1',
                textTransform: 'none',
                py: 0.5,
                px: 1.5,
              }}
            >
              Mark All Read
            </Button>

            <ToggleButtonGroup
              value={severity}
              exclusive
              onChange={(_, v) => v && setSeverity(v)}
              size="small"
              sx={{
                bgcolor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                '& .MuiToggleButton-root': {
                  color: '#475569',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  border: 'none',
                  px: 2,
                  py: 0.5,
                  '&.Mui-selected': {
                    bgcolor: '#0b2545',
                    color: '#ffffff',
                    '&:hover': { bgcolor: '#06172b' },
                  },
                },
              }}
            >
              <ToggleButton value="all">ALL</ToggleButton>
              <ToggleButton value="critical">CRITICAL</ToggleButton>
              <ToggleButton value="warning">WARNING</ToggleButton>
              <ToggleButton value="info">INFO</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
      </Paper>

      <Card sx={{ borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
        <CardContent sx={{ p: 2.5 }}>
          {isLoading ? (
            <Stack spacing={1.5}>
              {[...Array(5)].map((_, i) => <Skeleton key={i} variant="rounded" height={64} sx={{ bgcolor: '#e2e8f0', borderRadius: 1 }} />)}
            </Stack>
          ) : !data?.items.length ? (
            <Typography color="#64748b" textAlign="center" py={5} fontSize="0.88rem">
              No active escalations recorded for this filter.
            </Typography>
          ) : (
            <List disablePadding>
              {data.items.map((alert, idx) => (
                <Box key={alert.id}>
                  {idx > 0 && <Divider sx={{ borderColor: '#e2e8f0' }} />}
                  <ListItem
                    sx={{
                      cursor: 'pointer',
                      bgcolor: alert.isRead ? 'transparent' : '#f8fafc',
                      borderRadius: 1,
                      my: 0.5,
                      p: 1.5,
                      border: '1px solid',
                      borderColor: alert.isRead ? '#f1f5f9' : '#e2e8f0',
                      '&:hover': { bgcolor: '#f1f5f9', borderColor: '#cbd5e1' },
                    }}
                    onClick={() => navigate(`/projects/${alert.projectId}`)}
                    secondaryAction={
                      !alert.isRead ? (
                        <Button
                          size="small"
                          startIcon={<DoneAll fontSize="small" />}
                          onClick={(e) => { e.stopPropagation(); markRead.mutate(alert.id); }}
                          sx={{ color: '#0b2545', fontSize: '0.72rem', fontWeight: 800 }}
                        >
                          Mark Read
                        </Button>
                      ) : undefined
                    }
                  >
                    <ListItemIcon sx={{ color: severityColors[alert.severity], minWidth: 36 }}>
                      {severityIcons[alert.severity]}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>
                            {alert.title}
                          </Typography>
                          <Chip
                            label={alert.severity.toUpperCase()}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.62rem',
                              fontWeight: 800,
                              letterSpacing: 0.5,
                              bgcolor: `${severityColors[alert.severity]}15`,
                              color: severityColors[alert.severity],
                              border: `1px solid ${severityColors[alert.severity]}35`,
                              borderRadius: 0.5,
                            }}
                          />
                        </Stack>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem', display: 'block', mt: 0.3 }}>
                          {alert.projectName} &bull; {alert.sector} &bull; {formatDate(alert.createdAt)}
                        </Typography>
                      }
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
