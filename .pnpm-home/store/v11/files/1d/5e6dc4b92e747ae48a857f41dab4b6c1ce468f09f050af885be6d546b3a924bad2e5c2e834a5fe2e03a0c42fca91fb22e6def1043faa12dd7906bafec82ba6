/**
 * Retrieves a nested value from the source document using a path array
 *
 * @example
 * ```ts
 * getValueByPath(document, ['components', 'schemas', 'User'])
 *
 * { id: '123', name: 'John Doe' }
 * ```
 */
export function getValueAtPath(obj, pointer) {
    return pointer.reduce((acc, part) => {
        if (acc === undefined || acc === null) {
            return undefined;
        }
        return acc[part];
    }, obj);
}
