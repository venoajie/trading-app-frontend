
// src/layouts/AppLayout.jsx
import {
  AppShell,
  Burger,
  Group,
  Title,
  ActionIcon,
  Affix,
  Button,
  Drawer,
  Box,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconLayoutSidebarRightCollapse, IconMessageCircle } from '@tabler/icons-react';
import { Outlet } from 'react-router-dom';
import { MainNav } from '../components/Navigation/MainNav';
import { AssistantSidebar } from '../components/AssistantSidebar/AssistantSidebar';
import { useUiStore } from '../store/uiStore';
import useAuthStore from '../store/authStore';

export function AppLayout() {
  const { isAuthenticated } = useAuthStore();
  const {
    isSidebarOpen,
    toggleSidebar,
    isAiSidebarVisible,
    toggleAiSidebar,
    isAiAssistantAvailable,
  } = useUiStore();
  const [mobileDrawerOpened, { open: openMobileDrawer, close: closeMobileDrawer }] = useDisclosure();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const renderHeaderContent = () => {
    if (!isAuthenticated) {
      return (
        <Group h="100%" px="md">
          <Title order={3}>Portopilot</Title>
        </Group>
      );
    }
    return (
      <Group h="100%" px="md" justify="space-between">
        <Group>
          <Burger opened={isSidebarOpen} onClick={toggleSidebar} hiddenFrom="sm" size="sm" />
          <Title order={3}>Portopilot</Title>
        </Group>
        {isAiAssistantAvailable && !isMobile && (
          <ActionIcon
            variant="default"
            onClick={toggleAiSidebar}
            title={isAiSidebarVisible ? 'Hide AI Assistant' : 'Show AI Assistant'}
          >
            <IconLayoutSidebarRightCollapse />
          </ActionIcon>
        )}
      </Group>
    );
  };

  return (
    <>
      <AppShell
        padding="md"
        header={{ height: 60 }}
        navbar={{
          width: 250,
          breakpoint: 'sm',
          collapsed: { mobile: !isSidebarOpen, desktop: !isSidebarOpen || !isAuthenticated },
        }}
        aside={{
          width: 350,
          breakpoint: 'sm',
          collapsed: { desktop: !isAiSidebarVisible, mobile: true },
        }}
      >
        <AppShell.Header>{renderHeaderContent()}</AppShell.Header>

        {isAuthenticated && (
          <AppShell.Navbar p="md">
            <MainNav />
          </AppShell.Navbar>
        )}

        <AppShell.Main>
          <Outlet />
        </AppShell.Main>

        {isAuthenticated && isAiAssistantAvailable && (
          <AppShell.Aside p="md">
            <AssistantSidebar />
          </AppShell.Aside>
        )}
      </AppShell>

      {/* Mobile-only Floating Action Button to open AI Assistant in a Drawer */}
      {isMobile && isAuthenticated && isAiAssistantAvailable && (
        <>
          <Affix position={{ bottom: 20, right: 20 }}>
            <Button
              leftSection={<IconMessageCircle size={16} />}
              onClick={openMobileDrawer}
              radius="xl"
            >
              AI Coach
            </Button>
          </Affix>
          <Drawer
            opened={mobileDrawerOpened}
            onClose={closeMobileDrawer}
            title="AI Coach"
            position="right"
            size="100%"
          >
            <Box p="md">
              <AssistantSidebar />
            </Box>
          </Drawer>
        </>
      )}
    </>
  );
}