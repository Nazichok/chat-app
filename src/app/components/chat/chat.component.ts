import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Chat, Message } from '@services/chat-service/chat.service';
import { User, UserService } from '@services/user.service/user.service';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { map, Observable } from 'rxjs';
import { APP_ROUTES } from 'src/app/app.routes';
import { DateAgoPipe } from 'src/app/pipes/date-ago.pipe';
import { AvatarModule } from 'primeng/avatar';
import { AvatarLetterPipe } from 'src/app/pipes/avatar-letter.pipe';

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
    AsyncPipe,
    AvatarLetterPipe,
    DateAgoPipe,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  routes = APP_ROUTES;
  chat: Chat;
  messages: Message[] = [];
  userId: string;
  message = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.pipe(map((data) => data['chatData'])).subscribe(({ chat, messages }) => {
      this.chat = chat;
      this.messages = messages;
    });
    this.userService.user$.subscribe((user) => {
      this.userId = user?._id || '0';
    });
  }

  sendMessage(event: Event) {
    event.preventDefault();
    if (this.message) {
      alert(this.message);
      this.message = '';
    }
  }
}
