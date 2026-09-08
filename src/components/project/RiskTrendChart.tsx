import { Card, CardContent, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { PredictionTrend } from '@/types/prediction';

interface RiskTrendChartProps {
  data: PredictionTrend[];
}

export default function RiskTrendChart({ data }: RiskTrendChartProps) {
  return (
    <Card sx={{ borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.78rem', mb: 2 }}>
          Historical Forecast Trajectory vs Ground Actual Delay (12-Month Trend)
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              fontSize={11}
              stroke="#94a3b8"
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
            />
            <YAxis
              fontSize={11}
              stroke="#94a3b8"
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
              label={{ value: 'Days', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#cbd5e1',
                borderRadius: 4,
                color: '#0f172a',
                fontSize: 12,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            />
            <Legend wrapperStyle={{ color: '#334155', fontSize: '0.78rem', fontWeight: 700 }} />
            <Line
              type="monotone"
              dataKey="predictedDelay"
              stroke="#0b2545"
              strokeWidth={2.2}
              dot={{ r: 3, fill: '#0b2545' }}
              name="MoSPI-OCMS Ensemble"
            />
            <Line
              type="monotone"
              dataKey="actualDelay"
              stroke="#b91c1c"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3, fill: '#b91c1c' }}
              name="Ground Actual"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
