import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../user.service/user.service';

const AUTH_API = `${_NGX_ENV_.NG_APP_SERVER_URLL}/api/auth`;

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
}
