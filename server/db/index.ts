import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";

dotenv.config();

type EnvConfig = {
  POSTGRES_MAX?: string;
  POSTGRES_MIN?: string;
  POSTGRES_IDLE_TIMEOUT?: string;
  POSTGRES_USER?: string;
  POSTGRES_PASSWORD?: string;
  POSTGRES_HOST?: string;
  POSTGRES_PORT?: string;
  POSTGRES_DB?: string;
};

const config: EnvConfig = process.env as EnvConfig;

if (
  !config.POSTGRES_USER ||
  !config.POSTGRES_PASSWORD ||
  !config.POSTGRES_HOST ||
  !config.POSTGRES_DB
) {
  throw new Error(
    "Missing required environment variables for PostgreSQL configuration."
  );
}

const poolConfig: PoolConfig = {
  max: parseInt(config.POSTGRES_MAX || "5", 10),
  min: parseInt(config.POSTGRES_MIN || "2", 10),
  idleTimeoutMillis: parseInt(config.POSTGRES_IDLE_TIMEOUT || "600000", 10),
  connectionString: `postgres://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_HOST}:${config.POSTGRES_PORT}/${config.POSTGRES_DB}`,
};

const pool = new Pool(poolConfig);

// Create leaderboard table if it doesn't exist
const createLeaderboardTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS leaderboard (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      score INT NOT NULL,
      difficulty VARCHAR(50) NOT NULL
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log("Leaderboard table is ready.");
  } catch (error) {
    console.error("Error creating leaderboard table:", error);
  }
};

// Run the query when the server starts
createLeaderboardTable();

export { pool };
