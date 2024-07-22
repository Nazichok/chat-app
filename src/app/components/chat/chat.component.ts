import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Chat } from '@services/chat-service/chat.service';
import { ButtonModule } from 'primeng/button';
import { map, Observable } from 'rxjs';
import { APP_ROUTES } from 'src/app/app.routes';
import { DateAgoPipe } from 'src/app/pipes/date-ago.pipe';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [AsyncPipe, ButtonModule, RouterLink, DateAgoPipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  routes = APP_ROUTES;
  chat$: Observable<Chat>;

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.chat$ = this.activatedRoute.data.pipe(map((data) => data['chat']));
  }

}
