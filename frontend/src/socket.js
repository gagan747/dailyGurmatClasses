import { io } from "socket.io-client";
import hostUrl from './config'
export const socket = io(hostUrl);
socket.on("connect", () => {
          console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});
