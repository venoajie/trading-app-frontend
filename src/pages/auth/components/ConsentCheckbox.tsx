// src/pages/auth/components/ConsentCheckbox.tsx

import { Checkbox, Anchor, Text } from '@mantine/core';
// CORRECTED: Import `forwardRef` from React to handle the ref.
import { ComponentProps, forwardRef } from 'react';
import { Link } from 'react-router-dom';

interface ConsentCheckboxProps extends ComponentProps<typeof Checkbox> {}

// CORRECTED: Wrap the entire component in `forwardRef`.
// This provides the `ref` as the second argument to the component function.
// The generic arguments <HTMLInputElement, ConsentCheckboxProps> provide type safety.
export const ConsentCheckbox = forwardRef<
  HTMLInputElement,
  ConsentCheckboxProps
>(({ ...props }, ref) => {
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
      // Pass all original props (like `error`, `disabled`, etc.)
      {...props}
      // CORRECTED: Apply the forwarded ref directly to the Mantine Checkbox.
      // Mantine components are built to accept refs, so this works seamlessly.
      ref={ref}
    />
  );
});
