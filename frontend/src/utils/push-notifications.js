export default async function subscribeUserToPush(userId) {
    if (!userId) {
        console.error("User ID is not available. Ensure the user is logged in.");
        return;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BFwIOF9CXRPxMmQge1_FD12ede32mc2m0FvId6Jwj-5cx3Aruh3mMq9gb0U-exhSwao4NB-AOGaCv5AVm3fS5l4',
    });

    console.log("Generated subscription:", subscription);

    // Send subscription to your server
    const response = await fetch("http://localhost:5001/api/subscriptions/subscribe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId,
            subscription,
        }),
    });

    if (!response.ok) {
        console.error("Failed to save subscription:", await response.text());
    }
};