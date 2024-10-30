import React, { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import { User } from './types';
import { Profile } from './components/Profile';
import { Chat } from './components/Chat';
import { MessageSquare, User as UserIcon } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'profile' | 'chat'>('profile');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize Telegram WebApp
    WebApp.ready();
    
    // Get user data from Telegram
    const initData = WebApp.initData || '';
    if (initData) {
      const user = WebApp.initDataUnsafe.user;
      if (user) {
        setCurrentUser({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name || '',
          photoUrl: user.photo_url || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
          username: user.username,
        });
      }
    }
  }, []);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'profile' && <Profile user={currentUser} />}
        {activeTab === 'chat' && <Chat currentUser={currentUser} />}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-3">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center ${
                activeTab === 'profile' ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <UserIcon size={24} />
              <span className="text-sm mt-1">Профиль</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex flex-col items-center ${
                activeTab === 'chat' ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <MessageSquare size={24} />
              <span className="text-sm mt-1">Чат</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default App;