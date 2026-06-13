import { camel, compareVersions, escape, generateMutator, getFormDataFieldFileType, getNumberWord, isBoolean, isNumber, isObject, isString, jsStringEscape, logVerbose, pascal, resolveRef, stringify } from "@orval/core";
import { unique } from "remeda";
//#region src/compatible-v4.ts
const getZodPackageVersion = (packageJson) => {
	return packageJson.resolvedVersions?.zod ?? packageJson.dependencies?.zod ?? packageJson.devDependencies?.zod ?? packageJson.peerDependencies?.zod;
};
const isZodVersionV4 = (packageJson) => {
	const version = getZodPackageVersion(packageJson);
	if (!version) return false;
	const withoutRc = version.split("-")[0];
	return compareVersions(withoutRc, "4.0.0");
};
const getZodDateFormat = (isZodV4) => {
	return isZodV4 ? "iso.date" : "date";
};
const getZodTimeFormat = (isZodV4) => {
	return isZodV4 ? "iso.time" : "time";
};
const getZodDateTimeFormat = (isZodV4) => {
	return isZodV4 ? "iso.datetime" : "datetime";
};
const getParameterFunctions = (isZodV4, strict, parameters) => {
	if (isZodV4 && strict) return [["strictObject", parameters]];
	else return strict ? [["object", parameters], ["strict", void 0]] : [["object", parameters]];
};
const getObjectFunctionName = (isZodV4, strict) => {
	return isZodV4 && strict ? "strictObject" : "object";
};
/**
* Returns the object constructor to use for open/generic objects.
*
* - Zod v4 supports `zod.looseObject({...})` directly.
* - Zod v3 falls back to `zod.object({...})` and is finalized with
*   `.passthrough()` during parsing.
*/
const getLooseObjectFunctionName = (isZodV4) => {
	return isZodV4 ? "looseObject" : "object";
};
//#endregion
//#region src/index.ts
const ZOD_DEPENDENCIES = [{
	exports: [{
		default: false,
		name: "zod",
		syntheticDefaultImport: false,
		namespaceImport: true,
		values: true
	}],
	dependency: "zod"
}];
const getZodDependencies = () => ZOD_DEPENDENCIES;
/**
* values that may appear in "type". Equals SchemaObjectType
*/
const possibleSchemaTypes = new Set([
	"integer",
	"number",
	"string",
	"boolean",
	"object",
	"strictObject",
	"null",
	"array"
]);
const predefinedZodFormats = new Set([
	"date",
	"time",
	"date-time",
	"email",
	"uri",
	"hostname",
	"uuid"
]);
const resolveZodType = (schema) => {
	const schemaTypeValue = schema.type;
	if (Array.isArray(schemaTypeValue)) {
		const nonNullTypes = schemaTypeValue.filter((t) => isString(t)).filter((t) => t !== "null" && possibleSchemaTypes.has(t)).map((t) => t === "integer" ? "number" : t);
		if (nonNullTypes.length > 1) return { multiType: nonNullTypes };
		const type = nonNullTypes[0];
		if (type === "array" && "prefixItems" in schema) return "tuple";
		return type;
	}
	const type = isString(schemaTypeValue) ? schemaTypeValue : void 0;
	if (schema.type === "array" && "prefixItems" in schema) return "tuple";
	switch (type) {
		case "integer": return "number";
		default: return type ?? "unknown";
	}
};
const COERCIBLE_TYPES = new Set([
	"string",
	"number",
	"boolean",
	"bigint",
	"date"
]);
const minAndMaxTypes = new Set([
	"number",
	"string",
	"array"
]);
const removeReadOnlyProperties = (schema) => {
	if (schema.properties && isObject(schema.properties)) {
		const filteredProperties = {};
		for (const [key, value] of Object.entries(schema.properties)) {
			if (isObject(value) && "readOnly" in value && value.readOnly) continue;
			filteredProperties[key] = value;
		}
		return {
			...schema,
			properties: filteredProperties
		};
	}
	if (schema.items && isObject(schema.items) && "properties" in schema.items) return {
		...schema,
		items: removeReadOnlyProperties(schema.items)
	};
	return schema;
};
const generateZodValidationSchemaDefinition = (schema, context, name, strict, isZodV4, rules) => {
	if (!schema) return {
		functions: [],
		consts: []
	};
	const consts = [];
	const constNameRegistry = rules?.constNameRegistry ?? {};
	const constsCounter = isNumber(constNameRegistry[name]) ? constNameRegistry[name] + 1 : 0;
	const constsCounterValue = constsCounter ? pascal(getNumberWord(constsCounter)) : "";
	constNameRegistry[name] = constsCounter;
	const functions = [];
	const type = resolveZodType(schema);
	const required = rules?.required ?? false;
	const hasDefault = schema.default !== void 0;
	const nullable = "nullable" in schema && schema.nullable || Array.isArray(schema.type) && schema.type.includes("null");
	const min = schema.minimum ?? schema.minLength ?? schema.minItems;
	const max = schema.maximum ?? schema.maxLength ?? schema.maxItems;
	const exclusiveMinRaw = "exclusiveMinimum" in schema ? schema.exclusiveMinimum : void 0;
	const exclusiveMaxRaw = "exclusiveMaximum" in schema ? schema.exclusiveMaximum : void 0;
	const exclusiveMin = isBoolean(exclusiveMinRaw) && exclusiveMinRaw ? min : exclusiveMinRaw;
	const exclusiveMax = isBoolean(exclusiveMaxRaw) && exclusiveMaxRaw ? max : exclusiveMaxRaw;
	const multipleOf = schema.multipleOf;
	const matches = schema.pattern ?? void 0;
	const hasNonArrayEnum = !!schema.enum && type !== "array";
	let skipSwitchStatement = false;
	if (schema.allOf || schema.oneOf || schema.anyOf) {
		const separator = schema.allOf ? "allOf" : schema.oneOf ? "oneOf" : "anyOf";
		const baseSchemas = (schema.allOf ?? schema.oneOf ?? schema.anyOf).map((schema, index) => generateZodValidationSchemaDefinition(schema, context, `${camel(name)}${pascal(getNumberWord(index + 1))}`, strict, isZodV4, {
			required: true,
			constNameRegistry
		}));
		if ((schema.allOf || schema.oneOf || schema.anyOf) && schema.properties) {
			const additionalPropertiesSchema = {
				properties: schema.properties,
				required: schema.required,
				additionalProperties: schema.additionalProperties,
				type: schema.type
			};
			const additionalIndex = baseSchemas.length + 1;
			const additionalPropertiesDefinition = generateZodValidationSchemaDefinition(additionalPropertiesSchema, context, `${camel(name)}${pascal(getNumberWord(additionalIndex))}`, strict, isZodV4, {
				required: true,
				constNameRegistry
			});
			if (schema.oneOf || schema.anyOf) functions.push(["allOf", [{
				functions: [[separator, baseSchemas]],
				consts: []
			}, additionalPropertiesDefinition]]);
			else {
				baseSchemas.push(additionalPropertiesDefinition);
				functions.push([separator, baseSchemas]);
			}
		} else functions.push([separator, baseSchemas]);
		skipSwitchStatement = true;
	}
	let defaultVarName;
	if (schema.default !== void 0) {
		defaultVarName = `${name}Default${constsCounterValue}`;
		let defaultValue;
		if (schema.type === "string" && (schema.format === "date" || schema.format === "date-time") && context.output.override.useDates) defaultValue = `new Date("${escape(schema.default)}")`;
		else if (isObject(schema.default)) defaultValue = `{ ${Object.entries(schema.default).map(([key, value]) => {
			if (isString(value)) return `${key}: "${escape(value)}"`;
			if (Array.isArray(value)) return `${key}: [${value.map((item) => isString(item) ? `"${escape(item)}"` : `${item}`).join(", ")}]`;
			if (value === null || value === void 0 || isNumber(value) || isBoolean(value)) return `${key}: ${value}`;
		}).join(", ")} }`;
		else {
			const rawStringified = stringify(schema.default);
			defaultValue = rawStringified === void 0 ? "null" : rawStringified.replaceAll("'", "`");
			if (Array.isArray(schema.default) && type === "array" && schema.items && "enum" in schema.items && schema.default.length > 0) {
				defaultVarName = defaultValue;
				defaultValue = void 0;
			}
		}
		if (defaultValue) consts.push(`export const ${defaultVarName} = ${defaultValue};`);
	}
	if (isObject(type) && "multiType" in type) {
		const types = type.multiType;
		functions.push(["oneOf", types.map((t) => generateZodValidationSchemaDefinition({
			...schema,
			type: t
		}, context, name, strict, isZodV4, {
			required: true,
			constNameRegistry
		}))]);
		if (!required && nullable) functions.push(["nullish", void 0]);
		else if (nullable) functions.push(["nullable", void 0]);
		else if (!required) functions.push(["optional", void 0]);
		return {
			functions,
			consts
		};
	}
	if (!skipSwitchStatement) switch (type) {
		case "tuple":
			/**
			*
			* > 10.3.1.1. prefixItems
			* > The value of "prefixItems" MUST be a non-empty array of valid JSON Schemas.
			* >
			* > Validation succeeds if each element of the instance validates against the schema at the same position, if any.
			* > This keyword does not constrain the length of the array. If the array is longer than this keyword's value,
			* > this keyword validates only the prefix of matching length.
			* >
			* > This keyword produces an annotation value which is the largest index to which this keyword applied a subschema.
			* > The value MAY be a boolean true if a subschema was applied to every index of the instance, such as is produced by the "items" keyword.
			* > This annotation affects the behavior of "items" and "unevaluatedItems".
			* >
			* > Omitting this keyword has the same assertion behavior as an empty array.
			*/
			if ("prefixItems" in schema) {
				const schema31 = schema;
				const prefixItems = Array.isArray(schema31.prefixItems) ? schema31.prefixItems : [];
				if (prefixItems.length > 0) {
					functions.push(["tuple", prefixItems.map((item, idx) => generateZodValidationSchemaDefinition(dereference(item, context), context, camel(`${name}-${idx}-item`), isZodV4, strict, {
						required: true,
						constNameRegistry
					}))]);
					if (schema.items && (max ?? Number.POSITIVE_INFINITY) > prefixItems.length) functions.push(["rest", generateZodValidationSchemaDefinition(schema.items, context, camel(`${name}-item`), strict, isZodV4, {
						required: true,
						constNameRegistry
					})]);
				}
			}
			break;
		case "array":
			functions.push(["array", generateZodValidationSchemaDefinition(schema.items, context, camel(`${name}-item`), strict, isZodV4, {
				required: true,
				constNameRegistry
			})]);
			break;
		case "string":
			if (schema.enum) break;
			if (context.output.override.useDates && (schema.format === "date" || schema.format === "date-time")) {
				functions.push(["date", void 0]);
				break;
			}
			if (schema.format === "binary") {
				functions.push(["instanceof", "File"]);
				break;
			}
			if (schema.contentMediaType === "application/octet-stream" && !schema.contentEncoding) {
				functions.push(["instanceof", "File"]);
				break;
			}
			if (isZodV4) {
				if (!predefinedZodFormats.has(schema.format ?? "")) {
					if ("const" in schema) functions.push(["literal", `"${schema.const}"`]);
					else if (schema.pattern && schema.format) {
						const isStartWithSlash = schema.pattern.startsWith("/");
						const isEndWithSlash = schema.pattern.endsWith("/");
						const regexp = `new RegExp('${jsStringEscape(schema.pattern.slice(isStartWithSlash ? 1 : 0, isEndWithSlash ? -1 : void 0))}')`;
						consts.push(`export const ${name}RegExp${constsCounterValue} = ${regexp};\n`);
						functions.push(["stringFormat", [`'${escape(schema.format)}'`, `${name}RegExp${constsCounterValue}`]]);
					} else functions.push([type, void 0]);
					break;
				}
			} else if ("const" in schema) functions.push(["literal", `"${schema.const}"`]);
			else functions.push([type, void 0]);
			if (schema.format === "date") {
				const formatAPI = getZodDateFormat(isZodV4);
				functions.push([formatAPI, void 0]);
				break;
			}
			if (schema.format === "time") {
				const options = context.output.override.zod.timeOptions;
				const formatAPI = getZodTimeFormat(isZodV4);
				functions.push([formatAPI, JSON.stringify(options)]);
				break;
			}
			if (schema.format === "date-time") {
				const options = context.output.override.zod.dateTimeOptions;
				const formatAPI = getZodDateTimeFormat(isZodV4);
				functions.push([formatAPI, JSON.stringify(options)]);
				break;
			}
			if (schema.format === "email") {
				functions.push(["email", void 0]);
				break;
			}
			if (schema.format === "uri") {
				functions.push(["url", void 0]);
				break;
			}
			if (schema.format === "hostname") {
				if (isZodV4) functions.push(["hostname", void 0]);
				else functions.push(["url", void 0]);
				break;
			}
			if (schema.format === "uuid") {
				functions.push(["uuid", void 0]);
				break;
			}
			break;
		default: {
			const hasProperties = !!schema.properties;
			const properties = schema.properties ?? {};
			const hasDefinedProperties = Object.keys(properties).length > 0;
			const hasAdditionalPropertiesSchema = !!schema.additionalProperties && !isBoolean(schema.additionalProperties);
			const shouldUseLooseObject = type === "object" && !hasDefinedProperties && schema.additionalProperties === void 0 && !hasAdditionalPropertiesSchema;
			if (hasProperties && hasDefinedProperties) {
				const objectType = getObjectFunctionName(isZodV4, strict);
				functions.push([objectType, Object.keys(properties).map((key) => ({ [key]: rules?.propertyOverrides?.[key] ?? generateZodValidationSchemaDefinition(properties[key], context, camel(`${name}-${key}`), strict, isZodV4, {
					required: schema.required?.includes(key),
					constNameRegistry
				}) })).reduce((acc, curr) => ({
					...acc,
					...curr
				}), {})]);
				if (strict && !isZodV4) functions.push(["strict", void 0]);
				break;
			}
			if (shouldUseLooseObject) {
				const looseObjectType = getLooseObjectFunctionName(isZodV4);
				functions.push([looseObjectType, {}]);
				if (!isZodV4) functions.push(["passthrough", void 0]);
				break;
			}
			if (schema.additionalProperties) {
				functions.push(["additionalProperties", generateZodValidationSchemaDefinition(isBoolean(schema.additionalProperties) ? {} : schema.additionalProperties, context, name, strict, isZodV4, {
					required: true,
					constNameRegistry
				})]);
				break;
			}
			if (schema.enum) break;
			functions.push([type, void 0]);
			break;
		}
	}
	if (!hasNonArrayEnum && isString(type) && minAndMaxTypes.has(type)) {
		const shouldUseExclusiveMin = exclusiveMinRaw !== void 0;
		const shouldUseExclusiveMax = exclusiveMaxRaw !== void 0;
		if (shouldUseExclusiveMin && exclusiveMin !== void 0) {
			consts.push(`export const ${name}ExclusiveMin${constsCounterValue} = ${exclusiveMin};`);
			functions.push(["gt", `${name}ExclusiveMin${constsCounterValue}`]);
		} else if (min !== void 0) if (min === 1) functions.push(["min", `${min}`]);
		else {
			consts.push(`export const ${name}Min${constsCounterValue} = ${min};`);
			functions.push(["min", `${name}Min${constsCounterValue}`]);
		}
		if (shouldUseExclusiveMax && exclusiveMax !== void 0) {
			consts.push(`export const ${name}ExclusiveMax${constsCounterValue} = ${exclusiveMax};`);
			functions.push(["lt", `${name}ExclusiveMax${constsCounterValue}`]);
		} else if (max !== void 0) {
			consts.push(`export const ${name}Max${constsCounterValue} = ${max};`);
			functions.push(["max", `${name}Max${constsCounterValue}`]);
		}
		if (multipleOf !== void 0) {
			consts.push(`export const ${name}MultipleOf${constsCounterValue} = ${multipleOf.toString()};`);
			functions.push(["multipleOf", `${name}MultipleOf${constsCounterValue}`]);
		}
		if (exclusiveMin !== void 0 || min !== void 0 || exclusiveMax !== void 0 || multipleOf !== void 0 || max !== void 0) consts.push(`\n`);
	}
	const stringFormatAlreadyEmitted = isZodV4 && type === "string" && !!matches && !!schema.format && !predefinedZodFormats.has(schema.format ?? "");
	if (matches && !hasNonArrayEnum && type === "string" && !stringFormatAlreadyEmitted) {
		const isStartWithSlash = matches.startsWith("/");
		const isEndWithSlash = matches.endsWith("/");
		const regexp = `new RegExp('${jsStringEscape(matches.slice(isStartWithSlash ? 1 : 0, isEndWithSlash ? -1 : void 0))}')`;
		consts.push(`export const ${name}RegExp${constsCounterValue} = ${regexp};\n`);
		if (schema.format && !predefinedZodFormats.has(schema.format) && isZodV4) functions.push(["stringFormat", [`'${escape(schema.format)}'`, `${name}RegExp${constsCounterValue}`]]);
		else functions.push(["regex", `${name}RegExp${constsCounterValue}`]);
	}
	if (schema.enum && type !== "array") {
		const uniqueEnumValues = unique(schema.enum);
		if (uniqueEnumValues.every((value) => isString(value))) functions.push(["enum", `[${uniqueEnumValues.map((value) => `'${escape(value)}'`).join(", ")}]`]);
		else functions.push(["oneOf", uniqueEnumValues.map((value) => ({
			functions: [["literal", isString(value) ? `'${escape(value)}'` : value]],
			consts: []
		}))]);
	}
	if (!required && nullable) functions.push(["nullish", void 0]);
	else if (nullable) functions.push(["nullable", void 0]);
	else if (!required && !hasDefault) functions.push(["optional", void 0]);
	if (hasDefault) functions.push(["default", defaultVarName]);
	if (schema.description) functions.push(["describe", `'${jsStringEscape(schema.description)}'`]);
	return {
		functions,
		consts: unique(consts)
	};
};
const parseZodValidationSchemaDefinition = (input, context, coerceTypes = false, strict, isZodV4, preprocess) => {
	if (input.functions.length === 0) return {
		zod: "",
		consts: ""
	};
	let consts = "";
	const appendConstsChunk = (chunk) => {
		if (!chunk) return;
		if (consts.length > 0 && !consts.endsWith("\n") && !chunk.startsWith("\n")) consts += "\n";
		consts += chunk;
	};
	const formatFunctionArgs = (value) => {
		if (value === void 0) return "";
		if (value === null) return "null";
		if (isString(value)) return value;
		if (Array.isArray(value)) return value.map((item) => formatFunctionArgs(item)).join(", ");
		if (isObject(value)) return stringify(value) ?? "";
		if (isNumber(value) || isBoolean(value)) return `${value}`;
		return "";
	};
	const parseProperty = (property) => {
		const [fn, args = ""] = property;
		if (fn === "fileOrString") return "zod.instanceof(File).or(zod.string())";
		if (fn === "allOf") {
			const allOfArgs = args;
			if (strict && allOfArgs.length > 0 && allOfArgs.every((partSchema) => {
				if (partSchema.functions.length === 0) return false;
				const firstFn = partSchema.functions[0][0];
				return firstFn === "object" || firstFn === "strictObject";
			})) {
				const mergedProperties = {};
				let allConsts = "";
				for (const partSchema of allOfArgs) {
					if (partSchema.consts.length > 0) allConsts += partSchema.consts.join("\n");
					const objectFunctionIndex = partSchema.functions.findIndex(([fnName]) => fnName === "object" || fnName === "strictObject");
					if (objectFunctionIndex !== -1) {
						const objectArgs = partSchema.functions[objectFunctionIndex][1];
						if (isObject(objectArgs)) Object.assign(mergedProperties, objectArgs);
					}
				}
				if (allConsts.length > 0) appendConstsChunk(allConsts);
				const mergedObjectString = `zod.${getObjectFunctionName(isZodV4, strict)}({
${Object.entries(mergedProperties).map(([key, schema]) => {
					const value = schema.functions.map((prop) => parseProperty(prop)).join("");
					appendConstsChunk(schema.consts.join("\n"));
					return `  "${key}": ${value.startsWith(".") ? "zod" : ""}${value}`;
				}).join(",\n")}
})`;
				if (!isZodV4) return `${mergedObjectString}.strict()`;
				return mergedObjectString;
			}
			let acc = "";
			for (const partSchema of allOfArgs) {
				const value = partSchema.functions.map((prop) => parseProperty(prop)).join("");
				const valueWithZod = `${value.startsWith(".") ? "zod" : ""}${value}`;
				if (partSchema.consts.length > 0) appendConstsChunk(partSchema.consts.join("\n"));
				if (acc.length === 0) acc = valueWithZod;
				else acc += `.and(${valueWithZod})`;
			}
			return acc;
		}
		if (fn === "oneOf" || fn === "anyOf") {
			const unionArgs = args;
			if (unionArgs.length === 1) return unionArgs[0].functions.map((prop) => parseProperty(prop)).join("");
			return `.union([${unionArgs.map(({ functions, consts: argConsts }) => {
				const value = functions.map((prop) => parseProperty(prop)).join("");
				const valueWithZod = `${value.startsWith(".") ? "zod" : ""}${value}`;
				appendConstsChunk(argConsts.join("\n"));
				return valueWithZod;
			}).join(",")}])`;
		}
		if (fn === "additionalProperties") {
			const additionalPropertiesArgs = args;
			const value = additionalPropertiesArgs.functions.map((prop) => parseProperty(prop)).join("");
			const valueWithZod = `${value.startsWith(".") ? "zod" : ""}${value}`;
			if (Array.isArray(additionalPropertiesArgs.consts)) appendConstsChunk(additionalPropertiesArgs.consts.join("\n"));
			return `zod.record(zod.string(), ${valueWithZod})`;
		}
		if (fn === "object" || fn === "strictObject" || fn === "looseObject") {
			const objectArgs = args;
			const parsedObject = `zod.${fn === "looseObject" ? isZodV4 ? "looseObject" : "object" : getObjectFunctionName(isZodV4, strict)}({
${Object.entries(objectArgs).map(([key, schema]) => {
				const value = schema.functions.map((prop) => parseProperty(prop)).join("");
				appendConstsChunk(schema.consts.join("\n"));
				return `  "${key}": ${value.startsWith(".") ? "zod" : ""}${value}`;
			}).join(",\n")}
})`;
			if (fn === "looseObject" && !isZodV4) return `${parsedObject}.passthrough()`;
			return parsedObject;
		}
		if (fn === "passthrough") return ".passthrough()";
		if (fn === "array") {
			const arrayArgs = args;
			const value = arrayArgs.functions.map((prop) => parseProperty(prop)).join("");
			if (isString(arrayArgs.consts)) appendConstsChunk(arrayArgs.consts);
			else if (Array.isArray(arrayArgs.consts)) appendConstsChunk(arrayArgs.consts.join("\n"));
			return `.array(${value.startsWith(".") ? "zod" : ""}${value})`;
		}
		if (fn === "strict" && !isZodV4) return ".strict()";
		if (fn === "tuple") return `zod.tuple([${args.map((x) => {
			const value = x.functions.map((prop) => parseProperty(prop)).join("");
			return `${value.startsWith(".") ? "zod" : ""}${value}`;
		}).join(",\n")}])`;
		if (fn === "rest") return `.rest(zod${args.functions.map((prop) => parseProperty(prop)).join("")})`;
		const shouldCoerceType = coerceTypes && (Array.isArray(coerceTypes) ? coerceTypes.includes(fn) : COERCIBLE_TYPES.has(fn));
		if (fn !== "date" && shouldCoerceType || fn === "date" && shouldCoerceType && context.output.override.useDates) return `.coerce.${fn}(${formatFunctionArgs(args)})`;
		return `.${fn}(${formatFunctionArgs(args)})`;
	};
	appendConstsChunk(input.consts.join("\n"));
	const schema = input.functions.map((prop) => parseProperty(prop)).join("");
	const value = preprocess ? `.preprocess(${preprocess.name}, ${schema.startsWith(".") ? "zod" : ""}${schema})` : schema;
	const zod = `${value.startsWith(".") ? "zod" : ""}${value}`;
	if (consts.includes(",export")) consts = consts.replaceAll(",export", "\nexport");
	return {
		zod,
		consts
	};
};
const dereferenceScalar = (value, context) => {
	if (isObject(value)) return dereference(value, context);
	else if (Array.isArray(value)) return value.map((item) => dereferenceScalar(item, context));
	else return value;
};
/**
* Attempts to resolve a `$ref` to its target schema. Returns `undefined`
* instead of throwing when the ref cannot be found (e.g. external refs
* not yet bundled). Logs a verbose warning on failure to aid debugging.
*/
function tryResolveRefSchema($ref, context) {
	try {
		return resolveRef({ $ref }, context).schema;
	} catch (error) {
		logVerbose(`[orval/zod] Failed to resolve $ref "${$ref}":`, error instanceof Error ? error.message : error);
		return;
	}
}
/**
* Recursively inlines all `$ref` references in an OpenAPI schema tree,
* producing a fully-resolved schema suitable for Zod code generation.
*
* Tracks visited `$ref` paths via `context.parents` to break circular
* references (returning `{}` for cycles).
*/
const dereference = (schema, context) => {
	const refName = "$ref" in schema ? schema.$ref : void 0;
	if (refName && context.parents?.includes(refName)) return {};
	const childContext = {
		...context,
		...refName ? { parents: [...context.parents ?? [], refName] } : void 0
	};
	const resolvedSchema = "$ref" in schema ? (() => {
		const referencedSchema = tryResolveRefSchema(schema.$ref, context);
		if (!referencedSchema || !isObject(referencedSchema)) return;
		const siblingProperties = Object.fromEntries(Object.entries(schema).filter(([key]) => key !== "$ref"));
		return {
			...referencedSchema,
			...siblingProperties
		};
	})() : schema;
	if (!resolvedSchema) return {};
	const resolvedContext = childContext;
	return Object.entries(resolvedSchema).reduce((acc, [key, value]) => {
		if (key === "properties" && isObject(value)) acc[key] = Object.entries(value).reduce((props, [propKey, propSchema]) => {
			props[propKey] = dereference(propSchema, resolvedContext);
			return props;
		}, {});
		else if (key === "default" || key === "example" || key === "examples") acc[key] = value;
		else acc[key] = dereferenceScalar(value, resolvedContext);
		return acc;
	}, {});
};
/**
* Generate zod schema for form-data request body.
* Handles file type detection for top-level properties based on encoding.contentType
* and contentMediaType. Mirrors type gen's resolveFormDataRootObject.
*/
const generateFormDataZodSchema = (schema, context, name, strict, isZodV4, encoding) => {
	const propertyOverrides = {};
	if (schema.properties) for (const key of Object.keys(schema.properties)) {
		const propSchema = schema.properties[key];
		const resolvedPropSchema = propSchema ? dereference(propSchema, context) : void 0;
		const fileType = resolvedPropSchema ? getFormDataFieldFileType(resolvedPropSchema, encoding?.[key]?.contentType) : void 0;
		if (fileType) {
			const isRequired = schema.required?.includes(key);
			const fileFunctions = [fileType === "binary" ? ["instanceof", "File"] : ["fileOrString", void 0]];
			if (!isRequired) fileFunctions.push(["optional", void 0]);
			propertyOverrides[key] = {
				functions: fileFunctions,
				consts: []
			};
		}
	}
	return generateZodValidationSchemaDefinition(schema, context, name, strict, isZodV4, {
		required: true,
		propertyOverrides: Object.keys(propertyOverrides).length > 0 ? propertyOverrides : void 0
	});
};
const parseBodyAndResponse = ({ data, context, name, strict, generate, isZodV4, parseType }) => {
	if (!data || !generate) return {
		input: {
			functions: [],
			consts: []
		},
		isArray: false
	};
	const resolvedRef = resolveRef(data, context).schema;
	const jsonMedia = resolvedRef.content?.["application/json"];
	const formDataMedia = resolvedRef.content?.["multipart/form-data"];
	const [contentType, mediaType] = jsonMedia ? ["application/json", jsonMedia] : formDataMedia ? ["multipart/form-data", formDataMedia] : [void 0, void 0];
	const schema = mediaType?.schema;
	if (!schema) return {
		input: {
			functions: [],
			consts: []
		},
		isArray: false
	};
	const encoding = mediaType.encoding;
	const resolvedJsonSchema = dereference(schema, context);
	if (resolvedJsonSchema.items) {
		const min = resolvedJsonSchema.minimum ?? resolvedJsonSchema.minLength ?? resolvedJsonSchema.minItems;
		const max = resolvedJsonSchema.maximum ?? resolvedJsonSchema.maxLength ?? resolvedJsonSchema.maxItems;
		return {
			input: generateZodValidationSchemaDefinition(parseType === "body" ? removeReadOnlyProperties(resolvedJsonSchema.items) : resolvedJsonSchema.items, context, name, strict, isZodV4, { required: true }),
			isArray: true,
			rules: {
				...min === void 0 ? {} : { min },
				...max === void 0 ? {} : { max }
			}
		};
	}
	const effectiveSchema = parseType === "body" ? removeReadOnlyProperties(resolvedJsonSchema) : resolvedJsonSchema;
	return {
		input: contentType === "multipart/form-data" ? generateFormDataZodSchema(effectiveSchema, context, name, strict, isZodV4, encoding) : generateZodValidationSchemaDefinition(effectiveSchema, context, name, strict, isZodV4, { required: true }),
		isArray: false
	};
};
const parseParameters = ({ data, context, operationName, isZodV4, strict, generate }) => {
	if (!data) return {
		headers: {
			functions: [],
			consts: []
		},
		queryParams: {
			functions: [],
			consts: []
		},
		params: {
			functions: [],
			consts: []
		}
	};
	const defintionsByParameters = data.reduce((acc, val) => {
		const { schema: parameter } = resolveRef(val, context);
		if (!parameter.schema) return acc;
		if (!parameter.in || !parameter.name) return acc;
		const schema = dereference(parameter.schema, context);
		schema.description = parameter.description;
		const mapStrict = {
			path: strict.param,
			query: strict.query,
			header: strict.header
		};
		const mapGenerate = {
			path: generate.param,
			query: generate.query,
			header: generate.header
		};
		if (parameter.in !== "path" && parameter.in !== "query" && parameter.in !== "header") return acc;
		const definition = generateZodValidationSchemaDefinition(schema, context, camel(`${operationName}-${parameter.in}-${parameter.name}`), mapStrict[parameter.in], isZodV4, { required: parameter.required });
		if (parameter.in === "header" && mapGenerate.header) return {
			...acc,
			headers: {
				...acc.headers,
				[parameter.name]: definition
			}
		};
		if (parameter.in === "query" && mapGenerate.query) return {
			...acc,
			queryParams: {
				...acc.queryParams,
				[parameter.name]: definition
			}
		};
		if (parameter.in === "path" && mapGenerate.path) return {
			...acc,
			params: {
				...acc.params,
				[parameter.name]: definition
			}
		};
		return acc;
	}, {
		headers: {},
		queryParams: {},
		params: {}
	});
	const headers = {
		functions: [],
		consts: []
	};
	if (Object.keys(defintionsByParameters.headers).length > 0) {
		const parameterFunctions = getParameterFunctions(isZodV4, strict.header, defintionsByParameters.headers);
		headers.functions.push(...parameterFunctions);
	}
	const queryParams = {
		functions: [],
		consts: []
	};
	if (Object.keys(defintionsByParameters.queryParams).length > 0) {
		const parameterFunctions = getParameterFunctions(isZodV4, strict.query, defintionsByParameters.queryParams);
		queryParams.functions.push(...parameterFunctions);
	}
	const params = {
		functions: [],
		consts: []
	};
	if (Object.keys(defintionsByParameters.params).length > 0) {
		const parameterFunctions = getParameterFunctions(isZodV4, strict.param, defintionsByParameters.params);
		params.functions.push(...parameterFunctions);
	}
	return {
		headers,
		queryParams,
		params
	};
};
const generateZodRoute = async ({ operationName, verb, override }, { pathRoute, context, output }) => {
	const isZodV4 = !!context.output.packageJson && isZodVersionV4(context.output.packageJson);
	const spec = context.spec.paths?.[pathRoute];
	if (spec == void 0) throw new Error(`No such path ${pathRoute} in ${context.projectName}`);
	const parsedParameters = parseParameters({
		data: [...spec.parameters ?? [], ...spec[verb]?.parameters ?? []],
		context,
		operationName,
		isZodV4,
		strict: override.zod.strict,
		generate: override.zod.generate
	});
	const requestBody = spec[verb]?.requestBody;
	const parsedBody = parseBodyAndResponse({
		data: requestBody,
		context,
		name: camel(`${operationName}-body`),
		strict: override.zod.strict.body,
		generate: override.zod.generate.body,
		isZodV4,
		parseType: "body"
	});
	const responses = context.output.override.zod.generateEachHttpStatus ? Object.entries(spec[verb]?.responses ?? {}) : [["", spec[verb]?.responses?.[200]]];
	const parsedResponses = responses.map(([code, response]) => parseBodyAndResponse({
		data: response,
		context,
		name: camel(`${operationName}-${code}-response`),
		strict: override.zod.strict.response,
		generate: override.zod.generate.response,
		isZodV4,
		parseType: "response"
	}));
	const preprocessParams = override.zod.preprocess?.param ? await generateMutator({
		output,
		mutator: override.zod.preprocess.response,
		name: `${operationName}PreprocessParams`,
		workspace: context.workspace,
		tsconfig: context.output.tsconfig
	}) : void 0;
	const inputParams = parseZodValidationSchemaDefinition(parsedParameters.params, context, override.zod.coerce.param, override.zod.strict.param, isZodV4, preprocessParams);
	const preprocessQueryParams = override.zod.preprocess?.query ? await generateMutator({
		output,
		mutator: override.zod.preprocess.response,
		name: `${operationName}PreprocessQueryParams`,
		workspace: context.workspace,
		tsconfig: context.output.tsconfig
	}) : void 0;
	const inputQueryParams = parseZodValidationSchemaDefinition(parsedParameters.queryParams, context, override.zod.coerce.query, override.zod.strict.query, isZodV4, preprocessQueryParams);
	const preprocessHeader = override.zod.preprocess?.header ? await generateMutator({
		output,
		mutator: override.zod.preprocess.response,
		name: `${operationName}PreprocessHeader`,
		workspace: context.workspace,
		tsconfig: context.output.tsconfig
	}) : void 0;
	const inputHeaders = parseZodValidationSchemaDefinition(parsedParameters.headers, context, override.zod.coerce.header, override.zod.strict.header, isZodV4, preprocessHeader);
	const preprocessBody = override.zod.preprocess?.body ? await generateMutator({
		output,
		mutator: override.zod.preprocess.response,
		name: `${operationName}PreprocessBody`,
		workspace: context.workspace,
		tsconfig: context.output.tsconfig
	}) : void 0;
	const inputBody = parseZodValidationSchemaDefinition(parsedBody.input, context, override.zod.coerce.body, override.zod.strict.body, isZodV4, preprocessBody);
	const preprocessResponse = override.zod.preprocess?.response ? await generateMutator({
		output,
		mutator: override.zod.preprocess.response,
		name: `${operationName}PreprocessResponse`,
		workspace: context.workspace,
		tsconfig: context.output.tsconfig
	}) : void 0;
	const inputResponses = parsedResponses.map((parsedResponse) => parseZodValidationSchemaDefinition(parsedResponse.input, context, override.zod.coerce.response, override.zod.strict.response, isZodV4, preprocessResponse));
	if (!inputParams.zod && !inputQueryParams.zod && !inputHeaders.zod && !inputBody.zod && !inputResponses.some((inputResponse) => inputResponse.zod)) return {
		implemtation: "",
		mutators: []
	};
	const pascalOperationName = pascal(operationName);
	const useBrandedTypes = override.zod.useBrandedTypes;
	const brand = (name) => useBrandedTypes ? isZodV4 ? `.brand("${name}")` : `.brand<"${name}">()` : "";
	return {
		implementation: [
			...inputParams.consts ? [inputParams.consts] : [],
			...inputParams.zod ? [`export const ${pascalOperationName}Params = ${inputParams.zod}${brand(`${pascalOperationName}Params`)}`] : [],
			...inputQueryParams.consts ? [inputQueryParams.consts] : [],
			...inputQueryParams.zod ? [`export const ${pascalOperationName}QueryParams = ${inputQueryParams.zod}${brand(`${pascalOperationName}QueryParams`)}`] : [],
			...inputHeaders.consts ? [inputHeaders.consts] : [],
			...inputHeaders.zod ? [`export const ${pascalOperationName}Header = ${inputHeaders.zod}${brand(`${pascalOperationName}Header`)}`] : [],
			...inputBody.consts ? [inputBody.consts] : [],
			...inputBody.zod ? [parsedBody.isArray ? `export const ${pascalOperationName}BodyItem = ${inputBody.zod}
export const ${pascalOperationName}Body = zod.array(${pascalOperationName}BodyItem)${parsedBody.rules?.min ? `.min(${parsedBody.rules.min})` : ""}${parsedBody.rules?.max ? `.max(${parsedBody.rules.max})` : ""}${brand(`${pascalOperationName}Body`)}` : `export const ${pascalOperationName}Body = ${inputBody.zod}${brand(`${pascalOperationName}Body`)}`] : [],
			...inputResponses.flatMap((inputResponse, index) => {
				const operationResponse = pascal(`${operationName}-${responses[index][0]}-response`);
				return [...inputResponse.consts ? [inputResponse.consts] : [], ...inputResponse.zod ? [parsedResponses[index].isArray ? `export const ${operationResponse}Item = ${inputResponse.zod}
export const ${operationResponse} = zod.array(${operationResponse}Item)${parsedResponses[index].rules?.min ? `.min(${parsedResponses[index].rules.min})` : ""}${parsedResponses[index].rules?.max ? `.max(${parsedResponses[index].rules.max})` : ""}${brand(operationResponse)}` : `export const ${operationResponse} = ${inputResponse.zod}${brand(operationResponse)}`] : []];
			})
		].join("\n\n"),
		mutators: preprocessResponse ? [preprocessResponse] : []
	};
};
const generateZod = async (verbOptions, options) => {
	const { implementation, mutators } = await generateZodRoute(verbOptions, options);
	return {
		implementation: implementation ? `${implementation}\n\n` : "",
		imports: [],
		mutators
	};
};
const zodClientBuilder = {
	client: generateZod,
	dependencies: getZodDependencies
};
const builder = () => () => zodClientBuilder;
//#endregion
export { builder, builder as default, dereference, generateFormDataZodSchema, generateZod, generateZodValidationSchemaDefinition, getZodDependencies, isZodVersionV4, parseParameters, parseZodValidationSchemaDefinition, predefinedZodFormats };

//# sourceMappingURL=index.mjs.map