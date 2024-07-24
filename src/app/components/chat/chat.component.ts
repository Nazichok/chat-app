import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Chat } from '@services/chat-service/chat.service';
import { User, UserService } from '@services/user.service/user.service';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { map, Observable } from 'rxjs';
import { APP_ROUTES } from 'src/app/app.routes';
import { DateAgoPipe } from 'src/app/pipes/date-ago.pipe';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    AsyncPipe,
    ButtonModule,
    CommonModule,
    FormsModule,
    InputTextareaModule,
    RouterLink,
    DateAgoPipe,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  routes = APP_ROUTES;
  chat$: Observable<Chat>;
  userId: string;
  message = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.chat$ = this.activatedRoute.data.pipe(map((data) => data['chat']));
    this.userService.user$.subscribe((user) => {
      this.userId = user?.id || '0';
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
