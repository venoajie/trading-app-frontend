// src/pages/auth/LoginPage.tsx

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
// CORRECTED: Import AuthState type for type safety.
import { useAuthStore, AuthState } from '../../store/authStore';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password cannot be empty' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  // CORRECTED: The state parameter is now explicitly typed, resolving the implicit 'any' error.
  const { login, isLoading } = useAuthStore((state: AuthState) => ({
    login: state.login,
    isLoading: state.isLoading,
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const success = await login(data);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <Container size={420} my={40}>
      <Title
        ta="center"
        style={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome back!
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <TextInput
              required
              label="Email"
              placeholder="you@example.com"
              disabled={isLoading}
              error={errors.email?.message}
              {...register('email')}
            />
            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              disabled={isLoading}
              error={errors.password?.message}
              {...register('password')}
            />
          </Stack>
          <Button fullWidth mt="xl" type="submit" loading={isLoading}>
            Sign in
          </Button>
        </form>
      </Paper>
      <Text c="dimmed" size="sm" ta="center" mt={15}>
        Don't have an account yet?{' '}
        <Anchor component={Link} to="/register" size="sm">
          Create account
        </Anchor>
      </Text>
    </Container>
  );
}

// Ensure default export is present for lazy loading consistency
export default LoginPage;
