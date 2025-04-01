import subscribeUserToPush from "../../utils/push-notifications";

export default function NotificationButton() {
    const handleEnableNotifications = async () => {
        const notifResp = await Notification.requestPermission();

        if (notifResp === "granted"){
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                await subscribeUserToPush();
                alert('Push notifications enabled!');
            } else {
                alert('Push notifications are not supported in your browser.');
            }
        } else {
            alert("Push notification was not granted");
        }

        
    };

    return (
        <button onClick={handleEnableNotifications} className="btn btn-primary">
            Értesítések engedélyezése
        </button>
    );
}