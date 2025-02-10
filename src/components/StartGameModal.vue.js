import BabyIcon from "../icons/BabyIcon.vue";
import BrainIcon from "../icons/BrainIcon.vue";
import FlameIcon from "../icons/FlameIcon.vue";
import StartIcon from "../icons/StartIcon.vue";
import Modal from "../base/Modal.vue";
import BaseButton from "../base/BaseButton.vue";
const emit = defineEmits();
const difficultyLevels = [
    {
        name: "Beginner",
        classes: "bg-emerald-50 border-2 border-emerald-200 hover:bg-emerald-100",
        icon: BabyIcon,
        iconClass: "text-emerald-600",
        textClass: "text-emerald-700",
        arrowClass: "text-emerald-600",
    },
    {
        name: "Intermediate",
        classes: "bg-amber-50 border-2 border-amber-200 hover:bg-amber-100",
        icon: BrainIcon,
        iconClass: "text-amber-600",
        textClass: "text-amber-700",
        arrowClass: "text-amber-600",
    },
    {
        name: "Hard",
        classes: "bg-rose-50 border-2 border-rose-200 hover:bg-rose-100",
        icon: FlameIcon,
        iconClass: "text-rose-600",
        textClass: "text-rose-700",
        arrowClass: "text-rose-600",
    },
    {
        name: "Expert",
        classes: "bg-purple-50 border-2 border-purple-200 hover:bg-purple-100",
        icon: StartIcon,
        iconClass: "text-purple-600",
        textClass: "text-purple-700",
        arrowClass: "text-purple-600",
    },
];
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    // @ts-ignore
    /** @type { [typeof Modal, typeof Modal, ] } */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(Modal, new Modal({}));
    const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
    var __VLS_5 = {};
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { header: __VLS_thisSlot } = __VLS_4.slots;
        __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
            ...{ class: ("text-xl font-semibold text-gray-800") },
        });
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { body: __VLS_thisSlot } = __VLS_4.slots;
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("space-y-3") },
        });
        for (const [level] of __VLS_getVForSourceType((__VLS_ctx.difficultyLevels))) {
            // @ts-ignore
            /** @type { [typeof BaseButton, typeof BaseButton, ] } */ ;
            // @ts-ignore
            const __VLS_6 = __VLS_asFunctionalComponent(BaseButton, new BaseButton({
                ...{ 'onClick': {} },
                key: ((level.name)),
                variant: ("secondary"),
                ...{ class: ("group hover:scale-[1.02] transition-transform") },
            }));
            const __VLS_7 = __VLS_6({
                ...{ 'onClick': {} },
                key: ((level.name)),
                variant: ("secondary"),
                ...{ class: ("group hover:scale-[1.02] transition-transform") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_6));
            let __VLS_11;
            const __VLS_12 = {
                onClick: (...[$event]) => {
                    __VLS_ctx.$emit('select', level.name);
                }
            };
            let __VLS_8;
            let __VLS_9;
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("flex items-center p-4 rounded-xl transition-colors") },
                ...{ class: ((level.classes)) },
            });
            const __VLS_13 = ((level.icon));
            // @ts-ignore
            const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
                ...{ class: ("w-6 h-6 mr-3") },
                ...{ class: ((level.iconClass)) },
            }));
            const __VLS_15 = __VLS_14({
                ...{ class: ("w-6 h-6 mr-3") },
                ...{ class: ((level.iconClass)) },
            }, ...__VLS_functionalComponentArgsRest(__VLS_14));
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: ("flex-grow text-left font-medium") },
                ...{ class: ((level.textClass)) },
            });
            (level.name);
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: ("opacity-0 group-hover:opacity-100 transition-opacity") },
                ...{ class: ((level.arrowClass)) },
            });
            __VLS_10.slots.default;
            var __VLS_10;
        }
    }
    var __VLS_4;
    ['text-xl', 'font-semibold', 'text-gray-800', 'space-y-3', 'group', 'hover:scale-[1.02]', 'transition-transform', 'flex', 'items-center', 'p-4', 'rounded-xl', 'transition-colors', 'w-6', 'h-6', 'mr-3', 'flex-grow', 'text-left', 'font-medium', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity',];
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
            Modal: Modal,
            BaseButton: BaseButton,
            difficultyLevels: difficultyLevels,
        };
    },
    __typeEmits: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=StartGameModal.vue.js.map