export function deepCopy(value) {
    if (Array.isArray(value)) {
        return value.map((item) => deepCopy(item));
    }
    else if (typeof value === "object" && value !== null) {
        return Object.keys(value).reduce((copy, key) => {
            copy[key] = deepCopy(value[key]);
            return copy;
        }, {});
    }
    return value;
}
export function createBoard() {
    return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => ({
        value: 0,
        initial: true,
        hint: false,
        draftValue: 0,
        filled: false,
    })));
}
export function generateRandomNumber(min, max) {
    if (max < min) {
        return -1;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//# sourceMappingURL=utility.js.map