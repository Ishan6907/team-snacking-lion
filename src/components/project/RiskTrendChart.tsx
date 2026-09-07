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
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Prediction vs Actual Delay Trend
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" fontSize={11} />
            <YAxis fontSize={12} label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="predictedDelay"
              stroke="#1565C0"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Predicted"
            />
            <Line
              type="monotone"
              dataKey="actualDelay"
              stroke="#D32F2F"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
              name="Actual"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
