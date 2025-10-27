
// src/pages/DecisionWorkspacePage/components/CoachingPanel.jsx
import { useEffect, useRef } from 'react';
import { Stack, ScrollArea, Box, Title } from '@mantine/core';
import { useChatStore } from '../../../store/chatStore';
import { useDecisionStore } from '../../../store/decisionStore';
import { ChatMessage } from '../../../components/AssistantSidebar/ChatMessage';
import { ChatInput } from '../../../components/AssistantSidebar/ChatInput';

// CORRECTIVE ACTION: Enforce consistent named export.
export function CoachingPanel() {
  const { messages, isLoading, sendMessage, clearChat } = useChatStore();
  const { tradeIdea, assumptions } = useDecisionStore();
  const viewport = useRef(null);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // Clear the chat when the user starts a new trade idea analysis
  useEffect(() => {
    clearChat();
  }, [tradeIdea, clearChat]);


  // This function gathers the context and sends it with the user's prompt
  const handleSendMessage = (prompt) => {
    const context = {
      tradeIdea,
      assumptions,
    };
    sendMessage(prompt, context);
  };

  return (
    <Stack h="100%" gap="md">
      <Title order={3}>4. AI Coach</Title>
      <ScrollArea style={{ flex: 1 }} viewportRef={viewport}>
        <Stack gap="lg" p="xs">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
        </Stack>
      </ScrollArea>
      <Box>
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </Box>
    </Stack>
  );
}