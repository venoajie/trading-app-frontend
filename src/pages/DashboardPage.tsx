/** src/pages/DashboardPage.tsx */
import { Paper, Text, Title } from '@mantine/core';

function DashboardPage() {
  return (
    <Paper withBorder p="lg" radius="md" shadow="md">
      <Title order={2} align="center" mt="md" mb="xl">
        Dashboard
      </Title>
      <Text align="center" mb="xl">
        This is a protected page. You can only see this content because the
        `isAuthenticated` flag in `useAuth.ts` is set to `true`.
      </Text>
    </Paper>
  );
}

export default DashboardPage;
