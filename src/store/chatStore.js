
// src/store/chatStore.js
import { create } from 'zustand';
import apiClient from '../services/apiClient';
import { notifications } from '@mantine/notifications';

const initialMessage = { 
  role: 'assistant', 
  content: 'I am your AI Coach. As you define your trade idea and outcomes, ask me questions to challenge your assumptions.' 
};

export const useChatStore = create((set, get) => ({
  messages: [initialMessage],
  isLoading: false,
  conversationId: null,

  // --- MODIFIED: sendMessage is now context-aware ---
  sendMessage: async (prompt, context) => {
    if (get().isLoading) return;

    const userMessage = { role: 'user', content: prompt };
    set((state) => ({ 
      messages: [...state.messages, userMessage],
      isLoading: true,
    }));

    // --- NEW: Format the context for the AI ---
    const formattedContext = `
      Current Trade Idea: "${context.tradeIdea}"

      Assumptions:
      ${context.assumptions.map(a => `- ${a.scenario}: Probability ${a.probability*100}%, Outcome $${a.outcome}`).join('\n')}

      User's Question:
    `;
    const fullPrompt = formattedContext + prompt;

    try {
      const response = await apiClient.post('/ai/chat', {
        prompt: fullPrompt, // Send the full, context-aware prompt
        conversation_id: get().conversationId,
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.answer,
        sources: response.data.sources,
      };
      
      set((state) => ({
        messages: [...state.messages, assistantMessage],
        conversationId: response.data.conversation_id,
        isLoading: false,
      }));

    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'An error occurred. Please try again.';
      notifications.show({
        title: 'AI Assistant Error',
        message: errorMessage,
        color: 'red',
      });
      
      const errorResponseMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}`
      };
      set(state => ({
        messages: [...state.messages, errorResponseMessage],
        isLoading: false,
      }));
    }
  },

  // --- NEW: Action to clear the chat history ---
  clearChat: () => set({ messages: [initialMessage], conversationId: null }),
}));