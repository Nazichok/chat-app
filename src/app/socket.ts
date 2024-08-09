import { io } from 'socket.io-client';
import { serverUrl } from './config';

export enum SocketEvents {
  USER_CONNECTED = 'user connected',
  USER_DISCONNECTED = 'user disconnected',
  PRIVATE_MESSAGE = 'private message',
  USER_IDS = 'userIds',
  CONNECT_ERROR = 'connect error',
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
  CONNECT = 'connect',
};

declare module 'socket.io-client' {
  interface Socket {
    userId?: string;
  }
}

const socket = io(serverUrl, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
