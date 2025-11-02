/** src/pages/HomePage.tsx */
import { Button, Group, Paper, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { WelcomeMessage } from '@/components/utility/WelcomeMessage';

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
      {/* The hardcoded title has been replaced with the i18n-powered component */}
      <WelcomeMessage />

      <Text align="center" mt="xl" mb="xl">
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
