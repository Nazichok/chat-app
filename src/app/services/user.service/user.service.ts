import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import crypto from 'crypto-js';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import socket from 'src/app/socket';
import { SocketEvents } from 'src/app/socket';

const { CONNECT, DISCONNECT, USER_UPDATED } = SocketEvents;
const USER_KEY = 'auth-user';
const API_URL = `${environment.serverUrl}/api/user`;

export interface User {
  _id: string;
  email: string;
  username: string;
  img: string;
  lastSeen?: number;
  isOnline?: boolean;
  isGoogleUser?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user = new BehaviorSubject<User | null>(null);
  private _isOnline = new BehaviorSubject<boolean>(false);
  user$ = this._user.asObservable();
  isOnline$ = this._isOnline.asObservable();

  constructor(private http: HttpClient) {
    socket.on(USER_UPDATED, (user) => {
      if (this.user?._id === user._id) {
        this.saveUser({ ...this.user, ...user });
      }
    });

    socket.on(CONNECT, () => {
      this.isOnline = true;
    });

    socket.on(DISCONNECT, () => {
      this.isOnline = false;
    });
  }

  public get user(): User | null {
    return this._user.value;
  }

  public set isOnline(newIsOnline: boolean) {
    this._isOnline.next(newIsOnline);
  }

  public get isLoggedIn(): boolean {
    return !!this.user;
  }

  clean(): void {
    this._user.next(null);
    localStorage.removeItem(USER_KEY);
  }

  initUser(): void {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      const data = crypto.AES.decrypt(
        user,
        environment.localCryptoKey,
      ).toString(crypto.enc.Utf8);
      this._user.next(JSON.parse(data));
    }
  }

  public saveUser(user: User): void {
    window.localStorage.removeItem(USER_KEY);
    const userString = JSON.stringify(user);
    const data = crypto.AES.encrypt(
      userString,
      environment.localCryptoKey,
    ).toString();
    window.localStorage.setItem(USER_KEY, data);
    this._user.next(user);
  }

  public updateUser(fields: Partial<User>): Observable<User> {
    return this.http.patch<User>(API_URL, fields).pipe(
      tap((user) => {
        socket.emit(USER_UPDATED, {
          _id: this.user?._id,
          username: user.username,
          email: user.email,
        });
        this.saveUser({ ...this.user, ...user });
      }),
    );
  }

  public updateUserImg(img: Blob): Observable<{ img: string }> {
    const formData = new FormData();
    const file = new File([img], this.user!._id, { type: 'image/png' });
    formData.append('img', file);
    return this.http.post<{ img: string }>(`${API_URL}/img`, formData).pipe(
      tap(({ img }) => {
        socket.emit(USER_UPDATED, { _id: this.user?._id, img });
        this.saveUser({ ...(this.user || ({} as User)), img });
      }),
    );
  }

  public updatePassword(fields: { oldPassword: string; newPassword: string }): Observable<void> {
    return this.http.post<void>(`${API_URL}/password`, fields);
  }
}
