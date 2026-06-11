import { getListOfReferences } from './get-list-of-references.js';
import { isFilesystem } from './is-filesystem.js';
import { normalize } from './normalize.js';
export function makeFilesystem(value, overwrites = {}) {
    // Keep as is
    if (isFilesystem(value)) {
        return value;
    }
    // Make an object
    const specification = normalize(value);
    // Create fake filesystem
    return [
        {
            isEntrypoint: true,
            specification,
            filename: null,
            dir: './',
            references: getListOfReferences(specification),
            ...overwrites,
        },
    ];
}
