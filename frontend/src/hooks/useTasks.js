import { useCallback, useEffect, useRef, useState } from "react";
import * as api from "../api/tasks.js";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");
  const [busyIds, setBusyIds] = useState([]);
  const [adding, setAdding] = useState(false);
  const addingRef = useRef(false);

  const load = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      setTasks(await api.getTasks());
      setStatus("ready");
    } catch (e) {
      setError(e.message);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (title) => {
    if (addingRef.current) return null;
    addingRef.current = true;
    setAdding(true);
    try {
      const task = await api.createTask(title);
      setTasks((prev) => [task, ...prev]);
      return task;
    } finally {
      addingRef.current = false;
      setAdding(false);
    }
  };

  const withBusy = async (id, fn) => {
    setBusyIds((p) => [...p, id]);
    try {
      return await fn();
    } finally {
      setBusyIds((p) => p.filter((x) => x !== id));
    }
  };

  const toggle = (id, completed) =>
    withBusy(id, async () => {
      const task = await api.setTaskCompleted(id, completed);
      setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
      return task;
    });

  const remove = (id) =>
    withBusy(id, async () => {
      await api.removeTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    });

  return { tasks, status, error, adding, busyIds, load, add, toggle, remove };
}
