// src/pages/auth/components/ConsentCheckbox.tsx

import { Checkbox, Anchor, Text } from '@mantine/core';
import { ComponentProps } from 'react';
import { Link } from 'react-router-dom';

// Define explicit props for strong typing, using ComponentProps to inherit
// all valid props from the underlying Mantine Checkbox component.
interface ConsentCheckboxProps extends ComponentProps<typeof Checkbox> {}

export function ConsentCheckbox(props: ConsentCheckboxProps) {
  return (
    <Checkbox
      mt="md"
      label={
        <Text size="sm">
          I agree to the{' '}
          <Anchor component={Link} to="/terms-of-service" target="_blank">
            Terms of Service
          </Anchor>{' '}
          and{' '}
          <Anchor component={Link} to="/privacy-policy" target="_blank">
            Privacy Policy
          </Anchor>
          .
        </Text>
      }
      {...props} // Spread props for validation and state binding from React Hook Form
    />
  );
}
