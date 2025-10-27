
// src/pages/PortfolioDashboardPage/components/LiquidityProfile.jsx
import { Card, Title, Text, Group, Divider, Stack } from '@mantine/core';

export default function LiquidityProfile() {
  const liquidityData = {
    availableCash: 5000,
    marketableSecurities: 22000,
    dryPowder: 27000,
  };

  return (
    <Card withBorder shadow="sm" radius="md" padding="lg" h="100%">
      <Title order={4}>Liquidity Profile</Title>
      <Text c="dimmed" size="sm" mt="xs">Opportunity Readiness</Text>
      
      <Stack mt="xl" gap="sm">
        <Group justify="space-between">
          <Text>Available Cash</Text>
          <Text fw={500}>${liquidityData.availableCash.toLocaleString()}</Text>
        </Group>
        <Group justify="space-between">
          <Text>Marketable Securities</Text>
          <Text fw={500}>${liquidityData.marketableSecurities.toLocaleString()}</Text>
        </Group>
        <Divider my="xs" />
        <Group justify="space-between">
          <Text fw={700}>Dry Powder</Text>
          <Text fw={700} size="lg">${liquidityData.dryPowder.toLocaleString()}</Text>
        </Group>
      </Stack>
    </Card>
  );
}