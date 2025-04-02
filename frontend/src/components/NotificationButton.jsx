import subscribeUserToPush from "../../utils/push-notifications";
import useAuthStore from "../store/useAuthStore";

export default function NotificationButton() {
    const handleEnableNotifications = async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            const { authUser } = useAuthStore.getState();
            await subscribeUserToPush(authUser._id);
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