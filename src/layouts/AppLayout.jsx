
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
  Box,
  UnstyledButton,
  Divider,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  IconLogout,
  IconLayoutSidebarRightCollapse,
  IconMessageCircle,
  IconChevronDown
} from '@tabler/icons-react';
import { useEffect } from 'react';

import { useUiStore } from '../store/uiStore';
import useAuthStore from '../store/authStore';
import { MainNav } from '../components/Navigation/MainNav';
import { AssistantSidebar } from '../components/AssistantSidebar/AssistantSidebar';
import { StatCard } from '../pages/PortfolioDashboardPage/components/StatCard';
import classes from './AppLayout.module.css';

export function AppLayout() {
  const [mobileNavOpened, { toggle: toggleMobileNav, close: closeMobileNav }] = useDisclosure();
  const [mobileAiDrawerOpened, { open: openAiDrawer, close: closeAiDrawer }] = useDisclosure();
  
  const { isAiSidebarVisible, toggleAiSidebar, isAiAssistantAvailable } = useUiStore();
  const { isAuthenticated, logout, user, isLoadingUser } = useAuthStore();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoadingUser) {
    return <LoadingOverlay visible={true} overlayProps={{ radius: 'sm', blur: 2 }} />;
  }

  // CORRECTED: The logic for this function has been fully restored.
  const renderUserArea = () => {
    if (!isAuthenticated) {
      return (
        <Group>
          <Button variant="default" component={Link} to="/login" radius="xl">Log in</Button>
          <Button component={Link} to="/register" radius="xl">Sign up</Button>
        </Group>
      );
    }

    return (
      <Group gap="md">
        {!isMobile && isAiAssistantAvailable && (
          <ActionIcon
            variant="default"
            onClick={toggleAiSidebar}
            title={isAiSidebarVisible ? 'Hide AI Assistant' : 'Show AI Assistant'}
            size="lg"
          >
            <IconLayoutSidebarRightCollapse />
          </ActionIcon>
        )}
        <Menu shadow="md" width={250}>
          <Menu.Target>
            <UnstyledButton className={classes.userMenuButton}>
              <Group gap="xs">
                <Box>
                  <Text size="sm" fw={500}>{user?.email}</Text>
                </Box>
                <IconChevronDown size="1rem" />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Account</Menu.Label>
            <Menu.Item color="red" leftSection={<IconLogout size={14} />} onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    );
  };

  return (
    <>
      <AppShell
        header={{ height: 70 }}
        aside={{
          width: 350,
          breakpoint: 'md',
          collapsed: { desktop: !isAiSidebarVisible, mobile: true },
        }}
        footer={{ height: 60 }}
        padding="md"
      >
        <AppShell.Header className={classes.header}>
          <Group h="100%" px="md" justify="space-between">
            {/* Left Side: Logo, Burger, Desktop Nav */}
            <Group>
              {isAuthenticated && (
                <Burger opened={mobileNavOpened} onClick={toggleMobileNav} hiddenFrom="sm" size="sm" />
              )}
              <Title order={3} component={Link} to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                Portopilot
              </Title>
              {isAuthenticated && !isMobile && <MainNav orientation="horizontal" />}
            </Group>
            
            {/* Center: Global Stats Bar (Visible on large screens) */}
            <Group visibleFrom="lg">
              {isAuthenticated && (
                <>
                  <StatCard
                    variant="minimal"
                    title="Total Value"
                    value="$100,000"
                    change="+1.25%"
                    changeColor="green"
                  />
                  <Divider orientation="vertical" />
                  <StatCard
                    variant="minimal"
                    title="YTD Return"
                    value="-$1,800"
                    change="-1.77%"
                    changeColor="red"
                  />
                </>
              )}
            </Group>

            {/* Right Side: User Area */}
            {renderUserArea()}
          </Group>
        </AppShell.Header>

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
          </Group>
        </AppShell.Footer>
      </AppShell>
      
      <Drawer
        opened={mobileNavOpened}
        onClose={closeMobileNav}
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000}
        size="md"
      >
        <MainNav orientation="vertical" />
      </Drawer>

      {isMobile && isAuthenticated && isAiAssistantAvailable && (
        <>
          <Affix position={{ bottom: 80, right: 20 }}>
            <Button leftSection={<IconMessageCircle size={16} />} onClick={openAiDrawer} radius="xl">
              AI Coach
            </Button>
          </Affix>
          <Drawer opened={mobileAiDrawerOpened} onClose={closeAiDrawer} title="AI Coach" position="right" size="100%">
            <AssistantSidebar />
          </Drawer>
        </>
      )}
    </>
  );
}