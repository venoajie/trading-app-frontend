// src/store/chatStore.spec.tsx
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useChatStore } from './chatStore';
import aiApiClient from '../services/aiApiClient';
import { StreamController } from '../services/aiApiClient';

vi.mock('../services/aiApiClient');

describe('chatStore (Streaming)', () => {
  interface MockStreamCallbacks {
    onToken: (token: string) => void;
    onComplete: () => void;
    onError: (error: Error) => void;
  }

  let streamCallbacks: MockStreamCallbacks;
  let mockCancel = vi.fn();

  beforeEach(() => {
    act(() => {
      useChatStore.getState().clearChat();
    });

    mockCancel.mockClear();
    // CORRECTIVE ACTION (TS6133): Prefixed unused variable with underscore.
    vi.mocked(aiApiClient.streamChat).mockImplementation(
      (_prompt: string, callbacks: any): StreamController => {
        streamCallbacks = callbacks;
        return { cancel: mockCancel };
      }
    );
  });

  it('should add user and assistant messages and set loading state on send', async () => {
    const initialMessagesCount = useChatStore.getState().messages.length;

    await act(async () => {
      useChatStore.getState().sendMessage('Hello AI');
    });

    const state = useChatStore.getState();
    expect(state.isLoading).toBe(true);
    expect(state.messages.length).toBe(initialMessagesCount + 2);
    expect(state.messages[initialMessagesCount].role).toBe('user');
    expect(state.messages[initialMessagesCount].content).toBe('Hello AI');
    expect(state.messages[initialMessagesCount + 1].role).toBe('assistant');
    expect(state.messages[initialMessagesCount + 1].content).toBe('');
  });

  it('should append tokens to the last assistant message', async () => {
    await act(async () => {
      useChatStore.getState().sendMessage('Test');
    });

    act(() => {
      streamCallbacks.onToken('Hello');
    });
    expect(useChatStore.getState().messages.at(-1)?.content).toBe('Hello');

    act(() => {
      streamCallbacks.onToken(' there');
    });
    expect(useChatStore.getState().messages.at(-1)?.content).toBe(
      'Hello there'
    );
  });

  it('should set isLoading to false on stream completion', async () => {
    await act(async () => {
      useChatStore.getState().sendMessage('Test');
    });
    expect(useChatStore.getState().isLoading).toBe(true);

    act(() => {
      streamCallbacks.onComplete();
    });
    expect(useChatStore.getState().isLoading).toBe(false);
    expect(useChatStore.getState().activeStreamController).toBeNull();
  });

  it('should call the cancel function on stopGeneration', async () => {
    await act(async () => {
      useChatStore.getState().sendMessage('Generate a long story');
    });

    expect(useChatStore.getState().isLoading).toBe(true);
    expect(mockCancel).not.toHaveBeenCalled();

    act(() => {
      useChatStore.getState().stopGeneration();
    });

    expect(mockCancel).toHaveBeenCalledOnce();
    act(() => {
      streamCallbacks.onComplete();
    });
    expect(useChatStore.getState().isLoading).toBe(false);
  });

  it('should handle errors from the stream', async () => {
    await act(async () => {
      useChatStore.getState().sendMessage('Test');
    });

    act(() => {
      streamCallbacks.onError(new Error('Stream failed'));
    });

    const state = useChatStore.getState();
    expect(state.isLoading).toBe(false);
    const lastMessage = state.messages.at(-1);
    expect(lastMessage?.isError).toBe(true);
    expect(lastMessage?.content).toBe('Stream failed');
  });
});
