import { Component, OnInit } from '@angular/core';
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
import { filter, finalize, map } from 'rxjs';
import { Chat, ChatService } from '@services/chat.service/chat.service';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { AvatarModule } from 'primeng/avatar';
import { AvatarLetterPipe } from 'src/app/pipes/avatar-letter.pipe';
import { User } from '@services/user.service/user.service';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [
    AutoCompleteModule,
    AvatarModule,
    CommonModule,
    InputGroupModule,
    InputGroupAddonModule,
    RouterLink,
    RouterOutlet,
    BadgeModule,
    ButtonModule,
    CardModule,
    AvatarLetterPipe,
    DateAgoPipe,
  ],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsComponent implements OnInit {
  content?: string;
  chats: Chat[] = [];
  routes = APP_ROUTES;
  chatOpened = true;
  currentChatId?: string;
  suggestions: User[] = [];
  searchLoading = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.chatService.chats$.subscribe((chats) => {
      this.chats = chats;
      this.suggestions = chats?.map((c) => c.user || {}) || [];
    });

    this.chatOpened = !this.activeRoute.snapshot.firstChild;
    this.currentChatId =
      this.activeRoute.firstChild?.snapshot.params[ROUTE_PARAMS.CHAT_ID];

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activeRoute?.firstChild)
      )
      .subscribe((route) => {
        this.chatOpened = !route;
        this.currentChatId = route?.snapshot.params[ROUTE_PARAMS.CHAT_ID];
      });
  }

  selectChat({ value }: { value: User }) {
    this.chatService.selectChat(value);
  }

  searchUsers(event: AutoCompleteCompleteEvent) {
    this.searchLoading = true;
    this.chatService
      .searchUsers(event.query)
      .pipe(finalize(() => (this.searchLoading = false)))
      .subscribe((users) => {
        this.suggestions = users;
      });
    this.suggestions = [...this.suggestions];
  }
}
