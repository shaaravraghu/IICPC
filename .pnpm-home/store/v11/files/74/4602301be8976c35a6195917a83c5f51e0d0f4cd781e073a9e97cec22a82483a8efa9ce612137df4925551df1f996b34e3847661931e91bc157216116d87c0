import { generateFormDataAndUrlEncodedFunction, generateMutatorConfig, generateMutatorRequestOptions, generateOptions, generateVerbImports, isSyntheticDefaultImportsAllow, pascal, sanitize, toObjectString } from "@orval/core";
//#region src/index.ts
const AXIOS_DEPENDENCIES = [{
	exports: [
		{
			name: "axios",
			default: true,
			values: true,
			syntheticDefaultImport: true
		},
		{ name: "AxiosRequestConfig" },
		{ name: "AxiosResponse" }
	],
	dependency: "axios"
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
const returnTypesToWrite = /* @__PURE__ */ new Map();
const getAxiosDependencies = (hasGlobalMutator, hasParamsSerializerOptions) => [...hasGlobalMutator ? [] : AXIOS_DEPENDENCIES, ...hasParamsSerializerOptions ? PARAMS_SERIALIZER_DEPENDENCIES : []];
const getAxiosFactoryDependencies = (hasGlobalMutator, hasParamsSerializerOptions, _packageJson, _httpClient, hasTagsMutator) => [{
	exports: [
		{
			name: "axios",
			default: true,
			values: true,
			syntheticDefaultImport: true
		},
		...!hasGlobalMutator && !hasTagsMutator ? [{ name: "AxiosInstance" }] : [],
		...hasGlobalMutator ? [] : [{ name: "AxiosRequestConfig" }, { name: "AxiosResponse" }]
	],
	dependency: "axios"
}, ...hasParamsSerializerOptions ? PARAMS_SERIALIZER_DEPENDENCIES : []];
const generateAxiosImplementation = ({ headers, queryParams, operationName, response, mutator, body, props, verb, override, formData, formUrlEncoded, paramsSerializer }, { route, context }, isFactoryMode = false) => {
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
		const requestOptions = isRequestOptions ? generateMutatorRequestOptions(override.requestOptions, mutator.hasSecondArg) : "";
		returnTypesToWrite.set(operationName, (title) => `export type ${pascal(operationName)}Result = NonNullable<Awaited<ReturnType<${title ? `ReturnType<typeof ${title}>['${operationName}']` : `typeof ${operationName}`}>>>`);
		return `const ${operationName} = (\n    ${mutator.bodyTypeName && body.definition ? toObjectString(props, "implementation").replace(new RegExp(String.raw`(\w*):\s?${body.definition}`), `$1: ${mutator.bodyTypeName}<${body.definition}>`) : toObjectString(props, "implementation")}\n ${isRequestOptions && mutator.hasSecondArg ? `options${context.output.optionsParamRequired ? "" : "?"}: SecondParameter<typeof ${mutator.name}<${response.definition.success || "unknown"}>>,` : ""}) => {${bodyForm}
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
	returnTypesToWrite.set(operationName, () => `export type ${pascal(operationName)}Result = AxiosResponse<${response.definition.success || "unknown"}>`);
	const axiosRef = isFactoryMode ? "axiosInstance" : `axios${isSyntheticDefaultImportsAllowed ? "" : ".default"}`;
	return `const ${operationName} = (\n    ${toObjectString(props, "implementation")} ${isRequestOptions ? `options${context.output.optionsParamRequired ? "" : "?"}: AxiosRequestConfig\n` : ""} ): Promise<AxiosResponse<${response.definition.success || "unknown"}>> => {${bodyForm}
    return ${axiosRef}.${verb}(${options});
  }
`;
};
const generateAxiosTitle = (title) => {
	return `get${pascal(sanitize(title))}`;
};
const generateAxiosHeader = ({ title, isRequestOptions, isMutator, isGlobalMutator, noFunction, output, verbOptions }) => {
	const axiosDefault = isSyntheticDefaultImportsAllow(output.tsconfig) ? "axios" : "axios.default";
	const hasAnyMutator = isGlobalMutator || Object.values(verbOptions).some((verbOption) => !!verbOption.mutator);
	return `
${isRequestOptions && isMutator ? `type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];\n\n` : ""}
  ${noFunction ? "" : hasAnyMutator ? `export const ${title} = () => {\n` : `export const ${title} = (axiosInstance: AxiosInstance = ${axiosDefault}) => {\n`}`;
};
const generateAxiosFooter = ({ operationNames, title, noFunction, hasMutator, hasAwaitedType }) => {
	let footer = "";
	if (!noFunction) footer += `return {${operationNames.join(",")}}};\n`;
	if (hasMutator && !hasAwaitedType) footer += `\ntype AwaitedInput<T> = PromiseLike<T> | T;\n
    type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
\n`;
	for (const operationName of operationNames) if (returnTypesToWrite.has(operationName)) {
		const func = returnTypesToWrite.get(operationName);
		footer += func(noFunction ? void 0 : title) + "\n";
	}
	return footer;
};
const generateAxios = (verbOptions, options, isFactoryMode = false) => {
	const imports = generateVerbImports(verbOptions);
	return {
		implementation: generateAxiosImplementation(verbOptions, options, isFactoryMode),
		imports
	};
};
const generateAxiosFactory = (verbOptions, options) => {
	const { implementation, imports } = generateAxios(verbOptions, options, true);
	return {
		implementation,
		imports
	};
};
const generateAxiosFunctions = (verbOptions, options) => {
	const { implementation, imports } = generateAxios(verbOptions, options);
	return {
		implementation: "export " + implementation,
		imports
	};
};
const axiosClientBuilder = {
	client: generateAxiosFactory,
	header: generateAxiosHeader,
	dependencies: getAxiosFactoryDependencies,
	footer: generateAxiosFooter,
	title: generateAxiosTitle
};
const axiosFunctionsClientBuilder = {
	client: generateAxiosFunctions,
	header: (options) => generateAxiosHeader({
		...options,
		noFunction: true
	}),
	dependencies: getAxiosDependencies,
	footer: (options) => generateAxiosFooter({
		...options,
		noFunction: true
	}),
	title: generateAxiosTitle
};
const builder = ({ type = "axios-functions" } = {}) => () => {
	if (type === "axios-functions") return axiosFunctionsClientBuilder;
	return axiosClientBuilder;
};
//#endregion
export { builder, builder as default, generateAxios, generateAxiosFactory, generateAxiosFooter, generateAxiosFunctions, generateAxiosHeader, generateAxiosTitle, getAxiosDependencies, getAxiosFactoryDependencies };

//# sourceMappingURL=index.mjs.map