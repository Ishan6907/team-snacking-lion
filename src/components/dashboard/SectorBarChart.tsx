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
} from 'recharts';
import { SECTOR_COLORS } from '@/utils/constants';

interface SectorBarChartProps {
  data: { sector: string; avgDelay: number; projectCount: number }[];
}

export default function SectorBarChart({ data }: SectorBarChartProps) {
  return (
    <Card sx={{ borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.78rem', mb: 2 }}>
          Sectoral Schedule Slippage Index
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, bottom: 5, left: 120 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis
              type="number"
              fontSize={11}
              stroke="#64748b"
              tick={{ fill: '#475569', fontSize: 11 }}
              label={{ value: 'Average Delay (Days)', position: 'insideBottom', fill: '#64748b', fontSize: 11, offset: -5 }}
            />
            <YAxis
              dataKey="sector"
              type="category"
              fontSize={11}
              width={115}
              stroke="#64748b"
              tick={{ fill: '#1e293b', fontSize: 11, fontWeight: 600 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#cbd5e1',
                borderRadius: 4,
                color: '#0f172a',
                fontSize: 12,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [`${value} days`, 'Average Slippage']}
            />
            <Bar dataKey="avgDelay" radius={[0, 3, 3, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.sector}
                  fill={SECTOR_COLORS[entry.sector] ?? '#0b2545'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
