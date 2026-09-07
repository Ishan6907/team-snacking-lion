import { Card, CardContent, Typography, List, ListItem, ListItemText, Box, Chip } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import type { DelayFactor } from '@/types/prediction';

interface FeatureImportanceProps {
  factors: DelayFactor[];
}

export default function FeatureImportance({ factors }: FeatureImportanceProps) {
  const sorted = [...factors].sort((a, b) => b.importance - a.importance).slice(0, 8);
  const maxImportance = Math.max(...sorted.map((f) => f.importance), 0.01);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Why this prediction?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Top factors driving the delay prediction for this project.
        </Typography>
        <List dense disablePadding>
          {sorted.map((factor) => (
            <ListItem key={factor.name} disableGutters sx={{ py: 0.5 }}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {factor.direction === 'increases_delay' ? (
                      <TrendingUp fontSize="small" sx={{ color: '#D32F2F' }} />
                    ) : (
                      <TrendingDown fontSize="small" sx={{ color: '#2E7D32' }} />
                    )}
                    <Typography variant="body2" fontWeight={500}>
                      {factor.displayName}
                    </Typography>
                    <Chip
                      label={String(factor.value)}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: 11 }}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    <Box
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'grey.100',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: `${(factor.importance / maxImportance) * 100}%`,
                          bgcolor:
                            factor.direction === 'increases_delay' ? '#D32F2F' : '#2E7D32',
                          borderRadius: 3,
                        }}
                      />
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
