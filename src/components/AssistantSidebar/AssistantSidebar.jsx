
// src/components/AssistantSidebar/AssistantSidebar.jsx
import { useEffect, useRef } from 'react';
import { Stack, ScrollArea, Box } from '@mantine/core';
import { useChatStore } from '../../store/chatStore';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

export function AssistantSidebar() {
  const { messages, isLoading, sendMessage } = useChatStore();
  const viewport = useRef(null);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Stack h="100%" gap="md">
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