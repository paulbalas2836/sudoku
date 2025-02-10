import express from "express";
import {
  GetTop3UsersResponse,
  ErrorResponse,
  AddUserRequest,
  AddUserResponse,
} from "../types";
import { getTop3Users, addUser } from "../db/queries";
const router = express.Router();

router.get(
  "/top3",
  async (
    req,
    res: express.Response<GetTop3UsersResponse[] | ErrorResponse>
  ) => {
    try {
      const topUsers = await getTop3Users();
      res.json(topUsers);
    } catch (error) {
      console.error("Error in /api/top3 route:", error);
      res.status(500).json({ error: "Failed to get top users" });
    }
  }
);

router.post(
  "/add-user",
  async (
    req: express.Request<{}, {}, AddUserRequest>,
    res: express.Response<AddUserResponse | ErrorResponse>
  ) => {
    try {
      const { name, score, difficulty } = req.body;
      await addUser(name, score, difficulty);
      res.status(201).json({ message: "User added successfully" });
    } catch (error) {
      console.error("Error in /api/add-user route:", error);
      res.status(500).json({ error: "Failed to add user" });
    }
  }
);

export default router;
