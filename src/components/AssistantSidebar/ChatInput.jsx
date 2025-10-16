
// src/components/AssistantSidebar/ChatInput.jsx
import { useState } from 'react';
import { Textarea, ActionIcon, Group, Loader } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';

export function ChatInput({ onSend, isLoading }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSend(value);
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Group gap="xs" wrap="nowrap" align="flex-end">
        <Textarea
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          placeholder="Ask a question..."
          autosize
          minRows={1}
          maxRows={4}
          disabled={isLoading}
          style={{ flex: 1 }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSubmit(event);
            }
          }}
        />
        <ActionIcon type="submit" size="lg" disabled={isLoading || !value.trim()}>
          {isLoading ? <Loader size="sm" /> : <IconSend />}
        </ActionIcon>
      </Group>
    </form>
  );
}