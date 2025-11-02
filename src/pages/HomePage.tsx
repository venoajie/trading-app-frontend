/** src/pages/HomePage.tsx */
import { Button, Group, Paper, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { WelcomeMessage } from '@/components/utility/WelcomeMessage';

function HomePage() {
  return (
    <Paper withBorder p="lg" radius="md" shadow="md" style={{ maxWidth: 500 }}>
      <WelcomeMessage />

      <Text ta="center" mt="xl" mb="xl">
        This is the public home page. Please log in to continue to your
        dashboard.
      </Text>
      <Group justify="center">
        <Button component={Link} to="/login">
          Go to Login Page
        </Button>
      </Group>
    </Paper>
  );
}

export default HomePage;
