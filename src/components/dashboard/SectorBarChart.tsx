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
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Average Delay by Sector
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, bottom: 5, left: 120 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" fontSize={12} label={{ value: 'Avg Delay (days)', position: 'bottom' }} />
            <YAxis dataKey="sector" type="category" fontSize={11} width={110} />
            <Tooltip
              formatter={(value: number) => [`${value} days`, 'Avg Delay']}
            />
            <Bar dataKey="avgDelay" radius={[0, 4, 4, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.sector}
                  fill={SECTOR_COLORS[entry.sector] ?? '#90A4AE'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
