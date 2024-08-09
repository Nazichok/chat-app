import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const USER_KEY = 'auth-user';

export interface UserInterface {
  accessToken: string;
  email: string;
  _id: string;
  refreshToken: string;
  username: string;
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
    window.localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_KEY);
  }

  initUser(): void {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      this._user.next(JSON.parse(user));
    }
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    this._user.next(user);
  }
}
