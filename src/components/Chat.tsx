import React, { useState, useEffect, useRef } from 'react';
import { Message, User } from '../types';
import { Send, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { useChatStore } from '../store/chatStore';
import { telegramService } from '../services/telegram';
import WebApp from '@twa-dev/sdk';

interface ChatProps {
  currentUser: User;
}

export function Chat({ currentUser }: ChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, onlineUsers } = useChatStore();

  useEffect(() => {
    // Configure Telegram Web App
    WebApp.ready();
    WebApp.expand();
    
    // Initialize Telegram service
    setIsConnecting(true);
    telegramService.initialize()
      .then(() => setIsConnecting(false))
      .catch((error) => {
        console.error('Failed to initialize Telegram service:', error);
        WebApp.showAlert('Ошибка подключения к чату');
      });

    return () => {
      telegramService.cleanup();
    };
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    try {
      const sent = await telegramService.sendMessage(newMessage);
      if (sent) {
        setNewMessage('');
        inputRef.current?.focus();
      }
    } catch (error) {
      WebApp.showAlert('Ошибка при отправке сообщения');
    }
  };

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-pulse text-gray-600">Подключение к чату...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Чат участников</h2>
          <div className="flex items-center gap-2">
            <UserCheck size={20} className="text-green-500" />
            <span className="text-sm text-gray-600">
              Telegram чат
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === currentUser.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                message.senderId === currentUser.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 border'
              }`}
            >
              {message.senderId !== currentUser.id && (
                <div className="text-sm font-medium mb-1">
                  {onlineUsers.find((u) => u.id === message.senderId)?.firstName ||
                    'Участник'}
                </div>
              )}
              <p className="break-words">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.senderId === currentUser.id
                    ? 'text-blue-100'
                    : 'text-gray-500'
                }`}
              >
                {format(message.timestamp, 'HH:mm')}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Написать сообщение..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:hover:bg-blue-500"
            onClick={() => WebApp.HapticFeedback.impactOccurred('light')}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}