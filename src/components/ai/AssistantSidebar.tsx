// src/components/ai/AssistantSidebar.tsx
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Stack,
  ScrollArea,
  Box,
  Title,
  Alert,
  Group,
  Chip,
  Text,
} from '@mantine/core';
import { IconInfoCircle, IconMoodSad } from '@tabler/icons-react';
import { useChatStore, ChatContext } from '../../store/chatStore';
import { useDecisionStore } from '../../store/decisionStore';
import { useUiStore } from '../../store/uiStore';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

const decisionWorkspacePrompts = [
  'Critique my assumptions.',
  'What key risks am I missing?',
  'How does this align with my goals?',
  "Play devil's advocate.",
];

export function AssistantSidebar() {
  const location = useLocation();
  const { messages, isLoading, sendMessage, stopGeneration, clearChat } =
    useChatStore();
  const { tradeIdea, assumptions } = useDecisionStore();
  const { isAiAssistantAvailable } = useUiStore();
  const viewport = useRef<HTMLDivElement>(null);

  const isOnDecisionWorkspace = location.pathname.includes(
    '/decision-workspace'
  );

  useEffect(() => {
    if (isOnDecisionWorkspace && tradeIdea) {
      clearChat();
    }
  }, [isOnDecisionWorkspace, tradeIdea, clearChat]);

  // Restored legacy dependency array for simplicity and robustness.
  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = (prompt: string) => {
    if (!prompt || !prompt.trim()) return;
    let context: ChatContext | undefined = undefined;
    if (isOnDecisionWorkspace) {
      context = { tradeIdea, assumptions };
    }
    sendMessage(prompt, context);
  };

  if (!isAiAssistantAvailable) {
    return (
      <Stack h="100%" gap="md">
        <Title order={4}>AI Coach</Title>
        <Alert
          variant="light"
          color="gray"
          title="Assistant Unavailable"
          icon={<IconMoodSad />}
        >
          The AI Assistant is currently disabled. Core application features
          remain active.
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack h="100%" gap="md">
      <Title order={4}>AI Coach</Title>

      <Alert
        variant="light"
        color="yellow"
        radius="md"
        title="Analysis, Not Advice"
        icon={<IconInfoCircle />}
      >
        This AI provides analysis to improve your decision-making process. It is
        not financial advice.
      </Alert>

      {/* RESTORED LEGACY PATTERN: Using 'flex: 1' is the correct way to make the
          ScrollArea expand to fill the remaining space in the parent Stack. */}
      <ScrollArea style={{ flex: 1 }} viewportRef={viewport}>
        <Stack gap="lg" p="xs">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
        </Stack>
      </ScrollArea>

      <Stack gap="xs">
        {isOnDecisionWorkspace && (
          <>
            <Text size="sm" c="dimmed">
              Suggested Prompts:
            </Text>
            <Group gap="xs">
              {decisionWorkspacePrompts.map((prompt) => (
                <Chip
                  key={prompt}
                  value={prompt}
                  size="xs"
                  onClick={() => handleSendMessage(prompt)}
                >
                  {prompt}
                </Chip>
              ))}
            </Group>
          </>
        )}
        <Box>
          <ChatInput
            onSend={handleSendMessage}
            onStop={stopGeneration}
            isLoading={isLoading}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
