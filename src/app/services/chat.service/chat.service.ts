import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from '@services/messages.service/messages.service';
import { User } from '@services/user.service/user.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { APP_ROUTES } from 'src/app/app.routes';
import { SKIP_LOADING } from 'src/app/helpers/loading.interceptor';
import socket, { SocketEvents } from 'src/app/socket';
import { environment } from 'src/environments/environment';

const {
  USER_IDS,
  USER_CONNECTED,
  USER_DISCONNECTED,
  USER_UPDATED,
  CHAT_CREATED,
} = SocketEvents;

export interface Chat {
  user: User;
  lastMessage: Message;
  _id: string;
  unreadCount: number;
}

const API_URL = `${environment.serverUrl}/api/chats`;
const USERS_API_URL = `${environment.serverUrl}/api/users`;

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private _chats: BehaviorSubject<Chat[]>;
  private _usersOnline: BehaviorSubject<string[]>;

  public get chats$(): Observable<Chat[]> {
    return this._chats.asObservable();
  }

  public get usersOnline$(): Observable<string[]> {
    return this._usersOnline.asObservable();
  }

  private get chats(): Chat[] {
    return this._chats.value;
  }

  private set chats(newChats: Chat[]) {
    this._chats.next(newChats);
  }

  private set usersOnline(newUsersOnline: string[]) {
    this._usersOnline.next(newUsersOnline);
  }

  private get usersOnline(): string[] {
    return this._usersOnline.value;
  }

  private addUserOnline(userId: string) {
    const newUsersOnline = [...this.usersOnline, userId];
    this.usersOnline = [...new Set(newUsersOnline)];
  }

  private removeUserOnline(userId: string) {
    this.usersOnline = this.usersOnline.filter((user) => user !== userId);
  }

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this._chats = new BehaviorSubject([] as Chat[]);
    this._usersOnline = new BehaviorSubject([] as string[]);

    socket.on(USER_IDS, (userIds) => {
      this.usersOnline = userIds;
      this.chats = this.chats.map((chat) => {
        return {
          ...chat,
          user: { ...chat.user, isOnline: userIds.includes(chat.user._id) },
        };
      });
    });

    socket.on(USER_UPDATED, (user) => {
      this.chats = this.chats.map((chat) => {
        if (chat.user._id === user._id) {
          return {
            ...chat,
            user: { ...chat.user, ...user },
          };
        }
        return chat;
      });
    });

    socket.on(USER_CONNECTED, (userId) => {
      this.addUserOnline(userId);
      this.chats = this.chats.map((chat) => {
        if (chat.user._id === userId) {
          return {
            ...chat,
            user: { ...chat.user, isOnline: true },
          };
        }
        return chat;
      });
    });

    socket.on(USER_DISCONNECTED, (userId) => {
      this.removeUserOnline(userId);
      this.chats = this.chats.map((chat) => {
        if (chat.user._id === userId) {
          return {
            ...chat,
            user: { ...chat.user, isOnline: false, lastSeen: Date.now() },
          };
        }
        return chat;
      });
    });
  }

  public getChats(skipLoading = false): Observable<Chat[]> {
    return this.fetchChats(skipLoading).pipe(
      tap((chats) => {
        this.chats = chats.map((chat) => {
          return {
            ...chat,
            user: {
              ...chat.user,
              isOnline: this.usersOnline.includes(chat.user._id),
            },
          };
        });
      }),
    );
  }

  public getChat(chatId: string, skipLoading = false): Observable<Chat> {
    return this.http
      .get<Chat>(`${API_URL}/${chatId}`, {
        context: new HttpContext().set(SKIP_LOADING, skipLoading),
      })
      .pipe(
        tap((chat) => {
          this.chats = [
            ...this.chats,
            {
              ...chat,
              user: {
                ...chat.user,
                isOnline: this.usersOnline.includes(chat.user._id),
              },
            },
          ].sort((a, b) => b.lastMessage?.date - a.lastMessage?.date);
        }),
      );
  }

  public fetchChats(skipLoading = false): Observable<Chat[]> {
    return this.http.get<Chat[]>(API_URL, {
      context: new HttpContext().set(SKIP_LOADING, skipLoading),
    });
  }

  public selectChat(user: User) {
    const chat = this._chats.value.find((chat) => chat.user._id === user._id);
    if (!chat) {
      this.createChat(user).subscribe((chat) => {
        this._chats.next([...this._chats.value, { ...chat, user }]);
        this.router.navigate([`${APP_ROUTES.CHATS}/${chat._id}`]);
        socket.emit(CHAT_CREATED, { chatId: chat._id, anotherUserId: user._id });
      });
    } else {
      this.router.navigate([`${APP_ROUTES.CHATS}/${chat._id}`]);
    }
  }

  public updateUnreadCount(chatId: string, unreadCount: number) {
    this.chats = this.chats.map((chat) => {
      if (chat._id === chatId) {
        return { ...chat, unreadCount };
      }
      return chat;
    });
  }

  public newMessage(message: Message) {
    this.chats = this.chats
      .map((chat) => {
        if (chat._id === message.chatId) {
          return {
            ...chat,
            lastMessage: message,
          };
        }
        return chat;
      })
      .sort(
        (a, b) =>
          new Date(b.lastMessage?.date).getTime() -
          new Date(a.lastMessage?.date).getTime(),
      );
  }

  public createChat(user: User): Observable<Chat> {
    return this.http.post<Chat>(API_URL, { userId: user._id });
  }

  public searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${USERS_API_URL}/search?query=${query}`);
  }
}
