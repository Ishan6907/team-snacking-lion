import { Card, CardContent, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import type { DelayFactor } from '@/types/prediction';

interface FactorWaterfallChartProps {
  factors: DelayFactor[];
}

export default function FactorWaterfallChart({ factors }: FactorWaterfallChartProps) {
  const sorted = [...factors].sort((a, b) => Math.abs(b.importance) - Math.abs(a.importance)).slice(0, 10);

  const chartData = sorted.map((f) => ({
    name: f.displayName,
    value: f.direction === 'increases_delay' ? f.importance : -f.importance,
  }));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Top Delay Factors
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Positive values increase predicted delay; negative values decrease it.
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, bottom: 5, left: 140 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" fontSize={12} />
            <YAxis dataKey="name" type="category" fontSize={11} width={130} />
            <Tooltip />
            <ReferenceLine x={0} stroke="#666" />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.value > 0 ? '#D32F2F' : '#2E7D32'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
