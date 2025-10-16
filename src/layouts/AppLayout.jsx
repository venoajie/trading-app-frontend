
// src/layouts/AppLayout.jsx
import { AppShell, Burger, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';
import { useUiStore } from '../store/uiStore';
import { AssistantSidebar } from '../components/AssistantSidebar/AssistantSidebar';

export function AppLayout() {
  // This local state is for the mobile navigation (hamburger menu), not the AI sidebar
  const [mobileNavOpened, { toggle: toggleMobileNav }] = useDisclosure();
  
  // Global state for the AI sidebar from Zustand
  const { isSidebarOpen, toggleSidebar } = useUiStore();

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
          <Title order={3}>Trading App</Title>
          <Group justify="flex-end" style={{ flex: 1 }}>
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