// src/pages/PortfolioDashboardPage/components/RiskExposureMap.tsx
import { Card, Text, Title } from '@mantine/core';

// --- FIX: Define a specific type for the component's props ---
// This resolves the '@typescript-eslint/no-explicit-any' linting error.
interface RiskExposureDataPoint {
  sector: string;
  exposure: number;
}

interface RiskExposureMapProps {
  data: RiskExposureDataPoint[];
}

// This is a placeholder and does not render a real map.
export function RiskExposureMap({ data }: RiskExposureMapProps) {
  return (
    <Card withBorder radius="md" p="lg" style={{ height: '100%' }}>
      <Title order={4} mb="md">
        Risk Exposure by Sector
      </Title>
      <Text>Risk Exposure Map placeholder.</Text>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </Card>
  );
}
