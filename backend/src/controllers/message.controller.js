import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, getUserActivity, io } from "../lib/socket.js";
import Subscription from "../models/subscription.model.js";
import webPush from "web-push";

export const getUsersForSidebar = async (request, response) => {
    try {
        const loggedInUserId = request.user._id;

        const filteredUsers = await User.find({_id: {$ne: loggedInUserId} }).select("-password");

        response.status(200).json(filteredUsers);

    } catch (error) {
        console.log("Hiba a getusersForSidebar ban: ", error.message);
        response.status(500).json({error: "Internal server error"});
    }
};

export const getMessages = async (request, response) => {
    try {
        const {id: userToChatId} = request.params;
        const myId = request.user._id;

        const messages = await Message.find({
            $or:[
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        });

        response.status(200).json(messages);

    } catch (error) {
        console.log("Hiba a getMessages ben: ", error.message);
        response.status(500).json({error: "Internal server error"});
    }
};

webPush.setVapidDetails(
    `mailto:${process.env.EMAIL}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

const checkIfUserIsActiveOnChat = (receiverId, senderId) => {
    const userActivity = getUserActivity(receiverId); // Retrieve user activity from your WebSocket logic
    console.log("Checking if user is active on chat:");
    console.log("Receiver ID:", receiverId);
    console.log("Sender ID:", senderId);
    console.log("User Activity:", userActivity);

    if (!userActivity) {
        console.log("User activity not found for receiver:", receiverId);
        return false; // Assume the user is not active if no activity is found
    }

    const isActive = userActivity.activeChat === senderId;
    console.log("Is User Active on Chat:", isActive);
    return isActive;
};


export const sendMessage = async (request, response) => {
    try {
        const {text, image} = request.body;
        const {id: receiverId} = request.params;
        const senderId = request.user._id;

        let imageUrl;
        if  (image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        console.log("Receiver Socket ID:", receiverSocketId);

        const isUserActiveOnChat = checkIfUserIsActiveOnChat(receiverId, senderId);
        console.log("Is User Active on Chat:", isUserActiveOnChat);
        
        // Send the message via WebSocket if the recipient is online
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
            console.log("Message sent via WebSocket to:", receiverSocketId);

            // If the recipient is online but not actively viewing the chat, send a push notification
            if (!isUserActiveOnChat) {
                console.log("Recipient is online but not actively viewing the chat. Sending push notification...");
                const subscriptions = await Subscription.find({ userId: receiverId });

                if (subscriptions.length > 0) {
                    const notificationPayload = JSON.stringify({
                        title: `${request.user.fullName || "Ismeretlen"}`,
                        body: text && text.trim() !== "" ? text : "Képet küldött",
                        icon: "/icons/icon-192x192.png",
                        url: `/`, // URL to open the chat with the sender
                    });

                    // Send push notifications to all subscriptions
                    const sendPromises = subscriptions.map((subscription) =>
                        webPush.sendNotification(subscription, notificationPayload).catch((err) => {
                            console.error("Failed to send push notification:", err);
                        })
                    );

                    await Promise.all(sendPromises);
                }
            }
        } else {
            // If the recipient is offline, send a push notification
            console.log("Recipient is offline. Sending push notification...");
            const subscriptions = await Subscription.find({ userId: receiverId });

            if (subscriptions.length > 0) {
                const notificationPayload = JSON.stringify({
                    title: `${request.user.fullName || "Ismeretlen"}`,
                    body: text && text.trim() !== "" ? text : "Képet küldött",
                    icon: "/icons/icon-192x192.png",
                    url: `/`, // URL to open the chat with the sender
                });

                // Send push notifications to all subscriptions
                const sendPromises = subscriptions.map((subscription) =>
                    webPush.sendNotification(subscription, notificationPayload).catch((err) => {
                        console.error("Failed to send push notification:", err);
                    })
                );

                await Promise.all(sendPromises);
            }
        }

        response.status(201).json(newMessage);

    } catch (error) {
        console.log("Hiba a sendMessage ben: ", error.message);
        response.status(500).json({error: "Internal server error"});
    }
};