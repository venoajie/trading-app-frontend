
// src/components/AssistantSidebar/AssistantSidebar.jsx
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Stack, ScrollArea, Box, Title, Alert, Group, Chip, Text } from '@mantine/core';
import { IconInfoCircle, IconMoodSad } from '@tabler/icons-react';
import { useChatStore } from '../../store/chatStore';
import { useDecisionStore } from '../../store/decisionStore';
import { useUiStore } from '../../store/uiStore'; // Import uiStore
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

const decisionWorkspacePrompts = [
  'Critique my assumptions.',
  'What key risks am I missing?',
  'How does this align with my goals?',
  'Play devil\'s advocate.',
];

export function AssistantSidebar() {
  const location = useLocation();
  const { messages, isLoading, sendMessage, clearChat } = useChatStore();
  const { tradeIdea, assumptions } = useDecisionStore();
  const { isAiAssistantAvailable } = useUiStore(); // Get the availability state
  const viewport = useRef(null);

  const isOnDecisionWorkspace = location.pathname.includes('/decision-workspace');

  useEffect(() => {
    if (isOnDecisionWorkspace && tradeIdea) {
      clearChat();
    }
  }, [isOnDecisionWorkspace, tradeIdea, clearChat]);

  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (prompt) => {
    if (!prompt || !prompt.trim()) return;
    let context = null;
    if (isOnDecisionWorkspace) {
      context = { tradeIdea, assumptions };
    }
    sendMessage(prompt, context);
  };

  // Render an unavailability message if the AI is disabled via config.
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
          The AI Assistant is currently disabled. Core application features remain active.
        </Alert>
      </Stack>
    );
  }

  // Render the full AI Coach interface if it is available.
  return (
    <Stack h="100%" gap="md">
      <Title order={4}>AI Coach</Title>

      <Alert variant="light" color="blue" radius="md" title="Analysis, Not Advice" icon={<IconInfoCircle />}>
        This AI provides analysis to improve your decision-making process. It is not financial advice.
      </Alert>

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
            <Text size="sm" c="dimmed">Suggested Prompts:</Text>
            <Group gap="xs">
              {decisionWorkspacePrompts.map((prompt) => (
                <Chip key={prompt} value={prompt} size="xs" onClick={() => handleSendMessage(prompt)}>
                  {prompt}
                </Chip>
              ))}
            </Group>
          </>
        )}
        <Box>
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </Box>
      </Stack>
    </Stack>
  );
}