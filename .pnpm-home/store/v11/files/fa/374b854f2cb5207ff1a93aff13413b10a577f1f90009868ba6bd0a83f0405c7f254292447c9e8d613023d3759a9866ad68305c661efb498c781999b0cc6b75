import { GetterPropType, OutputHttpClient, Verbs, camel, generateFormDataAndUrlEncodedFunction, generateMutatorConfig, generateMutatorRequestOptions, generateOptions, generateVerbImports, isSyntheticDefaultImportsAllow, jsDoc, pascal, stringify, toObjectString } from "@orval/core";
import { fetchResponseTypeName, generateFetchHeader, generateRequestFunction } from "@orval/fetch";
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
const generateSwrRequestFunction = (verbOptions, options) => {
	return options.context.output.httpClient === OutputHttpClient.AXIOS ? generateAxiosRequestFunction(verbOptions, options) : generateRequestFunction(verbOptions, options);
};
const generateAxiosRequestFunction = ({ headers, queryParams, operationName, response, mutator, body, props, verb, formData, formUrlEncoded, override, paramsSerializer }, { route, context }) => {
	const isRequestOptions = override.requestOptions !== false;
	const isFormData = !override.formData.disabled;
	const isFormUrlEncoded = override.formUrlEncoded !== false;
	const isExactOptionalPropertyTypes = !!context.output.tsconfig?.compilerOptions?.exactOptionalPropertyTypes;
	const isSyntheticDefaultImportsAllowed = isSyntheticDefaultImportsAllow(context.output.tsconfig);
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
			hasSignal: false,
			isExactOptionalPropertyTypes
		});
		const propsImplementation = mutator.bodyTypeName && body.definition ? toObjectString(props, "implementation").replace(new RegExp(String.raw`(\w*):\s?${body.definition}`), `$1: ${mutator.bodyTypeName}<${body.definition}>`) : toObjectString(props, "implementation");
		const requestOptions = isRequestOptions ? generateMutatorRequestOptions(override.requestOptions, mutator.hasSecondArg) : "";
		return `export const ${operationName} = (\n    ${propsImplementation}\n ${isRequestOptions && mutator.hasSecondArg ? `options${context.output.optionsParamRequired ? "" : "?"}: SecondParameter<typeof ${mutator.name}>` : ""}) => {${bodyForm}
    return ${mutator.name}<${response.definition.success || "unknown"}>(
    ${mutatorConfig},
    ${requestOptions});
  }
`;
	}
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
		hasSignal: false
	});
	return `export const ${operationName} = (\n    ${toObjectString(props, "implementation")} ${isRequestOptions ? `options?: AxiosRequestConfig\n` : ""} ): Promise<AxiosResponse<${response.definition.success || "unknown"}>> => {${bodyForm}
    return axios${isSyntheticDefaultImportsAllowed ? "" : ".default"}.${verb}(${options});
  }
`;
};
const getSwrRequestOptions = (httpClient, mutator) => {
	if (!mutator) return httpClient === OutputHttpClient.AXIOS ? "axios?: AxiosRequestConfig" : "fetch?: RequestInit";
	else if (mutator.hasSecondArg) return `request?: SecondParameter<typeof ${mutator.name}>`;
	else return "";
};
const getSwrErrorType = (response, httpClient, mutator) => {
	if (mutator) return mutator.hasErrorType ? `ErrorType<${response.definition.errors || "unknown"}>` : response.definition.errors || "unknown";
	else return `${httpClient === OutputHttpClient.AXIOS ? "AxiosError" : "Promise"}<${response.definition.errors || "unknown"}>`;
};
const getSwrRequestSecondArg = (httpClient, mutator) => {
	if (!mutator) return httpClient === OutputHttpClient.AXIOS ? "axios: axiosOptions" : "fetch: fetchOptions";
	else if (mutator.hasSecondArg) return "request: requestOptions";
	else return "";
};
const getHttpRequestSecondArg = (httpClient, mutator) => {
	if (!mutator) return httpClient === OutputHttpClient.AXIOS ? `axiosOptions` : `fetchOptions`;
	else if (mutator.hasSecondArg) return "requestOptions";
	else return "";
};
const getSwrMutationFetcherOptionType = (httpClient, mutator) => {
	if (!mutator) return httpClient === OutputHttpClient.AXIOS ? "AxiosRequestConfig" : "RequestInit";
	else if (mutator.hasSecondArg) return `SecondParameter<typeof ${mutator.name}>`;
	else return "";
};
const getSwrMutationFetcherType = (response, httpClient, includeHttpResponseReturnType, operationName, mutator) => {
	if (httpClient === OutputHttpClient.FETCH) return `Promise<${fetchResponseTypeName(includeHttpResponseReturnType, response.definition.success, operationName)}>`;
	else if (mutator) return `Promise<${response.definition.success || "unknown"}>`;
	else return `Promise<AxiosResponse<${response.definition.success || "unknown"}>>`;
};
const getSwrHeader = (params) => {
	return params.output.httpClient === OutputHttpClient.FETCH ? generateFetchHeader(params) : "";
};
//#endregion
//#region src/index.ts
const PARAMS_SERIALIZER_DEPENDENCIES = [{
	exports: [{
		name: "qs",
		default: true,
		values: true,
		syntheticDefaultImport: true
	}],
	dependency: "qs"
}];
const SWR_DEPENDENCIES = [{
	exports: [
		{
			name: "useSwr",
			values: true,
			default: true
		},
		{ name: "SWRConfiguration" },
		{ name: "Key" },
		{ name: "Arguments" }
	],
	dependency: "swr"
}];
const SWR_INFINITE_DEPENDENCIES = [{
	exports: [
		{
			name: "useSWRInfinite",
			values: true,
			default: true
		},
		{ name: "SWRInfiniteConfiguration" },
		{ name: "SWRInfiniteKeyLoader" }
	],
	dependency: "swr/infinite"
}];
const SWR_MUTATION_DEPENDENCIES = [{
	exports: [
		{
			name: "useSWRMutation",
			values: true,
			default: true
		},
		{ name: "SWRMutationConfiguration" },
		{ name: "SWRMutationKey" }
	],
	dependency: "swr/mutation"
}];
const getSwrDependencies = (hasGlobalMutator, hasParamsSerializerOptions, _packageJson, httpClient) => [
	...!hasGlobalMutator && httpClient === OutputHttpClient.AXIOS ? AXIOS_DEPENDENCIES : [],
	...hasParamsSerializerOptions ? PARAMS_SERIALIZER_DEPENDENCIES : [],
	...SWR_DEPENDENCIES,
	...SWR_INFINITE_DEPENDENCIES,
	...SWR_MUTATION_DEPENDENCIES
];
const generateSwrArguments = ({ operationName, mutator, isRequestOptions, isInfinite, httpClient }) => {
	const definition = `${isInfinite ? "SWRInfiniteConfiguration" : "SWRConfiguration"}<Awaited<ReturnType<typeof ${operationName}>>, TError> & ${isInfinite ? "{ swrKeyLoader?: SWRInfiniteKeyLoader, enabled?: boolean }" : "{ swrKey?: Key, enabled?: boolean }"}`;
	if (!isRequestOptions) return `swrOptions?: ${definition}`;
	return `options?: { swr?:${definition}, ${getSwrRequestOptions(httpClient, mutator)} }\n`;
};
const generateSwrMutationArguments = ({ operationName, isRequestOptions, mutator, swrBodyType, httpClient }) => {
	const definition = `SWRMutationConfiguration<Awaited<ReturnType<typeof ${operationName}>>, TError, Key, ${swrBodyType}, Awaited<ReturnType<typeof ${operationName}>>> & { swrKey?: string }`;
	if (!isRequestOptions) return `swrOptions?: ${definition}`;
	return `options?: { swr?:${definition}, ${getSwrRequestOptions(httpClient, mutator)}}\n`;
};
const generateSwrImplementation = ({ operationName, swrKeyFnName, swrKeyLoaderFnName, swrProperties, swrKeyProperties, params, mutator, isRequestOptions, response, swrOptions, props, doc, httpClient, pathOnlyParams, headerOnlyParams, hasQueryParams, queryParamType }) => {
	const swrProps = toObjectString(props, "implementation");
	const queryResultVarName = props.some((prop) => prop.name === "query") ? "_query" : "query";
	const httpFunctionProps = swrProperties;
	const enabledImplementation = `const isEnabled = swrOptions?.enabled !== false${params.length > 0 ? ` && !!(${params.map(({ name }) => name).join(" && ")})` : ""}`;
	const swrKeyImplementation = `const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? ${swrKeyFnName}(${swrKeyProperties}) : null);`;
	const swrKeyLoaderImplementation = `const swrKeyLoader = swrOptions?.swrKeyLoader ?? (isEnabled ? ${swrKeyLoaderFnName}(${swrKeyProperties}) : () => null);`;
	const errorType = getSwrErrorType(response, httpClient, mutator);
	const swrRequestSecondArg = getSwrRequestSecondArg(httpClient, mutator);
	const httpRequestSecondArg = getHttpRequestSecondArg(httpClient, mutator);
	const errorTypeExport = swrOptions.generateErrorTypes ? `export type ${pascal(operationName)}InfiniteError = ${errorType}\n` : "";
	const useSWRInfiniteImplementation = swrOptions.useInfinite ? `
export type ${pascal(operationName)}InfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof ${operationName}>>>
${errorTypeExport}
${doc}export const ${camel(`use-${operationName}-infinite`)} = <TError = ${errorType}>(
  ${swrProps} ${generateSwrArguments({
		operationName,
		mutator,
		isRequestOptions,
		isInfinite: true,
		httpClient
	})}) => {
  ${isRequestOptions ? `const {swr: swrOptions${swrRequestSecondArg ? `, ${swrRequestSecondArg}` : ""}} = options ?? {}` : ""}

  ${enabledImplementation}
  ${swrKeyLoaderImplementation}
  const swrFn = ${hasQueryParams ? `([_url, pageParams]: [string, ${queryParamType} & { page: number }]) => ${operationName}(${pathOnlyParams}${pathOnlyParams ? ", " : ""}pageParams${headerOnlyParams ? ", " + headerOnlyParams : ""}${httpRequestSecondArg ? ", " + httpRequestSecondArg : ""})` : `([_url]: [string]) => ${operationName}(${pathOnlyParams}${headerOnlyParams ? (pathOnlyParams ? ", " : "") + headerOnlyParams : ""}${httpRequestSecondArg ? (pathOnlyParams || headerOnlyParams ? ", " : "") + httpRequestSecondArg : ""})`}

  const ${queryResultVarName} = useSWRInfinite<Awaited<ReturnType<typeof swrFn>>, TError>(swrKeyLoader, swrFn, ${swrOptions.swrInfiniteOptions ? `{
    ${stringify(swrOptions.swrInfiniteOptions)?.slice(1, -1)}
    ...swrOptions
  }` : "swrOptions"})

  return {
    swrKeyLoader,
    ...${queryResultVarName}
  }
}\n` : "";
	const queryErrorTypeExport = swrOptions.generateErrorTypes ? `export type ${pascal(operationName)}QueryError = ${errorType}\n` : "";
	return useSWRInfiniteImplementation + `
export type ${pascal(operationName)}QueryResult = NonNullable<Awaited<ReturnType<typeof ${operationName}>>>
${queryErrorTypeExport}
${doc}export const ${camel(`use-${operationName}`)} = <TError = ${errorType}>(
  ${swrProps} ${generateSwrArguments({
		operationName,
		mutator,
		isRequestOptions,
		isInfinite: false,
		httpClient
	})}) => {
  ${isRequestOptions ? `const {swr: swrOptions${swrRequestSecondArg ? `, ${swrRequestSecondArg}` : ""}} = options ?? {}` : ""}

  ${enabledImplementation}
  ${swrKeyImplementation}
  const swrFn = () => ${operationName}(${httpFunctionProps}${httpFunctionProps && httpRequestSecondArg ? ", " : ""}${httpRequestSecondArg})

  const ${queryResultVarName} = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, ${swrOptions.swrOptions ? `{
    ${stringify(swrOptions.swrOptions)?.slice(1, -1)}
    ...swrOptions
  }` : "swrOptions"})

  return {
    swrKey,
    ...${queryResultVarName}
  }
}\n`;
};
const generateSwrSuspenseImplementation = ({ operationName, swrKeyFnName, swrKeyProperties, params, mutator, isRequestOptions, response, swrOptions, props, doc, httpClient, httpFunctionProps }) => {
	const swrProps = toObjectString(props, "implementation");
	const queryResultVarName = props.some((prop) => prop.name === "query") ? "_query" : "query";
	const enabledImplementation = `const isEnabled = swrOptions?.enabled !== false${params.length > 0 ? ` && !!(${params.map(({ name }) => name).join(" && ")})` : ""}`;
	const swrKeyImplementation = `const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? ${swrKeyFnName}(${swrKeyProperties}) : null);`;
	const errorType = getSwrErrorType(response, httpClient, mutator);
	const swrRequestSecondArg = getSwrRequestSecondArg(httpClient, mutator);
	const httpRequestSecondArg = getHttpRequestSecondArg(httpClient, mutator);
	const suspenseErrorTypeExport = swrOptions.generateErrorTypes ? `export type ${pascal(operationName)}SuspenseQueryError = ${errorType}\n` : "";
	return `
export type ${pascal(operationName)}SuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof ${operationName}>>>
${suspenseErrorTypeExport}
${doc}export const ${camel(`use-${operationName}-suspense`)} = <TError = ${errorType}>(
  ${swrProps} ${generateSwrArguments({
		operationName,
		mutator,
		isRequestOptions,
		isInfinite: false,
		httpClient
	})}) => {
  ${isRequestOptions ? `const {swr: swrOptions${swrRequestSecondArg ? `, ${swrRequestSecondArg}` : ""}} = options ?? {}` : ""}

  ${enabledImplementation}
  ${swrKeyImplementation}
  const swrFn = () => ${operationName}(${httpFunctionProps}${httpFunctionProps && httpRequestSecondArg ? ", " : ""}${httpRequestSecondArg})

  const ${queryResultVarName} = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, ${swrOptions.swrOptions ? `{
    ${stringify(swrOptions.swrOptions)?.slice(1, -1)}
    suspense: true,
    ...swrOptions
  }` : "{ suspense: true, ...swrOptions }"})

  return {
    swrKey,
    ...${queryResultVarName},
    data: ${queryResultVarName}.data as NonNullable<typeof ${queryResultVarName}.data>,
  }
}\n`;
};
const generateSwrMutationImplementation = ({ isRequestOptions, operationName, swrKeyFnName, swrMutationFetcherName, swrKeyProperties, swrMutationFetcherProperties, swrProps, props, response, mutator, swrOptions, doc, swrBodyType, httpClient, verb }) => {
	const queryResultVarName = props.some((prop) => prop.name === "query") ? "_query" : "query";
	const swrKeyImplementation = `const swrKey = swrOptions?.swrKey ?? ${swrKeyFnName}(${swrKeyProperties});`;
	const errorType = getSwrErrorType(response, httpClient, mutator);
	const swrRequestSecondArg = getSwrRequestSecondArg(httpClient, mutator);
	const httpRequestSecondArg = getHttpRequestSecondArg(httpClient, mutator);
	const mutationErrorTypeExport = swrOptions.generateErrorTypes ? `export type ${pascal(operationName)}MutationError = ${errorType}\n` : "";
	return `
export type ${pascal(operationName)}MutationResult = NonNullable<Awaited<ReturnType<typeof ${operationName}>>>
${mutationErrorTypeExport}
${doc}export const ${camel(`use-${operationName}${verb === Verbs.GET ? "-mutation" : ""}`)} = <TError = ${errorType}>(
  ${swrProps} ${generateSwrMutationArguments({
		operationName,
		isRequestOptions,
		mutator,
		swrBodyType,
		httpClient
	})}) => {

  ${isRequestOptions ? `const {swr: swrOptions${swrRequestSecondArg ? `, ${swrRequestSecondArg}` : ""}} = options ?? {}` : ""}

  ${swrKeyImplementation}
  const swrFn = ${swrMutationFetcherName}(${swrMutationFetcherProperties}${swrMutationFetcherProperties && httpRequestSecondArg ? ", " : ""}${httpRequestSecondArg});

  const ${queryResultVarName} = useSWRMutation(swrKey, swrFn, ${swrOptions.swrMutationOptions ? `{
    ${stringify(swrOptions.swrMutationOptions)?.slice(1, -1)}
    ...swrOptions
  }` : "swrOptions"})

  return {
    swrKey,
    ...${queryResultVarName}
  }
}\n`;
};
const generateSwrHook = ({ queryParams, operationName, body, props, verb, params, override, mutator, response, summary, deprecated }, { route, context }) => {
	const isRequestOptions = override.requestOptions !== false;
	const httpClient = context.output.httpClient;
	const doc = jsDoc({
		summary,
		deprecated
	});
	const queryKeyProps = toObjectString(props.filter((prop) => prop.type === GetterPropType.PARAM || prop.type === GetterPropType.NAMED_PATH_PARAMS || prop.type === GetterPropType.QUERY_PARAM), "implementation");
	const swrProps = toObjectString(props.filter((prop) => prop.type === GetterPropType.PARAM || prop.type === GetterPropType.QUERY_PARAM || prop.type === GetterPropType.NAMED_PATH_PARAMS || prop.type === GetterPropType.HEADER), "implementation");
	const swrMutationFetcherProperties = props.filter((prop) => prop.type === GetterPropType.PARAM || prop.type === GetterPropType.QUERY_PARAM || prop.type === GetterPropType.NAMED_PATH_PARAMS || prop.type === GetterPropType.HEADER).map((param) => {
		return param.type === GetterPropType.NAMED_PATH_PARAMS ? param.destructured : param.name;
	}).join(",");
	const swrKeyProperties = props.filter((prop) => prop.type === GetterPropType.PARAM || prop.type === GetterPropType.NAMED_PATH_PARAMS || prop.type === GetterPropType.QUERY_PARAM).map((prop) => {
		return prop.type === GetterPropType.NAMED_PATH_PARAMS ? prop.destructured : prop.name;
	}).join(",");
	const swrMutationFetcherName = camel(`get-${operationName}-mutation-fetcher`);
	if (verb === Verbs.GET) {
		const swrKeyProperties = props.filter((prop) => prop.type !== GetterPropType.HEADER).map((param) => {
			if (param.type === GetterPropType.NAMED_PATH_PARAMS) return param.destructured;
			return param.type === GetterPropType.BODY ? body.implementation : param.name;
		}).join(",");
		const swrProperties = props.map((param) => {
			if (param.type === GetterPropType.NAMED_PATH_PARAMS) return param.destructured;
			return param.type === GetterPropType.BODY ? body.implementation : param.name;
		}).join(",");
		const pathOnlyParams = props.filter((prop) => prop.type === GetterPropType.PARAM || prop.type === GetterPropType.NAMED_PATH_PARAMS).map((param) => {
			return param.type === GetterPropType.NAMED_PATH_PARAMS ? param.destructured : param.name;
		}).join(",");
		const headerOnlyParams = props.filter((prop) => prop.type === GetterPropType.HEADER).map((param) => param.name).join(",");
		const hasQueryParams = props.some((prop) => prop.type === GetterPropType.QUERY_PARAM);
		const queryParamType = props.find((prop) => prop.type === GetterPropType.QUERY_PARAM)?.definition.split(": ")[1] ?? "never";
		const queryKeyProps = toObjectString(props.filter((prop) => prop.type !== GetterPropType.HEADER), "implementation");
		const swrKeyFnName = camel(`get-${operationName}-key`);
		const swrKeyFn = `
export const ${swrKeyFnName} = (${queryKeyProps}) => [\`${route}\`${queryParams ? ", ...(params ? [params]: [])" : ""}] as const;
`;
		const swrKeyLoaderFnName = camel(`get-${operationName}-infinite-key-loader`);
		const swrKeyLoader = override.swr.useInfinite ? `export const ${swrKeyLoaderFnName} = (${queryKeyProps}) => {
  return (page: number, previousPageData?: Awaited<ReturnType<typeof ${operationName}>>) => {
    if (previousPageData) {
      const responseData = previousPageData.data
      if (!responseData) return null

      // Direct array response (e.g., API returns Pet[]) - stop when empty
      if (Array.isArray(responseData) && responseData.length === 0) return null

      // Wrapped response with data array (e.g., { data: Pet[], ... }) - stop when nested array is empty
      if (typeof responseData === 'object' && 'data' in responseData) {
        if (Array.isArray(responseData.data) && responseData.data.length === 0) return null
      }

      // Single object response (non-paginated endpoint) - stop after first page
      if (!Array.isArray(responseData) && !(typeof responseData === 'object' && 'data' in responseData)) return null
    }

    return [\`${route}\`${queryParams ? ", ...(params ? [{...params,page}]: [{page}])" : ""}${body.implementation ? `, ${body.implementation}` : ""}] as const;
  }
}\n` : "";
		const swrImplementation = generateSwrImplementation({
			operationName,
			swrKeyFnName,
			swrKeyLoaderFnName,
			swrProperties,
			swrKeyProperties,
			params,
			props,
			mutator,
			isRequestOptions,
			response,
			swrOptions: override.swr,
			doc,
			httpClient,
			pathOnlyParams,
			headerOnlyParams,
			hasQueryParams,
			queryParamType
		});
		const swrSuspenseImplementation = override.swr.useSuspense ? generateSwrSuspenseImplementation({
			operationName,
			swrKeyFnName,
			swrKeyProperties,
			params,
			props,
			mutator,
			isRequestOptions,
			response,
			swrOptions: override.swr,
			doc,
			httpClient,
			httpFunctionProps: swrProperties
		}) : "";
		if (!override.swr.useSWRMutationForGet) return swrKeyFn + swrKeyLoader + swrImplementation + swrSuspenseImplementation;
		const httpFnPropertiesForGet = [props.filter((prop) => prop.type !== GetterPropType.HEADER).map((prop) => {
			return prop.type === GetterPropType.NAMED_PATH_PARAMS ? prop.destructured : prop.name;
		}).join(", "), props.filter((prop) => prop.type === GetterPropType.HEADER).map((param) => param.name).join(", ")].filter(Boolean).join(", ");
		const swrMutationFetcherType = getSwrMutationFetcherType(response, httpClient, override.fetch.includeHttpResponseReturnType, operationName, mutator);
		const swrMutationFetcherOptionType = getSwrMutationFetcherOptionType(httpClient, mutator);
		const swrMutationFetcherOptions = isRequestOptions && swrMutationFetcherOptionType ? `options${context.output.optionsParamRequired ? "" : "?"}: ${swrMutationFetcherOptionType}` : "";
		const swrMutationFetcherFn = `
export const ${swrMutationFetcherName} = (${queryKeyProps} ${swrMutationFetcherOptions}) => {
  return (_: Key, __: { arg?: never }): ${swrMutationFetcherType} => {
    return ${operationName}(${httpFnPropertiesForGet}${swrMutationFetcherOptions.length > 0 ? (httpFnPropertiesForGet.length > 0 ? ", " : "") + "options" : ""});
  }
}
`;
		const swrMutationImplementation = generateSwrMutationImplementation({
			operationName,
			swrKeyFnName,
			swrMutationFetcherName,
			swrKeyProperties,
			swrMutationFetcherProperties,
			swrProps,
			props,
			isRequestOptions,
			response,
			mutator,
			swrOptions: override.swr,
			doc,
			swrBodyType: "never",
			httpClient,
			verb: Verbs.GET
		});
		return swrKeyFn + swrKeyLoader + swrImplementation + swrSuspenseImplementation + swrMutationFetcherFn + swrMutationImplementation;
	} else {
		const httpFnProperties = [props.filter((prop) => prop.type !== GetterPropType.HEADER).map((prop) => {
			if (prop.type === GetterPropType.NAMED_PATH_PARAMS) return prop.destructured;
			else if (prop.type === GetterPropType.BODY) return `arg`;
			else return prop.name;
		}).join(", "), props.filter((prop) => prop.type === GetterPropType.HEADER).map((param) => param.name).join(", ")].filter(Boolean).join(", ");
		const swrKeyFnName = camel(`get-${operationName}-mutation-key`);
		const swrMutationKeyFn = `export const ${swrKeyFnName} = (${queryKeyProps}) => [\`${route}\`${queryParams ? ", ...(params ? [params]: [])" : ""}] as const;
`;
		const swrMutationFetcherOptionType = getSwrMutationFetcherOptionType(httpClient, mutator);
		const swrMutationFetcherOptions = isRequestOptions && swrMutationFetcherOptionType ? `options${context.output.optionsParamRequired ? "" : "?"}: ${swrMutationFetcherOptionType}` : "";
		const swrMutationFetcherArg = props.some((prop) => prop.type === GetterPropType.BODY) ? "{ arg }" : "__";
		const bodyProp = props.find((prop) => prop.type === GetterPropType.BODY);
		const baseSwrBodyType = bodyProp?.implementation.split(": ")[1] ?? "Arguments";
		const swrBodyType = bodyProp && !bodyProp.required ? `${baseSwrBodyType} | undefined` : baseSwrBodyType;
		const swrMutationFetcherFn = `
export const ${swrMutationFetcherName} = (${swrProps} ${swrMutationFetcherOptions}) => {
  return (_: Key, ${swrMutationFetcherArg}: { arg: ${swrBodyType} }) => {
    return ${operationName}(${httpFnProperties}${swrMutationFetcherOptions.length > 0 ? (httpFnProperties.length > 0 ? ", " : "") + "options" : ""});
  }
}\n`;
		const swrImplementation = generateSwrMutationImplementation({
			operationName,
			swrKeyFnName,
			swrMutationFetcherName,
			swrKeyProperties,
			swrMutationFetcherProperties,
			swrProps,
			props,
			isRequestOptions,
			response,
			mutator,
			swrOptions: override.swr,
			doc,
			swrBodyType,
			httpClient: context.output.httpClient
		});
		return swrMutationFetcherFn + swrMutationKeyFn + swrImplementation;
	}
};
const generateSwrHeader = (params) => `
  ${params.hasAwaitedType ? "" : `type AwaitedInput<T> = PromiseLike<T> | T;\n
      type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;\n\n`}
  ${params.isRequestOptions && params.isMutator ? `type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];\n\n` : ""}
  ${getSwrHeader(params)}
`;
const generateSwr = (verbOptions, options) => {
	const imports = generateVerbImports(verbOptions);
	const functionImplementation = generateSwrRequestFunction(verbOptions, options);
	const hookImplementation = generateSwrHook(verbOptions, options);
	const isFetchHttpClient = options.context.output.httpClient !== OutputHttpClient.AXIOS;
	return {
		implementation: `${functionImplementation}\n\n${hookImplementation}`,
		imports,
		...isFetchHttpClient && { docComment: "" }
	};
};
const swrClientBuilder = {
	client: generateSwr,
	header: generateSwrHeader,
	dependencies: getSwrDependencies
};
const builder = () => () => swrClientBuilder;
//#endregion
export { builder, builder as default, generateSwr, generateSwrHeader, getSwrDependencies };

//# sourceMappingURL=index.mjs.map