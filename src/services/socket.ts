import { io, Socket } from 'socket.io-client';
import { Message, User } from '../types';
import { useChatStore } from '../store/chatStore';
import WebApp from '@twa-dev/sdk';

class SocketService {
  private socket: Socket | null = null;
  private user: User | null = null;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_INTERVAL = 3000;

  initialize(user: User) {
    this.user = user;
    
    // Get Telegram authentication data
    const authToken = WebApp.initData;
    const tgUser = WebApp.initDataUnsafe.user;
    
    // Initialize Socket.IO with configuration
    this.socket = io(import.meta.env.VITE_WEBSOCKET_URL || 'wss://your-backend-url.com', {
      auth: {
        token: authToken,
        userId: tgUser.id,
        username: tgUser.username,
      },
      transports: ['websocket'], // Force WebSocket transport
      reconnection: true,        // Enable auto-reconnection
      reconnectionAttempts: this.MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: this.RECONNECT_INTERVAL,
      timeout: 10000,           // Connection timeout in ms
    });

    this.setupListeners();
    this.setupReconnection();
  }

  private setupListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', this.handleConnect.bind(this));
    this.socket.on('disconnect', this.handleDisconnect.bind(this));
    this.socket.on('connect_error', this.handleError.bind(this));

    // Chat events
    this.socket.on('message', this.handleMessage.bind(this));
    this.socket.on('message:error', this.handleMessageError.bind(this));
    this.socket.on('users:online', this.handleOnlineUsers.bind(this));
    this.socket.on('user:joined', this.handleUserJoined.bind(this));
    this.socket.on('user:left', this.handleUserLeft.bind(this));
  }

  private setupReconnection() {
    if (!this.socket) return;

    this.socket.io.on('reconnect_attempt', () => {
      this.reconnectAttempts++;
      console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS}`);
    });

    this.socket.io.on('reconnect_failed', () => {
      WebApp.showAlert('Не удалось восстановить соединение');
      this.disconnect();
    });

    this.socket.io.on('reconnect', () => {
      this.reconnectAttempts = 0;
      WebApp.HapticFeedback.notificationOccurred('success');
    });
  }

  private handleConnect() {
    console.log('Connected to chat server');
    WebApp.MainButton.hide();
    WebApp.HapticFeedback.notificationOccurred('success');
  }

  private handleDisconnect(reason: Socket.DisconnectReason) {
    console.log('Disconnected:', reason);
    if (reason === 'io server disconnect') {
      // Server initiated disconnect, don't reconnect
      this.disconnect();
    }
  }

  private handleError(error: Error) {
    console.error('Connection error:', error);
    WebApp.showAlert('Ошибка подключения к чату');
  }

  private handleMessage(message: Message) {
    useChatStore.getState().addMessage(message);
    
    // Provide haptic feedback for new messages
    if (message.senderId !== this.user?.id) {
      WebApp.HapticFeedback.notificationOccurred('success');
    }
  }

  private handleMessageError(error: string) {
    WebApp.showAlert(`Ошибка: ${error}`);
  }

  private handleOnlineUsers(users: User[]) {
    useChatStore.getState().setOnlineUsers(users);
  }

  private handleUserJoined(user: User) {
    useChatStore.getState().addOnlineUser(user);
  }

  private handleUserLeft(userId: number) {
    useChatStore.getState().removeOnlineUser(userId);
  }

  async sendMessage(text: string): Promise<boolean> {
    if (!this.socket || !this.user) {
      WebApp.showAlert('Ошибка отправки сообщения');
      return false;
    }

    if (!this.socket.connected) {
      WebApp.showAlert('Нет подключения к серверу');
      return false;
    }

    return new Promise((resolve) => {
      WebApp.MainButton.showProgress();

      const message: Partial<Message> = {
        senderId: this.user!.id,
        text,
        timestamp: new Date(),
      };

      this.socket!.timeout(5000).emit('message:send', message, (err: Error | null, response: { success: boolean }) => {
        WebApp.MainButton.hideProgress();
        
        if (err) {
          WebApp.showAlert('Превышено время ожидания');
          resolve(false);
          return;
        }
        
        if (!response.success) {
          WebApp.showAlert('Не удалось отправить сообщение');
          resolve(false);
          return;
        }
        
        WebApp.HapticFeedback.notificationOccurred('success');
        resolve(true);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.user = null;
    this.reconnectAttempts = 0;
  }
}

// Singleton instance
export const socketService = new SocketService();