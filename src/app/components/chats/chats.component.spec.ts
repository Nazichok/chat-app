import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatsComponent } from './chats.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { routes } from 'src/app/app.routes';
import { ChatService } from '@services/chat.service/chat.service';
import { chats } from 'src/app/helpers/test.constants';

describe('ChatsComponent', () => {
  let component: ChatsComponent;
  let fixture: ComponentFixture<ChatsComponent>;
  let chatService: ChatService;


  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [ChatsComponent],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    })
    .compileComponents();

    chatService = TestBed.inject(ChatService);
    fixture = TestBed.createComponent(ChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display chats', () => {
    // @ts-ignore
    chatService.chats = chats;
    component.ngOnInit();
    fixture.detectChanges();

    const chatElements = fixture.nativeElement.querySelectorAll('[data-chats-container] li');
    expect(chatElements.length).toBe(2);
    expect(chatElements[0].textContent).toContain('John Doe');
    expect(chatElements[1].textContent).toContain('Jane Doe');
  });
});
