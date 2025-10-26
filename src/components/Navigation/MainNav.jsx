
// src/components/Navigation/MainNav.jsx
import { NavLink as RouterNavLink } from 'react-router-dom';
import { NavLink, Stack, Divider } from '@mantine/core';
import { 
  IconHome, IconArrowsExchange, IconActivity, IconWorld, 
  IconChartCandle, IconBrain 
} from '@tabler/icons-react';
import useAuthStore from '../../store/authStore';

export function MainNav() {
  // CRITICAL FIX: Subscribe to the 'user' object instead of 'isAuthenticated'.
  // The presence of the 'user' object is the true indicator that the session
  // is fully hydrated and private routes can be displayed.
  const { user } = useAuthStore();

  return (
    <Stack>
      {/* --- Private Links (for logged-in users) --- */}
      {/* CRITICAL FIX: The condition is now based on 'user' */}
      {user && (
        <>
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
          <Divider my="sm" />
        </>
      )}

      {/* --- Public Links (for everyone) --- */}
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