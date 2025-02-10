import { computed } from "vue";
const __VLS_props = defineProps();
const { variant = "primary", disabled = false } = __VLS_props;
const __VLS_emit = defineEmits();
const style = computed(() => {
    if (variant === "primary") {
        return "border-gray-300 w-full hover:opacity-50 transition-opacity";
    }
    if (variant === "ghost") {
        return "border-transparent hover:opacity-50 transition-opacity";
    }
    return "w-full rounded-xl transition border-transparent";
});
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.$emit('click');
            } },
        type: ("button"),
        ...{ class: (([__VLS_ctx.style, { 'opacity-50 !cursor-auto': disabled }])) },
        ...{ class: ("responsive-text rounded-lg border sm:px-4 py-2 px-1 text-base font-medium cursor-pointer duration-200 ease-in-out focus-visible:outline-2 focus:outline-offset-2 focus:outline-indigo-400") },
    });
    var __VLS_0 = {};
    ['opacity-50', '!cursor-auto', 'responsive-text', 'rounded-lg', 'border', 'sm:px-4', 'py-2', 'px-1', 'text-base', 'font-medium', 'cursor-pointer', 'duration-200', 'ease-in-out', 'focus-visible:outline-2', 'focus:outline-offset-2', 'focus:outline-indigo-400',];
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
            style: style,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    __typeEl: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=BaseButton.vue.js.map