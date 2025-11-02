/** src/pages/HomePage.tsx */
import { Button, Group, Paper, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

function HomePage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = () => {
    // In a real app, this would come from an API response
    const mockUser = {
      id: 'user-123',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    };
    const mockToken = 'jwt.mock.token';

    login(mockUser, mockToken);
    navigate('/dashboard');
  };

  return (
    <Paper withBorder p="lg" radius="md" shadow="md" style={{ maxWidth: 500 }}>
      <Title order={2} align="center" mt="md" mb="xl">
        Welcome to the Trading App
      </Title>
      <Text align="center" mb="xl">
        This is the public home/login page. Since you are not authenticated, you
        can see this page.
      </Text>
      <Group justify="center">
        <Button onClick={handleLogin}>Simulate Login</Button>
      </Group>
    </Paper>
  );
}

export default HomePage;
