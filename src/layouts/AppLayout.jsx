
// src/layouts/AppLayout.jsx
import { AppShell, Burger, Group, Title, Button, Text, LoadingOverlay } from '@mantine/core'; // Add LoadingOverlay
import { useDisclosure } from '@mantine/hooks';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useUiStore } from '../store/uiStore';
import { AssistantSidebar } from '../components/AssistantSidebar/AssistantSidebar';
import useAuthStore from '../store/authStore';

export function AppLayout() {
  const [mobileNavOpened, { toggle: toggleMobileNav }] = useDisclosure();
  const { isSidebarOpen, toggleSidebar } = useUiStore();
  
  // --- [MODIFIED] Get the 'isLoadingUser' state from the store ---
  const { isAuthenticated, logout, user, isLoadingUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // --- [NEW] The definitive fix for the race condition ---
  // If the app is still in the process of fetching the initial user,
  // show a full-page loading screen. This prevents the "visitor" view
  // from ever flashing on the screen for a logged-in user.
  if (isLoadingUser) {
    return <LoadingOverlay visible={true} overlayProps={{ radius: "sm", blur: 2 }} />;
  }
  // --- [END NEW] ---

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 350,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileNavOpened, desktop: !isSidebarOpen },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={mobileNavOpened} onClick={toggleMobileNav} hiddenFrom="sm" size="sm" />
          <Title order={3}>Portopilot</Title>
          <Group justify="flex-end" style={{ flex: 1 }}>
            
            {isAuthenticated && user ? (
              // If the user IS logged in, show their email AND the buttons
              <Group>
                <Text size="sm" c="dimmed" visibleFrom="sm">Welcome, {user.email}</Text>
                <Button component={Link} to="/transactions" variant="default">
                  My Transactions
                </Button>
                <Button color="red" onClick={handleLogout}>
                  Logout
                </Button>
              </Group>
            ) : (
              // If the user IS NOT logged in, show these buttons
              <Group>
                <Button component={Link} to="/login" variant="default">
                  Login
                </Button>
                <Button component={Link} to="/register">
                  Sign Up
                </Button>
              </Group>
            )}

            <Burger opened={isSidebarOpen} onClick={toggleSidebar} visibleFrom="sm" size="sm" />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AssistantSidebar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}