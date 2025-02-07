import type { Component } from "vue";

export type DifficultyName = "Beginner" | "Intermediate" | "Hard" | "Expert";
export interface DifficultyLevel {
  name: DifficultyName;
  classes: string;
  icon: Component;
  iconClass: string;
  textClass: string;
  arrowClass: string;
}

export type Cell = {
  value: number;
  initial: boolean;
  hint: boolean;
};

export type ErrorPositon = {
  column: number;
  row: number;
};
