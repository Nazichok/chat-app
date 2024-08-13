import { AsyncPipe, CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  contentChildren,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
  viewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Chat, ChatService } from '@services/chat-service/chat.service';
import { UserService } from '@services/user.service/user.service';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
} from 'rxjs';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { _last, elementInViewPort } from 'src/app/helpers/utils';

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
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('messagesContainer') messagesContainer: ElementRef;
  messageElements = viewChildren<ElementRef>('messageElement');
  destroyRef = inject(DestroyRef);
  routes = APP_ROUTES;
  chat: Chat;
  messages: Message[] = [];
  userId: string;
  message = '';
  chatId = '';
  initialScroll = true;
  scrolling = false;
  mayScroll = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private messagesService: MessagesService,
    private chatService: ChatService,
  ) {
    effect(() => {
      let scrolledId = localStorage.getItem(`chat-${this.chatId}`);
      const elements = this.messageElements();
      if (this.mayScroll) {
        if (scrolledId && this.messages.slice(-2)[0]._id === scrolledId) {
          localStorage.setItem(
            `chat-${this.chatId}`,
            this.messages.slice(-1)[0]._id,
          );
          scrolledId = this.messages.slice(-1)[0]._id;
          this.mayScroll = false;
        }
      }
      if (scrolledId) {
        this.scrolling = true;
        const el = elements.find(
          (el) => el.nativeElement.id === scrolledId,
        );
        if (el) {
          el.nativeElement.scrollIntoView({ block: 'end', inline: 'nearest', behavior: this.initialScroll ? 'instant' : 'smooth' });
          this.initialScroll = false;
        }
        this.scrolling = false;
      }
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.activatedRoute.params,
      this.chatService.chats$,
      this.messagesService.messagesMap$,
    ])
      .pipe(distinctUntilChanged())
      .subscribe(([routeParams, chats, messagesMap]) => {
        if (this.chatId !== routeParams['chatId']) {
          this.initialScroll = true;
        }
        this.chatId = routeParams['chatId'];
        this.chat = chats.find((c) => c._id === this.chatId) || ({} as Chat);
        if (messagesMap[this.chatId]) {
          this.mayScroll =
            this.messages.length <= messagesMap[this.chatId].length;
          this.messages = messagesMap[this.chatId];
        }
      });

    this.userService.user$.subscribe((user) => {
      this.userId = user?._id || '0';
    });
  }

  ngAfterViewInit(): void {
    fromEvent<Event>(this.messagesContainer.nativeElement, 'scroll')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(500),
        distinctUntilChanged(),
        filter(() => !this.scrolling),
      )
      .subscribe(() => {
        const visibleMsgs = Array.from(this.messageElements())
          .map((el) => el.nativeElement as HTMLElement)
          .filter((m) => elementInViewPort(m));

        if (visibleMsgs.length === 0) {
          return;
        }
        const lastVisible = _last(visibleMsgs);
        const scrolledToBottom = lastVisible.id === _last(this.messages)._id;
        if (scrolledToBottom) {
          localStorage.setItem(`chat-${this.chatId}`, lastVisible.id);
          return;
        }
        const scrollToId =
          visibleMsgs.length > 1
            ? visibleMsgs[visibleMsgs.length - 2].id
            : _last(visibleMsgs).id;
        localStorage.setItem(`chat-${this.chatId}`, scrollToId);
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
