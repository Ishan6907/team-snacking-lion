import { Grid, Card, CardContent, Typography, Box, Stack } from '@mui/material';
import {
  AccountTree as ProjectsIcon,
  WarningAmber as RiskIcon,
  HistoryToggleOff as DelayIcon,
  AccountBalance as CostIcon,
} from '@mui/icons-material';

interface KPICardsProps {
  totalProjects: number;
  atRiskCount: number;
  avgPredictedDelay: number;
  totalCostOverrunCr?: number;
  totalSanctionedCr?: number;
}

export default function KPICards({
  totalProjects,
  atRiskCount,
  avgPredictedDelay,
  totalCostOverrunCr = 224788,
  totalSanctionedCr = 609299,
}: KPICardsProps) {
  const riskPct = totalProjects > 0 ? ((atRiskCount / totalProjects) * 100).toFixed(1) : '0';
  const overrunPct = totalSanctionedCr > 0 ? ((totalCostOverrunCr / totalSanctionedCr) * 100).toFixed(1) : '36.9';

  const cards = [
    {
      label: 'Total Monitored Projects',
      sublabel: 'Central Sector (≥ ₹150 Crore)',
      value: totalProjects.toLocaleString(),
      unit: 'Projects',
      badge: '100% Active OCMS',
      badgeColor: '#0b2545',
      badgeBg: '#eff6ff',
      icon: <ProjectsIcon fontSize="small" />,
      accentColor: '#0b2545',
    },
    {
      label: 'Schedule Slippage Identified',
      sublabel: `${riskPct}% of Central Portfolio`,
      value: atRiskCount.toLocaleString(),
      unit: 'Projects Delayed',
      badge: `${riskPct}% Slippage Rate`,
      badgeColor: '#dc2626',
      badgeBg: '#fef2f2',
      icon: <RiskIcon fontSize="small" />,
      accentColor: '#dc2626',
    },
    {
      label: 'Weighted Average Slippage',
      sublabel: 'Across active contract milestones',
      value: avgPredictedDelay.toLocaleString(),
      unit: 'Days',
      badge: `${(avgPredictedDelay / 30).toFixed(1)} Months Avg`,
      badgeColor: '#d97706',
      badgeBg: '#fffbeb',
      icon: <DelayIcon fontSize="small" />,
      accentColor: '#d97706',
    },
    {
      label: 'Cumulative Cost Escalation',
      sublabel: 'Recorded across monitored portfolio',
      value: `₹${totalCostOverrunCr.toLocaleString('en-IN')}`,
      unit: 'Crore Overrun',
      badge: `+${overrunPct}% Capital Drift`,
      badgeColor: '#c2410c',
      badgeBg: '#fff7ed',
      icon: <CostIcon fontSize="small" />,
      accentColor: '#c2410c',
    },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={3} key={card.label}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 1,
              border: '1px solid #e2e8f0',
              borderTop: `3px solid ${card.accentColor}`,
              bgcolor: '#ffffff',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
              '&:hover': {
                borderColor: '#cbd5e1',
                transform: 'translateY(-1px)',
              },
            }}
          >
            <CardContent sx={{ p: 2.2, '&:last-child': { pb: 2.2 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.68rem' }}>
                  {card.label}
                </Typography>
                <Box
                  sx={{
                    p: 0.6,
                    borderRadius: 1,
                    bgcolor: card.badgeBg,
                    color: card.accentColor,
                    display: 'flex',
                    border: `1px solid ${card.badgeColor}25`,
                  }}
                >
                  {card.icon}
                </Box>
              </Stack>

              <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 0.5 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', fontFamily: 'monospace' }}>
                  {card.value}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.78rem' }}>
                  {card.unit}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.2 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                  {card.sublabel}
                </Typography>
                <Box
                  component="span"
                  sx={{
                    px: 1,
                    py: 0.2,
                    borderRadius: 0.5,
                    bgcolor: card.badgeBg,
                    color: card.badgeColor,
                    fontSize: '0.64rem',
                    fontWeight: 800,
                    letterSpacing: 0.5,
                    border: `1px solid ${card.badgeColor}35`,
                    fontFamily: 'monospace',
                  }}
                >
                  {card.badge}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
