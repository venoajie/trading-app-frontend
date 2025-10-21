
import React, { useState, useEffect } from 'react'; // <-- Add useEffect
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
  
  // --- [MODIFIED] Get isAuthenticated from the store as well ---
  const { setToken, fetchUser, isAuthenticated } = useAuthStore();

  // --- [NEW] This effect will run when isAuthenticated changes ---
  useEffect(() => {
    // If the user becomes authenticated, THEN we navigate.
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]); // Dependency array

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
      
      // --- [REMOVED] We no longer navigate from here ---
      // navigate('/dashboard'); 

      // The success notification is now optional, as the user will be redirected immediately.
      // You can keep it if you want a brief flash of the message.
      notifications.show({
        title: 'Login Successful',
        message: 'Redirecting to your dashboard...',
        color: 'green',
      });

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
      setLoading(false); // Make sure to stop loading on failure
    } 
    // We don't need a finally block anymore, as success handles its own flow.
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