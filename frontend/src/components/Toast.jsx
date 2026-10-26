import { useEffect } from "react";
import { CircleAlert, CircleCheck, X } from "lucide-react";

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, toast.type === "error" ? 6000 : 3500);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div
      className={`toast${isError ? " toast-error" : ""}`}
      role={isError ? "alert" : "status"}
    >
      {isError ? (
        <CircleAlert size={18} aria-hidden="true" />
      ) : (
        <CircleCheck size={18} aria-hidden="true" />
      )}
      <span>{toast.message}</span>
      <button
        type="button"
        className="toast-close"
        aria-label="Dismiss notification"
        onClick={onDismiss}
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
