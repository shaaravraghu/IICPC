/**
 * Unescape JSON pointer
 *
 * Examples:
 * /foo~1bar~0baz -> /foo/bar~baz
 */
export const unescapeJsonPointer = (uri) => decodeURI(uri.replace(/~1/g, '/').replace(/~0/g, '~'));
