import { Card, CardContent, Typography, Box, LinearProgress, Stack, Divider } from '@mui/material';
import { Schedule, TrendingUp, ModelTraining } from '@mui/icons-material';
import type { DelayPrediction } from '@/types/prediction';
import { classifyRisk } from '@/utils/formatters';
import { RISK_COLORS } from '@/utils/constants';

interface PredictionCardProps {
  prediction: DelayPrediction;
}

export default function PredictionCard({ prediction }: PredictionCardProps) {
  const riskLevel = classifyRisk(prediction.riskScore);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ML Prediction
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <Schedule fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Predicted Delay
              </Typography>
            </Stack>
            <Typography variant="h3" fontWeight={700} color={RISK_COLORS[riskLevel]}>
              {prediction.predictedDelayDays} <Typography component="span" variant="h6">days</Typography>
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <TrendingUp fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Confidence
              </Typography>
            </Stack>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinearProgress
                variant="determinate"
                value={prediction.confidence * 100}
                sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" fontWeight={600}>
                {(prediction.confidence * 100).toFixed(0)}%
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <ModelTraining fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Risk Score
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={prediction.riskScore * 100}
              color={prediction.riskScore > 0.5 ? 'error' : prediction.riskScore > 0.25 ? 'warning' : 'success'}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          <Typography variant="caption" color="text.secondary">
            Model v{prediction.modelVersion} · Predicted on {new Date(prediction.predictionDate).toLocaleDateString()}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
