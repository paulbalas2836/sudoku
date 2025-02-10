import { onMounted, onUnmounted, ref } from "vue";
import AvailableDigits from "./components/AvailableDigits.vue";
import SudokuBoard from "./components/SudokuBoard.vue";
import Topbar from "./components/Topbar.vue";
import StartGameModal from "./components/StartGameModal.vue";
import { vConfetti } from "@neoconfetti/vue";
import PauseGameModal from "./components/PauseGameModal.vue";
import Leaderboard from "./components/Leaderboard.vue";
import { Sudoku } from "./utility/sudokuGenerator";
import BaseButton from "./base/BaseButton.vue";
import { deepCopy, generateRandomNumber } from "./utility/utility";
import EndGamePopup from "./components/EndGamePopup.vue";
import { GameHistory } from "./utility/gameHistory";
const ONE_HOUR_IN_SECONDS = 3600;
const MAX_TIME_POINTS = 500;
const timer = ref(0);
const showGamePausedModal = ref(false);
const showSelectLevelModal = ref(true);
const intervalReference = ref();
const DEFAULT_HINTS = 10;
const remainingHints = ref(DEFAULT_HINTS);
const sudokuBoardInstance = new Sudoku();
const initialBoard = ref(sudokuBoardInstance.getInitialBoard());
const board = ref(sudokuBoardInstance.getInitialBoard());
const selectedLevel = ref(null);
const errorPositions = ref(new Map());
const score = ref(0);
const undoRedoLinkedList = ref(new GameHistory());
const isDraft = ref(false);
const showEndGameModal = ref(false);
const completedArea = ref({
    column: -1,
    line: -1,
    square: -1,
});
const prevCompletedAreas = ref({
    column: [],
    line: [],
    square: [],
});
const leaderboard = ref([]);
/**
 * Updates the completed area by setting its value.
 *
 * @param {AreaType} area - The area type to update.
 * @param {number} value - The value to set for the specified area.
 * @returns {void}
 */
function updateCompletedArea(area, value) {
    completedArea.value[area] = value;
}
/**
 * Updates the previous completed areas by appending a value to the specified area.
 *
 * @param {AreaType} area - The area type to update.
 * @param {number} value - The value to append to the specified area's array.
 * @returns {void}
 */
function updatePrevCompletedAreas(area, value) {
    prevCompletedAreas.value[area].push(value);
}
/**
 * Starts the game timer.
 * - Increments `timer.value` every second.
 * - Stops when reaching `ONE_HOUR_IN_SECONDS` and displays a modal.
 */
function start() {
    intervalReference.value = setInterval(() => {
        if (timer.value < ONE_HOUR_IN_SECONDS) {
            timer.value++;
        }
        else {
            clearInterval(intervalReference.value);
            showSelectLevelModal.value = true;
        }
    }, 1000);
}
/**
 * Pauses the game by stopping the timer and display the pause game modal.
 */
function pauseGame() {
    showGamePausedModal.value = true;
    //stop the timer
    clearInterval(intervalReference.value);
}
/**
 * Handles visibility changes of the document.
 * - Pauses the game if the document becomes hidden.
 */
function handleVisibilityChange() {
    if (document.hidden && !showSelectLevelModal.value) {
        pauseGame();
    }
}
/**
 * Gets the leaderboard data from the backend.
 * If there is an error retrieving data from the server, it will try to get last data stored in localstorage.
 */
async function getLeaderboard() {
    try {
        const response = await fetch("http://localhost:3000/api/top3", {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        leaderboard.value = data;
    }
    catch (e) {
        console.error("Error fetching leaderboard data:", e);
        const storedLeaderboard = localStorage.getItem("leaderboard");
        leaderboard.value = storedLeaderboard ? JSON.parse(storedLeaderboard) : [];
    }
}
onMounted(() => {
    getLeaderboard();
    document.addEventListener("visibilitychange", handleVisibilityChange);
});
onUnmounted(() => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
});
/**
 * Resumes the game by closing the pause modal and restarting the timer.
 */
function resumeGame() {
    showGamePausedModal.value = false;
    //create a new timer
    start();
}
/**
 * Starts a new Sudoku game by resetting relevant game states.
 */
function startNewGame() {
    showSelectLevelModal.value = true;
    showEndGameModal.value = false;
    //reset data
    showGamePausedModal.value = false;
    timer.value = 0;
    remainingHints.value = DEFAULT_HINTS;
    prevCompletedAreas.value = {
        column: [],
        line: [],
        square: [],
    };
    completedArea.value = {
        column: -1,
        line: -1,
        square: -1,
    };
    isDraft.value = false;
    score.value = 0;
    errorPositions.value.clear();
    undoRedoLinkedList.value = new GameHistory();
    getLeaderboard();
}
/**
 * Uses a hint to reveal a correct number in the Sudoku board.
 * Reduces the number of available hints and updates the score.
 */
function takeHint() {
    if (remainingHints.value <= 0) {
        return;
    }
    remainingHints.value--;
    //take a random cell position and we search for the next/previous open or wrong cell and correct it
    const randomRow = generateRandomNumber(0, 8);
    const randomCol = generateRandomNumber(0, 8);
    // Try correcting the next available cell (forward search)
    if (!correctNextCell(randomRow, randomCol, true)) {
        // If nothing found, try correcting in the reverse direction
        correctNextCell(randomRow, randomCol, false);
    }
    // update score
    score.value -= DEFAULT_HINTS - remainingHints.value + 2;
}
/**
 * Find the next or previous open/wrong cell and correct it.
 * @param {number} startRow - The row index to start searching from.
 * @param {number} startCol - The column index to start searching from.
 * @param {boolean} forward - Whether to search forward (true) or backward (false).
 * @returns {boolean} - Returns true if a correction was made, false otherwise.
 */
function correctNextCell(startRow, startCol, forward = true) {
    if (!board.value)
        return true;
    const rowStep = forward ? 1 : -1;
    const colStep = forward ? 1 : -1;
    for (let i = startRow; i >= 0 && i < 9; i += rowStep) {
        for (let j = startCol; j >= 0 && j < 9; j += colStep) {
            const key = `${i}${j}`;
            const hasError = errorPositions.value.has(key);
            if (board.value[i][j].value === 0 || hasError) {
                board.value[i][j].value = initialBoard.value[i][j].value;
                board.value[i][j].hint = true;
                if (hasError) {
                    errorPositions.value.delete(key);
                }
                return true;
            }
        }
    }
    return false;
}
/**
 * Selects the difficulty level for the game, generates a new Sudoku board,
 * resets the timer, and starts a new game.
 * @param {DifficultyName} level - The selected difficulty level for the Sudoku game.
 */
function selectLevel(level) {
    selectedLevel.value = level;
    // generate a new sudoku board based on the selected level
    sudokuBoardInstance.generateSudokuBoard(level);
    initialBoard.value = deepCopy(sudokuBoardInstance.getInitialBoard());
    board.value = deepCopy(sudokuBoardInstance.getBoard());
    //reset time and create a new timer
    timer.value = 0;
    start();
    showSelectLevelModal.value = false;
}
/**
 * Adds an error to the errorPositions map if the value is incorrect.
 * @param {number} value - The value entered in the cell.
 * @param {number} row - The row index of the cell.
 * @param {number} column - The column index of the cell.
 */
function addError(value, row, column) {
    if (value === 0) {
        return;
    }
    if (value !== initialBoard.value[row][column].value) {
        const key = `${row}${column}`;
        errorPositions.value.set(key, { row, column });
    }
}
/**
 * Clears an error from the errorPositions map for the specified cell.
 * @param {number} row - The row index of the cell.
 * @param {number} column - The column index of the cell.
 */
function clearError(row, column) {
    const key = `${row}${column}`;
    if (errorPositions.value.has(key)) {
        errorPositions.value.delete(key);
    }
}
/**
 * Updates the Sudoku board with a new value, and manages draft and undo/redo operations.
 * Also updates the score based on whether the entered value is correct or not.
 * @param {number} row - The row index of the cell.
 * @param {number} column - The column index of the cell.
 * @param {number} value - The value to be inserted into the cell.
 */
function updateSudokuBoard(row, column, value) {
    // no need to add draft value if the board already has a value
    if (board.value[row][column].value !== 0 && isDraft.value) {
        return;
    }
    const draftValue = isDraft.value ? value : 0;
    const actualValue = isDraft.value ? 0 : value;
    //we add the cell to the undo linked list
    undoRedoLinkedList.value.addNode(actualValue, row, column, draftValue, isDraft.value, board.value[row][column].value, board.value[row][column].draftValue);
    updateBoard(actualValue, row, column, draftValue, isDraft.value);
    // we don't want to change the score or add errors if it's in draft mode
    if (isDraft.value) {
        return;
    }
    if (value === initialBoard.value[row][column].value) {
        // 5 points / right guess
        score.value += 5;
        //clear error map if any error
        clearError(row, column);
        return;
    }
    // add error if any mistake has been found
    addError(value, row, column);
    // -1 point / mistake
    score.value--;
}
/**
 * Updates the value of a cell on the board.
 * @param {number} value - The new value to be set in the cell.
 * @param {number} row - The row index of the cell.
 * @param {number} column - The column index of the cell.
 * @param {number} draftValue - The value to be set if in draft mode.
 * @param {boolean} draft - Indicates if the value is a draft.
 */
function updateBoard(value, row, column, draftValue, draft) {
    board.value[row][column].value = value;
    if (draft) {
        board.value[row][column].draftValue = draftValue;
    }
}
/**
 * Undoes the last action by reverting the board to its previous state.
 * If there is no action to undo, the function does nothing.
 */
function undoAction() {
    if (!undoRedoLinkedList.value.canUndo()) {
        return;
    }
    const prevNode = undoRedoLinkedList.value.undo();
    if (!prevNode) {
        return;
    }
    const { row, column, draft, prevValue, prevDraft } = prevNode;
    //we clear the board, in case it's a draft we will clear the draft value too, we always clear the actual value since you cannot add a draft value over it.
    updateBoard(prevValue, row, column, prevDraft, draft);
    // we clear the error if we had any on that position.
    clearError(row, column);
    if (prevValue !== 0) {
        addError(prevValue, row, column);
    }
}
/**
 * Redoes the last undone action by restoring the board to its next state.
 * If there is no action to redo, the function does nothing.
 */
function redoAction() {
    if (!undoRedoLinkedList.value.canRedo()) {
        return;
    }
    const nextValue = undoRedoLinkedList.value.redo();
    if (!nextValue) {
        return;
    }
    const { value, row, column, draftValue, draft } = nextValue;
    const actualValue = draft ? 0 : value;
    const newDraftValue = draft ? draftValue : 0;
    updateBoard(actualValue, row, column, newDraftValue, draft);
    clearError(row, column);
    // Display error from the redo value if any.
    addError(value, row, column);
}
/**
 * Toggles between draft and regular modes for editing the board.
 */
function toggleDraftMode() {
    isDraft.value = !isDraft.value;
}
/**
 * Ends the current game and displays the end game modal with the final score.
 */
function endGame() {
    showEndGameModal.value = true;
    score.value += MAX_TIME_POINTS - timer.value;
    //stop the timer
    clearInterval(intervalReference.value);
}
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("justify-center flex flex-col gap-4 md:gap-8") },
    });
    if (__VLS_ctx.showEndGameModal) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("absolute top-0 left-1/2") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalDirective(__VLS_directives.vConfetti)(null, { ...__VLS_directiveBindingRestFields, value: ({ particleCount: 200, force: 0.3, duration: 5000 }) }, null, null);
    }
    // @ts-ignore
    /** @type { [typeof Topbar, typeof Topbar, ] } */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(Topbar, new Topbar({
        ...{ 'onTakeHint': {} },
        ...{ 'onPauseGame': {} },
        remainingHints: ((__VLS_ctx.remainingHints)),
        score: ((__VLS_ctx.score)),
        selectedLevel: ((__VLS_ctx.selectedLevel)),
        timer: ((__VLS_ctx.timer)),
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onTakeHint': {} },
        ...{ 'onPauseGame': {} },
        remainingHints: ((__VLS_ctx.remainingHints)),
        score: ((__VLS_ctx.score)),
        selectedLevel: ((__VLS_ctx.selectedLevel)),
        timer: ((__VLS_ctx.timer)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_5;
    const __VLS_6 = {
        onTakeHint: (__VLS_ctx.takeHint)
    };
    const __VLS_7 = {
        onPauseGame: (__VLS_ctx.pauseGame)
    };
    let __VLS_2;
    let __VLS_3;
    var __VLS_4;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("flex gap-4") },
    });
    // @ts-ignore
    /** @type { [typeof BaseButton, typeof BaseButton, ] } */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(BaseButton, new BaseButton({
        ...{ 'onClick': {} },
        variant: ("primary"),
        disabled: ((!__VLS_ctx.undoRedoLinkedList.canUndo())),
    }));
    const __VLS_9 = __VLS_8({
        ...{ 'onClick': {} },
        variant: ("primary"),
        disabled: ((!__VLS_ctx.undoRedoLinkedList.canUndo())),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    let __VLS_13;
    const __VLS_14 = {
        onClick: (__VLS_ctx.undoAction)
    };
    let __VLS_10;
    let __VLS_11;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_12.slots.default;
    var __VLS_12;
    // @ts-ignore
    /** @type { [typeof BaseButton, typeof BaseButton, ] } */ ;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(BaseButton, new BaseButton({
        ...{ 'onClick': {} },
        variant: ("primary"),
        disabled: ((!__VLS_ctx.undoRedoLinkedList.canRedo())),
    }));
    const __VLS_16 = __VLS_15({
        ...{ 'onClick': {} },
        variant: ("primary"),
        disabled: ((!__VLS_ctx.undoRedoLinkedList.canRedo())),
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    let __VLS_20;
    const __VLS_21 = {
        onClick: (__VLS_ctx.redoAction)
    };
    let __VLS_17;
    let __VLS_18;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_19.slots.default;
    var __VLS_19;
    // @ts-ignore
    /** @type { [typeof BaseButton, typeof BaseButton, ] } */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(BaseButton, new BaseButton({
        ...{ 'onClick': {} },
        variant: ("primary"),
    }));
    const __VLS_23 = __VLS_22({
        ...{ 'onClick': {} },
        variant: ("primary"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    let __VLS_27;
    const __VLS_28 = {
        onClick: (__VLS_ctx.toggleDraftMode)
    };
    let __VLS_24;
    let __VLS_25;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.isDraft ? "On" : "Off");
    __VLS_26.slots.default;
    var __VLS_26;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("flex gap-2 sm:gap-8 sm:flex-row flex-col") },
    });
    // @ts-ignore
    /** @type { [typeof SudokuBoard, typeof SudokuBoard, ] } */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(SudokuBoard, new SudokuBoard({
        ...{ 'onUpdateCompletedArea': {} },
        ...{ 'onUpdatePrevCompletedAreas': {} },
        ...{ 'onUpdateBoard': {} },
        board: ((__VLS_ctx.board)),
        initialBoard: ((__VLS_ctx.initialBoard)),
        errorPositions: ((__VLS_ctx.errorPositions)),
        completedArea: ((__VLS_ctx.completedArea)),
        prevCompletedAreas: ((__VLS_ctx.prevCompletedAreas)),
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onUpdateCompletedArea': {} },
        ...{ 'onUpdatePrevCompletedAreas': {} },
        ...{ 'onUpdateBoard': {} },
        board: ((__VLS_ctx.board)),
        initialBoard: ((__VLS_ctx.initialBoard)),
        errorPositions: ((__VLS_ctx.errorPositions)),
        completedArea: ((__VLS_ctx.completedArea)),
        prevCompletedAreas: ((__VLS_ctx.prevCompletedAreas)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_34;
    const __VLS_35 = {
        onUpdateCompletedArea: (__VLS_ctx.updateCompletedArea)
    };
    const __VLS_36 = {
        onUpdatePrevCompletedAreas: (__VLS_ctx.updatePrevCompletedAreas)
    };
    const __VLS_37 = {
        onUpdateBoard: (__VLS_ctx.updateSudokuBoard)
    };
    let __VLS_31;
    let __VLS_32;
    var __VLS_33;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("flex flex-col gap-2 sm:gap-4") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("hidden sm:block") },
    });
    // @ts-ignore
    /** @type { [typeof Leaderboard, typeof Leaderboard, ] } */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(Leaderboard, new Leaderboard({
        leaderboard: ((__VLS_ctx.leaderboard)),
    }));
    const __VLS_39 = __VLS_38({
        leaderboard: ((__VLS_ctx.leaderboard)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    // @ts-ignore
    /** @type { [typeof AvailableDigits, typeof AvailableDigits, ] } */ ;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent(AvailableDigits, new AvailableDigits({
        ...{ 'onEndGame': {} },
        board: ((__VLS_ctx.board)),
        initialBoard: ((__VLS_ctx.initialBoard)),
    }));
    const __VLS_44 = __VLS_43({
        ...{ 'onEndGame': {} },
        board: ((__VLS_ctx.board)),
        initialBoard: ((__VLS_ctx.initialBoard)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    let __VLS_48;
    const __VLS_49 = {
        onEndGame: (__VLS_ctx.endGame)
    };
    let __VLS_45;
    let __VLS_46;
    var __VLS_47;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("sm:hidden block") },
    });
    // @ts-ignore
    /** @type { [typeof Leaderboard, typeof Leaderboard, ] } */ ;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(Leaderboard, new Leaderboard({
        leaderboard: ((__VLS_ctx.leaderboard)),
    }));
    const __VLS_51 = __VLS_50({
        leaderboard: ((__VLS_ctx.leaderboard)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    if (__VLS_ctx.showSelectLevelModal) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        // @ts-ignore
        /** @type { [typeof StartGameModal, typeof StartGameModal, ] } */ ;
        // @ts-ignore
        const __VLS_55 = __VLS_asFunctionalComponent(StartGameModal, new StartGameModal({
            ...{ 'onSelect': {} },
        }));
        const __VLS_56 = __VLS_55({
            ...{ 'onSelect': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_55));
        let __VLS_60;
        const __VLS_61 = {
            onSelect: (__VLS_ctx.selectLevel)
        };
        let __VLS_57;
        let __VLS_58;
        var __VLS_59;
    }
    if (__VLS_ctx.showGamePausedModal) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        // @ts-ignore
        /** @type { [typeof PauseGameModal, typeof PauseGameModal, ] } */ ;
        // @ts-ignore
        const __VLS_62 = __VLS_asFunctionalComponent(PauseGameModal, new PauseGameModal({
            ...{ 'onResumePlay': {} },
            ...{ 'onStartNew': {} },
        }));
        const __VLS_63 = __VLS_62({
            ...{ 'onResumePlay': {} },
            ...{ 'onStartNew': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_62));
        let __VLS_67;
        const __VLS_68 = {
            onResumePlay: (__VLS_ctx.resumeGame)
        };
        const __VLS_69 = {
            onStartNew: (__VLS_ctx.startNewGame)
        };
        let __VLS_64;
        let __VLS_65;
        var __VLS_66;
    }
    if (__VLS_ctx.showEndGameModal) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        // @ts-ignore
        /** @type { [typeof EndGamePopup, typeof EndGamePopup, ] } */ ;
        // @ts-ignore
        const __VLS_70 = __VLS_asFunctionalComponent(EndGamePopup, new EndGamePopup({
            ...{ 'onStartNew': {} },
            score: ((__VLS_ctx.score)),
            difficulty: ((__VLS_ctx.selectedLevel)),
        }));
        const __VLS_71 = __VLS_70({
            ...{ 'onStartNew': {} },
            score: ((__VLS_ctx.score)),
            difficulty: ((__VLS_ctx.selectedLevel)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_70));
        let __VLS_75;
        const __VLS_76 = {
            onStartNew: (__VLS_ctx.startNewGame)
        };
        let __VLS_72;
        let __VLS_73;
        var __VLS_74;
    }
    ['justify-center', 'flex', 'flex-col', 'gap-4', 'md:gap-8', 'absolute', 'top-0', 'left-1/2', 'flex', 'gap-4', 'flex', 'gap-2', 'sm:gap-8', 'sm:flex-row', 'flex-col', 'flex', 'flex-col', 'gap-2', 'sm:gap-4', 'hidden', 'sm:block', 'sm:hidden', 'block',];
    var __VLS_slots;
    var $slots;
    let __VLS_inheritedAttrs;
    var $attrs;
    const __VLS_refs = {};
    var $refs;
    var $el;
    return {
        attrs: {},
        slots: __VLS_slots,
        refs: $refs,
        rootEl: $el,
    };
}
;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AvailableDigits: AvailableDigits,
            SudokuBoard: SudokuBoard,
            Topbar: Topbar,
            StartGameModal: StartGameModal,
            vConfetti: vConfetti,
            PauseGameModal: PauseGameModal,
            Leaderboard: Leaderboard,
            BaseButton: BaseButton,
            EndGamePopup: EndGamePopup,
            timer: timer,
            showGamePausedModal: showGamePausedModal,
            showSelectLevelModal: showSelectLevelModal,
            remainingHints: remainingHints,
            initialBoard: initialBoard,
            board: board,
            selectedLevel: selectedLevel,
            errorPositions: errorPositions,
            score: score,
            undoRedoLinkedList: undoRedoLinkedList,
            isDraft: isDraft,
            showEndGameModal: showEndGameModal,
            completedArea: completedArea,
            prevCompletedAreas: prevCompletedAreas,
            leaderboard: leaderboard,
            updateCompletedArea: updateCompletedArea,
            updatePrevCompletedAreas: updatePrevCompletedAreas,
            pauseGame: pauseGame,
            resumeGame: resumeGame,
            startNewGame: startNewGame,
            takeHint: takeHint,
            selectLevel: selectLevel,
            updateSudokuBoard: updateSudokuBoard,
            undoAction: undoAction,
            redoAction: redoAction,
            toggleDraftMode: toggleDraftMode,
            endGame: endGame,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=App.vue.js.map