/** src/pages/HomePage.tsx */
import { Paper, Text, Title } from '@mantine/core';

function HomePage() {
  return (
    <Paper withBorder p="lg" radius="md" shadow="md" style={{ maxWidth: 500 }}>
      <Title order={2} align="center" mt="md" mb="xl">
        Welcome to the Trading App
      </Title>
      <Text align="center" mb="xl">
        This is the public home/login page. Since you are not authenticated, you
        can see this page.
      </Text>
      <Text align="center" size="sm" c="dimmed">
        (In a future phase, the login form will be here.)
      </Text>
    </Paper>
  );
}

export default HomePage;
