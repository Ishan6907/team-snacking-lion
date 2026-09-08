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
    <Card sx={{ borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.78rem' }}>
          SHAP Factor Contribution Waterfall (Days Variance)
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2, fontSize: '0.74rem' }}>
          Right bars accelerate milestone slippage; left bars represent proactive mitigation factors
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, bottom: 5, left: 140 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis
              type="number"
              fontSize={11}
              stroke="#94a3b8"
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
            />
            <YAxis
              dataKey="name"
              type="category"
              fontSize={11}
              width={140}
              stroke="#94a3b8"
              tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }}
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
            <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1.5} />
            <Bar dataKey="value" radius={[0, 3, 3, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.value > 0 ? '#b91c1c' : '#15803d'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
