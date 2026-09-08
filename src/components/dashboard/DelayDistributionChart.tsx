import { Card, CardContent, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DelayDistributionChartProps {
  data: { bucket: string; count: number }[];
}

export default function DelayDistributionChart({ data }: DelayDistributionChartProps) {
  return (
    <Card sx={{ borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.78rem', mb: 2 }}>
          Delay Range Distribution (Days)
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="bucket"
              fontSize={11}
              stroke="#64748b"
              tick={{ fill: '#475569', fontSize: 11 }}
            />
            <YAxis
              fontSize={11}
              stroke="#64748b"
              tick={{ fill: '#64748b', fontSize: 11 }}
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
              formatter={(value: number) => [`${value} projects`, 'Count']}
            />
            <Bar dataKey="count" fill="#0b2545" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
