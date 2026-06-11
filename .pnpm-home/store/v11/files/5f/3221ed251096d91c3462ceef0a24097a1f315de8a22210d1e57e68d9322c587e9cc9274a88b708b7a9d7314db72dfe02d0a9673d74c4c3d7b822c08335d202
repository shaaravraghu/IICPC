import { GetterPropType, OutputClient, OutputHttpClient, TEMPLATE_TAG_REGEX, Verbs, camel, compareVersions, generateFormDataAndUrlEncodedFunction, generateMutator, generateMutatorConfig, generateMutatorRequestOptions, generateOptions, generateVerbImports, getAngularFilteredParamsCallExpression, getAngularFilteredParamsHelperBody, getRouteAsArray, getSuccessResponseType, isObject, isString, isSyntheticDefaultImportsAllow, jsDoc, kebab, logWarning, mergeDeep, pascal, stringify, toObjectString } from "@orval/core";
import { generateFetchHeader, generateRequestFunction } from "@orval/fetch";
import nodePath from "node:path";
import { styleText } from "node:util";
import { omitBy } from "remeda";
//#region src/utils.ts
const normalizeQueryOptions = (queryOptions = {}, outputWorkspace) => {
	return {
		...queryOptions.usePrefetch ? { usePrefetch: true } : {},
		...queryOptions.useInvalidate ? { useInvalidate: true } : {},
		...queryOptions.useSetQueryData ? { useSetQueryData: true } : {},
		...queryOptions.useGetQueryData ? { useGetQueryData: true } : {},
		...queryOptions.useQuery ? { useQuery: true } : {},
		...queryOptions.useInfinite ? { useInfinite: true } : {},
		...queryOptions.useInfiniteQueryParam ? { useInfiniteQueryParam: queryOptions.useInfiniteQueryParam } : {},
		...queryOptions.options ? { options: queryOptions.options } : {},
		...queryOptions.queryKey ? { queryKey: normalizeMutator(outputWorkspace, queryOptions.queryKey) } : {},
		...queryOptions.queryOptions ? { queryOptions: normalizeMutator(outputWorkspace, queryOptions.queryOptions) } : {},
		...queryOptions.mutationOptions ? { mutationOptions: normalizeMutator(outputWorkspace, queryOptions.mutationOptions) } : {},
		...queryOptions.signal ? { signal: true } : {},
		...queryOptions.shouldExportMutatorHooks ? { shouldExportMutatorHooks: true } : {},
		...queryOptions.shouldExportQueryKey ? { shouldExportQueryKey: true } : {},
		...queryOptions.shouldExportHttpClient ? { shouldExportHttpClient: true } : {},
		...queryOptions.shouldSplitQueryKey ? { shouldSplitQueryKey: true } : {},
		...queryOptions.useOperationIdAsQueryKey ? { useOperationIdAsQueryKey: true } : {}
	};
};
const normalizeMutator = (workspace, mutator) => {
	if (isObject(mutator)) {
		const m = mutator;
		if (!m.path) throw new Error(styleText("red", `Mutator need a path`));
		return {
			path: nodePath.resolve(workspace, m.path),
			name: m.name,
			default: m.default ?? !m.name,
			alias: m.alias,
			external: m.external,
			extension: m.extension
		};
	}
	if (isString(mutator)) return {
		path: nodePath.resolve(workspace, mutator),
		default: true
	};
};
function vueWrapTypeWithMaybeRef(props) {
	return props.map((prop) => {
		const [paramName, paramType] = prop.implementation.split(":");
		if (!paramType) return prop;
		const name = prop.type === GetterPropType.NAMED_PATH_PARAMS ? prop.name : paramName;
		const [type, defaultValue] = paramType.split("=");
		return {
			...prop,
			implementation: `${name}: MaybeRef<${type.trim()}>${defaultValue ? ` = ${defaultValue}` : ""}`
		};
	});
}
const vueUnRefParams = (props) => {
	return props.map((prop) => {
		if (prop.type === GetterPropType.NAMED_PATH_PARAMS) return `const ${prop.destructured} = unref(${prop.name});`;
		return `${prop.name} = unref(${prop.name});`;
	}).join("\n");
};
const wrapRouteParameters = (route, prepend, append) => route.replaceAll(TEMPLATE_TAG_REGEX, `\${${prepend}$1${append}}`);
const makeRouteSafe = (route) => wrapRouteParameters(route, "encodeURIComponent(String(", "))");
const getQueryTypeForFramework = (type) => {
	switch (type) {
		case "suspenseQuery": return "query";
		case "suspenseInfiniteQuery": return "infiniteQuery";
		default: return type;
	}
};
const getHasSignal = ({ overrideQuerySignal = false }) => overrideQuerySignal;
//#endregion
//#region src/client.ts
const AXIOS_DEPENDENCIES = [{
	exports: [
		{
			name: "axios",
			default: true,
			values: true,
			syntheticDefaultImport: true
		},
		{ name: "AxiosRequestConfig" },
		{ name: "AxiosResponse" },
		{ name: "AxiosError" }
	],
	dependency: "axios"
}];
const ANGULAR_HTTP_DEPENDENCIES = [
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
			{
				name: "HttpParams",
				values: true
			},
			{ name: "HttpContext" }
		],
		dependency: "@angular/common/http"
	},
	{
		exports: [{
			name: "lastValueFrom",
			values: true
		}, {
			name: "fromEvent",
			values: true
		}],
		dependency: "rxjs"
	},
	{
		exports: [{
			name: "takeUntil",
			values: true
		}, {
			name: "map",
			values: true
		}],
		dependency: "rxjs/operators"
	}
];
const generateAngularHttpRequestFunction = ({ headers, queryParams, operationName, response, mutator, body, props, verb, formData, formUrlEncoded, override }, { route, context }) => {
	const isRequestOptions = override.requestOptions !== false;
	const isFormData = !override.formData.disabled;
	const isFormUrlEncoded = override.formUrlEncoded !== false;
	const hasSignal = getHasSignal({ overrideQuerySignal: override.query.signal });
	const hasSignalParam = props.some((prop) => prop.name === "signal");
	const bodyForm = generateFormDataAndUrlEncodedFunction({
		formData,
		formUrlEncoded,
		body,
		isFormData,
		isFormUrlEncoded
	});
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
			hasSignal,
			hasSignalParam,
			isExactOptionalPropertyTypes: !!context.output.tsconfig?.compilerOptions?.exactOptionalPropertyTypes,
			isVue: false,
			isAngular: context.output.httpClient === OutputHttpClient.ANGULAR
		});
		const requestOptions = isRequestOptions ? generateMutatorRequestOptions(override.requestOptions, mutator.hasSecondArg) : "";
		const propsImplementation = toObjectString(props, "implementation");
		return `${override.query.shouldExportHttpClient ? "export " : ""}const ${operationName} = (\n    ${propsImplementation}\n ${isRequestOptions && mutator.hasSecondArg ? `options${context.output.optionsParamRequired ? "" : "?"}: SecondParameter<typeof ${mutator.name}>,` : ""} ${getSignalDefinition({
			hasSignal,
			hasSignalParam
		})}) => {
      ${bodyForm}
      return ${mutator.name}<${response.definition.success || "unknown"}>(
      ${mutatorConfig},
      ${requestOptions});
    }
  `;
	}
	const queryProps = toObjectString(props, "implementation").replace(/,\s*$/, "");
	const dataType = response.definition.success || "unknown";
	const hasQueryParams = queryParams?.schema.name;
	const filteredParamsExpression = getAngularFilteredParamsCallExpression("params", queryParams?.requiredNullableKeys);
	const urlConstruction = hasQueryParams ? `const httpParams = params ? new HttpParams({ fromObject: ${filteredParamsExpression} }) : undefined;
    const url = \`${route}\`;` : `const url = \`${route}\`;`;
	const httpOptions = [];
	if (hasQueryParams) httpOptions.push("params: httpParams");
	if (headers) httpOptions.push("headers: new HttpHeaders(headers)");
	const successResponseType = getSuccessResponseType(response);
	const responseTypeOption = successResponseType ? `'${successResponseType}'` : void 0;
	if (responseTypeOption) httpOptions.push(`responseType: ${responseTypeOption}`);
	const optionsStr = httpOptions.length > 0 ? `, { ${httpOptions.join(", ")} }` : "";
	let httpCall;
	const httpGeneric = responseTypeOption ? "" : `<${dataType}>`;
	const bodyArg = isFormData && body.formData ? "formData" : isFormUrlEncoded && body.formUrlEncoded ? "formUrlEncoded" : body.definition ? toObjectString([body], "implementation").replace(/,\s*$/, "") : "";
	switch (verb) {
		case "get":
		case "head":
			httpCall = `http.${verb}${httpGeneric}(url${optionsStr})`;
			break;
		case "delete":
			httpCall = bodyArg ? `http.${verb}${httpGeneric}(url, { ${httpOptions.length > 0 ? httpOptions.join(", ") + ", " : ""}body: ${bodyArg} })` : `http.${verb}${httpGeneric}(url${optionsStr})`;
			break;
		default:
			httpCall = `http.${verb}${httpGeneric}(url, ${bodyArg || "undefined"}${optionsStr})`;
			break;
	}
	const responseType = response.definition.success;
	const isPrimitiveType = [
		"string",
		"number",
		"boolean",
		"void",
		"unknown"
	].includes(responseType);
	const hasSchema = response.imports.some((imp) => imp.name === responseType);
	const isZodOutput = isObject(context.output.schemas) && context.output.schemas.type === "zod";
	if (override.query.runtimeValidation && isZodOutput && !isPrimitiveType && hasSchema) httpCall = `${httpCall}.pipe(map(data => ${responseType === "Error" ? "ErrorSchema" : responseType}.parse(data)))`;
	const additionalParams = [queryProps, hasSignal ? "options?: { signal?: AbortSignal | null }" : ""].filter(Boolean).join(", ");
	return `${override.query.shouldExportHttpClient ? "export " : ""}const ${operationName} = (
    http: HttpClient${additionalParams ? `,\n    ${additionalParams}` : ""}
  ): Promise<${dataType}> => {
    ${bodyForm}
    ${urlConstruction}
    const request$ = ${httpCall};
    if (options?.signal) {
      return lastValueFrom(request$.pipe(takeUntil(fromEvent(options.signal, 'abort'))));
    }
    return lastValueFrom(request$);
  }
`;
};
const generateAxiosRequestFunction = ({ headers, queryParams, operationName, response, mutator, body, props: _props, verb, formData, formUrlEncoded, override, paramsSerializer }, { route: _route, context }, isVue) => {
	let props = _props;
	let route = _route;
	if (isVue) props = vueWrapTypeWithMaybeRef(_props);
	if (context.output.urlEncodeParameters) route = makeRouteSafe(route);
	const isRequestOptions = override.requestOptions !== false;
	const isFormData = !override.formData.disabled;
	const isFormUrlEncoded = override.formUrlEncoded !== false;
	const hasSignal = getHasSignal({ overrideQuerySignal: override.query.signal });
	const hasSignalParam = _props.some((prop) => prop.name === "signal");
	const isExactOptionalPropertyTypes = !!context.output.tsconfig?.compilerOptions?.exactOptionalPropertyTypes;
	const bodyForm = generateFormDataAndUrlEncodedFunction({
		formData,
		formUrlEncoded,
		body,
		isFormData,
		isFormUrlEncoded
	});
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
			hasSignal,
			hasSignalParam,
			isExactOptionalPropertyTypes,
			isVue
		});
		const bodyDefinition = body.definition.replace("[]", String.raw`\[\]`);
		const propsImplementation = mutator.bodyTypeName && body.definition ? toObjectString(props, "implementation").replace(new RegExp(String.raw`(\w*):\s?${bodyDefinition}`), `$1: ${mutator.bodyTypeName}<${body.definition}>`) : toObjectString(props, "implementation");
		const requestOptions = isRequestOptions ? generateMutatorRequestOptions(override.requestOptions, mutator.hasSecondArg) : "";
		if (mutator.isHook) {
			const ret = `${override.query.shouldExportMutatorHooks ? "export " : ""}const use${pascal(operationName)}Hook = () => {
        const ${operationName} = ${mutator.name}<${response.definition.success || "unknown"}>();

        return useCallback((\n    ${propsImplementation}\n ${isRequestOptions && mutator.hasSecondArg ? `options${context.output.optionsParamRequired ? "" : "?"}: SecondParameter<ReturnType<typeof ${mutator.name}>>,` : ""}${getSignalDefinition({
				hasSignal,
				hasSignalParam
			})}) => {${bodyForm}
        return ${operationName}(
          ${mutatorConfig},
          ${requestOptions});
        }, [${operationName}])
      }
    `;
			const vueRet = `${override.query.shouldExportMutatorHooks ? "export " : ""}const use${pascal(operationName)}Hook = () => {
        const ${operationName} = ${mutator.name}<${response.definition.success || "unknown"}>();

        return (\n    ${propsImplementation}\n ${isRequestOptions && mutator.hasSecondArg ? `options${context.output.optionsParamRequired ? "" : "?"}: SecondParameter<ReturnType<typeof ${mutator.name}>>,` : ""}${getSignalDefinition({
				hasSignal,
				hasSignalParam
			})}) => {${bodyForm}
        return ${operationName}(
          ${mutatorConfig},
          ${requestOptions});
        }
      }
    `;
			return isVue ? vueRet : ret;
		}
		return `${override.query.shouldExportHttpClient ? "export " : ""}const ${operationName} = (\n    ${propsImplementation}\n ${isRequestOptions && mutator.hasSecondArg ? `options${context.output.optionsParamRequired ? "" : "?"}: SecondParameter<typeof ${mutator.name}>,` : ""}${getSignalDefinition({
			hasSignal,
			hasSignalParam
		})}) => {
      ${isVue ? vueUnRefParams(props) : ""}
      ${bodyForm}
      return ${mutator.name}<${response.definition.success || "unknown"}>(
      ${mutatorConfig},
      ${requestOptions});
    }
  `;
	}
	const isSyntheticDefaultImportsAllowed = isSyntheticDefaultImportsAllow(context.output.tsconfig);
	const options = generateOptions({
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
		isExactOptionalPropertyTypes,
		hasSignal,
		hasSignalParam,
		isVue
	});
	const optionsArgs = generateRequestOptionsArguments({
		isRequestOptions,
		hasSignal,
		hasSignalParam
	});
	const queryProps = toObjectString(props, "implementation");
	return `${override.query.shouldExportHttpClient ? "export " : ""}const ${operationName} = (\n    ${queryProps} ${optionsArgs} ): Promise<AxiosResponse<${response.definition.success || "unknown"}>> => {
    ${isVue ? vueUnRefParams(props) : ""}
    ${bodyForm}
    return axios${isSyntheticDefaultImportsAllowed ? "" : ".default"}.${verb}(${options});
  }
`;
};
const generateRequestOptionsArguments = ({ isRequestOptions, hasSignal, hasSignalParam = false }) => {
	if (isRequestOptions) return "options?: AxiosRequestConfig\n";
	return getSignalDefinition({
		hasSignal,
		hasSignalParam
	});
};
const getSignalDefinition = ({ hasSignal, hasSignalParam = false }) => {
	if (!hasSignal) return "";
	return `${hasSignalParam ? "querySignal" : "signal"}?: AbortSignal\n`;
};
const getQueryArgumentsRequestType = (httpClient, mutator, useRuntimeFetcher) => {
	if (!mutator) {
		if (httpClient === OutputHttpClient.AXIOS) return `axios?: AxiosRequestConfig`;
		if (httpClient === OutputHttpClient.FETCH && useRuntimeFetcher) return "fetch?: RequestInit, fetcher?: typeof globalThis.fetch";
		return "fetch?: RequestInit";
	}
	if (mutator.hasSecondArg && !mutator.isHook) return `request?: SecondParameter<typeof ${mutator.name}>`;
	if (mutator.hasSecondArg && mutator.isHook) return `request?: SecondParameter<ReturnType<typeof ${mutator.name}>>`;
	return "";
};
const getQueryOptions = ({ isRequestOptions, mutator, isExactOptionalPropertyTypes, hasSignal, httpClient, hasSignalParam = false, useRuntimeFetcher = false }) => {
	const signalVar = hasSignalParam ? "querySignal" : "signal";
	const signalProp = hasSignalParam ? `signal: ${signalVar}` : "signal";
	if (!mutator && isRequestOptions) {
		const options = httpClient === OutputHttpClient.AXIOS ? "axiosOptions" : "fetchOptions";
		const fetcherArg = httpClient === OutputHttpClient.FETCH && useRuntimeFetcher ? ", fetcherFn" : "";
		if (!hasSignal) return `${options}${fetcherArg}`;
		return `{ ${isExactOptionalPropertyTypes ? `...(${signalVar} ? { ${signalProp} } : {})` : signalProp}, ...${options} }${fetcherArg}`;
	}
	if (mutator?.hasSecondArg && httpClient === OutputHttpClient.ANGULAR) {
		if (!hasSignal) return "http";
		return `http, ${signalVar}`;
	}
	if (mutator?.hasSecondArg && isRequestOptions) {
		if (!hasSignal) return "requestOptions";
		return httpClient === OutputHttpClient.AXIOS || httpClient === OutputHttpClient.ANGULAR ? `requestOptions, ${signalVar}` : `{ ${signalProp}, ...requestOptions }`;
	}
	if (hasSignal) {
		if (httpClient === OutputHttpClient.AXIOS) return signalVar;
		if (httpClient === OutputHttpClient.ANGULAR && mutator) return signalVar;
		return `{ ${signalProp} }`;
	}
	return "";
};
const getHookOptions = ({ isRequestOptions, httpClient, mutator, useRuntimeFetcher = false }) => {
	if (!isRequestOptions) return "";
	let value = "const {query: queryOptions";
	if (!mutator) if (httpClient === OutputHttpClient.AXIOS) value += ", axios: axiosOptions";
	else if (httpClient === OutputHttpClient.FETCH && useRuntimeFetcher) value += ", fetch: fetchOptions, fetcher: fetcherFn";
	else value += ", fetch: fetchOptions";
	if (mutator?.hasSecondArg) value += ", request: requestOptions";
	value += "} = options ?? {};";
	return value;
};
const dedupeUnionTypes = (types) => {
	if (!types) return types;
	return [...new Set(types.split("|").map((t) => t.trim()).filter(Boolean))].join(" | ");
};
const getQueryErrorType = (operationName, response, httpClient, mutator) => {
	const errorsType = dedupeUnionTypes(response.definition.errors || "unknown");
	if (mutator) return mutator.hasErrorType ? `${mutator.default ? pascal(operationName) : ""}ErrorType<${errorsType}>` : errorsType;
	else return httpClient === OutputHttpClient.AXIOS ? `AxiosError<${errorsType}>` : errorsType;
};
const getHooksOptionImplementation = (isRequestOptions, httpClient, operationName, mutator, useRuntimeFetcher) => {
	const fetcherOption = httpClient === OutputHttpClient.FETCH && useRuntimeFetcher ? ", fetcher: fetcherFn" : "";
	const options = httpClient === OutputHttpClient.AXIOS ? ", axios: axiosOptions" : `, fetch: fetchOptions${fetcherOption}`;
	return isRequestOptions ? `const mutationKey = ['${operationName}'];
const {mutation: mutationOptions${mutator ? mutator.hasSecondArg ? ", request: requestOptions" : "" : options}} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }${mutator?.hasSecondArg ? ", request: undefined" : ""}${mutator ? "" : httpClient === OutputHttpClient.AXIOS ? ", axios: undefined" : ", fetch: undefined"}};` : "";
};
const getMutationRequestArgs = (isRequestOptions, httpClient, mutator, useRuntimeFetcher) => {
	const options = httpClient === OutputHttpClient.AXIOS ? "axiosOptions" : "fetchOptions";
	const fetcherArg = httpClient === OutputHttpClient.FETCH && useRuntimeFetcher ? ", fetcherFn" : "";
	if (mutator?.hasSecondArg && httpClient === OutputHttpClient.ANGULAR) return "http";
	return isRequestOptions ? mutator ? mutator.hasSecondArg ? "requestOptions" : "" : `${options}${fetcherArg}` : "";
};
const getQueryHeader = (params) => {
	if (params.output.httpClient === OutputHttpClient.FETCH) return generateFetchHeader(params);
	if (params.output.httpClient === OutputHttpClient.ANGULAR) return (params.tag ? Object.values(params.verbOptions).filter((verbOption) => kebab(verbOption.tags[0] ?? "default") === params.tag) : Object.values(params.verbOptions)).some((v) => v.queryParams) ? getAngularFilteredParamsHelperBody() : "";
	return "";
};
//#endregion
//#region src/dependencies.ts
const REACT_DEPENDENCIES = [{
	exports: [{
		name: "useCallback",
		values: true
	}],
	dependency: "react"
}];
const PARAMS_SERIALIZER_DEPENDENCIES = [{
	exports: [{
		name: "qs",
		default: true,
		values: true,
		syntheticDefaultImport: true
	}],
	dependency: "qs"
}];
const SVELTE_QUERY_DEPENDENCIES_V3 = [{
	exports: [
		{
			name: "useQuery",
			values: true
		},
		{
			name: "useInfiniteQuery",
			values: true
		},
		{
			name: "useMutation",
			values: true
		},
		{
			name: "useQueryClient",
			values: true
		},
		{ name: "UseQueryOptions" },
		{ name: "UseInfiniteQueryOptions" },
		{ name: "UseMutationOptions" },
		{ name: "QueryFunction" },
		{ name: "MutationFunction" },
		{ name: "UseQueryStoreResult" },
		{ name: "UseInfiniteQueryStoreResult" },
		{ name: "QueryKey" },
		{ name: "CreateMutationResult" },
		{ name: "InvalidateOptions" }
	],
	dependency: "@sveltestack/svelte-query"
}];
const SVELTE_QUERY_DEPENDENCIES = [{
	exports: [
		{
			name: "createQuery",
			values: true
		},
		{
			name: "createInfiniteQuery",
			values: true
		},
		{
			name: "createMutation",
			values: true
		},
		{
			name: "useQueryClient",
			values: true
		},
		{ name: "CreateQueryOptions" },
		{ name: "CreateInfiniteQueryOptions" },
		{ name: "MutationFunctionContext" },
		{ name: "CreateMutationOptions" },
		{ name: "QueryFunction" },
		{ name: "MutationFunction" },
		{ name: "CreateQueryResult" },
		{ name: "CreateInfiniteQueryResult" },
		{ name: "QueryKey" },
		{ name: "InfiniteData" },
		{ name: "CreateMutationResult" },
		{ name: "DataTag" },
		{ name: "QueryClient" },
		{ name: "InvalidateOptions" }
	],
	dependency: "@tanstack/svelte-query"
}];
const isSvelteQueryV3 = (packageJson) => {
	const hasSvelteQuery = packageJson?.dependencies?.["@sveltestack/svelte-query"] ?? packageJson?.devDependencies?.["@sveltestack/svelte-query"] ?? packageJson?.peerDependencies?.["@sveltestack/svelte-query"];
	const hasSvelteQueryV4 = packageJson?.dependencies?.["@tanstack/svelte-query"] ?? packageJson?.devDependencies?.["@tanstack/svelte-query"] ?? packageJson?.peerDependencies?.["@tanstack/svelte-query"];
	return !!hasSvelteQuery && !hasSvelteQueryV4;
};
const isSvelteQueryV6 = (packageJson) => {
	return isQueryV6(packageJson, "svelte-query");
};
const getSvelteQueryDependencies = (hasGlobalMutator, hasParamsSerializerOptions, packageJson, httpClient) => {
	const hasSvelteQueryV3 = isSvelteQueryV3(packageJson);
	return [
		...!hasGlobalMutator && httpClient === OutputHttpClient.AXIOS ? AXIOS_DEPENDENCIES : [],
		...hasParamsSerializerOptions ? PARAMS_SERIALIZER_DEPENDENCIES : [],
		...hasSvelteQueryV3 ? SVELTE_QUERY_DEPENDENCIES_V3 : SVELTE_QUERY_DEPENDENCIES
	];
};
const REACT_QUERY_DEPENDENCIES_V3 = [{
	exports: [
		{
			name: "useQuery",
			values: true
		},
		{
			name: "useInfiniteQuery",
			values: true
		},
		{
			name: "useMutation",
			values: true
		},
		{
			name: "useQueryClient",
			values: true
		},
		{ name: "UseQueryOptions" },
		{ name: "UseInfiniteQueryOptions" },
		{ name: "UseMutationOptions" },
		{ name: "QueryFunction" },
		{ name: "MutationFunction" },
		{ name: "UseQueryResult" },
		{ name: "UseInfiniteQueryResult" },
		{ name: "QueryKey" },
		{ name: "QueryClient" },
		{ name: "UseMutationResult" },
		{ name: "InvalidateOptions" }
	],
	dependency: "react-query"
}];
const REACT_QUERY_DEPENDENCIES = [{
	exports: [
		{
			name: "useQuery",
			values: true
		},
		{
			name: "useSuspenseQuery",
			values: true
		},
		{
			name: "useInfiniteQuery",
			values: true
		},
		{
			name: "useSuspenseInfiniteQuery",
			values: true
		},
		{
			name: "useMutation",
			values: true
		},
		{
			name: "useQueryClient",
			values: true
		},
		{ name: "UseQueryOptions" },
		{ name: "DefinedInitialDataOptions" },
		{ name: "UndefinedInitialDataOptions" },
		{ name: "UseSuspenseQueryOptions" },
		{ name: "UseInfiniteQueryOptions" },
		{ name: "UseSuspenseInfiniteQueryOptions" },
		{ name: "UseMutationOptions" },
		{ name: "QueryFunction" },
		{ name: "MutationFunction" },
		{ name: "MutationFunctionContext" },
		{ name: "UseQueryResult" },
		{ name: "DefinedUseQueryResult" },
		{ name: "UseSuspenseQueryResult" },
		{ name: "UseInfiniteQueryResult" },
		{ name: "DefinedUseInfiniteQueryResult" },
		{ name: "UseSuspenseInfiniteQueryResult" },
		{ name: "QueryKey" },
		{ name: "QueryClient" },
		{ name: "InfiniteData" },
		{ name: "UseMutationResult" },
		{ name: "DataTag" },
		{ name: "InvalidateOptions" }
	],
	dependency: "@tanstack/react-query"
}];
const getReactQueryDependencies = (hasGlobalMutator, hasParamsSerializerOptions, packageJson, httpClient, hasTagsMutator, override) => {
	const hasReactQuery = packageJson?.dependencies?.["react-query"] ?? packageJson?.devDependencies?.["react-query"] ?? packageJson?.peerDependencies?.["react-query"];
	const hasReactQueryV4 = packageJson?.dependencies?.["@tanstack/react-query"] ?? packageJson?.devDependencies?.["@tanstack/react-query"] ?? packageJson?.peerDependencies?.["@tanstack/react-query"];
	const queryVersion = override?.query.version;
	const useReactQueryV3 = queryVersion === void 0 ? hasReactQuery && !hasReactQueryV4 : queryVersion <= 3;
	return [
		...hasGlobalMutator || hasTagsMutator ? REACT_DEPENDENCIES : [],
		...!hasGlobalMutator && httpClient === OutputHttpClient.AXIOS ? AXIOS_DEPENDENCIES : [],
		...hasParamsSerializerOptions ? PARAMS_SERIALIZER_DEPENDENCIES : [],
		...useReactQueryV3 ? REACT_QUERY_DEPENDENCIES_V3 : REACT_QUERY_DEPENDENCIES
	];
};
const VUE_QUERY_DEPENDENCIES_V3 = [
	{
		exports: [
			{
				name: "useQuery",
				values: true
			},
			{
				name: "useInfiniteQuery",
				values: true
			},
			{
				name: "useMutation",
				values: true
			}
		],
		dependency: "vue-query"
	},
	{
		exports: [
			{ name: "UseQueryOptions" },
			{ name: "UseInfiniteQueryOptions" },
			{ name: "UseMutationOptions" },
			{ name: "QueryFunction" },
			{ name: "MutationFunction" },
			{ name: "UseQueryResult" },
			{ name: "UseInfiniteQueryResult" },
			{ name: "QueryKey" },
			{ name: "UseMutationReturnType" },
			{ name: "InvalidateOptions" }
		],
		dependency: "vue-query/types"
	},
	{
		exports: [{
			name: "unref",
			values: true
		}, {
			name: "computed",
			values: true
		}],
		dependency: "vue"
	},
	{
		exports: [{ name: "UseQueryReturnType" }],
		dependency: "vue-query/lib/vue/useBaseQuery"
	}
];
const VUE_QUERY_DEPENDENCIES = [{
	exports: [
		{
			name: "useQuery",
			values: true
		},
		{
			name: "useInfiniteQuery",
			values: true
		},
		{
			name: "useMutation",
			values: true
		},
		{ name: "UseQueryOptions" },
		{ name: "UseInfiniteQueryOptions" },
		{ name: "UseMutationOptions" },
		{ name: "QueryFunction" },
		{ name: "MutationFunction" },
		{ name: "QueryKey" },
		{ name: "UseQueryReturnType" },
		{ name: "UseInfiniteQueryReturnType" },
		{ name: "InfiniteData" },
		{ name: "UseMutationReturnType" },
		{ name: "DataTag" },
		{ name: "QueryClient" },
		{ name: "InvalidateOptions" }
	],
	dependency: "@tanstack/vue-query"
}, {
	exports: [
		{
			name: "unref",
			values: true
		},
		{ name: "MaybeRef" },
		{
			name: "computed",
			values: true
		}
	],
	dependency: "vue"
}];
const getSolidQueryImports = (prefix) => {
	const capitalized = prefix === "use" ? "Use" : "Create";
	return [{
		exports: [
			{
				name: `${prefix}Query`,
				values: true
			},
			{
				name: `${prefix}InfiniteQuery`,
				values: true
			},
			{
				name: `${prefix}Mutation`,
				values: true
			},
			{ name: `${capitalized}QueryOptions` },
			{ name: `${capitalized}InfiniteQueryOptions` },
			{ name: `${capitalized}MutationOptions` },
			{ name: "SolidQueryOptions" },
			{ name: "SolidInfiniteQueryOptions" },
			{ name: "SolidMutationOptions" },
			{ name: "QueryFunction" },
			{ name: "MutationFunction" },
			{ name: `${capitalized}QueryResult` },
			{ name: `${capitalized}InfiniteQueryResult` },
			{ name: "QueryKey" },
			{ name: "InfiniteData" },
			{ name: `${capitalized}MutationResult` },
			{ name: "DataTag" },
			{ name: "QueryClient" },
			{ name: "InvalidateOptions" }
		],
		dependency: "@tanstack/solid-query"
	}];
};
const ANGULAR_QUERY_DEPENDENCIES = [{
	exports: [
		{
			name: "injectQuery",
			values: true
		},
		{
			name: "injectInfiniteQuery",
			values: true
		},
		{
			name: "injectMutation",
			values: true
		},
		{ name: "InjectQueryOptions" },
		{ name: "InjectMutationOptions" },
		{ name: "CreateQueryOptions" },
		{ name: "CreateInfiniteQueryOptions" },
		{ name: "CreateMutationOptions" },
		{ name: "MutationFunctionContext" },
		{ name: "QueryFunction" },
		{ name: "MutationFunction" },
		{ name: "QueryKey" },
		{ name: "CreateQueryResult" },
		{ name: "CreateInfiniteQueryResult" },
		{ name: "InfiniteData" },
		{ name: "CreateMutationResult" },
		{ name: "DataTag" },
		{
			name: "QueryClient",
			values: true
		},
		{ name: "InvalidateOptions" }
	],
	dependency: "@tanstack/angular-query-experimental"
}, {
	exports: [
		{
			name: "inject",
			values: true
		},
		{ name: "Signal" },
		{
			name: "computed",
			values: true
		}
	],
	dependency: "@angular/core"
}];
const isVueQueryV3 = (packageJson) => {
	const hasVueQuery = packageJson?.dependencies?.["vue-query"] ?? packageJson?.devDependencies?.["vue-query"] ?? packageJson?.peerDependencies?.["vue-query"];
	const hasVueQueryV4 = packageJson?.dependencies?.["@tanstack/vue-query"] ?? packageJson?.devDependencies?.["@tanstack/vue-query"] ?? packageJson?.peerDependencies?.["@tanstack/vue-query"];
	return !!hasVueQuery && !hasVueQueryV4;
};
const getVueQueryDependencies = (hasGlobalMutator, hasParamsSerializerOptions, packageJson, httpClient) => {
	const hasVueQueryV3 = isVueQueryV3(packageJson);
	return [
		...!hasGlobalMutator && httpClient === OutputHttpClient.AXIOS ? AXIOS_DEPENDENCIES : [],
		...hasParamsSerializerOptions ? PARAMS_SERIALIZER_DEPENDENCIES : [],
		...hasVueQueryV3 ? VUE_QUERY_DEPENDENCIES_V3 : VUE_QUERY_DEPENDENCIES
	];
};
const getSolidQueryDependencies = (hasGlobalMutator, hasParamsSerializerOptions, packageJson, httpClient) => {
	return [
		...!hasGlobalMutator && httpClient === OutputHttpClient.AXIOS ? AXIOS_DEPENDENCIES : [],
		...hasParamsSerializerOptions ? PARAMS_SERIALIZER_DEPENDENCIES : [],
		...getSolidQueryImports(isSolidQueryWithUsePrefix(packageJson) ? "use" : "create")
	];
};
const getAngularQueryDependencies = (hasGlobalMutator, hasParamsSerializerOptions, packageJson, httpClient) => {
	const useAngularHttp = httpClient === OutputHttpClient.ANGULAR;
	const useAxios = !hasGlobalMutator && httpClient === OutputHttpClient.AXIOS;
	return [
		...useAngularHttp ? ANGULAR_HTTP_DEPENDENCIES : [],
		...useAxios ? AXIOS_DEPENDENCIES : [],
		...hasParamsSerializerOptions ? PARAMS_SERIALIZER_DEPENDENCIES : [],
		...ANGULAR_QUERY_DEPENDENCIES
	];
};
const isQueryV5 = (packageJson, queryClient) => {
	if (queryClient === "angular-query") return true;
	const version = getPackageByQueryClient(packageJson, queryClient);
	if (!version) return false;
	const withoutRc = version.split("-")[0];
	return compareVersions(withoutRc, "5.0.0");
};
const isQueryV6 = (packageJson, queryClient) => {
	const version = getPackageByQueryClient(packageJson, queryClient);
	if (!version) return false;
	const withoutRc = version.split("-")[0];
	return compareVersions(withoutRc, "6.0.0");
};
const isQueryV5WithDataTagError = (packageJson, queryClient) => {
	if (queryClient === "angular-query") return true;
	const version = getPackageByQueryClient(packageJson, queryClient);
	if (!version) return false;
	const withoutRc = version.split("-")[0];
	return compareVersions(withoutRc, "5.62.0");
};
const isQueryV5WithRequiredContextOnSuccess = (packageJson, queryClient) => {
	const version = getPackageByQueryClient(packageJson, queryClient);
	if (!version) return false;
	const withoutRc = version.split("-")[0];
	return compareVersions(withoutRc, "5.14.1");
};
const isQueryV5WithMutationContextOnSuccess = (packageJson, queryClient) => {
	const version = getPackageByQueryClient(packageJson, queryClient);
	if (!version) return false;
	const withoutRc = version.split("-")[0];
	return compareVersions(withoutRc, "5.89.0");
};
const isQueryV5WithInfiniteQueryOptionsError = (packageJson, queryClient) => {
	if (queryClient === "angular-query") return true;
	const version = getPackageByQueryClient(packageJson, queryClient);
	if (!version) return false;
	const withoutRc = version.split("-")[0];
	return compareVersions(withoutRc, "5.80.0");
};
const isSolidQueryWithUsePrefix = (packageJson) => {
	const version = getPackageByQueryClient(packageJson, "solid-query");
	if (!version) return false;
	const withoutRc = version.split("-")[0];
	return compareVersions(withoutRc, "5.71.5");
};
const getPackageByQueryClient = (packageJson, queryClient) => {
	switch (queryClient) {
		case "react-query": {
			const pkgName = "@tanstack/react-query";
			return packageJson?.resolvedVersions?.[pkgName] ?? packageJson?.dependencies?.[pkgName] ?? packageJson?.devDependencies?.[pkgName] ?? packageJson?.peerDependencies?.[pkgName];
		}
		case "svelte-query": {
			const pkgName = "@tanstack/svelte-query";
			return packageJson?.resolvedVersions?.[pkgName] ?? packageJson?.dependencies?.[pkgName] ?? packageJson?.devDependencies?.[pkgName] ?? packageJson?.peerDependencies?.[pkgName];
		}
		case "vue-query": {
			const pkgName = "@tanstack/vue-query";
			return packageJson?.resolvedVersions?.[pkgName] ?? packageJson?.dependencies?.[pkgName] ?? packageJson?.devDependencies?.[pkgName] ?? packageJson?.peerDependencies?.[pkgName];
		}
		case "angular-query": {
			const pkgName = "@tanstack/angular-query-experimental";
			return packageJson?.resolvedVersions?.[pkgName] ?? packageJson?.dependencies?.[pkgName] ?? packageJson?.devDependencies?.[pkgName] ?? packageJson?.peerDependencies?.[pkgName];
		}
		case "solid-query": {
			const pkgName = "@tanstack/solid-query";
			return packageJson?.resolvedVersions?.[pkgName] ?? packageJson?.dependencies?.[pkgName] ?? packageJson?.devDependencies?.[pkgName] ?? packageJson?.peerDependencies?.[pkgName];
		}
	}
};
//#endregion
//#region src/query-options.ts
const QueryType = {
	INFINITE: "infiniteQuery",
	QUERY: "query",
	SUSPENSE_QUERY: "suspenseQuery",
	SUSPENSE_INFINITE: "suspenseInfiniteQuery"
};
const INFINITE_QUERY_PROPERTIES = new Set(["getNextPageParam", "getPreviousPageParam"]);
const generateQueryOptions = ({ params, options, type, adapter }) => {
	if (options === false) return "";
	const queryConfig = isObject(options) ? ` ${stringify(omitBy(options, (_, key) => type !== QueryType.INFINITE && type !== QueryType.SUSPENSE_INFINITE && INFINITE_QUERY_PROPERTIES.has(key)))?.slice(1, -1)}` : "";
	if (params.length === 0 || isSuspenseQuery(type)) {
		if (options) return `${queryConfig} ...queryOptions`;
		return "...queryOptions";
	}
	return `${adapter ? adapter.generateEnabledOption(params, options) : !isObject(options) || !Object.hasOwn(options, "enabled") ? `enabled: !!(${params.map(({ name }) => name).join(" && ")}),` : ""}${queryConfig} ...queryOptions`;
};
const isSuspenseQuery = (type) => {
	return [QueryType.SUSPENSE_INFINITE, QueryType.SUSPENSE_QUERY].includes(type);
};
const getQueryOptionsDefinition = ({ operationName, mutator, definitions, type, prefix, hasQueryV5, hasQueryV5WithInfiniteQueryOptionsError, queryParams, queryParam, isReturnType, initialData, adapter }) => {
	const isMutatorHook = mutator?.isHook;
	const partialOptions = !isReturnType && hasQueryV5;
	if (type) {
		const funcReturnType = `Awaited<ReturnType<${isMutatorHook ? `ReturnType<typeof use${pascal(operationName)}Hook>` : `typeof ${operationName}`}>>`;
		const optionTypeInitialDataPostfix = initialData && !isSuspenseQuery(type) ? ` & Pick<
        ${pascal(initialData)}InitialDataOptions<
          ${funcReturnType},
          TError,
          ${funcReturnType}${hasQueryV5 && (type === QueryType.INFINITE || type === QueryType.SUSPENSE_INFINITE) && queryParam && queryParams ? `, QueryKey` : ""}
        > , 'initialData'
      >` : "";
		const optionsTypeName = isReturnType && adapter?.getOptionsReturnTypeName ? adapter.getOptionsReturnTypeName(type === QueryType.INFINITE || type === QueryType.SUSPENSE_INFINITE ? "infiniteQuery" : "query") : void 0;
		const optionType = optionsTypeName ? `${optionsTypeName}<${funcReturnType}, TError, TData${hasQueryV5 && (type === QueryType.INFINITE || type === QueryType.SUSPENSE_INFINITE) && queryParam && queryParams ? `, QueryKey, ${queryParams.schema.name}['${queryParam}']` : ""}>` : `${prefix}${pascal(type)}Options<${funcReturnType}, TError, TData${hasQueryV5 && (type === QueryType.INFINITE || type === QueryType.SUSPENSE_INFINITE) && queryParam && queryParams ? hasQueryV5WithInfiniteQueryOptionsError ? `, QueryKey, ${queryParams.schema.name}['${queryParam}']` : `, ${funcReturnType}, QueryKey, ${queryParams.schema.name}['${queryParam}']` : ""}>`;
		return `${partialOptions ? "Partial<" : ""}${optionType}${partialOptions ? ">" : ""}${optionTypeInitialDataPostfix}`;
	}
	const mutationOptionsTypeName = isReturnType && adapter?.getOptionsReturnTypeName ? adapter.getOptionsReturnTypeName("mutation") : void 0;
	return mutationOptionsTypeName ? `${mutationOptionsTypeName}<Awaited<ReturnType<${isMutatorHook ? `ReturnType<typeof use${pascal(operationName)}Hook>` : `typeof ${operationName}`}>>, TError,${definitions ? `{${definitions}}` : "void"}, TContext>` : `${prefix}MutationOptions<Awaited<ReturnType<${isMutatorHook ? `ReturnType<typeof use${pascal(operationName)}Hook>` : `typeof ${operationName}`}>>, TError,${definitions ? `{${definitions}}` : "void"}, TContext>`;
};
//#endregion
//#region src/frameworks/angular.ts
const createAngularAdapter = ({ hasQueryV5, hasQueryV5WithDataTagError, hasQueryV5WithInfiniteQueryOptionsError, hasQueryV5WithMutationContextOnSuccess, hasQueryV5WithRequiredContextOnSuccess }) => {
	const prefix = "Create";
	return {
		outputClient: OutputClient.ANGULAR_QUERY,
		hookPrefix: "inject",
		isAngularHttp: true,
		hasQueryV5,
		hasQueryV5WithDataTagError,
		hasQueryV5WithInfiniteQueryOptionsError,
		hasQueryV5WithMutationContextOnSuccess,
		hasQueryV5WithRequiredContextOnSuccess,
		getHookPropsDefinitions(props) {
			return toObjectString(props.map((prop) => {
				const getterType = prop.definition.replace(/^(\w+)(\??): (.+)$/, (_match, name, optional, type) => `${name}${optional}: ${type} | (() => ${type.replace(" | undefined", "")}${optional ? " | undefined" : ""})`);
				return {
					...prop,
					definition: getterType
				};
			}), "definition");
		},
		getHttpFunctionQueryProps(queryProperties, _httpClient, hasMutator) {
			if (!hasMutator) return queryProperties ? `http, ${queryProperties}` : "http";
			return queryProperties;
		},
		getInfiniteQueryHttpProps(props, queryParam, hasMutator) {
			let result = props.map((param) => {
				if (param.type === GetterPropType.NAMED_PATH_PARAMS) return param.destructured;
				return param.name === "params" ? `{...params, '${queryParam}': pageParam || params?.['${queryParam}']}` : param.name;
			}).join(",");
			if (!hasMutator) result = result ? `http, ${result}` : "http";
			return result;
		},
		getHttpFirstParam(mutator) {
			if (!mutator || mutator.hasSecondArg) return "http: HttpClient, ";
			return "";
		},
		getMutationHttpPrefix(mutator) {
			if (!mutator) return "http, ";
			return "";
		},
		getQueryReturnType({ type }) {
			if (type !== QueryType.INFINITE && type !== QueryType.SUSPENSE_INFINITE) return `CreateQueryResult<TData, TError>`;
			return `CreateInfiniteQueryResult<TData, TError>`;
		},
		getMutationReturnType({ dataType, variableType }) {
			return `: CreateMutationResult<
        Awaited<ReturnType<${dataType}>>,
        TError,
        ${variableType},
        TContext
      >`;
		},
		getQueryReturnStatement({ queryResultVarName }) {
			return `return ${queryResultVarName};`;
		},
		shouldAnnotateQueryKey() {
			return false;
		},
		generateQueryInit({ mutator }) {
			if (!mutator || mutator.hasSecondArg) return `const http = inject(HttpClient);`;
			return "";
		},
		generateQueryInvocationArgs({ props, queryOptionsFnName, isRequestOptions, mutator }) {
			return `() => {${props.length > 0 ? `
    // Resolve params if getter function (for signal reactivity)
    ${props.map((p) => `const _${p.name} = typeof ${p.name} === 'function' ? ${p.name}() : ${p.name};`).join("\n    ")}` : ""}
    // Resolve options if getter function (for signal reactivity)
    const _options = typeof ${isRequestOptions ? "options" : "queryOptions"} === 'function' ? ${isRequestOptions ? "options" : "queryOptions"}() : ${isRequestOptions ? "options" : "queryOptions"};
    return ${queryOptionsFnName}(${!mutator || mutator.hasSecondArg ? "http" : ""}${props.length > 0 ? `${!mutator || mutator.hasSecondArg ? ", " : ""}${props.map((p) => `_${p.name}`).join(", ")}` : ""}, _options);
  }`;
		},
		getOptionalQueryClientArgument() {
			return "";
		},
		getQueryOptionsDefinitionPrefix() {
			return prefix;
		},
		generateQueryArguments({ operationName, definitions, mutator, isRequestOptions, type, queryParams, queryParam, initialData, httpClient, forQueryOptions = false, hasInvalidation, useRuntimeFetcher }) {
			const definition = getQueryOptionsDefinition({
				operationName,
				mutator,
				definitions,
				type,
				prefix,
				hasQueryV5,
				hasQueryV5WithInfiniteQueryOptionsError,
				queryParams,
				queryParam,
				isReturnType: false,
				initialData
			});
			if (!isRequestOptions) return `${type ? "queryOptions" : "mutationOptions"}${initialData === "defined" ? "" : "?"}: ${definition}`;
			const requestType = getQueryArgumentsRequestType(httpClient, mutator, useRuntimeFetcher);
			const isQueryRequired = initialData === "defined";
			const optionsType = `{ ${type ? "query" : "mutation"}${isQueryRequired ? "" : "?"}:${definition}, ${!type && hasInvalidation ? "skipInvalidation?: boolean, " : ""}${requestType}}`;
			if (type !== void 0 && !forQueryOptions) return `options${isQueryRequired ? "" : "?"}: ${optionsType} | (() => ${optionsType})\n`;
			return `options${isQueryRequired ? "" : "?"}: ${optionsType}\n`;
		},
		generateMutationImplementation({ mutationOptionsFnName, hasInvalidation, isRequestOptions }) {
			return `${mutationOptionsFnName}(${hasInvalidation ? `queryClient, ` : ""}${isRequestOptions ? "options" : "mutationOptions"})`;
		},
		supportsMutationInvalidation() {
			return true;
		},
		generateMutationHookBody({ operationPrefix, mutationOptionsFnName, mutationOptionsVarName, isRequestOptions, mutator, hasInvalidation }) {
			if (!mutator || mutator.hasSecondArg) return `      const http = inject(HttpClient);${hasInvalidation ? "\n      const queryClient = inject(QueryClient);" : ""}
      const ${mutationOptionsVarName} = ${mutationOptionsFnName}(http${hasInvalidation ? ", queryClient" : ""}${isRequestOptions ? ", options" : ", mutationOptions"});

      return ${operationPrefix}Mutation(() => ${mutationOptionsVarName});`;
			return `      const ${mutationOptionsVarName} = ${`${mutationOptionsFnName}(${hasInvalidation ? `queryClient, ` : ""}${isRequestOptions ? "options" : "mutationOptions"})`};

      return ${operationPrefix}Mutation(() => ${mutationOptionsVarName});`;
		},
		getQueryType(type) {
			return getQueryTypeForFramework(type);
		},
		generateRequestFunction(verbOptions, options) {
			return generateAngularHttpRequestFunction(verbOptions, options);
		},
		generatePrefetch({ usePrefetch, type, useQuery, useInfinite, operationName, mutator, doc, queryProps, dataType, errorType, queryArguments, queryOptionsVarName, queryOptionsFnName, queryProperties, isRequestOptions }) {
			if (!(usePrefetch && (type === QueryType.QUERY || type === QueryType.INFINITE || type === QueryType.SUSPENSE_QUERY && !useQuery || type === QueryType.SUSPENSE_INFINITE && !useInfinite))) return "";
			const prefetchType = type === QueryType.QUERY || type === QueryType.SUSPENSE_QUERY ? "query" : "infinite-query";
			const prefetchFnName = camel(`prefetch-${prefetchType}`);
			return `${doc}export const ${camel(`prefetch-${operationName}-${prefetchType}`)} = async <TData = Awaited<ReturnType<${dataType}>>, TError = ${errorType}>(\n queryClient: QueryClient, ${!mutator || mutator.hasSecondArg ? "http: HttpClient, " : ""}${queryProps} ${queryArguments}\n  ): Promise<QueryClient> => {

  const ${queryOptionsVarName} = ${queryOptionsFnName}(${!mutator || mutator.hasSecondArg ? "http, " : ""}${queryProperties}${queryProperties ? "," : ""}${isRequestOptions ? "options" : "queryOptions"})

  if (${queryOptionsVarName}.enabled === false) {
    return queryClient;
  }

  await queryClient.${prefetchFnName}(${queryOptionsVarName});

  return queryClient;
}\n`;
		}
	};
};
//#endregion
//#region src/frameworks/react.ts
const createReactAdapter = ({ hasQueryV5, hasQueryV5WithDataTagError, hasQueryV5WithInfiniteQueryOptionsError, hasQueryV5WithMutationContextOnSuccess, hasQueryV5WithRequiredContextOnSuccess }) => ({
	outputClient: OutputClient.REACT_QUERY,
	hookPrefix: "use",
	hasQueryV5,
	hasQueryV5WithDataTagError,
	hasQueryV5WithInfiniteQueryOptionsError,
	hasQueryV5WithMutationContextOnSuccess,
	hasQueryV5WithRequiredContextOnSuccess,
	getQueryReturnType({ type, isInitialDataDefined }) {
		return ` ${isInitialDataDefined && !isSuspenseQuery(type) ? "Defined" : ""}Use${pascal(type)}Result<TData, TError> & { queryKey: ${hasQueryV5 ? `DataTag<QueryKey, TData${hasQueryV5WithDataTagError ? ", TError" : ""}>` : "QueryKey"} }`;
	},
	getMutationReturnType({ dataType, variableType }) {
		return `: UseMutationResult<
        Awaited<ReturnType<${dataType}>>,
        TError,
        ${variableType},
        TContext
      >`;
	},
	getQueryReturnStatement({ queryResultVarName, queryOptionsVarName }) {
		return `return { ...${queryResultVarName}, queryKey: ${queryOptionsVarName}.queryKey };`;
	},
	shouldGenerateOverrideTypes() {
		return hasQueryV5;
	},
	generateMutationImplementation({ mutationOptionsFnName, hasInvalidation, isRequestOptions }) {
		return `${mutationOptionsFnName}(${hasInvalidation ? `queryClient ?? backupQueryClient, ` : ""}${isRequestOptions ? "options" : "mutationOptions"})`;
	},
	supportsMutationInvalidation() {
		return true;
	},
	generateMutationHookBody({ operationPrefix, mutationImplementation, hasInvalidation, optionalQueryClientArgument }) {
		return `      ${hasInvalidation ? `const backupQueryClient = useQueryClient();\n      ` : ""}return ${operationPrefix}Mutation(${mutationImplementation}${optionalQueryClientArgument ? `, queryClient` : ""});`;
	},
	generateRequestFunction(verbOptions, options) {
		return options.context.output.httpClient === OutputHttpClient.AXIOS ? generateAxiosRequestFunction(verbOptions, options, false) : generateRequestFunction(verbOptions, options);
	}
});
//#endregion
//#region src/frameworks/solid.ts
const createSolidAdapter = ({ hasQueryV5, hasQueryV5WithDataTagError, hasQueryV5WithInfiniteQueryOptionsError, hasQueryV5WithMutationContextOnSuccess, hasQueryV5WithRequiredContextOnSuccess, hasSolidQueryUsePrefix }) => ({
	outputClient: OutputClient.SOLID_QUERY,
	hookPrefix: hasSolidQueryUsePrefix ? "use" : "create",
	hasQueryV5,
	hasQueryV5WithDataTagError,
	hasQueryV5WithInfiniteQueryOptionsError,
	hasQueryV5WithMutationContextOnSuccess,
	hasQueryV5WithRequiredContextOnSuccess,
	getQueryOptionsDefinitionPrefix() {
		return hasSolidQueryUsePrefix ? "Use" : "Create";
	},
	getOptionsReturnTypeName(type) {
		if (type === "mutation") return "SolidMutationOptions";
		if (type === "infiniteQuery") return "SolidInfiniteQueryOptions";
		return "SolidQueryOptions";
	},
	getQueryKeyPrefix() {
		return "";
	},
	shouldAnnotateQueryKey() {
		return false;
	},
	shouldCastQueryResult() {
		return false;
	},
	shouldCastQueryOptions() {
		return false;
	},
	getQueryReturnType({ type }) {
		const prefix = hasSolidQueryUsePrefix ? "Use" : "Create";
		const queryKeyType = hasQueryV5 ? `DataTag<QueryKey, TData${hasQueryV5WithDataTagError ? ", TError" : ""}>` : "QueryKey";
		if (type !== QueryType.INFINITE && type !== QueryType.SUSPENSE_INFINITE) return `${prefix}QueryResult<TData, TError> & { queryKey: ${queryKeyType} }`;
		return `${prefix}InfiniteQueryResult<TData, TError> & { queryKey: ${queryKeyType} }`;
	},
	getMutationReturnType({ dataType, variableType }) {
		return `: ${hasSolidQueryUsePrefix ? "Use" : "Create"}MutationResult<
        Awaited<ReturnType<${dataType}>>,
        TError,
        ${variableType},
        TContext
      >`;
	},
	getQueryReturnStatement({ queryResultVarName, queryOptionsVarName }) {
		return `return Object.assign(${queryResultVarName}, { queryKey: ${queryOptionsVarName}.queryKey }) as any;`;
	},
	generateQueryInvocationArgs({ queryOptionsFnName, queryProperties, isRequestOptions, optionalQueryClientArgument }) {
		const optionsArg = isRequestOptions ? "options" : "queryOptions";
		return `() => ${queryOptionsFnName}(${queryProperties ? `${queryProperties},${optionsArg}` : optionsArg})${optionalQueryClientArgument ? ", queryClient" : ""}`;
	},
	generateMutationImplementation({ mutationOptionsFnName, isRequestOptions }) {
		return `${mutationOptionsFnName}(${isRequestOptions ? "options" : "mutationOptions"})`;
	},
	supportsMutationInvalidation() {
		return false;
	},
	generateMutationOnSuccess() {
		return "";
	},
	generateMutationHookBody({ operationPrefix, mutationImplementation, optionalQueryClientArgument }) {
		return `      return ${operationPrefix}Mutation(() => ${mutationImplementation}${optionalQueryClientArgument ? `, queryClient` : ""});`;
	},
	getOptionalQueryClientArgument() {
		return ", queryClient?: () => QueryClient";
	},
	generateRequestFunction(verbOptions, options) {
		return options.context.output.httpClient === OutputHttpClient.AXIOS ? generateAxiosRequestFunction(verbOptions, options, false) : generateRequestFunction(verbOptions, options);
	}
});
//#endregion
//#region src/frameworks/svelte.ts
const createSvelteAdapter = ({ hasSvelteQueryV4, hasSvelteQueryV6, hasQueryV5, hasQueryV5WithDataTagError, hasQueryV5WithInfiniteQueryOptionsError, hasQueryV5WithMutationContextOnSuccess, hasQueryV5WithRequiredContextOnSuccess }) => {
	const prefix = hasSvelteQueryV4 ? "Create" : "Use";
	return {
		outputClient: OutputClient.SVELTE_QUERY,
		hookPrefix: hasSvelteQueryV4 ? "create" : "use",
		hasQueryV5,
		hasQueryV5WithDataTagError,
		hasQueryV5WithInfiniteQueryOptionsError,
		hasQueryV5WithMutationContextOnSuccess,
		hasQueryV5WithRequiredContextOnSuccess,
		getHookPropsDefinitions(props) {
			if (hasSvelteQueryV6) return toObjectString(props.map((p) => ({
				...p,
				definition: p.definition.replace(":", ": () => ")
			})), "definition");
			return toObjectString(props, "implementation");
		},
		getQueryReturnType({ type, isMutatorHook, operationName }) {
			if (!hasSvelteQueryV4) return `Use${pascal(type)}StoreResult<Awaited<ReturnType<${isMutatorHook ? `ReturnType<typeof use${pascal(operationName)}Hook>` : `typeof ${operationName}`}>>, TError, TData, QueryKey> & { queryKey: QueryKey }`;
			return `Create${pascal(type)}Result<TData, TError> & { queryKey: ${hasQueryV5 ? `DataTag<QueryKey, TData${hasQueryV5WithDataTagError ? ", TError" : ""}>` : "QueryKey"} }`;
		},
		getMutationReturnType({ dataType, variableType }) {
			return `: CreateMutationResult<
        Awaited<ReturnType<${dataType}>>,
        TError,
        ${variableType},
        TContext
      >`;
		},
		getQueryReturnStatement({ queryResultVarName, queryOptionsVarName }) {
			if (hasSvelteQueryV6) return `return ${queryResultVarName}`;
			if (hasSvelteQueryV4) return `${queryResultVarName}.queryKey = ${queryOptionsVarName}.queryKey;

  return ${queryResultVarName};`;
			return `return { ...${queryResultVarName}, queryKey: ${queryOptionsVarName}.queryKey };`;
		},
		generateQueryInit({ queryOptionsFnName, queryProperties, isRequestOptions }) {
			if (hasSvelteQueryV6) return "";
			return `const ${isRequestOptions ? "queryOptions" : "options"} = ${queryOptionsFnName}(${queryProperties}${queryProperties ? "," : ""}${isRequestOptions ? "options" : "queryOptions"})`;
		},
		generateQueryInvocationArgs({ props, queryOptionsFnName, isRequestOptions, queryOptionsVarName, optionalQueryClientArgument }) {
			if (hasSvelteQueryV6) return `() => ${queryOptionsFnName}(${toObjectString(props.map((p) => ({
				...p,
				name: p.default || !p.required ? `${p.name}?.()` : `${p.name}()`
			})), "name")}${isRequestOptions ? "options?.()" : "queryOptions?.()"})`;
			return `${queryOptionsVarName}${optionalQueryClientArgument ? ", queryClient" : ""}`;
		},
		getQueryInvocationSuffix() {
			return hasSvelteQueryV6 ? `, queryClient` : "";
		},
		getOptionalQueryClientArgument(hasInvalidation) {
			if (hasSvelteQueryV6) return `, queryClient?: () => QueryClient`;
			if (hasQueryV5 || hasInvalidation) return ", queryClient?: QueryClient";
			return "";
		},
		getQueryOptionsDefinitionPrefix() {
			return prefix;
		},
		generateQueryArguments({ operationName, definitions, mutator, isRequestOptions, type, queryParams, queryParam, initialData, httpClient, forQueryOptions = false, hasInvalidation, useRuntimeFetcher }) {
			const definition = getQueryOptionsDefinition({
				operationName,
				mutator,
				definitions,
				type,
				prefix,
				hasQueryV5,
				hasQueryV5WithInfiniteQueryOptionsError,
				queryParams,
				queryParam,
				isReturnType: false,
				initialData
			});
			if (!isRequestOptions) return `${type ? "queryOptions" : "mutationOptions"}${initialData === "defined" ? "" : "?"}: ${definition}`;
			const requestType = getQueryArgumentsRequestType(httpClient, mutator, useRuntimeFetcher);
			const isQueryRequired = initialData === "defined";
			const optionsType = `{ ${type ? "query" : "mutation"}${isQueryRequired ? "" : "?"}:${definition}, ${!type && hasInvalidation ? "skipInvalidation?: boolean, " : ""}${requestType}}`;
			return `options${isQueryRequired ? "" : "?"}: ${hasSvelteQueryV6 && !forQueryOptions ? "() => " : ""}${optionsType}\n`;
		},
		generateMutationImplementation({ mutationOptionsFnName, hasInvalidation, isRequestOptions }) {
			if (hasSvelteQueryV6) return `${mutationOptionsFnName}(${hasInvalidation ? `backupQueryClient, ` : ""}${isRequestOptions ? "options" : "mutationOptions"}?.())`;
			return `${mutationOptionsFnName}(${hasInvalidation ? `queryClient ?? backupQueryClient, ` : ""}${isRequestOptions ? "options" : "mutationOptions"})`;
		},
		supportsMutationInvalidation() {
			return true;
		},
		generateMutationHookBody({ operationPrefix, mutationImplementation, hasInvalidation, optionalQueryClientArgument }) {
			if (hasSvelteQueryV6) return `      ${hasInvalidation ? `const backupQueryClient = useQueryClient(${optionalQueryClientArgument ? "queryClient?.()" : ""});\n      ` : ""}return ${operationPrefix}Mutation(() => ({ ...${mutationImplementation} })${optionalQueryClientArgument ? `, queryClient` : ""});`;
			return `      ${hasInvalidation ? `const backupQueryClient = useQueryClient();\n      ` : ""}return ${operationPrefix}Mutation(${mutationImplementation});`;
		},
		getQueryType(type) {
			if (hasSvelteQueryV4) return getQueryTypeForFramework(type);
			return type;
		},
		generateRequestFunction(verbOptions, options) {
			return options.context.output.httpClient === OutputHttpClient.AXIOS ? generateAxiosRequestFunction(verbOptions, options, false) : generateRequestFunction(verbOptions, options);
		}
	};
};
//#endregion
//#region src/frameworks/vue.ts
const createVueAdapter = ({ hasVueQueryV4, hasQueryV5, hasQueryV5WithDataTagError, hasQueryV5WithInfiniteQueryOptionsError, hasQueryV5WithMutationContextOnSuccess, hasQueryV5WithRequiredContextOnSuccess }) => ({
	outputClient: OutputClient.VUE_QUERY,
	hookPrefix: "use",
	hasQueryV5,
	hasQueryV5WithDataTagError,
	hasQueryV5WithInfiniteQueryOptionsError,
	hasQueryV5WithMutationContextOnSuccess,
	hasQueryV5WithRequiredContextOnSuccess,
	transformProps(props) {
		return vueWrapTypeWithMaybeRef(props);
	},
	shouldDestructureNamedPathParams() {
		return false;
	},
	getHttpFunctionQueryProps(queryProperties, httpClient) {
		if (httpClient === OutputHttpClient.FETCH && queryProperties) return queryProperties.split(",").map((prop) => `unref(${prop})`).join(",");
		return queryProperties;
	},
	getInfiniteQueryHttpProps(props, queryParam) {
		return props.map((param) => {
			return param.name === "params" ? `{...unref(params), '${queryParam}': pageParam || unref(params)?.['${queryParam}']}` : param.name;
		}).join(",");
	},
	getQueryReturnType({ type }) {
		if (!hasVueQueryV4) return ` UseQueryReturnType<TData, TError, Use${pascal(type)}Result<TData, TError>> & { queryKey: QueryKey }`;
		if (type !== QueryType.INFINITE && type !== QueryType.SUSPENSE_INFINITE) return `UseQueryReturnType<TData, TError> & { queryKey: ${hasQueryV5 ? `DataTag<QueryKey, TData${hasQueryV5WithDataTagError ? ", TError" : ""}>` : "QueryKey"} }`;
		return `UseInfiniteQueryReturnType<TData, TError> & { queryKey: ${hasQueryV5 ? `DataTag<QueryKey, TData${hasQueryV5WithDataTagError ? ", TError" : ""}>` : "QueryKey"} }`;
	},
	getMutationReturnType({ dataType, variableType }) {
		return `: UseMutationReturnType<
        Awaited<ReturnType<${dataType}>>,
        TError,
        ${variableType},
        TContext
      >`;
	},
	getQueryReturnStatement({ queryResultVarName, queryOptionsVarName }) {
		return `${queryResultVarName}.queryKey = unref(${queryOptionsVarName}).queryKey as ${hasQueryV5 ? `DataTag<QueryKey, TData${hasQueryV5WithDataTagError ? ", TError" : ""}>` : "QueryKey"};

  return ${queryResultVarName};`;
	},
	getQueryKeyRouteString(route) {
		return getRouteAsArray(route);
	},
	shouldAnnotateQueryKey() {
		return false;
	},
	getUnrefStatements(props) {
		return vueUnRefParams(props.filter((prop) => prop.type === GetterPropType.NAMED_PATH_PARAMS));
	},
	generateEnabledOption(params, options) {
		if (!isObject(options) || !Object.hasOwn(options, "enabled")) return `enabled: computed(() => !!(${params.map(({ name }) => `unref(${name})`).join(" && ")})),`;
		return "";
	},
	getQueryKeyPrefix() {
		return hasVueQueryV4 ? "" : "queryOptions?.queryKey ?? ";
	},
	generateMutationImplementation({ mutationOptionsFnName, isRequestOptions }) {
		return `${mutationOptionsFnName}(${isRequestOptions ? "options" : "mutationOptions"})`;
	},
	supportsMutationInvalidation() {
		return false;
	},
	generateMutationOnSuccess() {
		return "";
	},
	generateMutationHookBody({ operationPrefix, mutationImplementation, optionalQueryClientArgument }) {
		return `      return ${operationPrefix}Mutation(${mutationImplementation}${optionalQueryClientArgument ? `, queryClient` : ""});`;
	},
	generateRequestFunction(verbOptions, options) {
		return options.context.output.httpClient === OutputHttpClient.AXIOS ? generateAxiosRequestFunction(verbOptions, options, true) : generateRequestFunction(verbOptions, options);
	},
	getQueryPropertyForProp(prop, body) {
		return prop.type === GetterPropType.BODY ? body.implementation : prop.name;
	}
});
//#endregion
//#region src/frameworks/index.ts
/** Fill in defaults for fields that most adapters leave empty or share a common implementation. */
const withDefaults = (adapter) => ({
	isAngularHttp: false,
	getHttpFirstParam: () => "",
	getMutationHttpPrefix: () => "",
	getUnrefStatements: () => "",
	getQueryInvocationSuffix: () => "",
	transformProps: (props) => props,
	getHttpFunctionQueryProps: (qp) => qp,
	getQueryType: (type) => type,
	shouldDestructureNamedPathParams: () => true,
	shouldAnnotateQueryKey: () => true,
	shouldGenerateOverrideTypes: () => false,
	shouldCastQueryResult: () => true,
	shouldCastQueryOptions: () => true,
	getQueryKeyPrefix: () => "queryOptions?.queryKey ?? ",
	getQueryOptionsDefinitionPrefix: () => "Use",
	getHookPropsDefinitions: (props) => toObjectString(props, "implementation"),
	getQueryKeyRouteString(route, shouldSplitQueryKey) {
		if (shouldSplitQueryKey) return getRouteAsArray(route);
		return `\`${route}\``;
	},
	generateEnabledOption(params, options) {
		if (!isObject(options) || !Object.hasOwn(options, "enabled")) return `enabled: !!(${params.map(({ name }) => name).join(" && ")}),`;
		return "";
	},
	getQueryPropertyForProp(prop, body) {
		if (prop.type === GetterPropType.NAMED_PATH_PARAMS) return prop.destructured;
		return prop.type === GetterPropType.BODY ? body.implementation : prop.name;
	},
	getInfiniteQueryHttpProps(props, queryParam) {
		return props.map((param) => {
			if (param.type === GetterPropType.NAMED_PATH_PARAMS) return param.destructured;
			return param.name === "params" ? `{...params, '${queryParam}': pageParam || params?.['${queryParam}']}` : param.name;
		}).join(",");
	},
	generateQueryInit({ queryOptionsFnName, queryProperties, isRequestOptions }) {
		return `const ${isRequestOptions ? "queryOptions" : "options"} = ${queryOptionsFnName}(${queryProperties}${queryProperties ? "," : ""}${isRequestOptions ? "options" : "queryOptions"})`;
	},
	generateQueryInvocationArgs({ queryOptionsVarName, optionalQueryClientArgument }) {
		return `${queryOptionsVarName}${optionalQueryClientArgument ? ", queryClient" : ""}`;
	},
	getOptionalQueryClientArgument() {
		return adapter.hasQueryV5 ? ", queryClient?: QueryClient" : "";
	},
	generateQueryArguments({ operationName, definitions, mutator, isRequestOptions, type, queryParams, queryParam, initialData, httpClient, hasInvalidation, useRuntimeFetcher }) {
		const definition = getQueryOptionsDefinition({
			operationName,
			mutator,
			definitions,
			type,
			prefix: adapter.getQueryOptionsDefinitionPrefix?.() ?? "Use",
			hasQueryV5: adapter.hasQueryV5,
			hasQueryV5WithInfiniteQueryOptionsError: adapter.hasQueryV5WithInfiniteQueryOptionsError,
			queryParams,
			queryParam,
			isReturnType: false,
			initialData
		});
		if (!isRequestOptions) return `${type ? "queryOptions" : "mutationOptions"}${initialData === "defined" ? "" : "?"}: ${definition}`;
		const requestType = getQueryArgumentsRequestType(httpClient, mutator, useRuntimeFetcher);
		const isQueryRequired = initialData === "defined";
		const optionsType = `{ ${type ? "query" : "mutation"}${isQueryRequired ? "" : "?"}:${definition}, ${!type && hasInvalidation ? "skipInvalidation?: boolean, " : ""}${requestType}}`;
		return `options${isQueryRequired ? "" : "?"}: ${optionsType}\n`;
	},
	generateMutationOnSuccess({ operationName, definitions, isRequestOptions, generateInvalidateCall, uniqueInvalidates }) {
		const invalidateCalls = uniqueInvalidates.map((t) => generateInvalidateCall(t)).join("\n");
		if (adapter.hasQueryV5WithMutationContextOnSuccess) {
			if (isRequestOptions) return `  const onSuccess = (data: Awaited<ReturnType<typeof ${operationName}>>, variables: ${definitions ? `{${definitions}}` : "void"}, onMutateResult: TContext, context: MutationFunctionContext) => {
        if (!options?.skipInvalidation) {
    ${invalidateCalls}
        }
        mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
      };`;
			return `  const onSuccess = (data: Awaited<ReturnType<typeof ${operationName}>>, variables: ${definitions ? `{${definitions}}` : "void"}, onMutateResult: TContext, context: MutationFunctionContext) => {
    ${invalidateCalls}
        mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
      };`;
		} else {
			if (isRequestOptions) return `  const onSuccess = (data: Awaited<ReturnType<typeof ${operationName}>>, variables: ${definitions ? `{${definitions}}` : "void"}, context: TContext${adapter.hasQueryV5WithRequiredContextOnSuccess ? "" : " | undefined"}) => {
        if (!options?.skipInvalidation) {
    ${invalidateCalls}
        }
        mutationOptions?.onSuccess?.(data, variables, context);
      };`;
			return `  const onSuccess = (data: Awaited<ReturnType<typeof ${operationName}>>, variables: ${definitions ? `{${definitions}}` : "void"}, context: TContext${adapter.hasQueryV5WithRequiredContextOnSuccess ? "" : " | undefined"}) => {
    ${invalidateCalls}
        mutationOptions?.onSuccess?.(data, variables, context);
      };`;
		}
	},
	...adapter
});
/**
* Create a FrameworkAdapter for the given output client, resolving version flags
* from the packageJson and query config.
*/
const createFrameworkAdapter = ({ outputClient, packageJson, queryVersion }) => {
	const clientType = outputClient;
	const _hasQueryV5 = queryVersion === 5 || isQueryV5(packageJson, clientType);
	const _hasQueryV5WithDataTagError = queryVersion === 5 || isQueryV5WithDataTagError(packageJson, clientType);
	const _hasQueryV5WithInfiniteQueryOptionsError = queryVersion === 5 || isQueryV5WithInfiniteQueryOptionsError(packageJson, clientType);
	const _hasQueryV5WithMutationContextOnSuccess = isQueryV5WithMutationContextOnSuccess(packageJson, clientType);
	const _hasQueryV5WithRequiredContextOnSuccess = isQueryV5WithRequiredContextOnSuccess(packageJson, clientType);
	switch (outputClient) {
		case OutputClient.VUE_QUERY: return withDefaults(createVueAdapter({
			hasVueQueryV4: !isVueQueryV3(packageJson) || queryVersion === 4,
			hasQueryV5: _hasQueryV5,
			hasQueryV5WithDataTagError: _hasQueryV5WithDataTagError,
			hasQueryV5WithInfiniteQueryOptionsError: _hasQueryV5WithInfiniteQueryOptionsError,
			hasQueryV5WithMutationContextOnSuccess: _hasQueryV5WithMutationContextOnSuccess,
			hasQueryV5WithRequiredContextOnSuccess: _hasQueryV5WithRequiredContextOnSuccess
		}));
		case OutputClient.SVELTE_QUERY: return withDefaults(createSvelteAdapter({
			hasSvelteQueryV4: !isSvelteQueryV3(packageJson) || queryVersion === 4,
			hasSvelteQueryV6: isSvelteQueryV6(packageJson),
			hasQueryV5: _hasQueryV5,
			hasQueryV5WithDataTagError: _hasQueryV5WithDataTagError,
			hasQueryV5WithInfiniteQueryOptionsError: _hasQueryV5WithInfiniteQueryOptionsError,
			hasQueryV5WithMutationContextOnSuccess: _hasQueryV5WithMutationContextOnSuccess,
			hasQueryV5WithRequiredContextOnSuccess: _hasQueryV5WithRequiredContextOnSuccess
		}));
		case OutputClient.ANGULAR_QUERY: return withDefaults(createAngularAdapter({
			hasQueryV5: _hasQueryV5,
			hasQueryV5WithDataTagError: _hasQueryV5WithDataTagError,
			hasQueryV5WithInfiniteQueryOptionsError: _hasQueryV5WithInfiniteQueryOptionsError,
			hasQueryV5WithMutationContextOnSuccess: _hasQueryV5WithMutationContextOnSuccess,
			hasQueryV5WithRequiredContextOnSuccess: _hasQueryV5WithRequiredContextOnSuccess
		}));
		case OutputClient.SOLID_QUERY: return withDefaults(createSolidAdapter({
			hasQueryV5: _hasQueryV5,
			hasQueryV5WithDataTagError: _hasQueryV5WithDataTagError,
			hasQueryV5WithInfiniteQueryOptionsError: _hasQueryV5WithInfiniteQueryOptionsError,
			hasQueryV5WithMutationContextOnSuccess: _hasQueryV5WithMutationContextOnSuccess,
			hasQueryV5WithRequiredContextOnSuccess: _hasQueryV5WithRequiredContextOnSuccess,
			hasSolidQueryUsePrefix: isSolidQueryWithUsePrefix(packageJson)
		}));
		default: return withDefaults(createReactAdapter({
			hasQueryV5: _hasQueryV5,
			hasQueryV5WithDataTagError: _hasQueryV5WithDataTagError,
			hasQueryV5WithInfiniteQueryOptionsError: _hasQueryV5WithInfiniteQueryOptionsError,
			hasQueryV5WithMutationContextOnSuccess: _hasQueryV5WithMutationContextOnSuccess,
			hasQueryV5WithRequiredContextOnSuccess: _hasQueryV5WithRequiredContextOnSuccess
		}));
	}
};
//#endregion
//#region src/mutation-generator.ts
const normalizeInvalidateMode = (invalidateMode) => invalidateMode === "reset" ? "reset" : "invalidate";
const normalizeTarget = (target) => isString(target) ? {
	query: target,
	invalidateMode: "invalidate"
} : {
	...target,
	invalidateMode: normalizeInvalidateMode(target.invalidateMode)
};
const serializeTarget = (target) => JSON.stringify({
	query: target.query,
	params: target.params ?? [],
	invalidateMode: target.invalidateMode,
	file: target.file ?? ""
});
const HTTP_METHODS = [
	"get",
	"post",
	"put",
	"delete",
	"patch",
	"options",
	"head",
	"trace"
];
/**
* Look up an operation's route and path-parameter metadata from the OpenAPI
* spec. Matches against both the raw `operationId` and its camelCase form
* so that renamed/overridden operations are still found.
*/
const findOperationInfo = (spec, operationName) => {
	const paths = spec?.paths;
	if (!paths || typeof paths !== "object") return void 0;
	for (const [routePath, rawPathItem] of Object.entries(paths)) {
		if (!rawPathItem || typeof rawPathItem !== "object") continue;
		const pathItem = rawPathItem;
		for (const method of HTTP_METHODS) {
			const operation = pathItem[method];
			const opId = operation?.operationId;
			if (!opId) continue;
			if (opId !== operationName && camel(opId) !== operationName) continue;
			if (!routePath.includes("{")) return {
				route: routePath,
				hasRequiredPathParams: false
			};
			return {
				route: routePath,
				hasRequiredPathParams: [...Array.isArray(pathItem.parameters) ? pathItem.parameters : [], ...Array.isArray(operation.parameters) ? operation.parameters : []].filter((p) => p.in === "path").some((p) => p.schema?.default === void 0 && p.default === void 0)
			};
		}
	}
};
/**
* Extract the static route prefix before the first path parameter.
* e.g. "/pets/{petId}" → "/pets/", "/pets" → "/pets"
*
* Returns `undefined` when the prefix contains no meaningful literal
* segments (e.g. "/{tenantId}/pets") to avoid overly-broad invalidation.
*/
const getStaticRoutePrefix = (route) => {
	const idx = route.indexOf("{");
	if (idx === -1) return route;
	const prefix = route.slice(0, idx);
	return prefix.split("/").some((segment) => segment.length > 0) ? prefix : void 0;
};
/**
* Check whether the target invalidation needs to call the query key function.
* Returns false when no params are specified and the route has required path
* parameters (without defaults), meaning we should use predicate-based broad
* invalidation instead of calling the function without the required arguments.
*/
const hasNonEmptyParams = (params) => {
	if (!params) return false;
	if (Array.isArray(params)) return params.length > 0;
	return Object.keys(params).length > 0;
};
const needsQueryKeyFnCall = (target, spec) => {
	if (hasNonEmptyParams(target.params)) return true;
	if (findOperationInfo(spec, target.query)?.hasRequiredPathParams) return false;
	return true;
};
const generateParamArg = (param) => {
	if (!isString(param)) return JSON.stringify(param.literal);
	const parts = param.split(".");
	if (parts.length === 1) return `variables.${param}`;
	return `variables.${parts[0]}?.${parts.slice(1).join("?.")}`;
};
const generateParamArgs = (params) => {
	if (Array.isArray(params)) return params.map((v) => generateParamArg(v)).join(", ");
	return Object.values(params).map((v) => generateParamArg(v)).join(", ");
};
/**
* Create a generateInvalidateCall function that has access to the OpenAPI spec
* for intelligent route-based invalidation when params are not specified.
*/
const createGenerateInvalidateCall = (spec, shouldSplitQueryKey) => {
	return (target) => {
		const method = target.invalidateMode === "reset" ? "resetQueries" : "invalidateQueries";
		const queryKeyFn = camel(`get-${target.query}-query-key`);
		if (hasNonEmptyParams(target.params)) return `    queryClient.${method}({ queryKey: ${queryKeyFn}(${generateParamArgs(target.params)}) });`;
		const info = findOperationInfo(spec, target.query);
		if (info?.hasRequiredPathParams) {
			const prefix = getStaticRoutePrefix(info.route);
			if (prefix !== void 0) {
				if (shouldSplitQueryKey) return `    queryClient.${method}({ queryKey: [${prefix.split("/").filter((s) => s !== "").map((s) => `'${s}'`).join(", ")}] });`;
				return `    queryClient.${method}({ predicate: (query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('${prefix}') });`;
			}
		}
		return `    queryClient.${method}({ queryKey: ${queryKeyFn}() });`;
	};
};
const generateMutationHook = async ({ verbOptions, options, isRequestOptions, httpClient, doc, adapter }) => {
	const { operationName, body, props, mutator, response, operationId, override } = verbOptions;
	const { route, context, output } = options;
	const query = override.query;
	const mutationOptionsMutator = query.mutationOptions ? await generateMutator({
		output,
		mutator: query.mutationOptions,
		name: `${operationName}MutationOptions`,
		workspace: context.workspace,
		tsconfig: context.output.tsconfig
	}) : void 0;
	const bodyOptionalMark = body.isOptional ? "?" : "";
	const definitions = props.map(({ definition, type }) => type === GetterPropType.BODY ? mutator?.bodyTypeName ? `data${bodyOptionalMark}: ${mutator.bodyTypeName}<${body.definition}>` : `data${bodyOptionalMark}: ${body.definition}` : definition).join(";");
	const properties = props.map(({ name, type }) => type === GetterPropType.BODY ? "data" : name).join(",");
	const errorType = getQueryErrorType(operationName, response, httpClient, mutator);
	const dataType = mutator?.isHook ? `ReturnType<typeof use${pascal(operationName)}Hook>` : `typeof ${operationName}`;
	const mutationOptionFnReturnType = getQueryOptionsDefinition({
		operationName,
		mutator,
		definitions,
		prefix: adapter.getQueryOptionsDefinitionPrefix(),
		hasQueryV5: adapter.hasQueryV5,
		hasQueryV5WithInfiniteQueryOptionsError: adapter.hasQueryV5WithInfiniteQueryOptionsError,
		isReturnType: true,
		adapter
	});
	const invalidatesConfig = (query.mutationInvalidates ?? []).filter((rule) => rule.onMutations.includes(operationName)).flatMap((rule) => rule.invalidates).map((t) => normalizeTarget(t));
	const seenTargets = /* @__PURE__ */ new Set();
	const uniqueInvalidates = invalidatesConfig.filter((target) => {
		const key = serializeTarget(target);
		if (seenTargets.has(key)) return false;
		seenTargets.add(key);
		return true;
	});
	const hasInvalidation = uniqueInvalidates.length > 0 && adapter.supportsMutationInvalidation();
	const useRuntimeFetcher = override.fetch.useRuntimeFetcher;
	const mutationArguments = adapter.generateQueryArguments({
		operationName,
		definitions,
		mutator,
		isRequestOptions,
		httpClient,
		hasInvalidation,
		useRuntimeFetcher
	});
	const mutationArgumentsForOptions = adapter.generateQueryArguments({
		operationName,
		definitions,
		mutator,
		isRequestOptions,
		httpClient,
		forQueryOptions: true,
		hasInvalidation,
		useRuntimeFetcher
	});
	const mutationOptionsFnName = camel(mutationOptionsMutator || mutator?.isHook ? `use-${operationName}-mutationOptions` : `get-${operationName}-mutationOptions`);
	const hooksOptionImplementation = getHooksOptionImplementation(isRequestOptions, httpClient, camel(operationName), mutator, useRuntimeFetcher);
	const mutationOptionsFn = `export const ${mutationOptionsFnName} = <TError = ${errorType},
    TContext = unknown>(${adapter.getHttpFirstParam(mutator)}${hasInvalidation ? "queryClient: QueryClient, " : ""}${mutationArgumentsForOptions}): ${mutationOptionFnReturnType} => {

${hooksOptionImplementation}

      ${mutator?.isHook ? `const ${operationName} =  use${pascal(operationName)}Hook()` : ""}


      const mutationFn: MutationFunction<Awaited<ReturnType<${dataType}>>, ${definitions ? `{${definitions}}` : "void"}> = (${properties ? "props" : ""}) => {
          ${properties ? `const {${properties}} = props ?? {};` : ""}

          return  ${operationName}(${adapter.getMutationHttpPrefix(mutator)}${properties}${properties ? "," : ""}${getMutationRequestArgs(isRequestOptions, httpClient, mutator, useRuntimeFetcher)})
        }

${hasInvalidation ? adapter.generateMutationOnSuccess({
		operationName,
		definitions,
		isRequestOptions,
		generateInvalidateCall: createGenerateInvalidateCall(context.spec, !!query.shouldSplitQueryKey),
		uniqueInvalidates
	}) : ""}

        ${mutationOptionsMutator ? `const customOptions = ${mutationOptionsMutator.name}({...mutationOptions, mutationFn}${mutationOptionsMutator.hasSecondArg ? `, { url: \`${route.replaceAll("/${", "/{")}\` }` : ""}${mutationOptionsMutator.hasThirdArg ? `, { operationId: '${operationId}', operationName: '${operationName}' }` : ""});` : ""}


  return  ${mutationOptionsMutator ? "customOptions" : hasInvalidation ? "{ ...mutationOptions, mutationFn, onSuccess }" : "{ mutationFn, ...mutationOptions }"}}`;
	const operationPrefix = adapter.hookPrefix;
	const optionalQueryClientArgument = adapter.getOptionalQueryClientArgument(hasInvalidation);
	const mutationImplementation = adapter.generateMutationImplementation({
		mutationOptionsFnName,
		hasInvalidation,
		isRequestOptions
	});
	const mutationOptionsVarName = camel(`${operationName}-mutation-options`);
	const mutationReturnType = adapter.getMutationReturnType({
		dataType,
		variableType: definitions ? `{${definitions}}` : "void"
	});
	const mutationHookBody = adapter.generateMutationHookBody({
		operationPrefix,
		mutationOptionsFnName,
		mutationImplementation,
		mutationOptionsVarName,
		isRequestOptions,
		mutator,
		hasInvalidation,
		optionalQueryClientArgument
	});
	return {
		implementation: `
${mutationOptionsFn}

    export type ${pascal(operationName)}MutationResult = NonNullable<Awaited<ReturnType<${dataType}>>>
    ${body.definition ? `export type ${pascal(operationName)}MutationBody = ${mutator?.bodyTypeName ? `${mutator.bodyTypeName}<${body.definition}>` : body.definition}${body.isOptional ? " | undefined" : ""}` : ""}
    export type ${pascal(operationName)}MutationError = ${errorType}

    ${doc}export const ${camel(`${operationPrefix}-${operationName}`)} = <TError = ${errorType},
    TContext = unknown>(${mutationArguments} ${optionalQueryClientArgument})${mutationReturnType} => {
${mutationHookBody}
    }
    `,
		mutators: mutationOptionsMutator ? [mutationOptionsMutator] : void 0,
		imports: hasInvalidation ? uniqueInvalidates.filter((i) => !!i.file && needsQueryKeyFnCall(i, context.spec)).map((i) => ({
			name: camel(`get-${i.query}-query-key`),
			importPath: i.file,
			values: true
		})) : []
	};
};
//#endregion
//#region src/query-generator.ts
/**
* Decide whether the current operation's configuration conflicts with a
* `mutationInvalidates` rule. The rule wires its invalidation through the
* Mutation hook's `onSuccess`, so referencing an operation that is not
* generated as a Mutation (either forced into a Query via per-operation
* `useQuery: true`, or suppressed entirely) makes the rule a silent no-op.
*
* Returns the warning message when the conflict applies, or `undefined`
* when the configuration is consistent.
*/
const getMutationInvalidatesConflictWarning = ({ operationName, isMutation, isQuery, mutationInvalidates }) => {
	if (isMutation) return void 0;
	if (!mutationInvalidates?.length) return void 0;
	if (!mutationInvalidates.find((rule) => rule.onMutations.includes(operationName))) return void 0;
	return `mutationInvalidates rule references '${operationName}', but that operation is generated as a ${isQuery ? "Query hook" : "plain function (no hook)"}, not a Mutation. The invalidation will not fire. Either remove '${operationName}' from the rule's onMutations list, or configure '${operationName}' so that it is generated as a Mutation hook.`;
};
const getQueryFnArguments = ({ hasQueryParam, hasSignal, hasSignalParam = false }) => {
	if (!hasQueryParam && !hasSignal) return "";
	const signalDestructure = hasSignalParam ? "signal: querySignal" : "signal";
	if (hasQueryParam) {
		if (hasSignal) return `{ ${signalDestructure}, pageParam }`;
		return "{ pageParam }";
	}
	return `{ ${signalDestructure} }`;
};
const generatePrefetch = ({ usePrefetch, type, useQuery, useInfinite, operationName, mutator, doc, queryProps, dataType, errorType, queryArguments, queryOptionsVarName, queryOptionsFnName, queryProperties, isRequestOptions }) => {
	if (!(usePrefetch && (type === QueryType.QUERY || type === QueryType.INFINITE || type === QueryType.SUSPENSE_QUERY && !useQuery || type === QueryType.SUSPENSE_INFINITE && !useInfinite))) return "";
	const prefetchType = type === QueryType.QUERY || type === QueryType.SUSPENSE_QUERY ? "query" : "infinite-query";
	const prefetchFnName = camel(`prefetch-${prefetchType}`);
	if (mutator?.isHook) return `${doc}export const ${camel(`use-prefetch-${operationName}-${prefetchType}`)} = <TData = Awaited<ReturnType<${dataType}>>, TError = ${errorType}>(${queryProps} ${queryArguments}) => {
  const queryClient = useQueryClient();
  const ${queryOptionsVarName} = ${queryOptionsFnName}(${queryProperties}${queryProperties ? "," : ""}${isRequestOptions ? "options" : "queryOptions"})
  return useCallback(async (): Promise<QueryClient> => {
    await queryClient.${prefetchFnName}(${queryOptionsVarName})
    return queryClient;
  },[queryClient, ${queryOptionsVarName}]);
};\n`;
	else return `${doc}export const ${camel(`prefetch-${operationName}-${prefetchType}`)} = async <TData = Awaited<ReturnType<${dataType}>>, TError = ${errorType}>(\n queryClient: QueryClient, ${queryProps} ${queryArguments}\n  ): Promise<QueryClient> => {

  const ${queryOptionsVarName} = ${queryOptionsFnName}(${queryProperties}${queryProperties ? "," : ""}${isRequestOptions ? "options" : "queryOptions"})

  await queryClient.${prefetchFnName}(${queryOptionsVarName});

  return queryClient;
}\n`;
};
const generateQueryImplementation = ({ queryOption: { name, queryParam, options, type, queryKeyFnName }, operationName, queryProperties, queryKeyProperties, queryParams, params, props, mutator, queryOptionsMutator, queryKeyMutator, isRequestOptions, response, httpClient, isExactOptionalPropertyTypes, hasSignal, useRuntimeFetcher, route, doc, usePrefetch, useQuery, useInfinite, useInvalidate, useSetQueryData, useGetQueryData, adapter }) => {
	const { hasQueryV5, hasQueryV5WithDataTagError, hasQueryV5WithInfiniteQueryOptionsError } = adapter;
	const hasSignalParam = props.some((prop) => prop.name === "signal");
	const queryPropDefinitions = toObjectString(props, "definition");
	const definedInitialDataQueryPropsDefinitions = toObjectString(props.map((prop) => {
		const regex = new RegExp(String.raw`^${prop.name}\s*\?:`);
		if (!regex.test(prop.definition)) return prop;
		const definitionWithUndefined = prop.definition.replace(regex, `${prop.name}: undefined | `);
		return {
			...prop,
			definition: definitionWithUndefined
		};
	}), "definition");
	const queryProps = toObjectString(props, "implementation");
	const hasInfiniteQueryParam = queryParam && queryParams?.schema.name;
	const httpFunctionProps = queryParam ? adapter.getInfiniteQueryHttpProps(props, queryParam, !!mutator) : adapter.getHttpFunctionQueryProps(queryProperties, httpClient, !!mutator);
	const definedInitialDataReturnType = adapter.getQueryReturnType({
		type,
		isMutatorHook: mutator?.isHook,
		operationName,
		hasQueryV5,
		hasQueryV5WithDataTagError,
		isInitialDataDefined: true
	});
	const returnType = adapter.getQueryReturnType({
		type,
		isMutatorHook: mutator?.isHook,
		operationName,
		hasQueryV5,
		hasQueryV5WithDataTagError
	});
	const errorType = getQueryErrorType(operationName, response, httpClient, mutator);
	const dataType = mutator?.isHook ? `ReturnType<typeof use${pascal(operationName)}Hook>` : `typeof ${operationName}`;
	const definedInitialDataQueryArguments = adapter.generateQueryArguments({
		operationName,
		mutator,
		definitions: "",
		isRequestOptions,
		type,
		queryParams,
		queryParam,
		initialData: "defined",
		httpClient,
		useRuntimeFetcher
	});
	const undefinedInitialDataQueryArguments = adapter.generateQueryArguments({
		operationName,
		definitions: "",
		mutator,
		isRequestOptions,
		type,
		queryParams,
		queryParam,
		initialData: "undefined",
		httpClient,
		useRuntimeFetcher
	});
	const queryArguments = adapter.generateQueryArguments({
		operationName,
		definitions: "",
		mutator,
		isRequestOptions,
		type,
		queryParams,
		queryParam,
		httpClient,
		useRuntimeFetcher
	});
	const queryArgumentsForOptions = adapter.generateQueryArguments({
		operationName,
		definitions: "",
		mutator,
		isRequestOptions,
		type,
		queryParams,
		queryParam,
		httpClient,
		forQueryOptions: true,
		useRuntimeFetcher
	});
	const queryOptions = getQueryOptions({
		isRequestOptions,
		isExactOptionalPropertyTypes,
		mutator,
		hasSignal,
		httpClient,
		hasSignalParam,
		useRuntimeFetcher
	});
	const hookOptions = getHookOptions({
		isRequestOptions,
		httpClient,
		mutator,
		useRuntimeFetcher
	});
	const queryFnArguments = getQueryFnArguments({
		hasQueryParam: !!queryParam && props.some(({ type }) => type === "queryParam"),
		hasSignal,
		hasSignalParam
	});
	const queryOptionFnReturnType = getQueryOptionsDefinition({
		operationName,
		mutator,
		definitions: "",
		type,
		prefix: adapter.getQueryOptionsDefinitionPrefix(),
		hasQueryV5,
		hasQueryV5WithInfiniteQueryOptionsError,
		queryParams,
		queryParam,
		isReturnType: true,
		adapter
	});
	const queryOptionsImp = generateQueryOptions({
		params,
		options,
		type,
		adapter
	});
	const queryOptionsFnName = camel(queryKeyMutator || queryOptionsMutator || mutator?.isHook ? `use-${name}-queryOptions` : `get-${name}-queryOptions`);
	const queryOptionsVarName = isRequestOptions ? "queryOptions" : "options";
	const queryResultVarName = props.some((prop) => prop.name === "query") ? "_query" : "query";
	const infiniteParam = queryParams && queryParam ? `, ${queryParams.schema.name}['${queryParam}']` : "";
	const TData = hasQueryV5 && (type === QueryType.INFINITE || type === QueryType.SUSPENSE_INFINITE) ? `InfiniteData<Awaited<ReturnType<${dataType}>>${infiniteParam}>` : `Awaited<ReturnType<${dataType}>>`;
	const queryOptionsFn = `export const ${queryOptionsFnName} = <TData = ${TData}, TError = ${errorType}>(${adapter.getHttpFirstParam(mutator)}${queryProps} ${queryArgumentsForOptions}) => {

${hookOptions}

  const queryKey =  ${queryKeyMutator ? `${queryKeyMutator.name}({ ${queryProperties} }${queryKeyMutator.hasSecondArg ? `, { url: \`${route}\`, queryOptions }` : ""});` : `${adapter.getQueryKeyPrefix()}${queryKeyFnName}(${queryKeyProperties});`}

  ${mutator?.isHook ? `const ${operationName} =  use${pascal(operationName)}Hook();` : ""}

    const queryFn: QueryFunction<Awaited<ReturnType<${mutator?.isHook ? `ReturnType<typeof use${pascal(operationName)}Hook>` : `typeof ${operationName}`}>>${hasQueryV5 && hasInfiniteQueryParam ? `, QueryKey, ${queryParams.schema.name}['${queryParam}']` : ""}> = (${queryFnArguments}) => ${operationName}(${httpFunctionProps}${httpFunctionProps ? ", " : ""}${queryOptions});

      ${adapter.getUnrefStatements(props)}

      ${queryOptionsMutator ? `const customOptions = ${queryOptionsMutator.name}({...queryOptions, queryKey, queryFn}${queryOptionsMutator.hasSecondArg ? `, { ${queryProperties} }` : ""}${queryOptionsMutator.hasThirdArg ? `, { url: \`${route}\` }` : ""});` : ""}

   return  ${queryOptionsMutator ? "customOptions" : `{ queryKey, queryFn, ${queryOptionsImp}}`}${adapter.shouldCastQueryOptions?.() === false ? "" : ` as ${queryOptionFnReturnType} ${adapter.shouldAnnotateQueryKey() ? `& { queryKey: ${hasQueryV5 ? `DataTag<QueryKey, TData${hasQueryV5WithDataTagError ? ", TError" : ""}>` : "QueryKey"} }` : ""}`}
}`;
	const operationPrefix = adapter.hookPrefix;
	const optionalQueryClientArgument = adapter.getOptionalQueryClientArgument();
	const queryHookName = camel(`${operationPrefix}-${name}`);
	const overrideTypes = `
export function ${queryHookName}<TData = ${TData}, TError = ${errorType}>(\n ${definedInitialDataQueryPropsDefinitions} ${definedInitialDataQueryArguments} ${optionalQueryClientArgument}\n  ): ${definedInitialDataReturnType}
export function ${queryHookName}<TData = ${TData}, TError = ${errorType}>(\n ${queryPropDefinitions} ${undefinedInitialDataQueryArguments} ${optionalQueryClientArgument}\n  ): ${returnType}
export function ${queryHookName}<TData = ${TData}, TError = ${errorType}>(\n ${queryPropDefinitions} ${queryArguments} ${optionalQueryClientArgument}\n  ): ${returnType}`;
	const prefetchContext = {
		usePrefetch,
		type,
		useQuery,
		useInfinite,
		operationName,
		mutator,
		queryProps,
		dataType,
		errorType,
		queryArguments: queryArgumentsForOptions,
		queryOptionsVarName,
		queryOptionsFnName,
		queryProperties,
		isRequestOptions,
		doc
	};
	const prefetch = adapter.generatePrefetch ? adapter.generatePrefetch(prefetchContext) : generatePrefetch(prefetchContext);
	const isPrimaryQueryType = type === QueryType.QUERY || type === QueryType.INFINITE || type === QueryType.SUSPENSE_QUERY && !useQuery || type === QueryType.SUSPENSE_INFINITE && !useInfinite;
	const buildBaseQueryKeyExpr = () => queryKeyMutator ? `${queryKeyMutator.name}({ ${queryProperties} }${queryKeyMutator.hasSecondArg ? `, { url: \`${route}\` }` : ""})` : `${queryKeyFnName}(${queryKeyProperties})`;
	const applyQueryOptionsMutator = (baseExpr) => queryOptionsMutator && !queryOptionsMutator.isHook ? `${queryOptionsMutator.name}({ queryKey: ${baseExpr} }${queryOptionsMutator.hasSecondArg ? `, { ${queryProperties} }` : ""}${queryOptionsMutator.hasThirdArg ? `, { url: \`${route}\` }` : ""}).queryKey` : baseExpr;
	const shouldGenerateInvalidate = useInvalidate && isPrimaryQueryType;
	const invalidateFnName = camel(`invalidate-${name}`);
	const invalidateQueryKeyExpr = applyQueryOptionsMutator(buildBaseQueryKeyExpr());
	const shouldGenerateSetQueryData = useSetQueryData && isPrimaryQueryType;
	const isReactQuery = adapter.outputClient === OutputClient.REACT_QUERY;
	const setQueryDataFnName = isReactQuery ? camel(`use-set-${name}-query-data`) : camel(`set-${name}-query-data`);
	const setQueryDataKeyExpr = buildBaseQueryKeyExpr();
	const setQueryDataProps = toObjectString(props.filter((prop) => prop.type !== GetterPropType.HEADER), "implementation").replaceAll("?:", ":");
	const shouldGenerateGetQueryData = useGetQueryData && isPrimaryQueryType;
	const getQueryDataFnName = isReactQuery ? camel(`use-get-${name}-query-data`) : camel(`get-${name}-query-data`);
	const getQueryDataKeyExpr = setQueryDataKeyExpr;
	const getQueryDataProps = setQueryDataProps;
	const queryInit = adapter.generateQueryInit({
		queryOptionsFnName,
		queryProperties,
		isRequestOptions,
		mutator
	});
	const queryInvocationArgs = adapter.generateQueryInvocationArgs({
		props,
		queryOptionsFnName,
		queryProperties,
		isRequestOptions,
		mutator,
		operationPrefix,
		type,
		queryOptionsVarName,
		optionalQueryClientArgument
	});
	const queryInvocationSuffix = adapter.getQueryInvocationSuffix();
	return `
${queryOptionsFn}

export type ${pascal(name)}QueryResult = NonNullable<Awaited<ReturnType<${dataType}>>>
export type ${pascal(name)}QueryError = ${errorType}

${adapter.shouldGenerateOverrideTypes() ? overrideTypes : ""}
${doc}
export function ${queryHookName}<TData = ${TData}, TError = ${errorType}>(\n ${adapter.getHookPropsDefinitions(props)} ${queryArguments} ${optionalQueryClientArgument} \n ): ${returnType} {

  ${queryInit}

  const ${queryResultVarName} = ${camel(`${operationPrefix}-${adapter.getQueryType(type)}`)}(${queryInvocationArgs}${queryInvocationSuffix})${adapter.shouldCastQueryResult?.() === false ? "" : ` as ${returnType}`};

  ${adapter.getQueryReturnStatement({
		hasQueryV5,
		hasQueryV5WithDataTagError,
		queryResultVarName,
		queryOptionsVarName
	})}
}\n
${prefetch}
${shouldGenerateInvalidate ? `${doc}export const ${invalidateFnName} = async (\n queryClient: QueryClient, ${queryProps} options?: InvalidateOptions\n  ): Promise<QueryClient> => {

  await queryClient.invalidateQueries({ queryKey: ${invalidateQueryKeyExpr} }, options);

  return queryClient;
}\n` : ""}
${shouldGenerateSetQueryData ? isReactQuery ? `${doc}export const ${setQueryDataFnName} = () => {
  const queryClient = useQueryClient();
  return (${setQueryDataProps}updater: ${TData} | undefined | ((old: ${TData} | undefined) => ${TData} | undefined)) => {
    queryClient.setQueryData(${setQueryDataKeyExpr}, updater);
  };
}\n` : `${doc}export const ${setQueryDataFnName} = (queryClient: QueryClient, ${setQueryDataProps}updater: ${TData} | undefined | ((old: ${TData} | undefined) => ${TData} | undefined)) => {
  queryClient.setQueryData(${setQueryDataKeyExpr}, updater);
}\n` : ""}
${shouldGenerateGetQueryData ? isReactQuery ? `${doc}export const ${getQueryDataFnName} = () => {
  const queryClient = useQueryClient();
  return (${getQueryDataProps}) =>
    queryClient.getQueryData<${TData}>(${getQueryDataKeyExpr});
}\n` : `${doc}export const ${getQueryDataFnName} = (queryClient: QueryClient, ${getQueryDataProps}) =>
  queryClient.getQueryData<${TData}>(${getQueryDataKeyExpr});\n` : ""}
`;
};
const generateQueryHook = async (verbOptions, options, outputClient, adapter) => {
	if (!adapter) throw new Error("FrameworkAdapter is required for generateQueryHook");
	const { queryParams, operationName, body, props: _props, verb, params, override, mutator, response, operationId, summary, deprecated } = verbOptions;
	const { route, override: { operations }, context, output } = options;
	const props = adapter.transformProps(_props);
	const query = override.query;
	const isRequestOptions = override.requestOptions !== false;
	const operationQueryOptions = operations[operationId]?.query;
	const isExactOptionalPropertyTypes = !!context.output.tsconfig?.compilerOptions?.exactOptionalPropertyTypes;
	const httpClient = context.output.httpClient;
	const doc = jsDoc({
		summary,
		deprecated
	});
	let implementation = "";
	let mutators;
	const hasOperationQueryOption = [
		operationQueryOptions?.useQuery,
		operationQueryOptions?.useSuspenseQuery,
		operationQueryOptions?.useInfinite,
		operationQueryOptions?.useSuspenseInfiniteQuery
	].some(Boolean);
	let isQuery = Verbs.GET === verb && [
		override.query.useQuery,
		override.query.useSuspenseQuery,
		override.query.useInfinite,
		override.query.useSuspenseInfiniteQuery
	].some(Boolean) || hasOperationQueryOption;
	let isMutation = override.query.useMutation && verb !== Verbs.GET;
	if (operationQueryOptions?.useMutation !== void 0) isMutation = operationQueryOptions.useMutation;
	if (verb !== Verbs.GET && isQuery) isMutation = false;
	if (verb === Verbs.GET && isMutation) isQuery = false;
	const conflictWarning = getMutationInvalidatesConflictWarning({
		operationName,
		isMutation,
		isQuery,
		mutationInvalidates: override.query.mutationInvalidates
	});
	if (conflictWarning) logWarning(conflictWarning);
	if (isQuery) {
		const queryKeyMutator = query.queryKey ? await generateMutator({
			output,
			mutator: query.queryKey,
			name: `${operationName}QueryKey`,
			workspace: context.workspace,
			tsconfig: context.output.tsconfig
		}) : void 0;
		const queryOptionsMutator = query.queryOptions ? await generateMutator({
			output,
			mutator: query.queryOptions,
			name: `${operationName}QueryOptions`,
			workspace: context.workspace,
			tsconfig: context.output.tsconfig
		}) : void 0;
		const queryProperties = props.map((param) => {
			return adapter.getQueryPropertyForProp(param, body);
		}).join(",");
		const queryKeyProperties = props.filter((prop) => prop.type !== GetterPropType.HEADER).map((param) => {
			return adapter.getQueryPropertyForProp(param, body);
		}).join(",");
		const queries = [
			...query.useInfinite || operationQueryOptions?.useInfinite ? [{
				name: camel(`${operationName}-infinite`),
				options: query.options,
				type: QueryType.INFINITE,
				queryParam: query.useInfiniteQueryParam,
				queryKeyFnName: camel(`get-${operationName}-infinite-query-key`)
			}] : [],
			...query.useQuery || operationQueryOptions?.useQuery ? [{
				name: operationName,
				options: query.options,
				type: QueryType.QUERY,
				queryKeyFnName: camel(`get-${operationName}-query-key`)
			}] : [],
			...query.useSuspenseQuery || operationQueryOptions?.useSuspenseQuery ? [{
				name: camel(`${operationName}-suspense`),
				options: query.options,
				type: QueryType.SUSPENSE_QUERY,
				queryKeyFnName: camel(`get-${operationName}-query-key`)
			}] : [],
			...query.useSuspenseInfiniteQuery || operationQueryOptions?.useSuspenseInfiniteQuery ? [{
				name: camel(`${operationName}-suspense-infinite`),
				options: query.options,
				type: QueryType.SUSPENSE_INFINITE,
				queryParam: query.useInfiniteQueryParam,
				queryKeyFnName: camel(`get-${operationName}-infinite-query-key`)
			}] : []
		];
		const uniqueQueryOptionsByKeys = queries.filter((obj, index, self) => index === self.findIndex((t) => t.queryKeyFnName === obj.queryKeyFnName));
		let queryKeyFns = "";
		if (!queryKeyMutator) for (const queryOption of uniqueQueryOptionsByKeys) {
			const makeOptionalParam = (impl) => {
				if (impl.includes("=")) return impl;
				return impl.replace(/^(\w+):\s*/, "$1?: ");
			};
			const queryKeyProps = toObjectString(props.filter((prop) => prop.type !== GetterPropType.HEADER).map((prop) => ({
				...prop,
				implementation: prop.type === GetterPropType.PARAM || prop.type === GetterPropType.NAMED_PATH_PARAMS ? prop.implementation : makeOptionalParam(prop.implementation)
			})), "implementation");
			const routeString = adapter.getQueryKeyRouteString(route, !!override.query.shouldSplitQueryKey);
			const queryKeyIdentifier = override.query.useOperationIdAsQueryKey ? `"${operationName}"` : routeString;
			const queryKeyParams = props.filter((p) => override.query.useOperationIdAsQueryKey ? true : p.type === GetterPropType.QUERY_PARAM).toSorted((a) => a.required ? -1 : 1).map((p) => `...(${p.name} ? [${p.name}] : [])`).join(", ");
			queryKeyFns += `
${override.query.shouldExportQueryKey ? "export " : ""}const ${queryOption.queryKeyFnName} = (${queryKeyProps}) => {
    return [
    ${[
				queryOption.type === QueryType.INFINITE || queryOption.type === QueryType.SUSPENSE_INFINITE ? `'infinite'` : "",
				queryKeyIdentifier,
				queryKeyParams,
				body.implementation
			].filter((x) => !!x).join(", ")}
    ] as const;
    }
`;
		}
		implementation += `
${queryKeyFns}`;
		let queryImplementations = "";
		for (const queryOption of queries) queryImplementations += generateQueryImplementation({
			queryOption,
			operationName,
			queryProperties,
			queryKeyProperties,
			params,
			props,
			mutator,
			isRequestOptions,
			queryParams,
			response,
			httpClient,
			isExactOptionalPropertyTypes,
			hasSignal: getHasSignal({ overrideQuerySignal: override.query.signal }),
			useRuntimeFetcher: override.fetch.useRuntimeFetcher,
			queryOptionsMutator,
			queryKeyMutator,
			route,
			doc,
			usePrefetch: query.usePrefetch,
			useQuery: query.useQuery,
			useInfinite: query.useInfinite,
			useInvalidate: query.useInvalidate,
			useSetQueryData: operationQueryOptions?.useSetQueryData ?? query.useSetQueryData,
			useGetQueryData: operationQueryOptions?.useGetQueryData ?? query.useGetQueryData,
			adapter
		});
		implementation += `
    ${queryImplementations}
`;
		mutators = queryOptionsMutator || queryKeyMutator ? [...queryOptionsMutator ? [queryOptionsMutator] : [], ...queryKeyMutator ? [queryKeyMutator] : []] : void 0;
	}
	let imports = [];
	if (isMutation) {
		const mutationResult = await generateMutationHook({
			verbOptions: {
				...verbOptions,
				props
			},
			options,
			isRequestOptions,
			httpClient,
			doc,
			adapter
		});
		implementation += mutationResult.implementation;
		mutators = mutationResult.mutators ? [...mutators ?? [], ...mutationResult.mutators] : mutators;
		imports = mutationResult.imports;
	}
	return {
		implementation,
		mutators,
		imports
	};
};
//#endregion
//#region src/index.ts
const generateQueryHeader = (params) => {
	return `${params.hasAwaitedType ? "" : `type AwaitedInput<T> = PromiseLike<T> | T;\n
      type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;\n\n`}
${params.isRequestOptions && params.isMutator ? `type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];\n\n` : ""}
${getQueryHeader(params)}
`;
};
const generateQuery = async (verbOptions, options, outputClient) => {
	const isZodOutput = typeof options.context.output.schemas === "object" && options.context.output.schemas.type === "zod";
	const responseType = verbOptions.response.definition.success;
	const isPrimitiveResponse = [
		"string",
		"number",
		"boolean",
		"void",
		"unknown"
	].includes(responseType);
	const normalizedVerbOptions = verbOptions.override.query.runtimeValidation && isZodOutput && !isPrimitiveResponse && verbOptions.response.imports.some((imp) => imp.name === responseType) ? {
		...verbOptions,
		response: {
			...verbOptions.response,
			imports: verbOptions.response.imports.map((imp) => imp.name === responseType ? {
				...imp,
				values: true
			} : imp)
		}
	} : verbOptions;
	const adapter = createFrameworkAdapter({
		outputClient,
		packageJson: options.context.output.packageJson,
		queryVersion: normalizedVerbOptions.override.query.version
	});
	const imports = generateVerbImports(normalizedVerbOptions);
	const functionImplementation = adapter.generateRequestFunction(normalizedVerbOptions, options);
	const { implementation: hookImplementation, imports: hookImports, mutators } = await generateQueryHook(normalizedVerbOptions, options, outputClient, adapter);
	const isFetchHttpClient = options.context.output.httpClient !== OutputHttpClient.AXIOS;
	return {
		implementation: `${functionImplementation}\n\n${hookImplementation}`,
		imports: [...imports, ...hookImports],
		mutators,
		...isFetchHttpClient && { docComment: "" }
	};
};
const dependenciesBuilder = {
	"react-query": getReactQueryDependencies,
	"vue-query": getVueQueryDependencies,
	"svelte-query": getSvelteQueryDependencies,
	"angular-query": getAngularQueryDependencies,
	"solid-query": getSolidQueryDependencies
};
const builder = ({ type = "react-query", options: queryOptions, output } = {}) => () => {
	const client = (verbOptions, options, outputClient) => {
		if (options.override.useNamedParameters && (type === "vue-query" || outputClient === "vue-query")) throw new Error(`vue-query client does not support named parameters, and had broken reactivity previously, please set useNamedParameters to false; See for context: https://github.com/orval-labs/orval/pull/931#issuecomment-1752355686`);
		if (queryOptions) {
			const normalizedQueryOptions = normalizeQueryOptions(queryOptions, options.context.workspace);
			verbOptions.override.query = mergeDeep(normalizedQueryOptions, verbOptions.override.query);
			options.override.query = mergeDeep(normalizedQueryOptions, verbOptions.override.query);
		}
		return generateQuery(verbOptions, options, outputClient, output);
	};
	return {
		client,
		header: generateQueryHeader,
		dependencies: dependenciesBuilder[type]
	};
};
//#endregion
export { builder, builder as default, generateQuery, generateQueryHeader, getAngularQueryDependencies, getReactQueryDependencies, getSolidQueryDependencies, getSvelteQueryDependencies, getVueQueryDependencies };

//# sourceMappingURL=index.mjs.map