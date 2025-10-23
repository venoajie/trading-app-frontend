// src/pages/PortfolioPage.jsx
import { Title, Text, Stack } from '@mantine/core';
import useAuthStore from '../store/authStore';

export function PortfolioPage() {
  const { user } = useAuthStore();

  return (
    <Stack>
      <Title order={1}>My Portfolio</Title>
      <Text size="lg">Welcome back, {user?.email}!</Text>
      <Text>This is your primary dashboard. Portfolio summary and charts will be displayed here.</Text>
    </Stack>
  );
}