export default function FeedbackMessage({ message, type = "error", children }) {
    if (!message && !children) return null;

    const isError = type === "error";
    const alertClass = isError ? "alert-danger" : "alert-success";
    const icon = isError ? "❌" : "✅";

    return (
        <div className={`alert ${alertClass} shadow-sm fw-bold text-center mb-4`}>
            {message && <span>{icon} {message}</span>}
            
            {children && <div className="mt-2">{children}</div>}
        </div>
    );
}