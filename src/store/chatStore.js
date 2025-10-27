
// src/store/chatStore.js
import { create } from 'zustand';
import apiClient from '../services/apiClient';
// The notifications import is no longer needed here if no other action uses it.
// For now, we will leave it in case other features are added, but the call is removed.
import { notifications } from '@mantine/notifications';

const initialMessage = { 
  role: 'assistant', 
  content: 'I am your AI Coach. As you define your trade idea and outcomes, ask me questions to challenge your assumptions.' 
};

export const useChatStore = create((set, get) => ({
  messages: [initialMessage],
  isLoading: false,
  conversationId: null,

  sendMessage: async (prompt, context) => {
    if (get().isLoading) return;

    const userMessage = { role: 'user', content: prompt };
    set((state) => ({ 
      messages: [...state.messages, userMessage],
      isLoading: true,
    }));

    const formattedContext = context ? `
      Current Trade Idea: "${context.tradeIdea}"

      Assumptions:
      ${context.assumptions.map(a => `- ${a.scenario}: Probability ${a.probability*100}%, Outcome $${a.outcome}`).join('\n')}

      User's Question:
    ` : '';
    
    const fullPrompt = formattedContext + prompt;

    try {
      const response = await apiClient.post('/ai/chat', {
        prompt: fullPrompt,
        conversation_id: get().conversationId,
      });

      if (!response.data.answer) {
        const emptyResponseMessage = {
          role: 'assistant',
          content: 'The AI returned an empty response. This may be due to a content filter or an issue with the prompt. Please try rephrasing your question.',
          isError: true,
        };
        set(state => ({
          messages: [...state.messages, emptyResponseMessage],
          isLoading: false,
        }));
        return;
      }

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
      const specificMessage = error.response?.data?.detail;
      const generalMessage = 'The AI assistant is currently unavailable or encountered an error. Please try again later.';
      
      const errorMessage = specificMessage || generalMessage;
      
      // CORRECTIVE ACTION: The pop-up notification has been removed.
      
      const errorResponseMessage = {
        role: 'assistant',
        content: errorMessage,
        isError: true,
      };
      set(state => ({
        messages: [...state.messages, errorResponseMessage],
        isLoading: false,
      }));
    }
  },

  clearChat: () => set({ messages: [initialMessage], conversationId: null }),
}));