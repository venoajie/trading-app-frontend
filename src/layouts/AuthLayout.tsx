/** src/layouts/AuthLayout.tsx */

import { Center, Container } from '@mantine/core';
import { Outlet } from 'react-router-dom';

/**
 * A simple, centered layout for public-facing pages like login, register, etc.
 */
function AuthLayout() {
  return (
    <Container>
      <Center style={{ height: '100vh' }}>
        <Outlet />
      </Center>
    </Container>
  );
}

export default AuthLayout;
