import TrophyIcon from "../icons/TrophyIcon.vue";
const __VLS_props = defineProps();
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("flex flex-col gap-4 bg-gray-100 p-4 rounded-lg shadow-md") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("flex gap-2 flex-col items-center") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("flex") },
    });
    // @ts-ignore
    /** @type { [typeof TrophyIcon, typeof TrophyIcon, ] } */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(TrophyIcon, new TrophyIcon({}));
    const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: ("underline responsive-text") },
    });
    if (__VLS_ctx.leaderboard.length) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        for (const [sections] of __VLS_getVForSourceType((__VLS_ctx.leaderboard))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: ((sections.key)),
                ...{ class: ("flex flex-col") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
                ...{ class: ("text-xs sm:text-sm md:text-base font-semibold text-gray-700 mb-2") },
            });
            (sections.key);
            for (const [top, index] of __VLS_getVForSourceType((sections.list))) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    key: ((`${top.name}_${top.score}_${index}`)),
                    ...{ class: ("text-xs sm:text-sm md:text-base") },
                });
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (index + 1);
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (top.name);
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (top.score);
            }
        }
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    }
    ['flex', 'flex-col', 'gap-4', 'bg-gray-100', 'p-4', 'rounded-lg', 'shadow-md', 'flex', 'gap-2', 'flex-col', 'items-center', 'flex', 'underline', 'responsive-text', 'flex', 'flex-col', 'text-xs', 'sm:text-sm', 'md:text-base', 'font-semibold', 'text-gray-700', 'mb-2', 'text-xs', 'sm:text-sm', 'md:text-base',];
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
            TrophyIcon: TrophyIcon,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Leaderboard.vue.js.map