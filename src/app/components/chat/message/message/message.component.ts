import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Message } from '@services/messages.service/messages.service';
import { DateAgoPipe } from 'src/app/pipes/date-ago.pipe';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, DateAgoPipe],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  @Input() message: Message;
  @Input() userId: string;
}
