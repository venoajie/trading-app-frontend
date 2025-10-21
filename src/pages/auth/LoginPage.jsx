
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

// --- [MODIFIED] Import the real auth store ---
import useAuthStore from '../../store/authStore';

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // --- [MODIFIED] Get actions from the real store ---
  const { setToken, fetchUser } = useAuthStore();

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

      // --- [MODIFIED] Full authentication flow ---
      // 1. Set the token in the store. This also updates apiClient headers.
      setToken(access_token);
      
      // 2. Immediately fetch the user's profile data.
      await fetchUser();
      // --- [END MODIFIED] ---

      notifications.show({
        title: 'Login Successful',
        message: 'Welcome back!',
        color: 'green',
      });

      // 3. Redirect to the dashboard only after the user profile is fetched.
      navigate('/dashboard');

    } catch (error) {
      let errorMessage = 'An unexpected error occurred.';
      if (error.response && error.response.data && error.response.data.detail) {
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