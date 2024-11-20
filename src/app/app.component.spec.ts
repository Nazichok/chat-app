import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { SwPush } from '@angular/service-worker';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { UserService } from '@services/user.service/user.service';
import { AuthService } from '@services/auth.service/auth.service';
import { ChatService } from '@services/chat.service/chat.service';
import { MessagesService } from '@services/messages.service/messages.service';
import { EventBusService } from '@services/bus-service.service';
import { LoadingService } from '@services/loading.service';
import { PushNotificationsService } from '@services/push-notifications.service';
import { of } from 'rxjs';
import { chats, messages } from './helpers/test.constants';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let userService: UserService;
  let chatService: ChatService;
  let messagesService: MessagesService;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        DialogService,
        {
          provide: SwPush,
          useValue: {
            isEnabled: false,
            requestSubscription: () => Promise.resolve({}),
            unsubscribe: () => {},
          },
        },
        {
          provide: UserService,
          useValue: {
            user$: of({
              _id: '1',
              email: 'test@gmail.com',
              username: 'test',
              img: '',
              isOnline: true,
            }),
            initUser: () => {},
            clean: () => {},
          },
        },
        {
          provide: AuthService,
          useValue: {
            logout: () => of({}),
          },
        },
        {
          provide: ChatService,
          useValue: {
            chats$: of(chats),
            getChats: jasmine.createSpy('getChats').and.returnValue(of(chats)),
          },
        },
        {
          provide: MessagesService,
          useValue: {
            getMessages: jasmine
              .createSpy('getMessages')
              .and.returnValue(of(messages)),
          },
        },
        EventBusService,
        MessageService,
        {
          provide: AuthService,
          useValue: {
            logout: jasmine.createSpy('logout').and.returnValue(of({})),
          },
        },
        {
          provide: LoadingService,
          useValue: {
            isLoading: false,
            loading$: of(false),
          },
        },
        {
          provide: PushNotificationsService,
          useValue: {
            addPushSubscriber: jasmine
              .createSpy('addPushSubscriber')
              .and.returnValue(of({})),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    chatService = TestBed.inject(ChatService);
    messagesService = TestBed.inject(MessagesService);
    authService = TestBed.inject(AuthService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'Supachat' title`, () => {
    expect(component.title).toEqual('Supachat');
  });

  it('should render the nav bar', () => {
    fixture.detectChanges();
    const navBar = fixture.nativeElement.querySelector('nav');
    expect(navBar).toBeTruthy();
  });

  it('should render the logo', () => {
    fixture.detectChanges();
    const logo = fixture.nativeElement.querySelector(
      'img[src="/assets/logo.svg"]',
    );
    expect(logo).toBeTruthy();
  });

  it('should render the menu', () => {
    fixture.detectChanges();
    const menu = fixture.nativeElement.querySelector('p-menu');
    expect(menu).toBeTruthy();
  });

  it('should render the user avatar', () => {
    fixture.detectChanges();
    const avatar = fixture.nativeElement.querySelector('p-avatar');
    expect(avatar).toBeTruthy();
  });

  it('should render the user username', () => {
    fixture.detectChanges();
    const username = fixture.nativeElement.querySelector('span.text-slate-700');
    expect(username).toBeTruthy();
  });

  it('should render the online status indicator', () => {
    fixture.detectChanges();
    const onlineStatus =
      fixture.nativeElement.querySelector('i.pi-circle-fill');
    expect(onlineStatus).toBeTruthy();
  });

  it('should call the userService.initUser method on ngOnInit', () => {
    spyOn(userService, 'initUser');
    component.ngOnInit();
    expect(userService.initUser).toHaveBeenCalledTimes(1);
  });

  it('should call the chatService.getChats method on ngOnInit', async () => {
    component.ngOnInit();
    expect(chatService.getChats).toHaveBeenCalledTimes(1);
  });

  it('should call the messagesService.getMessages method on ngOnInit', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(messagesService.getMessages).toHaveBeenCalledTimes(2);
  });

  it('should not login if no user', () => {
    userService.user$ = of(null);
    // @ts-ignore
    spyOn(component, 'isLoggedIn');
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.isLoggedIn).toBe(false);
    expect(component.user).toBeUndefined();
  });

  it('test logout', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalledTimes(1);
  });
});

describe('AppComponent Notifications', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let swPushSpy: jasmine.SpyObj<SwPush>;
  let pushNotificationsServiceSpy: jasmine.SpyObj<PushNotificationsService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        DialogService,
        {
          provide: SwPush,
          useValue: {
            isEnabled: jasmine.createSpy('isEnabled'),
            requestSubscription: jasmine.createSpy('requestSubscription'),
          },
        },
        {
          provide: PushNotificationsService,
          useValue: jasmine.createSpyObj('PushNotificationsService', [
            'addPushSubscriber',
          ]),
        },
        {
          provide: ChatService,
          useValue: {
            chats$: of(chats),
            getChats: jasmine.createSpy('getChats').and.returnValue(of(chats)),
          },
        },
      ],
    });

    swPushSpy = TestBed.inject(SwPush) as jasmine.SpyObj<SwPush>;
    pushNotificationsServiceSpy = TestBed.inject(
      PushNotificationsService,
    ) as jasmine.SpyObj<PushNotificationsService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    // @ts-ignore
    swPushSpy.requestSubscription.and.returnValue(Promise.resolve({}));
    // @ts-ignore
    pushNotificationsServiceSpy.addPushSubscriber.and.returnValue(of({}));
  });

  it('should not subscribe to notifications if swPush is not enabled', () => {
    // @ts-ignore
    swPushSpy.isEnabled.and.returnValue(false);

    component.subscribeToNotifications();
    expect(swPushSpy.requestSubscription).not.toHaveBeenCalled();
  });

  it('should not subscribe to notifications if Notification permission is denied', () => {
    // @ts-ignore
    swPushSpy.isEnabled.and.returnValue(true);
    spyOn(Notification, 'requestPermission').and.returnValue(
      Promise.resolve('denied'),
    );
    component.subscribeToNotifications();
    expect(swPushSpy.requestSubscription).not.toHaveBeenCalled();
  });

  it('should subscribe to notifications if Notification permission is granted', fakeAsync(() => {
    // @ts-ignore
    swPushSpy.isEnabled.and.returnValue(true);
    spyOn(Notification, 'requestPermission').and.returnValue(
      Promise.resolve('granted'),
    );
    // @ts-ignore
    swPushSpy.requestSubscription.and.returnValue(Promise.resolve({}));
    component.subscribeToNotifications();
    tick(1000);
    expect(swPushSpy.requestSubscription).toHaveBeenCalledTimes(1);
  }));

  it('should subscribe to notifications successfully', fakeAsync(() => {
    // @ts-ignore
    swPushSpy.isEnabled.and.returnValue(true);
    // @ts-ignore
    spyOn(Notification, 'requestPermission').and.returnValue(
      Promise.resolve('granted'),
    );
    // @ts-ignore
    swPushSpy.requestSubscription.and.returnValue(Promise.resolve({}));
    component.subscribeToNotifications();
    tick(1000);
    expect(swPushSpy.requestSubscription).toHaveBeenCalledTimes(1);
  }));

  it('should handle subscription request error', fakeAsync(() => {
    // @ts-ignore
    swPushSpy.isEnabled.and.returnValue(true);
    // @ts-ignore
    spyOn(Notification, 'requestPermission').and.returnValue(
      Promise.resolve('granted'),
    );
    spyOn(console, 'error');
    swPushSpy.requestSubscription.and.returnValue(Promise.reject('error'));
    component.subscribeToNotifications();
    tick(1000);
    expect(console.error).toHaveBeenCalledTimes(1);
  }));

  it('should call navigator.setAppBadge with unread messages count', fakeAsync(() => {
    // @ts-ignore
    swPushSpy.isEnabled.and.returnValue(true);
    // @ts-ignore
    spyOn(Notification, 'requestPermission').and.returnValue(
      Promise.resolve('granted'),
    );
    spyOn(navigator, 'setAppBadge');
    // @ts-ignore
    swPushSpy.requestSubscription.and.returnValue(Promise.resolve({}));
    component.subscribeToNotifications();
    tick(1000);
    expect(navigator.setAppBadge).toHaveBeenCalledTimes(1);
  }));

  it('should call pushNotificationsService.addPushSubscriber with subscription', fakeAsync(() => {
    // @ts-ignore
    swPushSpy.isEnabled.and.returnValue(true);
    // @ts-ignore
    spyOn(Notification, 'requestPermission').and.returnValue(
      Promise.resolve('granted'),
    );
    // @ts-ignore
    swPushSpy.requestSubscription.and.returnValue(Promise.resolve({}));
    component.subscribeToNotifications();
    tick(1000);
    expect(pushNotificationsServiceSpy.addPushSubscriber).toHaveBeenCalledTimes(
      1,
    );
  }));
});
