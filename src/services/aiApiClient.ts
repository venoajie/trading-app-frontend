// src/services/aiApiClient.ts

interface StreamerCallbacks {
  onToken: (token: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

export interface StreamController {
  cancel: () => void;
}

const streamChatWithFetch = (
  prompt: string,
  callbacks: StreamerCallbacks
): StreamController => {
  const { onToken, onComplete, onError } = callbacks;
  const controller = new AbortController();

  const executeFetch = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication token not found.');
      }

      const response = await fetch('/api/v1/ai/stream-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response
          .json()
          .catch(() => ({ detail: 'Failed to parse error response.' }));
        const errorMessage =
          errorBody.detail || `HTTP error! Status: ${response.status}`;
        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error('Response body is null.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // FIX (no-constant-condition): Disable rule for this standard stream-reading pattern.
      // The loop correctly terminates based on the `done` flag from the reader.
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        onToken(chunk);
      }

      onComplete();
    } catch (error: unknown) {
      // FIX (@typescript-eslint/no-explicit-any): Use 'unknown' for type safety.
      // Perform type checking before using the error object.
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('Stream fetch aborted by user.');
          onComplete();
        } else {
          onError(error);
        }
      } else {
        // Handle cases where a non-Error object is thrown.
        onError(new Error('An unknown, non-error object was thrown.'));
      }
    }
  };

  executeFetch();

  return {
    cancel: () => {
      controller.abort();
    },
  };
};

const aiApiClient = {
  streamChat: streamChatWithFetch,
};

export default aiApiClient;
