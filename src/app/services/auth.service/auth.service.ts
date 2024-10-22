import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../user.service/user.service';
import { environment } from 'src/environments/environment';

const AUTH_API = `${environment.serverUrl}/api/auth`;

export interface RefreshTokenResponse {}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private storageService: UserService,
  ) {}
  isRefreshing = false;

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + '/signin',
      {
        username,
        password,
      },
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + '/signup',
      {
        username,
        email,
        password,
      },
    );
  }

  logout(): Observable<any> {
    const userId = this.storageService.user!._id;
    return this.http.post(AUTH_API + '/signout', { userId });
  }

  refreshToken() {
    return this.http.post<RefreshTokenResponse>(
      AUTH_API + '/refreshtoken',
      null,
    );
  }

  resetPasswordRequest(email: string): Observable<any> {
    return this.http.post(
      AUTH_API + '/resetpasswordrequest',
      { email },
    );
  }

  resetPassword(
    password: string,
    token: string,
    userId: string,
  ): Observable<any> {
    return this.http.post(
      AUTH_API + '/resetpassword',
      { token, userId, password },
    );
  }

  confirmEmail(token: string, userId: string): Observable<any> {
    return this.http.post(
      AUTH_API + '/confirmemail',
      { token, userId },
    );
  }

  googleLogin(token: string): Observable<any> {
    return this.http.post<any>(`${AUTH_API}/google-login`, { token });
  }

  getRedirectUrl(): string {
    return "/chats";
  }
}
