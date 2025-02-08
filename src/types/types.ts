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
  draftValue: number;
};

export type CellPosition = {
  column: number;
  row: number;
};

export type CellPositionWithValue = {
  value: number;
  draftValue: number;
  draft: boolean;
} & CellPosition;

export type ButtonVariant = "primary" | "secondary" | "ghost";

export type AnimatedAreasType = {
  key: string;
  index: number;
};
