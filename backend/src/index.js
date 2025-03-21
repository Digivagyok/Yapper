import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";
//routes
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"
import subscriptionRoutes from "./routes/subscription.routes.js"

import {app, server} from "./lib/socket.js"


dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

app.use("/api/auth/", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

if (process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (request, response) => {
        response.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

server.listen(PORT, () => {
    console.log(`A szerver fut az ${PORT}-es porton ...`);
    connectDB();
})