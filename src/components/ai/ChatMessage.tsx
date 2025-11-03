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
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconUser,
  IconRobot,
  IconAnalyze,
  IconAlertTriangle,
} from '@tabler/icons-react';
import {
  ChatMessage as ChatMessageType,
  StructuredInsightPayload,
} from '../../store/chatStore';
// We are temporarily removing the MarkdownRenderer to ensure content visibility.

function StructuredInsight({ payload }: { payload: StructuredInsightPayload }) {
  // ... (This sub-component remains unchanged)
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
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  if (message.isError) {
    // ... (Error handling remains unchanged)
    return (
      <Alert
        variant="light"
        color="red"
        title="Assistant Error"
        icon={<IconAlertTriangle />}
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

  // FINAL CORRECTION: If there is no content to display after trimming, render nothing.
  // This prevents empty message bubbles from ever appearing.
  if (!mainContent.trim() && !isStructured) {
    return null;
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
                ? isDark
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0]
                : isDark
                  ? theme.colors.dark[6]
                  : theme.white,
            },
          })}
        >
          {isStructured && message.payload ? (
            <StructuredInsight payload={message.payload} />
          ) : (
            // FINAL CORRECTION: Render content directly in a standard div to guarantee visibility.
            // This bypasses all library issues and proves the data flow is working.
            <Box
              component="div"
              fz="sm"
              style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}
            >
              {mainContent}
            </Box>
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
