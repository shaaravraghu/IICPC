import { addInfoObject } from './utils/addInfoObject.js';
import { addLatestOpenApiVersion } from './utils/addLatestOpenApiVersion.js';
import { addMissingTags } from './utils/addMissingTags.js';
import { normalizeSecuritySchemes } from './utils/normalizeSecuritySchemes.js';
import { rejectSwaggerDocuments } from './utils/rejectSwaggerDocuments.js';
// biome-ignore lint/performance/noBarrelFile: re-exports utilities
export { DEFAULT_TITLE } from './utils/addInfoObject.js';
export { DEFAULT_OPENAPI_VERSION } from './utils/addLatestOpenApiVersion.js';
/**
 * Make an OpenAPI document a valid and clean OpenAPI document
 *
 * @deprecated We're about to drop this from the package.
 */
export function sanitize(definition) {
    const transformers = [
        rejectSwaggerDocuments,
        addLatestOpenApiVersion,
        addInfoObject,
        addMissingTags,
        normalizeSecuritySchemes,
    ];
    return transformers.reduce((doc, transformer) => transformer(doc), definition);
}
