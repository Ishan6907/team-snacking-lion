import { Card, CardContent, Typography, Box, LinearProgress, Stack, Divider, Chip } from '@mui/material';
import { Schedule, Assessment, FactCheck } from '@mui/icons-material';
import type { DelayPrediction } from '@/types/prediction';
import { classifyRisk } from '@/utils/formatters';
import { RISK_COLORS } from '@/utils/constants';

interface PredictionCardProps {
  prediction: DelayPrediction;
}

export default function PredictionCard({ prediction }: PredictionCardProps) {
  const riskLevel = classifyRisk(prediction.riskScore);

  return (
    <Card sx={{ borderRadius: 1, border: '1px solid #e2e8f0', borderTop: '3px solid #0b2545', bgcolor: '#ffffff', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.78rem' }}>
            Schedule Slippage Diagnostic
          </Typography>
          <Chip
            label={riskLevel.toUpperCase() + ' RISK'}
            size="small"
            sx={{
              fontWeight: 800,
              fontSize: '0.65rem',
              bgcolor: `${RISK_COLORS[riskLevel]}15`,
              color: RISK_COLORS[riskLevel],
              border: `1px solid ${RISK_COLORS[riskLevel]}35`,
              borderRadius: 0.5,
            }}
          />
        </Stack>

        <Stack spacing={2.2}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <Schedule fontSize="small" sx={{ color: '#64748b' }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569' }}>
                Forecasted Schedule Slippage
              </Typography>
            </Stack>
            <Typography variant="h3" sx={{ fontWeight: 800, color: RISK_COLORS[riskLevel], letterSpacing: '-0.02em', fontFamily: 'monospace' }}>
              {prediction.predictedDelayDays} <Typography component="span" variant="body1" sx={{ fontWeight: 600, color: '#64748b' }}>days (~{Math.round(prediction.predictedDelayDays / 30)} months)</Typography>
            </Typography>
          </Box>

          <Divider sx={{ borderColor: '#e2e8f0' }} />

          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Assessment fontSize="small" sx={{ color: '#64748b' }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569' }}>
                  Empirical Confidence Interval
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>
                {(prediction.confidence * 100).toFixed(0)}% (95% CI)
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={prediction.confidence * 100}
              sx={{ height: 6, borderRadius: 1, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#0284c7' } }}
            />
          </Box>

          <Divider sx={{ borderColor: '#e2e8f0' }} />

          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <FactCheck fontSize="small" sx={{ color: '#64748b' }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569' }}>
                  Composite Vulnerability Score
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#b91c1c', fontFamily: 'monospace' }}>
                {(prediction.riskScore * 100).toFixed(0)} / 100
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={prediction.riskScore * 100}
              sx={{
                height: 6,
                borderRadius: 1,
                bgcolor: '#f1f5f9',
                '& .MuiLinearProgress-bar': {
                  bgcolor: prediction.riskScore > 0.5 ? '#b91c1c' : prediction.riskScore > 0.25 ? '#c2410c' : '#15803d',
                },
              }}
            />
          </Box>

          <Box sx={{ pt: 0.5, bgcolor: '#f8fafc', p: 1.2, borderRadius: 1, border: '1px solid #e2e8f0' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', display: 'block' }}>
              <strong style={{ color: '#334155' }}>Evaluation Engine:</strong> MoSPI-OCMS Ensemble v{prediction.modelVersion} &bull; Calibrated on {new Date(prediction.predictionDate).toLocaleDateString('en-GB')}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
