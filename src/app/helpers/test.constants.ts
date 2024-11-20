import { Chat } from '@services/chat.service/chat.service';
import { Message } from '@services/messages.service/messages.service';

export const chats: Chat[] = [
  {
    _id: '1',
    user: { _id: '1', username: 'John Doe', email: '', img: '' },
    lastMessage: {
      _id: '1',
      chatId: '1',
      sender: '1',
      text: 'Hello',
      isRead: false,
      date: new Date().getTime(),
    },
    unreadCount: 0,
  },
  {
    _id: '2',
    user: { _id: '2', username: 'Jane Doe', email: '', img: '' },
    lastMessage: {
      _id: '2',
      chatId: '2',
      sender: '2',
      text: 'Hello',
      isRead: false,
      date: new Date().getTime(),
    },
    unreadCount: 2,
  },
];

export const user = { _id: '1', username: 'John Doe', email: '', img: '' };
export const chatId = '1';
export const chat = {
  _id: '1',
  user: { _id: '1', username: 'John Doe', email: '', img: '' },
  lastMessage: {
    _id: '1',
    chatId: '1',
    sender: '1',
    text: 'Hello',
    isRead: false,
    date: new Date().getTime(),
  },
  unreadCount: 0,
};
export const users = [{ _id: '1', username: 'John Doe', email: '', img: '' }];

export const messages: Message[] = [
  {
    _id: '1',
    chatId: '1',
    sender: '1',
    text: 'Hello',
    isRead: false,
    date: new Date().getTime(),
  },
  {
    _id: '2',
    chatId: '1',
    sender: '2',
    text: 'Hello',
    isRead: false,
    date: new Date().getTime(),
  },
];

export const message = {
  _id: '1',
  chatId: '1',
  sender: '1',
  text: 'Hello',
  isRead: false,
  date: new Date().getTime(),
};
