import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 120,
    },
    completed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => ({
        id: ret._id.toString(),
        title: ret.title,
        completed: ret.completed,
        createdAt: ret.createdAt,
        updatedAt: ret.updatedAt,
      }),
    },
  },
);

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
