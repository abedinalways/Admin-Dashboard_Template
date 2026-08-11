"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import Image from "next/image";
// Icon components
const CameraIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PaperclipIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const ChatArea: React.FC = () => {
  const { activeConversation, messages, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const [attachmentType, setAttachmentType] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim() || attachment) {
      const attachmentData = attachment ? {
        url: attachmentPreview || '',
        name: attachment.name,
        type: attachmentType,
      } : undefined;
      sendMessage(newMessage, attachmentData);
      setNewMessage("");
      setAttachment(null);
      setAttachmentPreview(null);
      setAttachmentType('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
      setAttachmentType(file.type);
      const previewUrl = URL.createObjectURL(file);
      setAttachmentPreview(previewUrl);
    }
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
    setAttachmentType('');
  };

  const closeImagePreview = () => {
    setSelectedImage(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <svg
            className="mx-auto w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Select a conversation to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0 w-10 h-10">
            <Image
              src={activeConversation.participantAvatar}
              alt={activeConversation.participantName}
              fill
              className="rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
            />
            {activeConversation.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
            )}
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {activeConversation.participantName}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              We typically reply within a few hours
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Date Separator */}
        <div className="flex items-center justify-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            {formatDate(new Date())}
          </span>
        </div>

        {/* Messages */}
        {messages.map((message, index) => {
          const showDateSeparator =
            index === 0 ||
            messages[index - 1].timestamp.toDateString() !==
              message.timestamp.toDateString();

          return (
            <React.Fragment key={message.id}>
              {showDateSeparator && index > 0 && (
                <div className="flex items-center justify-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
              )}
              <div
                className={`flex gap-3 ${
                  message.isOwn ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {!message.isOwn && (
                  <div className="relative flex-shrink-0 w-8 h-8">
                    <Image
                      src={message.senderAvatar}
                      alt={message.senderName}
                      fill
                      className="rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                    />
                  </div>
                )}
                <div
                  className={`max-w-[70%] ${
                    message.isOwn ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2.5 ${
                      message.isOwn
                        ? "bg-green-50 dark:bg-green-900/20 text-gray-900 dark:text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {message.attachment && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        {message.attachment.type.startsWith('image/') ? (
                          <div className="relative inline-block">
                            <Image
                              src={message.attachment.url}
                              alt={message.attachment.name}
                              width={200}
                              height={200}
                              className="rounded-lg object-cover max-w-full cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => {
                                setSelectedImage(message.attachment!.url);
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg">
                            <svg className="w-8 h-8 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                              {message.attachment.name}
                            </span>
                            <button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = message.attachment!.url;
                                link.download = message.attachment!.name;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors flex-shrink-0"
                              title="Download"
                            >
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div
                    className={`flex items-center gap-1 mt-1 ${
                      message.isOwn ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.isOwn && (
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        {/* Attachment Preview */}
        {attachmentPreview && (
          <div className="mb-3 flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            {attachmentType.startsWith("image/") ? (
              <Image
                src={attachmentPreview}
                alt="Preview"
                width={48}
                height={48}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white truncate">{attachment?.name}</p>
            </div>
            <button
              onClick={removeAttachment}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
            >
              <XIcon />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Camera Button */}
          <button
            onClick={handleCameraClick}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
            title="Camera"
          >
            <CameraIcon />
          </button>

          {/* Attachment Button */}
          <button
            onClick={handleAttachmentClick}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
            title="Attach file"
          >
            <PaperclipIcon />
          </button>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
          <input
            ref={cameraInputRef}
            type="file"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*"
          />

          {/* Text Input */}
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a new message.."
              rows={1}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
              style={{ minHeight: "40px", maxHeight: "120px" }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() && !attachment}
            className="p-2.5 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg transition-colors flex-shrink-0"
          >
            <SendIcon />
          </button>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={closeImagePreview}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={closeImagePreview}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors z-10"
              aria-label="Close preview"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Image
              src={selectedImage}
              alt="Preview"
              width={800}
              height={800}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
