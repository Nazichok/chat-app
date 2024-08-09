import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Chat, ChatService } from '@services/chat-service/chat.service';
import { UserService } from '@services/user.service/user.service';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { combineLatest, map, merge } from 'rxjs';
import { APP_ROUTES } from 'src/app/app.routes';
import { DateAgoPipe } from 'src/app/pipes/date-ago.pipe';
import { AvatarModule } from 'primeng/avatar';
import { AvatarLetterPipe } from 'src/app/pipes/avatar-letter.pipe';
import {
  Message,
  MessagesService,
} from '@services/messages.service/messages.service';
import { ResizeTextAreaDirective } from 'src/app/directives/resize-text-area.directive';
import { MessageComponent } from './message/message/message.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    AvatarModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    InputTextareaModule,
    RouterLink,
    MessageComponent,
    AsyncPipe,
    AvatarLetterPipe,
    DateAgoPipe,
    ResizeTextAreaDirective,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  @ViewChild('messagesContainer') messagesContainer: ElementRef;
  routes = APP_ROUTES;
  chat: Chat;
  messages: Message[] = [];
  userId: string;
  message = '';
  chatId = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private messagesService: MessagesService,
    private chatService: ChatService,
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.activatedRoute.params,
      this.chatService.chats$,
      this.messagesService.messagesMap$,
    ]).subscribe(([routeParams, chats, messagesMap]) => {
      this.chatId = routeParams['chatId'];
      this.chat = chats.find((c) => c._id === this.chatId) || ({} as Chat);
      if (messagesMap[this.chatId]) {
        this.messages = messagesMap[this.chatId];
        // TODO make it in human way
        setTimeout(() => {
          this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
        }, 500);
      }
    });

    this.userService.user$.subscribe((user) => {
      this.userId = user?._id || '0';
    });
  }

  sendMessage(event: Event) {
    event.preventDefault();
    if (this.message) {
      this.messagesService.sendMessage(this.chat, this.message);
      this.message = '';
    }
  }
}
