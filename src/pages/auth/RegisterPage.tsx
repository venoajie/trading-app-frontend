// src/pages/auth/RegisterPage.tsx

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
import { useAuthStore, AuthState } from '../../store/authStore';
import { ConsentCheckbox } from './components/ConsentCheckbox';

// Pillar 5: All validation logic is defined in a single Zod schema.
const registerSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    passwordConfirmation: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({
        message: 'You must accept the terms and conditions to continue',
      }),
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'], // Apply error to the confirmation field
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  // Pillar 3: Consume actions and state from the canonical Zustand store.
  const { register: registerAction, isLoading } = useAuthStore(
    (state: AuthState) => ({
      register: state.register,
      isLoading: state.isLoading,
    })
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    // The component orchestrates the action and the UI side-effect (navigation).
    const success = await registerAction({
      email: data.email,
      password: data.password,
    });
    if (success) {
      navigate('/login');
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
        Welcome to Portopilot!
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
            <PasswordInput
              required
              label="Confirm Password"
              placeholder="Confirm your password"
              disabled={isLoading}
              error={errors.passwordConfirmation?.message}
              {...register('passwordConfirmation')}
            />
            <ConsentCheckbox
              disabled={isLoading}
              error={errors.terms?.message}
              {...register('terms')}
            />
          </Stack>

          <Button fullWidth mt="xl" type="submit" loading={isLoading}>
            Register
          </Button>
        </form>
      </Paper>
      <Text c="dimmed" size="sm" ta="center" mt={15}>
        Already have an account?{' '}
        <Anchor component={Link} to="/login" size="sm">
          Log in
        </Anchor>
      </Text>
    </Container>
  );
}

export default RegisterPage;
