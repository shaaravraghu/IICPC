/**
 * Enhanced error messages for `format` keyword validation failures.
 *
 * Currently provides context for:
 * - `uri-reference` format on `$ref` paths (non-ASCII characters, etc.)
 *
 * To add a new format enhancer, add a case to the switch in `getError()`.
 */
export default class FormatValidationError extends BaseValidationError {
    constructor(...args: any[]);
    name: string;
    getError(): {
        message: string;
        path: string;
    };
    /**
     * Builds a contextual error message for uri-reference format failures on $ref values.
     */
    _getUriReferenceMessage(): string;
    /**
     * Attempts to extract the actual $ref value from the specification
     * by walking the instancePath through the spec object.
     */
    _extractRefValue(): string;
}
import BaseValidationError from './base.js';
//# sourceMappingURL=format.d.ts.map