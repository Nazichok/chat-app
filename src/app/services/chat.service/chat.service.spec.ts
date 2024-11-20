import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Chat, ChatService } from './chat.service';
import { provideHttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { chat, chatId, chats, user, users } from 'src/app/helpers/test.constants';

describe('ChatService', () => {
  let service: ChatService;
  let httpMock: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
      teardown: { destroyAfterEach: false },
    });

    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get chats', () => {
    service.getChats().subscribe((chatsResult) => {
      expect(chatsResult).toEqual(chats);
    });

    const req = httpMock.expectOne(`${environment.serverUrl}/api/chats`);
    expect(req.request.method).toBe('GET');
    req.flush(chats);
  });

  it('should get users online', () => {
    const usersOnline = ['1', '2', '3'];

    // @ts-ignore
    service.usersOnline = usersOnline;

    service.usersOnline$.subscribe((usersOnlineResult) => {
      expect(usersOnlineResult).toEqual(usersOnline);
    });
  });

  it('should create chat', () => {
    service.createChat(user).subscribe((chatResult) => {
      expect(chatResult).toEqual(chat);
    });

    const req = httpMock.expectOne(`${environment.serverUrl}/api/chats`);
    expect(req.request.method).toBe('POST');
    req.flush(chat);
  });

  it('should get chat', () => {
    service.getChat(chatId).subscribe((chatResult) => {
      expect(chatResult).toEqual(chat);
    });

    const req = httpMock.expectOne(
      `${environment.serverUrl}/api/chats/${chatId}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(chat);
  });

  it('should select chat', () => {
    service.selectChat(user);

    const req = httpMock.expectOne(`${environment.serverUrl}/api/chats`);
    req.flush(user);

    expect(req.request.method).toBe('POST');
  });

  it('should update unread count', () => {
    const chatId = '1';
    const unreadCount = 5;

    // @ts-ignore
    service.chats = chats;

    service.updateUnreadCount(chatId, unreadCount);

    // @ts-ignore
    expect(service.chats[0].unreadCount).toBe(unreadCount);
  });

  it('should search users', () => {
    const query = 'john';

    service.searchUsers(query).subscribe((usersResult) => {
      expect(usersResult).toEqual(users);
    });

    const req = httpMock.expectOne(
      `${environment.serverUrl}/api/users/search?query=${query}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(users);
  });

  it('should add user online', () => {
    const userId = '1';

    // @ts-ignore
    service.addUserOnline(userId);

    // @ts-ignore
    expect(service.usersOnline).toContain(userId);
  });

  it('should remove user online', () => {
    const userId = '1';

    // @ts-ignore
    service.removeUserOnline(userId);

    // @ts-ignore
    expect(service.usersOnline).not.toContain(userId);
  });
});
