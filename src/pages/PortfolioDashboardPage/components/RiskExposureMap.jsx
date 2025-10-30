
// src/pages/PortfolioDashboardPage/components/RiskExposureMap.jsx
import { Card, Title, Text, Box, Center } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  ResponsiveContainer,
  Treemap,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { IconChartTreemap } from '@tabler/icons-react';

// A simple formatter for tooltips
const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Card withBorder shadow="sm" radius="md" p="xs">
        <Text fw={500}>{payload[0].payload.name}</Text>
        <Text size="sm">{formatCurrency(payload[0].value)}</Text>
      </Card>
    );
  }
  return null;
};

// Custom rendering for Treemap cells to add text labels
const CustomizedContent = (props) => {
  const { root, depth, x, y, width, height, index, name, value, color } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: color,
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {width > 80 && height > 30 && (
        <text x={x + width / 2} y={y + height / 2 + 7} textAnchor="middle" fill="#fff" fontSize={14}>
          {name}
        </text>
      )}
    </g>
  );
};

export function RiskExposureMap({ data = [] }) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  // For mobile, we show a simpler bar chart of the top 5 positions
  const mobileData = [...data].sort((a, b) => b.value - a.value).slice(0, 5);
  
  const hasData = data && data.length > 0;

  return (
    <Card withBorder shadow="sm" radius="md" padding="lg" h="100%">
      <Title order={4}>Risk Exposure Map</Title>
      <Text c="dimmed" size="sm" mt="xs">
        Asset Class Concentration
      </Text>
      <Box style={{ width: '100%', height: 350 }} mt="md">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            {isMobile ? (
              <BarChart data={mobileData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} stroke="#868e96" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }} />
                <Bar dataKey="value" fill="#4c6ef5" barSize={20} />
              </BarChart>
            ) : (
              <Treemap
                data={data}
                dataKey="value"
                ratio={4 / 3}
                stroke="#fff"
                fill="#8884d8"
                content={<CustomizedContent />}
              >
                <Tooltip content={<CustomTooltip />} />
              </Treemap>
            )}
          </ResponsiveContainer>
        ) : (
          <Center h="100%">
            <Box ta="center" c="dimmed">
              <IconChartTreemap size={48} stroke={1.5} />
              <Text>No exposure data available.</Text>
            </Box>
          </Center>
        )}
      </Box>
    </Card>
  );
}