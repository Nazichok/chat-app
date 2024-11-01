import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationsService {
  constructor(private http: HttpClient) {}

  addPushSubscriber(sub: any) {
    return this.http.post<{ message: string }>(
      `${environment.serverUrl}/api/subscribe`,
      { sub },
    );
  }
}
