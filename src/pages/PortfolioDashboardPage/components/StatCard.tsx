// src/pages/PortfolioDashboardPage/components/StatCard.tsx
import { Text, Group } from '@mantine/core';

interface StatCardProps {
  variant: 'minimal';
  title: string;
  value?: string;
  change?: number;
  changeColor?: 'teal' | 'red';
}

export function StatCard({ title, value, change, changeColor }: StatCardProps) {
  return (
    <Group>
      <Text size="sm" c="dimmed">
        {title}:
      </Text>
      {value && (
        <Text size="sm" fw={700}>
          {value}
        </Text>
      )}
      {change !== undefined && (
        <Text size="sm" fw={700} c={changeColor}>
          {(change * 100).toFixed(2)}%
        </Text>
      )}
    </Group>
  );
}
