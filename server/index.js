const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Server Config
dotenv.config();

const poolConfig = {
  max: parseInt(process.env.POSTGRES_MAX || "5", 10),
  min: parseInt(process.env.POSTGRES_MIN || "2", 10),
  idleTimeoutMillis: parseInt(
    process.env.POSTGRES_IDLE_TIMEOUT || "600000",
    10
  ),
  connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
};
const pool = new Pool(poolConfig);

// Function to add a user
async function addUser(name, score, difficulty) {
  try {
    const query = {
      text: "INSERT INTO leaderboard (name, score, difficulty) VALUES ($1, $2, $3)",
      values: [name, score, difficulty],
    };
    const res = await pool.query(query);
    return res.rowCount;
  } catch (err) {
    console.error("Error adding user:", err.message);
    throw err;
  }
}

// Function to get top 3 users for each difficulty
async function getTop3Users() {
  try {
    const query = {
      text: `
        SELECT name, score, difficulty
        FROM (
          SELECT
            name,
            score,
            difficulty,
            RANK() OVER (PARTITION BY difficulty ORDER BY score DESC) AS rank
          FROM leaderboard
        ) ranked
        WHERE rank <= 3
        AND difficulty IN ('Beginner', 'Intermediate', 'Hard', 'Expert')
        ORDER BY difficulty, rank;
      `,
    };
    const res = await pool.query(query);

    const difficulties = ["Beginner", "Intermediate", "Hard", "Expert"];
    const mappedData = difficulties
      .map((difficulty) => ({
        key: difficulty,
        list: res.rows.filter((el) => el.difficulty === difficulty),
      }))
      .filter((el) => el.list.length !== 0);

    return mappedData;
  } catch (err) {
    console.error("Error getting top users:", err.message);
    throw err;
  }
}

// API Route: Get top 3 users
app.get("/api/top3", async (req, res) => {
  try {
    const topUsers = await getTop3Users();
    res.json(topUsers);
  } catch (error) {
    console.error("Error in /api/top3 route:", error);
    res.status(500).json({ error: "Failed to get top users" });
  }
});

// API Route: Set new leaderboard entry
app.post("/api/add-user", async (req, res) => {
  try {
    const { name, score, difficulty } = req.body;

    await addUser(name, score, difficulty);

    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error("Error in /api/add-user route:", error);
    res.status(500).json({ error: "Failed to get top users" });
  }
});

// Start the server
app.listen(process.env.SERVER_PORT, async () => {
  console.log(
    `Server listening on http://localhost:${process.env.SERVER_PORT}`
  );
});

process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});
