import { useRef, useState } from "react";
import { Loader2, Plus } from "lucide-react";

const MAX = 120;

export default function TaskForm({ onAdd, adding }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  async function submit(e) {
    e.preventDefault();
    if (adding) return;
    const title = value.trim();
    if (!title) return setError("Enter a task before adding it.");
    if (title.length > MAX)
      return setError(`Keep tasks under ${MAX} characters.`);
    setError("");
    try {
      await onAdd(title);
      setValue("");
      inputRef.current?.focus();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="task-form" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="new-task" className="sr-only">
          New task
        </label>
        <input
          id="new-task"
          ref={inputRef}
          type="text"
          value={value}
          maxLength={MAX}
          placeholder="What needs to get done?"
          autoComplete="off"
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? "new-task-error" : undefined}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError("");
          }}
        />
        <button type="submit" className="btn btn-primary" disabled={adding}>
          {adding ? (
            <Loader2 size={18} className="spin" aria-hidden="true" />
          ) : (
            <Plus size={18} aria-hidden="true" />
          )}
          {adding ? "Adding…" : "Add task"}
        </button>
      </div>
      {error && (
        <p id="new-task-error" className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
