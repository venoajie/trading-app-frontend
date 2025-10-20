
import React, { useState } from 'react';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
  Stack,
  Anchor,
  Checkbox, // Assuming ConsentCheckbox is in this file for simplicity
  Text,     // Added Text for the link below the form
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient'; // The pre-configured Axios instance

// For the purpose of this file being self-contained, here is a placeholder
// implementation of the ConsentCheckbox. In a real project, this would be in its own file.
const ConsentCheckbox = ({ formProps }) => (
  <Checkbox
    {...formProps}
    label={
      <>
        I accept the{' '}
        <Anchor component={Link} to="/terms" target="_blank">
          Terms of Service
        </Anchor>{' '}
        and{' '}
        <Anchor component={Link} to="/privacy" target="_blank">
          Privacy Policy
        </Anchor>
      </>
    }
  />
);


function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
      terms: false,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address'),
      password: (value) =>
        value.length < 8 ? 'Password must be at least 8 characters long' : null,
      passwordConfirmation: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
      terms: (value) => (value ? null : 'You must accept the terms and conditions to continue'),
    },
  });

  // --- Step 1.2: API Call Logic ---
  const handleRegister = async (values) => {
    setLoading(true);

    // Per PROJECT_BLUEPRINT.md, only 'email' and 'password' are sent to the backend.
    const payload = {
      email: values.email,
      password: values.password,
    };

    try {
      await apiClient.post('/api/v1/auth/register', payload);

      // On success, display notification and redirect to login page.
      notifications.show({
        title: 'Registration Successful',
        message: 'Your account has been created. Please log in to continue.',
        color: 'green',
      });

      navigate('/login');

    } catch (error) {
      // Handle API errors gracefully.
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      // Check if the error is from the API and contains the specific "detail" message.
      if (error.response && error.response.data && error.response.data.detail) {
        errorMessage = error.response.data.detail;
      }
      
      notifications.show({
        title: 'Registration Failed',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      // Ensure the loading state is always turned off after the request.
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
      >
        Welcome to Portopilot!
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleRegister)}>
          <Stack>
            <TextInput
              required
              label="Email"
              placeholder="you@example.com"
              disabled={loading}
              {...form.getInputProps('email')}
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              disabled={loading}
              {...form.getInputProps('password')}
            />

            <PasswordInput
              required
              label="Confirm Password"
              placeholder="Confirm your password"
              disabled={loading}
              {...form.getInputProps('passwordConfirmation')}
            />
            
            <ConsentCheckbox formProps={{...form.getInputProps('terms', { type: 'checkbox' }), disabled: loading}} />

          </Stack>

          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Register
          </Button>
        </form>
      </Paper>
      <Text color="dimmed" size="sm" align="center" mt={15}>
        Already have an account?{' '}
        <Anchor component={Link} to="/login" size="sm">
          Log in
        </Anchor>
      </Text>
    </Container>
  );
}

export default RegisterPage;