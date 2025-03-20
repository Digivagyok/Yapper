import subscribeUserToPush from "../../utils/push-notifications";

export default function NotificationButton() {
    const handleEnableNotifications = async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            await subscribeUserToPush();
            alert('Push notifications enabled!');
        } else {
            alert('Push notifications are not supported in your browser.');
        }
    };

    return (
        <button onClick={handleEnableNotifications} className="btn btn-primary">
            Értesítések engedélyezése
        </button>
    );
}