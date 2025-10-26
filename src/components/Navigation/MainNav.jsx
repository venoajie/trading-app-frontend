
// src/components/Navigation/MainNav.jsx
import { NavLink as RouterNavLink } from 'react-router-dom';
import { NavLink, Stack, Divider, Text } from '@mantine/core';
import { 
  IconHome, IconArrowsExchange, IconActivity, IconWorld, 
  IconChartCandle, IconBrain, IconBook 
} from '@tabler/icons-react';
import useAuthStore from '../../store/authStore';

export function MainNav() {
  const { user } = useAuthStore();

  return (
    <Stack>
      {/* --- Private Links (for logged-in users) --- */}
      {user && (
        <>
          <Text size="xs" fw={500} c="dimmed" tt="uppercase">Portfolio Management</Text>
          <NavLink
            component={RouterNavLink}
            to="/portfolio"
            label="Portfolio Dashboard"
            leftSection={<IconHome size="1rem" stroke={1.5} />}
          />
          <NavLink
            component={RouterNavLink}
            to="/transactions"
            label="Transactions"
            leftSection={<IconArrowsExchange size="1rem" stroke={1.5} />}
          />

          <Divider my="sm" />
          
          <Text size="xs" fw={500} c="dimmed" tt="uppercase">Process Review & Learning</Text>
          <NavLink
            component={RouterNavLink}
            to="/decision-workspace"
            label="Decision Workspace"
            leftSection={<IconBrain size="1rem" stroke={1.5} />}
          />
          <NavLink
            component={RouterNavLink}
            to="/learning-journal"
            label="Learning Journal"
            leftSection={<IconBook size="1rem" stroke={1.5} />}
          />
          <Divider my="sm" />
        </>
      )}

      {/* --- Public Links (for everyone) --- */}
      <Text size="xs" fw={500} c="dimmed" tt="uppercase">Market Analysis</Text>
      <NavLink
        component={RouterNavLink}
        to="/"
        label="Home"
        leftSection={<IconActivity size="1rem" stroke={1.5} />}
      />
      <NavLink
        component={RouterNavLink}
        to="/market-update"
        label="Market Update"
        leftSection={<IconWorld size="1rem" stroke={1.5} />}
      />
      <NavLink
        component={RouterNavLink}
        to="/technical-analysis"
        label="Technical Analysis"
        leftSection={<IconChartCandle size="1rem" stroke={1.5} />}
      />
    </Stack>
  );
}