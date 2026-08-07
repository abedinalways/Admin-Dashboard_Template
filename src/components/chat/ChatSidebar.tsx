"use client";

import React from "react";
import { useChat } from "@/context/ChatContext";
import Image from "next/image";

interface ChatSidebarProps {
  onSelectConversation?: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSelectConversation }) => {
  const { conversations, activeConversation, setActiveConversation } = useChat();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
              fill="currentColor"
            />
          </svg>
          <input
            type="text"
            placeholder="Search messages"
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => {
              setActiveConversation(conversation);
              onSelectConversation?.();
            }}
            className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-l-2 ${
              activeConversation?.id === conversation.id
                ? "bg-gray-50 dark:bg-gray-800 border-brand-500"
                : "border-transparent"
            }`}
          >
            <div className="relative flex-shrink-0 w-12 h-12">
              <Image
                src={conversation.participantAvatar}
                alt={conversation.participantName}
                fill
                className="rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
              />
              {conversation.online && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {conversation.participantName}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                  {formatTime(conversation.lastMessageTime)}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {conversation.lastMessage}
              </p>
            </div>
            {conversation.unreadCount > 0 && (
              <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 bg-brand-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                {conversation.unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;