import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatInboxComponent } from './components/chat-inbox/chat-inbox.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatInboxComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'chat-app';
}
