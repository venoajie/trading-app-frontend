
// src/components/AssistantSidebar/ChatMessage.jsx
import { Avatar, Group, Paper, Stack, Text, ThemeIcon, List } from '@mantine/core';
import { IconUser, IconRobot, IconAnalyze } from '@tabler/icons-react';
import Markdown from 'react-markdown';

// This new sub-component renders structured AI messages for enhanced clarity.
// It will activate automatically when your API sends a message with type: 'structured_insight'.
function StructuredInsight({ payload }) {
  return (
    <Stack gap="xs">
      <Group>
        <ThemeIcon variant="light" size="lg">
          <IconAnalyze size={20} />
        </ThemeIcon>
        <Text fw={700} size="sm">{payload.title}</Text>
      </Group>
      <List spacing="xs" size="sm" withPadding>
        {payload.points.map((point, index) => (
          <List.Item key={index}>{point}</List.Item>
        ))}
      </List>
      {payload.conclusion && <Text c="dimmed" size="sm">{payload.conclusion}</Text>}
    </Stack>
  );
}

export function ChatMessage({ message }) {
  const isAssistant = message.role === 'assistant';
  // Check for the new structured message type.
  const isStructured = message.type === 'structured_insight' && message.payload;

  const avatar = isAssistant ? (
    <Avatar color="blue" radius="xl">
      <IconRobot size="1.5rem" />
    </Avatar>
  ) : (
    <Avatar color="gray" radius="xl">
      <IconUser size="1.5rem" />
    </Avatar>
  );

  return (
    <Group align="flex-start" wrap="nowrap" gap="md">
      {avatar}
      <Paper
        p="md"
        radius="lg"
        withBorder
        style={{
          flex: 1,
          backgroundColor: isAssistant
            ? 'var(--mantine-color-dark-6)'
            : 'var(--mantine-color-dark-7)',
          maxWidth: '90%',
        }}
      >
        {isStructured ? (
          <StructuredInsight payload={message.payload} />
        ) : (
          <Text component="div" size="sm" style={{ lineHeight: 1.6 }}>
            {/* Using react-markdown allows for rich text formatting from the AI */}
            <Markdown>{message.content}</Markdown>
          </Text>
        )}
      </Paper>
    </Group>
  );
}