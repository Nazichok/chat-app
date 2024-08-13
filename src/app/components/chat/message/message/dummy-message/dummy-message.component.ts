import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Message } from '@services/messages.service/messages.service';
import { DateAgoPipe } from 'src/app/pipes/date-ago.pipe';

@Component({
  selector: 'app-dummy-message',
  standalone: true,
  imports: [CommonModule, DateAgoPipe],
  templateUrl: './dummy-message.component.html',
})
export class DummyMessageComponent {
  @Input() message: Message;
  @Input() userId: string;
}
