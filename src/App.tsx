import {
  ActionIcon,
  AppShell,
  Container,
  Group,
  Header,
  Paper,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { useUiStore } from './store/uiStore';

function App() {
  const { toggleColorScheme } = useUiStore();
  // useMantineColorScheme reads the value from the MantineProvider context
  const { colorScheme } = useMantineColorScheme();

  return (
    <AppShell
      padding="md"
      header={
        <Header height={60} p="xs">
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
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Container>
        <Paper withBorder p="lg" radius="md" shadow="md">
          <Title order={2} align="center" mt="md" mb="xl">
            Phase 2 Milestone: UI & Theming
          </Title>
          <Text align="center" mb="xl">
            Click the icon in the header to toggle the theme. The state is
            managed by Zustand and persisted in local storage, satisfying the
            milestone requirements.
          </Text>
        </Paper>
      </Container>
    </AppShell>
  );
}

export default App;
