
// src/pages/DashboardPage.jsx
import React from 'react';
import { Container, Title, Text, Button, Stack, Group } from '@mantine/core';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export function DashboardPage() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Container>
      {isAuthenticated && user ? (
        // --- LOGGED-IN VIEW ---
        // This is what you will see now after logging in.
        <Stack>
          <Title order={1}>Dashboard</Title>
          <Text size="lg">Welcome back, {user.email}!</Text>
          <Text>You can now manage your portfolio and view your transactions.</Text>
          <Group mt="md">
            <Button component={Link} to="/transactions" size="lg">
              View My Transactions
            </Button>
          </Group>
          {/* Portfolio summary and charts will be added here */}
        </Stack>
      ) : (
        // --- VISITOR VIEW ---
        // This is the public landing page content.
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
      )}
    </Container>
  );
}