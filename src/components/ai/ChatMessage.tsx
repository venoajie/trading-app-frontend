// src/components/ai/ChatMessage.tsx
import {
  Avatar,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  List,
  Alert,
  Box,
} from '@mantine/core';
import {
  IconUser,
  IconRobot,
  IconAnalyze,
  IconAlertTriangle,
} from '@tabler/icons-react';
import Markdown from 'react-markdown';
import { ChatMessage as ChatMessageType } from '../../store/chatStore';

interface StructuredInsightPayload {
  title: string;
  points: string[];
  conclusion?: string;
}

function StructuredInsight({ payload }: { payload: StructuredInsightPayload }) {
  return (
    <Stack gap="xs">
      <Group>
        <ThemeIcon variant="light" size="lg">
          <IconAnalyze size={20} />
        </ThemeIcon>
        <Text fw={700} size="sm">
          {payload.title}
        </Text>
      </Group>
      <List spacing="xs" size="sm" withPadding>
        {payload.points.map((point, index) => (
          <List.Item key={index}>{point}</List.Item>
        ))}
      </List>
      {payload.conclusion && (
        <Text c="dimmed" size="sm">
          {payload.conclusion}
        </Text>
      )}
    </Stack>
  );
}

const DISCLAIMER_TEXT = 'Disclaimer: This is not financial advice.';

export function ChatMessage({ message }: { message: ChatMessageType }) {
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
          styles={(theme) => ({
            root: {
              backgroundColor: isAssistant
                ? theme.colorScheme === 'dark'
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0]
                : theme.colorScheme === 'dark'
                  ? theme.colors.dark[6]
                  : theme.white,
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
