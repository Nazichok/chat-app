import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const USER_KEY = 'auth-user';

export interface UserInterface {
  accessToken: string;
  email: string;
  id: string;
  refreshToken: string;
  username: string;
}

export type User = UserInterface | null;

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}
  private _user = new BehaviorSubject<User>(null);
  user$ = this._user.asObservable();

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

  public getUser(): User {
    return this._user.getValue();
  }

  public isLoggedIn(): boolean {
    return !!this._user.getValue();
  }
}
