// src/components/ai/ChatInput.tsx
import { useState } from 'react';
import { Textarea, ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconSend, IconPlayerStopFilled } from '@tabler/icons-react';

interface ChatInputProps {
  onSend: (value: string) => void;
  onStop: () => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, onStop, isLoading }: ChatInputProps) {
  const [value, setValue] = useState('');

  // CORRECTIVE ACTION: Extracted core logic to avoid passing incompatible event types.
  const handleSend = () => {
    if (value.trim() && !isLoading) {
      onSend(value);
      setValue('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
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
              handleSend(); // Call the logic directly, removing the 'any' cast.
            }
          }}
        />
        {isLoading ? (
          <Tooltip label="Stop Generation" position="top" withArrow>
            <ActionIcon size="lg" onClick={onStop} variant="filled" color="red">
              <IconPlayerStopFilled size="1.2rem" />
            </ActionIcon>
          </Tooltip>
        ) : (
          <Tooltip label="Send Message" position="top" withArrow>
            <ActionIcon type="submit" size="lg" disabled={!value.trim()}>
              <IconSend size="1.2rem" />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </form>
  );
}
