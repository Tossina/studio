"use client";

import { io } from "socket.io-client";

// Connection to the custom server (default URL works for same-origin)
export const socket = io({
    autoConnect: true,
    path: "/socket.io", // Default path
});
