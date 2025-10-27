// src/pages/auth/RegisterPage.jsx
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
  Checkbox,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';

const ConsentCheckbox = ({ formProps }) => (
  <Checkbox
    {...formProps}
    label={
      <>
        I accept the{' '}
        <Anchor component={Link} to="/terms-of-service" target="_blank">
          Terms of Service
        </Anchor>{' '}
        and{' '}
        <Anchor component={Link} to="/privacy-policy" target="_blank">
          Privacy Policy
        </Anchor>
      </>
    }
  />
);

// CORRECTIVE ACTION: Convert to named export
export function RegisterPage() {
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

  const handleRegister = async (values) => {
    setLoading(true);

    const payload = {
      email: values.email,
      password: values.password,
    };

    try {
      await apiClient.post('/auth/register/', payload);

      notifications.show({
        title: 'Registration Successful',
        message: 'Your account has been created. Please log in to continue.',
        color: 'green',
      });

      navigate('/login');

    } catch (error) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      notifications.show({
        title: 'Registration Failed',
        message: errorMessage,
        color: 'red',
      });
    } finally {
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

// Remove default export
// export default RegisterPage;