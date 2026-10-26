import { HttpError } from "./http.js";

export const TITLE_MAX = 120;

export function parseTitle(value) {
  if (typeof value !== "string")
    throw new HttpError(400, "Task title is required.");
  const title = value.trim();
  if (!title) throw new HttpError(400, "Task title cannot be empty.");
  if (title.length > TITLE_MAX)
    throw new HttpError(
      400,
      `Task title must be ${TITLE_MAX} characters or fewer.`,
    );
  return title;
}

export function parseCompleted(value) {
  if (typeof value !== "boolean")
    throw new HttpError(400, '"completed" must be true or false.');
  return value;
}

export function parseId(value) {
  if (!/^[a-f\d]{24}$/i.test(value))
    throw new HttpError(400, "Invalid task ID.");
  return value;
}
