
// src/pages/auth/components/ConsentCheckbox.jsx
import { Checkbox, Anchor, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

// This component is designed to be used inside a Mantine form.
// The `form.getInputProps('terms', { type: 'checkbox' })` will be passed in a real form.
export function ConsentCheckbox({ formProps }) {
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
      {...formProps} // Spread the form props for validation and state binding
    />
  );
}

// Example usage within a future RegisterPage.jsx:
/*
import { useForm } from '@mantine/form';
...
const form = useForm({
  initialValues: {
    email: '',
    password: '',
    terms: false,
  },
  validate: {
    terms: (value) => (value ? null : 'You must agree to the terms to continue'),
  },
});

return (
  <form onSubmit={form.onSubmit((values) => console.log(values))}>
    ... other form fields ...
    <ConsentCheckbox formProps={form.getInputProps('terms', { type: 'checkbox' })} />
    <Button type="submit" mt="md">Register</Button>
  </form>
)
*/