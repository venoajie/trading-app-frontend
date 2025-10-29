
// src/layouts/AppLayout.jsx
import {
  AppShell,
  Burger,
  Group,
  Title,
  Menu,
  ActionIcon,
  LoadingOverlay,
  Anchor,
  Text,
  Affix,
  Button,
  Drawer,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  IconUserCircle,
  IconLogin,
  IconUserPlus,
  IconLogout,
  IconLayoutSidebarRightCollapse,
  IconMessageCircle,
} from '@tabler/icons-react';
import { useEffect } from 'react';

import { useUiStore } from '../store/uiStore';
import useAuthStore from '../store/authStore';
import { MainNav } from '../components/Navigation/MainNav';
import { AssistantSidebar } from '../components/AssistantSidebar/AssistantSidebar';

export function AppLayout() {
  const [mobileNavOpened, { toggle: toggleMobileNav }] = useDisclosure();
  const [mobileAiDrawerOpened, { open: openAiDrawer, close: closeAiDrawer }] = useDisclosure();
  
  const { isSidebarOpen, openSidebar, isAiSidebarVisible, toggleAiSidebar, isAiAssistantAvailable } = useUiStore();
  const { isAuthenticated, logout, user, isLoadingUser } = useAuthStore();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

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
    return <LoadingOverlay visible={true} overlayProps={{ radius: 'sm', blur: 2 }} />;
  }

  return (
    <>
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
          collapsed: { desktop: !isAiSidebarVisible, mobile: true },
        }}
        footer={{ height: 60 }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Group>
              <Burger opened={mobileNavOpened} onClick={toggleMobileNav} hiddenFrom="sm" size="sm" />
              <Title order={3} component={Link} to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                Portopilot
              </Title>
            </Group>
            
            <Group>
              {isAuthenticated && isAiAssistantAvailable && !isMobile && (
                 <ActionIcon
                    variant="default"
                    onClick={toggleAiSidebar}
                    title={isAiSidebarVisible ? 'Hide AI Assistant' : 'Show AI Assistant'}
                    size="lg"
                  >
                    <IconLayoutSidebarRightCollapse />
                  </ActionIcon>
              )}
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
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <MainNav />
        </AppShell.Navbar>

        {isAuthenticated && isAiAssistantAvailable && (
          <AppShell.Aside p="md">
            <AssistantSidebar />
          </AppShell.Aside>
        )}

        <AppShell.Main>
          <Outlet />
        </AppShell.Main>

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

      {/* Mobile-only Floating Action Button and Drawer for AI Assistant */}
      {isMobile && isAuthenticated && isAiAssistantAvailable && (
        <>
          <Affix position={{ bottom: 80, right: 20 }}>
            <Button
              leftSection={<IconMessageCircle size={16} />}
              onClick={openAiDrawer}
              radius="xl"
            >
              AI Coach
            </Button>
          </Affix>
          <Drawer
            opened={mobileAiDrawerOpened}
            onClose={closeAiDrawer}
            title="AI Coach"
            position="right"
            size="100%"
          >
            <AssistantSidebar />
          </Drawer>
        </>
      )}
    </>
  );
}