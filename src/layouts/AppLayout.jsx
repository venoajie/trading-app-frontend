
// src/layouts/AppLayout.jsx
import { AppShell, Burger, Group, Title, Button } from '@mantine/core'; // Added Button
import { useDisclosure } from '@mantine/hooks';
import { Outlet, Link, useNavigate } from 'react-router-dom'; // Added Link and useNavigate
import { useUiStore } from '../store/uiStore';
import { AssistantSidebar } from '../components/AssistantSidebar/AssistantSidebar';

// --- Import the authentication store ---
import useAuthStore from '../store/authStore';

export function AppLayout() {
  // This local state is for the mobile navigation (hamburger menu), not the AI sidebar
  const [mobileNavOpened, { toggle: toggleMobileNav }] = useDisclosure();
  
  // Global state for the AI sidebar from Zustand
  const { isSidebarOpen, toggleSidebar } = useUiStore();

  // --- Get authentication state and actions from the store ---
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear the token and state
    navigate('/login'); // Redirect the user to the login page
  };

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
          <Title order={3}>Portopilot</Title> {/* Renamed for branding */}
          <Group justify="flex-end" style={{ flex: 1 }}>
            
            {/* --- Conditional Authentication Buttons --- */}
            {isAuthenticated ? (
              // If the user IS logged in, show these buttons
              <Group>
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
            {/* --- [END NEW] --- */}

            <Burger opened={isSidebarOpen} onClick={toggleSidebar} visibleFrom="sm" size="sm" />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AssistantSidebar />
      </AppShell.Navbar>

      <AppShell.Main>
        {/* All child routes defined in App.jsx will render here */}
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}