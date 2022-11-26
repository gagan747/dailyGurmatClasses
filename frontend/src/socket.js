import { io } from "socket.io-client";
export const socket = io("https://dailgurmatclasses.herokuapp.com");
socket.on("connect", () => {
          console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});
