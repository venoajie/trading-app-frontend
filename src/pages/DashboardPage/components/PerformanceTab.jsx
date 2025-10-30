
// src/pages/DashboardPage/components/PerformanceTab.jsx
import { Text } from '@mantine/core';

export function PerformanceTab() {
  return (
    <Text>Portfolio performance charts and historical data will be displayed here.</Text>
  );
}
// src/pages/DashboardPage/components/PerformanceTab.jsx
import { Card, Skeleton, Box, Text } from '@mantine/core';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import useDashboardStore from '../../../store/dashboardStore';

const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  compactDisplay: 'short'
}).format(value);

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Card withBorder shadow="sm" radius="md" p="sm">
        <Text size="sm" mb={4}>{new Date(label).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        })}</Text>
        <Text fw={500}>{`Value: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payload[0].value)}`}</Text>
      </Card>
    );
  }
  return null;
};

export function PerformanceTab() {
  const { performanceData, isLoading } = useDashboardStore();

  return (
    <Card withBorder radius="md" p="lg" style={{ height: '500px' }}>
      <Skeleton visible={isLoading} height="100%">
        {performanceData.length > 0 && (
          <Box style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={performanceData}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} minTickGap={30} />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Skeleton>
    </Card>
  );
}