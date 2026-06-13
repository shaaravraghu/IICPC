import { Validator } from '../lib/Validator/Validator.js';
import { makeFilesystem } from './make-filesystem.js';
/**
 * Validates an OpenAPI document
 */
export function validate(value, options) {
    try {
        const filesystem = makeFilesystem(value);
        const validator = new Validator();
        const result = validator.validate(filesystem, options);
        /**
         * Currently contains no asynchronous logic, but returns a Promise
         * to preserve API compatibility and allow async logic in the future.
         */
        return Promise.resolve({
            ...result,
            specification: validator.specification,
            version: validator.version,
        });
    }
    catch (err) {
        return Promise.reject(err);
    }
}
