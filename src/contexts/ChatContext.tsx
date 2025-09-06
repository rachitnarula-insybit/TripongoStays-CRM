'use client';

import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3';
}

type ChatAction =
  | { type: 'TOGGLE_CHAT' }
  | { type: 'OPEN_CHAT' }
  | { type: 'CLOSE_CHAT' }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_MODEL'; payload: ChatState['model'] }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; content: string } };

const initialState: ChatState = {
  isOpen: false,
  messages: [],
  isLoading: false,
  model: 'gpt-4',
};

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'TOGGLE_CHAT':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CHAT':
      return { ...state, isOpen: true };
    case 'CLOSE_CHAT':
      return { ...state, isOpen: false };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_MODEL':
      return { ...state, model: action.payload };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id
            ? { ...msg, content: action.payload.content, isLoading: false }
            : msg
        ),
      };
    default:
      return state;
  }
};

interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (content: string) => Promise<void>;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  clearMessages: () => void;
  setModel: (model: ChatState['model']) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Mock AI response function - replace with actual API call
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Mock responses based on common queries
    const responses = [
      "I'm here to help you with your CRM tasks. What would you like to know about your leads, bookings, or properties?",
      "Based on your dashboard data, I can see some interesting trends. Would you like me to analyze your recent performance?",
      "I can help you with lead management, booking analysis, or property insights. What specific area interests you?",
      "Let me analyze your current data... I notice some opportunities for improvement in your lead conversion rates.",
      "I'm your AI assistant for TripongoStays CRM. I can help with analytics, recommendations, and answering questions about your business data.",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = async (content: string): Promise<void> => {
    if (!content.trim() || state.isLoading) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    // Add user message
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_LOADING', payload: true });

    // Create loading assistant message
    const assistantMessageId = (Date.now() + 1).toString();
    const loadingAssistantMessage: ChatMessage = {
      id: assistantMessageId,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isLoading: true,
    };

    dispatch({ type: 'ADD_MESSAGE', payload: loadingAssistantMessage });

    try {
      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();
      
      // Generate AI response
      const aiResponse = await generateAIResponse(content);
      
      // Update the loading message with actual content
      dispatch({
        type: 'UPDATE_MESSAGE',
        payload: { id: assistantMessageId, content: aiResponse },
      });
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Update with error message
      dispatch({
        type: 'UPDATE_MESSAGE',
        payload: {
          id: assistantMessageId,
          content: 'Sorry, I encountered an error. Please try again.',
        },
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      abortControllerRef.current = null;
    }
  };

  const toggleChat = () => dispatch({ type: 'TOGGLE_CHAT' });
  const openChat = () => dispatch({ type: 'OPEN_CHAT' });
  const closeChat = () => dispatch({ type: 'CLOSE_CHAT' });
  const clearMessages = () => dispatch({ type: 'CLEAR_MESSAGES' });
  const setModel = (model: ChatState['model']) => dispatch({ type: 'SET_MODEL', payload: model });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const contextValue: ChatContextType = {
    state,
    dispatch,
    sendMessage,
    toggleChat,
    openChat,
    closeChat,
    clearMessages,
    setModel,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};
