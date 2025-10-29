
// src/pages/PortfolioDashboardPage/components/StatCard.jsx
import { Card, Text, Group, Badge } from '@mantine/core';
import classes from './StatCard.module.css';

export function StatCard({ title, value, change, changeColor }) {
  return (
    <Card withBorder radius="md" p="md">
      <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
        {title}
      </Text>
      <Group justify="space-between" align="flex-end" gap="xs" mt="sm">
        <Text className={classes.value}>{value}</Text>
        {change && (
          <Badge color={changeColor} variant="light">
            {change}
          </Badge>
        )}
      </Group>
    </Card>
  );
}