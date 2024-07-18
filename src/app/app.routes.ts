import { Routes } from '@angular/router';
import { BoardUserComponent } from '@components/board-user/board-user.component';
import { ChatInboxComponent } from '@components/chat-inbox/chat-inbox.component';
import { HomeComponent } from '@components/home/home.component';
import { LoginComponent } from '@components/login/login.component';
import { ProfileComponent } from '@components/profile/profile.component';
import { RegisterComponent } from '@components/register/register.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: BoardUserComponent },
  { path: 'chat', component: ChatInboxComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
