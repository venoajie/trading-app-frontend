
// src/store/chatStore.js
import { create } from 'zustand';
import apiClient from '../services/apiClient';
import { notifications } from '@mantine/notifications';

export const useChatStore = create((set, get) => ({
  messages: [
    { 
      role: 'assistant', 
      content: 'Hello! How can I help you with your portfolio today?' 
    }
  ],
  isLoading: false,
  conversationId: null,

  sendMessage: async (prompt) => {
    if (get().isLoading) return;

    // 1. Add user's message to the state immediately
    const userMessage = { role: 'user', content: prompt };
    set((state) => ({ 
      messages: [...state.messages, userMessage],
      isLoading: true,
    }));

    try {
      // 2. Send the request to the backend
      const response = await apiClient.post('/ai/chat', {
        prompt: prompt,
        conversation_id: get().conversationId,
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.answer,
        sources: response.data.sources, // Optional: store sources if available
      };
      
      // 3. Add the assistant's response and update conversation ID
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
      
      // 4. Handle errors
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
}));