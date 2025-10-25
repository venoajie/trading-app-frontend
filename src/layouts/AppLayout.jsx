
// src/layouts/AppLayout.jsx
import { AppShell, Burger, Group, Title, Menu, ActionIcon, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { IconUserCircle, IconLogin, IconUserPlus, IconLogout } from '@tabler/icons-react';

import { useUiStore } from '../store/uiStore';
import useAuthStore from '../store/authStore';
import { MainNav } from '../components/Navigation/MainNav';
import { AssistantSidebar } from '../components/AssistantSidebar/AssistantSidebar';

export function AppLayout() {
  const [mobileNavOpened, { toggle: toggleMobileNav }] = useDisclosure();
  const { isSidebarOpen, toggleSidebar } = useUiStore();
  const { isAuthenticated, logout, user, isLoadingUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoadingUser) {
    return <LoadingOverlay visible={true} overlayProps={{ radius: "sm", blur: 2 }} />;
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileNavOpened, desktop: !isSidebarOpen },
      }}
      aside={{
        width: 350,
        breakpoint: 'md',
        // The presence of the 'aside' is now controlled by isAuthenticated
        collapsed: { desktop: !isAuthenticated, mobile: true },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={isSidebarOpen} onClick={toggleSidebar} hiddenFrom="sm" size="sm" />
            <Title order={3} component={Link} to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Portopilot
            </Title>
          </Group>
          
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="default" size="lg">
                <IconUserCircle />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              {isAuthenticated ? (
                <>
                  <Menu.Label>{user?.email}</Menu.Label>
                  <Menu.Item leftSection={<IconLogout size={14} />} onClick={handleLogout}>
                    Logout
                  </Menu.Item>
                </>
              ) : (
                <>
                  <Menu.Label>Guest</Menu.Label>
                  <Menu.Item leftSection={<IconLogin size={14} />} component={Link} to="/login">
                    Login
                  </Menu.Item>
                  <Menu.Item leftSection={<IconUserPlus size={14} />} component={Link} to="/register">
                    Sign Up
                  </Menu.Item>
                </>
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <MainNav />
      </AppShell.Navbar>

      {/* --- Conditionally render the entire AI sidebar --- */}
      {isAuthenticated && (
        <AppShell.Aside p="md">
          <AssistantSidebar />
        </AppShell.Aside>
      )}

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}