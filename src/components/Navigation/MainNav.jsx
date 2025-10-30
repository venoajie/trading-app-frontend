
// src/components/Navigation/MainNav.jsx
import { NavLink as RouterNavLink } from 'react-router-dom';
import { NavLink, Stack, Group, Menu, Button, useMantineTheme, Text, Divider } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { 
  IconHome, IconArrowsExchange, IconBrain, IconBook, IconChevronDown
} from '@tabler/icons-react';
import useAuthStore from '../../store/authStore';
import classes from './MainNav.module.css';

function NavMenu({ label, children }) {
  return (
    <Menu trigger="hover" openDelay={100} closeDelay={400} shadow="md">
      <Menu.Target>
        <Button
          rightSection={<IconChevronDown size="1rem" />}
          variant="subtle"
          className={classes.navButton}
        >
          {label}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>{children}</Menu.Dropdown>
    </Menu>
  );
}

export function MainNav({ orientation = 'horizontal' }) {
  const { user } = useAuthStore();
  const theme = useMantineTheme();
  // This hook determines which navigation variant to display
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const finalOrientation = isMobile ? 'vertical' : orientation;

  // Vertical layout for the mobile navigation drawer
  if (finalOrientation === 'vertical') {
    return (
      <Stack p="md">
        {user && (
          <>
            <Text size="xs" fw={500} c="dimmed" tt="uppercase">Portfolio</Text>
            <NavLink component={RouterNavLink} to="/portfolio" label="Dashboard" leftSection={<IconHome size="1rem" />} />
            <NavLink component={RouterNavLink} to="/transactions" label="Transactions" leftSection={<IconArrowsExchange size="1rem" />} />
            <Divider my="sm" />
            <Text size="xs" fw={500} c="dimmed" tt="uppercase">Process</Text>
            <NavLink component={RouterNavLink} to="/decision-workspace" label="Decision Workspace" leftSection={<IconBrain size="1rem" />} />
            <NavLink component={RouterNavLink} to="/learning-journal" label="Learning Journal" leftSection={<IconBook size="1rem" />} />
          </>
        )}
      </Stack>
    );
  }

  // Horizontal layout for the desktop header
  return (
    <Group gap="sm">
      <NavMenu label="Portfolio">
        <Menu.Item component={RouterNavLink} to="/portfolio" leftSection={<IconHome size={14} />}>
          Dashboard
        </Menu.Item>
        <Menu.Item component={RouterNavLink} to="/transactions" leftSection={<IconArrowsExchange size={14} />}>
          Transactions
        </Menu.Item>
      </NavMenu>
      <NavMenu label="Process">
         <Menu.Item component={RouterNavLink} to="/decision-workspace" leftSection={<IconBrain size={14} />}>
          Decision Workspace
        </Menu.Item>
        <Menu.Item component={RouterNavLink} to="/learning-journal" leftSection={<IconBook size={14} />}>
          Learning Journal
        </Menu.Item>
      </NavMenu>
    </Group>
  );
}