import express from "express";
import webPush from "web-push";
import Subscription from "../models/subscription.model.js";

const router = express.Router();

// VAPID keys (replace with your actual keys)
webPush.setVapidDetails(
    `mailto:${process.env.EMAIL}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

router.post("/notifications/send", async (request, response) => {
    const { userId, payload } = request.body;

    if(!userId || !payload) {
        return response.status(400).json({error: "FelhasználóID és payload kötelező."});
    }

    try {
        //find all subscriptions for the user
        const subscriptions = await Subscription.find({userId});

        if (subscriptions.length === 0) {
            return response.status(404).json({error : "Nincs feliratkozás a userhez kötve."});
        }

        const notificationPayload = JSON.stringify(payload);
        const sendPromises = subscriptions.map((subscription) => 
            webPush.sendNotification(subscription, notificationPayload)
        );

        await Promise.all(sendPromises);

        response.status(200).json({message: "Az éretsítések sikeresen elküldve."});
    } catch (error) {
        console.error("Hiba az éretsítés kiküldésekor: ", error);
        response.status(500).json({error: "Hiba az éretsítés kiküldésekor."});
    }
});


router.post("/subscribe", async (request, response) => {
    const {userId, subscription} = request.body;

    if (!userId || !subscription) {
        return response.status(400).json({error: "FelhasznólóID és subscription kötelező."});
    }

    try {
        // checks if the subscription already exists for the user
        const existingSubscription = await Subscription.findOne({userId, endpoint: subscription.endpoint});
        if (existingSubscription) {
            return response.status(200).json({message: "A feliratkozás már létezik"});
        }

        const newSubscription = new Subscription({
            userId,
            endpoint: subscription.endpoint,
            keys: subscription.keys,
        });
        await newSubscription.save();

        response.status(201).json({message: "A feliratkozás sikeresen elmentve."});
    } catch (error) {
        console.error("Hiba a feliratkozás mentésében:", error);
        response.status(500).json({error: "Hiba a feliratkozás mentésében"});
    }
});

export default router;