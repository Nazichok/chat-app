import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../storage.service/storage.service';
import { serverUrl } from '../../config';

const AUTH_API = `${serverUrl}/api/auth/`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private storageService: StorageService) {}
  isRefreshing = false;

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        username,
        email,
        password,
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    const userId = this.storageService.getUser()!.id;
    return this.http.post(AUTH_API + 'signout', { userId }, httpOptions);
  }

  refreshToken() {
    const refreshToken = this.storageService.getUser()!.refreshToken;
    return this.http.post<RefreshTokenResponse>(AUTH_API + 'refreshtoken', { refreshToken }, httpOptions);
  }
}