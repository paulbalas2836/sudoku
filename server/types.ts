export type Difficulty = "Beginner" | "Intermediate" | "Hard" | "Expert";

export type User = {
  name: string;
  score: number;
  difficulty: Difficulty;
};

export type GetTop3UsersResponse = {
  key: Difficulty;
  list: { name: string; score: number; difficulty: Difficulty }[];
};

export type AddUserRequest = {
  name: string;
  score: number;
  difficulty: Difficulty;
};

export type AddUserResponse = {
  message: string;
};

export type ErrorResponse = {
  error: string;
};
