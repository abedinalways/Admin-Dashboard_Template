"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  online: boolean;
}

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  setActiveConversation: (conversation: Conversation | null) => void;
  sendMessage: (content: string) => void;
  isConnected: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Demo data
const demoConversations: Conversation[] = [
  {
    id: '1',
    participantName: 'Care Team',
    participantAvatar: '/images/chat/chat.jpg',
    lastMessage: 'Your prescription has been arrived.',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 2,
    online: true,
  },
  {
    id: '2',
    participantName: 'Dr. Sarah Johnson',
    participantAvatar: '/images/chat/chat.jpg',
    lastMessage: 'Your test results are ready.',
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unreadCount: 0,
    online: true,
  },
  {
    id: '3',
    participantName: 'Pharmacy Support',
    participantAvatar: '/images/chat/chat.jpg',
    lastMessage: 'Your order has been shipped.',
    lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    unreadCount: 0,
    online: false,
  },
];

const demoMessages: Message[] = [
  {
    id: '1',
    senderId: 'care-team',
    senderName: 'Care Team',
    senderAvatar: '/images/chat/chat.jpg',
    content: 'Hi! Maria,\n\nThank you for completing your assessment. Your treatment has been reviewed by our physician and has been approved. You\'ll receive a shipping confirmation once your medication is on the way.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isOwn: false,
  },
  {
    id: '2',
    senderId: 'me',
    senderName: 'Maria',
    senderAvatar: '/images/chat/chat.jpg',
    content: 'Thank you! When can I expect my medication to be shipped?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
    isOwn: true,
  },
  {
    id: '3',
    senderId: 'care-team',
    senderName: 'Care Team',
    senderAvatar: '/images/chat/chat.jpg',
    content: 'You\'re welcome! Your medication will be shipped within 1-2 business days. You will get an email with tracking information as soon as it\'s on the way.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 10 * 60 * 1000),
    isOwn: false,
  },
  {
    id: '4',
    senderId: 'me',
    senderName: 'Maria',
    senderAvatar: '/images/chat/chat.jpg',
    content: 'Great!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 15 * 60 * 1000),
    isOwn: true,
  },
];

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>(demoConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(demoConversations[0]);
  const [messages, setMessages] = useState<Message[]>(demoMessages);
  const [isConnected, setIsConnected] = useState(true);

  const sendMessage = useCallback((content: string) => {
    if (!activeConversation || !content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'Maria',
      senderAvatar: '/images/chat/chat.jpg',
      content: content.trim(),
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages(prev => [...prev, newMessage]);

    // Update last message in conversation
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversation.id
          ? {
              ...conv,
              lastMessage: content.trim(),
              lastMessageTime: new Date(),
            }
          : conv
      )
    );

    // Simulate socket response after 2 seconds
    setTimeout(() => {
      const responses = [
        "Thank you for your message. We'll get back to you shortly.",
        "I understand. Let me check that for you.",
        "Thanks for reaching out! Is there anything else I can help you with?",
        "Got it! I'll process that right away.",
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: activeConversation.id,
        senderName: activeConversation.participantName,
        senderAvatar: activeConversation.participantAvatar,
        content: randomResponse,
        timestamp: new Date(),
        isOwn: false,
      };

      setMessages(prev => [...prev, responseMessage]);

      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversation.id
            ? {
                ...conv,
                lastMessage: randomResponse,
                lastMessageTime: new Date(),
              }
            : conv
        )
      );
    }, 2000);
  }, [activeConversation]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        setActiveConversation,
        sendMessage,
        isConnected,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};