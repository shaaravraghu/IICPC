import { ClientBuilder, ClientGeneratorsBuilder, ContextSpec, GeneratorDependency, GeneratorMutator, OpenApiParameterObject, OpenApiReferenceObject, OpenApiSchemaObject, PackageJson, ZodCoerceType } from "@orval/core";

//#region src/compatible-v4.d.ts
declare const isZodVersionV4: (packageJson: PackageJson) => boolean;
//#endregion
//#region src/index.d.ts
declare const getZodDependencies: () => GeneratorDependency[];
declare const predefinedZodFormats: Set<string>;
interface ZodValidationSchemaDefinition {
  functions: [string, unknown][];
  consts: string[];
}
interface DateTimeOptions {
  offset?: boolean;
  local?: boolean;
  precision?: number;
}
interface TimeOptions {
  precision?: -1 | 0 | 1 | 2 | 3;
}
declare const generateZodValidationSchemaDefinition: (schema: OpenApiSchemaObject | undefined, context: ContextSpec, name: string, strict: boolean, isZodV4: boolean, rules?: {
  required?: boolean;
  dateTimeOptions?: DateTimeOptions;
  timeOptions?: TimeOptions;
  /**
   * Override schemas for properties at THIS level only.
   * Not passed to nested schemas. Used by form-data for file type handling.
   */
  propertyOverrides?: Record<string, ZodValidationSchemaDefinition>;
  /**
   * Internal registry to keep generated const names unique within a single
   * schema generation tree without leaking suffixes across unrelated top-level
   * schemas.
   */
  constNameRegistry?: Record<string, number>;
}) => ZodValidationSchemaDefinition;
declare const parseZodValidationSchemaDefinition: (input: ZodValidationSchemaDefinition, context: ContextSpec, coerceTypes: boolean | ZodCoerceType[] | undefined, strict: boolean, isZodV4: boolean, preprocess?: GeneratorMutator) => {
  zod: string;
  consts: string;
};
/**
 * Recursively inlines all `$ref` references in an OpenAPI schema tree,
 * producing a fully-resolved schema suitable for Zod code generation.
 *
 * Tracks visited `$ref` paths via `context.parents` to break circular
 * references (returning `{}` for cycles).
 */
declare const dereference: (schema: OpenApiSchemaObject | OpenApiReferenceObject, context: ContextSpec) => OpenApiSchemaObject;
/**
 * Generate zod schema for form-data request body.
 * Handles file type detection for top-level properties based on encoding.contentType
 * and contentMediaType. Mirrors type gen's resolveFormDataRootObject.
 */
declare const generateFormDataZodSchema: (schema: OpenApiSchemaObject, context: ContextSpec, name: string, strict: boolean, isZodV4: boolean, encoding?: Record<string, {
  contentType?: string;
}>) => ZodValidationSchemaDefinition;
declare const parseParameters: ({
  data,
  context,
  operationName,
  isZodV4,
  strict,
  generate
}: {
  data: (OpenApiParameterObject | OpenApiReferenceObject)[] | undefined;
  context: ContextSpec;
  operationName: string;
  isZodV4: boolean;
  strict: {
    param: boolean;
    query: boolean;
    header: boolean;
    body: boolean;
    response: boolean;
  };
  generate: {
    param: boolean;
    query: boolean;
    header: boolean;
    body: boolean;
    response: boolean;
  };
}) => {
  headers: ZodValidationSchemaDefinition;
  queryParams: ZodValidationSchemaDefinition;
  params: ZodValidationSchemaDefinition;
};
declare const generateZod: ClientBuilder;
declare const builder: () => () => ClientGeneratorsBuilder;
//#endregion
export { ZodValidationSchemaDefinition, builder, builder as default, dereference, generateFormDataZodSchema, generateZod, generateZodValidationSchemaDefinition, getZodDependencies, isZodVersionV4, parseParameters, parseZodValidationSchemaDefinition, predefinedZodFormats };
//# sourceMappingURL=index.d.mts.map