import React from 'react';
import { User } from '../types';
import { Mail, MapPin, Phone } from 'lucide-react';

interface ProfileProps {
  user: User;
}

export function Profile({ user }: ProfileProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <img
            src={user.photoUrl}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          />
        </div>
      </div>
      
      <div className="pt-20 pb-6 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {user.firstName} {user.lastName}
        </h2>
        {user.username && (
          <p className="text-gray-500 mt-1">@{user.username}</p>
        )}
        
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <MapPin size={18} />
            <span>ТСПП2025 Участник</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Mail size={18} />
            <span>Сообщения доступны в чате</span>
          </div>
        </div>
      </div>
    </div>
  );
}