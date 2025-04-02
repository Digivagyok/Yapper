const YapperToast = {
    info: (message) => {
        console.log("Info: ", message);
        return (
            <div className="toast toast-success">
                <p>{message}</p>
            </div>
        )
    }
}

export default YapperToast;

function SuccessToast(message) {
    return (
        <div className="toast toast-success">
            <p>{message}</p>
        </div>
    )
}

function ErrorToast(message) {
    return (
        <div className="toast toast-error">
            <p>{message}</p>
        </div>
    )
}