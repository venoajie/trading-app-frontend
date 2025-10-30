
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
import { StatCard } from '../pages/PortfolioDashboardPage/components/StatCard'; // Import StatCard
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

  const renderUserArea = () => { /* ... user area rendering logic remains the same ... */ };

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

        {/* ... rest of AppShell ... */}
      </AppShell>
      {/* ... drawers and affix ... */}
    </>
  );
}