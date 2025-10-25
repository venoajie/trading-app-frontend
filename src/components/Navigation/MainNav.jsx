
// src/components/Navigation/MainNav.jsx
import { NavLink as RouterNavLink } from 'react-router-dom';
import { NavLink, Stack, Divider } from '@mantine/core';
import { 
  IconHome, IconArrowsExchange, IconActivity, IconWorld, 
  IconChartCandle, IconBrain 
} from '@tabler/icons-react';
import useAuthStore from '../../store/authStore';

export function MainNav() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Stack>
      {/* --- Private Links (for logged-in users) --- */}
      {isAuthenticated && (
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