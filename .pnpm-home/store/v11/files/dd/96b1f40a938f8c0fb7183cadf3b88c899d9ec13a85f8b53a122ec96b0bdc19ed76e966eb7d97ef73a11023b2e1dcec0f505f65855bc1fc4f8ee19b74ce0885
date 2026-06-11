import { isMacOS } from './is-mac-os.js';
/**
 * Checks for the modifier key
 *
 * Which is meta on macOs and ctrl on linux/windows
 */
export const hasModifier = (keydown) => {
    const modifier = isMacOS() ? 'metaKey' : 'ctrlKey';
    return keydown[modifier];
};
