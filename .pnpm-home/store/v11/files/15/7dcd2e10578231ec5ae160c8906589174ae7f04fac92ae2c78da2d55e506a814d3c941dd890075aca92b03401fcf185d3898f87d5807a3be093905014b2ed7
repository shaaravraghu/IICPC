/**
 * Type guard to check if an object is not a ReferenceObject.
 * A ReferenceObject is defined by having a $ref property that is a string.
 */
export const isDereferenced = (obj) => typeof obj === 'object' &&
    obj !== null &&
    !('$ref' in obj && typeof obj.$ref === 'string');
