import { unescapeJsonPointer } from './unescape-json-pointer.js';
/**
 * Translate `/paths/~1test` to `['paths', '/test']`
 */
export const parseJsonPointerSegments = (path) => path
    // ['', 'paths', '~1test']
    .split('/')
    // ['paths', '~1test']
    .slice(1)
    // ['paths', '/test']
    .map(unescapeJsonPointer);
