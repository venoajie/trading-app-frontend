/** src/pages/DashboardPage.tsx */
import {
  Alert,
  Button,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useUser } from '@/hooks/useUser';

function DashboardPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { data: user, isLoading, isError, error } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (isError) {
      return (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error!"
          color="red"
        >
          Failed to load user data: {error.message}
        </Alert>
      );
    }

    if (user) {
      return (
        <Stack>
          <Text>
            Welcome back, <strong>{user.name}</strong>!
          </Text>
          <Text size="sm" c="dimmed">
            Your registered email is: {user.email}
          </Text>
        </Stack>
      );
    }

    return null;
  };

  return (
    <Paper withBorder p="lg" radius="md" shadow="md">
      {/* V7 API CHANGE: The 'align' prop is now 'ta' (text-align). */}
      <Title order={2} ta="center" mt="md" mb="xl">
        Dashboard
      </Title>
      <Stack align="center" mb="xl">
        <Text ta="center">
          This is a protected page. You can only see this content because you
          are authenticated.
        </Text>
        {renderContent()}
      </Stack>

      <Group justify="center">
        <Button onClick={handleLogout} color="red">
          Logout
        </Button>
      </Group>
    </Paper>
  );
}

export default DashboardPage;
