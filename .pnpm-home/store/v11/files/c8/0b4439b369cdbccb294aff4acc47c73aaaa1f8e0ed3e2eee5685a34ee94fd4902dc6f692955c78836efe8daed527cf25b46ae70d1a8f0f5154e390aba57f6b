import { isBoolean, isFunction, isNullish, isNumber, isString } from "remeda";
import { CompareOperator } from "compare-versions";
import debug from "debug";
import { allLocales } from "@faker-js/faker";
import { OpenAPIV3_1 } from "@scalar/openapi-types";
import { TypeDocOptions } from "typedoc";

//#region src/types.d.ts
declare const SupportedFormatter: {
  readonly PRETTIER: "prettier";
  readonly BIOME: "biome";
  readonly OXFMT: "oxfmt";
};
type SupportedFormatter = (typeof SupportedFormatter)[keyof typeof SupportedFormatter];
interface Options {
  output?: string | OutputOptions;
  input?: string | string[] | InputOptions;
  hooks?: Partial<HooksOptions>;
}
type OptionsFn = () => Options | Promise<Options>;
type OptionsExport = Options | Promise<Options> | OptionsFn;
type Config = Record<string, OptionsExport>;
type ConfigFn = () => Config | Promise<Config>;
type ConfigExternal = Config | Promise<Config> | ConfigFn;
type NormalizedConfig = Record<string, NormalizedOptions | undefined>;
interface NormalizedOptions {
  output: NormalizedOutputOptions;
  input: NormalizedInputOptions;
  hooks: NormalizedHookOptions;
}
interface NormalizedOutputOptions {
  workspace?: string;
  target: string;
  schemas?: string | SchemaOptions;
  operationSchemas?: string;
  namingConvention: NamingConvention;
  fileExtension: string;
  mode: OutputMode;
  mock?: GlobalMockOptions | ClientMockBuilder;
  override: NormalizedOverrideOutput;
  client: OutputClient | OutputClientFunc;
  httpClient: OutputHttpClient;
  clean: boolean | string[];
  docs: boolean | OutputDocsOptions;
  formatter?: SupportedFormatter;
  tsconfig?: Tsconfig;
  packageJson?: PackageJson;
  headers: boolean;
  indexFiles: boolean;
  baseUrl?: string | BaseUrlFromSpec | BaseUrlFromConstant | BaseUrlRuntime;
  allParamsOptional: boolean;
  urlEncodeParameters: boolean;
  unionAddMissingProperties: boolean;
  optionsParamRequired: boolean;
  propertySortOrder: PropertySortOrder;
}
interface NormalizedParamsSerializerOptions {
  qs?: Record<string, unknown>;
}
/**
 * Controls how readonly properties are treated when a schema is reused as a request body.
 *
 * Best practice:
 * - `strip` (default): recommended for most OpenAPI specs, because `readOnly`
 *   properties are response-oriented and generally should not constrain request
 *   payload authoring.
 * - `preserve`: use when your schema intentionally models immutable request DTOs
 *   and you want generated request-body types to keep readonly modifiers.
 *
 * Note: this applies to request bodies regardless of the generated client style
 * (`httpClient`, `httpResource`, etc.). `httpResource` still issues request
 * payloads, so the same OpenAPI guidance applies.
 *
 * If we later want a stricter OpenAPI-aligned mode that omits `readOnly`
 * properties from request bodies entirely, that should be introduced as a new
 * explicit mode rather than overloading `preserve`.
 */
type ReadonlyRequestBodiesMode = 'strip' | 'preserve';
interface NormalizedOverrideOutput {
  title?: (title: string) => string;
  transformer?: OutputTransformer;
  mutator?: NormalizedMutator;
  operations: Record<string, NormalizedOperationOptions | undefined>;
  tags: Record<string, NormalizedOperationOptions | undefined>;
  mock?: OverrideMockOptions;
  contentType?: OverrideOutputContentType;
  header: false | ((info: OpenApiInfoObject) => string[] | string);
  formData: NormalizedFormDataType<NormalizedMutator>;
  formUrlEncoded: boolean | NormalizedMutator;
  paramsSerializer?: NormalizedMutator;
  paramsSerializerOptions?: NormalizedParamsSerializerOptions;
  namingConvention: {
    enum?: NamingConvention;
  };
  components: {
    schemas: {
      suffix: string;
      itemSuffix: string;
    };
    responses: {
      suffix: string;
    };
    parameters: {
      suffix: string;
    };
    requestBodies: {
      suffix: string;
    };
  };
  hono: NormalizedHonoOptions;
  mcp: NormalizedMcpOptions;
  query: NormalizedQueryOptions;
  angular: NormalizedAngularOptions;
  swr: SwrOptions;
  zod: NormalizedZodOptions;
  fetch: NormalizedFetchOptions;
  operationName?: (operation: OpenApiOperationObject, route: string, verb: Verbs) => string;
  requestOptions: Record<string, unknown> | boolean;
  useDates?: boolean;
  useTypeOverInterfaces?: boolean;
  useDeprecatedOperations?: boolean;
  useBigInt?: boolean;
  useNamedParameters?: boolean;
  enumGenerationType: EnumGeneration;
  suppressReadonlyModifier?: boolean;
  /**
   * Controls how readonly properties are handled for generated request-body types.
   *
   * Prefer `strip` for most OpenAPI specs because `readOnly` fields are
   * response-oriented. Use `preserve` only when your request DTOs are
   * intentionally immutable and should remain readonly in generated types.
   */
  preserveReadonlyRequestBodies?: ReadonlyRequestBodiesMode;
  /**
   * When enabled, operations with multiple request body content-types
   * (e.g. both `multipart/form-data` and `application/json`) will generate
   * separate functions for each content type instead of a single function
   * with a union type parameter.
   *
   * @example
   * // With splitByContentType: true
   * updateProfileWithFormData(body: FormDataType) => { ... }
   * updateProfileWithJson(body: JsonType) => { ... }
   *
   * // With splitByContentType: false (default)
   * updateProfile(body: FormDataType | JsonType) => { ... }
   *
   * @default false
   */
  splitByContentType: boolean;
  jsDoc: NormalizedJsDocOptions;
  aliasCombinedTypes: boolean;
  /**
   * When enabled, optional properties will be typed as `T | null` instead of just `T`.
   * @default false
   */
  useNullForOptional?: boolean;
}
interface NormalizedMutator {
  path: string;
  name?: string;
  default: boolean;
  alias?: Record<string, string>;
  external?: string[];
  extension?: string;
}
interface NormalizedOperationOptions {
  transformer?: OutputTransformer;
  mutator?: NormalizedMutator;
  mock?: {
    data?: MockData;
    properties?: MockProperties;
  };
  contentType?: OverrideOutputContentType;
  query?: NormalizedQueryOptions;
  angular?: NormalizedAngularOptions;
  swr?: SwrOptions;
  zod?: NormalizedZodOptions;
  operationName?: (operation: OpenApiOperationObject, route: string, verb: Verbs) => string;
  fetch?: FetchOptions;
  formData?: NormalizedFormDataType<NormalizedMutator>;
  formUrlEncoded?: boolean | NormalizedMutator;
  paramsSerializer?: NormalizedMutator;
  requestOptions?: object | boolean;
}
interface NormalizedInputOptions {
  target: string | OpenApiDocument;
  override: OverrideInput;
  unsafeDisableValidation: boolean;
  filters?: InputFiltersOptions;
  parserOptions?: {
    headers?: {
      domains: string[];
      headers: Record<string, string>;
    }[];
  };
}
type OutputClientFunc = (clients: GeneratorClients) => ClientGeneratorsBuilder;
interface BaseUrlFromSpec {
  getBaseUrlFromSpecification: true;
  variables?: Record<string, string>;
  index?: number;
  baseUrl?: never;
}
interface BaseUrlFromConstant {
  getBaseUrlFromSpecification: false;
  variables?: never;
  index?: never;
  baseUrl: string;
}
/**
 * Embed a runtime JavaScript expression into generated URL template literals
 * (e.g. `process.env.API_BASE_URL`) so the same build can target different hosts at runtime.
 */
interface BaseUrlRuntime {
  runtime: string;
  /** Named imports for symbols used in `runtime` (e.g. `{ name: 'apiBase', importPath: '../config' }`). */
  imports?: GeneratorImport[];
  getBaseUrlFromSpecification?: never;
  baseUrl?: never;
}
declare const PropertySortOrder: {
  readonly ALPHABETICAL: "Alphabetical";
  readonly SPECIFICATION: "Specification";
};
type PropertySortOrder = (typeof PropertySortOrder)[keyof typeof PropertySortOrder];
declare const NamingConvention: {
  readonly CAMEL_CASE: "camelCase";
  readonly PASCAL_CASE: "PascalCase";
  readonly SNAKE_CASE: "snake_case";
  readonly KEBAB_CASE: "kebab-case";
};
type NamingConvention = (typeof NamingConvention)[keyof typeof NamingConvention];
declare const EnumGeneration: {
  readonly CONST: "const";
  readonly ENUM: "enum";
  readonly UNION: "union";
};
type EnumGeneration = (typeof EnumGeneration)[keyof typeof EnumGeneration];
type SchemaGenerationType = 'typescript' | 'zod';
interface SchemaOptions {
  path: string;
  type: SchemaGenerationType;
}
interface NormalizedSchemaOptions {
  path: string;
  type: SchemaGenerationType;
}
interface OutputOptions {
  workspace?: string;
  target: string;
  schemas?: string | SchemaOptions | false;
  /**
   * Separate path for operation-derived types (params, bodies, responses).
   * When set, types matching operation patterns (e.g., *Params, *Body) are written here
   * while regular schema types remain in the `schemas` path.
   */
  operationSchemas?: string;
  namingConvention?: NamingConvention;
  fileExtension?: string;
  mode?: OutputMode;
  mock?: boolean | GlobalMockOptions | ClientMockBuilder;
  override?: OverrideOutput;
  client?: OutputClient | OutputClientFunc;
  httpClient?: OutputHttpClient;
  clean?: boolean | string[];
  docs?: boolean | OutputDocsOptions;
  formatter?: SupportedFormatter;
  tsconfig?: string | Tsconfig;
  packageJson?: string;
  headers?: boolean;
  indexFiles?: boolean;
  baseUrl?: string | BaseUrlFromSpec | BaseUrlFromConstant | BaseUrlRuntime;
  allParamsOptional?: boolean;
  urlEncodeParameters?: boolean;
  unionAddMissingProperties?: boolean;
  optionsParamRequired?: boolean;
  propertySortOrder?: PropertySortOrder;
}
interface InputFiltersOptions {
  mode?: 'include' | 'exclude';
  tags?: (string | RegExp)[];
  schemas?: (string | RegExp)[];
}
interface InputOptions {
  target: string | string[] | Record<string, unknown> | OpenApiDocument;
  override?: OverrideInput;
  /**
   * Disable OpenAPI spec validation.
   *
   * **Use at your own risk** — code generation with invalid specs is not guaranteed
   * to work and may break in minor updates. Bug reports with validation disabled are
   * not accepted.
   *
   * @default false
   */
  unsafeDisableValidation?: boolean;
  filters?: InputFiltersOptions;
  parserOptions?: {
    headers?: {
      domains: string[];
      headers: Record<string, string>;
    }[];
  };
}
declare const OutputClient: {
  readonly ANGULAR: "angular";
  readonly ANGULAR_QUERY: "angular-query";
  readonly AXIOS: "axios";
  readonly AXIOS_FUNCTIONS: "axios-functions";
  readonly REACT_QUERY: "react-query";
  readonly SOLID_START: "solid-start";
  readonly SOLID_QUERY: "solid-query";
  readonly SVELTE_QUERY: "svelte-query";
  readonly VUE_QUERY: "vue-query";
  readonly SWR: "swr";
  readonly ZOD: "zod";
  readonly HONO: "hono";
  readonly FETCH: "fetch";
  readonly MCP: "mcp";
};
type OutputClient = (typeof OutputClient)[keyof typeof OutputClient];
declare const OutputHttpClient: {
  readonly AXIOS: "axios";
  readonly FETCH: "fetch";
  readonly ANGULAR: "angular";
};
type OutputHttpClient = (typeof OutputHttpClient)[keyof typeof OutputHttpClient];
declare const OutputMode: {
  readonly SINGLE: "single";
  readonly SPLIT: "split";
  readonly TAGS: "tags";
  readonly TAGS_SPLIT: "tags-split";
};
type OutputMode = (typeof OutputMode)[keyof typeof OutputMode];
type OutputDocsOptions = {
  configPath?: string;
} & Partial<TypeDocOptions>;
declare const OutputMockType: {
  readonly MSW: "msw";
};
type OutputMockType = (typeof OutputMockType)[keyof typeof OutputMockType];
type PreferredContentType = 'application/json' | 'application/xml' | 'text/plain' | 'text/html' | 'application/octet-stream' | (string & {});
interface GlobalMockOptions {
  type: OutputMockType;
  useExamples?: boolean;
  generateEachHttpStatus?: boolean;
  delay?: false | number | (() => number);
  delayFunctionLazyExecute?: boolean;
  baseUrl?: string;
  locale?: keyof typeof allLocales;
  preferredContentType?: string;
  indexMockFiles?: boolean;
}
type OverrideMockOptions = Partial<GlobalMockOptions> & {
  arrayMin?: number;
  arrayMax?: number;
  stringMin?: number;
  stringMax?: number;
  numberMin?: number;
  numberMax?: number;
  required?: boolean;
  properties?: MockProperties;
  format?: Record<string, unknown>;
  fractionDigits?: number;
};
type MockOptions = Omit<OverrideMockOptions, 'properties'> & {
  properties?: Record<string, unknown>;
  operations?: Record<string, {
    properties: Record<string, unknown>;
  }>;
  tags?: Record<string, {
    properties: Record<string, unknown>;
  }>;
};
type MockPropertiesObject = Record<string, unknown>;
type MockPropertiesObjectFn = (specs: OpenApiDocument) => MockPropertiesObject;
type MockProperties = MockPropertiesObject | MockPropertiesObjectFn;
type MockDataObject = Record<string, unknown>;
type MockDataObjectFn = (specs: OpenApiDocument) => MockDataObject;
type MockDataArray = unknown[];
type MockDataArrayFn = (specs: OpenApiDocument) => MockDataArray;
type MockData = MockDataObject | MockDataObjectFn | MockDataArray | MockDataArrayFn;
type OutputTransformerFn = (verb: GeneratorVerbOptions) => GeneratorVerbOptions;
type OutputTransformer = string | OutputTransformerFn;
interface MutatorObject {
  path: string;
  name?: string;
  default?: boolean;
  alias?: Record<string, string>;
  external?: string[];
  extension?: string;
}
type Mutator = string | MutatorObject;
interface ParamsSerializerOptions {
  qs?: Record<string, unknown>;
}
declare const FormDataArrayHandling: {
  readonly SERIALIZE: "serialize";
  readonly EXPLODE: "explode";
  readonly SERIALIZE_WITH_BRACKETS: "serialize-with-brackets";
};
type FormDataArrayHandling = (typeof FormDataArrayHandling)[keyof typeof FormDataArrayHandling];
type NormalizedFormDataType<TMutator> = {
  disabled: true;
  mutator?: never;
  arrayHandling: FormDataArrayHandling;
} | {
  disabled: false;
  mutator?: TMutator;
  arrayHandling: FormDataArrayHandling;
};
type FormDataType<TMutator> = {
  mutator: TMutator;
  arrayHandling?: FormDataArrayHandling;
} | {
  mutator?: TMutator;
  arrayHandling: FormDataArrayHandling;
};
interface OverrideOutput {
  title?: (title: string) => string;
  transformer?: OutputTransformer;
  mutator?: Mutator;
  operations?: Record<string, OperationOptions>;
  tags?: Record<string, OperationOptions>;
  mock?: OverrideMockOptions;
  contentType?: OverrideOutputContentType;
  header?: boolean | ((info: OpenApiInfoObject) => string[] | string);
  formData?: boolean | Mutator | FormDataType<Mutator>;
  formUrlEncoded?: boolean | Mutator;
  paramsSerializer?: Mutator;
  paramsSerializerOptions?: ParamsSerializerOptions;
  namingConvention?: {
    enum?: NamingConvention;
  };
  components?: {
    schemas?: {
      suffix?: string;
      itemSuffix?: string;
    };
    responses?: {
      suffix?: string;
    };
    parameters?: {
      suffix?: string;
    };
    requestBodies?: {
      suffix?: string;
    };
  };
  hono?: HonoOptions;
  mcp?: McpOptions;
  query?: QueryOptions;
  swr?: SwrOptions;
  angular?: AngularOptions;
  zod?: ZodOptions;
  operationName?: (operation: OpenApiOperationObject, route: string, verb: Verbs) => string;
  fetch?: FetchOptions;
  requestOptions?: Record<string, unknown> | boolean;
  useDates?: boolean;
  useTypeOverInterfaces?: boolean;
  useDeprecatedOperations?: boolean;
  useBigInt?: boolean;
  useNamedParameters?: boolean;
  enumGenerationType?: EnumGeneration;
  suppressReadonlyModifier?: boolean;
  /**
   * Controls how readonly properties are handled for generated request-body types.
   *
   * Prefer `strip` for most OpenAPI specs because `readOnly` fields are
   * response-oriented. Use `preserve` only when your request DTOs are
   * intentionally immutable and should remain readonly in generated types.
   */
  preserveReadonlyRequestBodies?: ReadonlyRequestBodiesMode;
  /**
   * When enabled, operations with multiple request body content-types
   * (e.g. both `multipart/form-data` and `application/json`) will generate
   * separate functions for each content type instead of a single function
   * with a union type parameter.
   *
   * @default false
   */
  splitByContentType?: boolean;
  jsDoc?: JsDocOptions;
  aliasCombinedTypes?: boolean;
  /**
   * When enabled, optional properties will be typed as `T | null` instead of just `T`.
   * @default false
   */
  useNullForOptional?: boolean;
}
interface JsDocOptions {
  filter?: (schema: Record<string, unknown>) => {
    key: string;
    value: string;
  }[];
}
interface NormalizedJsDocOptions {
  filter?: (schema: Record<string, unknown>) => {
    key: string;
    value: string;
  }[];
}
interface OverrideOutputContentType {
  include?: string[];
  exclude?: string[];
}
interface NormalizedHonoOptions {
  handlers?: string;
  compositeRoute: string;
  validator: boolean | 'hono';
  validatorOutputPath: string;
}
interface ZodDateTimeOptions {
  offset?: boolean;
  local?: boolean;
  precision?: number;
}
interface ZodTimeOptions {
  precision?: -1 | 0 | 1 | 2 | 3;
}
interface ZodOptions {
  strict?: {
    param?: boolean;
    query?: boolean;
    header?: boolean;
    body?: boolean;
    response?: boolean;
  };
  generate?: {
    param?: boolean;
    query?: boolean;
    header?: boolean;
    body?: boolean;
    response?: boolean;
  };
  coerce?: {
    param?: boolean | ZodCoerceType[];
    query?: boolean | ZodCoerceType[];
    header?: boolean | ZodCoerceType[];
    body?: boolean | ZodCoerceType[];
    response?: boolean | ZodCoerceType[];
  };
  preprocess?: {
    param?: Mutator;
    query?: Mutator;
    header?: Mutator;
    body?: Mutator;
    response?: Mutator;
  };
  dateTimeOptions?: ZodDateTimeOptions;
  timeOptions?: ZodTimeOptions;
  generateEachHttpStatus?: boolean;
  useBrandedTypes?: boolean;
}
type ZodCoerceType = 'string' | 'number' | 'boolean' | 'bigint' | 'date';
interface NormalizedZodOptions {
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
  coerce: {
    param: boolean | ZodCoerceType[];
    query: boolean | ZodCoerceType[];
    header: boolean | ZodCoerceType[];
    body: boolean | ZodCoerceType[];
    response: boolean | ZodCoerceType[];
  };
  preprocess?: {
    param?: NormalizedMutator;
    query?: NormalizedMutator;
    header?: NormalizedMutator;
    body?: NormalizedMutator;
    response?: NormalizedMutator;
  };
  generateEachHttpStatus: boolean;
  useBrandedTypes: boolean;
  dateTimeOptions: ZodDateTimeOptions;
  timeOptions: ZodTimeOptions;
}
/**
 * A single parameter value for `mutationInvalidates` params.
 *
 * - `string` – treated as a variable reference, e.g. `"petId"` → `variables.petId`
 * - `{ literal: string }` – emitted as a string literal, e.g. `{ literal: "@me" }` → `"@me"`
 */
type InvalidateTargetParam = string | {
  literal: string;
};
type InvalidateTarget = string | {
  query: string;
  params?: InvalidateTargetParam[] | Record<string, InvalidateTargetParam>;
  invalidateMode?: 'invalidate' | 'reset';
  file?: string;
};
interface MutationInvalidatesRule {
  onMutations: string[];
  invalidates: InvalidateTarget[];
}
type MutationInvalidatesConfig = MutationInvalidatesRule[];
interface HonoOptions {
  handlers?: string;
  compositeRoute?: string;
  validator?: boolean | 'hono';
  validatorOutputPath?: string;
}
interface McpServerOptions {
  path: string;
  name?: string;
  default?: boolean;
}
interface NormalizedMcpServerOptions {
  path: string;
  name?: string;
  default: boolean;
}
interface McpOptions {
  server?: McpServerOptions;
}
interface NormalizedMcpOptions {
  server?: NormalizedMcpServerOptions;
}
interface NormalizedQueryOptions {
  useQuery?: boolean;
  useSuspenseQuery?: boolean;
  useMutation?: boolean;
  useInfinite?: boolean;
  useSuspenseInfiniteQuery?: boolean;
  useInfiniteQueryParam?: string;
  usePrefetch?: boolean;
  useInvalidate?: boolean;
  useSetQueryData?: boolean;
  useGetQueryData?: boolean;
  options?: Record<string, unknown>;
  queryKey?: NormalizedMutator;
  queryOptions?: NormalizedMutator;
  mutationOptions?: NormalizedMutator;
  shouldExportMutatorHooks?: boolean;
  shouldExportHttpClient?: boolean;
  shouldExportQueryKey?: boolean;
  shouldSplitQueryKey?: boolean;
  useOperationIdAsQueryKey?: boolean;
  signal?: boolean;
  version?: 3 | 4 | 5;
  mutationInvalidates?: MutationInvalidatesConfig;
  runtimeValidation?: boolean;
}
interface QueryOptions {
  useQuery?: boolean;
  useSuspenseQuery?: boolean;
  useMutation?: boolean;
  useInfinite?: boolean;
  useSuspenseInfiniteQuery?: boolean;
  useInfiniteQueryParam?: string;
  usePrefetch?: boolean;
  useInvalidate?: boolean;
  useSetQueryData?: boolean;
  useGetQueryData?: boolean;
  options?: Record<string, unknown>;
  queryKey?: Mutator;
  queryOptions?: Mutator;
  mutationOptions?: Mutator;
  shouldExportMutatorHooks?: boolean;
  shouldExportHttpClient?: boolean;
  shouldExportQueryKey?: boolean;
  shouldSplitQueryKey?: boolean;
  useOperationIdAsQueryKey?: boolean;
  signal?: boolean;
  version?: 3 | 4 | 5;
  mutationInvalidates?: MutationInvalidatesConfig;
  runtimeValidation?: boolean;
}
interface AngularOptions {
  provideIn?: 'root' | 'any' | boolean;
  /**
   * Preferred name for configuring how retrieval-style operations are emitted.
   *
   * - `httpClient`: keep retrievals as service methods
   * - `httpResource`: emit retrievals as Angular `httpResource` helpers
   * - `both`: emit retrieval helpers and keep service methods where needed
   *
   * Mutation-style operations still use generated `HttpClient` service methods
   * by default unless a per-operation override forces a different behavior.
   */
  retrievalClient?: 'httpClient' | 'httpResource' | 'both';
  /**
   * Backward-compatible alias for `retrievalClient`.
   *
   * Kept for compatibility with existing configs.
   */
  client?: 'httpClient' | 'httpResource' | 'both';
  runtimeValidation?: boolean;
  httpResource?: AngularHttpResourceOptions;
}
interface NormalizedAngularOptions {
  provideIn: 'root' | 'any' | boolean;
  client: 'httpClient' | 'httpResource' | 'both';
  runtimeValidation: boolean;
  httpResource?: AngularHttpResourceOptions;
}
interface AngularHttpResourceOptions {
  /**
   * Value to expose while the resource is idle/loading.
   *
   * Serialized as a literal into generated code.
   */
  defaultValue?: unknown;
  /**
   * Debug name shown in Angular DevTools.
   */
  debugName?: string;
  /**
   * Raw code expression for HttpResourceOptions.injector.
   * Example: `inject(Injector)`.
   */
  injector?: string;
  /**
   * Raw code expression for HttpResourceOptions.equal.
   * Example: `(a, b) => a.id === b.id`.
   */
  equal?: string;
}
interface SwrOptions {
  useInfinite?: boolean;
  useSWRMutationForGet?: boolean;
  useSuspense?: boolean;
  generateErrorTypes?: boolean;
  swrOptions?: unknown;
  swrMutationOptions?: unknown;
  swrInfiniteOptions?: unknown;
}
interface NormalizedFetchOptions {
  includeHttpResponseReturnType: boolean;
  forceSuccessResponse: boolean;
  jsonReviver?: Mutator;
  runtimeValidation: boolean;
  useRuntimeFetcher: boolean;
}
interface FetchOptions {
  includeHttpResponseReturnType?: boolean;
  forceSuccessResponse?: boolean;
  jsonReviver?: Mutator;
  runtimeValidation?: boolean;
  useRuntimeFetcher?: boolean;
}
type InputTransformerFn = (spec: OpenApiDocument) => OpenApiDocument;
type InputTransformer = string | InputTransformerFn;
interface OverrideInput {
  transformer?: InputTransformer;
}
interface OperationOptions {
  transformer?: OutputTransformer;
  mutator?: Mutator;
  mock?: {
    data?: MockData;
    properties?: MockProperties;
  };
  query?: QueryOptions;
  angular?: AngularOptions;
  swr?: SwrOptions;
  zod?: ZodOptions;
  operationName?: (operation: OpenApiOperationObject, route: string, verb: Verbs) => string;
  fetch?: FetchOptions;
  formData?: boolean | Mutator | FormDataType<Mutator>;
  formUrlEncoded?: boolean | Mutator;
  paramsSerializer?: Mutator;
  requestOptions?: object | boolean;
}
type Hook = 'afterAllFilesWrite';
type HookFunction<TArgs extends unknown[] = unknown[]> = (...args: TArgs) => void | Promise<void>;
interface HookOption {
  command: string | HookFunction;
  injectGeneratedDirsAndFiles?: boolean;
}
type HookCommand = string | HookFunction | HookOption | (string | HookFunction | HookOption)[];
type NormalizedHookCommand = HookCommand[];
type HooksOptions<T = HookCommand | NormalizedHookCommand> = Partial<Record<Hook, T>>;
type NormalizedHookOptions = HooksOptions<NormalizedHookCommand>;
type Verbs = 'post' | 'put' | 'get' | 'patch' | 'delete' | 'head';
declare const Verbs: {
  POST: Verbs;
  PUT: Verbs;
  GET: Verbs;
  PATCH: Verbs;
  DELETE: Verbs;
  HEAD: Verbs;
};
interface ImportOpenApi {
  spec: OpenApiDocument;
  input: NormalizedInputOptions;
  output: NormalizedOutputOptions;
  target: string;
  workspace: string;
  projectName?: string;
}
interface ContextSpec {
  projectName?: string;
  target: string;
  workspace: string;
  spec: OpenApiDocument;
  parents?: string[];
  output: NormalizedOutputOptions;
}
interface GlobalOptions {
  watch?: boolean | string | string[];
  verbose?: boolean;
  clean?: boolean | string[];
  formatter?: SupportedFormatter;
  mock?: boolean | GlobalMockOptions;
  client?: OutputClient;
  httpClient?: OutputHttpClient;
  mode?: OutputMode;
  tsconfig?: string | Tsconfig;
  packageJson?: string;
  input?: string | string[];
  output?: string;
  failOnWarnings?: boolean;
}
interface Tsconfig {
  baseUrl?: string;
  compilerOptions?: {
    esModuleInterop?: boolean;
    allowSyntheticDefaultImports?: boolean;
    exactOptionalPropertyTypes?: boolean;
    paths?: Record<string, string[]>;
    target?: TsConfigTarget;
  };
}
type TsConfigTarget = 'es3' | 'es5' | 'es6' | 'es2015' | 'es2016' | 'es2017' | 'es2018' | 'es2019' | 'es2020' | 'es2021' | 'es2022' | 'esnext';
interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  catalog?: Record<string, string>;
  catalogs?: Record<string, Record<string, string>>;
  resolvedVersions?: Record<string, string>;
}
interface GeneratorSchema {
  name: string;
  model: string;
  imports: GeneratorImport[];
  dependencies?: string[];
  schema?: OpenApiSchemaObject;
}
interface GeneratorImport {
  readonly name: string;
  readonly schemaName?: string;
  readonly isZodSchema?: boolean;
  readonly isConstant?: boolean;
  readonly alias?: string;
  readonly default?: boolean;
  readonly values?: boolean;
  readonly syntheticDefaultImport?: boolean;
  readonly namespaceImport?: boolean;
  readonly importPath?: string;
}
interface GeneratorDependency {
  readonly exports: readonly GeneratorImport[];
  readonly dependency: string;
}
interface GeneratorApiResponse {
  operations: GeneratorOperations;
  schemas: GeneratorSchema[];
}
type GeneratorOperations = Record<string, GeneratorOperation>;
interface GeneratorTarget {
  imports: GeneratorImport[];
  implementation: string;
  implementationMock: string;
  importsMock: GeneratorImport[];
  mutators?: GeneratorMutator[];
  clientMutators?: GeneratorMutator[];
  formData?: GeneratorMutator[];
  formUrlEncoded?: GeneratorMutator[];
  paramsSerializer?: GeneratorMutator[];
  fetchReviver?: GeneratorMutator[];
}
interface GeneratorTargetFull {
  imports: GeneratorImport[];
  implementation: string;
  implementationMock: {
    function: string;
    handler: string;
    handlerName: string;
  };
  importsMock: GeneratorImport[];
  mutators?: GeneratorMutator[];
  clientMutators?: GeneratorMutator[];
  formData?: GeneratorMutator[];
  formUrlEncoded?: GeneratorMutator[];
  paramsSerializer?: GeneratorMutator[];
  fetchReviver?: GeneratorMutator[];
}
interface GeneratorOperation {
  imports: GeneratorImport[];
  implementation: string;
  implementationMock: {
    function: string;
    handler: string;
    handlerName: string;
  };
  importsMock: GeneratorImport[];
  tags: string[];
  mutator?: GeneratorMutator;
  clientMutators?: GeneratorMutator[];
  formData?: GeneratorMutator;
  formUrlEncoded?: GeneratorMutator;
  paramsSerializer?: GeneratorMutator;
  fetchReviver?: GeneratorMutator;
  operationName: string;
  types?: {
    result: (title?: string) => string;
  };
}
interface GeneratorVerbOptions {
  verb: Verbs;
  route: string;
  pathRoute: string;
  summary?: string;
  doc: string;
  tags: string[];
  operationId: string;
  operationName: string;
  response: GetterResponse;
  body: GetterBody;
  headers?: GetterQueryParam;
  queryParams?: GetterQueryParam;
  params: GetterParams;
  props: GetterProps;
  mutator?: GeneratorMutator;
  formData?: GeneratorMutator;
  formUrlEncoded?: GeneratorMutator;
  paramsSerializer?: GeneratorMutator;
  fetchReviver?: GeneratorMutator;
  override: NormalizedOverrideOutput;
  deprecated?: boolean;
  originalOperation: OpenApiOperationObject;
}
type GeneratorVerbsOptions = GeneratorVerbOptions[];
interface GeneratorOptions {
  route: string;
  pathRoute: string;
  override: NormalizedOverrideOutput;
  context: ContextSpec;
  mock?: GlobalMockOptions | ClientMockBuilder;
  output: string;
}
interface GeneratorClient {
  implementation: string;
  imports: GeneratorImport[];
  mutators?: GeneratorMutator[];
  /** When set, overrides the default verbOption.doc prepended to the implementation */
  docComment?: string;
}
interface GeneratorMutatorParsingInfo {
  numberOfParams: number;
  returnNumberOfParams?: number;
}
interface GeneratorMutator {
  name: string;
  path: string;
  default: boolean;
  hasErrorType: boolean;
  errorTypeName: string;
  hasSecondArg: boolean;
  hasThirdArg: boolean;
  isHook: boolean;
  bodyTypeName?: string;
}
type ClientBuilder = (verbOptions: GeneratorVerbOptions, options: GeneratorOptions, outputClient: OutputClient | OutputClientFunc, output?: NormalizedOutputOptions) => GeneratorClient | Promise<GeneratorClient>;
interface ClientFileBuilder {
  path: string;
  content: string;
}
type ClientExtraFilesBuilder = (verbOptions: Record<string, GeneratorVerbOptions>, output: NormalizedOutputOptions, context: ContextSpec) => Promise<ClientFileBuilder[]>;
type ClientHeaderBuilder = (params: {
  title: string;
  isRequestOptions: boolean;
  isMutator: boolean;
  noFunction?: boolean;
  isGlobalMutator: boolean;
  provideIn: boolean | 'root' | 'any';
  hasAwaitedType: boolean;
  output: NormalizedOutputOptions;
  verbOptions: Record<string, GeneratorVerbOptions>;
  tag?: string;
  clientImplementation: string;
}) => string;
type ClientFooterBuilder = (params: {
  noFunction?: boolean | undefined;
  operationNames: string[];
  title?: string;
  hasAwaitedType: boolean;
  hasMutator: boolean;
}) => string;
type ClientTitleBuilder = (title: string) => string;
type ClientDependenciesBuilder = (hasGlobalMutator: boolean, hasParamsSerializerOptions: boolean, packageJson?: PackageJson, httpClient?: OutputHttpClient, hasTagsMutator?: boolean, override?: NormalizedOverrideOutput) => GeneratorDependency[];
interface ClientMockGeneratorImplementation {
  function: string;
  handlerName: string;
  handler: string;
}
interface ClientMockGeneratorBuilder {
  imports: GeneratorImport[];
  implementation: ClientMockGeneratorImplementation;
}
type ClientMockBuilder = (verbOptions: GeneratorVerbOptions, generatorOptions: GeneratorOptions) => ClientMockGeneratorBuilder;
interface ClientGeneratorsBuilder {
  client: ClientBuilder;
  header?: ClientHeaderBuilder;
  dependencies?: ClientDependenciesBuilder;
  footer?: ClientFooterBuilder;
  title?: ClientTitleBuilder;
  extraFiles?: ClientExtraFilesBuilder;
}
type GeneratorClients = Record<OutputClient, ClientGeneratorsBuilder>;
interface GetterResponse {
  imports: GeneratorImport[];
  definition: {
    success: string;
    errors: string;
  };
  isBlob: boolean;
  types: {
    success: ResReqTypesValue[];
    errors: ResReqTypesValue[];
  };
  contentTypes: string[];
  schemas: GeneratorSchema[];
  originalSchema?: OpenApiResponsesObject;
}
interface GetterBody {
  originalSchema: OpenApiReferenceObject | OpenApiRequestBodyObject;
  imports: GeneratorImport[];
  definition: string;
  implementation: string;
  schemas: GeneratorSchema[];
  formData?: string;
  formUrlEncoded?: string;
  contentType: string;
  isOptional: boolean;
}
interface GetterParameters {
  query: {
    parameter: OpenApiParameterObject;
    imports: GeneratorImport[];
  }[];
  path: {
    parameter: OpenApiParameterObject;
    imports: GeneratorImport[];
  }[];
  header: {
    parameter: OpenApiParameterObject;
    imports: GeneratorImport[];
  }[];
}
interface GetterParam {
  name: string;
  definition: string;
  implementation: string;
  default: unknown;
  required: boolean;
  imports: GeneratorImport[];
}
type GetterParams = GetterParam[];
interface GetterQueryParam {
  schema: GeneratorSchema;
  deps: GeneratorSchema[];
  isOptional: boolean;
  originalSchema?: OpenApiSchemaObject;
  requiredNullableKeys?: string[];
}
type GetterPropType = 'param' | 'body' | 'queryParam' | 'header' | 'namedPathParams';
declare const GetterPropType: {
  readonly PARAM: "param";
  readonly NAMED_PATH_PARAMS: "namedPathParams";
  readonly BODY: "body";
  readonly QUERY_PARAM: "queryParam";
  readonly HEADER: "header";
};
interface GetterPropBase {
  name: string;
  definition: string;
  implementation: string;
  default: unknown;
  required: boolean;
}
type GetterProp = GetterPropBase & ({
  type: 'namedPathParams';
  destructured: string;
  schema: GeneratorSchema;
} | {
  type: Exclude<GetterPropType, 'namedPathParams'>;
});
type GetterProps = GetterProp[];
type SchemaType = 'integer' | 'number' | 'string' | 'boolean' | 'object' | 'null' | 'array' | 'enum' | 'unknown';
declare const SchemaType: {
  integer: string;
  number: string;
  string: string;
  boolean: string;
  object: string;
  null: string;
  array: string;
  enum: string;
  unknown: string;
};
interface ScalarValue {
  value: string;
  useTypeAlias?: boolean;
  isEnum: boolean;
  hasReadonlyProps: boolean;
  type: SchemaType;
  imports: GeneratorImport[];
  schemas: GeneratorSchema[];
  isRef: boolean;
  dependencies: string[];
  example?: unknown;
  examples?: Record<string, unknown> | unknown[];
}
type ResolverValue = ScalarValue & {
  originalSchema: OpenApiSchemaObject;
};
type ResReqTypesValue = ScalarValue & {
  formData?: string;
  formUrlEncoded?: string;
  isRef?: boolean;
  hasReadonlyProps?: boolean;
  key: string;
  contentType: string;
  originalSchema?: OpenApiSchemaObject;
};
interface WriteSpecBuilder {
  operations: GeneratorOperations;
  verbOptions: Record<string, GeneratorVerbOptions>;
  schemas: GeneratorSchema[];
  title: GeneratorClientTitle;
  header: GeneratorClientHeader;
  footer: GeneratorClientFooter;
  imports: GeneratorClientImports;
  importsMock: GenerateMockImports;
  extraFiles: ClientFileBuilder[];
  info: OpenApiInfoObject;
  target: string;
  spec: OpenApiDocument;
}
interface WriteModeProps {
  builder: WriteSpecBuilder;
  output: NormalizedOutputOptions;
  workspace: string;
  projectName?: string;
  header: string;
  needSchema: boolean;
  generateSchemasInline?: () => string;
}
interface GeneratorApiOperations {
  verbOptions: Record<string, GeneratorVerbOptions>;
  operations: GeneratorOperations;
  schemas: GeneratorSchema[];
}
interface GeneratorClientExtra {
  implementation: string;
  implementationMock: string;
}
type GeneratorClientTitle = (data: {
  outputClient?: OutputClient | OutputClientFunc;
  title: string;
  customTitleFunc?: (title: string) => string;
  output: NormalizedOutputOptions;
}) => GeneratorClientExtra;
type GeneratorClientHeader = (data: {
  outputClient?: OutputClient | OutputClientFunc;
  isRequestOptions: boolean;
  isMutator: boolean;
  isGlobalMutator: boolean;
  provideIn: boolean | 'root' | 'any';
  hasAwaitedType: boolean;
  titles: GeneratorClientExtra;
  output: NormalizedOutputOptions;
  verbOptions: Record<string, GeneratorVerbOptions>;
  tag?: string;
  clientImplementation: string;
}) => GeneratorClientExtra;
type GeneratorClientFooter = (data: {
  outputClient: OutputClient | OutputClientFunc;
  operationNames: string[];
  hasMutator: boolean;
  hasAwaitedType: boolean;
  titles: GeneratorClientExtra;
  output: NormalizedOutputOptions;
}) => GeneratorClientExtra;
type GeneratorClientImports = (data: {
  client: OutputClient | OutputClientFunc;
  implementation: string;
  imports: readonly GeneratorDependency[];
  projectName?: string;
  hasSchemaDir: boolean;
  isAllowSyntheticDefaultImports: boolean;
  hasGlobalMutator: boolean;
  hasTagsMutator: boolean;
  hasParamsSerializerOptions: boolean;
  packageJson?: PackageJson;
  output: NormalizedOutputOptions;
}) => string;
type GenerateMockImports = (data: {
  implementation: string;
  imports: readonly GeneratorDependency[];
  projectName?: string;
  hasSchemaDir: boolean;
  isAllowSyntheticDefaultImports: boolean;
  options?: GlobalMockOptions;
}) => string;
type GeneratorApiBuilder = GeneratorApiOperations & {
  title: GeneratorClientTitle;
  header: GeneratorClientHeader;
  footer: GeneratorClientFooter;
  imports: GeneratorClientImports;
  importsMock: GenerateMockImports;
  extraFiles: ClientFileBuilder[];
};
declare class ErrorWithTag extends Error {
  tag: string;
  constructor(message: string, tag: string, options?: ErrorOptions);
}
type OpenApiSchemaObjectType = 'string' | 'number' | 'boolean' | 'object' | 'integer' | 'null' | 'array';
type OpenApiDocument = OpenAPIV3_1.Document;
type OpenApiSchemaObject = OpenAPIV3_1.SchemaObject;
type OpenApiSchemasObject = Record<string, OpenApiSchemaObject>;
type OpenApiReferenceObject = OpenAPIV3_1.ReferenceObject & {
  $ref?: string;
};
type OpenApiComponentsObject = OpenAPIV3_1.ComponentsObject;
type OpenApiPathsObject = OpenAPIV3_1.PathsObject;
type OpenApiPathItemObject = OpenAPIV3_1.PathItemObject;
type OpenApiResponsesObject = OpenAPIV3_1.ResponsesObject;
type OpenApiResponseObject = OpenAPIV3_1.ResponseObject;
type OpenApiParameterObject = OpenAPIV3_1.ParameterObject;
type OpenApiRequestBodyObject = OpenAPIV3_1.RequestBodyObject;
type OpenApiInfoObject = OpenAPIV3_1.InfoObject;
type OpenApiExampleObject = OpenAPIV3_1.ExampleObject;
type OpenApiOperationObject = OpenAPIV3_1.OperationObject;
type OpenApiMediaTypeObject = OpenAPIV3_1.MediaTypeObject;
type OpenApiEncodingObject = OpenAPIV3_1.EncodingObject;
type OpenApiServerObject = OpenAPIV3_1.ServerObject;
//#endregion
//#region src/constants.d.ts
declare const generalJSTypes: string[];
declare const generalJSTypesWithArray: string[];
declare const VERBS_WITH_BODY: Verbs[];
declare const URL_REGEX: RegExp;
declare const TEMPLATE_TAG_REGEX: RegExp;
//#endregion
//#region src/generators/component-definition.d.ts
declare function generateComponentDefinition(responses: OpenApiComponentsObject['responses'] | OpenApiComponentsObject['requestBodies'], context: ContextSpec, suffix: string): GeneratorSchema[];
//#endregion
//#region src/generators/imports.d.ts
interface GenerateImportsOptions {
  imports: readonly GeneratorImport[];
  namingConvention?: NamingConvention;
}
declare function generateImports({
  imports,
  namingConvention
}: GenerateImportsOptions): string;
interface GenerateMutatorImportsOptions {
  mutators: GeneratorMutator[];
  implementation?: string;
  oneMore?: boolean;
}
declare function generateMutatorImports({
  mutators,
  implementation,
  oneMore
}: GenerateMutatorImportsOptions): string;
interface AddDependencyOptions {
  implementation: string;
  exports: readonly GeneratorImport[];
  dependency: string;
  projectName?: string;
  hasSchemaDir: boolean;
  isAllowSyntheticDefaultImports: boolean;
}
declare function addDependency({
  implementation,
  exports,
  dependency,
  projectName,
  isAllowSyntheticDefaultImports
}: AddDependencyOptions): string | undefined;
declare function generateDependencyImports(implementation: string, imports: {
  exports: readonly GeneratorImport[];
  dependency: string;
}[], projectName: string | undefined, hasSchemaDir: boolean, isAllowSyntheticDefaultImports: boolean): string;
declare function generateVerbImports({
  response,
  body,
  queryParams,
  props,
  headers,
  params
}: GeneratorVerbOptions): GeneratorImport[];
//#endregion
//#region src/generators/input-filters.d.ts
declare const COMPONENT_TYPES: readonly ["schemas", "responses", "parameters", "requestBodies"];
type ComponentType = (typeof COMPONENT_TYPES)[number];
declare function filteredVerbs(verbs: OpenApiPathItemObject, filters: NormalizedInputOptions['filters']): [string, any][];
declare const collectReferencedComponents: (spec: OpenApiDocument, tags: (string | RegExp)[], mode: InputFiltersOptions["mode"]) => Record<ComponentType, string[]>;
//#endregion
//#region src/generators/models-inline.d.ts
declare function generateModelInline(acc: string, model: string): string;
declare function generateModelsInline(obj: Record<string, GeneratorSchema[]> | GeneratorSchema[]): string;
//#endregion
//#region src/generators/mutator.d.ts
declare const BODY_TYPE_NAME = "BodyType";
interface GenerateMutatorOptions {
  output?: string;
  mutator?: NormalizedMutator;
  name: string;
  workspace: string;
  tsconfig?: Tsconfig;
}
declare function generateMutator({
  output,
  mutator,
  name,
  workspace,
  tsconfig
}: GenerateMutatorOptions): Promise<GeneratorMutator | undefined>;
//#endregion
//#region src/generators/options.d.ts
/**
 * Filters query params for Angular's HttpClient.
 *
 * Why: Angular's HttpParams / HttpClient `params` type does not accept `null` or
 * `undefined` values, and arrays must only contain string/number/boolean.
 * Orval models often include nullable query params, so we remove nullish values
 * (including nulls inside arrays) before passing params to HttpClient or a
 * paramsSerializer to avoid runtime and type issues.
 *
 * Returns an inline IIFE expression. For paths that benefit from a shared helper
 * (e.g. observe-mode branches), prefer getAngularFilteredParamsCallExpression +
 * getAngularFilteredParamsHelperBody instead.
 */
declare const getAngularFilteredParamsExpression: (paramsExpression: string, requiredNullableParamKeys?: string[], preserveRequiredNullables?: boolean) => string;
/**
 * Returns the body of a standalone `filterParams` helper function
 * to be emitted once in the generated file header, replacing the
 * inline IIFE that was previously duplicated in every method.
 */
declare const getAngularFilteredParamsHelperBody: () => string;
/**
 * Returns a call expression to the `filterParams` helper function.
 */
declare const getAngularFilteredParamsCallExpression: (paramsExpression: string, requiredNullableParamKeys?: string[], preserveRequiredNullables?: boolean) => string;
interface GenerateFormDataAndUrlEncodedFunctionOptions {
  body: GetterBody;
  formData?: GeneratorMutator;
  formUrlEncoded?: GeneratorMutator;
  isFormData: boolean;
  isFormUrlEncoded: boolean;
}
declare function generateBodyOptions(body: GetterBody, isFormData: boolean, isFormUrlEncoded: boolean): string;
interface GenerateAxiosOptions {
  response: GetterResponse;
  isExactOptionalPropertyTypes: boolean;
  angularObserve?: 'body' | 'events' | 'response';
  angularParamsRef?: string;
  requiredNullableQueryParamKeys?: string[];
  queryParams?: GeneratorSchema;
  headers?: GeneratorSchema;
  requestOptions?: object | boolean;
  hasSignal: boolean;
  hasSignalParam?: boolean;
  isVue: boolean;
  isAngular: boolean;
  paramsSerializer?: GeneratorMutator;
  paramsSerializerOptions?: ParamsSerializerOptions;
}
declare function generateAxiosOptions({
  response,
  isExactOptionalPropertyTypes,
  angularObserve,
  angularParamsRef,
  requiredNullableQueryParamKeys,
  queryParams,
  headers,
  requestOptions,
  hasSignal,
  hasSignalParam,
  isVue,
  isAngular,
  paramsSerializer,
  paramsSerializerOptions
}: GenerateAxiosOptions): string;
interface GenerateOptionsOptions {
  route: string;
  body: GetterBody;
  angularObserve?: 'body' | 'events' | 'response';
  angularParamsRef?: string;
  headers?: GetterQueryParam;
  queryParams?: GetterQueryParam;
  response: GetterResponse;
  verb: Verbs;
  requestOptions?: object | boolean;
  isFormData: boolean;
  isFormUrlEncoded: boolean;
  isAngular?: boolean;
  isExactOptionalPropertyTypes: boolean;
  hasSignal: boolean;
  hasSignalParam?: boolean;
  isVue?: boolean;
  paramsSerializer?: GeneratorMutator;
  paramsSerializerOptions?: ParamsSerializerOptions;
}
declare function generateOptions({
  route,
  body,
  angularObserve,
  angularParamsRef,
  headers,
  queryParams,
  response,
  verb,
  requestOptions,
  isFormData,
  isFormUrlEncoded,
  isAngular,
  isExactOptionalPropertyTypes,
  hasSignal,
  hasSignalParam,
  isVue,
  paramsSerializer,
  paramsSerializerOptions
}: GenerateOptionsOptions): string;
declare function generateBodyMutatorConfig(body: GetterBody, isFormData: boolean, isFormUrlEncoded: boolean): string;
declare function generateQueryParamsAxiosConfig(response: GetterResponse, isVue: boolean, isAngular: boolean, requiredNullableQueryParamKeys?: string[], queryParams?: GetterQueryParam): string;
interface GenerateMutatorConfigOptions {
  route: string;
  body: GetterBody;
  headers?: GetterQueryParam;
  queryParams?: GetterQueryParam;
  response: GetterResponse;
  verb: Verbs;
  isFormData: boolean;
  isFormUrlEncoded: boolean;
  hasSignal: boolean;
  hasSignalParam?: boolean;
  isExactOptionalPropertyTypes: boolean;
  isVue?: boolean;
  isAngular?: boolean;
}
declare function generateMutatorConfig({
  route,
  body,
  headers,
  queryParams,
  response,
  verb,
  isFormData,
  isFormUrlEncoded,
  hasSignal,
  hasSignalParam,
  isExactOptionalPropertyTypes,
  isVue,
  isAngular
}: GenerateMutatorConfigOptions): string;
declare function generateMutatorRequestOptions(requestOptions: boolean | object | undefined, hasSecondArgument: boolean): string;
declare function generateFormDataAndUrlEncodedFunction({
  body,
  formData,
  formUrlEncoded,
  isFormData,
  isFormUrlEncoded
}: GenerateFormDataAndUrlEncodedFunctionOptions): string;
//#endregion
//#region src/generators/parameter-definition.d.ts
declare function generateParameterDefinition(parameters: OpenApiComponentsObject['parameters'], context: ContextSpec, suffix: string): GeneratorSchema[];
//#endregion
//#region src/generators/schema-definition.d.ts
/**
 * Extract all types from #/components/schemas
 */
declare function generateSchemasDefinition(schemas: OpenApiSchemasObject | undefined, context: ContextSpec, suffix: string, filters?: InputFiltersOptions): GeneratorSchema[];
//#endregion
//#region src/generators/verbs-options.d.ts
interface GenerateVerbOptionsParams {
  verb: Verbs;
  output: NormalizedOutputOptions;
  operation: OpenApiOperationObject;
  route: string;
  pathRoute: string;
  verbParameters?: OpenApiPathItemObject['parameters'];
  components?: OpenApiComponentsObject;
  context: ContextSpec;
}
declare function generateVerbOptions({
  verb,
  output,
  operation,
  route,
  pathRoute,
  verbParameters,
  context
}: GenerateVerbOptionsParams): Promise<GeneratorVerbOptions[]>;
interface GenerateVerbsOptionsParams {
  verbs: OpenApiPathItemObject;
  input: NormalizedInputOptions;
  output: NormalizedOutputOptions;
  route: string;
  pathRoute: string;
  context: ContextSpec;
}
declare function generateVerbsOptions({
  verbs,
  input,
  output,
  route,
  pathRoute,
  context
}: GenerateVerbsOptionsParams): Promise<GeneratorVerbsOptions>;
//#endregion
//#region src/getters/object.d.ts
/**
 * Context for multipart/form-data type generation.
 * Discriminated union with two states:
 *
 * 1. `{ atPart: false, encoding }` - At form-data root, before property iteration
 *    - May traverse through allOf/anyOf/oneOf to reach properties
 *    - Carries encoding map so getObject can look up `encoding[key]`
 *
 * 2. `{ atPart: true, partContentType }` - At a multipart part (top-level property)
 *    - `partContentType` = Encoding Object's `contentType` for this part
 *    - Used by getScalar for file type detection (precedence over contentMediaType)
 *    - Arrays pass this through to items; combiners inside arrays also get context
 *
 * `undefined` means not in form-data context (or nested inside plain object field = JSON)
 */
type FormDataContext = {
  atPart: false;
  encoding: Record<string, {
    contentType?: string;
  }>;
} | {
  atPart: true;
  partContentType?: string;
};
interface GetObjectOptions {
  item: OpenApiSchemaObject;
  name?: string;
  context: ContextSpec;
  nullable: string;
  /**
   * Multipart/form-data context for file type handling.
   * @see FormDataContext
   */
  formDataContext?: FormDataContext;
}
/**
 * Return the output type from an object
 *
 * @param item item with type === "object"
 */
declare function getObject({
  item,
  name,
  context,
  nullable,
  formDataContext
}: GetObjectOptions): ScalarValue;
//#endregion
//#region src/getters/array.d.ts
interface GetArrayOptions {
  schema: OpenApiSchemaObject;
  name?: string;
  context: ContextSpec;
  formDataContext?: FormDataContext;
}
/**
 * Return the output type from an array
 *
 * @param item item with type === "array"
 */
declare function getArray({
  schema,
  name,
  context,
  formDataContext
}: GetArrayOptions): ScalarValue;
//#endregion
//#region src/getters/body.d.ts
interface GetBodyOptions {
  requestBody: OpenApiReferenceObject | OpenApiRequestBodyObject;
  operationName: string;
  context: ContextSpec;
  contentType?: OverrideOutputContentType;
}
declare function getBody({
  requestBody,
  operationName,
  context,
  contentType
}: GetBodyOptions): GetterBody;
/**
 * Returns per-content-type bodies when `splitByContentType` is enabled.
 * Each entry includes a `contentTypeSuffix` for generating distinct function names.
 */
declare function getBodiesByContentType({
  requestBody,
  operationName,
  context,
  contentType
}: GetBodyOptions): (GetterBody & {
  contentTypeSuffix: string;
})[];
//#endregion
//#region src/getters/combine.d.ts
type Separator = 'allOf' | 'anyOf' | 'oneOf';
declare function combineSchemas({
  name,
  schema,
  separator,
  context,
  nullable,
  formDataContext
}: {
  name?: string;
  schema: OpenApiSchemaObject;
  separator: Separator;
  context: ContextSpec;
  nullable: string;
  formDataContext?: FormDataContext;
}): ScalarValue;
//#endregion
//#region src/getters/discriminators.d.ts
declare function resolveDiscriminators(schemas: OpenApiSchemasObject, context: ContextSpec): OpenApiSchemasObject;
//#endregion
//#region src/getters/enum.d.ts
declare function getEnumNames(schemaObject: OpenApiSchemaObject | undefined): (string | undefined)[] | undefined;
declare function getEnumDescriptions(schemaObject: OpenApiSchemaObject | undefined): (string | undefined)[] | undefined;
declare function getEnum(value: string, enumName: string, names: (string | undefined)[] | undefined, enumGenerationType: EnumGeneration, descriptions?: (string | undefined)[], enumNamingConvention?: NamingConvention): string;
declare function getEnumImplementation(value: string, names?: (string | undefined)[], descriptions?: (string | undefined)[], enumNamingConvention?: NamingConvention): string;
interface CombinedEnumInput {
  value: string;
  isRef: boolean;
  schema: OpenApiSchemaObject | undefined;
}
interface CombinedEnumValue {
  value: string;
  valueImports: string[];
  hasNull: boolean;
}
declare function getEnumUnionFromSchema(schema: OpenApiSchemaObject | undefined): string;
declare function getCombinedEnumValue(inputs: CombinedEnumInput[]): CombinedEnumValue;
//#endregion
//#region src/getters/keys.d.ts
declare function getKey(key: string): string;
//#endregion
//#region src/getters/operation.d.ts
declare function getOperationId(operation: OpenApiOperationObject, route: string, verb: Verbs): string;
//#endregion
//#region src/getters/parameters.d.ts
interface GetParametersOptions {
  parameters: (OpenApiReferenceObject | OpenApiParameterObject)[];
  context: ContextSpec;
}
declare function getParameters({
  parameters,
  context
}: GetParametersOptions): GetterParameters;
//#endregion
//#region src/getters/params.d.ts
/**
 * Return every params in a path
 *
 * @example
 * ```
 * getParamsInPath("/pet/{category}/{name}/");
 * // => ["category", "name"]
 * ```
 * @param path
 */
declare function getParamsInPath(path: string): string[];
interface GetParamsOptions {
  route: string;
  pathParams?: GetterParameters['query'];
  operationId: string;
  context: ContextSpec;
  output: NormalizedOutputOptions;
}
declare function getParams({
  route,
  pathParams,
  operationId,
  context,
  output
}: GetParamsOptions): GetterParams;
//#endregion
//#region src/getters/props.d.ts
interface GetPropsOptions {
  body: GetterBody;
  queryParams?: GetterQueryParam;
  params: GetterParams;
  operationName: string;
  headers?: GetterQueryParam;
  context: ContextSpec;
}
declare function getProps({
  body,
  queryParams,
  params,
  operationName,
  headers,
  context
}: GetPropsOptions): GetterProps;
//#endregion
//#region src/getters/query-params.d.ts
interface GetQueryParamsOptions {
  queryParams: GetterParameters['query'];
  operationName: string;
  context: ContextSpec;
  suffix?: string;
}
declare function getQueryParams({
  queryParams,
  operationName,
  context,
  suffix
}: GetQueryParamsOptions): GetterQueryParam | undefined;
//#endregion
//#region src/getters/ref.d.ts
type RefComponent = 'schemas' | 'responses' | 'parameters' | 'requestBodies';
declare const RefComponent: {
  schemas: RefComponent;
  responses: RefComponent;
  parameters: RefComponent;
  requestBodies: RefComponent;
};
declare const RefComponentSuffix: Record<RefComponent, string>;
interface RefInfo {
  name: string;
  originalName: string;
  refPaths?: string[];
}
/**
 * Return the output type from the $ref
 *
 * @param $ref
 */
declare function getRefInfo($ref: string, context: ContextSpec): RefInfo;
//#endregion
//#region src/getters/res-req-types.d.ts
declare function getResReqTypes(responsesOrRequests: [string, OpenApiReferenceObject | OpenApiResponseObject | OpenApiRequestBodyObject][], name: string, context: ContextSpec, defaultType?: string, uniqueKey?: (item: ResReqTypesValue, index: number, data: ResReqTypesValue[]) => unknown): ResReqTypesValue[];
/**
 * Response type categories for HTTP client response parsing.
 * Maps to Angular HttpClient's responseType, Axios responseType, and Fetch response methods.
 */
type ResponseTypeCategory = 'json' | 'text' | 'blob' | 'arraybuffer';
/**
 * Determine the responseType option based on success content types only.
 * This avoids error-response content types influencing the responseType.
 */
declare function getSuccessResponseType(response: GetterResponse): 'blob' | 'text' | undefined;
/**
 * Determine the response type category for a given content type.
 * Used to set the correct responseType option in HTTP clients.
 *
 * @param contentType - The MIME content type (e.g., 'application/json', 'text/plain')
 * @returns The response type category to use for parsing
 */
declare function getResponseTypeCategory(contentType: string): ResponseTypeCategory;
/**
 * Get the default content type from a list of content types.
 * Priority: application/json > any JSON-like type > first in list
 *
 * @param contentTypes - Array of content types from OpenAPI spec
 * @returns The default content type to use
 */
declare function getDefaultContentType(contentTypes: string[]): string;
//#endregion
//#region src/getters/response.d.ts
interface GetResponseOptions {
  responses: OpenApiResponsesObject;
  operationName: string;
  context: ContextSpec;
  contentType?: OverrideOutputContentType;
}
declare function getResponse({
  responses,
  operationName,
  context,
  contentType
}: GetResponseOptions): GetterResponse;
//#endregion
//#region src/getters/route.d.ts
declare function getRoute(route: string): string;
declare function getFullRoute(route: string, servers: OpenApiServerObject[] | undefined, baseUrl: string | BaseUrlFromConstant | BaseUrlFromSpec | BaseUrlRuntime | undefined): string;
/**
 * Returns `GeneratorImport` entries for {@link BaseUrlRuntime.imports} when `baseUrl` is a runtime config.
 *
 * Defaults `values` to true so symbols in `runtime` emit as value imports in the
 * generated client. Set `values: false` explicitly only for unusual cases (e.g.
 * type-only symbols referenced from the expression).
 */
declare function getBaseUrlRuntimeImports(baseUrl?: NormalizedOutputOptions['baseUrl']): GeneratorImport[];
declare function getRouteAsArray(route: string): string;
//#endregion
//#region src/getters/scalar.d.ts
interface GetScalarOptions {
  item: OpenApiSchemaObject;
  name?: string;
  context: ContextSpec;
  formDataContext?: FormDataContext;
}
/**
 * Return the typescript equivalent of open-api data type
 *
 * @param item
 * @ref https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.1.md#data-types
 */
declare function getScalar({
  item,
  name,
  context,
  formDataContext
}: GetScalarOptions): ScalarValue;
//#endregion
//#region src/resolvers/object.d.ts
interface ResolveOptions {
  schema: OpenApiSchemaObject | OpenApiReferenceObject;
  propName?: string;
  combined?: boolean;
  context: ContextSpec;
  formDataContext?: FormDataContext;
}
interface CreateTypeAliasOptions {
  resolvedValue: ResolverValue;
  propName: string | undefined;
  context: ContextSpec;
}
/**
 * Wraps inline object type in a type alias.
 * E.g. `{ foo: string }` → value becomes `FooBody`, schema gets `export type FooBody = { foo: string };`
 */
declare function createTypeAliasIfNeeded({
  resolvedValue,
  propName,
  context
}: CreateTypeAliasOptions): ScalarValue | undefined;
declare function resolveObject({
  schema,
  propName,
  combined,
  context,
  formDataContext
}: ResolveOptions): ResolverValue;
//#endregion
//#region src/resolvers/ref.d.ts
type Example = OpenApiExampleObject | OpenApiReferenceObject;
type ResolvedExample = unknown;
type Examples = Example[] | Record<string, Example> | ResolvedExample[] | Record<string, ResolvedExample> | undefined;
/**
 * Recursively resolves a `$ref` in an OpenAPI document, following
 * nested schema refs and collecting imports along the way.
 *
 * Handles OpenAPI 3.0 `nullable` and 3.1 type-array hints on direct refs.
 *
 * @see https://spec.openapis.org/oas/v3.0.3#reference-object
 * @see https://spec.openapis.org/oas/v3.1.0#reference-object
 */
declare function resolveRef<TSchema extends object = OpenApiComponentsObject>(schema: OpenApiComponentsObject | OpenApiReferenceObject, context: ContextSpec, imports?: GeneratorImport[]): {
  schema: TSchema;
  imports: GeneratorImport[];
};
/** Recursively resolves `$ref` entries in an examples array or record. */
declare function resolveExampleRefs(examples: Examples, context: ContextSpec): ResolvedExample[] | Record<string, ResolvedExample> | undefined;
//#endregion
//#region src/resolvers/value.d.ts
interface ResolveValueOptions {
  schema: OpenApiSchemaObject | OpenApiReferenceObject;
  name?: string;
  context: ContextSpec;
  formDataContext?: FormDataContext;
}
declare function resolveValue({
  schema,
  name,
  context,
  formDataContext
}: ResolveValueOptions): ResolverValue;
//#endregion
//#region src/utils/assertion.d.ts
/**
 * Discriminator helper for `ReferenceObject`
 *
 * @param property
 */
declare function isReference(obj: object): obj is OpenApiReferenceObject;
declare function isDirectory(pathValue: string): boolean;
declare function isObject(x: unknown): x is Record<string, unknown>;
declare function isStringLike(val: unknown): val is string;
declare function isModule(x: unknown): x is Record<string, unknown>;
declare function isNumeric(x: unknown): x is number;
declare function isSchema(x: unknown): x is OpenApiSchemaObject;
declare function isVerb(verb: string): verb is Verbs;
declare function isUrl(str: string): boolean;
//#endregion
//#region src/utils/async-reduce.d.ts
declare function asyncReduce<IterationItem, AccValue>(array: IterationItem[], reducer: (accumulate: AccValue, current: IterationItem) => AccValue | Promise<AccValue>, initValue: AccValue): Promise<AccValue>;
//#endregion
//#region src/utils/case.d.ts
declare function pascal(s?: string): string;
declare function camel(s?: string): string;
declare function snake(s?: string): string;
declare function kebab(s?: string): string;
declare function upper(s: string, fillWith: string, isDeapostrophe?: boolean): string;
declare function conventionName(name: string, convention: NamingConvention): string;
//#endregion
//#region src/utils/compare-version.d.ts
declare function compareVersions(firstVersion: string, secondVersions: string, operator?: CompareOperator): boolean;
//#endregion
//#region src/utils/content-type.d.ts
/**
 * Determine if a content type is binary.
 * Only known binary types return true. Unknown types default to false (non-binary)
 * so that schema type information is preserved rather than being overridden with Blob.
 */
declare function isBinaryContentType(contentType: string): boolean;
/**
 * Determine if a form-data field should be treated as a file (binary or text).
 *
 * Precedence (per OAS 3.1): encoding.contentType > schema.contentMediaType
 *
 * Returns:
 * - 'binary': binary file (Blob)
 * - 'text': text file (Blob | string)
 * - undefined: not a file, use standard string resolution
 */
declare function getFormDataFieldFileType(resolvedSchema: OpenApiSchemaObject, partContentType: string | undefined): 'binary' | 'text' | undefined;
/**
 * Filter configuration for content types
 */
interface ContentTypeFilter {
  include?: string[];
  exclude?: string[];
}
/**
 * Filters items by content type based on include/exclude rules
 *
 * @param items - Array of items with contentType property
 * @param filter - Optional filter configuration
 * @returns Filtered array
 *
 * @example
 * ```ts
 * const types = [
 *   { contentType: 'application/json', value: '...' },
 *   { contentType: 'text/xml', value: '...' }
 * ];
 *
 * // Include only JSON
 * filterByContentType(types, { include: ['application/json'] });
 *
 * // Exclude XML
 * filterByContentType(types, { exclude: ['text/xml'] });
 * ```
 */
declare function filterByContentType<T extends {
  contentType: string;
}>(items: T[], filter?: ContentTypeFilter): T[];
//#endregion
//#region src/utils/debug.d.ts
interface DebuggerOptions {
  onlyWhenFocused?: boolean | string;
}
declare function createDebugger(ns: string, options?: DebuggerOptions): debug.Debugger['log'];
//#endregion
//#region src/utils/deep-non-nullable.d.ts
type DeepNonNullable<T> = T extends ((...args: never[]) => unknown) ? T : T extends readonly (infer U)[] ? DeepNonNullable<NonNullable<U>>[] : T extends object ? { [K in keyof T]: DeepNonNullable<NonNullable<T[K]>> } : NonNullable<T>;
//#endregion
//#region src/utils/doc.d.ts
interface JsDocSchema extends Record<string, unknown> {
  description?: string[] | string;
  deprecated?: boolean;
  summary?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  minItems?: number;
  maxItems?: number;
  type?: string | string[];
  pattern?: string;
}
declare function jsDoc(schema: object & JsDocSchema, tryOneLine?: boolean, context?: ContextSpec): string;
declare function keyValuePairsToJsDoc(keyValues: {
  key: string;
  value: string;
}[]): string;
//#endregion
//#region src/utils/dynamic-import.d.ts
declare function dynamicImport<T>(toImport: T | string, from?: string, takeDefault?: boolean): Promise<T>;
//#endregion
//#region src/utils/extension.d.ts
declare function getExtension(path: string): "yaml" | "json";
//#endregion
//#region src/utils/file.d.ts
declare function getFileInfo(target?: string, {
  backupFilename,
  extension
}?: {
  backupFilename?: string;
  extension?: string;
}): {
  path: string;
  pathWithoutExtension: string;
  extension: string;
  isDirectory: boolean;
  dirname: string;
  filename: string;
};
declare function removeFilesAndEmptyFolders(patterns: string[], dir: string): Promise<void>;
//#endregion
//#region src/utils/file-extensions.d.ts
declare function getMockFileExtensionByTypeName(mock: GlobalMockOptions | ClientMockBuilder): string;
//#endregion
//#region src/utils/get-property-safe.d.ts
/**
 * Type safe way to get arbitrary property from an object.
 *
 * @param obj - The object from which to retrieve the property.
 * @param propertyName - The name of the property to retrieve.
 * @returns Object with `hasProperty: true` and `value` of the property if it exists; otherwise `hasProperty: false` and undefined.
 *
 * @remarks Until TypeScript adds type-narrowing for Object.hasOwn we have to use this workaround
 */
declare function getPropertySafe<T extends object, K extends keyof T>(obj: T, propertyName: K | string): {
  hasProperty: true;
  value: T[K];
} | {
  hasProperty: false;
  value: undefined;
};
//#endregion
//#region src/utils/is-body-verb.d.ts
declare function getIsBodyVerb(verb: Verbs): boolean;
//#endregion
//#region src/utils/logger.d.ts
declare const log: (message?: any, ...optionalParams: any[]) => void;
declare function logWarning(message: string): void;
declare function getWarningCount(): number;
declare function resetWarnings(): void;
declare function setVerbose(v: boolean): void;
declare function isVerbose(): boolean;
declare const logVerbose: typeof console.log;
declare function startMessage({
  name,
  version,
  description
}: {
  name: string;
  version: string;
  description: string;
}): string;
declare function logError(err: unknown, tag?: string): void;
declare function mismatchArgsMessage(mismatchArgs: string[]): void;
declare function createSuccessMessage(backend?: string): void;
type LogType = 'error' | 'warn' | 'info';
type LogLevel = LogType | 'silent';
interface Logger {
  info(msg: string, options?: LogOptions): void;
  warn(msg: string, options?: LogOptions): void;
  warnOnce(msg: string, options?: LogOptions): void;
  error(msg: string, options?: LogOptions): void;
  clearScreen(type: LogType): void;
  hasWarned: boolean;
}
interface LogOptions {
  clear?: boolean;
  timestamp?: boolean;
}
declare const LogLevels: Record<LogLevel, number>;
interface LoggerOptions {
  prefix?: string;
  allowClearScreen?: boolean;
}
declare function createLogger(level?: LogLevel, options?: LoggerOptions): Logger;
//#endregion
//#region src/utils/merge-deep.d.ts
declare function mergeDeep<T extends object, U extends object>(source: T, target: U): T & U;
//#endregion
//#region src/utils/occurrence.d.ts
declare function count(str: string | undefined, key: string): number;
declare namespace path_d_exports {
  export { getRelativeImportPath, getSchemaFileName, join, joinSafe, normalizeSafe, relativeSafe, separator$1 as separator, toUnix };
}
declare function toUnix(value: string): string;
declare function join(...args: string[]): string;
/**
 * Behaves exactly like `path.relative(from, to)`, but keeps the first meaningful "./"
 */
declare function relativeSafe(from: string, to: string): string;
declare function getSchemaFileName(path: string): string;
declare const separator$1 = "/";
declare function normalizeSafe(value: string): string;
declare function joinSafe(...values: string[]): string;
/**
 * Given two absolute file paths, generates a valid ESM relative import path
 * from the 'importer' file to the 'exporter' file.
 *
 * @example
 * ```ts
 * getRelativeImportPath('/path/to/importer.ts', '/path/to/exporter.ts')
 * // => './exporter'
 * getRelativeImportPath('/path/to/importer.ts', '/path/to/sub/exporter.ts')
 * // => './sub/exporter'
 * getRelativeImportPath('/path/to/importer.ts', '/path/sibling/exporter.ts')
 * // => '../sibling/exporter'
 * ```
 *
 * This function handles path normalization, cross-platform separators, and
 * ensures the path is a valid ESM relative specifier (e.g., starts with './').
 *
 * @param importerFilePath - The absolute path of the file that will contain the import statement.
 * @param exporterFilePath - The absolute path of the file being imported.
 * @param [includeFileExtension=false] - Whether the import path should include the file extension, defaults to false.
 * @returns The relative import path string.
 */
declare function getRelativeImportPath(importerFilePath: string, exporterFilePath: string, includeFileExtension?: boolean): string;
//#endregion
//#region src/utils/resolve-version.d.ts
declare function resolveInstalledVersion(packageName: string, fromDir: string): string | undefined;
declare function resolveInstalledVersions(packageJson: PackageJson, fromDir: string): Record<string, string>;
//#endregion
//#region src/utils/sort.d.ts
declare const sortByPriority: <T>(arr: (T & {
  default?: unknown;
  required?: boolean;
})[]) => (T & {
  default?: unknown;
  required?: boolean;
})[];
//#endregion
//#region src/utils/string.d.ts
/**
 * Converts data to a string representation suitable for code generation.
 * Handles strings, numbers, booleans, functions, arrays, and objects.
 *
 * @param data - The data to stringify. Can be a string, array, object, number, boolean, function, null, or undefined.
 * @returns A string representation of the data, `null` for null, or undefined if data is undefined.
 * @example
 * stringify('hello') // returns "'hello'"
 * stringify(42) // returns "42"
 * stringify([1, 2, 3]) // returns "[1, 2, 3]"
 * stringify({ a: 1, b: 'test' }) // returns "{ a: 1, b: 'test', }"
 */
declare function stringify(data?: unknown): string | undefined;
/**
 * Sanitizes a string value by removing or replacing special characters and ensuring
 * it conforms to JavaScript identifier naming rules if needed.
 *
 * @param value - The string value to sanitize.
 * @param options - Configuration options for sanitization:
 *   - `whitespace` - Replacement string for whitespace characters, or `true` to keep them.
 *   - `underscore` - Replacement string for underscores, or `true` to keep them.
 *   - `dot` - Replacement string for dots, or `true` to keep them.
 *   - `dash` - Replacement string for dashes, or `true` to keep them.
 *   - `es5keyword` - If true, prefixes the value with underscore if it's an ES5 keyword.
 *   - `es5IdentifierName` - If true, ensures the value is a valid ES5 identifier name.
 *   - `special` - If true, preserves special characters that would otherwise be removed.
 * @returns The sanitized string value.
 * @example
 * sanitize('hello-world', { dash: '_' }) // returns "hello_world"
 * sanitize('class', { es5keyword: true }) // returns "_class"
 * sanitize('123abc', { es5IdentifierName: true }) // returns "N123abc"
 */
declare function sanitize(value: string, options?: {
  whitespace?: string | true;
  underscore?: string | true;
  dot?: string | true;
  dash?: string | true;
  es5keyword?: boolean;
  es5IdentifierName?: boolean;
  special?: boolean;
}): string;
/**
 * Converts an array of objects to a comma-separated string representation.
 * Optionally extracts a nested property from each object using a dot-notation path.
 *
 * @param props - Array of objects to convert to string.
 * @param path - Optional dot-notation path to extract a property from each object (e.g., "user.name").
 * @returns A comma-separated string of values, with each value on a new line indented.
 * @example
 * toObjectString([{ name: 'John' }, { name: 'Jane' }], 'name')
 * // returns "John,\n    Jane,"
 * toObjectString(['a', 'b', 'c'])
 * // returns "a,\n    b,\n    c,"
 */
declare function toObjectString<T>(props: T[], path?: keyof T): string;
/**
 * Converts a number to its word representation by translating each digit to its word form.
 *
 * @param num - The number to convert to words.
 * @returns A string containing the word representation of each digit concatenated together.
 * @example
 * getNumberWord(123) // returns "onetwothree"
 * getNumberWord(42) // returns "fourtwo"
 */
declare function getNumberWord(num: number): string;
/**
 * Escapes a specific character in a string by prefixing all of its occurrences with a backslash.
 *
 * @param str - The string to escape, or null.
 * @param char - The character to escape. Defaults to single quote (').
 * @returns The escaped string, or null if the input is null.
 * @example
 * escape("don't") // returns "don\'t"
 * escape("it's John's") // returns "it\'s John\'s"
 * escape('say "hello"', '"') // returns 'say \\"hello\\"'
 * escape("a'''b", "'") // returns "a\'\'\'b"
 */
declare function escape(str: string | null, char?: string): string | undefined;
/**
 * Escapes regular expression metacharacters in a string so it can be safely
 * embedded inside a RegExp pattern.
 *
 * @param value - The raw string value to escape for regex usage.
 * @returns The escaped string.
 * @example
 * escapeRegExp('foo$bar') // returns 'foo\\$bar'
 */
declare function escapeRegExp(value: string): string;
/**
 * Escape all characters not included in SingleStringCharacters and
 * DoubleStringCharacters on
 * http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4
 *
 * Based on https://github.com/joliss/js-string-escape/blob/master/index.js
 *
 * @param input String to escape
 */
declare function jsStringEscape(input: string): string;
/**
 * Deduplicates a TypeScript union type string.
 * Handles types like "A | B | B" → "A | B" and "null | null" → "null".
 * Only splits on top-level | (not inside {} () [] <> or string literals).
 */
declare function dedupeUnionType(unionType: string): string;
//#endregion
//#region src/utils/tsconfig.d.ts
declare function isSyntheticDefaultImportsAllow(config?: Tsconfig): boolean;
//#endregion
//#region src/writers/schemas.d.ts
/**
 * Split schemas into regular and operation types.
 */
declare function splitSchemasByType(schemas: GeneratorSchema[]): {
  regularSchemas: GeneratorSchema[];
  operationSchemas: GeneratorSchema[];
};
/**
 * Fix imports in operation schemas that reference regular schemas.
 */
declare function fixCrossDirectoryImports(operationSchemas: GeneratorSchema[], regularSchemaNames: Set<string>, schemaPath: string, operationSchemaPath: string, namingConvention: NamingConvention, fileExtension: string): void;
/**
 * Fix imports in regular schemas that reference operation schemas.
 */
declare function fixRegularSchemaImports(regularSchemas: GeneratorSchema[], operationSchemaNames: Set<string>, schemaPath: string, operationSchemaPath: string, namingConvention: NamingConvention, fileExtension: string): void;
declare function writeModelInline(acc: string, model: string): string;
declare function writeModelsInline(array: GeneratorSchema[]): string;
interface WriteSchemaOptions {
  path: string;
  schema: GeneratorSchema;
  target: string;
  namingConvention: NamingConvention;
  fileExtension: string;
  header: string;
}
declare function writeSchema({
  path,
  schema,
  target,
  namingConvention,
  fileExtension,
  header
}: WriteSchemaOptions): Promise<void>;
interface WriteSchemasOptions {
  schemaPath: string;
  schemas: GeneratorSchema[];
  target: string;
  namingConvention: NamingConvention;
  fileExtension: string;
  header: string;
  indexFiles: boolean;
}
declare function writeSchemas({
  schemaPath,
  schemas,
  target,
  namingConvention,
  fileExtension,
  header,
  indexFiles
}: WriteSchemasOptions): Promise<void>;
//#endregion
//#region src/writers/single-mode.d.ts
declare function writeSingleMode({
  builder,
  output,
  projectName,
  header,
  needSchema,
  generateSchemasInline
}: WriteModeProps): Promise<string[]>;
//#endregion
//#region src/writers/split-mode.d.ts
declare function writeSplitMode({
  builder,
  output,
  projectName,
  header,
  needSchema,
  generateSchemasInline
}: WriteModeProps): Promise<string[]>;
//#endregion
//#region src/writers/split-tags-mode.d.ts
declare function writeSplitTagsMode({
  builder,
  output,
  projectName,
  header,
  needSchema,
  generateSchemasInline
}: WriteModeProps): Promise<string[]>;
//#endregion
//#region src/writers/tags-mode.d.ts
declare function writeTagsMode({
  builder,
  output,
  projectName,
  header,
  needSchema,
  generateSchemasInline
}: WriteModeProps): Promise<string[]>;
//#endregion
//#region src/writers/target.d.ts
declare function generateTarget(builder: WriteSpecBuilder, options: NormalizedOutputOptions): GeneratorTarget;
//#endregion
//#region src/writers/target-tags.d.ts
declare function generateTargetForTags(builder: WriteSpecBuilder, options: NormalizedOutputOptions): Record<string, GeneratorTarget>;
//#endregion
//#region src/writers/types.d.ts
declare function getOrvalGeneratedTypes(): string;
declare function getTypedResponse(): string;
//#endregion
export { AngularHttpResourceOptions, AngularOptions, BODY_TYPE_NAME, BaseUrlFromConstant, BaseUrlFromSpec, BaseUrlRuntime, ClientBuilder, ClientDependenciesBuilder, ClientExtraFilesBuilder, ClientFileBuilder, ClientFooterBuilder, ClientGeneratorsBuilder, ClientHeaderBuilder, ClientMockBuilder, ClientMockGeneratorBuilder, ClientMockGeneratorImplementation, ClientTitleBuilder, Config, ConfigExternal, ConfigFn, ContentTypeFilter, ContextSpec, DeepNonNullable, EnumGeneration, ErrorWithTag, FetchOptions, FormDataArrayHandling, FormDataContext, FormDataType, GenerateMockImports, GenerateVerbOptionsParams, GenerateVerbsOptionsParams, GeneratorApiBuilder, GeneratorApiOperations, GeneratorApiResponse, GeneratorClient, GeneratorClientExtra, GeneratorClientFooter, GeneratorClientHeader, GeneratorClientImports, GeneratorClientTitle, GeneratorClients, GeneratorDependency, GeneratorImport, GeneratorMutator, GeneratorMutatorParsingInfo, GeneratorOperation, GeneratorOperations, GeneratorOptions, GeneratorSchema, GeneratorTarget, GeneratorTargetFull, GeneratorVerbOptions, GeneratorVerbsOptions, GetterBody, GetterParam, GetterParameters, GetterParams, GetterProp, GetterPropType, GetterProps, GetterQueryParam, GetterResponse, GlobalMockOptions, GlobalOptions, HonoOptions, Hook, HookCommand, HookFunction, HookOption, HooksOptions, ImportOpenApi, InputFiltersOptions, InputOptions, InputTransformerFn, InvalidateTarget, InvalidateTargetParam, JsDocOptions, LogLevel, LogLevels, LogOptions, LogType, Logger, LoggerOptions, McpOptions, McpServerOptions, MockData, MockDataArray, MockDataArrayFn, MockDataObject, MockDataObjectFn, MockOptions, MockProperties, MockPropertiesObject, MockPropertiesObjectFn, MutationInvalidatesConfig, MutationInvalidatesRule, Mutator, MutatorObject, NamingConvention, NormalizedAngularOptions, NormalizedConfig, NormalizedFetchOptions, NormalizedFormDataType, NormalizedHonoOptions, NormalizedHookCommand, NormalizedHookOptions, NormalizedInputOptions, NormalizedJsDocOptions, NormalizedMcpOptions, NormalizedMcpServerOptions, NormalizedMutator, NormalizedOperationOptions, NormalizedOptions, NormalizedOutputOptions, NormalizedOverrideOutput, NormalizedParamsSerializerOptions, NormalizedQueryOptions, NormalizedSchemaOptions, NormalizedZodOptions, OpenApiComponentsObject, OpenApiDocument, OpenApiEncodingObject, OpenApiExampleObject, OpenApiInfoObject, OpenApiMediaTypeObject, OpenApiOperationObject, OpenApiParameterObject, OpenApiPathItemObject, OpenApiPathsObject, OpenApiReferenceObject, OpenApiRequestBodyObject, OpenApiResponseObject, OpenApiResponsesObject, OpenApiSchemaObject, OpenApiSchemaObjectType, OpenApiSchemasObject, OpenApiServerObject, OperationOptions, Options, OptionsExport, OptionsFn, OutputClient, OutputClientFunc, OutputDocsOptions, OutputHttpClient, OutputMockType, OutputMode, OutputOptions, OverrideInput, OverrideMockOptions, OverrideOutput, OverrideOutputContentType, PackageJson, ParamsSerializerOptions, PreferredContentType, PropertySortOrder, QueryOptions, ReadonlyRequestBodiesMode, RefComponentSuffix, RefInfo, ResReqTypesValue, ResolverValue, ResponseTypeCategory, ScalarValue, SchemaGenerationType, SchemaOptions, SchemaType, SupportedFormatter, SwrOptions, TEMPLATE_TAG_REGEX, TsConfigTarget, Tsconfig, URL_REGEX, VERBS_WITH_BODY, Verbs, WriteModeProps, WriteSpecBuilder, ZodCoerceType, ZodDateTimeOptions, ZodOptions, ZodTimeOptions, addDependency, asyncReduce, camel, collectReferencedComponents, combineSchemas, compareVersions, conventionName, count, createDebugger, createLogger, createSuccessMessage, createTypeAliasIfNeeded, dedupeUnionType, dynamicImport, escape, escapeRegExp, filterByContentType, filteredVerbs, fixCrossDirectoryImports, fixRegularSchemaImports, generalJSTypes, generalJSTypesWithArray, generateAxiosOptions, generateBodyMutatorConfig, generateBodyOptions, generateComponentDefinition, generateDependencyImports, generateFormDataAndUrlEncodedFunction, generateImports, generateModelInline, generateModelsInline, generateMutator, generateMutatorConfig, generateMutatorImports, generateMutatorRequestOptions, generateOptions, generateParameterDefinition, generateQueryParamsAxiosConfig, generateSchemasDefinition, generateTarget, generateTargetForTags, generateVerbImports, generateVerbOptions, generateVerbsOptions, getAngularFilteredParamsCallExpression, getAngularFilteredParamsExpression, getAngularFilteredParamsHelperBody, getArray, getBaseUrlRuntimeImports, getBodiesByContentType, getBody, getCombinedEnumValue, getDefaultContentType, getEnum, getEnumDescriptions, getEnumImplementation, getEnumNames, getEnumUnionFromSchema, getExtension, getFileInfo, getFormDataFieldFileType, getFullRoute, getIsBodyVerb, getKey, getMockFileExtensionByTypeName, getNumberWord, getObject, getOperationId, getOrvalGeneratedTypes, getParameters, getParams, getParamsInPath, getPropertySafe, getProps, getQueryParams, getRefInfo, getResReqTypes, getResponse, getResponseTypeCategory, getRoute, getRouteAsArray, getScalar, getSuccessResponseType, getTypedResponse, getWarningCount, isBinaryContentType, isBoolean, isDirectory, isFunction, isModule, isNullish, isNumber, isNumeric, isObject, isReference, isSchema, isString, isStringLike, isSyntheticDefaultImportsAllow, isUrl, isVerb, isVerbose, jsDoc, jsStringEscape, kebab, keyValuePairsToJsDoc, log, logError, logVerbose, logWarning, mergeDeep, mismatchArgsMessage, pascal, removeFilesAndEmptyFolders, resetWarnings, resolveDiscriminators, resolveExampleRefs, resolveInstalledVersion, resolveInstalledVersions, resolveObject, resolveRef, resolveValue, sanitize, setVerbose, snake, sortByPriority, splitSchemasByType, startMessage, stringify, toObjectString, path_d_exports as upath, upper, writeModelInline, writeModelsInline, writeSchema, writeSchemas, writeSingleMode, writeSplitMode, writeSplitTagsMode, writeTagsMode };
//# sourceMappingURL=index.d.mts.map