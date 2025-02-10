import { computed } from "vue";
import BaseButton from "../base/BaseButton.vue";
import PauseIcon from "../icons/PauseIcon.vue";
import LightBuldIcon from "../icons/LightBuldIcon.vue";
const __VLS_props = defineProps();
const { selectedLevel, timer, score, remainingHints } = __VLS_props;
const __VLS_emit = defineEmits();
const formatTimer = computed(() => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    let formattedMinutes = `${minutes}`;
    if (minutes < 10) {
        formattedMinutes = `0${formattedMinutes}`;
    }
    let formattedSeconds = `${seconds}`;
    if (seconds < 10) {
        formattedSeconds = `0${seconds}`;
    }
    return `${formattedMinutes}:${formattedSeconds}`;
});
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("w-full py-4 flex justify-between border-y border-y-gray-200 items-center sm:px-8 px-2 gap-x-2") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: ("responsive-text font-semibold text-gray-700") },
    });
    (selectedLevel ?? "-");
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: ("responsive-text font-semibold text-gray-700") },
    });
    (score);
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("flex items-center sm:gap-x-4 gap-x-2") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: ("responsive-text font-semibold text-gray-700") },
    });
    (__VLS_ctx.formatTimer);
    // @ts-ignore
    /** @type { [typeof BaseButton, typeof BaseButton, ] } */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(BaseButton, new BaseButton({
        ...{ 'onClick': {} },
        'aria-label': ("pause game"),
        variant: ("ghost"),
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onClick': {} },
        'aria-label': ("pause game"),
        variant: ("ghost"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_5;
    const __VLS_6 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$emit('pause-game');
        }
    };
    let __VLS_2;
    let __VLS_3;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    // @ts-ignore
    /** @type { [typeof PauseIcon, typeof PauseIcon, ] } */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(PauseIcon, new PauseIcon({}));
    const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
    __VLS_4.slots.default;
    var __VLS_4;
    // @ts-ignore
    /** @type { [typeof BaseButton, typeof BaseButton, ] } */ ;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent(BaseButton, new BaseButton({
        ...{ 'onClick': {} },
        variant: ("ghost"),
    }));
    const __VLS_13 = __VLS_12({
        ...{ 'onClick': {} },
        variant: ("ghost"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    let __VLS_17;
    const __VLS_18 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$emit('take-hint');
        }
    };
    let __VLS_14;
    let __VLS_15;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ("flex sm:gap-x-2 gap-x-1 responsive-text items-center") },
    });
    // @ts-ignore
    /** @type { [typeof LightBuldIcon, typeof LightBuldIcon, ] } */ ;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(LightBuldIcon, new LightBuldIcon({}));
    const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
    (remainingHints);
    __VLS_16.slots.default;
    var __VLS_16;
    ['w-full', 'py-4', 'flex', 'justify-between', 'border-y', 'border-y-gray-200', 'items-center', 'sm:px-8', 'px-2', 'gap-x-2', 'responsive-text', 'font-semibold', 'text-gray-700', 'responsive-text', 'font-semibold', 'text-gray-700', 'flex', 'items-center', 'sm:gap-x-4', 'gap-x-2', 'responsive-text', 'font-semibold', 'text-gray-700', 'flex', 'sm:gap-x-2', 'gap-x-1', 'responsive-text', 'items-center',];
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
            BaseButton: BaseButton,
            PauseIcon: PauseIcon,
            LightBuldIcon: LightBuldIcon,
            formatTimer: formatTimer,
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
//# sourceMappingURL=Topbar.vue.js.map