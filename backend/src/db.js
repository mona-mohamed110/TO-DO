import mongoose from "mongoose";

// Cache the connection on `globalThis` so warm serverless invocations reuse it.
const cache = (globalThis.__mongoose ??= { conn: null, promise: null });

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set.");
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 8000 })
      .catch((err) => {
        cache.promise = null; 
        throw err;
      });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}
