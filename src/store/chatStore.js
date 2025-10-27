
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
    ` : ''; // Handle cases where context is null (e.g., on portfolio page)
    
    const fullPrompt = formattedContext + prompt;

    try {
      const response = await apiClient.post('/ai/chat', {
        prompt: fullPrompt,
        conversation_id: get().conversationId,
      });

      // Handle successful API calls that return an empty answer.
      if (!response.data.answer) {
        const emptyResponseMessage = {
          role: 'assistant',
          content: 'The AI returned an empty response. This may be due to a content filter or an issue with the prompt. Please try rephrasing your question.',
          isError: true, // Flag this as a special error message for the UI.
        };
        set(state => ({
          messages: [...state.messages, emptyResponseMessage],
          isLoading: false,
        }));
        return; // Stop further execution
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
      // Provide a specific message if available, otherwise a general one.
      const specificMessage = error.response?.data?.detail;
      const generalMessage = 'The AI assistant is currently unavailable or encountered an error. Please try again later.';
      
      const errorMessage = specificMessage || generalMessage;

      // Show a system notification for immediate feedback.
      notifications.show({
        title: 'AI Assistant Error',
        message: errorMessage,
        color: 'red',
      });
      
      // Create a persistent error message in the chat history.
      const errorResponseMessage = {
        role: 'assistant',
        content: errorMessage,
        isError: true, // Flag this as an error for the UI.
      };
      set(state => ({
        messages: [...state.messages, errorResponseMessage],
        isLoading: false,
      }));
    }
  },

  clearChat: () => set({ messages: [initialMessage], conversationId: null }),
}));