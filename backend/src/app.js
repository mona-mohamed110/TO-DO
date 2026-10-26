import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import taskRoutes from "./routes/tasks.js";
import { notFound, errorHandler } from "./middleware/errors.js";

const app = express();

const origins = process.env.CLIENT_ORIGIN?.split(",")
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors({ origin: origins?.length ? origins : true }));
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (_req, res) =>
  res.json({ success: true, data: { status: "ok" } }),
);

app.use("/api/tasks", async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection failed:", err.message);
    res
      .status(503)
      .json({
        success: false,
        error: {
          message: "Database is unavailable. Please try again shortly.",
        },
      });
  }
});

app.use("/api/tasks", taskRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
