import Modal from "../base/Modal.vue";
import BaseButton from "../base/BaseButton.vue";
import TrophyIcon from "../icons/TrophyIcon.vue";
import { ref } from "vue";
const __VLS_props = defineProps();
const { score, difficulty } = __VLS_props;
const emit = defineEmits();
const username = ref("");
const showUserError = ref(false);
/**
 * Displays an error if the username is empty
 */
function validateUsername() {
    showUserError.value = username.value.trim() === "";
}
/**
 * Adds a user's score to the leaderboard stored in localStorage.
 * Updates the leaderboard for a specific difficulty level, only the top 3 scores are stored.
 *
 * @param {TopUserType} data - The new user's data.
 * @param {DifficultyName} difficulty - The difficulty level to update.
 */
function addToStorage(data, difficulty) {
    const prevLeaderboard = localStorage.getItem("leaderboard");
    const parsedLeaderboard = prevLeaderboard
        ? JSON.parse(prevLeaderboard)
        : [];
    const subList = parsedLeaderboard.find((el) => el.key === difficulty);
    if (subList) {
        subList.list.push(data);
        subList.list.sort((a, b) => b.score - a.score);
        subList.list = subList.list.slice(0, 3);
        localStorage.setItem("leaderboard", JSON.stringify(parsedLeaderboard));
    }
    else {
        const newSection = {
            key: difficulty,
            list: [data],
        };
        console.log(newSection);
        parsedLeaderboard.push(newSection);
        localStorage.setItem("leaderboard", JSON.stringify(parsedLeaderboard));
    }
}
/**
 * Sends a server request to the BE to store the game information
 */
async function submitScore() {
    if (!difficulty) {
        return;
    }
    if (!username.value) {
        showUserError.value = true;
        return;
    }
    try {
        const data = {
            name: username.value,
            score,
            difficulty,
        };
        addToStorage(data, difficulty);
        const response = await fetch("http://localhost:3000/api/add-user", {
            method: "Post",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        emit("start-new");
    }
    catch (e) {
        console.error("Error fetching leaderboard data:", e);
    }
}
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
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("flex items-center justify-center gap-3") },
        });
        // @ts-ignore
        /** @type { [typeof TrophyIcon, ] } */ ;
        // @ts-ignore
        const __VLS_6 = __VLS_asFunctionalComponent(TrophyIcon, new TrophyIcon({
            ...{ class: ("w-10 h-10 text-yellow-500") },
        }));
        const __VLS_7 = __VLS_6({
            ...{ class: ("w-10 h-10 text-yellow-500") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_6));
        __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
            ...{ class: ("text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent") },
        });
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { body: __VLS_thisSlot } = __VLS_4.slots;
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("flex flex-col items-center p-6 gap-6 w-full") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("flex flex-col items-center") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: ("text-gray-600 text-lg") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: ("text-5xl font-bold text-gray-800") },
        });
        (score);
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("w-full") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.input)({
            ...{ onInput: (__VLS_ctx.validateUsername) },
            type: ("text"),
            value: ((__VLS_ctx.username)),
            placeholder: ("Enter your name"),
            ...{ class: ("w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-300") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("text-red-500 font-bold mt-2") },
        });
        __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.showUserError) }, null, null);
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("flex flex-col gap-3 w-full") },
        });
        // @ts-ignore
        /** @type { [typeof BaseButton, typeof BaseButton, ] } */ ;
        // @ts-ignore
        const __VLS_11 = __VLS_asFunctionalComponent(BaseButton, new BaseButton({
            ...{ 'onClick': {} },
            variant: ("secondary"),
            ...{ class: ("w-full text-white font-medium bg-green-600 hover:bg-green-700 py-3 rounded-md transition-colors") },
            disabled: ((__VLS_ctx.showUserError)),
        }));
        const __VLS_12 = __VLS_11({
            ...{ 'onClick': {} },
            variant: ("secondary"),
            ...{ class: ("w-full text-white font-medium bg-green-600 hover:bg-green-700 py-3 rounded-md transition-colors") },
            disabled: ((__VLS_ctx.showUserError)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_11));
        let __VLS_16;
        const __VLS_17 = {
            onClick: (__VLS_ctx.submitScore)
        };
        let __VLS_13;
        let __VLS_14;
        __VLS_15.slots.default;
        var __VLS_15;
        // @ts-ignore
        /** @type { [typeof BaseButton, typeof BaseButton, ] } */ ;
        // @ts-ignore
        const __VLS_18 = __VLS_asFunctionalComponent(BaseButton, new BaseButton({
            ...{ 'onClick': {} },
            variant: ("secondary"),
            ...{ class: ("w-full text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 py-3 rounded-md transition-colors") },
        }));
        const __VLS_19 = __VLS_18({
            ...{ 'onClick': {} },
            variant: ("secondary"),
            ...{ class: ("w-full text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 py-3 rounded-md transition-colors") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_18));
        let __VLS_23;
        const __VLS_24 = {
            onClick: (...[$event]) => {
                __VLS_ctx.$emit('start-new');
            }
        };
        let __VLS_20;
        let __VLS_21;
        __VLS_22.slots.default;
        var __VLS_22;
    }
    var __VLS_4;
    ['flex', 'items-center', 'justify-center', 'gap-3', 'w-10', 'h-10', 'text-yellow-500', 'text-3xl', 'font-bold', 'bg-gradient-to-r', 'from-green-600', 'to-green-700', 'bg-clip-text', 'text-transparent', 'flex', 'flex-col', 'items-center', 'p-6', 'gap-6', 'w-full', 'flex', 'flex-col', 'items-center', 'text-gray-600', 'text-lg', 'text-5xl', 'font-bold', 'text-gray-800', 'w-full', 'w-full', 'border', 'border-gray-300', 'rounded-md', 'px-4', 'py-3', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500', 'shadow-sm', 'transition', 'duration-300', 'text-red-500', 'font-bold', 'mt-2', 'flex', 'flex-col', 'gap-3', 'w-full', 'w-full', 'text-white', 'font-medium', 'bg-green-600', 'hover:bg-green-700', 'py-3', 'rounded-md', 'transition-colors', 'w-full', 'text-gray-700', 'font-medium', 'bg-gray-100', 'hover:bg-gray-200', 'py-3', 'rounded-md', 'transition-colors',];
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
            TrophyIcon: TrophyIcon,
            username: username,
            showUserError: showUserError,
            validateUsername: validateUsername,
            submitScore: submitScore,
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
//# sourceMappingURL=EndGamePopup.vue.js.map