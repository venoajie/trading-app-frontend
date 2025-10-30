
// src/pages/PortfolioDashboardPage/components/StatCard.jsx
import { Card, Text, Group, Badge, Box } from '@mantine/core';
import classes from './StatCard.module.css';

export function StatCard({ title, value, change, changeColor, variant = 'default' }) {
  // NEW: Minimal variant for the global header
  if (variant === 'minimal') {
    return (
      <Box className={classes.minimalRoot}>
        <Text c="dimmed" tt="uppercase" fz="xs" fw={700}>
          {title}
        </Text>
        <Group gap="xs" align="baseline">
          <Text className={classes.minimalValue}>{value}</Text>
          {change && (
            <Text c={changeColor} fz="sm" fw={500}>
              {change}
            </Text>
          )}
        </Group>
      </Box>
    );
  }

  // Default card variant for dashboard pages
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