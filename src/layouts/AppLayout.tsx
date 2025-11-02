/** src/layouts/AppLayout.tsx */

import {
  ActionIcon,
  AppShell,
  Container,
  Group,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { Outlet } from 'react-router-dom';

/**
 * The main application layout for authenticated users.
 * Includes the header with theme toggle and the main content area.
 */
function AppLayout() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <AppShell.Header p="xs">
        <Group sx={{ height: '100%' }} px={20} position="apart">
          <Title order={3}>Trading App</Title>
          <ActionIcon
            variant="default"
            onClick={() => toggleColorScheme()}
            size={30}
          >
            {colorScheme === 'dark' ? (
              <IconSun size="1rem" />
            ) : (
              <IconMoonStars size="1rem" />
            )}
          </ActionIcon>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container>
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default AppLayout;
