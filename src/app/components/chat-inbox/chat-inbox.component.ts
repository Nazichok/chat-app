import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from '@services/chat-service/chat.service';

@Component({
  selector: 'app-chat-inbox',
  templateUrl: './chat-inbox.component.html',
  styleUrl: './chat-inbox.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ChatInboxComponent implements OnInit {
  message: string;
  constructor(private chatService: ChatService) {
    this.message = "";
  }

  ngOnInit(): void {
    this.subscribeToMessages();
  }

  subscribeToMessages() {
    this.chatService.getNewMessage().subscribe((data: string) => {
      if (data) {
        const element = document.createElement('li');
        element.innerHTML = data;
        element.style.background = 'white';
        element.style.padding =  '15px 30px';
        element.style.margin = '10px';
        document.getElementById('message-list')?.appendChild(element);
      }
    })
  }

  sendMessage() {
    if (this.message) {
      this.chatService.sendMessage(this.message);
      const element = document.createElement('li');
      element.innerHTML = this.message;
      element.style.background = 'white';
      element.style.padding =  '15px 30px';
      element.style.margin = '10px';
      element.style.textAlign = 'right';
      document.getElementById('message-list')?.appendChild(element);
      this.message = '';
    }
  }
}
