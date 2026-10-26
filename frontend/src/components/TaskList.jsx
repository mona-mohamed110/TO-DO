import { AlertCircle, ClipboardList, RotateCw } from "lucide-react";
import TaskItem from "./TaskItem.jsx";

const EMPTY = {
  all: ["No tasks yet", "Add your first task above to start your list."],
  pending: [
    "Nothing pending",
    "Every task is done. Add a new one when you're ready.",
  ],
  completed: ["No completed tasks", "Tasks you finish will show up here."],
};

export default function TaskList({
  tasks,
  status,
  error,
  filter,
  busyIds,
  onRetry,
  onToggle,
  onDelete,
}) {
  if (status === "loading") {
    return (
      <div className="card" role="status" aria-live="polite" aria-busy="true">
        <span className="sr-only">Loading tasks…</span>
        {[0, 1, 2].map((i) => (
          <div className="skeleton" key={i} aria-hidden="true" />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="card state" role="alert">
        <AlertCircle
          size={28}
          className="state-icon error"
          aria-hidden="true"
        />
        <h2>Couldn't load your tasks</h2>
        <p>{error}</p>
        <button type="button" className="btn" onClick={onRetry}>
          <RotateCw size={16} aria-hidden="true" /> Try again
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    const [title, text] = EMPTY[filter];
    return (
      <div className="card state">
        <ClipboardList size={28} className="state-icon" aria-hidden="true" />
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    );
  }

  return (
    <ul className="card task-list">
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          busy={busyIds.includes(t.id)}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
