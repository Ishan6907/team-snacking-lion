import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  Assessment as ProjectsIcon,
  Warning as RiskIcon,
  Schedule as DelayIcon,
  TrendingUp as TrendIcon,
} from '@mui/icons-material';

interface KPICardsProps {
  totalProjects: number;
  atRiskCount: number;
  avgPredictedDelay: number;
}

export default function KPICards({ totalProjects, atRiskCount, avgPredictedDelay }: KPICardsProps) {
  const riskPct = totalProjects > 0 ? ((atRiskCount / totalProjects) * 100).toFixed(1) : '0';

  const cards = [
    {
      label: 'Total Projects',
      value: totalProjects.toLocaleString(),
      icon: <ProjectsIcon />,
      color: '#1565C0',
    },
    {
      label: 'At Risk',
      value: atRiskCount.toLocaleString(),
      subtitle: `${riskPct}% of portfolio`,
      icon: <RiskIcon />,
      color: '#D32F2F',
    },
    {
      label: 'Avg Predicted Delay',
      value: `${avgPredictedDelay} days`,
      icon: <DelayIcon />,
      color: '#FF8F00',
    },
    {
      label: 'Model Confidence',
      value: '87%',
      subtitle: 'Across portfolio',
      icon: <TrendIcon />,
      color: '#2E7D32',
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={3} key={card.label}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {card.label}
                  </Typography>
                  <Typography variant="h4" sx={{ color: card.color, fontWeight: 700 }}>
                    {card.value}
                  </Typography>
                  {card.subtitle && (
                    <Typography variant="caption" color="text.secondary">
                      {card.subtitle}
                    </Typography>
                  )}
                </Box>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    bgcolor: `${card.color}14`,
                    color: card.color,
                    display: 'flex',
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
