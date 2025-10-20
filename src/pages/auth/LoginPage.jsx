
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
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
// We'll import the useAuthStore hook to manage global authentication state.
// import useAuthStore from '../../store/authStore'; // This would be the actual import

// --- Placeholder for Zustand Store ---
// In a real application, this would be in `src/store/authStore.js`
// For this task, we will simulate its behavior directly in the component.
const mockAuthStore = {
  setToken: (token) => {
    console.log('Storing token...');
    localStorage.setItem('accessToken', token);
    // CRITICAL: Update the apiClient's default headers for all future requests
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('apiClient headers updated.');
  },
};
// --- End Placeholder ---

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const { setToken } = useAuthStore(); // This is how we'd use the real store

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address'),
      password: (value) => (value.length > 0 ? null : 'Password cannot be empty'),
    },
  });

  const handleLogin = async (values) => {
    setLoading(true);

    // --- CRITICAL: Adherence to API Contract ---
    // The blueprint specifies an `application/x-www-form-urlencoded` body.
    // We use URLSearchParams to construct it correctly.
    // The API expects the email under the 'username' key.
    const formBody = new URLSearchParams();
    formBody.append('username', values.email);
    formBody.append('password', values.password);

    try {
      const response = await apiClient.post('/auth/login', formBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token } = response.data;

      // Use our auth store/logic to persist the token and update the app state
      mockAuthStore.setToken(access_token);
      // setToken(access_token); // Real implementation

      notifications.show({
        title: 'Login Successful',
        message: 'Welcome back!',
        color: 'green',
      });

      // Redirect to the main dashboard after successful login
      navigate('/dashboard');

    } catch (error) {
      let errorMessage = 'An unexpected error occurred.';
      if (error.response && error.response.data && error.response.data.detail) {
        // As per the blueprint, the error message is in the "detail" field.
        errorMessage = error.response.data.detail;
      }
      notifications.show({
        title: 'Login Failed',
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
        Welcome back!
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleLogin)}>
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
          </Stack>

          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Sign in
          </Button>
        </form>
      </Paper>
      <Text color="dimmed" size="sm" align="center" mt={15}>
        Don't have an account yet?{' '}
        <Anchor component={Link} to="/register" size="sm">
          Create account
        </Anchor>
      </Text>
    </Container>
  );
}

export default LoginPage;