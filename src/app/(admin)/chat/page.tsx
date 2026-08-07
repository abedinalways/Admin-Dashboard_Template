"use client";

import React, { useState } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatArea from "@/components/chat/ChatArea";

const ChatPage: React.FC = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="h-[calc(100vh-140px)] flex rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
      {/* Sidebar - Hidden on mobile when chat is active */}
      <div className={`w-full md:w-80 lg:w-96 flex-shrink-0 ${showChat ? 'hidden md:block' : 'block'}`}>
        <ChatSidebar onSelectConversation={() => setShowChat(true)} />
      </div>

      {/* Chat Area - Full width on mobile */}
      <div className={`flex-1 ${showChat ? 'flex' : 'hidden md:flex'}`}>
        <div className="md:hidden flex items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setShowChat(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors mr-2"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Back to Messages</span>
        </div>
        <ChatArea />
      </div>
    </div>
  );
};

export default ChatPage;
