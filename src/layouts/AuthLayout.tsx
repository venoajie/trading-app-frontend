/** src/layouts/AuthLayout.tsx */

import {
  ActionIcon,
  AppShell,
  Center,
  Group,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { Outlet } from 'react-router-dom';

/**
 * A layout for public-facing pages like login, register, etc.
 * Includes a header with a theme toggle and centers the main content.
 */
function AuthLayout() {
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
        {/* We adjust the Center height to account for the header and AppShell padding */}
        <Center
          style={{
            height: 'calc(100vh - 60px - (var(--mantine-spacing-md) * 2))',
          }}
        >
          <Outlet />
        </Center>
      </AppShell.Main>
    </AppShell>
  );
}

export default AuthLayout;
