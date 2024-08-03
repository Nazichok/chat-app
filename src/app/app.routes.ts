import { Routes } from '@angular/router';
import { ChatComponent } from '@components/chat/chat.component';
import { ChatsComponent } from '@components/chats/chats.component';
import { LoginComponent } from '@components/login/login.component';
import { ProfileComponent } from '@components/profile/profile.component';
import { RegisterComponent } from '@components/register/register.component';
import { authGuard } from './guards/auth.guard';
import { chatResolver } from './resolvers/chat.resolver';
import { chatsResolver } from './resolvers/chats.resolver';

export const APP_ROUTES = {
  CHATS: 'chats',
  LOGIN: 'login',
  REGISTER: 'register',
  PROFILE: 'profile',
};

export const ROUTE_PARAMS = {
  CHAT_ID: 'chatId',
};

export const routes: Routes = [
  {
    path: APP_ROUTES.CHATS,
    component: ChatsComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    resolve: {
      chats: chatsResolver,
    },
    children: [
      {
        path: `:${ROUTE_PARAMS.CHAT_ID}`,
        component: ChatComponent,
        resolve: {
          chatData: chatResolver,
        },
      },
    ],
  },
  { path: APP_ROUTES.LOGIN, component: LoginComponent },
  { path: APP_ROUTES.REGISTER, component: RegisterComponent },
  {
    path: APP_ROUTES.PROFILE,
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: APP_ROUTES.CHATS, pathMatch: 'full' },
];
