
// src/pages/DashboardPage.jsx
import { Container, Title, Text, Button, Stack, Group } from '@mantine/core';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  return (
    <Container>
      <Stack align="center" mt="xl" p="md">
        <Title order={1}>Welcome to Portopilot</Title>
        <Text size="xl" c="dimmed" align="center">
          Your intelligent portfolio management assistant.
        </Text>
        <Text align="center">
          Track your assets, analyze performance, and gain insights with our AI-powered tools.
          <br />
          Please log in or create an account to get started.
        </Text>
        <Group mt="md">
          <Button component={Link} to="/login" size="lg">
            Login
          </Button>
          <Button component={Link} to="/register" size="lg" variant="outline">
            Sign Up
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}