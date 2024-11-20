import { Component, OnDestroy, OnInit } from '@angular/core';
import { User, UserService } from './services/user.service/user.service';
import { AuthService } from './services/auth.service/auth.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { EventBusService } from '@services/bus-service.service';
import { APP_ROUTES } from './app.routes';
import { ButtonModule } from 'primeng/button';
import socket, { SocketEvents } from './socket';
import { MenuItem, MessageService } from 'primeng/api';
import { ChatService } from '@services/chat.service/chat.service';
import { MessagesService } from '@services/messages.service/messages.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ModalService } from '@services/modal.service/modal.service';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { AvatarLetterPipe } from './pipes/avatar-letter.pipe';
import { LoadingService } from '@services/loading.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SwPush } from '@angular/service-worker';
import { PushNotificationsService } from '@services/push-notifications.service';
import { environment } from 'src/environments/environment';

const { CONNECT_ERROR } = SocketEvents;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AvatarModule,
    ButtonModule,
    MenuModule,
    CommonModule,
    ProgressSpinnerModule,
    RippleModule,
    RouterModule,
    RouterOutlet,
    ToastModule,
    AsyncPipe,
    AvatarLetterPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Supachat';
  isLoggedIn = false;
  user?: User;
  eventBusSub?: Subscription;
  routes = APP_ROUTES;
  isOnline$ = this.userService.isOnline$;
  isLoading = false;

  items: MenuItem[] | undefined;
  intervalId: number;
  pushNotificationsIntervalId: number;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private chatService: ChatService,
    private messageService: MessagesService,
    private eventBusService: EventBusService,
    private toastService: MessageService,
    private router: Router,
    private modalService: ModalService,
    private loadingService: LoadingService,
    private swPush: SwPush,
    private pushNotificationsService: PushNotificationsService,
  ) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Profile',
        icon: 'pi pi-fw pi-user',
        command: () => {
          this.openUserModal();
        },
      },
      {
        label: 'T&C',
        icon: 'pi pi-fw pi-file-edit',
        command: () => {
          this.router.navigate([APP_ROUTES.TERMS_AND_CONDITIONS]);
        },
      },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-power-off',
        command: () => {
          this.logout();
        },
      },
    ];
    this.userService.initUser();

    this.userService.user$.subscribe((user) => {
      const wasLoggedIn = this.isLoggedIn;
      if (user) {
        this.isLoggedIn = true;
        this.user = user;
        if (!wasLoggedIn) {
          this.chatService.getChats().subscribe((chats) => {
            // connect on login or page refresh (initUser)
            const userId = user._id;
            socket.auth = {
              userId,
              rooms: chats.map((chat) => chat._id),
            };
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

            chats.forEach((chat) =>
              this.messageService.getMessages(chat._id).subscribe(),
            );
          });

          // @ts-ignore
          this.intervalId = setInterval(
            () => {
              this.chatService.getChats(true).subscribe((chats) => {
                chats.forEach((chat) => {
                  this.messageService.getMessages(chat._id).subscribe();
                });
              });
            },
            1000 * 60 * 5,
          );
        }
        this.subscribeToNotifications();

        // Ugly way to bypass push subscription expiration
        // @ts-ignore
        this.pushNotificationsIntervalId = setInterval(
          () => {
            this.subscribeToNotifications();
          },
          1000 * 60 * 15,
        );
      } else {
        this.isLoggedIn = false;
        this.user = undefined;
      }
    });

    this.loadingService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
  }

  subscribeToNotifications() {
    if (!this.swPush.isEnabled) {
      return;
    }
    Notification.requestPermission().then((res) => {
      if (res === 'denied') {
        return;
      }

      this.swPush
        .requestSubscription({
          serverPublicKey: environment.vapidPublicKey,
        })
        .then((sub) => {
          if (!!navigator?.setAppBadge) {
            this.chatService.chats$.subscribe((chats) => {
              const unreadMessages = chats.reduce(
                (acc, chat) => acc + (chat.unreadCount || 0),
                0,
              );
              navigator.setAppBadge(unreadMessages);
            });
          }
          this.pushNotificationsService.addPushSubscriber(sub).subscribe();
        })
        .catch((err) =>
          console.error('Could not subscribe to notifications', err),
        );
    });
  }

  openUserModal(): void {
    this.modalService.openProfileModal(this.userService.user!);
  }

  ngOnDestroy(): void {
    Object.values(SocketEvents).forEach((socketEvent) => {
      socket.off(socketEvent);
    });

    this.eventBusSub?.unsubscribe();
  }

  logout(): void {
    clearInterval(this.intervalId);
    clearInterval(this.pushNotificationsIntervalId);
    this.authService.logout().subscribe(() => {
      this.userService.clean();
      this.swPush.unsubscribe();
      socket.disconnect();
      this.router.navigate([APP_ROUTES.LOGIN]);
    });
  }
}
