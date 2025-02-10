import { computed, watch } from "vue";
const __VLS_props = defineProps();
const { board, initialBoard } = __VLS_props;
const emit = defineEmits();
const availableDigits = computed(() => {
    const list = new Array(9).fill(9);
    if (!board)
        return list;
    board.forEach((row, rowIndex) => row.forEach((cell, columnIndex) => {
        if (cell.value !== 0 &&
            initialBoard[rowIndex][columnIndex].value === cell.value)
            list[cell.value - 1]--;
    }));
    return list;
});
watch(() => availableDigits, () => {
    if (availableDigits.value.every((el) => el === 0)) {
        emit("end-game");
    }
}, { deep: true });
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("flex flex-col gap-4 mt-auto") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: ("self-start text-gray-600 font-medium") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("flex gap-3 flex-wrap") },
    });
    for (const [remaining, index] of __VLS_getVForSourceType((__VLS_ctx.availableDigits))) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: ((index)),
            ...{ class: ("w-10 md:w-16 sm:w-14 aspect-square rounded-lg bg-white border border-gray-300 transition duration-200 flex items-center justify-center") },
            ...{ class: (({ 'opacity-50 cursor-default': remaining === 0 })) },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: ("font-bold text-xl") },
            ...{ class: (({
                    'text-gray-400': remaining === 0,
                    'text-gray-800': remaining > 0,
                })) },
        });
        (index + 1);
    }
    ['flex', 'flex-col', 'gap-4', 'mt-auto', 'self-start', 'text-gray-600', 'font-medium', 'flex', 'gap-3', 'flex-wrap', 'w-10', 'md:w-16', 'sm:w-14', 'aspect-square', 'rounded-lg', 'bg-white', 'border', 'border-gray-300', 'transition', 'duration-200', 'flex', 'items-center', 'justify-center', 'opacity-50', 'cursor-default', 'font-bold', 'text-xl', 'text-gray-400', 'text-gray-800',];
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
            availableDigits: availableDigits,
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
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=AvailableDigits.vue.js.map