// src/components/Navigation/MainNav.tsx
import { Group, Anchor } from '@mantine/core';
import { Link } from 'react-router-dom';

interface MainNavProps {
  orientation: 'horizontal' | 'vertical';
}

export function MainNav({ orientation }: MainNavProps) {
  // --- FIX: Replaced invalid 'direction' prop with the correct 'style' prop ---
  // Mantine's <Group> is a flex container; its direction is controlled via CSS.
  return (
    <Group
      style={{ flexDirection: orientation === 'vertical' ? 'column' : 'row' }}
    >
      <Anchor component={Link} to="/dashboard">
        Dashboard
      </Anchor>
      <Anchor component={Link} to="/portfolio">
        Portfolio
      </Anchor>
      <Anchor component={Link} to="/research">
        Research
      </Anchor>
    </Group>
  );
}
