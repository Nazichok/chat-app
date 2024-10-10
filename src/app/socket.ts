import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

export enum SocketEvents {
  USER_CONNECTED = 'user connected',
  USER_DISCONNECTED = 'user disconnected',
  PRIVATE_MESSAGE = 'private message',
  USER_IDS = 'userIds',
  CONNECT_ERROR = 'connect error',
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
  CONNECT = 'connect',
  MESSAGE_READ = 'message read',
  USER_UPDATED = 'user updated',
};

declare module 'socket.io-client' {
  interface Socket {
    userId?: string;
  }
}

const socket = io(environment.serverUrl, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
