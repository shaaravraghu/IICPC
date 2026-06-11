// TODO: This is a copy of org/packages/helpers/src/objects/merge.ts
/**
 * Overwrite a target object a new replacement object handling removed keys
 */
export const objectReplace = (target, replacement) => {
    // Clear any keys that have been removed in the replacement
    Object.keys(target).forEach((key) => {
        if (!Object.hasOwn(replacement, key)) {
            delete target[key];
        }
    });
    Object.assign(target, replacement);
    return target;
};
