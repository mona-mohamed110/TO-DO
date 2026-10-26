import { Trash2 } from "lucide-react";

const fmt = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default function TaskItem({ task, busy, onToggle, onDelete }) {
  const inputId = `task-${task.id}`;
  return (
    <li
      className={`task${task.completed ? " is-done" : ""}`}
      aria-busy={busy || undefined}
    >
      <input
        id={inputId}
        type="checkbox"
        className="check"
        checked={task.completed}
        disabled={busy}
        onChange={() => onToggle(task.id, !task.completed)}
      />
      <label htmlFor={inputId} className="task-body">
        <span className="task-title">{task.title}</span>
        <span className="task-meta">
          Added {fmt.format(new Date(task.createdAt))}
        </span>
      </label>
      <button
        type="button"
        className="icon-btn danger"
        disabled={busy}
        aria-label={`Delete task: ${task.title}`}
        onClick={() => onDelete(task)}
      >
        <Trash2 size={18} aria-hidden="true" />
      </button>
    </li>
  );
}
