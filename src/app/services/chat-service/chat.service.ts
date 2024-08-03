import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { APP_ROUTES } from 'src/app/app.routes';
import { serverUrl } from 'src/app/config';

export interface Message {
  _id: string;
  text: string;
  date: Date;
  sender: string;
  isRead: boolean;
  chatId: string;
}

export interface User {
  _id: string;
  username: string;
  img: string;
  lastSeen: Date;
  isOnline?: boolean;
}

const usersMock: User[] = [{
  _id: '1',
  username: 'John Doe',
  img: 'https://picsum.photos/200/300',
  lastSeen: new Date(),
  isOnline: true,
}, {
  _id: '6687bc7555937a16ad434301',
  username: 'Jane Doe',
  img: 'https://picsum.photos/200/300',
  lastSeen: new Date(),
  isOnline: false,
}];

export interface Chat {
  user: User;
  lastMessage: Message;
  _id: string;
  unreadCount?: number;
}

const API_URL = `${serverUrl}/api/chats`;
const USERS_API_URL = `${serverUrl}/api/users`;

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  private _chats: BehaviorSubject<Chat[]> = new BehaviorSubject([] as Chat[]);

  public get chats$(): Observable<Chat[]> {
    return this._chats.asObservable();
  }

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  public getChats(): Observable<Chat[]> {
    return this.fetchChats().pipe(tap((chats) => {
      this._chats.next(chats);
    }));
  }

  public fetchChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(API_URL);
  }

  public selectChat(user: User) {
    const chat = this._chats.value.find((chat) => chat.user._id === user._id);
    if (!chat) {
      this.createChat(user).subscribe((chat) => {
        this._chats.next([...this._chats.value, chat]);
        this.router.navigate([`${APP_ROUTES.CHATS}/${chat._id}`]);
      })
    } else {
      this.router.navigate([`${APP_ROUTES.CHATS}/${chat._id}`]);
    }
  }

  public createChat(user: User): Observable<Chat> {
    return this.http.post<Chat>(API_URL, { userId: user._id });
  }

  public searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${USERS_API_URL}/search?query=${query}`);
  }
}
