
// src/pages/DecisionWorkspacePage/components/CoachingPanel.jsx
import { useEffect, useRef } from 'react';
import { Stack, ScrollArea, Box, Title, Alert, Group, Chip, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useChatStore } from '../../../store/chatStore';
import { useDecisionStore } from '../../../store/decisionStore';
import { ChatMessage } from '../../../components/AssistantSidebar/ChatMessage';
import { ChatInput } from '../../../components/AssistantSidebar/ChatInput';

const suggestedPrompts = [
  'Critique my assumptions.',
  'What key risks am I missing?',
  'How does this align with my goals?',
  'Play devil\'s advocate.',
];

export function CoachingPanel() {
  const { messages, isLoading, sendMessage, clearChat } = useChatStore();
  const { tradeIdea, assumptions } = useDecisionStore();
  const viewport = useRef(null);

  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    // Only clear the chat if a trade idea is present, to avoid clearing on initial load.
    if(tradeIdea){
      clearChat();
    }
  }, [tradeIdea, clearChat]);


  const handleSendMessage = (prompt) => {
    if (!prompt || !prompt.trim()) return; // Prevent sending empty messages
    const context = {
      tradeIdea,
      assumptions,
    };
    sendMessage(prompt, context);
  };

  return (
    <Stack h="100%" gap="md">
      <Title order={3}>4. AI Coach</Title>

      {/* NEW: Disclaimer Badge */}
      <Alert variant="light" color="blue" radius="md" title="Analysis, Not Advice" icon={<IconInfoCircle />}>
        The AI Coach provides analysis to improve your decision-making process. It is not financial advice.
      </Alert>

      <ScrollArea style={{ flex: 1 }} viewportRef={viewport}>
        <Stack gap="lg" p="xs">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
        </Stack>
      </ScrollArea>

      {/* NEW: Suggested Prompts & Enhanced Layout */}
      <Stack gap="xs">
        <Text size="sm" c="dimmed">Suggested Prompts:</Text>
        <Group gap="xs">
          {suggestedPrompts.map((prompt) => (
            <Chip key={prompt} value={prompt} size="xs" onClick={() => handleSendMessage(prompt)}>
              {prompt}
            </Chip>
          ))}
        </Group>
        <Box>
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </Box>
      </Stack>
    </Stack>
  );
}