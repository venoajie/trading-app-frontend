// src/services/aiApiClient.ts
interface StreamerCallbacks {
  onToken: (token: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

export interface StreamController {
  cancel: () => void;
}

/**
 * This is the "Fake Streamer" placeholder function mandated by Blueprint 5.1.
 * It simulates a real-time, token-by-token stream from an AI service.
 * It exposes an `onToken` callback for progressive updates and a `cancel`
 * method to terminate the stream, adhering to the required architectural contract.
 */
export const fakeStreamer = (
  prompt: string,
  callbacks: StreamerCallbacks
): StreamController => {
  const { onToken, onComplete, onError } = callbacks;
  let intervalId: NodeJS.Timeout | null = null;
  let cancelled = false;

  // CORRECTIVE ACTION: Added a simple validation to use the 'onError' callback.
  if (!prompt || !prompt.trim()) {
    onError(new Error('Prompt cannot be empty.'));
    onComplete(); // Ensure the stream state is finalized.
    return { cancel: () => {} };
  }

  const response =
    `This is a streamed response, token-by-token, demonstrating the real-time architecture. It is designed to simulate a real AI model's output, fulfilling the requirements of Blueprint section 5.1. The previous request-response pattern is now deprecated.`.split(
      ' '
    );

  let i = 0;
  intervalId = setInterval(() => {
    if (cancelled) {
      if (intervalId) clearInterval(intervalId);
      return;
    }
    if (i < response.length) {
      const token = i === 0 ? response[i] : ` ${response[i]}`;
      onToken(token);
      i++;
    } else {
      if (intervalId) clearInterval(intervalId);
      onComplete();
    }
  }, 80);

  return {
    cancel: () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      onComplete();
    },
  };
};

const aiApiClient = {
  streamChat: fakeStreamer,
};

export default aiApiClient;
