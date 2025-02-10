import { ref, watch } from "vue";
import gsap from "gsap";
const __VLS_props = defineProps();
const { board, errorPositions, initialBoard, completedArea, prevCompletedAreas, } = __VLS_props;
const emit = defineEmits();
/**
 * Determines the background color of a Sudoku cell based on its state.
 * @param {number} row - The row index of the cell.
 * @param {number} column - The column index of the cell.
 * @param {Cell} cell - The cell object containing its properties.
 * @returns {string} - A Tailwind CSS class representing the background color.
 */
function getBackgroundColor(row, column, cell) {
    if (cell.hint) {
        return "bg-blue-200";
    }
    if (cell.initial) {
        return "bg-gray-100";
    }
    if (errorPositions.has(`${row}${column}`)) {
        return "border border-red-500 !bg-red-300";
    }
    return "";
}
/**
 * Determines the border style for a Sudoku cell based on its position.
 * @param {number} row - The row index of the cell.
 * @param {number} column - The column index of the cell.
 * @returns {string} - A Tailwind CSS class representing the border style.
 */
function getBorderStyle(row, column) {
    let dynamicClass = "";
    if (column === 1) {
        dynamicClass = `${dynamicClass} border-t-2 border-t-black`;
    }
    if (row === 9) {
        dynamicClass = `${dynamicClass} border-r-2 border-r-black`;
    }
    if (row === 1) {
        dynamicClass = `${dynamicClass} border-l-2 border-l-black`;
    }
    if (column === 9) {
        dynamicClass = `${dynamicClass} border-b-2 border-b-black`;
    }
    if (row === 3 || row === 6) {
        dynamicClass = `${dynamicClass} border-r-2 border-r-gray-400`;
    }
    if (column === 3 || column === 6) {
        dynamicClass = `${dynamicClass} border-b-2 border-b-gray-400`;
    }
    return dynamicClass;
}
const cells = ref([]);
watch(() => board, () => {
    //grid layout will inverse how we see the board
    for (let i = 0; i < board.length; ++i) {
        if (!prevCompletedAreas.column.length ||
            !prevCompletedAreas.column.includes(i)) {
            const columnList = board[i]
                .map((cell, j) => cell.value === initialBoard[i][j].value ? i * 9 + j : null)
                .filter((value) => value !== null);
            if (columnList.length === 9) {
                emit("update-completed-area", "column", i);
            }
        }
        if (!prevCompletedAreas.line.length ||
            !prevCompletedAreas.line.includes(i)) {
            const lineList = board
                .map((row, j) => row[i].value === initialBoard[j][i].value ? j * 9 + i : null)
                .filter((value) => value !== null);
            if (lineList.length === 9) {
                emit("update-completed-area", "line", i);
            }
        }
        if (!prevCompletedAreas.square.length ||
            !prevCompletedAreas.square.includes(i)) {
            const startRow = Math.floor(i / 3) * 3;
            const startCol = (i % 3) * 3;
            let isSquareMatching = true;
            // Compare each cell in the 3x3 square
            for (let j = 0; j < 3 && isSquareMatching; ++j) {
                for (let k = 0; k < 3 && isSquareMatching; ++k) {
                    const row = startRow + j;
                    const col = startCol + k;
                    if (board[row][col].value !== initialBoard[row][col].value) {
                        isSquareMatching = false;
                    }
                }
            }
            if (isSquareMatching) {
                emit("update-completed-area", "square", i);
            }
        }
    }
}, { deep: true });
/**
 * Animates the sudoku board in sequence upon line, column or scoare completion.
 *
 * @param {HTMLDivElement[]} list - The list of div elements to animate.
 * @param {AreaType} area - The area type associated with the animation.
 * @param {number} value - The value to emit with the event.
 * @fires update-prev-completed-areas - Emits the updated area and value.
 */
function animate(list, area, value) {
    const timeline = gsap.timeline({ paused: true });
    list.forEach((cell) => {
        timeline.to(cell, {
            duration: 0.2,
            onStart: () => cell.classList.add("!bg-green-200", "text-green-800"),
        });
    });
    timeline.to(list, {
        onStart: () => {
            list.forEach((cell) => {
                cell.classList.remove("!bg-green-200", "text-green-800");
            });
        },
        duration: 0.5,
    });
    timeline.play();
    emit("update-prev-completed-areas", area, value);
}
watch(() => completedArea.line, (newValue) => {
    const filteredCells = [];
    for (let i = newValue; i < cells.value.length; i += 9) {
        filteredCells.push(cells.value[i]);
    }
    animate(filteredCells, "line", newValue);
});
watch(() => completedArea.column, (newValue) => {
    const filteredCells = [];
    for (let i = newValue * 9; i < newValue * 9 + 9; ++i) {
        filteredCells.push(cells.value[i]);
    }
    animate(filteredCells, "column", newValue);
});
watch(() => completedArea.square, (newValue) => {
    const filteredCells = [];
    // Calculate the starting position of the 3x3 square
    const squareRow = Math.floor(newValue / 3);
    const squareCol = newValue % 3;
    const startingPoint = squareRow * 27 + squareCol * 3;
    // Iterate over the 3x3 square
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cellIndex = startingPoint + row * 9 + col;
            if (cellIndex < cells.value.length) {
                filteredCells.push(cells.value[cellIndex]);
            }
        }
    }
    animate(filteredCells, "square", newValue);
});
/**
 * Handles user input to fill a Sudoku cell with a number.
 * @param {KeyboardEvent} e - The keyboard event triggered by the user.
 * @param {number} row - The row index of the cell.
 * @param {number} column - The column index of the cell.
 * @param {Cell} cell - The cell object containing its properties.
 * @fires update-board - Emits an event to update the board with the entered number.
 */
function fillCell(e, row, column, cell) {
    if (cell.initial || cell.hint) {
        return;
    }
    const parsedKey = Number(e.key);
    if (!parsedKey) {
        return;
    }
    emit("update-board", row, column, parsedKey);
}
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("grid grid-cols-9 bg-white rounded-lg shadow-md") },
    });
    for (const [row, indexRow] of __VLS_getVForSourceType((board))) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: ((indexRow)),
        });
        for (const [cell, indexColumn] of __VLS_getVForSourceType((row))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ onKeypress: ((e) => __VLS_ctx.fillCell(e, indexRow, indexColumn, cell)) },
                ref: ("cells"),
                key: ((`${indexColumn}-${indexRow}`)),
                ...{ class: ("border-r border-b border-gray-200 hover:bg-gray-200 transition-all ease-in-out duration-200 min-w-6 sm:w-10 md:w-14 max-w-14 aspect-square flex items-center justify-center focus:border-2 focus:border-blue-500 focus:bg-blue-200") },
                ...{ class: (([
                        __VLS_ctx.getBorderStyle(indexRow + 1, indexColumn + 1),
                        __VLS_ctx.getBackgroundColor(indexRow, indexColumn, cell),
                    ])) },
                tabindex: ((cell.initial || cell.hint ? -1 : 0)),
            });
            // @ts-ignore navigation for `const cells = ref()`
            /** @type { typeof __VLS_ctx.cells } */ ;
            if (cell.value !== 0 || cell.draftValue !== 0) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: (({ italic: cell.value === 0 && cell.draftValue })) },
                    ...{ class: ("text-sm md:text-xl text-center") },
                });
                (cell.value !== 0 ? cell.value : cell.draftValue);
            }
        }
    }
    ['grid', 'grid-cols-9', 'bg-white', 'rounded-lg', 'shadow-md', 'border-r', 'border-b', 'border-gray-200', 'hover:bg-gray-200', 'transition-all', 'ease-in-out', 'duration-200', 'min-w-6', 'sm:w-10', 'md:w-14', 'max-w-14', 'aspect-square', 'flex', 'items-center', 'justify-center', 'focus:border-2', 'focus:border-blue-500', 'focus:bg-blue-200', 'italic', 'text-sm', 'md:text-xl', 'text-center',];
    var __VLS_slots;
    var $slots;
    let __VLS_inheritedAttrs;
    var $attrs;
    const __VLS_refs = {
        'cells': [__VLS_nativeElements['div']],
    };
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
            getBackgroundColor: getBackgroundColor,
            getBorderStyle: getBorderStyle,
            cells: cells,
            fillCell: fillCell,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    __typeRefs: {},
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=SudokuBoard.vue.js.map