import { io } from "socket.io-client";

export const chatSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL}/chats`, {
  withCredentials: true,
  autoConnect: false,
});
