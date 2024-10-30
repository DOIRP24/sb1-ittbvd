export interface User {
  id: number;
  firstName: string;
  lastName: string;
  photoUrl: string;
  username?: string;
}

export interface Message {
  id: string;
  senderId: number;
  text: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: Message;
}