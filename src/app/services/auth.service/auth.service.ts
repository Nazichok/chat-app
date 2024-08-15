import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../user.service/user.service';
import { environment } from 'src/environments/environment';

const AUTH_API = `${environment.serverUrl}/api/auth`;

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
  constructor(private http: HttpClient, private storageService: UserService) {}
  isRefreshing = false;

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + '/signin',
      {
        username,
        password,
      },
      httpOptions
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
      httpOptions
    );
  }

  logout(): Observable<any> {
    const userId = this.storageService.user!._id;
    return this.http.post(AUTH_API + '/signout', { userId }, httpOptions);
  }

  refreshToken() {
    return this.http.post<RefreshTokenResponse>(AUTH_API + '/refreshtoken', null, httpOptions);
  }
}