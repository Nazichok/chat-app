import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";
import { serverUrl } from 'src/app/config';

export interface Message {
  id: string;
  text: string;
  date: Date;
  sender: string;
  isRead: boolean;
  chatId: string;
}

export interface User {
  id: string;
  name: string;
  img: string;
  lastSeen: Date;
  isOnline?: boolean;
}

export interface Chat {
  user: User;
  messages: Message[];
  id: string;
  unreadCount?: number;
}

const mockedChats: Chat[] = [
  {
    user: {
      id: '1',
      name: 'John Doe',
      img: 'https://picsum.photos/200/300',
      lastSeen: new Date(),
    },
    messages: [
      {
        id: '1',
        text: 'Hello',
        date: new Date(),
        sender: '1',
        isRead: true,
        chatId: '1',
      },
      {
        id: '2',
        text: 'Hello, how are you? I am fine. What about you? I am also fine. How are you? I am fine. What about you? I am also fine.',
        date: new Date(),
        sender: '2',
        isRead: true,
        chatId: '1',
      },
      {
        id: '3',
        text: 'Hello, how are you? I am fine. What about you? I am also fine. How are you? I am fine. What about you? I am also fine.',
        date: new Date(),
        sender: '3',
        isRead: true,
        chatId: '1',
      },
    ],
    id: '1',
    unreadCount: 0,
  },
  {
    user: {
      id: '2',
      name: 'Jane Doe',
      img: 'https://picsum.photos/201',
      lastSeen: new Date(),
    },
    messages: [
      {
        id: '4',
        text: 'Hello',
        date: new Date(),
        sender: '4',
        isRead: true,
        chatId: '2',
      },
      {
        id: '5',
        text: 'Hello, how are you? I am fine. What about you? I am also fine. How are you? I am fine. What about you? I am also fine.',
        date: new Date(),
        sender: '5',
        isRead: true,
        chatId: '2',
      },
      {
        id: '6',
        text: 'Hello, how are you? I am fine. What about you? I am also fine. How are you? I am fine. What about you? I am also fine.',
        date: new Date(),
        sender: '6',
        isRead: false,
        chatId: '2',
      },
    ],
    id: '2',
    unreadCount: 1,
  },
  {
    user: {
      id: '3',
      name: 'John Smith',
      img: 'https://picsum.photos/200/300',
      lastSeen: new Date(),
    },
    messages: [
      {
        id: '7',
        text: 'Hello',
        date: new Date(),
        sender: '7',
        isRead: true,
        chatId: '3',
      },
      {
        id: '8',
        text: 'Hello, how are you? I am fine. What about you? I am also fine. How are you? I am fine. What about you? I am also fine.',
        date: new Date(),
        sender: '8',
        isRead: true,
        chatId: '3',
      },
      {
        id: '9',
        text: 'Hello, how are you? I am fine. What about you? I am also fine. How are you? I am fine. What about you? I am also fine.',
        date: new Date(),
        sender: '9',
        isRead: true,
        chatId: '3',
      },
    ],
    id: '3',
    unreadCount: 2,
  },
];

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  public message$: BehaviorSubject<string> = new BehaviorSubject('');

  // todo: implement chat service
  private _chats: BehaviorSubject<Chat[]> = new BehaviorSubject(mockedChats);
  private _chatMap: BehaviorSubject<Record<string, Chat>> = new BehaviorSubject(mockedChats.reduce((acc, chat) => {
    acc[chat.id] = chat;
    return acc;
  }, {} as Record<string, Chat>));

  public get chats$(): Observable<Chat[]> {
    return this._chats.asObservable();
  }

  public get chatMap$(): Observable<Record<string, Chat>> {
    return this._chatMap.asObservable();
  }

  constructor() {}

  socket = io(serverUrl);

  public sendMessage(message: any) {
    console.log('sendMessage: ', message)
    this.socket.emit('message', message);
  }

  public getNewMessage = () => {
    this.socket.on('message-broadcast', (message) => {
      this.message$.next(message);
    });

    return this.message$.asObservable();
  };
}