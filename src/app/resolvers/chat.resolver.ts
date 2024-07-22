import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { ChatService } from "@services/chat-service/chat.service";
import { ROUTE_PARAMS } from "../app.routes";
import { map } from "rxjs";

export const chatResolver: ResolveFn<Object> = (route, state) => {
    const chatId = route.paramMap.get(ROUTE_PARAMS.CHAT_ID);
    return inject(ChatService).chats$.pipe(
      map((chats) => {
        return chats.find((chat) => chat.id === chatId)
      })
    )
}