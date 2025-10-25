
// src/pages/DecisionWorkspacePage/components/CoachingPanel.jsx
import { useEffect, useRef } from 'react';
import { Stack, ScrollArea, Box, Title } from '@mantine/core';
import { useChatStore } from '../../../store/chatStore';
import { ChatMessage } from '../../../components/AssistantSidebar/ChatMessage';
import { ChatInput } from '../../../components/AssistantSidebar/ChatInput';

export function CoachingPanel() {
  const { messages, isLoading, sendMessage } = useChatStore();
  const viewport = useRef(null);

  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

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
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </Box>
    </Stack>
  );
}