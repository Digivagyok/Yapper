import useAuthStore from "../store/useAuthStore";

import subscribeUserToPush from "../utils/push-notifications";

export default function NotificationButton() {
    const {authUser} = useAuthStore();


    const handleEnableNotifications = async () => {
        const notifResp = await Notification.requestPermission();

        if (!userId) {
            alert("User ID is not available. Ensure the user is logged in.");
            return;
        }

        if (notifResp === "granted"){
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                await subscribeUserToPush(authUser._id);
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