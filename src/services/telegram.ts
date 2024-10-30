import WebApp from '@twa-dev/sdk';
import { Message, User } from '../types';
import { useChatStore } from '../store/chatStore';

class TelegramService {
  private pollingInterval: NodeJS.Timeout | null = null;
  private lastUpdateId = 0;
  
  async initialize() {
    // Get Telegram WebApp init data
    const initData = WebApp.initData;
    if (!initData) {
      throw new Error('No Telegram WebApp init data');
    }

    // Start long polling for updates
    this.startPolling();
  }

  private async startPolling() {
    this.pollingInterval = setInterval(async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/telegram/updates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            init_data: WebApp.initData,
            last_update_id: this.lastUpdateId
          })
        });

        const updates = await response.json();
        
        if (updates.ok) {
          this.processUpdates(updates.result);
        }
      } catch (error) {
        console.error('Error polling updates:', error);
      }
    }, 1000);
  }

  private processUpdates(updates: any[]) {
    updates.forEach(update => {
      if (update.update_id > this.lastUpdateId) {
        this.lastUpdateId = update.update_id;
      }

      if (update.message) {
        const message: Message = {
          id: update.message.message_id.toString(),
          senderId: update.message.from.id,
          text: update.message.text,
          timestamp: new Date(update.message.date * 1000)
        };

        useChatStore.getState().addMessage(message);
        WebApp.HapticFeedback.notificationOccurred('success');
      }
    });
  }

  async sendMessage(text: string): Promise<boolean> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/telegram/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          init_data: WebApp.initData,
          message: text
        })
      });

      const result = await response.json();
      
      if (result.ok) {
        WebApp.HapticFeedback.notificationOccurred('success');
        return true;
      }
      
      throw new Error(result.description || 'Failed to send message');
    } catch (error) {
      console.error('Error sending message:', error);
      WebApp.showAlert('Ошибка отправки сообщения');
      return false;
    }
  }

  cleanup() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}

export const telegramService = new TelegramService();