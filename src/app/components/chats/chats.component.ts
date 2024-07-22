import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../services/content.service';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { APP_ROUTES, ROUTE_PARAMS } from 'src/app/app.routes';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DateAgoPipe } from 'src/app/pipes/date-ago.pipe';
import { BadgeModule } from 'primeng/badge';
import { filter, map } from 'rxjs';
import { Chat, ChatService } from '@services/chat-service/chat.service';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    BadgeModule,
    ButtonModule,
    CardModule,
    DateAgoPipe,
  ],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsComponent implements OnInit {
  content?: string;
  chats: Chat[] = [];
  routes = APP_ROUTES;
  showMessageBtn = true;
  currentChatId?: string;

  constructor(
    private contentService: ContentService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.contentService.getPublicContent().subscribe({
      next: (data) => {
        this.content = data;
      },
      error: (err) => {
        if (err.error) {
          this.content = JSON.parse(err.error).message;
        } else {
          this.content = 'Error with status: ' + err.status;
        }
      },
    });

    this.chatService.chats$.subscribe((chats) => {
      this.chats = chats;
    });

    this.showMessageBtn = !this.activeRoute.snapshot.firstChild;
    this.currentChatId =
      this.activeRoute.firstChild?.snapshot.params[ROUTE_PARAMS.CHAT_ID];

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activeRoute?.firstChild)
      )
      .subscribe((route) => {
        this.showMessageBtn = !route;
        this.currentChatId = route?.snapshot.params[ROUTE_PARAMS.CHAT_ID];
      });
  }
}
