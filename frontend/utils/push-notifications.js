export default async function subscribeUserToPush(userId) {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BGOhW2Q8di5BLV7s5tNV1hs3cXAblLthr9BmtAwRKQ4viY7B-bO4v6CdR39jPLBawxOHI4_vvPU6pvFZEtUj3zU',
    });

    const payload = {
        userId, // Ensure this is a valid user ID from authentication
        endpoint: subscription.endpoint,
        keys: subscription.keys
    };

    await fetch(`http://localhost:5001/api/subscribe`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
