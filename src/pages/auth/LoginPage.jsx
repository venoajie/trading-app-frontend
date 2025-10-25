
// src/pages/auth/LoginPage.jsx
import React, { useState } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Paper, Title, Container, Stack, Anchor, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import useAuthStore from '../../store/authStore';

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { hydrateSession } = useAuthStore();

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address'),
      password: (value) => (value.length > 0 ? null : 'Password cannot be empty'),
    },
  });

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      // Step 1: Get the token
      const formBody = new URLSearchParams();
      formBody.append('username', values.email);
      formBody.append('password', values.password);
      const loginResponse = await apiClient.post('/auth/login', formBody, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const { access_token } = loginResponse.data;

      // Step 2: Use the new token immediately to fetch the user profile.
      const userResponse = await apiClient.get('/users/me', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const user = userResponse.data;

      // Step 3: Commit the entire successful transaction to the state store.
      hydrateSession({ token: access_token, user });
      
      notifications.show({
        title: 'Login Successful',
        message: 'Redirecting to your portfolio...',
        color: 'green',
      });
      navigate('/portfolio');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'An unexpected error occurred.';
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