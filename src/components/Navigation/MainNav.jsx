
// src/components/Navigation/MainNav.jsx
import { NavLink as RouterNavLink } from 'react-router-dom';
import { NavLink, Stack, Title, Divider } from '@mantine/core';
import { 
  IconHome, IconArrowsExchange, IconChartPie, 
  IconShieldHalf, IconActivity, IconWorld, IconChartCandle 
} from '@tabler/icons-react';
import useAuthStore from '../../store/authStore';

export function MainNav() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Stack>
      {/* --- Private Links (for logged-in users) --- */}
      {isAuthenticated && (
        <>
          <Title order={4} c="dimmed">Private</Title>
          <NavLink
            component={RouterNavLink}
            to="/portfolio"

           label="Dashboard"
            leftSection={<IconHome size="1rem" stroke={1.5} />}
          />
         <NavLink
           component={RouterNavLink}
           to="/decision-workspace"
           label="Decision Workspace"
           leftSection={<IconBrain size="1rem" stroke={1.5} />}
         />
          <NavLink
            component={RouterNavLink}
            to="/transactions"
            label="Transactions"
            leftSection={<IconArrowsExchange size="1rem" stroke={1.5} />}
          />
            leftSection={<IconHome size="1rem" stroke={1.5} />}
          <NavLink
            component={RouterNavLink}
            to="/transactions"
            label="Transactions"
            leftSection={<IconArrowsExchange size="1rem" stroke={1.5} />}
          />
          <Divider my="sm" />
        </>
      )}

      {/* --- Public Links (for everyone) --- */}
      <Title order={4} c="dimmed">Public</Title>
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