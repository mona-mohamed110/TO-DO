import { HttpError } from "../utils/http.js";

const fail = (res, status, message) =>
  res.status(status).json({ success: false, error: { message } });

export const notFound = (_req, res) => fail(res, 404, "Route not found.");

export function errorHandler(err, _req, res, _next) {
  if (err instanceof HttpError) return fail(res, err.status, err.message);
  if (err.type === "entity.parse.failed")
    return fail(res, 400, "Request body is not valid JSON.");
  if (err.name === "ValidationError")
    return fail(res, 400, "Invalid task data.");
  console.error(err);
  return fail(res, 500, "Something went wrong on the server.");
}
