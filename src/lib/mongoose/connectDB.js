import mongoose from "mongoose";
import config from "@/config/env";

(async () => {
  try {
    const uri = config.mongodb_uri;
    if (!uri) throw new Error("MONGODB_URI is not defined");

    if (process.env.NODE_ENV === "development") {
      if (!global.mongoose) global.mongoose = { client: null, promise: null };
      const cached = global.mongoose;

      if (cached.client) {
        console.log("=> Using existing database connection");
        return cached.client;
      }

      if (!cached.promise) {
        cached.promise = mongoose.connect(uri, {}).then((client) => {
          if (client.connection.readyState === 1) {
            console.log(`=> New DB connection at ${client.connection.host}`);
            return client;
          }

          throw new Error("Failed to connect to MongoDB");
        });
      }

      cached.client = await cached.promise;
      return cached.client;
    }

    // Production mode: fresh connection
    const client = await mongoose.connect(uri, {});

    if (client.connection.readyState === 1) {
      console.log(`=> Connected to DB at ${client.connection.host}`);
      return client;
    }

    throw new Error("Failed to connect to MongoDB");
  } catch (error) {
    console.error("Database connection error:", error.message);
    return null;
  }
})();
