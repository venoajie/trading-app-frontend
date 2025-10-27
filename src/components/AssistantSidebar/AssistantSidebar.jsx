
// src/components/AssistantSidebar/AssistantSidebar.jsx
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Stack, ScrollArea, Box, Title, Alert, Group, Chip, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useChatStore } from '../../store/chatStore';
import { useDecisionStore } from '../../store/decisionStore';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

// Prompts specific to the Decision Workspace
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
  const viewport = useRef(null);

  const isOnDecisionWorkspace = location.pathname.includes('/decision-workspace');

  // Effect to clear chat only when entering the decision workspace with a new idea
  useEffect(() => {
    if (isOnDecisionWorkspace && tradeIdea) {
      clearChat();
    }
  }, [isOnDecisionWorkspace, tradeIdea, clearChat]);


  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // Context-aware message sending function
  const handleSendMessage = (prompt) => {
    if (!prompt || !prompt.trim()) return;

    let context = null;
    // Only add the specific decision context if on the correct page
    if (isOnDecisionWorkspace) {
      context = { tradeIdea, assumptions };
    }
    
    sendMessage(prompt, context);
  };

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
        {/* Conditionally render suggested prompts for the Decision Workspace */}
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