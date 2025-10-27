
// src/layouts/AppLayout.jsx
import { AppShell, Burger, Group, Title, Menu, ActionIcon, LoadingOverlay, Footer, Anchor, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { IconUserCircle, IconLogin, IconUserPlus, IconLogout } from '@tabler/icons-react';
import { useEffect } from 'react';

import { useUiStore } from '../store/uiStore';
import useAuthStore from '../store/authStore';
import { MainNav } from '../components/Navigation/MainNav';
import { AssistantSidebar } from '../components/AssistantSidebar/AssistantSidebar';

export function AppLayout() {
  const [mobileNavOpened, { toggle: toggleMobileNav }] = useDisclosure();
  const { isSidebarOpen, openSidebar } = useUiStore();
  const { isAuthenticated, logout, user, isLoadingUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      openSidebar();
    }
  }, [isAuthenticated, openSidebar]);

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
        collapsed: { desktop: !isAuthenticated, mobile: true },
      }}
      footer={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            {/* CORRECTIVE ACTION: Connected Burger to mobile-specific state for correct behavior on small screens. */}
            <Burger opened={mobileNavOpened} onClick={toggleMobileNav} hiddenFrom="sm" size="sm" />
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

      {isAuthenticated && (
        <AppShell.Aside p="md">
          <AssistantSidebar />
        </AppShell.Aside>
      )}

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>

      {/* NEW: Global Footer */}
      <AppShell.Footer p="md">
        <Group justify="center" gap="xl">
          <Text size="sm" c="dimmed">&copy; {new Date().getFullYear()} Portopilot</Text>
          <Anchor component="span" c="dimmed" size="sm">About</Anchor>
          <Anchor component="span" c="dimmed" size="sm">Terms of Service</Anchor>
          <Anchor component="span" c="dimmed" size="sm">Privacy Policy</Anchor>
          <Anchor component="span" c="dimmed" size="sm">Disclaimer</Anchor>
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
}