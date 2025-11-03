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
      // FIX: Correctly retrieve the token from the 'auth-storage' object in localStorage.
      const authStorage = localStorage.getItem('auth-storage');
      const token = authStorage ? JSON.parse(authStorage).state.token : null;

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
        // If the token is invalid, the server will respond with a 401.
        if (response.status === 401) {
          throw new Error(errorBody.detail || 'Could not validate credentials');
        }
        const errorMessage =
          errorBody.detail || `HTTP error! Status: ${response.status}`;
        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error('Response body is null.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

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
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('Stream fetch aborted by user.');
          onComplete();
        } else {
          onError(error);
        }
      } else {
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
