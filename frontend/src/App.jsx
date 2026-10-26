import { useCallback, useMemo, useState } from "react";
import { CheckCheck, Circle, CircleCheck, ListTodo } from "lucide-react";
import FilterCard from "./components/FilterCard.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import ConfirmDialog from "./components/ConfirmDialog.jsx";
import Toast from "./components/Toast.jsx";
import useTasks from "./hooks/useTasks.js";

const HEADINGS = {
  all: "All tasks",
  pending: "Pending",
  completed: "Completed",
};

export default function App() {
  const { tasks, status, error, adding, busyIds, load, add, toggle, remove } =
    useTasks();
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const notify = (message, type = "success") => setToast({ message, type });
  const dismiss = useCallback(() => setToast(null), []);

  const counts = useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length;
    return { all: tasks.length, completed, pending: tasks.length - completed };
  }, [tasks]);

  const visible = useMemo(
    () =>
      tasks.filter((t) =>
        filter === "all"
          ? true
          : filter === "completed"
            ? t.completed
            : !t.completed,
      ),
    [tasks, filter],
  );

  const percent = counts.all
    ? Math.round((counts.completed / counts.all) * 100)
    : 0;
  const ready = status === "ready";
  const pick = (id) => setFilter((f) => (f === id ? "all" : id));

  async function handleAdd(title) {
    const task = await add(title);
    if (task) notify("Task added");
  }

  async function handleToggle(id, completed) {
    try {
      await toggle(id, completed);
      notify(completed ? "Marked as completed" : "Marked as pending");
    } catch (e) {
      notify(e.message, "error");
    }
  }

  async function confirmDelete() {
    const task = toDelete;
    try {
      await remove(task.id);
      notify("Task deleted");
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setToDelete(null);
    }
  }

  return (
    <div className="scene">
      <header className="brandbar">
        <span className="brand-mark" aria-hidden="true">
          <CheckCheck size={18} strokeWidth={2.8} />
        </span>
        <span className="brand-name">Tasklane</span>
      </header>

      <div className="stage">
        <FilterCard
          area="all"
          tone="peach"
          Icon={ListTodo}
          label="All tasks"
          count={counts.all}
          hint={
            ready && tasks[0]
              ? `Latest: ${tasks[0].title}`
              : "Nothing added yet"
          }
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        <FilterCard
          area="pending"
          tone="purple"
          Icon={Circle}
          label="Pending"
          count={counts.pending}
          hint="Still to do"
          active={filter === "pending"}
          onClick={() => pick("pending")}
        />
        <FilterCard
          area="completed"
          tone="lav"
          Icon={CircleCheck}
          label="Completed"
          count={counts.completed}
          hint={`${percent}% done`}
          active={filter === "completed"}
          onClick={() => pick("completed")}
        />

        <main className="phone">
          <div className="phone-head">
            <div>
              <h1>{HEADINGS[filter]}</h1>
              <p className="subtitle" aria-live="polite">
                {ready
                  ? `${counts.completed} of ${counts.all} ${counts.all === 1 ? "task" : "tasks"} completed`
                  : "Saved to the cloud"}
              </p>
            </div>
            <div
              className="ring"
              style={{ "--p": percent }}
              role="img"
              aria-label={`${percent}% of tasks completed`}
            >
              <span aria-hidden="true">{percent}%</span>
            </div>
          </div>

          <div className="phone-scroll">
            <TaskList
              tasks={visible}
              status={status}
              error={error}
              filter={filter}
              busyIds={busyIds}
              onRetry={load}
              onToggle={handleToggle}
              onDelete={setToDelete}
            />
          </div>

          <div className="phone-foot">
            <TaskForm onAdd={handleAdd} adding={adding} />
          </div>
        </main>
      </div>

      <p className="tagline">Tasklane — Stay on track</p>

      <ConfirmDialog
        task={toDelete}
        busy={toDelete ? busyIds.includes(toDelete.id) : false}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  );
}
