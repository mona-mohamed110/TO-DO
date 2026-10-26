import Task from "../models/Task.js";
import { HttpError, asyncHandler } from "../utils/http.js";
import { parseTitle, parseCompleted, parseId } from "../utils/validate.js";

const ok = (res, data, status = 200) =>
  res.status(status).json({ success: true, data });

export const listTasks = asyncHandler(async (_req, res) => {
  ok(res, await Task.find().sort({ createdAt: -1 }));
});

export const createTask = asyncHandler(async (req, res) => {
  const title = parseTitle(req.body?.title);
  ok(res, await Task.create({ title }), 201);
});

export const updateTask = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const completed = parseCompleted(req.body?.completed);
  const task = await Task.findByIdAndUpdate(id, { completed }, { new: true });
  if (!task) throw new HttpError(404, "Task not found.");
  ok(res, task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const task = await Task.findByIdAndDelete(id);
  if (!task) throw new HttpError(404, "Task not found.");
  ok(res, { id });
});
