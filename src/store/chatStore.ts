import { create } from 'zustand';
import { Message, User } from '../types';

interface ChatState {
  messages: Message[];
  onlineUsers: User[];
  addMessage: (message: Message) => void;
  setOnlineUsers: (users: User[]) => void;
  addOnlineUser: (user: User) => void;
  removeOnlineUser: (userId: number) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  onlineUsers: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setOnlineUsers: (users) =>
    set(() => ({
      onlineUsers: users,
    })),
  addOnlineUser: (user) =>
    set((state) => ({
      onlineUsers: [...state.onlineUsers, user],
    })),
  removeOnlineUser: (userId) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.filter((user) => user.id !== userId),
    })),
}));