import { details } from './details.js';
import { getEntrypoint } from './get-entrypoint.js';
import { makeFilesystem } from './make-filesystem.js';
import { resolveReferences } from './resolve-references.js';
/**
 * Dereferences an API definition or filesystem by resolving all references within the specification.
 *
 * @param value - The API definition or filesystem to dereference.\
 *                Can be any supported API definition format or a filesystem object.
 *
 * @param options - Optional options for the dereferencing process.
 */
export function dereference(value, options) {
    const filesystem = makeFilesystem(value);
    const entrypoint = getEntrypoint(filesystem);
    const result = resolveReferences(filesystem, options);
    return {
        specification: entrypoint.specification,
        errors: result.errors,
        schema: result.schema,
        ...details(entrypoint.specification),
    };
}
