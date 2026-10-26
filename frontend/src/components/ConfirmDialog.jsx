import { useEffect, useRef } from "react";

// Native <dialog>: built-in focus trapping, Escape to close, and backdrop.
export default function ConfirmDialog({ task, busy, onCancel, onConfirm }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (task && !dialog.open) dialog.showModal();
    if (!task && dialog.open) dialog.close();
  }, [task]);

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="confirm-title"
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onCancel();
      }}
      onClick={(e) => e.target === ref.current && !busy && onCancel()}
    >
      <h2 id="confirm-title">Delete this task?</h2>
      <p className="dialog-text">
        "{task?.title}" will be permanently removed.
      </p>
      <div className="dialog-actions">
        <button
          type="button"
          className="btn"
          onClick={onCancel}
          disabled={busy}
          autoFocus
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? "Deleting…" : "Delete task"}
        </button>
      </div>
    </dialog>
  );
}
