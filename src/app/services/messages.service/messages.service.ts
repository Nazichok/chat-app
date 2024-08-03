import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { serverUrl } from 'src/app/config';

const API_URL = `${serverUrl}/api/messages`;
@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private _messagesMap: BehaviorSubject<any> = new BehaviorSubject({});
  public messagesMap$ = this._messagesMap.asObservable();

  constructor(private http: HttpClient) {}

  public fetchMessages(chatId: string) {
    return this.http.get(`${API_URL}?chatId=${chatId}`);
  }

  public getMessages(chatId: string) {
    return this.fetchMessages(chatId).pipe(
      tap((messages) => {
        this._messagesMap.next({
          ...this._messagesMap.value,
          [chatId]: messages,
        });
      }),
    );
  }
}
