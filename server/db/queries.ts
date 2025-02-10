import { pool } from "./index";
import { Difficulty, GetTop3UsersResponse } from "../types";

async function addUser(
  name: string,
  score: number,
  difficulty: Difficulty
): Promise<number> {
  try {
    const query = {
      text: "INSERT INTO leaderboard (name, score, difficulty) VALUES ($1, $2, $3)",
      values: [name, score, difficulty],
    };
    const res = await pool.query(query);
    return res.rowCount || 0;
  } catch (err) {
    console.error("Error adding user:", (err as Error).message);
    throw err;
  }
}

async function getTop3Users(): Promise<GetTop3UsersResponse[]> {
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

    const difficulties: Difficulty[] = [
      "Beginner",
      "Intermediate",
      "Hard",
      "Expert",
    ];
    const mappedData = difficulties
      .map((difficulty) => ({
        key: difficulty,
        list: res.rows.filter(
          (el: { difficulty: Difficulty }) => el.difficulty === difficulty
        ),
      }))
      .filter((el) => el.list.length !== 0);

    return mappedData;
  } catch (err) {
    console.error("Error getting top users:", (err as Error).message);
    throw err;
  }
}

export { addUser, getTop3Users };
