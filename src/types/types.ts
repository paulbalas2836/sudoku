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
