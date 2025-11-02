// src/components/Navigation/MainNav.tsx
import { Group, Anchor } from '@mantine/core';
import { Link } from 'react-router-dom';

interface MainNavProps {
  orientation: 'horizontal' | 'vertical';
}

export function MainNav({ orientation }: MainNavProps) {
  return (
    <Group direction={orientation === 'vertical' ? 'column' : 'row'}>
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
