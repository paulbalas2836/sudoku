import express, { Express } from "express";
import cors from "cors";
import { pool } from "./db";
import leaderboardRoutes from "./routes/leaderboard";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app: Express = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", leaderboardRoutes);
const port = process.env.SERVER_PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  try {
    await pool.end();
    console.log("Database connection closed.");
  } catch (err) {
    console.error("Error closing database connection:", err);
  }
  process.exit(0);
});
