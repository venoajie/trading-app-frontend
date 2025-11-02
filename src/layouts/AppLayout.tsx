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

function AppLayout() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      // V7 API CHANGE: `theme.colorScheme` is no longer valid in `styles`.
      // The `colorScheme` value from the hook should be used directly.
      styles={(theme) => ({
        main: {
          backgroundColor:
            colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <AppShell.Header p="xs">
        {/* V7 API CHANGE: The 'sx' prop is now 'style'. */}
        <Group style={{ height: '100%' }} px={20} justify="space-between">
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
