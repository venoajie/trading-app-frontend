
// src/components/AssistantSidebar/ChatMessage.jsx
import { Group, Avatar, Text, Paper } from '@mantine/core';
import { IconUser, IconCpu } from '@tabler/icons-react'; // npm install @tabler/icons-react

export function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  
  return (
    <Group gap="sm" align="flex-start" wrap="nowrap">
      <Avatar color={isUser ? 'blue' : 'teal'} radius="xl">
        {isUser ? <IconUser size="1.2rem" /> : <IconCpu size="1.2rem" />}
      </Avatar>
      <Paper 
        p="sm" 
        radius="lg" 
        withBorder 
        style={{ 
          backgroundColor: isUser ? 'var(--mantine-color-blue-light)' : 'var(--mantine-color-body)',
          maxWidth: '90%'
        }}
      >
        <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{message.content}</Text>
      </Paper>
    </Group>
  );
}