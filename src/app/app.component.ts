import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from './services/user.service/user.service';
import { AuthService } from './services/auth.service/auth.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { mergeMap, Subscription } from 'rxjs';
import { EventBusService } from '@services/bus-service.service';
import { APP_ROUTES } from './app.routes';
import { ButtonModule } from 'primeng/button';
import socket, { SocketEvents } from './socket';
import { MessageService } from 'primeng/api';
import { ChatService } from '@services/chat.service/chat.service';
import { MessagesService } from '@services/messages.service/messages.service';
import { AsyncPipe } from '@angular/common';
import { ModalService } from '@services/modal.service/modal.service';

const { CONNECT_ERROR } = SocketEvents;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule, RouterModule, RouterOutlet, ToastModule, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'chat-app';
  isLoggedIn = false;
  username?: string;
  eventBusSub?: Subscription;
  routes = APP_ROUTES;
  isOnline$ = this.userService.isOnline$;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private chatService: ChatService,
    private messageService: MessagesService,
    private eventBusService: EventBusService,
    private toastService: MessageService,
    private router: Router,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.userService.initUser();

    this.userService.user$.subscribe((user) => {
      if (user) {
        this.isLoggedIn = true;
        this.username = user.username;
        this.chatService
          .getChats()
          .pipe(
            mergeMap((chats) =>
              chats.map((chat) =>
                this.messageService.getMessages(chat._id).subscribe(),
              ),
            ),
          )
          .subscribe();
      } else {
        this.isLoggedIn = false;
        this.username = '';
      }

      // connect on login or page refresh (initUser)
      if (user) {
        const userId = user._id;
        socket.auth = { userId };
        socket.connect();

        socket.on(CONNECT_ERROR, (err) => {
          if (err.message === 'User error') {
            this.userService.isOnline = false;

            this.toastService.add({
              key: 'notifications',
              severity: 'error',
              summary: 'Error',
              detail: 'User error. Try refresh page.',
              life: 50000,
            });
          }
        });
      }
    });

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
  }

  openUserModal(): void {
    this.modalService.openProfileModal(this.userService.user!);
  }

  ngOnDestroy(): void {
    Object.values(SocketEvents).forEach((socketEvent) => {
      socket.off(socketEvent);
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.userService.clean();
        this.router.navigate([APP_ROUTES.LOGIN]);
      },
    });
  }
}
