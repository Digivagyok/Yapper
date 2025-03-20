import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL],
    },
});

export function getReceiverSocketId(userId) {
    console.log("Getting receiver socket ID for user:", userId);
    console.log("Current userSocketMap:", userSocketMap);
    return userSocketMap[userId];
}

export function getUserActivity(userId) {
    console.log("Fetching user activity for:", userId);
    console.log("Current userActivityMap:", userActivityMap);
    return userActivityMap[userId] || null;
}

const userSocketMap = {}; // {userId: socketId} 
const userActivityMap = {}; // { userId: { activeChat: senderId, socketId: socketId } }

io.on("connection", (socket) => {
    console.log("Egy felhasználó csatlakozott: ", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Listen for activity updates
    socket.on("updateActivity", ({ userId, activeChat }) => {
        console.log("Received updateActivity event:", { userId, activeChat });
        if (userId) {
            if (activeChat) {
                // Update the user's activity to reflect the active chat
                userActivityMap[userId] = { activeChat, socketId: socket.id };
            } else {
                // Clear the user's activity if activeChat is null
                delete userActivityMap[userId];
            }
            console.log("User activity updated:", userActivityMap);
        }
    });

    socket.on("disconnect", () => {
        console.log("Egy felhasználó lecsatlakozott: ", socket.id);

        // Remove the user from the socket map and activity map
        for (const [userId, socketId] of Object.entries(userSocketMap)) {
            if (socketId === socket.id) {
                delete userSocketMap[userId];
                delete userActivityMap[userId];
                break;
            }
        }

        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export {io, app, server};