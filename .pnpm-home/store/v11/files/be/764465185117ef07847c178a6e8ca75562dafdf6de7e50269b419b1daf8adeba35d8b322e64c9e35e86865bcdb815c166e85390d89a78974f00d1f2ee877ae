import { EnumGeneration, PropertySortOrder, camel, compareVersions, escape, escapeRegExp, generalJSTypesWithArray, generateDependencyImports, getKey, getRefInfo, isBoolean, isFunction, isNumber, isObject, isReference, isSchema, isString, mergeDeep, pascal, resolveRef, sanitize, stringify } from "@orval/core";
import { prop } from "remeda";
//#region src/delay.ts
const getDelay = (override, options) => {
	const overrideDelay = override?.mock?.delay ?? options?.delay;
	const delayFunctionLazyExecute = override?.mock?.delayFunctionLazyExecute ?? options?.delayFunctionLazyExecute;
	if (isFunction(overrideDelay)) return delayFunctionLazyExecute ? overrideDelay : overrideDelay();
	if (isNumber(overrideDelay) || isBoolean(overrideDelay)) return overrideDelay;
	return false;
};
//#endregion
//#region src/faker/compatible-v9.ts
const getFakerPackageVersion = (packageJson) => {
	return packageJson.resolvedVersions?.["@faker-js/faker"] ?? packageJson.dependencies?.["@faker-js/faker"] ?? packageJson.devDependencies?.["@faker-js/faker"] ?? packageJson.peerDependencies?.["@faker-js/faker"];
};
const isFakerVersionV9 = (packageJson) => {
	const version = getFakerPackageVersion(packageJson);
	if (!version) return false;
	const withoutRc = version.split("-")[0];
	return compareVersions(withoutRc, "9.0.0");
};
//#endregion
//#region src/faker/constants.ts
const DEFAULT_FORMAT_MOCK = {
	bic: "faker.finance.bic()",
	binary: "new ArrayBuffer(faker.number.int({ min: 1, max: 64 }))",
	city: "faker.location.city()",
	country: "faker.location.country()",
	date: "faker.date.past().toISOString().slice(0, 10)",
	"date-time": "faker.date.past().toISOString().slice(0, 19) + 'Z'",
	email: "faker.internet.email()",
	firstName: "faker.person.firstName()",
	gender: "faker.person.gender()",
	iban: "faker.finance.iban()",
	ipv4: "faker.internet.ipv4()",
	ipv6: "faker.internet.ipv6()",
	jobTitle: "faker.person.jobTitle()",
	lastName: "faker.person.lastName()",
	password: "faker.internet.password()",
	phoneNumber: "faker.phone.number()",
	streetName: "faker.location.street()",
	uri: "faker.internet.url()",
	url: "faker.internet.url()",
	userName: "faker.internet.userName()",
	uuid: "faker.string.uuid()",
	zipCode: "faker.location.zipCode()"
};
const DEFAULT_OBJECT_KEY_MOCK = "faker.string.alphanumeric(5)";
//#endregion
//#region src/faker/getters/object.ts
const overrideVarName = "overrideResponse";
function getReferenceName$1(ref) {
	if (!ref) return "";
	return pascal(ref.split("/").pop() ?? "");
}
function getMockObject({ item, mockOptions, operationId, tags, combine, context, imports, existingReferencedProperties, splitMockImplementations, allowOverride = false }) {
	if (isReference(item)) return resolveMockValue({
		schema: {
			...item,
			name: item.name,
			path: item.path ? `${item.path}.${item.name}` : item.name
		},
		mockOptions,
		operationId,
		tags,
		context,
		imports,
		existingReferencedProperties,
		splitMockImplementations
	});
	const schemaItem = item;
	const itemAllOf = schemaItem.allOf;
	const itemOneOf = schemaItem.oneOf;
	const itemAnyOf = schemaItem.anyOf;
	const itemType = schemaItem.type;
	const itemProperties = schemaItem.properties;
	const itemRequired = schemaItem.required;
	const itemAdditionalProperties = schemaItem.additionalProperties;
	if (itemAllOf || itemOneOf || itemAnyOf) return combineSchemasMock({
		item: schemaItem,
		separator: itemAllOf ? "allOf" : itemOneOf ? "oneOf" : "anyOf",
		mockOptions,
		operationId,
		tags,
		combine,
		context,
		imports,
		existingReferencedProperties,
		splitMockImplementations
	});
	if (Array.isArray(itemType)) {
		const baseItem = schemaItem;
		return combineSchemasMock({
			item: {
				anyOf: itemType.map((type) => ({
					...baseItem,
					type
				})),
				name: schemaItem.name
			},
			separator: "anyOf",
			mockOptions,
			operationId,
			tags,
			combine,
			context,
			imports,
			existingReferencedProperties,
			splitMockImplementations
		});
	}
	if (itemProperties) {
		let value = !combine || combine.separator === "oneOf" || combine.separator === "anyOf" ? "{" : "";
		const imports = [];
		const includedProperties = [];
		const entries = Object.entries(itemProperties);
		if (context.output.propertySortOrder === PropertySortOrder.ALPHABETICAL) entries.sort((a, b) => {
			return a[0].localeCompare(b[0]);
		});
		const propertyScalars = entries.map(([key, prop]) => {
			if (combine?.includedProperties.includes(key)) return;
			const isRequired = mockOptions?.required ?? (Array.isArray(itemRequired) ? itemRequired : []).includes(key);
			const hasNullable = "nullable" in prop && prop.nullable === true;
			if (isReference(prop) && existingReferencedProperties.includes(getReferenceName$1(prop.$ref))) {
				if (isRequired) return `${getKey(key)}: null`;
				return;
			}
			const resolvedValue = resolveMockValue({
				schema: {
					...prop,
					name: key,
					path: schemaItem.path ? `${schemaItem.path}.${key}` : `#.${key}`
				},
				mockOptions,
				operationId,
				tags,
				context,
				imports,
				existingReferencedProperties,
				splitMockImplementations
			});
			imports.push(...resolvedValue.imports);
			includedProperties.push(key);
			const keyDefinition = getKey(key);
			const hasDefault = "default" in prop && prop.default !== void 0;
			if (!isRequired && !resolvedValue.overrided && !hasDefault) {
				const nullValue = hasNullable ? "null" : "undefined";
				return `${keyDefinition}: faker.helpers.arrayElement([${resolvedValue.value}, ${nullValue}])`;
			}
			if (Array.isArray(prop.type) && prop.type.includes("null") && !resolvedValue.overrided) return `${keyDefinition}: faker.helpers.arrayElement([${resolvedValue.value}, null])`;
			return `${keyDefinition}: ${resolvedValue.value}`;
		}).filter(Boolean);
		if (allowOverride) propertyScalars.push(`...${overrideVarName}`);
		value += propertyScalars.join(", ");
		value += !combine || combine.separator === "oneOf" || combine.separator === "anyOf" ? "}" : "";
		return {
			value,
			imports,
			name: schemaItem.name,
			includedProperties
		};
	}
	if (itemAdditionalProperties) {
		if (itemAdditionalProperties === true) return {
			value: `{}`,
			imports: [],
			name: schemaItem.name
		};
		const additionalProperties = itemAdditionalProperties;
		if (isReference(additionalProperties) && existingReferencedProperties.includes(getReferenceName$1(additionalProperties.$ref))) return {
			value: `{}`,
			imports: [],
			name: schemaItem.name
		};
		const resolvedValue = resolveMockValue({
			schema: {
				...additionalProperties,
				name: schemaItem.name,
				path: schemaItem.path ? `${schemaItem.path}.#` : "#"
			},
			mockOptions,
			operationId,
			tags,
			context,
			imports,
			existingReferencedProperties,
			splitMockImplementations
		});
		return {
			...resolvedValue,
			value: `{
        [${DEFAULT_OBJECT_KEY_MOCK}]: ${resolvedValue.value}
      }`
		};
	}
	return {
		value: "{}",
		imports: [],
		name: schemaItem.name
	};
}
//#endregion
//#region src/faker/getters/scalar.ts
function getMockScalar({ item, imports, mockOptions, operationId, tags, combine, context, existingReferencedProperties, splitMockImplementations, allowOverride = false }) {
	const safeMockOptions = mockOptions ?? {};
	if (item.isRef) existingReferencedProperties = [...existingReferencedProperties, item.name];
	const operationProperty = resolveMockOverride(safeMockOptions.operations?.[operationId]?.properties, item);
	if (operationProperty) return operationProperty;
	let overrideTag = { properties: {} };
	const sortedTags = Object.entries(safeMockOptions.tags ?? {}).toSorted((a, b) => a[0].localeCompare(b[0]));
	for (const [tag, options] of sortedTags) {
		if (!tags.includes(tag)) continue;
		overrideTag = mergeDeep(overrideTag, options);
	}
	const tagProperty = resolveMockOverride(overrideTag.properties, item);
	if (tagProperty) return tagProperty;
	const property = resolveMockOverride(safeMockOptions.properties, item);
	if (property) return property;
	if ((context.output.override.mock?.useExamples || safeMockOptions.useExamples) && item.example !== void 0) return {
		value: JSON.stringify(item.example),
		imports: [],
		name: item.name,
		overrided: true
	};
	const formatOverrides = safeMockOptions.format ?? {};
	const ALL_FORMAT = {
		...DEFAULT_FORMAT_MOCK,
		...Object.fromEntries(Object.entries(formatOverrides).filter((entry) => typeof entry[1] === "string"))
	};
	const isNullable = Array.isArray(item.type) && item.type.includes("null");
	const schemaContentMediaType = item.contentMediaType;
	if (!item.format && schemaContentMediaType === "application/octet-stream" && ALL_FORMAT.binary) return {
		value: getNullable(ALL_FORMAT.binary, isNullable),
		imports: [],
		name: item.name,
		overrided: false
	};
	if (item.format && ALL_FORMAT[item.format]) {
		let value = ALL_FORMAT[item.format];
		if (["date", "date-time"].includes(item.format) && context.output.override.useDates) value = `new Date(${value})`;
		return {
			value: getNullable(value, isNullable),
			imports: [],
			name: item.name,
			overrided: false
		};
	}
	const type = getItemType(item);
	const isFakerV9 = !!context.output.packageJson && isFakerVersionV9(context.output.packageJson);
	switch (type) {
		case "number":
		case "integer": {
			const intFunction = context.output.override.useBigInt && (item.format === "int64" || item.format === "uint64") ? "bigInt" : "int";
			const numMin = typeof item.exclusiveMinimum === "number" ? item.exclusiveMinimum : item.minimum ?? safeMockOptions.numberMin;
			const numMax = typeof item.exclusiveMaximum === "number" ? item.exclusiveMaximum : item.maximum ?? safeMockOptions.numberMax;
			const intParts = [];
			if (numMin !== void 0) intParts.push(`min: ${numMin}`);
			if (numMax !== void 0) intParts.push(`max: ${numMax}`);
			if (isFakerV9 && item.multipleOf !== void 0) intParts.push(`multipleOf: ${item.multipleOf}`);
			let value = getNullable(`faker.number.${intFunction}(${intParts.length > 0 ? `{${intParts.join(", ")}}` : ""})`, isNullable);
			if (type === "number") {
				const floatParts = [];
				if (numMin !== void 0) floatParts.push(`min: ${numMin}`);
				if (numMax !== void 0) floatParts.push(`max: ${numMax}`);
				if (isFakerV9 && item.multipleOf !== void 0) floatParts.push(`multipleOf: ${item.multipleOf}`);
				else if (safeMockOptions.fractionDigits !== void 0) floatParts.push(`fractionDigits: ${safeMockOptions.fractionDigits}`);
				value = getNullable(`faker.number.float(${floatParts.length > 0 ? `{${floatParts.join(", ")}}` : ""})`, isNullable);
			}
			const numberImports = [];
			if (item.enum) value = getEnum(item, numberImports, context, existingReferencedProperties, "number");
			else if ("const" in item) value = JSON.stringify(item.const);
			return {
				value,
				enums: item.enum,
				imports: numberImports,
				name: item.name
			};
		}
		case "boolean": {
			let value = "faker.datatype.boolean()";
			if ("const" in item) value = JSON.stringify(item.const);
			return {
				value,
				imports: [],
				name: item.name
			};
		}
		case "array": {
			if (!item.items) return {
				value: "[]",
				imports: [],
				name: item.name
			};
			if ("$ref" in item.items && existingReferencedProperties.includes(pascal(item.items.$ref.split("/").pop() ?? ""))) return {
				value: "[]",
				imports: [],
				name: item.name
			};
			const { value, enums, imports: resolvedImports } = resolveMockValue({
				schema: {
					...item.items,
					name: item.name,
					path: item.path ? `${item.path}.[]` : "#.[]"
				},
				combine,
				mockOptions,
				operationId,
				tags,
				context,
				imports,
				existingReferencedProperties,
				splitMockImplementations
			});
			if (enums) return {
				value,
				imports: resolvedImports,
				name: item.name
			};
			let mapValue = value;
			if (combine && !value.startsWith("faker") && !value.startsWith("{") && !value.startsWith("Array.from")) mapValue = `{${value}}`;
			const arrMin = item.minItems ?? safeMockOptions.arrayMin;
			const arrMax = item.maxItems ?? safeMockOptions.arrayMax;
			const arrParts = [];
			if (arrMin !== void 0) arrParts.push(`min: ${arrMin}`);
			if (arrMax !== void 0) arrParts.push(`max: ${arrMax}`);
			return {
				value: `Array.from({ length: faker.number.int(${arrParts.length > 0 ? `{${arrParts.join(", ")}}` : ""}) }, (_, i) => i + 1).map(() => (${mapValue}))`,
				imports: resolvedImports,
				name: item.name
			};
		}
		case "string": {
			const strMin = item.minLength ?? safeMockOptions.stringMin;
			const strMax = item.maxLength ?? safeMockOptions.stringMax;
			const strLenParts = [];
			if (strMin !== void 0) strLenParts.push(`min: ${strMin}`);
			if (strMax !== void 0) strLenParts.push(`max: ${strMax}`);
			let value = `faker.string.alpha(${strLenParts.length > 0 ? `{length: {${strLenParts.join(", ")}}}` : ""})`;
			const stringImports = [];
			if (item.enum) value = getEnum(item, stringImports, context, existingReferencedProperties, "string");
			else if (item.pattern) value = `faker.helpers.fromRegExp(${JSON.stringify(item.pattern)})`;
			else if ("const" in item) value = JSON.stringify(item.const);
			return {
				value: getNullable(value, isNullable),
				enums: item.enum,
				name: item.name,
				imports: stringImports
			};
		}
		case "null": return {
			value: "null",
			imports: [],
			name: item.name
		};
		default:
			if (item.enum) {
				const enumImports = [];
				return {
					value: getEnum(item, enumImports, context, existingReferencedProperties),
					enums: item.enum,
					imports: enumImports,
					name: item.name
				};
			}
			return getMockObject({
				item,
				mockOptions,
				operationId,
				tags,
				combine: combine ? {
					separator: combine.separator,
					includedProperties: []
				} : void 0,
				context,
				imports,
				existingReferencedProperties,
				splitMockImplementations,
				allowOverride
			});
	}
}
function getItemType(item) {
	if (Array.isArray(item.type) && item.type.includes("null")) {
		const typesWithoutNull = item.type.filter((x) => x !== "null");
		return typesWithoutNull.length === 1 ? typesWithoutNull[0] : typesWithoutNull;
	}
	if (item.type) return item.type;
	if (!item.enum) return;
	const uniqTypes = new Set(item.enum.map((value) => typeof value));
	if (uniqTypes.size > 1) return;
	const type = [...uniqTypes.values()].at(0);
	if (!type) return;
	return ["string", "number"].includes(type) ? type : void 0;
}
function getEnum(item, imports, context, existingReferencedProperties, type) {
	if (!item.enum) return "";
	let enumValue = `[${item.enum.filter((e) => e !== null).map((e) => type === "string" || type === void 0 && isString(e) ? `'${escape(e)}'` : e).join(",")}]`;
	if (context.output.override.enumGenerationType === EnumGeneration.ENUM) if (item.isRef || existingReferencedProperties.length === 0) {
		enumValue += ` as ${item.name}${item.name.endsWith("[]") ? "" : "[]"}`;
		imports.push({ name: item.name });
	} else {
		const parentReference = existingReferencedProperties.at(-1);
		if (!parentReference) return "";
		enumValue += ` as ${parentReference}['${item.name}']`;
		if (!item.path?.endsWith("[]")) enumValue += "[]";
		imports.push({ name: parentReference });
	}
	else enumValue += " as const";
	if (item.isRef && type === "string") {
		enumValue = `Object.values(${item.name})`;
		imports.push({
			name: item.name,
			values: true
		});
	}
	return item.path?.endsWith("[]") ? `faker.helpers.arrayElements(${enumValue})` : `faker.helpers.arrayElement(${enumValue})`;
}
//#endregion
//#region src/faker/resolvers/value.ts
function isRegex(key) {
	return key.startsWith("/") && key.endsWith("/");
}
function resolveMockOverride(properties = {}, item) {
	const path = item.path ?? `#.${item.name}`;
	const property = Object.entries(properties).find(([key]) => {
		if (isRegex(key)) {
			const regex = new RegExp(key.slice(1, -1));
			if (regex.test(item.name) || regex.test(path)) return true;
		}
		if (`#.${key}` === path) return true;
		return false;
	});
	if (!property) return;
	const isNullable = Array.isArray(item.type) && item.type.includes("null");
	return {
		value: getNullable(property[1], isNullable),
		imports: [],
		name: item.name,
		overrided: true
	};
}
function getNullable(value, nullable) {
	return nullable ? `faker.helpers.arrayElement([${value}, null])` : value;
}
function resolveMockValue({ schema, mockOptions, operationId, tags, combine, context, imports, existingReferencedProperties, splitMockImplementations, allowOverride }) {
	if (isReference(schema)) {
		const schemaReference = schema;
		const { name, refPaths } = getRefInfo(typeof schema.$ref === "string" ? schema.$ref : "", context);
		const schemaRef = Array.isArray(refPaths) ? prop(context.spec, ...refPaths) : void 0;
		const newSchema = {
			...schemaRef,
			name,
			path: schemaReference.path,
			isRef: true,
			required: [...schemaRef?.required ?? [], ...schemaReference.required ?? []],
			...schemaReference.nullable === void 0 ? {} : { nullable: schemaReference.nullable }
		};
		const newSeparator = newSchema.allOf ? "allOf" : newSchema.oneOf ? "oneOf" : "anyOf";
		const scalar = getMockScalar({
			item: newSchema,
			mockOptions,
			operationId,
			tags,
			combine: combine ? {
				separator: combine.separator === "anyOf" ? newSeparator : combine.separator,
				includedProperties: newSeparator === "allOf" ? [] : combine.includedProperties
			} : void 0,
			context,
			imports,
			existingReferencedProperties,
			splitMockImplementations,
			allowOverride
		});
		if (scalar.value && (newSchema.type === "object" || newSchema.allOf) && combine?.separator === "oneOf") {
			const funcName = `get${pascal(operationId)}Response${pascal(newSchema.name)}Mock`;
			if (!splitMockImplementations.some((f) => f.includes(`export const ${funcName}`))) {
				const discriminatedProperty = newSchema.discriminator?.propertyName;
				let type = `Partial<${newSchema.name}>`;
				if (discriminatedProperty) type = `Omit<${type}, '${discriminatedProperty}'>`;
				const func = `export const ${funcName} = (${`${overrideVarName}: ${type} = {}`}): ${newSchema.name} => ({${scalar.value.startsWith("...") ? "" : "..."}${scalar.value}, ...${overrideVarName}});`;
				splitMockImplementations.push(func);
			}
			scalar.value = newSchema.nullable ? `${funcName}()` : `{...${funcName}()}`;
			scalar.imports.push({ name: newSchema.name });
		}
		return {
			...scalar,
			type: getType(newSchema)
		};
	}
	return {
		...getMockScalar({
			item: schema,
			mockOptions,
			operationId,
			tags,
			combine,
			context,
			imports,
			existingReferencedProperties,
			splitMockImplementations,
			allowOverride
		}),
		type: getType(schema)
	};
}
function getType(schema) {
	if (isReference(schema)) return;
	return schema.type ?? (schema.properties ? "object" : schema.items ? "array" : void 0);
}
//#endregion
//#region src/faker/getters/combine.ts
function getReferenceName(ref) {
	if (!ref) return "";
	return pascal(ref.split("/").pop() ?? "");
}
function combineSchemasMock({ item, separator, mockOptions, operationId, tags, combine, context, imports, existingReferencedProperties, splitMockImplementations }) {
	const combineImports = [];
	const includedProperties = [...combine?.includedProperties ?? []];
	const separatorItems = item[separator] ?? [];
	const itemRequired = item.required;
	const itemResolvedValue = isReference(item) && !existingReferencedProperties.includes(item.name) || item.properties ? resolveMockValue({
		schema: Object.fromEntries(Object.entries(item).filter(([key]) => key !== separator)),
		combine: {
			separator: "allOf",
			includedProperties: []
		},
		mockOptions,
		operationId,
		tags,
		context,
		imports,
		existingReferencedProperties,
		splitMockImplementations
	}) : void 0;
	includedProperties.push(...itemResolvedValue?.includedProperties ?? []);
	combineImports.push(...itemResolvedValue?.imports ?? []);
	let containsOnlyPrimitiveValues = true;
	const allRequiredFields = [];
	if (separator === "allOf") {
		if (itemRequired) allRequiredFields.push(...itemRequired);
		for (const val of separatorItems) if (isSchema(val) && val.required) allRequiredFields.push(...val.required);
	}
	let value = separator === "allOf" ? "" : "faker.helpers.arrayElement([";
	for (const val of separatorItems) {
		const refName = isReference(val) ? getReferenceName(val.$ref) : "";
		if (separator === "allOf" ? refName && (refName === item.name || existingReferencedProperties.includes(refName) && !item.isRef) : false) {
			if (separatorItems.length === 1) value = "undefined";
			continue;
		}
		const resolvedValue = resolveMockValue({
			schema: (() => {
				if (separator !== "allOf" || allRequiredFields.length === 0) return {
					...val,
					name: item.name,
					path: item.path ?? "#"
				};
				const valRequired = val.required;
				const combinedRequired = valRequired ? [...allRequiredFields, ...valRequired] : allRequiredFields;
				return {
					...val,
					name: item.name,
					path: item.path ?? "#",
					required: [...new Set(combinedRequired)]
				};
			})(),
			combine: {
				separator,
				includedProperties: separator === "oneOf" ? itemResolvedValue?.includedProperties ?? [] : includedProperties
			},
			mockOptions,
			operationId,
			tags,
			context,
			imports,
			existingReferencedProperties,
			splitMockImplementations
		});
		combineImports.push(...resolvedValue.imports);
		includedProperties.push(...resolvedValue.includedProperties ?? []);
		if (resolvedValue.value === "{}") {
			containsOnlyPrimitiveValues = false;
			continue;
		}
		if (separator === "allOf") {
			if (resolvedValue.value.startsWith("{") || !resolvedValue.type) {
				containsOnlyPrimitiveValues = false;
				value += `...${resolvedValue.value},`;
				continue;
			}
			if (resolvedValue.type === "object") {
				containsOnlyPrimitiveValues = false;
				value += resolvedValue.value.startsWith("faker") ? `...${resolvedValue.value},` : `...{${resolvedValue.value}},`;
				continue;
			}
		}
		value += `${resolvedValue.value},`;
	}
	let finalValue = value === "undefined" ? value : `${separator === "allOf" && !containsOnlyPrimitiveValues ? "{" : ""}${value}${separator === "allOf" ? containsOnlyPrimitiveValues ? "" : "}" : "])"}`;
	if (itemResolvedValue) finalValue = finalValue.startsWith("...") ? `...{${finalValue}, ${itemResolvedValue.value}}` : `{...${finalValue}, ${itemResolvedValue.value}}`;
	if (finalValue.endsWith(",")) finalValue = finalValue.slice(0, Math.max(0, finalValue.length - 1));
	return {
		value: finalValue,
		imports: combineImports,
		name: item.name,
		includedProperties
	};
}
//#endregion
//#region src/faker/getters/route.ts
const hasParam = (path) => /[^{]*{[\w*_-]*}.*/.test(path);
const getRoutePath = (path) => {
	const matches = /([^{]*){?([\w*_-]*)}?(.*)/.exec(path);
	if (!matches?.length) return path;
	const prev = matches[1];
	const param = sanitize(camel(matches[2]), {
		es5keyword: true,
		underscore: true,
		dash: true,
		dot: true
	});
	const next = hasParam(matches[3]) ? getRoutePath(matches[3]) : matches[3];
	return hasParam(path) ? `${prev}:${param}${next}` : `${prev}${param}${next}`;
};
const getRouteMSW = (route, baseUrl = "*") => {
	route = route.replaceAll(":", String.raw`\\:`);
	const splittedRoute = route.split("/");
	let resolvedRoute = baseUrl;
	for (const [index, path] of splittedRoute.entries()) {
		if (!path && !index) continue;
		if (!path.includes("{")) {
			resolvedRoute = `${resolvedRoute}/${path}`;
			continue;
		}
		resolvedRoute = `${resolvedRoute}/${getRoutePath(path)}`;
	}
	return resolvedRoute;
};
//#endregion
//#region src/msw/mocks.ts
function getMockPropertiesWithoutFunc(properties, spec) {
	const resolvedProperties = typeof properties === "function" ? properties(spec) : properties;
	const mockProperties = {};
	for (const [key, value] of Object.entries(resolvedProperties)) mockProperties[key] = (isFunction(value) ? `(${String(value)})()` : stringify(value) ?? "undefined").replaceAll(/import_faker\.defaults|import_faker\.faker|_faker\.faker/g, "faker");
	return mockProperties;
}
function getMockWithoutFunc(spec, override) {
	const operations = override?.operations ? (() => {
		const operationMocks = {};
		for (const [key, value] of Object.entries(override.operations)) {
			if (!value?.mock?.properties) continue;
			operationMocks[key] = { properties: getMockPropertiesWithoutFunc(value.mock.properties, spec) };
		}
		return operationMocks;
	})() : void 0;
	const tags = override?.tags ? (() => {
		const tagMocks = {};
		for (const [key, value] of Object.entries(override.tags)) {
			if (!value?.mock?.properties) continue;
			tagMocks[key] = { properties: getMockPropertiesWithoutFunc(value.mock.properties, spec) };
		}
		return tagMocks;
	})() : void 0;
	return {
		arrayMin: override?.mock?.arrayMin,
		arrayMax: override?.mock?.arrayMax,
		stringMin: override?.mock?.stringMin,
		stringMax: override?.mock?.stringMax,
		numberMin: override?.mock?.numberMin,
		numberMax: override?.mock?.numberMax,
		required: override?.mock?.required,
		fractionDigits: override?.mock?.fractionDigits,
		...override?.mock?.properties ? { properties: getMockPropertiesWithoutFunc(override.mock.properties, spec) } : {},
		...override?.mock?.format ? { format: getMockPropertiesWithoutFunc(override.mock.format, spec) } : {},
		...operations ? { operations } : {},
		...tags ? { tags } : {}
	};
}
function getMockNumberOption(mockOptionsWithoutFunc, key) {
	const value = mockOptionsWithoutFunc[key];
	return typeof value === "number" ? value : void 0;
}
function getMockScalarJsTypes(definition, mockOptionsWithoutFunc) {
	const isArray = definition.endsWith("[]");
	const type = isArray ? definition.slice(0, -2) : definition;
	const arrayMin = getMockNumberOption(mockOptionsWithoutFunc, "arrayMin");
	const arrayMax = getMockNumberOption(mockOptionsWithoutFunc, "arrayMax");
	switch (type) {
		case "number": {
			const numArrParts = [];
			if (arrayMin !== void 0) numArrParts.push(`min: ${arrayMin}`);
			if (arrayMax !== void 0) numArrParts.push(`max: ${arrayMax}`);
			const numArrArg = numArrParts.length > 0 ? `{${numArrParts.join(", ")}}` : "";
			return isArray ? `Array.from({length: faker.number.int(${numArrArg})}, () => faker.number.int())` : "faker.number.int()";
		}
		case "string": {
			const strArrParts = [];
			if (arrayMin !== void 0) strArrParts.push(`min: ${arrayMin}`);
			if (arrayMax !== void 0) strArrParts.push(`max: ${arrayMax}`);
			const strArrArg = strArrParts.length > 0 ? `{${strArrParts.join(", ")}}` : "";
			return isArray ? `Array.from({length: faker.number.int(${strArrArg})}, () => faker.word.sample())` : "faker.word.sample()";
		}
		default: return "undefined";
	}
}
function getExampleEntries(examples) {
	if (Array.isArray(examples)) return examples;
	if (examples && typeof examples === "object") return Object.values(examples);
	return [];
}
function unwrapExampleValue(example) {
	if (example && typeof example === "object" && "value" in example) return example.value;
	return example;
}
function getResponsesMockDefinition({ operationId, tags, returnType, responses, mockOptionsWithoutFunc, transformer, context, mockOptions, splitMockImplementations }) {
	const result = {
		definitions: [],
		imports: []
	};
	for (const response of responses) {
		const { value: definition, example, examples, imports, isRef } = response;
		let { originalSchema } = response;
		if (context.output.override.mock?.useExamples || mockOptions?.useExamples) {
			const exampleValue = unwrapExampleValue(example ?? originalSchema?.example ?? getExampleEntries(examples)[0] ?? getExampleEntries(originalSchema?.examples)[0]);
			if (exampleValue !== void 0) {
				result.definitions.push(transformer ? transformer(exampleValue, returnType) : JSON.stringify(exampleValue));
				continue;
			}
		}
		if (!definition || generalJSTypesWithArray.includes(definition)) {
			const value = getMockScalarJsTypes(definition, mockOptionsWithoutFunc);
			result.definitions.push(transformer ? transformer(value, returnType) : value);
			continue;
		}
		if (!originalSchema && definition === "Blob") originalSchema = {
			type: "string",
			format: "binary"
		};
		else if (!originalSchema) continue;
		const resolvedSchema = resolveRef(originalSchema, context).schema;
		const scalar = getMockScalar({
			item: {
				...resolvedSchema,
				name: definition,
				...context.output.override.enumGenerationType === "enum" && isRef ? { isRef: true } : {}
			},
			imports,
			mockOptions: mockOptionsWithoutFunc,
			operationId,
			tags,
			context,
			existingReferencedProperties: [],
			splitMockImplementations,
			allowOverride: true
		});
		result.imports.push(...scalar.imports);
		result.definitions.push(transformer ? transformer(scalar.value, returnType) : scalar.value);
	}
	return result;
}
function getMockDefinition({ operationId, tags, returnType, responses, override, transformer, context, mockOptions, splitMockImplementations }) {
	const { definitions, imports } = getResponsesMockDefinition({
		operationId,
		tags,
		returnType,
		responses,
		mockOptionsWithoutFunc: getMockWithoutFunc(context.spec, override),
		transformer,
		context,
		mockOptions,
		splitMockImplementations
	});
	return {
		definition: "[" + definitions.join(", ") + "]",
		definitions,
		imports
	};
}
function getMockOptionsDataOverride(operationTags, operationId, override) {
	const responseOverride = override.operations[operationId]?.mock?.data ?? operationTags.map((operationTag) => override.tags[operationTag]?.mock?.data).find((e) => e !== void 0);
	return (isFunction(responseOverride) ? `(${String(responseOverride)})()` : stringify(responseOverride))?.replaceAll(/import_faker\.defaults|import_faker\.faker|_faker\.faker/g, "faker");
}
//#endregion
//#region src/msw/index.ts
function getMSWDependencies(options) {
	const hasDelay = options?.delay !== false;
	const locale = options?.locale;
	const exports = [
		{
			name: "http",
			values: true
		},
		{
			name: "HttpResponse",
			values: true
		},
		{
			name: "RequestHandlerOptions",
			values: false
		}
	];
	if (hasDelay) exports.push({
		name: "delay",
		values: true
	});
	return [{
		exports,
		dependency: "msw"
	}, {
		exports: [{
			name: "faker",
			values: true
		}],
		dependency: locale ? `@faker-js/faker/locale/${locale}` : "@faker-js/faker"
	}];
}
const generateMSWImports = ({ implementation, imports, projectName, hasSchemaDir, isAllowSyntheticDefaultImports, options }) => {
	return generateDependencyImports(implementation, [...getMSWDependencies(options), ...imports], projectName, hasSchemaDir, isAllowSyntheticDefaultImports);
};
function generateDefinition(name, route, getResponseMockFunctionNameBase, handlerNameBase, { operationId, response, verb, tags }, { override, context, mock }, returnType, status, responseImports, responses, contentTypes, splitMockImplementations) {
	const oldSplitMockImplementations = [...splitMockImplementations];
	const { definitions, definition, imports } = getMockDefinition({
		operationId,
		tags,
		returnType,
		responses,
		imports: responseImports,
		override,
		context,
		mockOptions: isFunction(mock) ? void 0 : mock,
		splitMockImplementations
	});
	const mockData = getMockOptionsDataOverride(tags, operationId, override);
	let value = "";
	if (mockData) value = mockData;
	else if (definitions.length > 1) value = `faker.helpers.arrayElement(${definition})`;
	else if (definitions[0]) value = definitions[0];
	const isResponseOverridable = value.includes(overrideVarName);
	const isTextLikeContentType = (ct) => ct.startsWith("text/") || ct === "application/xml" || ct.endsWith("+xml");
	const isTypeExactlyString = (typeExpr) => typeExpr.trim().replaceAll(/^\(+|\)+$/g, "") === "string";
	const isUnionContainingString = (typeExpr) => typeExpr.split("|").map((part) => part.trim().replaceAll(/^\(+|\)+$/g, "")).includes("string");
	const isBinaryLikeContentType = (ct) => ct === "application/octet-stream" || ct === "application/pdf" || ct.startsWith("image/") || ct.startsWith("audio/") || ct.startsWith("video/") || ct.startsWith("font/");
	const preferredContentType = isFunction(mock) ? void 0 : mock?.preferredContentType?.toLowerCase();
	const preferredContentTypeMatch = preferredContentType ? contentTypes.find((ct) => ct.toLowerCase() === preferredContentType) : void 0;
	const contentTypesByPreference = preferredContentTypeMatch ? [preferredContentTypeMatch] : contentTypes;
	const hasTextLikeContentType = contentTypes.some((ct) => isTextLikeContentType(ct));
	const isExactlyStringReturnType = isTypeExactlyString(returnType);
	const isTextResponse = isExactlyStringReturnType && hasTextLikeContentType || contentTypesByPreference.some((ct) => isTextLikeContentType(ct));
	const isBinaryResponse = returnType === "Blob" || contentTypesByPreference.some((ct) => isBinaryLikeContentType(ct));
	const isReturnHttpResponse = value && value !== "undefined";
	const getResponseMockFunctionName = `${getResponseMockFunctionNameBase}${pascal(name)}`;
	const handlerName = `${handlerNameBase}${pascal(name)}`;
	const addedSplitMockImplementations = splitMockImplementations.slice(oldSplitMockImplementations.length);
	splitMockImplementations.push(...addedSplitMockImplementations);
	const mockImplementations = addedSplitMockImplementations.length > 0 ? `${addedSplitMockImplementations.join("\n\n")}\n\n` : "";
	const mockReturnType = isBinaryResponse ? returnType.replaceAll(/\bBlob\b/g, "ArrayBuffer") : returnType;
	const isVoidUnionType = mockReturnType !== "void" && mockReturnType.split("|").some((part) => part.trim() === "void");
	const noContentStatusCode = isVoidUnionType ? responses.find((r) => r.value === "void")?.key ?? "204" : void 0;
	const nonVoidMockReturnType = isVoidUnionType ? mockReturnType.split("|").filter((part) => part.trim() !== "void").join(" | ").trim() : mockReturnType;
	const hasJsonContentType = contentTypesByPreference.some((ct) => ct.includes("json") || ct.includes("+json"));
	const hasStringReturnType = isTypeExactlyString(mockReturnType) || isUnionContainingString(mockReturnType);
	const overrideResponseType = `Partial<Extract<${nonVoidMockReturnType}, object>>`;
	const shouldPreferJsonResponse = hasJsonContentType && !hasStringReturnType;
	const needsRuntimeContentTypeSwitch = isTextResponse && hasJsonContentType && hasStringReturnType && mockReturnType !== "string";
	const mockImplementation = isReturnHttpResponse ? `${mockImplementations}export const ${getResponseMockFunctionName} = (${isResponseOverridable ? `overrideResponse: ${overrideResponseType} = {}` : ""})${mockData ? "" : `: ${nonVoidMockReturnType}`} => (${value})\n\n` : mockImplementations;
	const delay = getDelay(override, isFunction(mock) ? void 0 : mock);
	const infoParam = "info";
	const resolvedResponseExpr = `overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(${infoParam}) : overrideResponse)
    : ${getResponseMockFunctionName}()`;
	const statusCode = status === "default" ? 200 : status.replace(/XX$/, "00");
	const binaryContentType = (preferredContentTypeMatch && isBinaryLikeContentType(preferredContentTypeMatch) ? preferredContentTypeMatch : contentTypes.find((ct) => isBinaryLikeContentType(ct))) ?? "application/octet-stream";
	const firstTextCt = isExactlyStringReturnType && !!preferredContentTypeMatch && !isTextLikeContentType(preferredContentTypeMatch) && hasTextLikeContentType ? contentTypes.find((ct) => isTextLikeContentType(ct)) : contentTypesByPreference.find((ct) => isTextLikeContentType(ct));
	const textHelper = firstTextCt === "application/xml" || firstTextCt?.endsWith("+xml") ? "xml" : firstTextCt === "text/html" ? "html" : "text";
	let responseBody;
	let responsePrelude = "";
	if (isReturnHttpResponse) {
		if (isBinaryResponse) responsePrelude = `const binaryBody = ${resolvedResponseExpr};`;
		else if (isVoidUnionType || needsRuntimeContentTypeSwitch) responsePrelude = `const resolvedBody = ${resolvedResponseExpr};`;
		else if (isTextResponse && !shouldPreferJsonResponse) responsePrelude = `const resolvedBody = ${resolvedResponseExpr};
    const textBody = typeof resolvedBody === 'string' ? resolvedBody : JSON.stringify(resolvedBody ?? null);`;
	}
	if (!isReturnHttpResponse) responseBody = `new HttpResponse(null,
      { status: ${statusCode}
      })`;
	else if (isBinaryResponse) responseBody = `HttpResponse.arrayBuffer(
      binaryBody instanceof ArrayBuffer
        ? binaryBody
        : new ArrayBuffer(0),
      { status: ${statusCode},
        headers: { 'Content-Type': '${binaryContentType}' }
      })`;
	else if (isVoidUnionType) {
		let nonVoidBody;
		if (needsRuntimeContentTypeSwitch) nonVoidBody = `typeof resolvedBody === 'string'
        ? HttpResponse.${textHelper}(resolvedBody, { status: ${statusCode} })
        : HttpResponse.json(resolvedBody, { status: ${statusCode} })`;
		else if (isTextResponse && !shouldPreferJsonResponse) nonVoidBody = `HttpResponse.${textHelper}(
        typeof resolvedBody === 'string' ? resolvedBody : JSON.stringify(resolvedBody ?? null),
        { status: ${statusCode} })`;
		else nonVoidBody = `HttpResponse.json(resolvedBody, { status: ${statusCode} })`;
		responseBody = `resolvedBody === undefined
      ? new HttpResponse(null, { status: ${noContentStatusCode} })
      : ${nonVoidBody}`;
	} else if (needsRuntimeContentTypeSwitch) responseBody = `typeof resolvedBody === 'string'
      ? HttpResponse.${textHelper}(resolvedBody, { status: ${statusCode} })
      : HttpResponse.json(resolvedBody, { status: ${statusCode} })`;
	else if (isTextResponse && !shouldPreferJsonResponse) responseBody = `HttpResponse.${textHelper}(textBody,
      { status: ${statusCode}
      })`;
	else responseBody = `HttpResponse.json(${resolvedResponseExpr},
      { status: ${statusCode}
      })`;
	const infoType = `Parameters<Parameters<typeof http.${verb}>[1]>[0]`;
	const handlerImplementation = `
export const ${handlerName} = (overrideResponse?: ${mockReturnType} | ((${infoParam}: ${infoType}) => Promise<${mockReturnType}> | ${mockReturnType}), options?: RequestHandlerOptions) => {
  return http.${verb}('${route}', async (${infoParam}: ${infoType}) => {${delay === false ? "" : `await delay(${isFunction(delay) ? `(${String(delay)})()` : String(delay)});`}
  ${isReturnHttpResponse ? "" : `if (typeof overrideResponse === 'function') {await overrideResponse(info); }`}
  ${responsePrelude}
    return ${responseBody}
  }, options)
}\n`;
	const includeResponseImports = [...imports, ...response.imports.filter((r) => {
		const searchWords = [r.alias, r.name].filter((p) => Boolean(p?.length)).map((part) => escapeRegExp(part)).join("|");
		if (!searchWords) return false;
		const reg = new RegExp(String.raw`\b(${searchWords})\b`);
		return reg.test(handlerImplementation) || reg.test(mockImplementation);
	})];
	return {
		implementation: {
			function: mockImplementation,
			handlerName,
			handler: handlerImplementation
		},
		imports: includeResponseImports
	};
}
function generateMSW(generatorVerbOptions, generatorOptions) {
	const { pathRoute, override, mock } = generatorOptions;
	const { operationId, response } = generatorVerbOptions;
	const route = getRouteMSW(pathRoute, override.mock?.baseUrl ?? (isFunction(mock) ? void 0 : mock?.baseUrl));
	const handlerName = `get${pascal(operationId)}MockHandler`;
	const getResponseMockFunctionName = `get${pascal(operationId)}ResponseMock`;
	const splitMockImplementations = [];
	const baseDefinition = generateDefinition("", route, getResponseMockFunctionName, handlerName, generatorVerbOptions, generatorOptions, response.definition.success, response.types.success[0]?.key ?? "200", response.imports, response.types.success, response.contentTypes, splitMockImplementations);
	const mockImplementations = [baseDefinition.implementation.function];
	const handlerImplementations = [baseDefinition.implementation.handler];
	const imports = [...baseDefinition.imports];
	if (generatorOptions.mock && isObject(generatorOptions.mock) && generatorOptions.mock.generateEachHttpStatus) for (const statusResponse of [...response.types.success, ...response.types.errors]) {
		const definition = generateDefinition(statusResponse.key, route, getResponseMockFunctionName, handlerName, generatorVerbOptions, generatorOptions, statusResponse.value, statusResponse.key, response.imports, [statusResponse], [statusResponse.contentType], splitMockImplementations);
		mockImplementations.push(definition.implementation.function);
		handlerImplementations.push(definition.implementation.handler);
		imports.push(...definition.imports);
	}
	return {
		implementation: {
			function: mockImplementations.join("\n"),
			handlerName,
			handler: handlerImplementations.join("\n")
		},
		imports
	};
}
//#endregion
//#region src/index.ts
const DEFAULT_MOCK_OPTIONS = {
	type: "msw",
	useExamples: false
};
const generateMockImports = (importOptions) => {
	switch (importOptions.options?.type) {
		default: return generateMSWImports(importOptions);
	}
};
function generateMock(generatorVerbOptions, generatorOptions) {
	switch (generatorOptions.mock.type) {
		default: return generateMSW(generatorVerbOptions, generatorOptions);
	}
}
//#endregion
export { DEFAULT_MOCK_OPTIONS, generateMock, generateMockImports };

//# sourceMappingURL=index.mjs.map