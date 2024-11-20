import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { ChatComponent } from './chat.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DialogService } from 'primeng/dynamicdialog';
import { UserService } from '@services/user.service/user.service';
import { MessagesService } from '@services/messages.service/messages.service';
import { ChatService } from '@services/chat.service/chat.service';
import { ModalService } from '@services/modal.service/modal.service';
import { chat, chatId, chats, messages } from 'src/app/helpers/test.constants';

describe('ChatComponent', () => {
  let localStore: Record<string, string>;
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;
  let messageService: MessagesService;

  beforeEach(async () => {
    modalServiceSpy = jasmine.createSpyObj('ModalService', [
      'openProfileModal',
    ]);

    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DialogService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ chatId }),
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
          },
        },
        {
          provide: MessagesService,
          useValue: {
            messagesMap$: of({ [chatId]: messages }),
            sendMessage: () => {},
          },
        },
        {
          provide: ChatService,
          useValue: {
            chats$: of(chats),
            usersOnline$: of([]),
            updateUnreadCount: () => {},
          },
        },
        { provide: ModalService, useValue: modalServiceSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    messageService = TestBed.inject(MessagesService);

    localStore = {};

    spyOn(window.localStorage, 'getItem').and.callFake((key) =>
      key in localStore ? localStore[key] : null,
    );
    spyOn(window.localStorage, 'setItem').and.callFake(
      (key, value) => (localStore[key] = value + ''),
    );
    spyOn(window.localStorage, 'clear').and.callFake(() => (localStore = {}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize chatId from route params', () => {
    // @ts-ignore
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.chatId).toBe(chatId);
  });

  it('should get messages for chat', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.messages).toBe(messages);
  });

  it('should open user modal', () => {
    fixture.detectChanges();
    component.openUserModal();
    expect(modalServiceSpy.openProfileModal).toHaveBeenCalledTimes(1);
  });

  it('should call event.preventDefault', () => {
    const event = new Event('submit');
    spyOn(event, 'preventDefault');
    component.sendMessage(event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });
  it('should call messagesService.sendMessage with correct arguments when inputMessage is not empty', () => {
    const message = 'Hello';
    component.inputMessage = message;
    component.chat = chat;

    spyOn(messageService, 'sendMessage');
    component.sendMessage(new Event('submit'));
    expect(messageService.sendMessage).toHaveBeenCalledTimes(1);
    expect(messageService.sendMessage).toHaveBeenCalledWith(chat, message);
  });
  it('should reset inputMessage to empty string after sending message', () => {
    component.inputMessage = 'Hello';
    component.sendMessage(new Event('submit'));
    expect(component.inputMessage).toBe('');
  });
  it('should not call messagesService.sendMessage when inputMessage is empty', () => {
    component.inputMessage = '';
    spyOn(messageService, 'sendMessage');
    component.sendMessage(new Event('submit'));
    expect(messageService.sendMessage).not.toHaveBeenCalled();
  });
});
