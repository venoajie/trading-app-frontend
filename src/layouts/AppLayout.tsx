// src/layouts/AppLayout.tsx
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
  Skeleton,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  IconLogout,
  IconLayoutSidebarRightCollapse,
  IconMessageCircle,
  IconChevronDown,
  IconSun,
  IconMoon,
  IconSettings,
} from '@tabler/icons-react';
import { useEffect } from 'react';

import { useUiStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { useDashboardStore } from '../store/dashboardStore';
import { MainNav } from '../components/Navigation/MainNav';
import { AssistantSidebar } from '../components/ai/AssistantSidebar';
import { StatCard } from '../pages/DashboardPage/components/StatCard';
import classes from './AppLayout.module.css';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export function AppLayout() {
  const [mobileNavOpened, { toggle: toggleMobileNav, close: closeMobileNav }] =
    useDisclosure();
  const [mobileAiDrawerOpened, { open: openAiDrawer, close: closeAiDrawer }] =
    useDisclosure();

  const {
    colorScheme,
    toggleColorScheme,
    isAiSidebarVisible,
    toggleAiSidebar,
    isAiAssistantAvailable,
  } = useUiStore();
  const { isAuthenticated, logout, user, isLoadingUser } = useAuthStore();
  const {
    kpis,
    isLoading: isDashboardLoading,
    fetchDashboardData,
  } = useDashboardStore();

  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, fetchDashboardData]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoadingUser) {
    return (
      <LoadingOverlay visible={true} overlayProps={{ radius: 'sm', blur: 2 }} />
    );
  }

  const renderUserArea = () => {
    if (!isAuthenticated) {
      return (
        <Group>
          <Button variant="default" component={Link} to="/login" radius="xl">
            Log in
          </Button>
          <Button component={Link} to="/register" radius="xl">
            Sign up
          </Button>
        </Group>
      );
    }
    return (
      <Group gap="md">
        <ActionIcon
          onClick={() => toggleColorScheme()}
          variant="default"
          size="lg"
          aria-label="Toggle color scheme"
        >
          {colorScheme === 'dark' ? (
            <IconSun size={18} />
          ) : (
            <IconMoon size={18} />
          )}
        </ActionIcon>
        {!isMobile && isAiAssistantAvailable && (
          <ActionIcon
            variant="default"
            onClick={toggleAiSidebar}
            title={
              isAiSidebarVisible ? 'Hide AI Assistant' : 'Show AI Assistant'
            }
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
                  <Text size="sm" fw={500}>
                    {user?.email}
                  </Text>
                </Box>
                <IconChevronDown size="1rem" />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Account</Menu.Label>
            <Menu.Item
              leftSection={<IconSettings size={14} />}
              component={Link}
              to="/account-settings"
            >
              Settings
            </Menu.Item>
            <Menu.Item
              color="red"
              leftSection={<IconLogout size={14} />}
              onClick={handleLogout}
            >
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
            <Group>
              {isAuthenticated && (
                <Burger
                  opened={mobileNavOpened}
                  onClick={toggleMobileNav}
                  hiddenFrom="sm"
                  size="sm"
                />
              )}
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Title order={3}>Portopilot</Title>
              </Link>
              {isAuthenticated && !isMobile && (
                <MainNav orientation="horizontal" />
              )}
            </Group>
            <Group visibleFrom="lg">
              {isAuthenticated &&
                (isDashboardLoading ? (
                  <>
                    <Skeleton height={36} width={150} radius="sm" />
                    <Divider orientation="vertical" />
                    <Skeleton height={36} width={150} radius="sm" />
                  </>
                ) : (
                  <>
                    <StatCard
                      variant="minimal"
                      title="Total Value"
                      value={formatCurrency(kpis.totalValue)}
                    />
                    <Divider orientation="vertical" />
                    <StatCard
                      variant="minimal"
                      title="YTD Return"
                      change={kpis.ytdReturnPct}
                      changeColor={kpis.ytdReturn >= 0 ? 'teal' : 'red'}
                    />
                  </>
                ))}
            </Group>
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

        <AppShell.Footer p="md" hiddenFrom="sm">
          <Group justify="center" gap="xl">
            <Text size="sm" c="dimmed">
              &copy; {new Date().getFullYear()} Portopilot
            </Text>
            <Anchor component="span" c="dimmed" size="sm">
              About
            </Anchor>
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
          <Affix position={{ bottom: 20, right: 20 }}>
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
