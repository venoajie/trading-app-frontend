
// src/components/AssistantSidebar/ChatMessage.jsx
import { Avatar, Group, Paper, Stack, Text, ThemeIcon, List, Alert, Box } from '@mantine/core';
import { IconUser, IconRobot, IconAnalyze, IconAlertTriangle } from '@tabler/icons-react';
import Markdown from 'react-markdown';

function StructuredInsight({ payload }) {
  // ... (This sub-component remains unchanged)
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

const DISCLAIMER_TEXT = "Disclaimer: This is not financial advice.";

export function ChatMessage({ message }) {
  if (message.isError) {
    // ... (Error handling remains unchanged)
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

  let mainContent = message.content;
  let disclaimer = null;
  if (isAssistant && mainContent.includes(DISCLAIMER_TEXT)) {
    mainContent = mainContent.replace(DISCLAIMER_TEXT, '').trim();
    disclaimer = DISCLAIMER_TEXT;
  }

  const avatar = isAssistant ? (
    <Avatar color="blue" radius="xl"><IconRobot size="1.5rem" /></Avatar>
  ) : (
    <Avatar color="gray" radius="xl"><IconUser size="1.5rem" /></Avatar>
  );

  return (
    <Group align="flex-start" wrap="nowrap" gap="md">
      {avatar}
      <Box style={{ flex: 1, maxWidth: '90%' }}>
        {/*
          --- THE REFACTOR ---
          1. We replace the static `style` prop with the dynamic `styles` prop.
          2. This gives us access to the `theme` object.
          3. We use a ternary operator (`theme.colorScheme === 'dark' ? ... : ...`)
             to select colors based on the current theme.
          4. This implements ADR-016's `Visual_Hierarchy` by giving the AI a more
             "subtle" background color than the user's message.
        */}
        <Paper
          p="md"
          radius="lg"
          withBorder
          styles={(theme) => ({
            root: {
              backgroundColor: isAssistant
                ? (theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]) // AI: Subtle background
                : (theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white), // User: Standard background
            },
          })}
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