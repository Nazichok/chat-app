import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ChatService } from '@services/chat-service/chat.service';

export const chatsResolver: ResolveFn<Object> = () => {
  return inject(ChatService).getChats();
};
