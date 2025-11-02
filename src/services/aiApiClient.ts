// src/services/aiApiClient.ts

/**
 * Placeholder API client for AI-related services, specifically designed
 * to implement the "Fake Streamer" pattern as defined in the blueprint.
 *
 * This allows the UI to be built against a streaming-ready contract from day one,
 * preventing future refactoring when the real SSE (Server-Sent Events)
 * backend is implemented.
 */

// A simple async generator to simulate a streaming text response
async function* streamFakeResponse() {
  const message = 'This is a streamed response from the mock AI service.';
  const words = message.split(' ');
  for (const word of words) {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 100));
    yield `${word} `;
  }
}

// Function to convert an async generator to a ReadableStream
function generatorToStream(generator: AsyncGenerator<string, void, unknown>) {
  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const chunk of generator) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
}

export const aiApiClient = {
  /**
   * Simulates fetching a streaming response for a given prompt.
   * @param _prompt - The input prompt (ignored in this mock).
   * @returns A `ReadableStream` that yields text chunks over time.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getStreamingCompletion: (_prompt: string): ReadableStream<Uint8Array> => {
    const generator = streamFakeResponse();
    return generatorToStream(generator);
  },
};
