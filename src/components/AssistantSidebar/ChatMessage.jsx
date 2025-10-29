
// src/components/AssistantSidebar/ChatMessage.jsx
import { Avatar, Group, Paper, Stack, Text, ThemeIcon, List, Alert, Box } from '@mantine/core';
import { IconUser, IconRobot, IconAnalyze, IconAlertTriangle } from '@tabler/icons-react';
import Markdown from 'react-markdown';

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

// Disclaimer text to be identified and separated
const DISCLAIMER_TEXT = "Disclaimer: This is not financial advice.";

export function ChatMessage({ message }) {
  if (message.isError) {
    return (
      <Alert
        variant="light"
        color="red"
        title="Assistant Error"
        icon={<IconAlertTriangle />}
        radius="lg"
      >
        {message.content}
      </Alert>
    );
  }
  
  const isAssistant = message.role === 'assistant';
  const isStructured = message.type === 'structured_insight' && message.payload;

  // Logic to separate the disclaimer from the main content
  let mainContent = message.content;
  let disclaimer = null;
  if (isAssistant && mainContent.includes(DISCLAIMER_TEXT)) {
    mainContent = mainContent.replace(DISCLAIMER_TEXT, '').trim();
    disclaimer = DISCLAIMER_TEXT;
  }

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
      <Box style={{ flex: 1, maxWidth: '90%' }}>
        <Paper
          p="md"
          radius="lg"
          withBorder
          style={{
            backgroundColor: isAssistant
              ? 'var(--mantine-color-dark-6)'
              : 'var(--mantine-color-dark-7)',
          }}
        >
          {isStructured ? (
            <StructuredInsight payload={message.payload} />
          ) : (
            <Text component="div" size="sm" style={{ lineHeight: 1.6 }}>
              <Markdown>{mainContent}</Markdown>
            </Text>
          )}
        </Paper>
        {disclaimer && (
          <Text c="dimmed" fz="xs" mt="xs" pl="md">
            {disclaimer}
          </Text>
        )}
      </Box>
    </Group>
  );
}