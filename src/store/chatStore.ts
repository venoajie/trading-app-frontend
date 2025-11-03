// src/store/chatStore.ts
import { create } from 'zustand';
import aiApiClient, { StreamController } from '../services/aiApiClient';

// CORRECTIVE ACTION: Defined specific types to eliminate 'any'.
export interface StructuredInsightPayload {
  title: string;
  points: string[];
  conclusion?: string;
}

export interface ChatContext {
  tradeIdea: string;
  // A more specific type for an assumption object.
  assumptions: { scenario: string; probability: number; outcome: number }[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
  type?: 'structured_insight';
  payload?: StructuredInsightPayload; // Replaced 'any'
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  conversationId: string | null;
  activeStreamController: StreamController | null;
  sendMessage: (prompt: string, context?: ChatContext) => Promise<void>; // Replaced 'any'
  stopGeneration: () => void;
  clearChat: () => void;
}

const initialMessage: ChatMessage = {
  role: 'assistant',
  content:
    'I am your AI Coach. As you define your trade idea and outcomes, ask me questions to challenge your assumptions.',
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [initialMessage],
  isLoading: false,
  conversationId: null,
  activeStreamController: null,

  sendMessage: async (prompt, context) => {
    if (get().isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: prompt };
    const assistantPlaceholder: ChatMessage = {
      role: 'assistant',
      content: '',
    };

    set((state) => ({
      messages: [...state.messages, userMessage, assistantPlaceholder],
      isLoading: true,
      activeStreamController: null,
    }));

    const formattedContext = context
      ? `
      Current Trade Idea: "${context.tradeIdea}"
      Assumptions:
      ${context.assumptions.map((a) => `- ${a.scenario}: Probability ${a.probability * 100}%, Outcome $${a.outcome}`).join('\n')}
      User's Question:
    `
      : ''; // CORRECTIVE ACTION: Type inference now works, 'any' is removed.
    const fullPrompt = formattedContext + prompt;

    const streamController = aiApiClient.streamChat(fullPrompt, {
      onToken: (token) => {
        set((state) => {
          const lastMessage = state.messages[state.messages.length - 1];
          const updatedMessages = [...state.messages];
          updatedMessages[updatedMessages.length - 1] = {
            ...lastMessage,
            content: lastMessage.content + token,
          };
          return { messages: updatedMessages };
        });
      },
      onComplete: () => {
        set({ isLoading: false, activeStreamController: null });
      },
      onError: (error) => {
        const errorMessage =
          error.message || 'An unknown error occurred during streaming.';
        set((state) => {
          const lastMessage = state.messages[state.messages.length - 1];
          const updatedMessages = [...state.messages];
          updatedMessages[updatedMessages.length - 1] = {
            ...lastMessage,
            content: errorMessage,
            isError: true,
          };
          return { messages: updatedMessages };
        });
        set({ isLoading: false, activeStreamController: null });
      },
    });

    set({ activeStreamController: streamController });
  },

  stopGeneration: () => {
    const { activeStreamController } = get();
    if (activeStreamController) {
      activeStreamController.cancel();
    }
  },

  clearChat: () =>
    set({
      messages: [initialMessage],
      conversationId: null,
      isLoading: false,
      activeStreamController: null,
    }),
}));
