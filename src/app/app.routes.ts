import { Routes } from '@angular/router';
import { ChatComponent } from '@components/chat/chat.component';
import { ChatsComponent } from '@components/chats/chats.component';
import { LoginComponent } from '@components/login/login.component';
import { ProfileComponent } from '@components/profile/profile.component';
import { RegisterComponent } from '@components/register/register.component';

export const APP_ROUTES = {
  CHATS: 'chats',
  LOGIN: 'login',
  REGISTER: 'register',
  PROFILE: 'profile'
}

export const routes: Routes = [
  { path: APP_ROUTES.CHATS, component: ChatsComponent, children: [
    { path: ':id', component: ChatComponent }
  ] },
  { path: APP_ROUTES.LOGIN, component: LoginComponent },
  { path: APP_ROUTES.REGISTER, component: RegisterComponent },
  { path: APP_ROUTES.PROFILE, component: ProfileComponent },
  { path: '', redirectTo: APP_ROUTES.CHATS, pathMatch: 'full' }
];
