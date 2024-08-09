import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat, ChatService } from '@services/chat-service/chat.service';
import { UserService } from '@services/user.service/user.service';
import { BehaviorSubject, tap } from 'rxjs';
import { serverUrl } from 'src/app/config';
import socket, { SocketEvents } from 'src/app/socket';

const { PRIVATE_MESSAGE } = SocketEvents;

export interface Message {
  _id: string;
  text: string;
  date: Date;
  sender: string;
  isRead: boolean;
  chatId: string;
}

const API_URL = `${serverUrl}/api/messages`;
@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private _messagesMap: BehaviorSubject<Record<string, Message[]>> =
    new BehaviorSubject({});
  public messagesMap$ = this._messagesMap.asObservable();

  private get messagesMap(): Record<string, Message[]> {
    return this._messagesMap.value;
  }

  private updateMap(chatId: string, messages: Message[]) {
    this._messagesMap.next({
      ...this._messagesMap.value,
      [chatId]: messages,
    });
  }

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private chatService: ChatService,
  ) {
    socket.on(PRIVATE_MESSAGE, (message: Message) => {
      const messages = this.messagesMap[message.chatId] || [];
      this.updateMap(message.chatId, messages.concat(message));
      this.chatService.newMessage(message);
    });
  }

  public fetchMessages(chatId: string) {
    return this.http.get<Message[]>(`${API_URL}?chatId=${chatId}`);
  }

  public getMessages(chatId: string) {
    return this.fetchMessages(chatId).pipe(
      tap((messages) => {
        this._messagesMap.next({
          ...this._messagesMap.value,
          [chatId]: messages,
        });
      }),
    );
  }

  public sendMessage(chat: Chat, text: string) {
    socket.emit(PRIVATE_MESSAGE, {
      text,
      to: chat.user._id,
      chatId: chat._id,
    });
    const messages = this.messagesMap[chat._id] || [];
    const newMessage = {
      _id: new Date().toString(),
      text,
      date: new Date(),
      sender: this.userService.user?._id || '0',
      isRead: false,
      chatId: chat._id,
    };
    this.updateMap(chat._id, messages.concat(newMessage));
    this.chatService.newMessage(newMessage);
  }
}
