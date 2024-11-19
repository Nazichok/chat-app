import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import { Message, MessagesService } from '@services/messages.service/messages.service';
import { DateAgoPipe } from 'src/app/pipes/date-ago.pipe';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, DateAgoPipe],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent implements AfterViewInit {
  @Input() message: Message;
  @Input() userId: string;

  constructor(
    private messagesService: MessagesService
  ) {}

  ngAfterViewInit(): void {
    if (!this.message) {
      return;
    }
    if (!this.message.isRead && this.message.sender !== this.userId) {
      this.messagesService.messageRead(this.message);
    }
  }
}
