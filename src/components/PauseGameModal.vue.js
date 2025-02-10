import BaseButton from "../base/BaseButton.vue";
import Modal from "../base/Modal.vue";
const __VLS_emit = defineEmits();
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
            className: ("text-3xl font-bold text-gray-900"),
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            className: ("text-gray-500"),
        });
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { body: __VLS_thisSlot } = __VLS_4.slots;
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("flex flex-col gap-4") },
        });
        // @ts-ignore
        /** @type { [typeof BaseButton, typeof BaseButton, ] } */ ;
        // @ts-ignore
        const __VLS_6 = __VLS_asFunctionalComponent(BaseButton, new BaseButton({
            ...{ 'onClick': {} },
            variant: ("secondary"),
            ...{ class: ("text-white font-medium bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-emerald-500/20") },
        }));
        const __VLS_7 = __VLS_6({
            ...{ 'onClick': {} },
            variant: ("secondary"),
            ...{ class: ("text-white font-medium bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-emerald-500/20") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_6));
        let __VLS_11;
        const __VLS_12 = {
            onClick: (...[$event]) => {
                __VLS_ctx.$emit('resume-play');
            }
        };
        let __VLS_8;
        let __VLS_9;
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_10.slots.default;
        var __VLS_10;
        // @ts-ignore
        /** @type { [typeof BaseButton, typeof BaseButton, ] } */ ;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent(BaseButton, new BaseButton({
            ...{ 'onClick': {} },
            variant: ("secondary"),
            ...{ class: ("text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-colors") },
        }));
        const __VLS_14 = __VLS_13({
            ...{ 'onClick': {} },
            variant: ("secondary"),
            ...{ class: ("text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-colors") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        let __VLS_18;
        const __VLS_19 = {
            onClick: (...[$event]) => {
                __VLS_ctx.$emit('start-new');
            }
        };
        let __VLS_15;
        let __VLS_16;
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_17.slots.default;
        var __VLS_17;
    }
    var __VLS_4;
    ['flex', 'flex-col', 'gap-4', 'text-white', 'font-medium', 'bg-emerald-500', 'hover:bg-emerald-600', 'transition-colors', 'shadow-emerald-500/20', 'text-gray-700', 'font-medium', 'bg-gray-100', 'hover:bg-gray-200', 'transition-colors',];
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
            Modal: Modal,
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
//# sourceMappingURL=PauseGameModal.vue.js.map