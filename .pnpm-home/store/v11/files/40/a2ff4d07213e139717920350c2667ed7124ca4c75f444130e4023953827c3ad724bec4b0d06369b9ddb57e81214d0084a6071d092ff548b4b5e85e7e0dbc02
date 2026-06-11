import { GetterPropType, OutputMode, camel, conventionName, escapeRegExp, generateDependencyImports, generateFormDataAndUrlEncodedFunction, generateMutatorConfig, generateMutatorImports, generateMutatorRequestOptions, generateOptions, generateVerbImports, getAngularFilteredParamsCallExpression, getAngularFilteredParamsExpression, getAngularFilteredParamsHelperBody, getDefaultContentType, getEnumImplementation, getFileInfo, getFullRoute, isBoolean, isObject, isSyntheticDefaultImportsAllow, jsDoc, kebab, pascal, sanitize, toObjectString, upath } from "@orval/core";
//#region src/constants.ts
const ANGULAR_HTTP_CLIENT_DEPENDENCIES = [
	{
		exports: [
			{
				name: "HttpClient",
				values: true
			},
			{
				name: "HttpHeaders",
				values: true
			},
			{ name: "HttpParams" },
			{ name: "HttpContext" },
			{
				name: "HttpResponse",
				alias: "AngularHttpResponse",
				values: true
			},
			{ name: "HttpEvent" }
		],
		dependency: "@angular/common/http"
	},
	{
		exports: [{
			name: "Injectable",
			values: true
		}, {
			name: "inject",
			values: true
		}],
		dependency: "@angular/core"
	},
	{
		exports: [{
			name: "Observable",
			values: true
		}],
		dependency: "rxjs"
	}
];
const ANGULAR_HTTP_RESOURCE_DEPENDENCIES = [{
	exports: [
		{
			name: "httpResource",
			values: true
		},
		{ name: "HttpResourceOptions" },
		{ name: "HttpResourceRef" },
		{ name: "HttpResourceRequest" },
		{
			name: "HttpHeaders",
			values: true
		},
		{ name: "HttpParams" },
		{ name: "HttpContext" }
	],
	dependency: "@angular/common/http"
}, {
	exports: [{ name: "Signal" }, { name: "ResourceStatus" }],
	dependency: "@angular/core"
}];
//#endregion
//#region src/types.ts
/**
* Code template for the `HttpClientOptions` interface emitted into generated files.
*
* This is NOT an import of Angular's type — Angular's HttpClient methods accept
* inline option objects, not a single unified interface. Orval generates this
* convenience wrapper so users have a single referenceable type.
*
* Properties sourced from Angular HttpClient public API (angular/angular
* packages/common/http/src/client.ts).
*/
const HTTP_CLIENT_OPTIONS_TEMPLATE = `interface HttpClientOptions {
  readonly headers?: HttpHeaders | Record<string, string | string[]>;
  readonly context?: HttpContext;
  readonly params?:
        | HttpParams
      | Record<string, string | number | boolean | Array<string | number | boolean>>;
  readonly reportProgress?: boolean;
  readonly withCredentials?: boolean;
  readonly credentials?: RequestCredentials;
  readonly keepalive?: boolean;
  readonly priority?: RequestPriority;
  readonly cache?: RequestCache;
  readonly mode?: RequestMode;
  readonly redirect?: RequestRedirect;
  readonly referrer?: string;
  readonly integrity?: string;
  readonly referrerPolicy?: ReferrerPolicy;
  readonly transferCache?: {includeHeaders?: string[]} | boolean;
  readonly timeout?: number;
}`;
/**
* Code templates for reusable observe option helpers emitted into generated files.
*/
const HTTP_CLIENT_OBSERVE_OPTIONS_TEMPLATE = `type HttpClientBodyOptions = HttpClientOptions & {
  readonly observe?: 'body';
};

type HttpClientEventOptions = HttpClientOptions & {
  readonly observe: 'events';
};

type HttpClientResponseOptions = HttpClientOptions & {
  readonly observe: 'response';
};

type HttpClientObserveOptions = HttpClientOptions & {
  readonly observe?: 'body' | 'events' | 'response';
};`;
/**
* Code template for the `ThirdParameter` utility type used with custom mutators.
*/
const THIRD_PARAMETER_TEMPLATE = `// eslint-disable-next-line
    type ThirdParameter<T extends (...args: never[]) => unknown> = T extends (
  config: unknown,
  httpClient: unknown,
  args: infer P,
) => unknown
  ? P
  : never;`;
const PRIMITIVE_TYPES = new Set([
	"string",
	"number",
	"boolean",
	"void",
	"unknown"
]);
const PRIMITIVE_TYPE_LOOKUP = {
	string: true,
	number: true,
	boolean: true,
	void: true,
	unknown: true
};
const isPrimitiveType = (t) => t != void 0 && Object.prototype.hasOwnProperty.call(PRIMITIVE_TYPE_LOOKUP, t);
const isZodSchemaOutput = (output) => isObject(output.schemas) && output.schemas.type === "zod";
const isDefined = (v) => v != void 0;
/**
* Maps a schema type name to its Zod output-type reference (`${typeName}Output`).
*/
const getSchemaOutputTypeRef = (typeName) => `${typeName}Output`;
const generateAngularTitle = (title) => {
	return `${pascal(sanitize(title))}Service`;
};
/**
* Builds the opening of an @Injectable Angular service class.
* Shared between httpClient-only mode and the mutation section of httpResource mode.
*/
const buildServiceClassOpen = ({ title, isRequestOptions, isMutator, isGlobalMutator, provideIn, hasQueryParams }) => {
	const provideInValue = provideIn ? `{ providedIn: '${isBoolean(provideIn) ? "root" : provideIn}' }` : "";
	return `
${isRequestOptions && !isGlobalMutator ? `${HTTP_CLIENT_OPTIONS_TEMPLATE}

${HTTP_CLIENT_OBSERVE_OPTIONS_TEMPLATE}

${hasQueryParams ? getAngularFilteredParamsHelperBody() : ""}` : ""}

${isRequestOptions && isMutator ? THIRD_PARAMETER_TEMPLATE : ""}

@Injectable(${provideInValue})
export class ${title} {
  private readonly http = inject(HttpClient);
`;
};
/**
* Registry that maps operationName → full route (with baseUrl).
*
* Populated during client builder calls (which receive the full route via
* GeneratorOptions.route) and read during header/footer builder calls
* (which only receive verbOptions without routes).
*
* This avoids monkey-patching verbOptions with a non-standard `fullRoute` property.
*/
const createRouteRegistry = () => {
	const routes = /* @__PURE__ */ new Map();
	return {
		reset() {
			routes.clear();
		},
		set(operationName, route) {
			routes.set(operationName, route);
		},
		get(operationName, fallback) {
			return routes.get(operationName) ?? fallback;
		}
	};
};
const createReturnTypesRegistry = () => {
	const returnTypesToWrite = /* @__PURE__ */ new Map();
	return {
		reset() {
			returnTypesToWrite.clear();
		},
		set(operationName, typeDefinition) {
			returnTypesToWrite.set(operationName, typeDefinition);
		},
		getFooter(operationNames) {
			const collected = [];
			for (const operationName of operationNames) {
				const value = returnTypesToWrite.get(operationName);
				if (value) collected.push(value);
			}
			return collected.join("\n");
		}
	};
};
/**
* Determines whether an operation should be generated as an `httpResource()`
* (retrieval) or as an `HttpClient` method in a service class (mutation).
*
* Resolution order:
* 1. **Per-operation override** — `override.operations.<operationId>.angular.client`
*    in the orval config. `httpResource` forces retrieval, `httpClient` forces mutation.
* 2. **HTTP verb** — absent a per-operation override, `GET` is treated as a retrieval.
* 3. **Name heuristic** — For `POST`, if the operationName starts with a
*    retrieval-like prefix (search, list, find, query, get, fetch, lookup)
*    it is treated as a retrieval. This handles common patterns like
*    `POST /search` or `POST /graphql` with query-style operation names.
*
* If the heuristic misclassifies an operation, users can override it
* per-operation in their orval config:
*
* ```ts
* override: {
*   operations: {
*     myPostSearch: { angular: { retrievalClient: 'httpResource' } },
*     getOrCreateUser: { angular: { retrievalClient: 'httpClient' } },
*   }
* }
* ```
*/
function isRetrievalVerb(verb, operationName, clientOverride) {
	if (clientOverride === "httpResource") return true;
	if (clientOverride === "httpClient") return false;
	if (verb === "get") return true;
	if (verb === "post" && operationName) {
		const lower = operationName.toLowerCase();
		return /^(search|list|find|query|get|fetch|lookup|filter)/.test(lower);
	}
	return false;
}
function isMutationVerb(verb, operationName, clientOverride) {
	return !isRetrievalVerb(verb, operationName, clientOverride);
}
function getDefaultSuccessType(successTypes, fallback) {
	const uniqueContentTypes = [...new Set(successTypes.map((t) => t.contentType).filter(Boolean))];
	const defaultContentType = uniqueContentTypes.find((contentType) => contentType.includes("json")) ?? (uniqueContentTypes.length > 1 ? getDefaultContentType(uniqueContentTypes) : uniqueContentTypes[0] ?? "application/json");
	return {
		contentType: defaultContentType,
		value: successTypes.find((t) => t.contentType === defaultContentType)?.value ?? fallback
	};
}
//#endregion
//#region src/http-client.ts
const returnTypesRegistry = createReturnTypesRegistry();
const hasSchemaImport = (imports, typeName) => typeName != void 0 && imports.some((imp) => imp.name === typeName);
const getSchemaValueRef = (typeName) => typeName === "Error" ? "ErrorSchema" : typeName;
const getContentTypeReturnType$1 = (contentType, value) => {
	if (!contentType) return value;
	if (contentType.includes("json") || contentType.includes("+json")) return value;
	if (contentType.startsWith("text/") || contentType.includes("xml")) return "string";
	return "Blob";
};
/**
* Returns the dependency list required by the Angular `HttpClient` generator.
*
* These imports are consumed by Orval's generic dependency-import emitter when
* composing the generated Angular client file.
*
* @returns The Angular `HttpClient` dependency descriptors used during import generation.
*/
const getAngularDependencies = () => [...ANGULAR_HTTP_CLIENT_DEPENDENCIES];
/**
* Builds the generated TypeScript helper name used for multi-content-type
* `Accept` header unions.
*
* Example: `listPets` -> `ListPetsAccept`.
*
* @returns A PascalCase helper type/const name for the operation's `Accept` values.
*/
const getAcceptHelperName = (operationName) => `${pascal(operationName)}Accept`;
/**
* Collects the distinct successful response content types for a single
* operation.
*
* The Angular generators use this to decide whether they need `Accept`
* overloads or content-type-specific branching logic.
*
* @returns A de-duplicated list of response content types, excluding empty entries.
*/
const getUniqueContentTypes = (successTypes) => [...new Set(successTypes.map((t) => t.contentType).filter(Boolean))];
const toAcceptHelperKey = (contentType) => contentType.replaceAll(/[^A-Za-z0-9]+/g, "_").replaceAll(/^_+|_+$/g, "").toLowerCase();
const buildAcceptHelper = (operationName, contentTypes, output) => {
	const acceptHelperName = getAcceptHelperName(operationName);
	return `export type ${acceptHelperName} = typeof ${acceptHelperName}[keyof typeof ${acceptHelperName}];

export const ${acceptHelperName} = {
${getEnumImplementation(contentTypes.map((contentType) => `'${contentType}'`).join(" | "), contentTypes.map((contentType) => toAcceptHelperKey(contentType)), void 0, output.override.namingConvention.enum)}} as const;`;
};
/**
* Builds the shared `Accept` helper declarations for all operations in the
* current Angular generation scope.
*
* @remarks
* Helpers are emitted only for operations with more than one successful
* response content type.
*
* @returns Concatenated type/const declarations or an empty string when no helpers are needed.
*/
const buildAcceptHelpers = (verbOptions, output) => verbOptions.flatMap((verbOption) => {
	const contentTypes = getUniqueContentTypes(verbOption.response.types.success);
	if (contentTypes.length <= 1) return [];
	return [buildAcceptHelper(verbOption.operationName, contentTypes, output)];
}).join("\n\n");
/**
* Generates the static header section for Angular `HttpClient` output.
*
* Depending on the current generation options this may include:
* - reusable request option helper types
* - filtered query-param helper utilities
* - mutator support types
* - `Accept` helper unions/constants for multi-content-type operations
* - the `@Injectable()` service class shell
*
* @returns A string containing the prelude and service class opening for the generated file.
*/
const generateAngularHeader = ({ title, isRequestOptions, isMutator, isGlobalMutator, provideIn, verbOptions, tag, output }) => {
	returnTypesRegistry.reset();
	const relevantVerbs = tag ? Object.values(verbOptions).filter((v) => v.tags.some((t) => camel(t) === camel(tag))) : Object.values(verbOptions);
	const hasQueryParams = relevantVerbs.some((v) => v.queryParams);
	const acceptHelpers = buildAcceptHelpers(relevantVerbs, output);
	return `
${isRequestOptions && !isGlobalMutator ? `${HTTP_CLIENT_OPTIONS_TEMPLATE}

${HTTP_CLIENT_OBSERVE_OPTIONS_TEMPLATE}

${hasQueryParams ? getAngularFilteredParamsHelperBody() : ""}` : ""}

${isRequestOptions && isMutator ? THIRD_PARAMETER_TEMPLATE : ""}

${acceptHelpers}

@Injectable(${provideIn ? `{ providedIn: '${isBoolean(provideIn) ? "root" : provideIn}' }` : ""})
export class ${title} {
  private readonly http = inject(HttpClient);
`;
};
/**
* Generates the closing section for Angular `HttpClient` output.
*
* @remarks
* Besides closing the generated service class, this appends any collected
* `ClientResult` aliases registered while individual operations were emitted.
*
* @returns The footer text for the generated Angular client file.
*/
const generateAngularFooter = ({ operationNames }) => {
	let footer = "};\n\n";
	const returnTypes = returnTypesRegistry.getFooter(operationNames);
	if (returnTypes) footer += `${returnTypes}\n`;
	return footer;
};
/**
* Generates the Angular `HttpClient` method implementation for a single
* OpenAPI operation.
*
* This function is responsible for:
* - method signatures and overloads
* - observe-mode branching
* - multi-content-type `Accept` handling
* - mutator integration
* - runtime Zod validation hooks for Angular output
* - registering the operation's `ClientResult` alias for footer emission
*
* @remarks
* This is the central implementation builder shared by the dedicated
* `httpClient` mode and the mutation side of Angular `both` / `httpResource`
* generation.
*
* @returns The complete TypeScript method declaration and implementation for the operation.
*/
const generateHttpClientImplementation = ({ headers, queryParams, operationName, response, mutator, body, props, verb, override, formData, formUrlEncoded, paramsSerializer }, { route, context }) => {
	const isRequestOptions = override.requestOptions !== false;
	const isFormData = !override.formData.disabled;
	const isFormUrlEncoded = override.formUrlEncoded !== false;
	const isExactOptionalPropertyTypes = !!context.output.tsconfig?.compilerOptions?.exactOptionalPropertyTypes;
	const bodyForm = generateFormDataAndUrlEncodedFunction({
		formData,
		formUrlEncoded,
		body,
		isFormData,
		isFormUrlEncoded
	});
	const dataType = response.definition.success || "unknown";
	const isPrimitive = isPrimitiveType(dataType);
	const hasSchema = hasSchemaImport(response.imports, dataType);
	const isZodOutput = isZodSchemaOutput(context.output);
	const shouldValidateResponse = override.angular.runtimeValidation && isZodOutput && !isPrimitive && hasSchema;
	const parsedDataType = shouldValidateResponse ? getSchemaOutputTypeRef(dataType) : dataType;
	const getGeneratedResponseType = (value, contentType) => {
		if (override.angular.runtimeValidation && isZodOutput && !!contentType && (contentType.includes("json") || contentType.includes("+json")) && !isPrimitiveType(value) && hasSchemaImport(response.imports, value)) return getSchemaOutputTypeRef(value);
		return getContentTypeReturnType$1(contentType, value);
	};
	const resultAliasType = mutator ? dataType : response.types.success.length <= 1 ? parsedDataType : [...new Set(response.types.success.map(({ value, contentType }) => getGeneratedResponseType(value, contentType)))].join(" | ") || parsedDataType;
	const schemaValueRef = shouldValidateResponse ? getSchemaValueRef(dataType) : dataType;
	const validationPipe = shouldValidateResponse ? `.pipe(map(data => ${schemaValueRef}.parse(data)))` : "";
	const responseValidationPipe = shouldValidateResponse ? `.pipe(map(response => response.clone({ body: ${schemaValueRef}.parse(response.body) })))` : "";
	const eventValidationPipe = shouldValidateResponse ? `.pipe(map(event => event instanceof AngularHttpResponse ? event.clone({ body: ${schemaValueRef}.parse(event.body) }) : event))` : "";
	returnTypesRegistry.set(operationName, `export type ${pascal(operationName)}ClientResult = NonNullable<${resultAliasType}>`);
	if (mutator) {
		const mutatorConfig = generateMutatorConfig({
			route,
			body,
			headers,
			queryParams,
			response,
			verb,
			isFormData,
			isFormUrlEncoded,
			hasSignal: false,
			isExactOptionalPropertyTypes,
			isAngular: true
		});
		const requestOptions = isRequestOptions ? generateMutatorRequestOptions(override.requestOptions, mutator.hasThirdArg) : "";
		return ` ${operationName}<TData = ${dataType}>(\n    ${mutator.bodyTypeName && body.definition ? toObjectString(props, "implementation").replace(new RegExp(String.raw`(\\w*):\\s?${body.definition}`), `$1: ${mutator.bodyTypeName}<${body.definition}>`) : toObjectString(props, "implementation")}\n ${isRequestOptions && mutator.hasThirdArg ? `options?: ThirdParameter<typeof ${mutator.name}>` : ""}) {${bodyForm}
      return ${mutator.name}<TData>(
      ${mutatorConfig},
      this.http,
      ${requestOptions});
    }
  `;
	}
	const optionsBase = {
		route,
		body,
		headers,
		queryParams,
		response,
		verb,
		requestOptions: override.requestOptions,
		isFormData,
		isFormUrlEncoded,
		paramsSerializer,
		paramsSerializerOptions: override.paramsSerializerOptions,
		isAngular: true,
		isExactOptionalPropertyTypes,
		hasSignal: false
	};
	const propsDefinition = toObjectString(props, "definition");
	const successTypes = response.types.success;
	const uniqueContentTypes = getUniqueContentTypes(successTypes);
	const hasMultipleContentTypes = uniqueContentTypes.length > 1;
	const acceptTypeName = hasMultipleContentTypes ? getAcceptHelperName(operationName) : void 0;
	const needsObserveBranching = isRequestOptions && !hasMultipleContentTypes;
	const angularParamsRef = queryParams ? "filteredParams" : void 0;
	let paramsDeclaration = "";
	if (angularParamsRef && queryParams) if (isRequestOptions) {
		const callExpr = getAngularFilteredParamsCallExpression("{...params, ...options?.params}", queryParams.requiredNullableKeys ?? []);
		paramsDeclaration = paramsSerializer ? `const ${angularParamsRef} = ${paramsSerializer.name}(${callExpr});\n\n    ` : `const ${angularParamsRef} = ${callExpr};\n\n    `;
	} else {
		const iifeExpr = getAngularFilteredParamsExpression("params ?? {}", queryParams.requiredNullableKeys ?? [], !!paramsSerializer);
		paramsDeclaration = paramsSerializer ? `const ${angularParamsRef} = ${paramsSerializer.name}(${iifeExpr});\n\n    ` : `const ${angularParamsRef} = ${iifeExpr};\n\n    `;
	}
	const optionsInput = {
		...optionsBase,
		...angularParamsRef ? { angularParamsRef } : {}
	};
	const options = generateOptions(optionsInput);
	const defaultContentType = hasMultipleContentTypes ? successTypes.find(({ contentType }) => !!contentType && (contentType.includes("json") || contentType.includes("+json")))?.contentType ?? getDefaultContentType(uniqueContentTypes) : uniqueContentTypes[0] ?? "application/json";
	const jsonSuccessValues = [...new Set(successTypes.filter(({ contentType }) => !!contentType && (contentType.includes("json") || contentType.includes("+json"))).map(({ value }) => value))];
	const jsonReturnType = jsonSuccessValues.length > 0 ? jsonSuccessValues.join(" | ") : "unknown";
	const parsedJsonReturnType = jsonSuccessValues.length === 1 && override.angular.runtimeValidation && isZodOutput && !isPrimitiveType(jsonSuccessValues[0]) && hasSchemaImport(response.imports, jsonSuccessValues[0]) ? getSchemaOutputTypeRef(jsonSuccessValues[0]) : jsonReturnType;
	let jsonValidationPipe = shouldValidateResponse ? `.pipe(map(data => ${schemaValueRef}.parse(data)))` : "";
	if (hasMultipleContentTypes && !shouldValidateResponse && override.angular.runtimeValidation && isZodOutput && jsonSuccessValues.length === 1) {
		const jsonType = jsonSuccessValues[0];
		const jsonIsPrimitive = isPrimitiveType(jsonType);
		const jsonHasSchema = hasSchemaImport(response.imports, jsonType);
		if (!jsonIsPrimitive && jsonHasSchema) jsonValidationPipe = `.pipe(map(data => ${getSchemaValueRef(jsonType)}.parse(data)))`;
	}
	const textSuccessTypes = successTypes.filter(({ contentType, value }) => !!contentType && (contentType.startsWith("text/") || contentType.includes("xml") || value === "string"));
	const blobSuccessTypes = successTypes.filter(({ contentType }) => !!contentType && !contentType.includes("json") && !contentType.includes("+json") && !contentType.startsWith("text/") && !contentType.includes("xml"));
	const multiReturnMembers = [
		parsedJsonReturnType,
		...textSuccessTypes.length > 0 ? ["string"] : [],
		...blobSuccessTypes.length > 0 ? ["Blob"] : []
	];
	const refinedMultiImplementationReturnType = `Observable<${[...new Set(multiReturnMembers)].join(" | ")}>`;
	const observeOptions = needsObserveBranching ? {
		body: generateOptions({
			...optionsInput,
			angularObserve: "body"
		}),
		events: generateOptions({
			...optionsInput,
			angularObserve: "events"
		}),
		response: generateOptions({
			...optionsInput,
			angularObserve: "response"
		})
	} : void 0;
	const isModelType = dataType !== "Blob" && dataType !== "string" && dataType !== "ArrayBuffer";
	const hasTDataGeneric = isModelType && !hasMultipleContentTypes && !shouldValidateResponse;
	let functionName = operationName;
	if (hasTDataGeneric) functionName += `<TData = ${parsedDataType}>`;
	let contentTypeOverloads = "";
	if (hasMultipleContentTypes && isRequestOptions) {
		const requiredPart = props.filter((p) => p.required && !p.default).map((p) => p.definition).join(",\n    ");
		const optionalPart = props.filter((p) => !p.required || p.default).map((p) => p.definition).join(",\n    ");
		contentTypeOverloads = `${successTypes.filter(({ contentType }) => !!contentType).map(({ contentType, value }) => {
			const returnType = getGeneratedResponseType(value, contentType);
			return `${operationName}(${[
				requiredPart,
				`accept: '${contentType}'`,
				optionalPart
			].filter(Boolean).join(",\n    ")}, options?: HttpClientOptions): Observable<${returnType}>;`;
		}).join("\n  ")}\n  ${operationName}(${[
			requiredPart,
			`accept?: ${acceptTypeName ?? "string"}`,
			optionalPart
		].filter(Boolean).join(",\n    ")}, options?: HttpClientOptions): ${refinedMultiImplementationReturnType};`;
	}
	const observeOverloads = isRequestOptions && !hasMultipleContentTypes ? `${functionName}(${propsDefinition} options?: HttpClientBodyOptions): Observable<${hasTDataGeneric ? "TData" : parsedDataType}>;\n ${functionName}(${propsDefinition} options?: HttpClientEventOptions): Observable<HttpEvent<${hasTDataGeneric ? "TData" : parsedDataType}>>;\n ${functionName}(${propsDefinition} options?: HttpClientResponseOptions): Observable<AngularHttpResponse<${hasTDataGeneric ? "TData" : parsedDataType}>>;` : "";
	const overloads = contentTypeOverloads || observeOverloads;
	const observableDataType = hasTDataGeneric ? "TData" : parsedDataType;
	const singleImplementationReturnType = isRequestOptions ? `Observable<${observableDataType} | HttpEvent<${observableDataType}> | AngularHttpResponse<${observableDataType}>>` : `Observable<${observableDataType}>`;
	if (hasMultipleContentTypes) {
		const requiredPart = props.filter((p) => p.required && !p.default).map((p) => p.implementation).join(",\n    ");
		const optionalPart = props.filter((p) => !p.required || p.default).map((p) => p.implementation).join(",\n    ");
		return ` ${overloads}
  ${operationName}(
    ${[
			requiredPart,
			`accept: ${acceptTypeName ?? "string"} = '${defaultContentType}'`,
			optionalPart
		].filter(Boolean).join(",\n    ")},
    ${isRequestOptions ? "options?: HttpClientOptions" : ""}
  ): ${refinedMultiImplementationReturnType} {${bodyForm}
    ${paramsDeclaration}const headers = options?.headers instanceof HttpHeaders
      ? options.headers.set('Accept', accept)
      : { ...(options?.headers ?? {}), Accept: accept };

    if (accept.includes('json') || accept.includes('+json')) {
      return this.http.${verb}<${parsedJsonReturnType}>(\`${route}\`, {
        ...options,
        responseType: 'json',
        headers,
        ${angularParamsRef ? `params: ${angularParamsRef},` : ""}
      })${jsonValidationPipe};
    } else if (accept.startsWith('text/') || accept.includes('xml')) {
      return this.http.${verb}(\`${route}\`, {
        ...options,
        responseType: 'text',
        headers,
        ${angularParamsRef ? `params: ${angularParamsRef},` : ""}
      }) as Observable<string>;
    }${blobSuccessTypes.length > 0 ? ` else {
      return this.http.${verb}(\`${route}\`, {
        ...options,
        responseType: 'blob',
        headers,
        ${angularParamsRef ? `params: ${angularParamsRef},` : ""}
      }) as Observable<Blob>;
    }` : `

    return this.http.${verb}<${parsedJsonReturnType}>(\`${route}\`, {
      ...options,
      responseType: 'json',
      headers,
      ${angularParamsRef ? `params: ${angularParamsRef},` : ""}
    })${jsonValidationPipe};`}
  }
`;
	}
	const httpTypeArg = hasTDataGeneric ? "<TData>" : shouldValidateResponse && isModelType ? `<${parsedDataType}>` : "";
	const observeImplementation = isRequestOptions ? `${paramsDeclaration}if (options?.observe === 'events') {
      return this.http.${verb}${httpTypeArg}(${observeOptions?.events ?? options})${eventValidationPipe};
    }

    if (options?.observe === 'response') {
      return this.http.${verb}${httpTypeArg}(${observeOptions?.response ?? options})${responseValidationPipe};
    }

    return this.http.${verb}${httpTypeArg}(${observeOptions?.body ?? options})${validationPipe};` : `return this.http.${verb}${httpTypeArg}(${options})${validationPipe};`;
	return ` ${overloads}
  ${functionName}(
    ${toObjectString(props, "implementation")} ${isRequestOptions ? `options?: HttpClientObserveOptions` : ""}): ${singleImplementationReturnType} {${bodyForm}
    ${observeImplementation}
  }
`;
};
/**
* Orval client builder entry point for Angular `HttpClient` output.
*
* It normalizes imports needed for runtime validation, delegates the actual
* method implementation to `generateHttpClientImplementation`, and returns the
* generated code plus imports for the current operation.
*
* @returns The generated implementation fragment and imports for one operation.
*/
const generateAngular = (verbOptions, options) => {
	const isZodOutput = isZodSchemaOutput(options.context.output);
	const responseType = verbOptions.response.definition.success;
	const isPrimitiveResponse = isPrimitiveType(responseType);
	const shouldUseRuntimeValidation = verbOptions.override.angular.runtimeValidation && isZodOutput;
	const normalizedVerbOptions = (() => {
		if (!shouldUseRuntimeValidation) return verbOptions;
		let result = {
			...verbOptions,
			response: {
				...verbOptions.response,
				imports: verbOptions.response.imports.map((imp) => ({
					...imp,
					values: true
				}))
			}
		};
		if (!isPrimitiveResponse && hasSchemaImport(result.response.imports, responseType)) result = {
			...result,
			response: {
				...result.response,
				imports: [...result.response.imports.map((imp) => imp.name === responseType ? {
					...imp,
					values: true
				} : imp), { name: getSchemaOutputTypeRef(responseType) }]
			}
		};
		const successTypes = result.response.types.success;
		if ([...new Set(successTypes.map((t) => t.contentType).filter(Boolean))].length > 1) {
			const jsonSchemaNames = [...new Set(successTypes.filter(({ contentType }) => !!contentType && (contentType.includes("json") || contentType.includes("+json"))).map(({ value }) => value))];
			if (jsonSchemaNames.length === 1) {
				const jsonType = jsonSchemaNames[0];
				if (!isPrimitiveType(jsonType) && hasSchemaImport(result.response.imports, jsonType)) result = {
					...result,
					response: {
						...result.response,
						imports: [...result.response.imports.map((imp) => imp.name === jsonType ? {
							...imp,
							values: true
						} : imp), { name: getSchemaOutputTypeRef(jsonType) }]
					}
				};
			}
		}
		return result;
	})();
	const implementation = generateHttpClientImplementation(normalizedVerbOptions, options);
	return {
		implementation,
		imports: [...generateVerbImports(normalizedVerbOptions), ...implementation.includes(".pipe(map(") ? [{
			name: "map",
			values: true,
			importPath: "rxjs"
		}] : []]
	};
};
/**
* Returns the footer aliases collected for the provided operation names.
*
* The Angular generators use these aliases to expose stable `ClientResult`
* helper types such as `ListPetsClientResult`.
*
* @returns Concatenated `ClientResult` aliases for the requested operation names.
*/
const getHttpClientReturnTypes = (operationNames) => returnTypesRegistry.getFooter(operationNames);
/**
* Clears the module-level return type registry used during Angular client
* generation.
*
* This must be called at the start of each generation pass to avoid leaking
* aliases across files or tags.
*
* @returns Nothing.
*/
const resetHttpClientReturnTypes = () => {
	returnTypesRegistry.reset();
};
//#endregion
//#region src/http-resource.ts
const isAngularHttpResourceOptions = (value) => value === void 0 || isObject(value) && (value.defaultValue === void 0 || typeof value.defaultValue === "string" || typeof value.defaultValue === "number" || typeof value.defaultValue === "boolean" || value.defaultValue === null || Array.isArray(value.defaultValue) || isObject(value.defaultValue)) && (value.debugName === void 0 || typeof value.debugName === "string") && (value.injector === void 0 || typeof value.injector === "string") && (value.equal === void 0 || typeof value.equal === "string");
const isAngularOperationOverride = (value) => value !== void 0 && typeof value === "object" && value !== null && (!("client" in value) || value.client === "httpClient" || value.client === "httpResource" || value.client === "both") && (!("httpResource" in value) || isAngularHttpResourceOptions(value.httpResource));
const getClientOverride = (verbOption) => {
	const angular = verbOption.override.operations[verbOption.operationId]?.angular;
	return isAngularOperationOverride(angular) ? angular.client : void 0;
};
/**
* Resolves the effective `httpResource` option override for an operation.
*
* Operation-level configuration takes precedence over the global
* `override.angular.httpResource` block while still inheriting unspecified
* values from the global configuration.
*
* @returns The merged resource options for the operation, or `undefined` when no override exists.
*/
const getHttpResourceOverride = (verbOption, output) => {
	const operationAngular = verbOption.override.operations[verbOption.operationId]?.angular;
	const operationOverride = isAngularOperationOverride(operationAngular) ? operationAngular.httpResource : void 0;
	const angularOverride = output.override.angular;
	const globalOverride = isObject(angularOverride) && "httpResource" in angularOverride && isAngularHttpResourceOptions(angularOverride.httpResource) ? angularOverride.httpResource : void 0;
	if (globalOverride === void 0) return operationOverride;
	if (operationOverride === void 0) return globalOverride;
	return {
		...globalOverride,
		...operationOverride
	};
};
const resourceReturnTypesRegistry = createReturnTypesRegistry();
/** @internal Exported for testing only */
const routeRegistry = createRouteRegistry();
const getRelevantVerbOptions = (verbOptions, tag) => tag ? Object.values(verbOptions).filter((verbOption) => verbOption.tags.some((currentTag) => camel(currentTag) === camel(tag))) : Object.values(verbOptions);
const getVerbOptionsRecord = (verbOptions) => Object.fromEntries(verbOptions.map((verbOption) => [verbOption.operationId, verbOption]));
const getPrimaryTag = (verbOption) => kebab(verbOption.tags[0] ?? "default");
const hasRetrievalOperations = (verbOptions) => Object.values(verbOptions).some((verbOption) => isRetrievalVerb(verbOption.verb, verbOption.operationName, getClientOverride(verbOption)));
const getHeader = (option, info) => {
	if (!option || !info) return "";
	const header = option(info);
	return Array.isArray(header) ? jsDoc({ description: header }) : header;
};
const mergeDependencies = (deps) => {
	const merged = /* @__PURE__ */ new Map();
	for (const dep of deps) {
		const existing = merged.get(dep.dependency);
		if (!existing) {
			merged.set(dep.dependency, {
				exports: [...dep.exports],
				dependency: dep.dependency
			});
			continue;
		}
		for (const exp of dep.exports) if (!existing.exports.some((current) => current.name === exp.name && current.alias === exp.alias)) existing.exports.push(exp);
	}
	return [...merged.values()];
};
const cloneDependencies = (deps) => deps.map((dep) => ({
	...dep,
	exports: [...dep.exports]
}));
/**
* Returns the merged dependency list required when Angular `httpResource`
* output coexists with Angular `HttpClient` service generation.
*
* This is used for pure `httpResource` mode as well as mixed generation paths
* that still need Angular common HTTP symbols and service helpers.
*
* @returns The de-duplicated dependency descriptors for Angular resource generation.
*/
const getAngularHttpResourceDependencies = () => mergeDependencies([...ANGULAR_HTTP_CLIENT_DEPENDENCIES, ...ANGULAR_HTTP_RESOURCE_DEPENDENCIES]);
/**
* Returns only the dependencies required by standalone generated resource
* files, such as the sibling `*.resource.ts` output used in `both` mode.
*
* @returns The dependency descriptors required by resource-only files.
*/
const getAngularHttpResourceOnlyDependencies = () => cloneDependencies(ANGULAR_HTTP_RESOURCE_DEPENDENCIES);
const isResponseText = (contentType, dataType) => {
	if (dataType === "string") return true;
	if (!contentType) return false;
	return contentType.startsWith("text/") || contentType.includes("xml");
};
const isResponseArrayBuffer = (contentType) => {
	if (!contentType) return false;
	return contentType.includes("application/octet-stream") || contentType.includes("application/pdf");
};
const isResponseBlob = (contentType, isBlob) => {
	if (isBlob) return true;
	if (!contentType) return false;
	return contentType.startsWith("image/") || contentType.includes("blob");
};
const HTTP_RESOURCE_OPTIONS_TYPE_NAME = "OrvalHttpResourceOptions";
const getHttpResourceFactory = (response, contentType, dataType) => {
	if (isResponseText(contentType, dataType)) return "httpResource.text";
	if (isResponseBlob(contentType, response.isBlob)) return "httpResource.blob";
	if (isResponseArrayBuffer(contentType)) return "httpResource.arrayBuffer";
	return "httpResource";
};
const getHttpResourceRawType = (factory) => {
	switch (factory) {
		case "httpResource.text": return "string";
		case "httpResource.arrayBuffer": return "ArrayBuffer";
		case "httpResource.blob": return "Blob";
		default: return "unknown";
	}
};
const getTypeWithoutDefault = (definition) => {
	const match = /^([^:]+):\s*(.+)$/.exec(definition);
	if (!match) return definition;
	return match[2].replace(/\s*=\s*.*$/, "").trim();
};
const getDefaultValueFromImplementation = (implementation) => {
	const match = /=\s*(.+)$/.exec(implementation);
	return match ? match[1].trim() : void 0;
};
const withSignal = (prop, options = {}) => {
	const type = getTypeWithoutDefault(prop.definition);
	const derivedDefault = getDefaultValueFromImplementation(prop.implementation) !== void 0 || prop.default !== void 0;
	const hasDefault = options.hasDefault ?? derivedDefault;
	const nameMatch = /^([^:]+):/.exec(prop.definition);
	const hasOptionalMark = (nameMatch ? nameMatch[1] : prop.name).includes("?");
	const optional = prop.required && !hasDefault && !hasOptionalMark ? "" : "?";
	const definition = `${prop.name}${optional}: Signal<${type}>`;
	return {
		definition,
		implementation: definition
	};
};
const buildSignalProps = (props, params) => {
	const paramDefaults = /* @__PURE__ */ new Map();
	for (const param of params) {
		const hasDefault = getDefaultValueFromImplementation(param.implementation) !== void 0 || param.default !== void 0;
		paramDefaults.set(param.name, hasDefault);
	}
	return props.map((prop) => {
		switch (prop.type) {
			case GetterPropType.NAMED_PATH_PARAMS: return {
				...prop,
				name: "pathParams",
				definition: `pathParams: Signal<${prop.schema.name}>`,
				implementation: `pathParams: Signal<${prop.schema.name}>`
			};
			case GetterPropType.PARAM:
			case GetterPropType.QUERY_PARAM:
			case GetterPropType.BODY:
			case GetterPropType.HEADER: {
				const signalProp = withSignal(prop, { hasDefault: prop.type === GetterPropType.PARAM ? paramDefaults.get(prop.name) ?? false : void 0 });
				return {
					...prop,
					definition: signalProp.definition,
					implementation: signalProp.implementation
				};
			}
			default: return prop;
		}
	});
};
const applySignalRoute = (route, params, useNamedParams) => {
	let updatedRoute = route;
	for (const param of params) {
		const template = "${" + param.name + "}";
		const defaultValue = getDefaultValueFromImplementation(param.implementation);
		let replacement;
		if (useNamedParams) replacement = defaultValue === void 0 ? "${pathParams()." + param.name + "}" : "${pathParams()?." + param.name + " ?? " + defaultValue + "}";
		else replacement = defaultValue === void 0 ? "${" + param.name + "()}" : "${" + param.name + "?.() ?? " + defaultValue + "}";
		updatedRoute = updatedRoute.replaceAll(template, replacement);
	}
	return updatedRoute;
};
const buildResourceRequest = ({ verb, body, headers, queryParams, paramsSerializer, override, formData, formUrlEncoded }, route) => {
	const isFormData = !override.formData.disabled;
	const isFormUrlEncoded = override.formUrlEncoded !== false;
	const bodyForm = generateFormDataAndUrlEncodedFunction({
		formData,
		formUrlEncoded,
		body,
		isFormData,
		isFormUrlEncoded
	});
	const hasFormData = isFormData && body.formData;
	const hasFormUrlEncoded = isFormUrlEncoded && body.formUrlEncoded;
	const bodyAccess = body.definition ? body.isOptional ? `${body.implementation}?.()` : `${body.implementation}()` : void 0;
	const bodyValue = hasFormData ? "formData" : hasFormUrlEncoded ? "formUrlEncoded" : bodyAccess;
	const paramsAccess = queryParams ? "params?.()" : void 0;
	const headersAccess = headers ? "headers?.()" : void 0;
	const filteredParamsValue = paramsAccess ? getAngularFilteredParamsCallExpression(`${paramsAccess} ?? {}`, queryParams?.requiredNullableKeys ?? [], !!paramsSerializer) : void 0;
	const paramsValue = paramsAccess ? paramsSerializer ? `params?.() ? ${paramsSerializer.name}(${filteredParamsValue}) : undefined` : filteredParamsValue : void 0;
	const isGet = verb === "get";
	const isUrlOnly = !(!isGet || !!bodyValue || !!paramsValue || !!headersAccess) && !bodyForm;
	const requestLines = [
		`url: \`${route}\``,
		isGet ? void 0 : `method: '${verb.toUpperCase()}'`,
		bodyValue ? `body: ${bodyValue}` : void 0,
		paramsValue ? `params: ${paramsValue}` : void 0,
		headersAccess ? `headers: ${headersAccess}` : void 0
	].filter(Boolean);
	return {
		bodyForm,
		request: isUrlOnly ? `\`${route}\`` : `({\n      ${requestLines.join(",\n      ")}\n    })`,
		isUrlOnly
	};
};
const getHttpResourceResponseImports = (response) => {
	const successDefinition = response.definition.success;
	if (!successDefinition) return [];
	return response.imports.filter((imp) => {
		const name = imp.alias ?? imp.name;
		return new RegExp(String.raw`\b${escapeRegExp(name)}\b`, "g").test(successDefinition);
	});
};
const getHttpResourceVerbImports = (verbOptions, output) => {
	const { response, body, queryParams, props, headers, params } = verbOptions;
	return [
		...isZodSchemaOutput(output) ? [...getHttpResourceResponseImports(response).map((imp) => ({
			...imp,
			values: true
		})), ...getHttpResourceResponseImports(response).filter((imp) => !isPrimitiveType(imp.name)).map((imp) => ({ name: getSchemaOutputTypeRef(imp.name) }))] : getHttpResourceResponseImports(response),
		...body.imports,
		...props.flatMap((prop) => prop.type === GetterPropType.NAMED_PATH_PARAMS ? [{ name: prop.schema.name }] : []),
		...queryParams ? [{ name: queryParams.schema.name }] : [],
		...headers ? [{ name: headers.schema.name }] : [],
		...params.flatMap(({ imports }) => imports),
		{
			name: "map",
			values: true,
			importPath: "rxjs"
		}
	];
};
const getParseExpression = (response, factory, output, responseTypeOverride) => {
	if (factory !== "httpResource") return void 0;
	const zodSchema = response.imports.find((imp) => imp.isZodSchema);
	if (zodSchema) return `${zodSchema.name}.parse`;
	if (!output.override.angular.runtimeValidation) return void 0;
	if (!isZodSchemaOutput(output)) return void 0;
	const responseType = responseTypeOverride ?? response.definition.success;
	if (!responseType) return void 0;
	if (isPrimitiveType(responseType)) return void 0;
	if (!response.imports.some((imp) => imp.name === responseType)) return void 0;
	return `${responseType}.parse`;
};
/**
* Builds the literal option entries that Orval injects into generated
* `httpResource()` calls.
*
* This merges user-supplied generator configuration such as `defaultValue` or
* `debugName` with automatically derived runtime-validation hooks like
* `parse: Schema.parse`.
*
* @returns The option entries plus metadata about whether a configured default value exists.
*/
const buildHttpResourceOptionsLiteral = (verbOption, factory, output, responseTypeOverride) => {
	const override = getHttpResourceOverride(verbOption, output);
	const parseExpression = getParseExpression(verbOption.response, factory, output, responseTypeOverride);
	const defaultValueLiteral = override?.defaultValue === void 0 ? void 0 : JSON.stringify(override.defaultValue);
	return {
		entries: [
			parseExpression ? `parse: ${parseExpression}` : void 0,
			defaultValueLiteral ? `defaultValue: ${defaultValueLiteral}` : void 0,
			override?.debugName === void 0 ? void 0 : `debugName: ${JSON.stringify(override.debugName)}`,
			override?.injector ? `injector: ${override.injector}` : void 0,
			override?.equal ? `equal: ${override.equal}` : void 0
		].filter((value) => value !== void 0),
		hasDefaultValue: defaultValueLiteral !== void 0
	};
};
const appendArgument = (args, argument) => {
	const normalizedArgs = args.trim().replace(/,\s*$/, "");
	return normalizedArgs.length > 0 ? `${normalizedArgs},
  ${argument}` : argument;
};
const normalizeOptionalParametersForRequiredTrailingArg = (args) => args.replaceAll(/(\w+)\?:\s*([^,\n]+)(,?)/g, "$1: $2 | undefined$3");
const buildHttpResourceOptionsArgument = (valueType, rawType, options, omitParse = false) => {
	const baseType = `${HTTP_RESOURCE_OPTIONS_TYPE_NAME}<${valueType}, ${rawType}${omitParse ? ", true" : ""}>`;
	return options.requiresDefaultValue ? `options: ${baseType} & { defaultValue: NoInfer<${valueType}> }` : `options?: ${baseType}`;
};
const buildHttpResourceOptionsExpression = (configuredEntries) => {
	if (configuredEntries.length === 0) return "options";
	return `{
    ...(options ?? {}),
    ${configuredEntries.join(",\n    ")}
  }`;
};
const buildHttpResourceFunctionSignatures = (resourceName, args, valueType, rawType, hasConfiguredDefaultValue, omitParse = false) => {
	if (hasConfiguredDefaultValue) return `export function ${resourceName}(${appendArgument(args, buildHttpResourceOptionsArgument(valueType, rawType, { requiresDefaultValue: false }, omitParse))}): HttpResourceRef<${valueType}>`;
	return `export function ${resourceName}(${appendArgument(normalizeOptionalParametersForRequiredTrailingArg(args), buildHttpResourceOptionsArgument(valueType, rawType, { requiresDefaultValue: true }, omitParse))}): HttpResourceRef<${valueType}>;
export function ${resourceName}(${appendArgument(args, buildHttpResourceOptionsArgument(valueType, rawType, { requiresDefaultValue: false }, omitParse))}): HttpResourceRef<${valueType} | undefined>`;
};
/**
* Generates a single Angular `httpResource` helper function for an operation.
*
* The generated output handles signal-wrapped parameters, route interpolation,
* request-body construction, content-type branching, runtime validation, and
* optional mutator integration when the mutator is compatible with standalone
* resource functions.
*
* @remarks
* This function emits overloads when content negotiation or caller-supplied
* `defaultValue` support requires multiple signatures.
*
* @returns A string containing the complete generated resource helper.
*/
const buildHttpResourceFunction = (verbOption, route, output) => {
	const { operationName, response, props, params, mutator } = verbOption;
	const dataType = response.definition.success || "unknown";
	const omitParse = isZodSchemaOutput(output);
	const responseSchemaImports = getHttpResourceResponseImports(response);
	const hasResponseSchemaImport = responseSchemaImports.some((imp) => imp.name === dataType);
	const resourceName = `${operationName}Resource`;
	const parsedDataType = omitParse && output.override.angular.runtimeValidation && !isPrimitiveType(dataType) && hasResponseSchemaImport ? getSchemaOutputTypeRef(dataType) : dataType;
	const successTypes = response.types.success;
	const overallReturnType = successTypes.length <= 1 ? parsedDataType : [...new Set(successTypes.map((type) => getHttpResourceGeneratedResponseType(type.value, type.contentType, responseSchemaImports, output)))].join(" | ") || parsedDataType;
	resourceReturnTypesRegistry.set(operationName, `export type ${pascal(operationName)}ResourceResult = NonNullable<${overallReturnType}>`);
	const uniqueContentTypes = getUniqueContentTypes(successTypes);
	const defaultSuccess = getDefaultSuccessType(successTypes, dataType);
	const jsonContentType = successTypes.find((type) => type.contentType.includes("json"))?.contentType;
	const resourceFactory = getHttpResourceFactory(response, jsonContentType ?? defaultSuccess.contentType, dataType);
	const signalRoute = applySignalRoute(route, params, props.some((prop) => prop.type === GetterPropType.NAMED_PATH_PARAMS));
	const signalProps = buildSignalProps(props, params);
	const args = toObjectString(signalProps, "implementation");
	const { bodyForm, request, isUrlOnly } = buildResourceRequest(verbOption, signalRoute);
	if (uniqueContentTypes.length > 1) {
		const defaultContentType = jsonContentType ?? defaultSuccess.contentType;
		const acceptTypeName = getAcceptHelperName(operationName);
		const requiredProps = signalProps.filter((_, index) => props[index]?.required && !props[index]?.default);
		const optionalProps = signalProps.filter((_, index) => !props[index]?.required || props[index]?.default);
		const requiredPart = requiredProps.map((prop) => prop.implementation).join(",\n    ");
		const optionalPart = optionalProps.map((prop) => prop.implementation).join(",\n    ");
		const getBranchReturnType = (type) => getHttpResourceGeneratedResponseType(type.value, type.contentType, responseSchemaImports, output);
		const unionReturnType = [...new Set(successTypes.filter((type) => type.contentType).map((type) => getBranchReturnType(type)))].join(" | ");
		const getBranchRawType = (type) => getHttpResourceRawType(getHttpResourceFactory(response, type.contentType, type.value));
		const implementationOptionsType = [...new Set(successTypes.filter((type) => type.contentType).map((type) => buildBranchOptionsType(getBranchReturnType(type), getBranchRawType(type), omitParse)))].join(" | ");
		const branchOverloads = successTypes.filter((type) => type.contentType).map((type) => {
			const returnType = getBranchReturnType(type);
			return `export function ${resourceName}(${[
				requiredPart,
				`accept: '${type.contentType}'`,
				optionalPart,
				`options?: ${buildBranchOptionsType(returnType, getBranchRawType(type), omitParse)}`
			].filter(Boolean).join(",\n    ")}): HttpResourceRef<${returnType} | undefined>;`;
		}).join("\n");
		const implementationArgsWithDefault = [
			requiredPart,
			`accept: ${acceptTypeName} = '${defaultContentType}'`,
			optionalPart,
			`options?: ${implementationOptionsType}`
		].filter(Boolean).join(",\n    ");
		const getBranchOptions = (type) => {
			if (!type) return `options as ${buildBranchOptionsType(unionReturnType, "unknown", omitParse)}`;
			const factory = getHttpResourceFactory(response, type.contentType, type.value);
			return `${buildHttpResourceOptionsExpression(buildHttpResourceOptionsLiteral(verbOption, factory, output, type.value).entries) ?? "options"} as unknown as ${buildBranchOptionsType(getBranchReturnType(type), getHttpResourceRawType(factory), omitParse)}`;
		};
		const jsonType = successTypes.find((type) => type.contentType.includes("json") || type.contentType.includes("+json"));
		const textType = successTypes.find((type) => isResponseText(type.contentType, type.value));
		const arrayBufferType = successTypes.find((type) => isResponseArrayBuffer(type.contentType));
		const blobType = successTypes.find((type) => isResponseBlob(type.contentType, response.isBlob));
		const fallbackType = successTypes.find((type) => type.contentType === defaultContentType) ?? jsonType ?? textType ?? arrayBufferType ?? blobType;
		const buildFallbackReturn = (type) => {
			const factory = getHttpResourceFactory(response, type.contentType, type.value);
			return `return ${factory}<${factory === "httpResource" ? getBranchReturnType(type) : getHttpResourceRawType(factory)}>(() => ({
      ...normalizedRequest,
      headers,
    }), ${getBranchOptions(type)});`;
		};
		const fallbackReturn = fallbackType ? buildFallbackReturn(fallbackType) : `return httpResource<${parsedDataType}>(() => ({
      ...normalizedRequest,
      headers,
    }), ${getBranchOptions()});`;
		const defaultOverloadOptionsType = fallbackType ? buildBranchOptionsType(getBranchReturnType(fallbackType), getBranchRawType(fallbackType), omitParse) : implementationOptionsType;
		const defaultOverloadReturnType = fallbackType ? getBranchReturnType(fallbackType) : unionReturnType;
		const defaultOverloadArgs = [
			requiredPart,
			optionalPart,
			`options?: ${defaultOverloadOptionsType}`
		].filter(Boolean).join(",\n    ");
		const normalizeRequest = isUrlOnly ? `const normalizedRequest: HttpResourceRequest = { url: request };` : `const normalizedRequest: HttpResourceRequest = request;`;
		return `/**
 * @experimental httpResource is experimental (Angular v19.2+)
 */
${branchOverloads}
export function ${resourceName}(
    ${defaultOverloadArgs}
  ): HttpResourceRef<${defaultOverloadReturnType} | undefined>;
export function ${resourceName}(
    ${implementationArgsWithDefault}
): HttpResourceRef<${unionReturnType} | undefined> {
  ${bodyForm ? `${bodyForm};` : ""}
  const request = ${request};
  ${normalizeRequest}
  const headers = normalizedRequest.headers instanceof HttpHeaders
    ? normalizedRequest.headers.set('Accept', accept)
    : { ...(normalizedRequest.headers ?? {}), Accept: accept };

  if (accept.includes('json') || accept.includes('+json')) {
    return httpResource<${jsonType ? getBranchReturnType(jsonType) : parsedDataType}>(() => ({
      ...normalizedRequest,
      headers,
    }), ${getBranchOptions(jsonType)});
  }

  if (accept.startsWith('text/') || accept.includes('xml')) {
    return httpResource.text<string>(() => ({
      ...normalizedRequest,
      headers,
    }), ${getBranchOptions(textType)});
  }

  ${arrayBufferType ? `if (accept.includes('octet-stream') || accept.includes('pdf')) {
    return httpResource.arrayBuffer<ArrayBuffer>(() => ({
      ...normalizedRequest,
      headers,
    }), ${getBranchOptions(arrayBufferType)});
  }

  ` : ""}${fallbackReturn}
}
`;
	}
	const resourceOptions = buildHttpResourceOptionsLiteral(verbOption, resourceFactory, output);
	const rawType = getHttpResourceRawType(resourceFactory);
	const resourceValueType = resourceOptions.hasDefaultValue ? parsedDataType : `${parsedDataType} | undefined`;
	const functionSignatures = buildHttpResourceFunctionSignatures(resourceName, args, parsedDataType, rawType, resourceOptions.hasDefaultValue, omitParse);
	const implementationArgs = appendArgument(args, buildHttpResourceOptionsArgument(parsedDataType, rawType, { requiresDefaultValue: false }, omitParse));
	const optionsExpression = buildHttpResourceOptionsExpression(resourceOptions.entries);
	const resourceCallOptions = optionsExpression ? `, ${optionsExpression}` : "";
	const isResourceCompatibleMutator = mutator !== void 0 && !mutator.hasSecondArg;
	const returnExpression = isResourceCompatibleMutator ? `${mutator.name}(request)` : "request";
	if (isUrlOnly && !isResourceCompatibleMutator) return `/**
 * @experimental httpResource is experimental (Angular v19.2+)
 */
${functionSignatures};
export function ${resourceName}(${implementationArgs}): HttpResourceRef<${resourceValueType}> {
  return ${resourceFactory}<${parsedDataType}>(() => ${request}${resourceCallOptions});
}
`;
	return `/**
 * @experimental httpResource is experimental (Angular v19.2+)
 */
${functionSignatures};
export function ${resourceName}(${implementationArgs}): HttpResourceRef<${resourceValueType}> {
  return ${resourceFactory}<${parsedDataType}>(() => {
    ${bodyForm ? `${bodyForm};` : ""}
    const request = ${request};
    return ${returnExpression};
  }${resourceCallOptions});
}
`;
};
const buildHttpResourceOptionsUtilities = (omitParse) => `
export type ${HTTP_RESOURCE_OPTIONS_TYPE_NAME}<TValue, TRaw = unknown, TOmitParse extends boolean = ${omitParse}> = TOmitParse extends true
  ? Omit<HttpResourceOptions<TValue, TRaw>, 'parse'>
  : HttpResourceOptions<TValue, TRaw>;
`;
const getContentTypeReturnType = (contentType, value) => {
	if (!contentType) return value;
	if (contentType.includes("json") || contentType.includes("+json")) return value;
	if (contentType.startsWith("text/") || contentType.includes("xml")) return "string";
	if (isResponseArrayBuffer(contentType)) return "ArrayBuffer";
	return "Blob";
};
const getHttpResourceGeneratedResponseType = (value, contentType, responseImports, output) => {
	if (isZodSchemaOutput(output) && output.override.angular.runtimeValidation && !!contentType && (contentType.includes("json") || contentType.includes("+json")) && !isPrimitiveType(value) && responseImports.some((imp) => imp.name === value)) return getSchemaOutputTypeRef(value);
	return getContentTypeReturnType(contentType, value);
};
const buildBranchOptionsType = (valueType, rawType, omitParse) => `${HTTP_RESOURCE_OPTIONS_TYPE_NAME}<${valueType}, ${rawType}${omitParse ? ", true" : ""}>`;
const buildResourceStateUtilities = () => `
/**
 * Utility type for httpResource results with status tracking.
 * Inspired by @angular-architects/ngrx-toolkit withResource pattern.
 *
 * Uses \`globalThis.Error\` to avoid collision with API model types named \`Error\`.
 */
export interface ResourceState<T> {
  readonly value: Signal<T | undefined>;
  readonly status: Signal<ResourceStatus>;
  readonly error: Signal<globalThis.Error | undefined>;
  readonly isLoading: Signal<boolean>;
  readonly hasValue: () => boolean;
  readonly reload: () => boolean;
}

/**
 * Wraps an HttpResourceRef to expose a consistent ResourceState interface.
 * Useful when integrating with NgRx SignalStore via withResource().
 */
export function toResourceState<T>(ref: HttpResourceRef<T>): ResourceState<T> {
  return {
    value: ref.value,
    status: ref.status,
    error: ref.error,
    isLoading: ref.isLoading,
    hasValue: () => ref.hasValue(),
    reload: () => ref.reload(),
  };
}
`;
/**
* Generates the header section for Angular `httpResource` output.
*
* @remarks
* Resource functions are emitted in the header phase because their final shape
* depends on the full set of operations in scope, including generated `Accept`
* helpers and any shared mutation service methods.
*
* @returns The generated header, resource helpers, optional mutation service class, and resource result aliases.
*/
const generateHttpResourceHeader = ({ title, isRequestOptions, isMutator, isGlobalMutator, provideIn, output, verbOptions, tag }) => {
	resetHttpClientReturnTypes();
	resourceReturnTypesRegistry.reset();
	const relevantVerbOptions = getRelevantVerbOptions(verbOptions, tag);
	const retrievals = relevantVerbOptions.filter((verbOption) => isRetrievalVerb(verbOption.verb, verbOption.operationName, getClientOverride(verbOption)));
	const hasResourceQueryParams = retrievals.some((verbOption) => !!verbOption.queryParams);
	const filterParamsHelper = hasResourceQueryParams ? `\n${getAngularFilteredParamsHelperBody()}\n` : "";
	const acceptHelpers = buildAcceptHelpers(retrievals, output);
	const resources = retrievals.map((verbOption) => {
		return buildHttpResourceFunction(verbOption, routeRegistry.get(verbOption.operationName, verbOption.route), output);
	}).join("\n");
	const resourceTypes = resourceReturnTypesRegistry.getFooter(retrievals.map((verbOption) => verbOption.operationName));
	const mutations = relevantVerbOptions.filter((verbOption) => isMutationVerb(verbOption.verb, verbOption.operationName, getClientOverride(verbOption)));
	const hasMutationQueryParams = mutations.some((verbOption) => !!verbOption.queryParams);
	const mutationImplementation = mutations.map((verbOption) => {
		return generateHttpClientImplementation(verbOption, {
			route: routeRegistry.get(verbOption.operationName, verbOption.route),
			context: { output }
		});
	}).join("\n");
	const classImplementation = mutationImplementation ? `
${buildServiceClassOpen({
		title,
		isRequestOptions,
		isMutator,
		isGlobalMutator,
		provideIn,
		hasQueryParams: hasMutationQueryParams && !hasResourceQueryParams
	})}
${mutationImplementation}
};
` : "";
	return `${buildHttpResourceOptionsUtilities(isZodSchemaOutput(output))}${filterParamsHelper}${acceptHelpers ? `${acceptHelpers}\n\n` : ""}${resources}${classImplementation}${resourceTypes ? `\n${resourceTypes}\n` : ""}`;
};
/**
* Generates the footer for Angular `httpResource` output.
*
* The footer appends any registered `ClientResult` aliases coming from shared
* `HttpClient` mutation methods and the resource-state helper utilities emitted
* for generated Angular resources.
*
* @returns The footer text for the generated Angular resource file.
*/
const generateHttpResourceFooter = ({ operationNames }) => {
	const clientTypes = getHttpClientReturnTypes(operationNames);
	const utilities = buildResourceStateUtilities();
	return `${clientTypes ? `${clientTypes}\n` : ""}${utilities}`;
};
/**
* Per-operation builder used during Angular `httpResource` generation.
*
* Unlike the `HttpClient` builder, the actual implementation body is emitted in
* the header phase after all operations are known. This function mainly records
* the resolved route and returns the imports required by the current operation.
*
* @returns An empty implementation plus the imports required by the operation.
*/
const generateHttpResourceClient = (verbOptions, options) => {
	routeRegistry.set(verbOptions.operationName, options.route);
	return {
		implementation: "\n",
		imports: getHttpResourceVerbImports(verbOptions, options.context.output)
	};
};
const buildHttpResourceFile = (verbOptions, output, context) => {
	resourceReturnTypesRegistry.reset();
	const retrievals = Object.values(verbOptions).filter((verbOption) => isRetrievalVerb(verbOption.verb, verbOption.operationName, getClientOverride(verbOption)));
	const filterParamsHelper = retrievals.some((verbOption) => !!verbOption.queryParams) ? `\n${getAngularFilteredParamsHelperBody()}\n` : "";
	const resources = retrievals.map((verbOption) => {
		return buildHttpResourceFunction(verbOption, getFullRoute(verbOption.route, context.spec.servers, output.baseUrl), output);
	}).join("\n");
	const resourceTypes = resourceReturnTypesRegistry.getFooter(Object.values(verbOptions).map((verbOption) => verbOption.operationName));
	const utilities = buildResourceStateUtilities();
	const acceptHelpers = buildAcceptHelpers(retrievals, output);
	return `${buildHttpResourceOptionsUtilities(isZodSchemaOutput(output))}${filterParamsHelper}${acceptHelpers ? `${acceptHelpers}\n\n` : ""}${resources}\n${resourceTypes ? `${resourceTypes}\n` : ""}${utilities}`;
};
const buildSchemaImportDependencies = (output, imports, relativeSchemasPath) => {
	const isZod = isZodSchemaOutput(output);
	const uniqueImports = [...new Map(imports.map((imp) => [imp.name, imp])).values()];
	if (!output.schemas) return [{
		exports: isZod ? uniqueImports.map((imp) => ({
			...imp,
			values: true
		})) : uniqueImports,
		dependency: relativeSchemasPath
	}];
	if (!output.indexFiles) return [...uniqueImports].map((imp) => {
		const name = conventionName(imp.schemaName ?? imp.name, output.namingConvention);
		const suffix = isZod ? ".zod" : "";
		const importExtension = output.fileExtension.replace(/\.ts$/, "");
		return {
			exports: isZod ? [{
				...imp,
				values: true
			}] : [imp],
			dependency: upath.joinSafe(relativeSchemasPath, `${name}${suffix}${importExtension}`)
		};
	});
	if (isZod) return [{
		exports: uniqueImports.map((imp) => ({
			...imp,
			values: true
		})),
		dependency: relativeSchemasPath
	}];
	return [{
		exports: uniqueImports,
		dependency: relativeSchemasPath
	}];
};
const getHttpResourceExtraFilePath = (output, tag) => {
	const { extension, dirname, filename } = getFileInfo(output.target, { extension: output.fileExtension });
	switch (output.mode) {
		case OutputMode.TAGS: {
			const normalizedTag = kebab(tag ?? "default");
			return upath.joinSafe(dirname, `${normalizedTag}.resource${extension}`);
		}
		case OutputMode.TAGS_SPLIT: {
			const normalizedTag = kebab(tag ?? "default");
			return upath.joinSafe(dirname, normalizedTag, `${normalizedTag}.resource${extension}`);
		}
		default: return upath.joinSafe(dirname, `${filename}.resource${extension}`);
	}
};
const getHttpResourceRelativeSchemasPath = (output, outputPath) => {
	const schemasPath = typeof output.schemas === "string" ? output.schemas : output.schemas?.path;
	if (schemasPath) return upath.getRelativeImportPath(outputPath, getFileInfo(schemasPath).dirname);
	const { dirname, filename, extension } = getFileInfo(output.target, { extension: output.fileExtension });
	return upath.getRelativeImportPath(outputPath, upath.joinSafe(dirname, `${filename}.schemas${extension}`), output.fileExtension !== ".ts");
};
const buildHttpResourceExtraFile = (verbOptions, outputPath, output, context, header) => {
	const implementation = buildHttpResourceFile(verbOptions, output, context);
	const schemaImports = buildSchemaImportDependencies(output, Object.values(verbOptions).filter((verbOption) => isRetrievalVerb(verbOption.verb, verbOption.operationName, getClientOverride(verbOption))).flatMap((verbOption) => getHttpResourceVerbImports(verbOption, output)), getHttpResourceRelativeSchemasPath(output, outputPath));
	const dependencies = getAngularHttpResourceOnlyDependencies(false, false);
	const importImplementation = generateDependencyImports(implementation, [...schemaImports, ...dependencies], context.projectName, !!output.schemas, isSyntheticDefaultImportsAllow(output.tsconfig));
	const mutators = Object.values(verbOptions).filter((verbOption) => isRetrievalVerb(verbOption.verb, verbOption.operationName, getClientOverride(verbOption))).flatMap((verbOption) => {
		return [
			verbOption.mutator && !verbOption.mutator.hasSecondArg ? verbOption.mutator : void 0,
			verbOption.formData,
			verbOption.formUrlEncoded,
			verbOption.paramsSerializer
		].filter((value) => value !== void 0);
	});
	return {
		content: `${header}${importImplementation}${mutators.length > 0 ? generateMutatorImports({
			mutators,
			oneMore: output.mode === OutputMode.TAGS_SPLIT
		}) : ""}${implementation}`,
		path: outputPath
	};
};
/**
* Generates the extra sibling resource files used by Angular `both` mode.
*
* @remarks
* The main generated file keeps the `HttpClient` service class while retrieval
* resources are emitted into `*.resource.ts` so consumers can opt into both
* access patterns without mixing the generated surfaces. In tag-based output
* modes this emits one sibling resource file per generated tag file.
*
* @returns One or more extra file descriptors representing generated resource files.
*/
const generateHttpResourceExtraFiles = (verbOptions, output, context) => {
	const header = getHeader(output.override.header, context.spec.info);
	if (!hasRetrievalOperations(verbOptions)) return Promise.resolve([]);
	if (output.mode === OutputMode.TAGS || output.mode === OutputMode.TAGS_SPLIT) {
		const groupedVerbOptions = /* @__PURE__ */ new Map();
		for (const verbOption of Object.values(verbOptions)) {
			const tag = getPrimaryTag(verbOption);
			const currentGroup = groupedVerbOptions.get(tag) ?? {};
			currentGroup[verbOption.operationId] = verbOption;
			groupedVerbOptions.set(tag, currentGroup);
		}
		return Promise.resolve([...groupedVerbOptions.entries()].filter(([, tagVerbOptions]) => hasRetrievalOperations(tagVerbOptions)).map(([tag, tagVerbOptions]) => buildHttpResourceExtraFile(tagVerbOptions, getHttpResourceExtraFilePath(output, tag), output, context, header)));
	}
	return Promise.resolve([buildHttpResourceExtraFile(getVerbOptionsRecord(getRelevantVerbOptions(verbOptions)), getHttpResourceExtraFilePath(output), output, context, header)]);
};
//#endregion
//#region src/index.ts
const httpClientBuilder = {
	client: generateAngular,
	header: generateAngularHeader,
	dependencies: getAngularDependencies,
	footer: generateAngularFooter,
	title: generateAngularTitle
};
const httpResourceBuilder = {
	client: generateHttpResourceClient,
	header: generateHttpResourceHeader,
	dependencies: getAngularHttpResourceDependencies,
	footer: generateHttpResourceFooter,
	title: generateAngularTitle
};
const bothClientBuilder = {
	...httpClientBuilder,
	extraFiles: generateHttpResourceExtraFiles
};
const builder = () => (options) => {
	switch (options?.client) {
		case "httpResource": return httpResourceBuilder;
		case "both": return bothClientBuilder;
		default: return httpClientBuilder;
	}
};
//#endregion
export { ANGULAR_HTTP_CLIENT_DEPENDENCIES, ANGULAR_HTTP_RESOURCE_DEPENDENCIES, HTTP_CLIENT_OBSERVE_OPTIONS_TEMPLATE, HTTP_CLIENT_OPTIONS_TEMPLATE, PRIMITIVE_TYPES, THIRD_PARAMETER_TEMPLATE, buildAcceptHelpers, buildServiceClassOpen, builder, builder as default, createReturnTypesRegistry, createRouteRegistry, generateAngular, generateAngularFooter, generateAngularHeader, generateAngularTitle, generateHttpClientImplementation, generateHttpResourceClient, generateHttpResourceExtraFiles, generateHttpResourceFooter, generateHttpResourceHeader, getAcceptHelperName, getAngularDependencies, getAngularHttpResourceDependencies, getAngularHttpResourceOnlyDependencies, getDefaultSuccessType, getHttpClientReturnTypes, getSchemaOutputTypeRef, getUniqueContentTypes, isDefined, isMutationVerb, isPrimitiveType, isRetrievalVerb, isZodSchemaOutput, resetHttpClientReturnTypes, routeRegistry };

//# sourceMappingURL=index.mjs.map