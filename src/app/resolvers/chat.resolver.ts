import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ChatService } from '@services/chat-service/chat.service';
import { ROUTE_PARAMS } from '../app.routes';
import { forkJoin, map, take } from 'rxjs';
import { MessagesService } from '@services/messages.service/messages.service';

export const chatResolver: ResolveFn<Object> = (route) => {
  const chatId = route.paramMap.get(ROUTE_PARAMS.CHAT_ID);

  return forkJoin([
    inject(ChatService).chats$.pipe(
      map((chats) => {
        return chats.find((chat) => chat._id === chatId);
      }),
      take(1),
    ),
    inject(MessagesService).getMessages(chatId!).pipe(take(1)),
  ]).pipe(
    map((data) => {
      return {
        chat: data[0],
        messages: data[1],
      };
    }),
  );
};
