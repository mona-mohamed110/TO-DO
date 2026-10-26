const BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error(
      "Can't reach the server. Check your connection and try again.",
    );
  }
  let body = null;
  try {
    body = await res.json();
  } catch {
    
  }
  if (!res.ok || !body?.success) {
    throw new Error(
      body?.error?.message || `Request failed (status ${res.status}).`,
    );
  }
  return body.data;
}

export const getTasks = () => request("/tasks");
export const createTask = (title) =>
  request("/tasks", { method: "POST", body: JSON.stringify({ title }) });
export const setTaskCompleted = (id, completed) =>
  request(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ completed }),
  });
export const removeTask = (id) => request(`/tasks/${id}`, { method: "DELETE" });
