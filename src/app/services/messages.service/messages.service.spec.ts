import { fakeAsync, TestBed } from '@angular/core/testing';

import { Message, MessagesService } from './messages.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { chat, chatId, message, messages } from 'src/app/helpers/test.constants';
import { ChatService } from '@services/chat.service/chat.service';
import { UserService } from '@services/user.service/user.service';
import socket from 'src/app/socket';

describe('MessagesServiceService', () => {
  let service: MessagesService;
  let chatServiceSpy: jasmine.SpyObj<ChatService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    chatServiceSpy = jasmine.createSpyObj('ChatService', ['updateUnreadCount', 'newMessage']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['user']);

    TestBed.configureTestingModule({
      providers: [
        MessagesService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    });
    service = TestBed.inject(MessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should update map with new messages', () => {
    //@ts-ignore
    service.updateMap(chatId, messages);

    // @ts-ignore
    expect(service.messagesMap[chatId]).toEqual(messages);
  });

  it('should update unread count when new messages are added', () => {
    const chatId = '123';
    const messages = [
      { _id: '1', text: 'Hello', sender: 'other', isRead: false },
    ];

    // @ts-ignore
    service.updateMap(chatId, messages);

    expect(chatServiceSpy.updateUnreadCount).toHaveBeenCalledTimes(1);
    expect(chatServiceSpy.updateUnreadCount).toHaveBeenCalledWith(chatId, 1);
  });

  it('should update unread count when messages are read', () => {
    const chatId = '123';
    const messages = [
      { _id: '1', text: 'Hello', sender: 'other', isRead: true },
    ];

    // @ts-ignore
    service.updateMap(chatId, messages);

    expect(chatServiceSpy.updateUnreadCount).toHaveBeenCalledTimes(1);
    expect(chatServiceSpy.updateUnreadCount).toHaveBeenCalledWith(chatId, 0);
  });

  it('should handle empty messages array', () => {
    const chatId = '123';
    const messages: Message[] = [];

    // @ts-ignore
    service.updateMap(chatId, messages);

    // @ts-ignore
    expect(service.messagesMap[chatId]).toEqual([]);
  });

  it('should handle null or undefined messages array', () => {
    const chatId = '123';
    const messages: Message[] | null | undefined = null;

    // @ts-ignore
    service.updateMap(chatId, messages);

    // @ts-ignore
    expect(service.messagesMap[chatId]).toBeUndefined();
  });

  it('should call socket.emit', fakeAsync(() => {
    spyOn(socket, 'emit');
    service.messageRead(message);

    expect(socket.emit).toHaveBeenCalledTimes(1);
  }));

  it('should call updateMap with correct arguments', () => {
    const messagesMap = { [message.chatId]: [message] };
    // @ts-ignore
    service.messagesMap = messagesMap;
    // @ts-ignore
    spyOn(service, 'updateMap');
    service.messageRead(message);
    // @ts-ignore
    expect(service.updateMap).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(service.updateMap).toHaveBeenCalledWith(message.chatId, [
      { ...message, isRead: true },
    ]);
  });
  it('should mark message as read in messagesMap', () => {
    const messagesMap = { [message.chatId]: [message] };
    // @ts-ignore
    service.messagesMap = messagesMap;
    service.messageRead(message);
    // @ts-ignore
    expect(service.messagesMap[message.chatId][0].isRead).toBe(true);
  });
  it('should not mark message as read if message._id does not match', () => {
    const messagesMap = { [message.chatId]: [{ _id: '2', chatId: '1', sender: '1' }] };
    // @ts-ignore
    service.messagesMap = messagesMap;
    service.messageRead(message);
    // @ts-ignore
    expect(service.messagesMap[message.chatId][0].isRead).toBeUndefined();
  });

  it('should send message', () => {
    spyOn(socket, 'emit');
    // @ts-ignore
    spyOn(service, 'updateMap');
    service.sendMessage(chat, message.text);
    expect(socket.emit).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(service.updateMap).toHaveBeenCalledTimes(1);
    expect(chatServiceSpy.newMessage).toHaveBeenCalledTimes(1);
  });
});
