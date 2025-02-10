# Sudoku Rules

- **Unique Solutions**:  
  All boards have unique solutions, so each error will be displayed immediately.

- **Hint Values**:  
  You cannot change hint values on the board.

- **Draft Values**:  
  - Draft values can only be added over empty squares or other draft values.  
  - You cannot add a draft value over a normal value.

- **Redo and Undo**:  
  - Both normal and draft values are supported by the redo and undo functionalities.

- **Error Penalty**:  
  Each error results in a **-1 point** penalty.

- **Hint Penalty**:  
  Using a hint subtracts **(3 - number of hints used) points**.

- **Correct Guesses**:  
  Each correct guess awards **+5 points**.

- **Completion Bonus**:  
  After completing the game, you receive an additional bonus of **500 - current_play_time_in_seconds points**.
