
// src/pages/auth/LoginPage.jsx
import React, { useState, useEffect } from 'react';
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
import useAuthStore from '../../store/authStore';

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { setToken, fetchUser, isAuthenticated } = useAuthStore();

  // This effect is correct for redirecting users who are ALREADY logged in.
  useEffect(() => {
    if (isAuthenticated) {
      // --- [MODIFICATION] Redirect to the private portfolio dashboard ---
      navigate('/portfolio');
    }
  }, [isAuthenticated, navigate]);

  const form = useForm({
    initialValues: { email: '', password: '' },
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
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const { access_token } = response.data;
      setToken(access_token);
      await fetchUser();
      
      notifications.show({
        title: 'Login Successful',
        message: 'Redirecting to your portfolio...',
        color: 'green',
      });

      // --- [ADDITION] Explicitly navigate after successful login. ---
      // We don't rely on the useEffect for the post-login redirect.
      navigate('/portfolio');

    } catch (error) {
      let errorMessage = 'An unexpected error occurred.';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      notifications.show({
        title: 'Login Failed',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      // --- [ADDITION] Ensure loading is always set to false after the attempt. ---
      setLoading(false);
    } 
  };

  return (
    <Container size={420} my={40}>
      <Title align="center" sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}>
        Welcome back!
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleLogin)}>
          <Stack>
            <TextInput required label="Email" placeholder="you@example.com" disabled={loading} {...form.getInputProps('email')} />
            <PasswordInput required label="Password" placeholder="Your password" disabled={loading} {...form.getInputProps('password')} />
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