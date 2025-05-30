import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const expressStaticGzip = require("express-static-gzip");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { setupSocket } from "./lib/socket.js"; // updated import

const app = express(); // <-- create ONE app instance

const PORT = process.env.PORT;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(__dirname, "../../frontend/dist");


  app.use(
    "/",
    expressStaticGzip(distPath, {
      enableBrotli: true,
      orderPreference: ["br", "gz"],
      serveStatic: {
        extensions: ["html"],
      },
    })
  );

  // Fallback to index.html for SPA routing
  app.use((req, res, next) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}


// --- THIS IS THE CRUCIAL CHANGE: ---
const server = setupSocket(app); // pass your app to setupSocket, get server

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
