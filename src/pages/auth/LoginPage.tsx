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
import useAuthStore from '../../store/authStore';

// Pillar 5: All validation logic is defined in a Zod schema.
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password cannot be empty' }),
});

// Infer the TypeScript type from the Zod schema for type safety.
type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  // Pillar 3: Consume actions and state from the canonical client state store (Zustand).
  // The component is unaware of the API implementation details.
  const { login, isLoading } = useAuthStore((state) => ({
    login: state.login,
    isLoading: state.isLoading,
  }));

  // Pillar 5: All form state is managed by the `useForm` hook from React Hook Form.
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

  // The submit handler is a clean orchestrator, delegating logic to the store
  // and handling the UI-specific side effect (navigation) upon success.
  const onSubmit = async (data: LoginFormValues) => {
    // We assume the `login` action in the store returns a boolean for success.
    const success = await login(data);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <Container size={420} my={40}>
      <Title
        ta="center" // H-004: Mantine v7 API change: align -> ta
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

// Export as default to align with the dominant lazy-loading pattern in App.tsx
export default LoginPage;
