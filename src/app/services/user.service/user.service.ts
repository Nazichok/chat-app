import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import crypto from 'crypto-js';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const USER_KEY = 'auth-user';
const API_URL = `${environment.serverUrl}/api/user`;

export interface UserInterface {
  accessToken: string;
  email: string;
  _id: string;
  refreshToken: string;
  username: string;
  img: string;
}

export type User = UserInterface | null;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user = new BehaviorSubject<User>(null);
  private _isOnline = new BehaviorSubject<boolean>(false);
  user$ = this._user.asObservable();
  isOnline$ = this._isOnline.asObservable();

  constructor(private http: HttpClient) {}

  public get user(): User {
    return this._user.value;
  }

  public get isOnline(): boolean {
    return this._isOnline.value;
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
      console.log(data);
      this._user.next(JSON.parse(data));
    }
  }

  public saveUser(user: any): void {
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
    return this.http
      .patch<User>(API_URL, fields)
      .pipe(tap((user) => this.saveUser(user)));
  }

  public updateUserImg(img: Blob): Observable<string> {
    const formData = new FormData();
    formData.append('img', img);
    return this.http
      .post<string>(`${API_URL}/img`, formData)
      .pipe(tap((photoUrl) => this.saveUser({ ...this.user, img: photoUrl })));
  }
}
