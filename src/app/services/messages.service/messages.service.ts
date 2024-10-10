import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat, ChatService } from '@services/chat.service/chat.service';
import { UserService } from '@services/user.service/user.service';
import { BehaviorSubject, tap } from 'rxjs';
import socket, { SocketEvents } from 'src/app/socket';
import { environment } from 'src/environments/environment';

const { PRIVATE_MESSAGE, MESSAGE_READ } = SocketEvents;

export interface Message {
  _id: string;
  text: string;
  date: number;
  sender: string;
  isRead: boolean;
  chatId: string;
}

const API_URL = `${environment.serverUrl}/api/messages`;
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
    this.chatService.updateUnreadCount(
      chatId,
      messages.filter(
        (m) => m.sender !== this.userService.user?._id && !m.isRead,
      ).length,
    );
  }

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private chatService: ChatService,
  ) {
    socket.on(PRIVATE_MESSAGE, (message: Message) => {
      const messages = this.messagesMap[message.chatId] || [];
      this.updateMap(
        message.chatId,
        messages.filter((m) => m.date !== message.date).concat(message),
      );
      this.chatService.newMessage(message);
    });

    socket.on(MESSAGE_READ, ({ chatId, messageId }) => {
      this.updateMap(
        chatId,
        this.messagesMap[chatId].map((message) => {
          if (message._id === messageId) {
            return { ...message, isRead: true };
          }
          return message;
        }),
      );
    });
  }

  public messageRead(message: Message) {
    socket.emit(MESSAGE_READ, {
      chatId: message.chatId,
      messageId: message._id,
      anotherUserId: message.sender,
    });
    this.updateMap(
      message.chatId,
      this.messagesMap[message.chatId].map((m) => {
        if (m._id === message._id) {
          return { ...m, isRead: true };
        }
        return m;
      }),
    )
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
    const date = new Date().getTime();
    const sender = this.userService.user?._id || '0';
    const sameUser = sender === chat.user._id;

    socket.emit(PRIVATE_MESSAGE, {
      text,
      date,
      to: chat.user._id,
      sender,
      chatId: chat._id,
      isRead: sameUser,
    });
    const messages = this.messagesMap[chat._id] || [];
    const newMessage = {
      _id: date.toString(),
      text,
      date,
      sender,
      isRead: sameUser,
      chatId: chat._id,
    };
    this.updateMap(chat._id, messages.concat(newMessage));
    this.chatService.newMessage(newMessage);
  }
}
