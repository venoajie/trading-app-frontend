
// src/pages/AccountSettingsPage/AccountSettingsPage.jsx
import {
  Title, Stack, Card, TextInput, Button, Group, PasswordInput, Divider, Text,
} from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import useAuthStore from '../../store/authStore';

export function AccountSettingsPage() {
  const { user } = useAuthStore();

  return (
    <Stack gap="lg">
      <Title order={1}>Account Settings</Title>

      {/* --- Profile Details Section --- */}
      <Card withBorder radius="md" p="lg">
        <Stack>
          <Title order={3}>Profile Details</Title>
          <Text c="dimmed" size="sm">Update your personal information.</Text>
          <TextInput
            label="Display Name"
            placeholder="Your display name"
            defaultValue={user?.email?.split('@')[0]} // Placeholder logic
          />
          <TextInput
            label="Email Address"
            value={user?.email || ''}
            disabled
            description="You cannot change your email address."
          />
          <Group justify="flex-end" mt="md">
            <Button>Update Profile</Button>
          </Group>
        </Stack>
      </Card>

      {/* --- Change Password Section --- */}
      <Card withBorder radius="md" p="lg">
        <Stack>
          <Title order={3}>Change Password</Title>
          <PasswordInput
            label="Current Password"
            placeholder="Your current password"
          />
          <PasswordInput
            label="New Password"
            placeholder="Your new password"
          />
          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm your new password"
          />
          <Group justify="flex-end" mt="md">
            <Button>Set New Password</Button>
          </Group>
        </Stack>
      </Card>
      
      {/* --- Danger Zone Section --- */}
      <Card withBorder radius="md" p="lg">
        <Stack>
          <Title order={3} c="red">Danger Zone</Title>
          <Divider />
          <Group justify="space-between" align="center">
            <div>
              <Text fw={500}>Close your account</Text>
              <Text size="sm" c="dimmed">Permanently delete your account and all of its data.</Text>
            </div>
            <Button color="red" variant="outline" leftSection={<IconAlertTriangle size={16} />}>
              Close Account
            </Button>
          </Group>
        </Stack>
      </Card>
    </Stack>
  );
}