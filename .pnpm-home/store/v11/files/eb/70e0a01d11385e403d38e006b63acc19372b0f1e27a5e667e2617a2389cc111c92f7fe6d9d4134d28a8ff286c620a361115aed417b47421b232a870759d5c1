import { t as __exportAll } from "./chunk-BpYLSNr0.mjs";
import { createRequire } from "node:module";
import { entries, groupBy, isArray, isBoolean, isBoolean as isBoolean$1, isEmptyish, isFunction, isNullish, isNullish as isNullish$1, isNumber, isString, isString as isString$1, prop, unique, uniqueBy, uniqueWith } from "remeda";
import { keyword } from "esutils";
import nodePath from "node:path";
import { compare } from "compare-versions";
import debug from "debug";
import { pathToFileURL } from "node:url";
import { createJiti } from "jiti";
import fs, { existsSync, readFileSync } from "node:fs";
import { globby } from "globby";
import readline from "node:readline";
import { styleText } from "node:util";
import { isDereferenced } from "@scalar/openapi-types/helpers";
import fs$1 from "fs-extra";
import { Parser } from "acorn";
import { build } from "esbuild";
//#region src/types.ts
const SupportedFormatter = {
	PRETTIER: "prettier",
	BIOME: "biome",
	OXFMT: "oxfmt"
};
const PropertySortOrder = {
	ALPHABETICAL: "Alphabetical",
	SPECIFICATION: "Specification"
};
const NamingConvention = {
	CAMEL_CASE: "camelCase",
	PASCAL_CASE: "PascalCase",
	SNAKE_CASE: "snake_case",
	KEBAB_CASE: "kebab-case"
};
const EnumGeneration = {
	CONST: "const",
	ENUM: "enum",
	UNION: "union"
};
const OutputClient = {
	ANGULAR: "angular",
	ANGULAR_QUERY: "angular-query",
	AXIOS: "axios",
	AXIOS_FUNCTIONS: "axios-functions",
	REACT_QUERY: "react-query",
	SOLID_START: "solid-start",
	SOLID_QUERY: "solid-query",
	SVELTE_QUERY: "svelte-query",
	VUE_QUERY: "vue-query",
	SWR: "swr",
	ZOD: "zod",
	HONO: "hono",
	FETCH: "fetch",
	MCP: "mcp"
};
const OutputHttpClient = {
	AXIOS: "axios",
	FETCH: "fetch",
	ANGULAR: "angular"
};
const OutputMode = {
	SINGLE: "single",
	SPLIT: "split",
	TAGS: "tags",
	TAGS_SPLIT: "tags-split"
};
const OutputMockType = { MSW: "msw" };
const FormDataArrayHandling = {
	SERIALIZE: "serialize",
	EXPLODE: "explode",
	SERIALIZE_WITH_BRACKETS: "serialize-with-brackets"
};
const Verbs = {
	POST: "post",
	PUT: "put",
	GET: "get",
	PATCH: "patch",
	DELETE: "delete",
	HEAD: "head"
};
const GetterPropType = {
	PARAM: "param",
	NAMED_PATH_PARAMS: "namedPathParams",
	BODY: "body",
	QUERY_PARAM: "queryParam",
	HEADER: "header"
};
const SchemaType = {
	integer: "integer",
	number: "number",
	string: "string",
	boolean: "boolean",
	object: "object",
	null: "null",
	array: "array",
	enum: "enum",
	unknown: "unknown"
};
var ErrorWithTag = class extends Error {
	tag;
	constructor(message, tag, options) {
		super(message, options);
		this.tag = tag;
	}
};
//#endregion
//#region src/constants.ts
const generalJSTypes = [
	"number",
	"string",
	"null",
	"unknown",
	"undefined",
	"object",
	"blob"
];
const generalJSTypesWithArray = generalJSTypes.flatMap((type) => [
	type,
	`Array<${type}>`,
	`${type}[]`
]);
const VERBS_WITH_BODY = [
	Verbs.POST,
	Verbs.PUT,
	Verbs.PATCH,
	Verbs.DELETE
];
const URL_REGEX = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
const TEMPLATE_TAG_REGEX = /\${(.+?)}/g;
//#endregion
//#region src/utils/assertion.ts
/**
* Discriminator helper for `ReferenceObject`
*
* @param property
*/
function isReference(obj) {
	return !isNullish$1(obj) && Object.hasOwn(obj, "$ref");
}
function isDirectory(pathValue) {
	return !nodePath.extname(pathValue);
}
function isObject(x) {
	return Object.prototype.toString.call(x) === "[object Object]";
}
function isStringLike(val) {
	if (isString$1(val)) return true;
	return Object.prototype.toString.call(val) === "[object String]";
}
function isModule(x) {
	return Object.prototype.toString.call(x) === "[object Module]";
}
function isNumeric(x) {
	if (typeof x === "number") return Number.isInteger(x);
	return isString$1(x) && /^-?\d+$/.test(x);
}
function isSchema(x) {
	if (!isObject(x)) return false;
	if (isString$1(x.type) && Object.values(SchemaType).includes(x.type)) return true;
	const combine = x.allOf ?? x.anyOf ?? x.oneOf;
	if (Array.isArray(combine)) return true;
	if (isObject(x.properties)) return true;
	return false;
}
function isVerb(verb) {
	return Object.values(Verbs).includes(verb);
}
function isUrl(str) {
	if (!str.trim()) return false;
	try {
		const url = new URL(str);
		return ["http:", "https:"].includes(url.protocol);
	} catch {
		return false;
	}
}
//#endregion
//#region src/utils/async-reduce.ts
async function asyncReduce(array, reducer, initValue) {
	let accumulate = initValue === null || initValue === Object(initValue) && !isFunction(initValue) ? Object.create(initValue) : initValue;
	for (const item of array) accumulate = await reducer(accumulate, item);
	return accumulate;
}
//#endregion
//#region src/utils/case.ts
const unicodes = function(s, prefix = "") {
	return s.replaceAll(/(^|-)/g, String.raw`$1\u` + prefix).replaceAll(",", String.raw`\u` + prefix);
};
const symbols = unicodes("20-26,28-2F,3A-40,5B-60,7B-7E,A0-BF,D7,F7", "00");
const lowers = "a-z" + unicodes("DF-F6,F8-FF", "00");
const uppers = "A-Z" + unicodes("C0-D6,D8-DE", "00");
const impropers = String.raw`A|An|And|As|At|But|By|En|For|If|In|Of|On|Or|The|To|Vs?\.?|Via`;
const regexps = {
	capitalize: new RegExp("(^|[" + symbols + "])([" + lowers + "])", "g"),
	pascal: new RegExp("(^|[" + symbols + "])+([" + lowers + uppers + "])", "g"),
	fill: new RegExp("[" + symbols + "]+(.|$)", "g"),
	sentence: new RegExp(String.raw`(^\s*|[\?\!\.]+"?\s+"?|,\s+")([` + lowers + "])", "g"),
	improper: new RegExp(String.raw`\b(` + impropers + String.raw`)\b`, "g"),
	relax: new RegExp("([^" + uppers + "])([" + uppers + "]*)([" + uppers + "])(?=[^" + uppers + "]|$)", "g"),
	upper: new RegExp("^[^" + lowers + "]+$"),
	hole: /[^\s]\s[^\s]/,
	apostrophe: /'/g,
	room: new RegExp("[" + symbols + "]")
};
const deapostrophe = (s) => {
	return s.replace(regexps.apostrophe, "");
};
const up = (s) => s.toUpperCase();
const low = (s) => s.toLowerCase();
const fill = (s, fillWith, isDeapostrophe = false) => {
	s = s.replace(regexps.fill, function(m, next) {
		return next ? fillWith + next : "";
	});
	if (isDeapostrophe) s = deapostrophe(s);
	return s;
};
const decap = (s, char = 0) => {
	return low(s.charAt(char)) + s.slice(char + 1);
};
const relax = (m, before, acronym, caps) => {
	return before + " " + (acronym ? acronym + " " : "") + caps;
};
const prep = (s, isFill = false, isPascal = false, isUpper = false) => {
	if (!isUpper && regexps.upper.test(s)) s = low(s);
	if (!isFill && !regexps.hole.test(s)) {
		var holey = fill(s, " ");
		if (regexps.hole.test(holey)) s = holey;
	}
	if (!isPascal && !regexps.room.test(s)) s = s.replace(regexps.relax, relax);
	return s;
};
const lower = (s, fillWith, isDeapostrophe) => {
	return fill(low(prep(s, !!fillWith)), fillWith, isDeapostrophe);
};
const pascalMemory = {};
function pascal(s = "") {
	if (pascalMemory[s]) return pascalMemory[s];
	const isStartWithUnderscore = s.startsWith("_");
	if (regexps.upper.test(s)) s = low(s);
	const pascalString = (s.match(/[a-zA-Z0-9\u00C0-\u017F]+/g) ?? []).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
	const pascalWithUnderscore = isStartWithUnderscore ? `_${pascalString}` : pascalString;
	pascalMemory[s] = pascalWithUnderscore;
	return pascalWithUnderscore;
}
function camel(s = "") {
	const isStartWithUnderscore = s.startsWith("_");
	const camelString = decap(pascal(s), isStartWithUnderscore ? 1 : 0);
	return isStartWithUnderscore ? `_${camelString}` : camelString;
}
function snake(s = "") {
	return lower(s, "_", true);
}
function kebab(s = "") {
	return lower(s, "-", true);
}
function upper(s, fillWith, isDeapostrophe) {
	return fill(up(prep(s, !!fillWith, false, true)), fillWith, isDeapostrophe);
}
function conventionName(name, convention) {
	let nameConventionTransform = camel;
	switch (convention) {
		case NamingConvention.PASCAL_CASE:
			nameConventionTransform = pascal;
			break;
		case NamingConvention.SNAKE_CASE:
			nameConventionTransform = snake;
			break;
		case NamingConvention.KEBAB_CASE:
			nameConventionTransform = kebab;
			break;
	}
	return nameConventionTransform(name);
}
//#endregion
//#region src/utils/compare-version.ts
function compareVersions(firstVersion, secondVersions, operator = ">=") {
	if (firstVersion === "latest" || firstVersion === "*") return true;
	if (firstVersion.startsWith("catalog:")) return true;
	return compare(firstVersion.replace(/(\s(.*))/, ""), secondVersions, operator);
}
//#endregion
//#region src/utils/content-type.ts
const binaryApplicationTypes = new Set([
	"application/octet-stream",
	"application/pdf",
	"application/zip"
]);
/**
* Determine if a content type is binary.
* Only known binary types return true. Unknown types default to false (non-binary)
* so that schema type information is preserved rather than being overridden with Blob.
*/
function isBinaryContentType(contentType) {
	const baseType = contentType.split(";")[0].trim();
	if (baseType.startsWith("image/")) return true;
	if (baseType.startsWith("audio/")) return true;
	if (baseType.startsWith("video/")) return true;
	if (baseType.startsWith("font/")) return true;
	return binaryApplicationTypes.has(baseType);
}
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
function getFormDataFieldFileType(resolvedSchema, partContentType) {
	if (resolvedSchema.type !== "string") return;
	if (resolvedSchema.contentEncoding) return;
	const contentMediaType = resolvedSchema.contentMediaType;
	const effectiveContentType = partContentType ?? contentMediaType;
	if (effectiveContentType) return isBinaryContentType(effectiveContentType) ? "binary" : "text";
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
function filterByContentType(items, filter) {
	if (!filter) return items;
	return items.filter((item) => {
		const shouldInclude = !filter.include || filter.include.includes(item.contentType);
		const shouldExclude = filter.exclude?.includes(item.contentType) ?? false;
		return shouldInclude && !shouldExclude;
	});
}
//#endregion
//#region src/utils/debug.ts
const filter = process.env.ORVAL_DEBUG_FILTER;
const DEBUG = process.env.DEBUG;
function createDebugger(ns, options = {}) {
	const log = debug(ns);
	const { onlyWhenFocused } = options;
	const focus = isString(onlyWhenFocused) ? onlyWhenFocused : ns;
	return (msg, ...args) => {
		if (filter && !msg.includes(filter)) return;
		if (onlyWhenFocused && !DEBUG?.includes(focus)) return;
		log(msg, ...args);
	};
}
//#endregion
//#region src/utils/doc.ts
const search = String.raw`\*/`;
const replacement = String.raw`*\/`;
const regex$1 = new RegExp(search, "g");
function jsDoc(schema, tryOneLine = false, context) {
	if (context?.output.override.jsDoc) {
		const { filter } = context.output.override.jsDoc;
		if (filter) return keyValuePairsToJsDoc(filter(schema));
	}
	const { description, deprecated, summary, minLength, maxLength, minimum, maximum, exclusiveMinimum, exclusiveMaximum, minItems, maxItems, pattern } = schema;
	const isNullable = schema.type === "null" || Array.isArray(schema.type) && schema.type.includes("null");
	const lines = (Array.isArray(description) ? description.filter((d) => !d.includes("eslint-disable")) : [description ?? ""]).map((line) => line.replaceAll(regex$1, replacement));
	const count = [
		description,
		deprecated,
		summary,
		minLength?.toString(),
		maxLength?.toString(),
		minimum?.toString(),
		maximum?.toString(),
		exclusiveMinimum?.toString(),
		exclusiveMaximum?.toString(),
		minItems?.toString(),
		maxItems?.toString(),
		isNullable ? "null" : "",
		pattern
	].filter(Boolean).length;
	if (!count) return "";
	const oneLine = count === 1 && tryOneLine;
	const eslintDisable = Array.isArray(description) ? description.find((d) => d.includes("eslint-disable"))?.replaceAll(regex$1, replacement) : void 0;
	let doc = `${eslintDisable ? `/* ${eslintDisable} */\n` : ""}/**`;
	if (description) {
		if (!oneLine) doc += `\n${tryOneLine ? "  " : ""} *`;
		doc += ` ${lines.join("\n * ")}`;
	}
	function appendPrefix() {
		if (!oneLine) doc += `\n${tryOneLine ? "  " : ""} *`;
	}
	function tryAppendStringDocLine(key, value) {
		if (value) {
			appendPrefix();
			doc += ` @${key} ${value.replaceAll(regex$1, replacement)}`;
		}
	}
	function tryAppendBooleanDocLine(key, value) {
		if (value === true) {
			appendPrefix();
			doc += ` @${key}`;
		}
	}
	function tryAppendNumberDocLine(key, value) {
		if (value !== void 0) {
			appendPrefix();
			doc += ` @${key} ${value}`;
		}
	}
	tryAppendBooleanDocLine("deprecated", deprecated);
	tryAppendStringDocLine("summary", summary?.replaceAll(regex$1, replacement));
	tryAppendNumberDocLine("minLength", minLength);
	tryAppendNumberDocLine("maxLength", maxLength);
	tryAppendNumberDocLine("minimum", minimum);
	tryAppendNumberDocLine("maximum", maximum);
	tryAppendNumberDocLine("exclusiveMinimum", exclusiveMinimum);
	tryAppendNumberDocLine("exclusiveMaximum", exclusiveMaximum);
	tryAppendNumberDocLine("minItems", minItems);
	tryAppendNumberDocLine("maxItems", maxItems);
	tryAppendBooleanDocLine("nullable", isNullable);
	tryAppendStringDocLine("pattern", pattern);
	doc += oneLine ? " " : `\n ${tryOneLine ? "  " : ""}`;
	doc += "*/\n";
	return doc;
}
function keyValuePairsToJsDoc(keyValues) {
	if (keyValues.length === 0) return "";
	let doc = "/**\n";
	for (const { key, value } of keyValues) doc += ` * @${key} ${value}\n`;
	doc += " */\n";
	return doc;
}
//#endregion
//#region src/utils/dynamic-import.ts
const TS_MODULE_EXTENSIONS = new Set([
	".ts",
	".mts",
	".cts",
	".tsx",
	".jsx"
]);
async function dynamicImport(toImport, from = process.cwd(), takeDefault = true) {
	if (!toImport) return toImport;
	try {
		if (isString(toImport)) {
			const filePath = nodePath.resolve(from, toImport);
			const extension = nodePath.extname(filePath);
			if (TS_MODULE_EXTENSIONS.has(extension)) {
				const data = await createJiti(from, { interopDefault: true }).import(filePath);
				if (takeDefault && (isObject(data) || isModule(data)) && data.default) return data.default;
				return data;
			}
			const fileUrl = pathToFileURL(filePath);
			const data = extension === ".json" ? await import(fileUrl.href, { with: { type: "json" } }) : await import(fileUrl.href);
			if (takeDefault && (isObject(data) || isModule(data)) && data.default) return data.default;
			return data;
		}
		return toImport;
	} catch (error) {
		throw new Error(`Oups... 🍻. Path: ${String(toImport)} => ${String(error)}`, { cause: error });
	}
}
//#endregion
//#region src/utils/extension.ts
function getExtension(path) {
	return path.toLowerCase().includes(".yaml") || path.toLowerCase().includes(".yml") ? "yaml" : "json";
}
//#endregion
//#region src/utils/file.ts
function getFileInfo(target = "", { backupFilename = "filename", extension = ".ts" } = {}) {
	const isDir = isDirectory(target);
	const filePath = isDir ? nodePath.join(target, backupFilename + extension) : target;
	return {
		path: filePath,
		pathWithoutExtension: filePath.replace(/\.[^/.]+$/, ""),
		extension,
		isDirectory: isDir,
		dirname: nodePath.dirname(filePath),
		filename: nodePath.basename(filePath, extension.startsWith(".") ? extension : `.${extension}`)
	};
}
async function removeFilesAndEmptyFolders(patterns, dir) {
	const files = await globby(patterns, {
		cwd: dir,
		absolute: true
	});
	await Promise.all(files.map((file) => fs.promises.unlink(file)));
	const sortedDirectories = (await globby(["**/*"], {
		cwd: dir,
		absolute: true,
		onlyDirectories: true
	})).toSorted((a, b) => {
		const depthA = a.split("/").length;
		return b.split("/").length - depthA;
	});
	for (const directory of sortedDirectories) try {
		if ((await fs.promises.readdir(directory)).length === 0) await fs.promises.rmdir(directory);
	} catch {}
}
//#endregion
//#region src/utils/file-extensions.ts
function getMockFileExtensionByTypeName(mock) {
	if (isFunction(mock)) return "msw";
	switch (mock.type) {
		default: return "msw";
	}
}
//#endregion
//#region src/utils/get-property-safe.ts
/**
* Type safe way to get arbitrary property from an object.
*
* @param obj - The object from which to retrieve the property.
* @param propertyName - The name of the property to retrieve.
* @returns Object with `hasProperty: true` and `value` of the property if it exists; otherwise `hasProperty: false` and undefined.
*
* @remarks Until TypeScript adds type-narrowing for Object.hasOwn we have to use this workaround
*/
function getPropertySafe(obj, propertyName) {
	if (Object.hasOwn(obj, propertyName)) return {
		hasProperty: true,
		value: obj[propertyName]
	};
	return {
		hasProperty: false,
		value: void 0
	};
}
//#endregion
//#region src/utils/is-body-verb.ts
function getIsBodyVerb(verb) {
	return VERBS_WITH_BODY.includes(verb);
}
//#endregion
//#region src/utils/logger.ts
const log = console.log;
let _warningCount = 0;
function logWarning(message) {
	_warningCount++;
	log(styleText("yellow", message));
}
function getWarningCount() {
	return _warningCount;
}
function resetWarnings() {
	_warningCount = 0;
}
let _verbose = false;
function setVerbose(v) {
	_verbose = v;
}
function isVerbose() {
	return _verbose;
}
const logVerbose = (...args) => {
	if (_verbose) log(...args);
};
function startMessage({ name, version, description }) {
	return `🍻 ${styleText(["cyan", "bold"], name)} ${styleText("green", `v${version}`)}${description ? ` - ${description}` : ""}`;
}
function logError(err, tag) {
	let message;
	if (err instanceof Error) {
		message = (err.message || err.stack) ?? "Unknown error";
		if (err.cause) {
			const causeMsg = err.cause instanceof Error ? err.cause.message : isString(err.cause) ? err.cause : JSON.stringify(err.cause, void 0, 2);
			message += `\n  Cause: ${causeMsg}`;
		}
	} else message = String(err);
	log(styleText("red", [
		"🛑",
		tag ? `${tag} -` : void 0,
		message
	].filter(Boolean).join(" ")));
}
function mismatchArgsMessage(mismatchArgs) {
	logWarning(`${mismatchArgs.join(", ")} ${mismatchArgs.length === 1 ? "is" : "are"} not defined in your configuration!`);
}
function createSuccessMessage(backend) {
	log(`🎉 ${backend ? `${styleText("green", backend)} - ` : ""}Your OpenAPI spec has been converted into ready to use orval!`);
}
const LogLevels = {
	silent: 0,
	error: 1,
	warn: 2,
	info: 3
};
let lastType;
let lastMsg;
let sameCount = 0;
function clearScreen() {
	const repeatCount = process.stdout.rows - 2;
	const blank = repeatCount > 0 ? "\n".repeat(repeatCount) : "";
	console.log(blank);
	readline.cursorTo(process.stdout, 0, 0);
	readline.clearScreenDown(process.stdout);
}
function createLogger(level = "info", options = {}) {
	const { prefix = "[vite]", allowClearScreen = true } = options;
	const thresh = LogLevels[level];
	const clear = allowClearScreen && process.stdout.isTTY && !process.env.CI ? clearScreen : () => {};
	function output(type, msg, options = {}) {
		if (thresh >= LogLevels[type]) {
			const method = type === "info" ? "log" : type;
			const format = () => {
				if (options.timestamp) {
					const tag = type === "info" ? styleText(["cyan", "bold"], prefix) : type === "warn" ? styleText(["yellow", "bold"], prefix) : styleText(["red", "bold"], prefix);
					return `${styleText("dim", (/* @__PURE__ */ new Date()).toLocaleTimeString())} ${tag} ${msg}`;
				} else return msg;
			};
			if (type === lastType && msg === lastMsg) {
				sameCount++;
				clear();
				console[method](format(), styleText("yellow", `(x${sameCount + 1})`));
			} else {
				sameCount = 0;
				lastMsg = msg;
				lastType = type;
				if (options.clear) clear();
				console[method](format());
			}
		}
	}
	const warnedMessages = /* @__PURE__ */ new Set();
	const logger = {
		hasWarned: false,
		info(msg, opts) {
			output("info", msg, opts);
		},
		warn(msg, opts) {
			logger.hasWarned = true;
			output("warn", msg, opts);
		},
		warnOnce(msg, opts) {
			if (warnedMessages.has(msg)) return;
			logger.hasWarned = true;
			output("warn", msg, opts);
			warnedMessages.add(msg);
		},
		error(msg, opts) {
			logger.hasWarned = true;
			output("error", msg, opts);
		},
		clearScreen(type) {
			if (thresh >= LogLevels[type]) clear();
		}
	};
	return logger;
}
//#endregion
//#region src/utils/merge-deep.ts
function mergeDeep(source, target) {
	if (!isObject(target) || !isObject(source)) return source;
	const acc = Object.assign({}, source);
	for (const [key, value] of Object.entries(target)) {
		const sourceValue = acc[key];
		if (Array.isArray(sourceValue) && Array.isArray(value)) acc[key] = [...sourceValue, ...value];
		else if (isObject(sourceValue) && isObject(value)) acc[key] = mergeDeep(sourceValue, value);
		else acc[key] = value;
	}
	return acc;
}
//#endregion
//#region src/utils/occurrence.ts
function count(str = "", key) {
	if (!str) return 0;
	return (str.match(new RegExp(key, "g")) ?? []).length;
}
//#endregion
//#region src/utils/path.ts
var path_exports = /* @__PURE__ */ __exportAll({
	getRelativeImportPath: () => getRelativeImportPath,
	getSchemaFileName: () => getSchemaFileName,
	join: () => join,
	joinSafe: () => joinSafe,
	normalizeSafe: () => normalizeSafe,
	relativeSafe: () => relativeSafe,
	separator: () => "/",
	toUnix: () => toUnix
});
function toUnix(value) {
	value = value.replaceAll("\\", "/");
	value = value.replaceAll(/(?<!^)\/+/g, "/");
	return value;
}
function join(...args) {
	return toUnix(nodePath.join(...args.map((a) => toUnix(a))));
}
/**
* Behaves exactly like `path.relative(from, to)`, but keeps the first meaningful "./"
*/
function relativeSafe(from, to) {
	return normalizeSafe(`./${toUnix(nodePath.relative(toUnix(from), toUnix(to)))}`);
}
function getSchemaFileName(path) {
	return path.replace(`.${getExtension(path)}`, "").slice(path.lastIndexOf("/") + 1);
}
function normalizeSafe(value) {
	let result;
	value = toUnix(value);
	result = toUnix(nodePath.normalize(value));
	if (value.startsWith("./") && !result.startsWith("./") && !result.startsWith("..")) result = "./" + result;
	else if (value.startsWith("//") && !result.startsWith("//")) result = value.startsWith("//./") ? "//." + result : "/" + result;
	return result;
}
function joinSafe(...values) {
	let result = toUnix(nodePath.join(...values.map((v) => toUnix(v))));
	if (values.length > 0) {
		const firstValue = toUnix(values[0]);
		if (firstValue.startsWith("./") && !result.startsWith("./") && !result.startsWith("..")) result = "./" + result;
		else if (firstValue.startsWith("//") && !result.startsWith("//")) result = firstValue.startsWith("//./") ? "//." + result : "/" + result;
	}
	return result;
}
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
function getRelativeImportPath(importerFilePath, exporterFilePath, includeFileExtension = false) {
	if (!nodePath.isAbsolute(importerFilePath)) throw new Error(`'importerFilePath' is not an absolute path. "${importerFilePath}"`);
	if (!nodePath.isAbsolute(exporterFilePath)) throw new Error(`'exporterFilePath' is not an absolute path. "${exporterFilePath}"`);
	const importerDir = nodePath.dirname(importerFilePath);
	const relativePath = nodePath.relative(importerDir, exporterFilePath);
	let posixPath = nodePath.posix.join(...relativePath.split(nodePath.sep));
	if (!posixPath.startsWith("./") && !posixPath.startsWith("../")) posixPath = `./${posixPath}`;
	if (!includeFileExtension) {
		const ext = nodePath.extname(posixPath);
		if (ext && posixPath.endsWith(ext)) posixPath = posixPath.slice(0, -ext.length);
	}
	return posixPath;
}
//#endregion
//#region src/utils/resolve-version.ts
function resolveInstalledVersion(packageName, fromDir) {
	try {
		const require = createRequire(nodePath.join(fromDir, "noop.js"));
		try {
			return require(`${packageName}/package.json`).version;
		} catch (directError) {
			if (directError instanceof Error && "code" in directError && directError.code === "ERR_PACKAGE_PATH_NOT_EXPORTED") {
				const entryPath = require.resolve(packageName);
				let dir = nodePath.dirname(entryPath);
				while (dir !== nodePath.parse(dir).root) {
					const pkgPath = nodePath.join(dir, "package.json");
					if (existsSync(pkgPath)) {
						const pkgData = JSON.parse(readFileSync(pkgPath, "utf8"));
						if (pkgData.name === packageName) return pkgData.version;
					}
					dir = nodePath.dirname(dir);
				}
				return;
			}
			throw directError;
		}
	} catch {
		return;
	}
}
function resolveInstalledVersions(packageJson, fromDir) {
	const resolved = {};
	const allDeps = new Set([
		...Object.keys(packageJson.dependencies ?? {}),
		...Object.keys(packageJson.devDependencies ?? {}),
		...Object.keys(packageJson.peerDependencies ?? {})
	]);
	for (const pkgName of allDeps) {
		const version = resolveInstalledVersion(pkgName, fromDir);
		if (version) resolved[pkgName] = version;
	}
	return resolved;
}
//#endregion
//#region src/utils/sort.ts
const sortByPriority = (arr) => arr.toSorted((a, b) => {
	if (a.default) return 1;
	if (b.default) return -1;
	if (a.required && b.required) return 0;
	if (a.required) return -1;
	if (b.required) return 1;
	return 0;
});
//#endregion
//#region src/utils/string.ts
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
function stringify(data) {
	if (data === void 0) return;
	if (data === null) return "null";
	if (isString(data)) return `'${data.replaceAll("'", String.raw`\'`)}'`;
	if (isNumber(data) || isBoolean(data) || isFunction(data)) return String(data);
	if (Array.isArray(data)) return `[${data.map((item) => stringify(item)).join(", ")}]`;
	const entries = Object.entries(data);
	let result = "";
	for (const [index, [key, value]] of entries.entries()) {
		const strValue = stringify(value);
		if (entries.length === 1) result = `{ ${key}: ${strValue}, }`;
		else if (!index) result = `{ ${key}: ${strValue}, `;
		else if (entries.length - 1 === index) result += `${key}: ${strValue}, }`;
		else result += `${key}: ${strValue}, `;
	}
	return result;
}
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
function sanitize(value, options) {
	const { whitespace = "", underscore = "", dot = "", dash = "", es5keyword = false, es5IdentifierName = false, special = false } = options ?? {};
	let newValue = value;
	if (!special) newValue = newValue.replaceAll(/[!"`'#%&,:;<>=@{}~$()*+/\\?[\]^|]/g, "");
	if (whitespace !== true) newValue = newValue.replaceAll(/[\s]/g, whitespace);
	if (underscore !== true) newValue = newValue.replaceAll(/['_']/g, underscore);
	if (dot !== true) newValue = newValue.replaceAll(/[.]/g, dot);
	if (dash !== true) newValue = newValue.replaceAll(/[-]/g, dash);
	if (es5keyword) newValue = keyword.isKeywordES5(newValue, true) ? `_${newValue}` : newValue;
	if (es5IdentifierName) if (/^[0-9]/.test(newValue)) newValue = `N${newValue}`;
	else newValue = keyword.isIdentifierNameES5(newValue) ? newValue : `_${newValue}`;
	return newValue;
}
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
function toObjectString(props, path) {
	if (props.length === 0) return "";
	return (isString(path) ? props.map((prop) => {
		let obj = prop;
		for (const key of path.split(".")) obj = obj && (isObject(obj) || Array.isArray(obj)) ? obj[key] : void 0;
		return obj;
	}) : props).join(",\n    ") + ",";
}
const NUMBERS = {
	"0": "zero",
	"1": "one",
	"2": "two",
	"3": "three",
	"4": "four",
	"5": "five",
	"6": "six",
	"7": "seven",
	"8": "eight",
	"9": "nine"
};
/**
* Converts a number to its word representation by translating each digit to its word form.
*
* @param num - The number to convert to words.
* @returns A string containing the word representation of each digit concatenated together.
* @example
* getNumberWord(123) // returns "onetwothree"
* getNumberWord(42) // returns "fourtwo"
*/
function getNumberWord(num) {
	return [...num.toString()].reduce((acc, n) => acc + NUMBERS[n], "");
}
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
function escape(str, char = "'") {
	return str?.replaceAll(char, `\\${char}`);
}
/**
* Escapes regular expression metacharacters in a string so it can be safely
* embedded inside a RegExp pattern.
*
* @param value - The raw string value to escape for regex usage.
* @returns The escaped string.
* @example
* escapeRegExp('foo$bar') // returns 'foo\\$bar'
*/
function escapeRegExp(value) {
	return value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}
/**
* Escape all characters not included in SingleStringCharacters and
* DoubleStringCharacters on
* http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4
*
* Based on https://github.com/joliss/js-string-escape/blob/master/index.js
*
* @param input String to escape
*/
function jsStringEscape(input) {
	return input.replaceAll(/["'\\\n\r\u2028\u2029/*]/g, (character) => {
		switch (character) {
			case "\"":
			case "'":
			case "\\":
			case "/":
			case "*": return "\\" + character;
			case "\n": return String.raw`\n`;
			case "\r": return String.raw`\r`;
			case "\u2028": return String.raw`\u2028`;
			case "\u2029": return String.raw`\u2029`;
			default: return "";
		}
	});
}
/**
* Deduplicates a TypeScript union type string.
* Handles types like "A | B | B" → "A | B" and "null | null" → "null".
* Only splits on top-level | (not inside {} () [] <> or string literals).
*/
function dedupeUnionType(unionType) {
	const parts = [];
	let current = "";
	let depth = 0;
	let quote = "";
	let escaped = false;
	for (const c of unionType) {
		if (!escaped && (c === "'" || c === "\"")) {
			if (!quote) quote = c;
			else if (quote === c) quote = "";
		}
		if (!quote) {
			if ("{([<".includes(c)) depth++;
			if ("})]>".includes(c)) depth--;
			if (c === "|" && depth === 0) {
				parts.push(current.trim());
				current = "";
				continue;
			}
		}
		current += c;
		escaped = !!quote && !escaped && c === "\\";
	}
	if (current.trim()) parts.push(current.trim());
	return [...new Set(parts)].join(" | ");
}
//#endregion
//#region src/utils/tsconfig.ts
function isSyntheticDefaultImportsAllow(config) {
	if (!config) return true;
	return !!(config.compilerOptions?.allowSyntheticDefaultImports ?? config.compilerOptions?.esModuleInterop);
}
//#endregion
//#region src/getters/enum.ts
/**
* Map of special characters to semantic word replacements.
*
* Applied before naming convention transforms (PascalCase, camelCase, …) so
* that characters which would otherwise be stripped still contribute a unique
* segment to the generated key.  Without this, values like "created_at" and
* "-created_at" both PascalCase to "CreatedAt", silently overwriting one
* another in the generated const/enum object.
*
* Only characters that appear as leading/trailing modifiers in real-world
* OpenAPI enums are mapped — the list is intentionally conservative to avoid
* changing output for schemas that don't hit collisions.
*/
const ENUM_SPECIAL_CHARACTER_MAP = {
	"-": "minus",
	"+": "plus"
};
/**
* Replace special characters with semantic words (plus an underscore separator)
* so that naming convention transforms (PascalCase, etc.) produce unique keys.
*
* The trailing underscore acts as a word boundary so that PascalCase treats the
* replacement as a separate word: "-created_at" → "minus_created_at" → "MinusCreatedAt".
*/
function replaceSpecialCharacters(key) {
	let result = "";
	for (const char of key) {
		const replacement = ENUM_SPECIAL_CHARACTER_MAP[char];
		result += replacement ? replacement + "_" : char;
	}
	return result;
}
function getEnumNames(schemaObject) {
	const names = schemaObject?.["x-enumNames"] ?? schemaObject?.["x-enumnames"] ?? schemaObject?.["x-enum-varnames"];
	if (!names) return;
	if (Array.isArray(names)) return names.map((name) => jsStringEscape(name));
	if (typeof names === "object") return (schemaObject?.enum ?? []).map((enumVal) => {
		const key = String(enumVal);
		return key in names ? jsStringEscape(names[key]) : void 0;
	});
}
function getEnumDescriptions(schemaObject) {
	const descriptions = schemaObject?.["x-enumDescriptions"] ?? schemaObject?.["x-enumdescriptions"] ?? schemaObject?.["x-enum-descriptions"];
	if (!descriptions) return;
	if (Array.isArray(descriptions)) return descriptions.map((description) => jsStringEscape(description));
	if (typeof descriptions === "object") return (schemaObject?.enum ?? []).map((enumVal) => {
		const key = String(enumVal);
		return key in descriptions ? jsStringEscape(descriptions[key]) : void 0;
	});
}
function getEnum(value, enumName, names, enumGenerationType, descriptions, enumNamingConvention) {
	if (enumGenerationType === EnumGeneration.CONST) return getTypeConstEnum(value, enumName, names, descriptions, enumNamingConvention);
	if (enumGenerationType === EnumGeneration.ENUM) return getNativeEnum(value, enumName, names, enumNamingConvention);
	return getUnion(value, enumName);
}
const getTypeConstEnum = (value, enumName, names, descriptions, enumNamingConvention) => {
	let enumValue = `export type ${enumName} = typeof ${enumName}[keyof typeof ${enumName}]`;
	if (value.endsWith(" | null")) {
		value = value.replace(" | null", "");
		enumValue += " | null";
	}
	enumValue += ";\n";
	const implementation = getEnumImplementation(value, names, descriptions, enumNamingConvention);
	enumValue += "\n\n";
	enumValue += `export const ${enumName} = {\n${implementation}} as const;\n`;
	return enumValue;
};
/**
* Derive the object/enum key for a single enum value.
*
* Handles numeric prefixes, sanitization, and optional naming convention
* transforms.  When `disambiguate` is true, special characters (-/+) are
* replaced with semantic words before the convention transform to prevent
* key collisions.
*/
function deriveEnumKey(val, enumNamingConvention, disambiguate = false) {
	let key = val.startsWith("'") ? val.slice(1, -1) : val;
	if (isNumeric(key)) key = toNumberKey(key);
	if (key.length > 1) key = sanitize(key, {
		whitespace: "_",
		underscore: true,
		dash: true,
		special: true
	});
	if (enumNamingConvention) {
		if (disambiguate) key = replaceSpecialCharacters(key);
		key = conventionName(key, enumNamingConvention);
	}
	return key;
}
function getEnumImplementation(value, names, descriptions, enumNamingConvention) {
	if (value === "") return "";
	const uniqueValues = [...new Set(value.split(" | "))];
	const disambiguate = !!enumNamingConvention && new Set(uniqueValues.map((v) => deriveEnumKey(v, enumNamingConvention))).size < uniqueValues.length;
	let result = "";
	for (const [index, val] of uniqueValues.entries()) {
		const name = names?.[index];
		const description = descriptions?.[index];
		const comment = description ? `  /** ${description} */\n` : "";
		if (name) {
			result += comment + `  ${keyword.isIdentifierNameES5(name) ? name : `'${name}'`}: ${val},\n`;
			continue;
		}
		const key = deriveEnumKey(val, enumNamingConvention, disambiguate);
		result += comment + `  ${keyword.isIdentifierNameES5(key) ? key : `'${key}'`}: ${val},\n`;
	}
	return result;
}
const getNativeEnum = (value, enumName, names, enumNamingConvention) => {
	return `export enum ${enumName} {\n${getNativeEnumItems(value, names, enumNamingConvention)}\n}`;
};
const getNativeEnumItems = (value, names, enumNamingConvention) => {
	if (value === "") return "";
	const uniqueValues = [...new Set(value.split(" | "))];
	const disambiguate = !!enumNamingConvention && new Set(uniqueValues.map((v) => deriveEnumKey(v, enumNamingConvention))).size < uniqueValues.length;
	let result = "";
	for (const [index, val] of uniqueValues.entries()) {
		const name = names?.[index];
		if (name) {
			result += `  ${keyword.isIdentifierNameES5(name) ? name : `'${name}'`}= ${val},\n`;
			continue;
		}
		const key = deriveEnumKey(val, enumNamingConvention, disambiguate);
		result += `  ${keyword.isIdentifierNameES5(key) ? key : `'${key}'`}= ${val},\n`;
	}
	return result;
};
const toNumberKey = (value) => {
	if (value.startsWith("-")) return `NUMBER_MINUS_${value.slice(1)}`;
	if (value.startsWith("+")) return `NUMBER_PLUS_${value.slice(1)}`;
	return `NUMBER_${value}`;
};
const getUnion = (value, enumName) => {
	return `export type ${enumName} = ${value};`;
};
function getEnumUnionFromSchema(schema) {
	if (!schema?.enum) return "";
	return schema.enum.filter((val) => val !== null).map((val) => isString(val) ? `'${escape(val)}'` : String(val)).join(" | ");
}
const stripNullUnion = (value) => value.replaceAll(/\s*\|\s*null/g, "").trim();
const isSpreadableEnumRef = (schema, refName) => {
	if (!schema?.enum || !refName) return false;
	if (!getEnumUnionFromSchema(schema)) return false;
	const type = schema.type;
	if (type === "boolean" || Array.isArray(type) && type.includes("boolean")) return false;
	return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(refName);
};
const buildInlineEnum = (schema, enumValue) => {
	const names = getEnumNames(schema);
	const descriptions = getEnumDescriptions(schema);
	return getEnumImplementation(enumValue ?? getEnumUnionFromSchema(schema), names, descriptions);
};
function getCombinedEnumValue(inputs) {
	const valueImports = [];
	const hasNull = inputs.some((input) => {
		if (input.value.includes("| null")) return true;
		const schema = input.schema;
		if (!schema) return false;
		if (schema.nullable === true) return true;
		if (Array.isArray(schema.type) && schema.type.includes("null")) return true;
		return schema.enum?.includes(null) ?? false;
	});
	const addValueImport = (name) => {
		if (!valueImports.includes(name)) valueImports.push(name);
	};
	if (inputs.length === 1) {
		const input = inputs[0];
		if (input.isRef) {
			const refName = stripNullUnion(input.value);
			if (isSpreadableEnumRef(input.schema, refName)) {
				addValueImport(refName);
				return {
					value: refName,
					valueImports,
					hasNull
				};
			}
			return {
				value: `{${buildInlineEnum(input.schema)}} as const`,
				valueImports,
				hasNull
			};
		}
		return {
			value: `{${buildInlineEnum(input.schema, stripNullUnion(input.value))}} as const`,
			valueImports,
			hasNull
		};
	}
	return {
		value: `{${inputs.map((input) => {
			if (input.isRef) {
				const refName = stripNullUnion(input.value);
				if (isSpreadableEnumRef(input.schema, refName)) {
					addValueImport(refName);
					return `...${refName},`;
				}
				return buildInlineEnum(input.schema);
			}
			return buildInlineEnum(input.schema, stripNullUnion(input.value));
		}).join("")}} as const`,
		valueImports,
		hasNull
	};
}
//#endregion
//#region src/getters/ref.ts
const RefComponentSuffix = {
	schemas: "",
	responses: "Response",
	parameters: "Parameter",
	requestBodies: "Body"
};
const regex = /* @__PURE__ */ new RegExp("~1", "g");
/**
* Return the output type from the $ref
*
* @param $ref
*/
function getRefInfo($ref, context) {
	const [pathname, ref] = $ref.split("#");
	const refPaths = ref.slice(1).split("/").map((part) => decodeURIComponent(part.replaceAll(regex, "/")));
	const getOverrideSuffix = (override, paths) => {
		const firstLevel = override[paths[0]];
		if (!firstLevel) return "";
		return firstLevel[paths[1]]?.suffix ?? "";
	};
	const suffix = getOverrideSuffix(context.output.override, refPaths);
	const originalName = ref ? refPaths.at(-1) ?? "" : getSchemaFileName(pathname);
	if (!pathname) return {
		name: sanitize(pascal(originalName) + suffix, {
			es5keyword: true,
			es5IdentifierName: true,
			underscore: true,
			dash: true
		}),
		originalName,
		refPaths
	};
	return {
		name: sanitize(pascal(originalName) + suffix, {
			es5keyword: true,
			es5IdentifierName: true,
			underscore: true,
			dash: true
		}),
		originalName,
		refPaths
	};
}
//#endregion
//#region src/resolvers/ref.ts
const REF_NOT_FOUND_PREFIX = "Oops... 🍻. Ref not found";
/**
* Recursively resolves a `$ref` in an OpenAPI document, following
* nested schema refs and collecting imports along the way.
*
* Handles OpenAPI 3.0 `nullable` and 3.1 type-array hints on direct refs.
*
* @see https://spec.openapis.org/oas/v3.0.3#reference-object
* @see https://spec.openapis.org/oas/v3.1.0#reference-object
*/
function resolveRef(schema, context, imports = []) {
	const refPath = "$ref" in schema ? schema.$ref : void 0;
	const nestedSchema = "schema" in schema ? schema.schema : void 0;
	if (isObject(nestedSchema) && isReference(nestedSchema) && typeof nestedSchema.$ref === "string") {
		const resolvedRef = resolveRef(nestedSchema, context, imports);
		if ("examples" in schema) {
			const schemaWithExamples = schema;
			schemaWithExamples.examples = resolveExampleRefs(schemaWithExamples.examples, context);
		}
		if ("examples" in resolvedRef.schema) {
			const resolvedWithExamples = resolvedRef.schema;
			resolvedWithExamples.examples = resolveExampleRefs(resolvedWithExamples.examples, context);
		}
		return {
			schema: {
				...schema,
				schema: resolvedRef.schema
			},
			imports: resolvedRef.imports
		};
	}
	if (isDereferenced(schema)) {
		if ("examples" in schema) {
			const schemaWithExamples = schema;
			schemaWithExamples.examples = resolveExampleRefs(schemaWithExamples.examples, context);
		}
		return {
			schema,
			imports
		};
	}
	if (!refPath) throw new Error(`${REF_NOT_FOUND_PREFIX}: missing $ref`);
	const { currentSchema, refInfo: { name, originalName } } = getSchema$1(schema, context);
	if (!currentSchema) throw new Error(`${REF_NOT_FOUND_PREFIX}: ${refPath}`);
	return resolveRef(currentSchema, { ...context }, [...imports, {
		name,
		schemaName: originalName
	}]);
}
/**
* Looks up a schema by its `$ref` path in the spec, applying suffix resolution.
*
* Preserves OpenAPI 3.0 `nullable` and 3.1 type-array (`["object", "null"]`)
* hints from the referencing schema onto the resolved target.
*
* @see https://spec.openapis.org/oas/v3.0.3#fixed-fields-18 (nullable)
* @see https://spec.openapis.org/oas/v3.1.0#schema-object (type as array)
*/
function getSchema$1(schema, context) {
	if (!schema.$ref) throw new Error(`${REF_NOT_FOUND_PREFIX}: missing $ref`);
	const refInfo = getRefInfo(schema.$ref, context);
	const { refPaths } = refInfo;
	const schemaByRefPaths = Array.isArray(refPaths) ? prop(context.spec, ...refPaths) : void 0;
	if (isObject(schemaByRefPaths) && isReference(schemaByRefPaths)) return getSchema$1(schemaByRefPaths, context);
	let currentSchema = schemaByRefPaths;
	if (isObject(currentSchema) && "nullable" in schema) {
		const nullable = schema.nullable;
		currentSchema = {
			...currentSchema,
			nullable
		};
	}
	if (isObject(currentSchema) && "type" in schema && Array.isArray(schema.type)) {
		const type = schema.type;
		currentSchema = {
			...currentSchema,
			type
		};
	}
	return {
		currentSchema,
		refInfo
	};
}
/** Recursively resolves `$ref` entries in an examples array or record. */
function resolveExampleRefs(examples, context) {
	if (!examples) return;
	return Array.isArray(examples) ? examples.map((example) => {
		if (isObject(example) && isReference(example)) {
			const { schema } = resolveRef(example, context);
			return schema.value;
		}
		return example;
	}) : (() => {
		const result = {};
		for (const [key, example] of Object.entries(examples)) result[key] = isObject(example) && isReference(example) ? resolveRef(example, context).schema.value : example;
		return result;
	})();
}
//#endregion
//#region src/resolvers/value.ts
function resolveValue({ schema, name, context, formDataContext }) {
	if (isReference(schema)) {
		const { schema: schemaObject, imports } = resolveRef(schema, context);
		const resolvedImport = imports[0];
		let hasReadonlyProps = false;
		const refName = resolvedImport.name;
		if (!context.parents?.includes(refName)) hasReadonlyProps = getScalar({
			item: schemaObject,
			name: refName,
			context: {
				...context,
				parents: [...context.parents ?? [], refName]
			}
		}).hasReadonlyProps;
		const isAnyOfNullable = schemaObject.anyOf?.some((anyOfItem) => !isReference(anyOfItem) && (anyOfItem.type === "null" || Array.isArray(anyOfItem.type) && anyOfItem.type.includes("null")));
		const schemaType = schemaObject.type;
		const nullable = Array.isArray(schemaType) && schemaType.includes("null") || schemaObject.nullable === true || isAnyOfNullable ? " | null" : "";
		return {
			value: resolvedImport.name + nullable,
			imports: [{
				name: resolvedImport.name,
				schemaName: resolvedImport.schemaName
			}],
			type: schemaObject.type ?? "object",
			schemas: [],
			isEnum: !!schemaObject.enum,
			originalSchema: schemaObject,
			hasReadonlyProps,
			isRef: true,
			dependencies: [resolvedImport.name]
		};
	}
	return {
		...getScalar({
			item: schema,
			name,
			context,
			formDataContext
		}),
		originalSchema: schema,
		isRef: false
	};
}
//#endregion
//#region src/resolvers/object.ts
/**
* Wraps inline object type in a type alias.
* E.g. `{ foo: string }` → value becomes `FooBody`, schema gets `export type FooBody = { foo: string };`
*/
function createTypeAliasIfNeeded({ resolvedValue, propName, context }) {
	if (!propName) return;
	if (resolvedValue.isEnum || resolvedValue.type !== "object") return;
	const aliasPattern = context.output.override.aliasCombinedTypes ? String.raw`{|&|\|` : "{";
	if (!new RegExp(aliasPattern).test(resolvedValue.value)) return;
	const { originalSchema } = resolvedValue;
	const doc = jsDoc(originalSchema);
	const isConstant = "const" in originalSchema;
	const constantIsString = "type" in originalSchema && (originalSchema.type === "string" || Array.isArray(originalSchema.type) && originalSchema.type.includes("string"));
	const model = isConstant ? `${doc}export const ${propName} = ${constantIsString ? `'${originalSchema.const}'` : originalSchema.const} as const;\n` : `${doc}export type ${propName} = ${resolvedValue.value};\n`;
	return {
		value: propName,
		imports: [{
			name: propName,
			isConstant
		}],
		schemas: [...resolvedValue.schemas, {
			name: propName,
			model,
			imports: resolvedValue.imports,
			dependencies: resolvedValue.dependencies
		}],
		isEnum: false,
		type: "object",
		isRef: resolvedValue.isRef,
		hasReadonlyProps: resolvedValue.hasReadonlyProps,
		dependencies: resolvedValue.dependencies
	};
}
function resolveObjectOriginal({ schema, propName, combined = false, context, formDataContext }) {
	const resolvedValue = resolveValue({
		schema,
		name: propName,
		context,
		formDataContext
	});
	const aliased = createTypeAliasIfNeeded({
		resolvedValue,
		propName,
		context
	});
	if (aliased) return {
		...aliased,
		originalSchema: resolvedValue.originalSchema
	};
	if (propName && resolvedValue.isEnum && !combined && !resolvedValue.isRef) {
		const doc = jsDoc(resolvedValue.originalSchema);
		const enumValue = getEnum(resolvedValue.value, propName, getEnumNames(resolvedValue.originalSchema), context.output.override.enumGenerationType, getEnumDescriptions(resolvedValue.originalSchema), context.output.override.namingConvention.enum);
		return {
			value: propName,
			imports: [{ name: propName }],
			schemas: [...resolvedValue.schemas, {
				name: propName,
				model: doc + enumValue,
				imports: resolvedValue.imports,
				dependencies: resolvedValue.dependencies
			}],
			isEnum: false,
			type: "enum",
			originalSchema: resolvedValue.originalSchema,
			isRef: resolvedValue.isRef,
			hasReadonlyProps: resolvedValue.hasReadonlyProps,
			dependencies: [...resolvedValue.dependencies, propName]
		};
	}
	return resolvedValue;
}
const resolveObjectCacheMap = /* @__PURE__ */ new Map();
function resolveObject({ schema, propName, combined = false, context, formDataContext }) {
	const hashKey = JSON.stringify({
		schema,
		propName,
		combined,
		projectName: context.projectName ?? context.output.target,
		formDataContext
	});
	if (resolveObjectCacheMap.has(hashKey)) return resolveObjectCacheMap.get(hashKey);
	const result = resolveObjectOriginal({
		schema,
		propName,
		combined,
		context,
		formDataContext
	});
	resolveObjectCacheMap.set(hashKey, result);
	return result;
}
//#endregion
//#region src/getters/array.ts
/**
* Return the output type from an array
*
* @param item item with type === "array"
*/
function getArray({ schema, name, context, formDataContext }) {
	const schemaPrefixItems = schema.prefixItems;
	const schemaItems = schema.items;
	const schemaExample = schema.example;
	const schemaExamples = schema.examples;
	const itemSuffix = context.output.override.components.schemas.itemSuffix;
	if (schemaPrefixItems) {
		const resolvedObjects = schemaPrefixItems.map((item, index) => resolveObject({
			schema: item,
			propName: name ? name + itemSuffix + String(index) : void 0,
			context
		}));
		if (schemaItems) {
			const additional = resolveObject({
				schema: schemaItems,
				propName: name ? name + itemSuffix + "Additional" : void 0,
				context
			});
			resolvedObjects.push({
				...additional,
				value: `...${additional.value}[]`
			});
		}
		return {
			type: "array",
			isEnum: false,
			isRef: false,
			value: `[${resolvedObjects.map((o) => o.value).join(", ")}]`,
			imports: resolvedObjects.flatMap((o) => o.imports),
			schemas: resolvedObjects.flatMap((o) => o.schemas),
			dependencies: resolvedObjects.flatMap((o) => o.dependencies),
			hasReadonlyProps: resolvedObjects.some((o) => o.hasReadonlyProps),
			example: schemaExample,
			examples: resolveExampleRefs(schemaExamples, context)
		};
	}
	if (schemaItems) {
		const resolvedObject = resolveObject({
			schema: schemaItems,
			propName: name ? name + itemSuffix : void 0,
			context,
			formDataContext
		});
		return {
			value: `${schema.readOnly === true && !context.output.override.suppressReadonlyModifier ? "readonly " : ""}${resolvedObject.value.includes("|") ? `(${resolvedObject.value})[]` : `${resolvedObject.value}[]`}`,
			imports: resolvedObject.imports,
			schemas: resolvedObject.schemas,
			dependencies: resolvedObject.dependencies,
			isEnum: false,
			type: "array",
			isRef: false,
			hasReadonlyProps: resolvedObject.hasReadonlyProps,
			example: schemaExample,
			examples: resolveExampleRefs(schemaExamples, context)
		};
	} else if (compareVersions(context.spec.openapi ?? "3.0.0", "3.1", ">=")) return {
		value: "unknown[]",
		imports: [],
		schemas: [],
		dependencies: [],
		isEnum: false,
		type: "array",
		isRef: false,
		hasReadonlyProps: false
	};
	else throw new Error(`All arrays must have an \`items\` key defined (name=${name}, schema=${JSON.stringify(schema)})`);
}
//#endregion
//#region src/getters/res-req-types.ts
const getSchemaType = (s) => s.type;
const getSchemaCombined = (s) => s.oneOf ?? s.anyOf ?? s.allOf;
const getSchemaOneOf = (s) => s.oneOf;
const getSchemaAnyOf = (s) => s.anyOf;
const getSchemaItems = (s) => s.items;
const getSchemaRequired = (s) => s.required;
const getSchemaProperties = (s) => s.properties;
const resolveSchemaRef = (schema, context) => resolveRef(schema, context);
const resolveResponseOrRequestRef = (schema, context) => resolveRef(schema, context);
const formDataContentTypes = new Set(["multipart/form-data"]);
const formUrlEncodedContentTypes = new Set(["application/x-www-form-urlencoded"]);
function getResReqContentTypes({ mediaType, propName, context, isFormData, contentType }) {
	if (!mediaType.schema) return;
	const formDataContext = isFormData ? {
		atPart: false,
		encoding: mediaType.encoding ?? {}
	} : void 0;
	const resolvedObject = resolveObject({
		schema: mediaType.schema,
		propName,
		context,
		formDataContext
	});
	if (!isFormData && isBinaryContentType(contentType)) return {
		...resolvedObject,
		value: "Blob"
	};
	return resolvedObject;
}
function getResReqTypes(responsesOrRequests, name, context, defaultType = "unknown", uniqueKey = (item) => item.value) {
	return uniqueBy(responsesOrRequests.filter(([, res]) => Boolean(res)).map(([key, res]) => {
		if (isReference(res)) {
			const { schema: bodySchema, imports: [{ name, schemaName }] } = resolveResponseOrRequestRef(res, context);
			const firstEntry = Object.entries(bodySchema.content ?? {}).at(0);
			if (!firstEntry) return [{
				value: name,
				imports: [{
					name,
					schemaName
				}],
				schemas: [],
				type: "unknown",
				isEnum: false,
				isRef: true,
				hasReadonlyProps: false,
				dependencies: [name],
				originalSchema: void 0,
				example: void 0,
				examples: void 0,
				key,
				contentType: ""
			}];
			const [contentType, mediaType] = firstEntry;
			const isFormData = formDataContentTypes.has(contentType);
			const isFormUrlEncoded = formUrlEncodedContentTypes.has(contentType);
			if (!isFormData && !isFormUrlEncoded || !mediaType.schema) return [{
				value: name,
				imports: [{
					name,
					schemaName
				}],
				schemas: [],
				type: "unknown",
				isEnum: false,
				isRef: true,
				hasReadonlyProps: false,
				dependencies: [name],
				originalSchema: mediaType.schema,
				example: mediaType.example,
				examples: resolveExampleRefs(mediaType.examples, context),
				key,
				contentType
			}];
			const formData = isFormData ? getSchemaFormDataAndUrlEncoded({
				name,
				schemaObject: mediaType.schema,
				context,
				isRequestBodyOptional: bodySchema.required !== true,
				isRef: true,
				encoding: mediaType.encoding
			}) : void 0;
			const formUrlEncoded = isFormUrlEncoded ? getSchemaFormDataAndUrlEncoded({
				name,
				schemaObject: mediaType.schema,
				context,
				isRequestBodyOptional: bodySchema.required !== true,
				isUrlEncoded: true,
				isRef: true,
				encoding: mediaType.encoding
			}) : void 0;
			const additionalImports = getFormDataAdditionalImports({
				schemaObject: mediaType.schema,
				context
			});
			return [{
				value: name,
				imports: [{
					name,
					schemaName
				}, ...additionalImports],
				schemas: [],
				type: "unknown",
				isEnum: false,
				hasReadonlyProps: false,
				dependencies: [name],
				formData,
				formUrlEncoded,
				isRef: true,
				originalSchema: mediaType.schema,
				example: mediaType.example,
				examples: resolveExampleRefs(mediaType.examples, context),
				key,
				contentType
			}];
		}
		if (res.content) return Object.entries(res.content).map(([contentType, mediaType], index, arr) => {
			let propName = key ? pascal(name) + pascal(key) : void 0;
			if (propName && arr.length > 1) propName = propName + pascal(getNumberWord(index + 1));
			const isFormData = formDataContentTypes.has(contentType);
			const isFormUrlEncoded = formUrlEncodedContentTypes.has(contentType);
			let effectivePropName = propName;
			if (mediaType.schema && isReference(mediaType.schema)) {
				const { imports } = resolveSchemaRef(mediaType.schema, context);
				if (imports[0]?.name) effectivePropName = imports[0].name;
			} else if ((isFormData || isFormUrlEncoded) && mediaType.schema) {
				const combinedRefs = getSchemaOneOf(mediaType.schema) ?? getSchemaAnyOf(mediaType.schema);
				if (combinedRefs) {
					const names = [];
					for (const ref of combinedRefs) {
						if (!isReference(ref)) continue;
						const refName = resolveSchemaRef(ref, context).imports[0]?.name;
						if (refName) names.push(refName);
					}
					if (names.length > 0) effectivePropName = names.join("");
				}
			}
			const resolvedValue = getResReqContentTypes({
				mediaType,
				propName: effectivePropName,
				context,
				isFormData,
				contentType
			});
			if (!resolvedValue) {
				if (isBinaryContentType(contentType)) return {
					value: "Blob",
					imports: [],
					schemas: [],
					type: "Blob",
					isEnum: false,
					key,
					isRef: false,
					hasReadonlyProps: false,
					contentType
				};
				return;
			}
			if (!isFormData && !isFormUrlEncoded || !effectivePropName || !mediaType.schema) return {
				...resolvedValue,
				imports: resolvedValue.imports,
				dependencies: resolvedValue.dependencies,
				contentType,
				example: mediaType.example,
				examples: resolveExampleRefs(mediaType.examples, context)
			};
			const formData = isFormData ? getSchemaFormDataAndUrlEncoded({
				name: effectivePropName,
				schemaObject: mediaType.schema,
				context,
				isRequestBodyOptional: res.required !== true,
				isRef: true,
				encoding: mediaType.encoding
			}) : void 0;
			const formUrlEncoded = isFormUrlEncoded ? getSchemaFormDataAndUrlEncoded({
				name: effectivePropName,
				schemaObject: mediaType.schema,
				context,
				isUrlEncoded: true,
				isRequestBodyOptional: res.required !== true,
				isRef: true,
				encoding: mediaType.encoding
			}) : void 0;
			const additionalImports = getFormDataAdditionalImports({
				schemaObject: mediaType.schema,
				context
			});
			return {
				...resolvedValue,
				imports: [...resolvedValue.imports, ...additionalImports],
				formData,
				formUrlEncoded,
				contentType,
				example: mediaType.example,
				examples: resolveExampleRefs(mediaType.examples, context)
			};
		}).filter(Boolean).map((x) => ({
			...x,
			key
		}));
		const swaggerSchema = "schema" in res ? res.schema : void 0;
		if (swaggerSchema) return [{
			...resolveObject({
				schema: swaggerSchema,
				propName: key ? pascal(name) + pascal(key) : void 0,
				context
			}),
			contentType: "application/json",
			key
		}];
		return [{
			value: defaultType,
			imports: [],
			schemas: [],
			type: defaultType,
			isEnum: false,
			dependencies: [],
			key,
			isRef: false,
			hasReadonlyProps: false,
			contentType: "application/json"
		}];
	}).flat(), uniqueKey);
}
/**
* Determine the responseType option based on success content types only.
* This avoids error-response content types influencing the responseType.
*/
function getSuccessResponseType(response) {
	const successContentTypes = response.types.success.map((t) => t.contentType).filter(Boolean);
	if (response.isBlob) return "blob";
	const hasJsonResponse = successContentTypes.some((contentType) => contentType.includes("json") || contentType.includes("+json"));
	const hasTextResponse = successContentTypes.some((contentType) => contentType.startsWith("text/") || contentType.includes("xml"));
	if (!hasJsonResponse && hasTextResponse) return "text";
}
/**
* Determine the response type category for a given content type.
* Used to set the correct responseType option in HTTP clients.
*
* @param contentType - The MIME content type (e.g., 'application/json', 'text/plain')
* @returns The response type category to use for parsing
*/
function getResponseTypeCategory(contentType) {
	if (isBinaryContentType(contentType)) return "blob";
	if (contentType === "application/json" || contentType.includes("+json") || contentType.includes("-json")) return "json";
	return "text";
}
/**
* Get the default content type from a list of content types.
* Priority: application/json > any JSON-like type > first in list
*
* @param contentTypes - Array of content types from OpenAPI spec
* @returns The default content type to use
*/
function getDefaultContentType(contentTypes) {
	if (contentTypes.length === 0) return "application/json";
	if (contentTypes.includes("application/json")) return "application/json";
	const jsonType = contentTypes.find((ct) => ct.includes("+json") || ct.includes("-json"));
	if (jsonType) return jsonType;
	return contentTypes[0];
}
function getFormDataAdditionalImports({ schemaObject, context }) {
	const { schema } = resolveSchemaRef(schemaObject, context);
	if (schema.type !== "object") return [];
	const combinedSchemas = getSchemaOneOf(schema) ?? getSchemaAnyOf(schema);
	if (!combinedSchemas) return [];
	return combinedSchemas.map((subSchema) => resolveSchemaRef(subSchema, context).imports[0]).filter(Boolean);
}
function getSchemaFormDataAndUrlEncoded({ name, schemaObject, context, isRequestBodyOptional, isUrlEncoded, isRef, encoding }) {
	const { schema, imports } = resolveSchemaRef(schemaObject, context);
	const propName = camel(!isRef && isReference(schemaObject) ? imports[0].name : name);
	const variableName = isUrlEncoded ? "formUrlEncoded" : "formData";
	let form = isUrlEncoded ? `const ${variableName} = new URLSearchParams();\n` : `const ${variableName} = new FormData();\n`;
	const combinedSchemas = getSchemaCombined(schema);
	if (schema.type === "object" || schema.type === void 0 && combinedSchemas) {
		if (combinedSchemas) if (!!getSchemaOneOf(schema) || !!getSchemaAnyOf(schema)) {
			const directProperties = getSchemaProperties(schema);
			const directKeys = directProperties ? Object.entries(directProperties).filter(([, value]) => !resolveSchemaRef(value, context).schema.readOnly).map(([key]) => key) : [];
			const skipLine = directKeys.length > 0 ? `  if ([${directKeys.map((k) => JSON.stringify(k)).join(", ")}].includes(key)) return;\n` : "";
			form += `Object.entries(${propName} ?? {}).forEach(([key, value]) => {\n`;
			form += skipLine;
			form += `  if (value !== undefined && value !== null) {\n`;
			form += `    if ((typeof File !== 'undefined' && value instanceof File) || value instanceof Blob) {\n`;
			form += `      ${variableName}.append(key, value);\n`;
			form += `    } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) {\n`;
			form += `      ${variableName}.append(key, new Blob([Uint8Array.from(value)]));\n`;
			form += `    } else if (Array.isArray(value)) {\n`;
			form += `      value.forEach(v => {\n`;
			form += `        if ((typeof File !== 'undefined' && v instanceof File) || v instanceof Blob) {\n`;
			form += `          ${variableName}.append(key, v);\n`;
			form += `        } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer(v)) {\n`;
			form += `          ${variableName}.append(key, new Blob([Uint8Array.from(v)]));\n`;
			form += `        } else {\n`;
			form += `          ${variableName}.append(key, typeof v === 'object' ? JSON.stringify(v) : String(v));\n`;
			form += `        }\n`;
			form += `      });\n`;
			form += `    } else if (typeof value === 'object') {\n`;
			form += `      ${variableName}.append(key, JSON.stringify(value));\n`;
			form += `    } else {\n`;
			form += `      ${variableName}.append(key, String(value));\n`;
			form += `    }\n`;
			form += `  }\n`;
			form += `});\n`;
		} else {
			const combinedSchemasFormData = combinedSchemas.map((subSchema) => {
				const { schema: combinedSchema } = resolveSchemaRef(subSchema, context);
				return resolveSchemaPropertiesToFormData({
					schema: combinedSchema,
					variableName,
					propName,
					context,
					isRequestBodyOptional,
					encoding
				});
			}).filter(Boolean).join("\n");
			form += combinedSchemasFormData;
		}
		if (schema.properties) {
			const formDataValues = resolveSchemaPropertiesToFormData({
				schema,
				variableName,
				propName,
				context,
				isRequestBodyOptional,
				encoding
			});
			form += formDataValues;
		}
		return form;
	}
	if (schema.type === "array") {
		let valueStr = "value";
		const schemaItems = getSchemaItems(schema);
		if (schemaItems) {
			const { schema: itemSchema } = resolveSchemaRef(schemaItems, context);
			if (itemSchema.type === "object" || itemSchema.type === "array") valueStr = "JSON.stringify(value)";
			else if (itemSchema.type === "number" || itemSchema.type === "integer" || itemSchema.type === "boolean") valueStr = "value.toString()";
		}
		return `${form}${propName}.forEach(value => ${variableName}.append('data', ${valueStr}))\n`;
	}
	if (schema.type === "number" || schema.type === "integer" || schema.type === "boolean") return `${form}${variableName}.append('data', ${propName}.toString())\n`;
	return `${form}${variableName}.append('data', ${propName})\n`;
}
function resolveSchemaPropertiesToFormData({ schema, variableName, propName, context, isRequestBodyOptional, keyPrefix = "", depth = 0, encoding }) {
	let formDataValues = "";
	const schemaProps = getSchemaProperties(schema) ?? {};
	for (const [key, value] of Object.entries(schemaProps)) {
		const { schema: property } = resolveSchemaRef(value, context);
		if (property.readOnly) continue;
		let formDataValue = "";
		const partContentType = (depth === 0 ? encoding?.[key] : void 0)?.contentType;
		const formattedKeyPrefix = isRequestBodyOptional ? keyword.isIdentifierNameES5(key) ? "?" : "?." : "";
		const formattedKey = keyword.isIdentifierNameES5(key) ? `.${key}` : `['${key}']`;
		const valueKey = `${propName}${formattedKeyPrefix}${formattedKey}`;
		const nonOptionalValueKey = `${propName}${formattedKey}`;
		const fileType = getFormDataFieldFileType(property, partContentType);
		const effectiveContentType = partContentType ?? property.contentMediaType;
		if (fileType === "binary" || property.format === "binary") formDataValue = `${variableName}.append(\`${keyPrefix}${key}\`, ${nonOptionalValueKey});\n`;
		else if (fileType === "text") formDataValue = `${variableName}.append(\`${keyPrefix}${key}\`, ${nonOptionalValueKey} instanceof Blob ? ${nonOptionalValueKey} : new Blob([${nonOptionalValueKey}], { type: '${effectiveContentType}' }));\n`;
		else if (property.type === "object") formDataValue = context.output.override.formData.arrayHandling === FormDataArrayHandling.EXPLODE ? resolveSchemaPropertiesToFormData({
			schema: property,
			variableName,
			propName: nonOptionalValueKey,
			context,
			isRequestBodyOptional,
			keyPrefix: `${keyPrefix}${key}.`,
			depth: depth + 1,
			encoding
		}) : `${variableName}.append(\`${keyPrefix}${key}\`, JSON.stringify(${nonOptionalValueKey}));\n`;
		else if (property.type === "array") {
			let valueStr = "value";
			let hasNonPrimitiveChild = false;
			const propertyItems = getSchemaItems(property);
			if (propertyItems) {
				const { schema: itemSchema } = resolveSchemaRef(propertyItems, context);
				if (itemSchema.type === "object" || itemSchema.type === "array") if (context.output.override.formData.arrayHandling === FormDataArrayHandling.EXPLODE) {
					hasNonPrimitiveChild = true;
					const resolvedValue = resolveSchemaPropertiesToFormData({
						schema: itemSchema,
						variableName,
						propName: "value",
						context,
						isRequestBodyOptional,
						keyPrefix: `${keyPrefix}${key}[\${index${depth > 0 ? depth : ""}}].`,
						depth: depth + 1
					});
					formDataValue = `${valueKey}.forEach((value, index${depth > 0 ? depth : ""}) => {
    ${resolvedValue}});\n`;
				} else valueStr = "JSON.stringify(value)";
				else {
					const itemType = getSchemaType(itemSchema);
					if (itemType === "number" || Array.isArray(itemType) && itemType.includes("number") || itemType === "integer" || Array.isArray(itemType) && itemType.includes("integer") || itemType === "boolean" || Array.isArray(itemType) && itemType.includes("boolean")) valueStr = "value.toString()";
				}
			}
			if (context.output.override.formData.arrayHandling === FormDataArrayHandling.EXPLODE) {
				if (!hasNonPrimitiveChild) formDataValue = `${valueKey}.forEach((value, index${depth > 0 ? depth : ""}) => ${variableName}.append(\`${keyPrefix}${key}[\${index${depth > 0 ? depth : ""}}]\`, ${valueStr}));\n`;
			} else formDataValue = `${valueKey}.forEach(value => ${variableName}.append(\`${keyPrefix}${key}${context.output.override.formData.arrayHandling === FormDataArrayHandling.SERIALIZE_WITH_BRACKETS ? "[]" : ""}\`, ${valueStr}));\n`;
		} else if ((() => {
			const propType = getSchemaType(property);
			return propType === "number" || Array.isArray(propType) && propType.includes("number") || propType === "integer" || Array.isArray(propType) && propType.includes("integer") || propType === "boolean" || Array.isArray(propType) && propType.includes("boolean");
		})()) formDataValue = `${variableName}.append(\`${keyPrefix}${key}\`, ${nonOptionalValueKey}.toString())\n`;
		else formDataValue = `${variableName}.append(\`${keyPrefix}${key}\`, ${nonOptionalValueKey});\n`;
		let existSubSchemaNullable = false;
		const combine = getSchemaCombined(property);
		if (combine) {
			const subSchemas = combine.map((c) => resolveObject({
				schema: c,
				combined: true,
				context
			}));
			if (subSchemas.some((subSchema) => {
				return [
					"number",
					"integer",
					"boolean"
				].includes(subSchema.type);
			})) formDataValue = `${variableName}.append(\`${key}\`, ${nonOptionalValueKey}.toString())\n`;
			if (subSchemas.some((subSchema) => {
				return subSchema.type === "null";
			})) existSubSchemaNullable = true;
		}
		const isRequired = getSchemaRequired(schema)?.includes(key) && !isRequestBodyOptional;
		const propType = getSchemaType(property);
		if (property.nullable || Array.isArray(propType) && propType.includes("null") || existSubSchemaNullable) {
			if (isRequired) {
				formDataValues += `if(${valueKey} !== null) {\n ${formDataValue} }\n`;
				continue;
			}
			formDataValues += `if(${valueKey} !== undefined && ${nonOptionalValueKey} !== null) {\n ${formDataValue} }\n`;
			continue;
		}
		if (isRequired) {
			formDataValues += formDataValue;
			continue;
		}
		formDataValues += `if(${valueKey} !== undefined) {\n ${formDataValue} }\n`;
	}
	return formDataValues;
}
//#endregion
//#region src/getters/body.ts
function buildBody(filteredBodyTypes, requestBody, operationName, context) {
	const imports = filteredBodyTypes.flatMap(({ imports }) => imports);
	const schemas = filteredBodyTypes.flatMap(({ schemas }) => schemas);
	const definition = filteredBodyTypes.map(({ value }) => value).join(" | ");
	const nonReadonlyDefinition = filteredBodyTypes.some((x) => x.hasReadonlyProps) && definition && context.output.override.preserveReadonlyRequestBodies !== "preserve" ? `NonReadonly<${definition}>` : definition;
	let implementation = generalJSTypesWithArray.includes(definition.toLowerCase()) || filteredBodyTypes.length > 1 ? camel(operationName) + context.output.override.components.requestBodies.suffix : camel(definition);
	let isOptional = false;
	if (implementation) {
		implementation = sanitize(implementation, {
			underscore: "_",
			whitespace: "_",
			dash: true,
			es5keyword: true,
			es5IdentifierName: true
		});
		if (isReference(requestBody)) {
			const { schema: bodySchema } = resolveRef(requestBody, context);
			isOptional = bodySchema.required !== true;
		} else isOptional = requestBody.required !== true;
	}
	return {
		originalSchema: requestBody,
		definition: nonReadonlyDefinition,
		implementation,
		imports,
		schemas,
		isOptional,
		...filteredBodyTypes.length === 1 ? {
			formData: filteredBodyTypes[0].formData,
			formUrlEncoded: filteredBodyTypes[0].formUrlEncoded,
			contentType: filteredBodyTypes[0].contentType
		} : {
			formData: "",
			formUrlEncoded: "",
			contentType: ""
		}
	};
}
function getBody({ requestBody, operationName, context, contentType }) {
	return buildBody(filterByContentType(getResReqTypes([[context.output.override.components.requestBodies.suffix, requestBody]], operationName, context), contentType), requestBody, operationName, context);
}
/**
* Returns per-content-type bodies when `splitByContentType` is enabled.
* Each entry includes a `contentTypeSuffix` for generating distinct function names.
*/
function getBodiesByContentType({ requestBody, operationName, context, contentType }) {
	const filteredBodyTypes = filterByContentType(getResReqTypes([[context.output.override.components.requestBodies.suffix, requestBody]], operationName, context, void 0, (item) => `${item.value}::${item.contentType}`), contentType);
	if (filteredBodyTypes.length <= 1) return [{
		...buildBody(filteredBodyTypes, requestBody, operationName, context),
		contentTypeSuffix: ""
	}];
	return filteredBodyTypes.map((bodyType) => {
		const suffix = getContentTypeSuffix(bodyType.contentType);
		return {
			...buildBody([bodyType], requestBody, operationName, context),
			contentTypeSuffix: suffix
		};
	});
}
const CONTENT_TYPE_SUFFIX_MAP = {
	"application/json": "Json",
	"multipart/form-data": "FormData",
	"application/x-www-form-urlencoded": "UrlEncoded",
	"text/plain": "Text",
	"application/xml": "Xml",
	"text/xml": "Xml",
	"application/octet-stream": "Blob"
};
function getContentTypeSuffix(contentType) {
	if (CONTENT_TYPE_SUFFIX_MAP[contentType]) return CONTENT_TYPE_SUFFIX_MAP[contentType];
	return (contentType.split("/")[1] ?? contentType).split(/[-+.]/).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
}
//#endregion
//#region src/getters/imports.ts
function getAliasedImports({ name, resolvedValue, context }) {
	return context.output.schemas && resolvedValue.isRef ? resolvedValue.imports.map((imp) => {
		if (!needCreateImportAlias({
			name,
			imp
		})) return imp;
		return {
			...imp,
			alias: `__${imp.name}`
		};
	}) : resolvedValue.imports;
}
function needCreateImportAlias({ imp, name }) {
	return !imp.alias && imp.name === name;
}
function getImportAliasForRefOrValue({ context, imports, resolvedValue }) {
	if (!context.output.schemas || !resolvedValue.isRef) return resolvedValue.value;
	return imports.find((imp) => imp.name === resolvedValue.value)?.alias ?? resolvedValue.value;
}
//#endregion
//#region src/getters/keys.ts
function getKey(key) {
	return keyword.isIdentifierNameES5(key) ? key : `'${key}'`;
}
//#endregion
//#region src/getters/object.ts
/**
* Extract enum values from propertyNames schema (OpenAPI 3.1)
* Handles both `enum` and `const` (treated as a single-element enum)
* Returns undefined if propertyNames has neither
*/
function getPropertyNamesEnum(item) {
	if (!("propertyNames" in item) || !item.propertyNames) return;
	const propertyNames = item.propertyNames;
	if (Array.isArray(propertyNames.enum)) return propertyNames.enum.filter((val) => isString(val));
	if (isString(propertyNames.const)) return [propertyNames.const];
}
/**
* Generate index signature key type based on propertyNames enum or const
* Returns union type string like "'foo' | 'bar'", "'x'", or 'string' if neither
*/
function getIndexSignatureKey(item) {
	const enumValues = getPropertyNamesEnum(item);
	if (enumValues && enumValues.length > 0) return enumValues.map((val) => `'${val}'`).join(" | ");
	return "string";
}
function getPropertyNamesRecordType(item, valueType) {
	const enumValues = getPropertyNamesEnum(item);
	if (!enumValues || enumValues.length === 0) return;
	return `Partial<Record<${enumValues.map((val) => `'${val}'`).join(" | ")}, ${valueType}>>`;
}
/**
* Return the output type from an object
*
* @param item item with type === "object"
*/
function getObject({ item, name, context, nullable, formDataContext }) {
	if (isReference(item)) {
		const { name } = getRefInfo(item.$ref, context);
		return {
			value: name + nullable,
			imports: [{ name }],
			schemas: [],
			isEnum: false,
			type: "object",
			isRef: true,
			hasReadonlyProps: item.readOnly ?? false,
			dependencies: [name],
			example: item.example,
			examples: resolveExampleRefs(item.examples, context)
		};
	}
	const schemaItem = item;
	const itemAllOf = schemaItem.allOf;
	const itemOneOf = schemaItem.oneOf;
	const itemAnyOf = schemaItem.anyOf;
	const itemType = schemaItem.type;
	if (itemAllOf || itemOneOf || itemAnyOf) return combineSchemas({
		schema: schemaItem,
		name,
		separator: itemAllOf ? "allOf" : itemOneOf ? "oneOf" : "anyOf",
		context,
		nullable,
		formDataContext
	});
	if (Array.isArray(itemType)) {
		const typeArray = itemType;
		const baseItem = schemaItem;
		return combineSchemas({
			schema: { anyOf: typeArray.map((type) => ({
				...baseItem,
				type
			})) },
			name,
			separator: "anyOf",
			context,
			nullable
		});
	}
	const itemProperties = schemaItem.properties;
	if (itemProperties && Object.entries(itemProperties).length > 0) {
		const entries = Object.entries(itemProperties);
		if (context.output.propertySortOrder === PropertySortOrder.ALPHABETICAL) entries.sort((a, b) => {
			return a[0].localeCompare(b[0]);
		});
		const acc = {
			imports: [],
			schemas: [],
			value: "",
			isEnum: false,
			type: "object",
			isRef: false,
			hasReadonlyProps: false,
			useTypeAlias: false,
			dependencies: [],
			example: schemaItem.example,
			examples: resolveExampleRefs(schemaItem.examples, context)
		};
		const itemRequired = schemaItem.required;
		for (const [index, [key, schema]] of entries.entries()) {
			const isRequired = (Array.isArray(itemRequired) ? itemRequired : []).includes(key);
			let propName = "";
			if (name) {
				const isKeyStartWithUnderscore = key.startsWith("_");
				propName += pascal(`${isKeyStartWithUnderscore ? "_" : ""}${name}_${key}`);
			}
			const allSpecSchemas = context.spec.components?.schemas ?? {};
			if (Object.keys(allSpecSchemas).some((schemaName) => pascal(schemaName) === propName)) propName = propName + "Property";
			const propertyFormDataContext = formDataContext && !formDataContext.atPart ? {
				atPart: true,
				partContentType: formDataContext.encoding[key]?.contentType
			} : void 0;
			const resolvedValue = resolveObject({
				schema,
				propName,
				context,
				formDataContext: propertyFormDataContext
			});
			const isReadOnly = Boolean(schemaItem.readOnly) || Boolean(schema.readOnly);
			if (!index) acc.value += "{";
			const doc = jsDoc(schema, true, context);
			const propertyDoc = doc ? `${doc.trimEnd().split("\n").map((line) => `  ${line}`).join("\n")}\n` : "";
			if (isReadOnly) acc.hasReadonlyProps = true;
			const constValue = "const" in schema ? schema.const : void 0;
			const hasConst = constValue !== void 0;
			let constLiteral;
			if (!hasConst) constLiteral = void 0;
			else if (isString(constValue)) constLiteral = `'${escape(constValue)}'`;
			else constLiteral = JSON.stringify(constValue);
			const needsValueImport = hasConst && (resolvedValue.isEnum || resolvedValue.type === "enum");
			const usedResolvedValue = !hasConst || needsValueImport;
			const aliasedImports = needsValueImport ? resolvedValue.imports.map((imp) => ({
				...imp,
				isConstant: true
			})) : hasConst ? [] : getAliasedImports({
				name,
				context,
				resolvedValue
			});
			if (aliasedImports.length > 0) acc.imports.push(...aliasedImports);
			const alias = getImportAliasForRefOrValue({
				context,
				resolvedValue,
				imports: aliasedImports
			});
			const propValue = needsValueImport ? alias : constLiteral ?? alias;
			const finalPropValue = isRequired ? propValue : context.output.override.useNullForOptional === true ? `${propValue} | null` : propValue;
			acc.value += `\n${propertyDoc}${isReadOnly && !context.output.override.suppressReadonlyModifier ? "  readonly " : "  "}${getKey(key)}${isRequired ? "" : "?"}: ${finalPropValue};`;
			if (usedResolvedValue) {
				acc.schemas.push(...resolvedValue.schemas);
				acc.dependencies.push(...resolvedValue.dependencies);
			}
			if (entries.length - 1 === index) {
				const additionalProps = schemaItem.additionalProperties;
				if (additionalProps) if (additionalProps === true) {
					const recordType = getPropertyNamesRecordType(schemaItem, "unknown");
					if (recordType) {
						acc.value += "\n}";
						acc.value += ` & ${recordType}`;
						acc.useTypeAlias = true;
					} else {
						const keyType = getIndexSignatureKey(schemaItem);
						acc.value += `\n  [key: ${keyType}]: unknown;\n }`;
					}
				} else {
					const resolvedValue = resolveValue({
						schema: additionalProps,
						name,
						context
					});
					const recordType = getPropertyNamesRecordType(schemaItem, resolvedValue.value);
					if (recordType) {
						acc.value += "\n}";
						acc.value += ` & ${recordType}`;
						acc.useTypeAlias = true;
					} else {
						const keyType = getIndexSignatureKey(schemaItem);
						acc.value += `\n  [key: ${keyType}]: ${resolvedValue.value};\n}`;
					}
					acc.imports.push(...resolvedValue.imports);
					acc.schemas.push(...resolvedValue.schemas);
					acc.dependencies.push(...resolvedValue.dependencies);
				}
				else acc.value += "\n}";
				acc.value += nullable;
			}
		}
		return acc;
	}
	const outerAdditionalProps = schemaItem.additionalProperties;
	const readOnlyFlag = schemaItem.readOnly;
	if (outerAdditionalProps) {
		if (outerAdditionalProps === true) {
			const recordType = getPropertyNamesRecordType(schemaItem, "unknown");
			if (recordType) return {
				value: recordType + nullable,
				imports: [],
				schemas: [],
				isEnum: false,
				type: "object",
				isRef: false,
				hasReadonlyProps: readOnlyFlag ?? false,
				useTypeAlias: true,
				dependencies: []
			};
			return {
				value: `{ [key: ${getIndexSignatureKey(schemaItem)}]: unknown }` + nullable,
				imports: [],
				schemas: [],
				isEnum: false,
				type: "object",
				isRef: false,
				hasReadonlyProps: readOnlyFlag ?? false,
				useTypeAlias: false,
				dependencies: []
			};
		}
		const resolvedValue = resolveValue({
			schema: outerAdditionalProps,
			name,
			context
		});
		const recordType = getPropertyNamesRecordType(schemaItem, resolvedValue.value);
		if (recordType) return {
			value: recordType + nullable,
			imports: resolvedValue.imports,
			schemas: resolvedValue.schemas,
			isEnum: false,
			type: "object",
			isRef: false,
			hasReadonlyProps: resolvedValue.hasReadonlyProps,
			useTypeAlias: true,
			dependencies: resolvedValue.dependencies
		};
		return {
			value: `{[key: ${getIndexSignatureKey(schemaItem)}]: ${resolvedValue.value}}` + nullable,
			imports: resolvedValue.imports,
			schemas: resolvedValue.schemas,
			isEnum: false,
			type: "object",
			isRef: false,
			hasReadonlyProps: resolvedValue.hasReadonlyProps,
			useTypeAlias: false,
			dependencies: resolvedValue.dependencies
		};
	}
	const constValue = schemaItem.const;
	if (constValue !== void 0) {
		let type;
		if (Array.isArray(constValue)) type = "array";
		else if (constValue === null) type = "null";
		else if (typeof constValue === "string") type = "string";
		else if (typeof constValue === "number") type = "number";
		else if (typeof constValue === "boolean") type = "boolean";
		else type = "object";
		return {
			value: typeof constValue === "string" ? `'${escape(constValue)}'` : JSON.stringify(constValue),
			imports: [],
			schemas: [],
			isEnum: false,
			type,
			isRef: false,
			hasReadonlyProps: readOnlyFlag ?? false,
			dependencies: []
		};
	}
	const keyType = itemType === "object" ? getIndexSignatureKey(schemaItem) : "string";
	const recordType = getPropertyNamesRecordType(schemaItem, "unknown");
	if (itemType === "object" && recordType) return {
		value: recordType + nullable,
		imports: [],
		schemas: [],
		isEnum: false,
		type: "object",
		isRef: false,
		hasReadonlyProps: readOnlyFlag ?? false,
		useTypeAlias: true,
		dependencies: []
	};
	return {
		value: (itemType === "object" ? `{ [key: ${keyType}]: unknown }` : "unknown") + nullable,
		imports: [],
		schemas: [],
		isEnum: false,
		type: "object",
		isRef: false,
		hasReadonlyProps: readOnlyFlag ?? false,
		useTypeAlias: false,
		dependencies: []
	};
}
//#endregion
//#region src/getters/scalar.ts
/**
* Return the typescript equivalent of open-api data type
*
* @param item
* @ref https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.1.md#data-types
*/
function getScalar({ item, name, context, formDataContext }) {
	const schemaEnum = item.enum;
	const schemaType = item.type;
	const schemaReadOnly = item.readOnly;
	const schemaExample = item.example;
	const schemaExamples = item.examples;
	const schemaConst = item.const;
	const schemaFormat = item.format;
	const schemaNullable = item.nullable;
	const schemaContentMediaType = item.contentMediaType;
	const schemaContentEncoding = item.contentEncoding;
	const nullable = isArray(schemaType) && schemaType.includes("null") || schemaNullable === true ? " | null" : "";
	const enumItems = schemaEnum?.filter((enumItem) => enumItem !== null);
	let itemType = schemaType;
	if (!itemType && item.items) {
		item.type = "array";
		itemType = "array";
	}
	if (isArray(schemaType) && schemaType.includes("null")) {
		const typesWithoutNull = schemaType.filter((x) => x !== "null");
		itemType = typesWithoutNull.length === 1 ? typesWithoutNull[0] : typesWithoutNull;
	}
	switch (itemType) {
		case "number":
		case "integer": {
			let value = context.output.override.useBigInt && (schemaFormat === "int64" || schemaFormat === "uint64") ? "bigint" : "number";
			let isEnum = false;
			if (enumItems) {
				value = enumItems.map((enumItem) => `${enumItem}`).join(" | ");
				isEnum = true;
			}
			value += nullable;
			if (schemaConst !== void 0) value = schemaConst;
			return {
				value,
				isEnum,
				type: "number",
				schemas: [],
				imports: [],
				isRef: false,
				hasReadonlyProps: schemaReadOnly ?? false,
				dependencies: [],
				example: schemaExample,
				examples: resolveExampleRefs(schemaExamples, context)
			};
		}
		case "boolean": {
			let value = "boolean";
			if (enumItems && !(enumItems.includes(true) && enumItems.includes(false))) value = enumItems.map((enumItem) => `${enumItem}`).join(" | ");
			value += nullable;
			if (schemaConst !== void 0) value = schemaConst;
			return {
				value,
				type: "boolean",
				isEnum: false,
				schemas: [],
				imports: [],
				isRef: false,
				hasReadonlyProps: schemaReadOnly ?? false,
				dependencies: [],
				example: schemaExample,
				examples: resolveExampleRefs(schemaExamples, context)
			};
		}
		case "array": {
			const { value, ...rest } = getArray({
				schema: item,
				name,
				context,
				formDataContext
			});
			return {
				value: value + nullable,
				...rest,
				dependencies: rest.dependencies
			};
		}
		case "string": {
			let value = "string";
			let isEnum = false;
			if (enumItems) {
				value = enumItems.map((enumItem) => isString(enumItem) ? `'${escape(enumItem)}'` : `${enumItem}`).filter(Boolean).join(` | `);
				isEnum = true;
			}
			if (schemaFormat === "binary") value = "Blob";
			else if (formDataContext?.atPart) {
				const fileType = getFormDataFieldFileType(item, formDataContext.partContentType);
				if (fileType) value = fileType === "binary" ? "Blob" : "Blob | string";
			} else if (schemaContentMediaType === "application/octet-stream" && !schemaContentEncoding) value = "Blob";
			if (context.output.override.useDates && (schemaFormat === "date" || schemaFormat === "date-time")) value = "Date";
			value += nullable;
			if (schemaConst) value = `'${schemaConst}'`;
			return {
				value,
				isEnum,
				type: "string",
				imports: [],
				schemas: [],
				isRef: false,
				hasReadonlyProps: schemaReadOnly ?? false,
				dependencies: [],
				example: schemaExample,
				examples: resolveExampleRefs(schemaExamples, context)
			};
		}
		case "null": return {
			value: "null",
			isEnum: false,
			type: "null",
			imports: [],
			schemas: [],
			isRef: false,
			hasReadonlyProps: schemaReadOnly ?? false,
			dependencies: []
		};
		default: {
			if (isArray(itemType)) return combineSchemas({
				schema: { anyOf: itemType.map((type) => Object.assign({}, item, { type })) },
				name,
				separator: "anyOf",
				context,
				nullable
			});
			if (enumItems) return {
				value: enumItems.map((enumItem) => isString(enumItem) ? `'${escape(enumItem)}'` : String(enumItem)).filter(Boolean).join(` | `) + nullable,
				isEnum: true,
				type: "string",
				imports: [],
				schemas: [],
				isRef: false,
				hasReadonlyProps: schemaReadOnly ?? false,
				dependencies: [],
				example: schemaExample,
				examples: resolveExampleRefs(schemaExamples, context)
			};
			const hasCombiners = item.allOf ?? item.anyOf ?? item.oneOf;
			const { value, ...rest } = getObject({
				item,
				name,
				context,
				nullable,
				formDataContext: formDataContext?.atPart === false || formDataContext?.atPart && hasCombiners ? formDataContext : void 0
			});
			return {
				value,
				...rest
			};
		}
	}
}
//#endregion
//#region src/getters/combine.ts
const mergeableAllOfKeys = new Set([
	"type",
	"properties",
	"required"
]);
function isMergeableAllOfObject(schema) {
	if (isNullish$1(schema.properties)) return false;
	if (schema.allOf || schema.anyOf || schema.oneOf) return false;
	if (!isNullish$1(schema.type) && schema.type !== "object") return false;
	return Object.keys(schema).every((key) => mergeableAllOfKeys.has(key));
}
function normalizeAllOfSchema(schema) {
	const schemaAllOf = schema.allOf;
	if (!schemaAllOf) return schema;
	let didMerge = false;
	const schemaProperties = schema.properties;
	const schemaRequired = schema.required;
	const mergedProperties = schemaProperties ? { ...schemaProperties } : {};
	const mergedRequired = new Set(schemaRequired);
	const remainingAllOf = [];
	for (const subSchema of schemaAllOf) {
		if (isSchema(subSchema) && isMergeableAllOfObject(subSchema)) {
			didMerge = true;
			if (subSchema.properties) Object.assign(mergedProperties, subSchema.properties);
			const subRequired = subSchema.required;
			if (subRequired) for (const prop of subRequired) mergedRequired.add(prop);
			continue;
		}
		remainingAllOf.push(subSchema);
	}
	if (!didMerge || remainingAllOf.length === 0) return schema;
	return {
		...schema,
		...Object.keys(mergedProperties).length > 0 && { properties: mergedProperties },
		...mergedRequired.size > 0 && { required: [...mergedRequired] },
		...remainingAllOf.length > 0 && { allOf: remainingAllOf }
	};
}
function combineValues({ resolvedData, resolvedValue, separator, context, parentSchema }) {
	if (resolvedData.isEnum.every(Boolean)) return `${resolvedData.values.join(` | `)}${resolvedValue ? ` | ${resolvedValue.value}` : ""}`;
	if (separator === "allOf") {
		let resolvedDataValue = resolvedData.values.map((v) => v.includes(" | ") ? `(${v})` : v).join(` & `);
		if (resolvedData.originalSchema.length > 0 && resolvedValue) {
			const discriminatedPropertySchemas = resolvedData.originalSchema.filter((s) => {
				const disc = s?.discriminator;
				return disc && resolvedValue.value.includes(` ${disc.propertyName}:`);
			});
			if (discriminatedPropertySchemas.length > 0) resolvedDataValue = `Omit<${resolvedDataValue}, '${discriminatedPropertySchemas.map((s) => s.discriminator?.propertyName).join("' | '")}'>`;
		}
		const resolvedValueStr = resolvedValue?.value.includes(" | ") ? `(${resolvedValue.value})` : resolvedValue?.value;
		const joined = `${resolvedDataValue}${resolvedValue ? ` & ${resolvedValueStr}` : ""}`;
		const overrideRequiredProperties = resolvedData.requiredProperties.filter((prop) => !resolvedData.originalSchema.some((schema) => {
			const props = schema?.properties;
			const req = schema?.required;
			return props?.[prop] && req?.includes(prop);
		}) && !(() => {
			const parentProps = parentSchema?.properties;
			const parentReq = parentSchema?.required;
			return !!(parentProps?.[prop] && parentReq?.includes(prop));
		})());
		if (overrideRequiredProperties.length > 0) return `${joined} & Required<Pick<${joined}, '${overrideRequiredProperties.join("' | '")}'>>`;
		return joined;
	}
	let values = resolvedData.values;
	if (resolvedData.allProperties.length && context.output.unionAddMissingProperties) {
		values = [];
		for (let i = 0; i < resolvedData.values.length; i += 1) {
			const subSchema = resolvedData.originalSchema[i];
			if (subSchema?.type !== "object" || !subSchema.properties) {
				values.push(resolvedData.values[i]);
				continue;
			}
			const subSchemaProps = subSchema.properties;
			const missingProperties = unique(resolvedData.allProperties.filter((p) => !Object.keys(subSchemaProps).includes(p)));
			values.push(`${resolvedData.values[i]}${missingProperties.length > 0 ? ` & {${missingProperties.map((p) => `${p}?: never`).join("; ")}}` : ""}`);
		}
	}
	if (resolvedValue) return `(${values.join(` & ${resolvedValue.value}) | (`)} & ${resolvedValue.value})`;
	return values.join(" | ");
}
function combineSchemas({ name, schema, separator, context, nullable, formDataContext }) {
	const normalizedSchema = separator === "allOf" && !context.output.override.aliasCombinedTypes && !schema.oneOf && !schema.anyOf ? normalizeAllOfSchema(schema) : schema;
	const items = normalizedSchema[separator] ?? [];
	const resolvedData = {
		values: [],
		imports: [],
		schemas: [],
		isEnum: [],
		isRef: [],
		types: [],
		dependencies: [],
		originalSchema: [],
		allProperties: [],
		hasReadonlyProps: false,
		example: schema.example,
		examples: resolveExampleRefs(schema.examples, context),
		requiredProperties: separator === "allOf" ? schema.required ?? [] : []
	};
	for (const subSchema of items) {
		let propName;
		if (context.output.override.aliasCombinedTypes) {
			propName = name ? name + pascal(separator) : void 0;
			if (propName && resolvedData.schemas.length > 0) propName = propName + pascal(getNumberWord(resolvedData.schemas.length + 1));
		}
		if (separator === "allOf" && isSchema(subSchema) && subSchema.required) resolvedData.requiredProperties.push(...subSchema.required);
		const resolvedValue = resolveObject({
			schema: subSchema,
			propName,
			combined: true,
			context,
			formDataContext
		});
		const aliasedImports = getAliasedImports({
			context,
			name,
			resolvedValue
		});
		const value = getImportAliasForRefOrValue({
			context,
			resolvedValue,
			imports: aliasedImports
		});
		resolvedData.values.push(value);
		resolvedData.imports.push(...aliasedImports);
		resolvedData.schemas.push(...resolvedValue.schemas);
		resolvedData.dependencies.push(...resolvedValue.dependencies);
		resolvedData.isEnum.push(resolvedValue.isEnum);
		resolvedData.types.push(resolvedValue.type);
		resolvedData.isRef.push(resolvedValue.isRef);
		resolvedData.originalSchema.push(resolvedValue.originalSchema);
		if (resolvedValue.hasReadonlyProps) resolvedData.hasReadonlyProps = true;
		const originalProps = resolvedValue.originalSchema.properties;
		if (resolvedValue.type === "object" && originalProps) resolvedData.allProperties.push(...Object.keys(originalProps));
	}
	if (resolvedData.isEnum.every(Boolean) && name && items.length > 1 && context.output.override.enumGenerationType !== EnumGeneration.UNION) {
		const { value: combinedEnumValue, valueImports, hasNull } = getCombinedEnumValue(resolvedData.values.map((value, index) => ({
			value,
			isRef: resolvedData.isRef[index],
			schema: resolvedData.originalSchema[index]
		})));
		const newEnum = `export const ${pascal(name)} = ${combinedEnumValue}`;
		const valueImportSet = new Set(valueImports);
		const typeSuffix = `${nullable}${hasNull && !nullable.includes("null") ? " | null" : ""}`;
		return {
			value: `typeof ${pascal(name)}[keyof typeof ${pascal(name)}]${typeSuffix}`,
			imports: [{ name: pascal(name) }],
			schemas: [...resolvedData.schemas, {
				imports: resolvedData.imports.filter((toImport) => valueImportSet.has(toImport.alias ?? toImport.name)).map((toImport) => ({
					...toImport,
					values: true
				})),
				model: newEnum,
				name
			}],
			isEnum: false,
			type: "object",
			isRef: false,
			hasReadonlyProps: resolvedData.hasReadonlyProps,
			dependencies: resolvedData.dependencies,
			example: schema.example,
			examples: resolveExampleRefs(schema.examples, context)
		};
	}
	let resolvedValue;
	const normalizedProperties = normalizedSchema.properties;
	const schemaOneOf = schema.oneOf;
	const schemaAnyOf = schema.anyOf;
	if (normalizedProperties) resolvedValue = getScalar({
		item: Object.fromEntries(Object.entries(normalizedSchema).filter(([key]) => key !== separator)),
		name,
		context,
		formDataContext
	});
	else if (separator === "allOf" && (schemaOneOf || schemaAnyOf)) {
		const siblingCombiner = schemaOneOf ? "oneOf" : "anyOf";
		const siblingSchemas = schemaOneOf ?? schemaAnyOf;
		resolvedValue = combineSchemas({
			schema: { [siblingCombiner]: siblingSchemas },
			name,
			separator: siblingCombiner,
			context,
			nullable: ""
		});
	}
	return {
		value: dedupeUnionType(combineValues({
			resolvedData,
			separator,
			resolvedValue,
			context,
			parentSchema: normalizedSchema
		}) + nullable),
		imports: resolvedValue ? [...resolvedData.imports, ...resolvedValue.imports] : resolvedData.imports,
		schemas: resolvedValue ? [...resolvedData.schemas, ...resolvedValue.schemas] : resolvedData.schemas,
		dependencies: resolvedValue ? [...resolvedData.dependencies, ...resolvedValue.dependencies] : resolvedData.dependencies,
		isEnum: false,
		type: "object",
		isRef: false,
		hasReadonlyProps: resolvedData.hasReadonlyProps || (resolvedValue?.hasReadonlyProps ?? false),
		example: schema.example,
		examples: resolveExampleRefs(schema.examples, context)
	};
}
//#endregion
//#region src/getters/discriminators.ts
function resolveDiscriminators(schemas, context) {
	const transformedSchemas = schemas;
	for (const schema of Object.values(transformedSchemas)) {
		if (isBoolean$1(schema)) continue;
		const discriminator = schema.discriminator;
		if (!schema.oneOf && isArray(discriminator?.oneOf)) schema.oneOf = discriminator.oneOf;
		if (schema.discriminator?.mapping) {
			const { mapping, propertyName } = schema.discriminator;
			for (const [mappingKey, mappingValue] of Object.entries(mapping)) {
				let subTypeSchema;
				try {
					const { originalName } = getRefInfo(mappingValue, context);
					subTypeSchema = transformedSchemas[pascal(originalName)] ?? transformedSchemas[originalName];
				} catch {
					subTypeSchema = transformedSchemas[mappingValue];
				}
				if (isBoolean$1(subTypeSchema) || propertyName === void 0) continue;
				const property = subTypeSchema.properties?.[propertyName];
				if (isBoolean$1(property)) continue;
				const schemaProperty = property && !isReference(property) ? property : void 0;
				const enumProperty = schemaProperty ? getPropertySafe(schemaProperty, "enum") : {
					hasProperty: false,
					value: void 0
				};
				const enumValues = enumProperty.hasProperty && Array.isArray(enumProperty.value) ? enumProperty.value : void 0;
				const propertyType = schemaProperty?.type ?? "string";
				let typedMappingKey = mappingKey;
				if (propertyType === "boolean") typedMappingKey = mappingKey === "true";
				else if (propertyType === "number" || propertyType === "integer") {
					const parsed = Number(mappingKey);
					if (!Number.isNaN(parsed)) typedMappingKey = parsed;
				}
				const mergedEnumValues = [...(enumValues ?? []).filter((value) => value !== typedMappingKey), typedMappingKey];
				const mergedProperty = {
					...schemaProperty,
					type: propertyType,
					enum: mergedEnumValues
				};
				delete mergedProperty.const;
				subTypeSchema.properties = {
					...subTypeSchema.properties,
					[propertyName]: mergedProperty
				};
				subTypeSchema.required = [...new Set([...subTypeSchema.required ?? [], propertyName])];
			}
		}
	}
	return transformedSchemas;
}
//#endregion
//#region src/getters/operation.ts
function getOperationId(operation, route, verb) {
	if (isString(operation.operationId)) return operation.operationId;
	return pascal([verb, ...route.split("/").map((p) => sanitize(p, {
		dash: true,
		underscore: "-",
		dot: "-",
		whitespace: "-"
	}))].join("-"));
}
//#endregion
//#region src/getters/parameters.ts
function getParameters({ parameters, context }) {
	const result = {
		path: [],
		query: [],
		header: []
	};
	for (const p of parameters) if (isReference(p)) {
		const { schema, imports } = resolveRef(p, context);
		const parameter = schema;
		const location = parameter.in;
		if (location === "path" || location === "query" || location === "header") result[location].push({
			parameter,
			imports
		});
	} else if (p.in === "query" || p.in === "path" || p.in === "header") result[p.in].push({
		parameter: p,
		imports: []
	});
	return result;
}
//#endregion
//#region src/getters/params.ts
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
function getParamsInPath(path) {
	let n;
	const output = [];
	const templatePathRegex = /\{(.*?)\}/g;
	while ((n = templatePathRegex.exec(path)) !== null) output.push(n[1]);
	return output;
}
function getParams({ route, pathParams = [], operationId, context, output }) {
	return getParamsInPath(route).map((p) => {
		const pathParam = pathParams.find(({ parameter }) => sanitize(camel(parameter.name), {
			es5keyword: true,
			underscore: true,
			dash: true
		}) === p);
		if (!pathParam) throw new Error(`The path params ${p} can't be found in parameters (${operationId})`);
		const { name: nameWithoutSanitize, required = false, schema } = pathParam.parameter;
		const name = sanitize(camel(nameWithoutSanitize), { es5keyword: true });
		if (!schema) return {
			name,
			definition: `${name}${required ? "" : "?"}: unknown`,
			implementation: `${name}${required ? "" : "?"}: unknown`,
			default: false,
			required,
			imports: []
		};
		const resolvedValue = resolveValue({
			schema,
			context
		});
		const originalSchema = resolvedValue.originalSchema;
		const schemaDefault = originalSchema.default;
		let paramType = resolvedValue.value;
		if (output.allParamsOptional) paramType = `${paramType} | undefined | null`;
		return {
			name,
			definition: `${name}${!required || schemaDefault ? "?" : ""}: ${paramType}`,
			implementation: `${name}${!required && !schemaDefault ? "?" : ""}${schemaDefault ? `: ${paramType} = ${stringify(schemaDefault)}` : `: ${paramType}`}`,
			default: schemaDefault,
			required,
			imports: resolvedValue.imports,
			originalSchema
		};
	});
}
//#endregion
//#region src/getters/props.ts
function getProps({ body, queryParams, params, operationName, headers, context }) {
	const bodyProp = {
		name: body.implementation,
		definition: `${body.implementation}${body.isOptional && !context.output.optionsParamRequired ? "?" : ""}: ${body.definition}`,
		implementation: `${body.implementation}${body.isOptional && !context.output.optionsParamRequired ? "?" : ""}: ${body.definition}`,
		default: false,
		required: !body.isOptional || context.output.optionsParamRequired,
		type: GetterPropType.BODY
	};
	const queryParamsProp = {
		name: "params",
		definition: getQueryParamDefinition(queryParams, context),
		implementation: getQueryParamDefinition(queryParams, context),
		default: false,
		required: isNullish(queryParams?.isOptional) ? !context.output.allParamsOptional || context.output.optionsParamRequired : !queryParams.isOptional && !context.output.allParamsOptional || context.output.optionsParamRequired,
		type: GetterPropType.QUERY_PARAM
	};
	const headersProp = {
		name: "headers",
		definition: `headers${headers?.isOptional && !context.output.optionsParamRequired ? "?" : ""}: ${headers?.schema.name}`,
		implementation: `headers${headers?.isOptional && !context.output.optionsParamRequired ? "?" : ""}: ${headers?.schema.name}`,
		default: false,
		required: isNullish(headers?.isOptional) ? false : !headers.isOptional || context.output.optionsParamRequired,
		type: GetterPropType.HEADER
	};
	let paramGetterProps;
	if (context.output.override.useNamedParameters && params.length > 0) {
		const parameterTypeName = `${pascal(operationName)}PathParameters`;
		const name = "pathParams";
		const namedParametersTypeDefinition = `export type ${parameterTypeName} = {\n ${params.map((property) => property.definition).join(",\n    ")},\n }`;
		const isOptional = context.output.optionsParamRequired || params.every((param) => param.default !== void 0);
		const implementation = `{ ${params.map((property) => property.default === void 0 ? property.name : `${property.name} = ${stringify(property.default)}`).join(", ")} }: ${parameterTypeName}${isOptional ? " = {}" : ""}`;
		const destructured = `{ ${params.map((property) => property.name).join(", ")} }`;
		paramGetterProps = [{
			type: GetterPropType.NAMED_PATH_PARAMS,
			name,
			definition: `${name}: ${parameterTypeName}`,
			implementation,
			default: false,
			destructured,
			required: true,
			schema: {
				name: parameterTypeName,
				model: namedParametersTypeDefinition,
				imports: params.flatMap((property) => property.imports)
			}
		}];
	} else paramGetterProps = params.map((param) => ({
		...param,
		type: GetterPropType.PARAM
	}));
	return sortByPriority([
		...paramGetterProps,
		...body.definition ? [bodyProp] : [],
		...queryParams ? [queryParamsProp] : [],
		...headers ? [headersProp] : []
	]);
}
function getQueryParamDefinition(queryParams, context) {
	const paramType = queryParams?.schema.name;
	return `params${(queryParams?.isOptional || context.output.allParamsOptional) && !context.output.optionsParamRequired ? "?" : ""}: ${paramType}`;
}
//#endregion
//#region src/getters/query-params.ts
const isOpenApiSchemaObject = (value) => {
	if (!value || typeof value !== "object") return false;
	return !("$ref" in value);
};
const isSchemaNullable = (schema) => {
	if (schema.nullable === true) return true;
	if (schema.type === "null") return true;
	if (Array.isArray(schema.type) && schema.type.includes("null")) return true;
	const oneOfVariants = Array.isArray(schema.oneOf) ? schema.oneOf : [];
	const anyOfVariants = Array.isArray(schema.anyOf) ? schema.anyOf : [];
	return [...oneOfVariants, ...anyOfVariants].some((variant) => {
		if (!isOpenApiSchemaObject(variant)) return false;
		return isSchemaNullable(variant);
	});
};
function getQueryParamsTypes(queryParams, operationName, context) {
	return queryParams.map(({ parameter, imports: parameterImports }) => {
		const { name, required, schema: schemaParam, content } = parameter;
		const queryName = sanitize(`${pascal(operationName)}${pascal(name)}`, {
			underscore: "_",
			whitespace: "_",
			dash: true,
			es5keyword: true,
			es5IdentifierName: true
		});
		const schema = schemaParam ?? content?.["application/json"]?.schema;
		if (!schema) throw new Error(`Query parameter "${name}" has no schema or content definition`);
		const resolvedValue = resolveValue({
			schema,
			context,
			name: queryName
		});
		const key = getKey(name);
		const schemaForDoc = schema;
		const doc = jsDoc({
			description: parameter.description,
			...schemaForDoc
		}, void 0, context);
		if (parameterImports.length > 0) return {
			name,
			required,
			definition: `${doc}${key}${!required || schema.default ? "?" : ""}: ${parameterImports[0].name};`,
			imports: parameterImports,
			schemas: [],
			originalSchema: resolvedValue.originalSchema
		};
		if (resolvedValue.isEnum && !resolvedValue.isRef) {
			const enumName = queryName;
			const enumValue = getEnum(resolvedValue.value, enumName, getEnumNames(resolvedValue.originalSchema), context.output.override.enumGenerationType, getEnumDescriptions(resolvedValue.originalSchema), context.output.override.namingConvention.enum);
			return {
				name,
				required,
				definition: `${doc}${key}${!required || schema.default ? "?" : ""}: ${enumName};`,
				imports: [{ name: enumName }],
				schemas: [...resolvedValue.schemas, {
					name: enumName,
					model: enumValue,
					imports: resolvedValue.imports
				}],
				originalSchema: resolvedValue.originalSchema
			};
		}
		return {
			name,
			required,
			definition: `${doc}${key}${!required || schema.default ? "?" : ""}: ${resolvedValue.value};`,
			imports: resolvedValue.imports,
			schemas: resolvedValue.schemas,
			originalSchema: resolvedValue.originalSchema
		};
	});
}
function getQueryParams({ queryParams, operationName, context, suffix = "params" }) {
	if (queryParams.length === 0) return;
	const types = getQueryParamsTypes(queryParams, operationName, context);
	const imports = types.flatMap(({ imports }) => imports);
	const schemas = types.flatMap(({ schemas }) => schemas);
	const name = `${pascal(operationName)}${pascal(suffix)}`;
	const type = types.map(({ definition }) => definition).join("\n");
	const allOptional = queryParams.every(({ parameter }) => !parameter.required);
	const requiredNullableKeys = types.filter(({ required, originalSchema }) => required && isSchemaNullable(originalSchema)).map(({ name }) => name);
	return {
		schema: {
			name,
			model: `export type ${name} = {\n${type}\n};\n`,
			imports
		},
		deps: schemas,
		isOptional: allOptional,
		requiredNullableKeys
	};
}
//#endregion
//#region src/getters/response.ts
function getResponse({ responses, operationName, context, contentType }) {
	const filteredTypes = filterByContentType(getResReqTypes(Object.entries(responses), operationName, context, "void", (type) => `${type.key}-${type.value}-${type.contentType}`), contentType);
	const imports = filteredTypes.flatMap(({ imports }) => imports);
	const schemas = filteredTypes.flatMap(({ schemas }) => schemas);
	const contentTypes = [...new Set(filteredTypes.map(({ contentType }) => contentType))];
	const groupedByStatus = {
		success: [],
		errors: []
	};
	for (const type of filteredTypes) if (type.key.startsWith("2")) groupedByStatus.success.push(type);
	else groupedByStatus.errors.push(type);
	const success = dedupeUnionType(groupedByStatus.success.map(({ value, formData }) => formData ? "Blob" : value).join(" | "));
	const errors = dedupeUnionType(groupedByStatus.errors.map(({ value }) => value).join(" | "));
	const defaultType = filteredTypes.find(({ key }) => key === "default")?.value;
	return {
		imports,
		definition: {
			success: success || (defaultType ?? "unknown"),
			errors: errors || (defaultType ?? "unknown")
		},
		isBlob: groupedByStatus.success.some((t) => !!t.contentType && isBinaryContentType(t.contentType)),
		types: groupedByStatus,
		contentTypes,
		schemas,
		originalSchema: responses
	};
}
//#endregion
//#region src/getters/route.ts
function isBaseUrlRuntime(baseUrl) {
	return isObject(baseUrl) && "runtime" in baseUrl && typeof baseUrl.runtime === "string";
}
/**
* Wraps a runtime expression for generated URL template literals.
* Pass the expression only (e.g. `process.env.API_BASE_URL`), not a `${...}` fragment.
*/
function runtimeExpressionToUrlPrefix(expression) {
	const t = expression.trim();
	if (!t) return "";
	return "${" + t + "}";
}
const hasParam = (path) => /[^{]*{[\w*_-]*}.*/.test(path);
const getRoutePath = (path) => {
	const matches = /([^{]*){?([\w*_-]*)}?(.*)/.exec(path);
	if (!matches?.length) return path;
	const prev = matches[1];
	const rawParam = matches[2];
	const rest = matches[3];
	const param = sanitize(camel(rawParam), {
		es5keyword: true,
		underscore: true,
		dash: true,
		dot: true
	});
	const next = hasParam(rest) ? getRoutePath(rest) : rest;
	return hasParam(path) ? `${prev}\${${param}}${next}` : `${prev}${param}${next}`;
};
function getRoute(route) {
	const splittedRoute = route.split("/");
	let result = "";
	for (const [i, path] of splittedRoute.entries()) {
		if (!path && !i) continue;
		result += path.includes("{") ? `/${getRoutePath(path)}` : `/${path}`;
	}
	return result;
}
function getFullRoute(route, servers, baseUrl) {
	const getBaseUrl = () => {
		if (!baseUrl) return "";
		if (isString(baseUrl)) return baseUrl;
		if (isBaseUrlRuntime(baseUrl)) return runtimeExpressionToUrlPrefix(baseUrl.runtime);
		if (baseUrl.getBaseUrlFromSpecification) {
			if (!servers) throw new Error("Orval is configured to use baseUrl from the specifications 'servers' field, but there exist no servers in the specification.");
			const server = servers.at(Math.min(baseUrl.index ?? 0, servers.length - 1));
			if (!server) return "";
			const serverUrl = server.url ?? "";
			if (!server.variables) return serverUrl;
			let url = serverUrl;
			const variables = baseUrl.variables;
			for (const variableKey of Object.keys(server.variables)) {
				const variable = server.variables[variableKey];
				if (variables?.[variableKey]) {
					if (variable.enum && !variable.enum.some((e) => e == variables[variableKey])) throw new Error(`Invalid variable value '${variables[variableKey]}' for variable '${variableKey}' when resolving ${serverUrl}. Valid values are: ${variable.enum.join(", ")}.`);
					url = url.replaceAll(`{${variableKey}}`, variables[variableKey]);
				} else url = url.replaceAll(`{${variableKey}}`, String(variable.default));
			}
			return url;
		}
		return baseUrl.baseUrl;
	};
	let fullRoute = route;
	const base = getBaseUrl();
	if (base) {
		if (base.endsWith("/") && route.startsWith("/")) fullRoute = route.slice(1);
		fullRoute = `${base}${fullRoute}`;
	}
	return fullRoute;
}
/**
* Returns `GeneratorImport` entries for {@link BaseUrlRuntime.imports} when `baseUrl` is a runtime config.
*
* Defaults `values` to true so symbols in `runtime` emit as value imports in the
* generated client. Set `values: false` explicitly only for unusual cases (e.g.
* type-only symbols referenced from the expression).
*/
function getBaseUrlRuntimeImports(baseUrl) {
	if (!baseUrl) return [];
	if (!isBaseUrlRuntime(baseUrl)) return [];
	return (baseUrl.imports ?? []).map((imp) => ({
		...imp,
		values: imp.values ?? true
	}));
}
function getRouteAsArray(route) {
	return route.split("/").filter((i) => i !== "").flatMap((segment) => {
		if (!segment.includes("${")) return [`'${segment}'`];
		return segment.split(/(\$\{.+?\})/g).filter(Boolean).map((part) => {
			const match = /^\$\{(.+?)\}$/.exec(part);
			return match ? match[1] : `'${part}'`;
		});
	}).join(",");
}
//#endregion
//#region src/generators/component-definition.ts
function generateComponentDefinition(responses = {}, context, suffix) {
	if (isEmptyish(responses)) return [];
	const generatorSchemas = [];
	for (const [name, response] of entries(responses)) {
		const allResponseTypes = getResReqTypes([[suffix, response]], name, context, "void");
		const imports = allResponseTypes.flatMap(({ imports }) => imports);
		const schemas = allResponseTypes.flatMap(({ schemas }) => schemas);
		const type = allResponseTypes.map(({ value }) => value).join(" | ");
		const modelName = sanitize(`${pascal(name)}${suffix}`, {
			underscore: "_",
			whitespace: "_",
			dash: true,
			es5keyword: true,
			es5IdentifierName: true
		});
		const model = `${jsDoc(response)}export type ${modelName} = ${type || "unknown"};\n`;
		generatorSchemas.push(...schemas);
		if (modelName !== type) generatorSchemas.push({
			name: modelName,
			model,
			imports
		});
	}
	return generatorSchemas;
}
//#endregion
//#region src/generators/imports.ts
function generateImports({ imports, namingConvention = NamingConvention.CAMEL_CASE }) {
	if (imports.length === 0) return "";
	const grouped = groupBy(uniqueWith(imports, (a, b) => a.name === b.name && a.default === b.default && a.alias === b.alias && a.values === b.values && a.isConstant === b.isConstant && a.namespaceImport === b.namespaceImport && a.syntheticDefaultImport === b.syntheticDefaultImport && a.importPath === b.importPath).map((imp) => ({
		...imp,
		importPath: imp.importPath ?? `./${conventionName(imp.name, namingConvention)}`
	})), (imp) => !imp.default && !imp.namespaceImport && !imp.syntheticDefaultImport && !imp.values && !imp.isConstant ? `aggregate|${imp.importPath}` : `single|${imp.importPath}|${imp.name}|${imp.alias ?? ""}|${String(imp.default)}|${String(imp.namespaceImport)}|${String(imp.syntheticDefaultImport)}|${String(imp.values)}|${String(imp.isConstant)}`);
	return Object.entries(grouped).toSorted(([a], [b]) => a.localeCompare(b)).map(([, group]) => {
		const sample = group[0];
		if (!sample.default && !sample.namespaceImport && !sample.syntheticDefaultImport && !sample.values && !sample.isConstant) return `import type { ${[...new Set(group.map(({ name, alias }) => `${name}${alias ? ` as ${alias}` : ""}`))].toSorted().join(", ")} } from '${sample.importPath}';`;
		const { name, values, alias, isConstant, importPath } = sample;
		return `import ${!values && !isConstant ? "type " : ""}{ ${name}${alias ? ` as ${alias}` : ""} } from '${importPath}';`;
	}).join("\n");
}
function generateMutatorImports({ mutators, implementation, oneMore }) {
	let imports = "";
	for (const mutator of uniqueWith(mutators, (a, b) => a.name === b.name && a.default === b.default)) {
		const path = `${oneMore ? "../" : ""}${mutator.path}`;
		const importDefault = mutator.default ? mutator.name : `{ ${mutator.name} }`;
		imports += `import ${importDefault} from '${path}';`;
		imports += "\n";
		if (implementation && (mutator.hasErrorType || mutator.bodyTypeName)) {
			let errorImportName = "";
			const targetErrorImportName = mutator.default ? `ErrorType as ${mutator.errorTypeName}` : mutator.errorTypeName;
			if (mutator.hasErrorType && implementation.includes(mutator.errorTypeName) && !imports.includes(`{ ${targetErrorImportName} `)) errorImportName = targetErrorImportName;
			let bodyImportName = "";
			const targetBodyImportName = mutator.default ? `BodyType as ${mutator.bodyTypeName}` : mutator.bodyTypeName;
			if (mutator.bodyTypeName && implementation.includes(mutator.bodyTypeName) && !imports.includes(` ${targetBodyImportName} }`)) bodyImportName = targetBodyImportName ?? "";
			if (bodyImportName || errorImportName) {
				imports += `import type { ${errorImportName}${errorImportName && bodyImportName ? " , " : ""}${bodyImportName} } from '${path}';`;
				imports += "\n";
			}
		}
	}
	return imports;
}
function generateDependency({ deps, isAllowSyntheticDefaultImports, dependency, projectName, key, onlyTypes }) {
	const defaultDep = deps.find((e) => e.default && (isAllowSyntheticDefaultImports || !e.syntheticDefaultImport));
	const namespaceImportDep = defaultDep ? void 0 : deps.find((e) => !!e.namespaceImport || !isAllowSyntheticDefaultImports && e.syntheticDefaultImport);
	const depsString = unique(deps.filter((e) => !e.default && !e.syntheticDefaultImport && !e.namespaceImport).map(({ name, alias }) => alias ? `${name} as ${alias}` : name)).toSorted().join(",\n  ");
	let importString = "";
	const namespaceImportString = namespaceImportDep ? `import * as ${namespaceImportDep.name} from '${dependency}';` : "";
	if (namespaceImportString) {
		if (deps.length === 1) return namespaceImportString;
		importString += `${namespaceImportString}\n`;
	}
	importString += `import ${onlyTypes ? "type " : ""}${defaultDep ? `${defaultDep.name}${depsString ? "," : ""}` : ""}${depsString ? `{\n  ${depsString}\n}` : ""} from '${dependency}${key !== "default" && projectName ? `/${projectName}` : ""}';`;
	return importString;
}
function addDependency({ implementation, exports, dependency, projectName, isAllowSyntheticDefaultImports }) {
	const toAdds = exports.filter((e) => {
		const searchWords = [e.alias, e.name].filter((p) => Boolean(p?.length)).map((part) => escapeRegExp(part)).join("|");
		if (!searchWords) return false;
		const pattern = new RegExp(String.raw`\b(${searchWords})\b`, "g");
		return implementation.match(pattern);
	});
	if (toAdds.length === 0) return;
	const groupedBySpecKey = { default: {
		types: [],
		values: []
	} };
	for (const dep of toAdds) {
		const key = "default";
		if (dep.values && (isAllowSyntheticDefaultImports || !dep.syntheticDefaultImport)) groupedBySpecKey[key].values.push(dep);
		else groupedBySpecKey[key].types.push(dep);
	}
	return Object.entries(groupedBySpecKey).map(([key, { values, types }]) => {
		let dep = "";
		if (values.length > 0) dep += generateDependency({
			deps: values,
			isAllowSyntheticDefaultImports,
			dependency,
			projectName,
			key,
			onlyTypes: false
		});
		if (types.length > 0) {
			let uniqueTypes = types;
			if (values.length > 0) uniqueTypes = types.filter((t) => !values.some((v) => v.name === t.name && (v.alias ?? "") === (t.alias ?? "")));
			if (uniqueTypes.length > 0) {
				if (values.length > 0) dep += "\n";
				dep += generateDependency({
					deps: uniqueTypes,
					isAllowSyntheticDefaultImports,
					dependency,
					projectName,
					key,
					onlyTypes: true
				});
			}
		}
		return dep;
	}).join("\n") + "\n";
}
function getLibName(code) {
	return (code.split(" from ").at(-1) ?? "").split(";")[0].trim();
}
function generateDependencyImports(implementation, imports, projectName, hasSchemaDir, isAllowSyntheticDefaultImports) {
	const dependencies = imports.map((dep) => addDependency({
		...dep,
		implementation,
		projectName,
		hasSchemaDir,
		isAllowSyntheticDefaultImports
	})).filter((x) => Boolean(x)).toSorted((a, b) => {
		const aLib = getLibName(a);
		const bLib = getLibName(b);
		if (aLib === bLib) return 0;
		if (aLib.startsWith("'.") && !bLib.startsWith("'.")) return 1;
		return aLib < bLib ? -1 : 1;
	}).join("\n");
	return dependencies ? dependencies + "\n" : "";
}
function generateVerbImports({ response, body, queryParams, props, headers, params }) {
	return [
		...response.imports,
		...body.imports,
		...props.flatMap((prop) => prop.type === GetterPropType.NAMED_PATH_PARAMS ? [{ name: prop.schema.name }] : []),
		...queryParams ? [{ name: queryParams.schema.name }] : [],
		...headers ? [{ name: headers.schema.name }] : [],
		...params.flatMap(({ imports }) => imports)
	].flatMap((imp) => {
		if (imp.name !== "Error" || !imp.values || imp.alias) return [imp];
		return [{
			...imp,
			values: void 0
		}, {
			...imp,
			alias: "ErrorSchema",
			values: true
		}];
	});
}
//#endregion
//#region src/generators/input-filters.ts
const COMPONENT_TYPES = [
	"schemas",
	"responses",
	"parameters",
	"requestBodies"
];
function filteredVerbs(verbs, filters) {
	if (filters?.tags === void 0) return Object.entries(verbs);
	const filterTags = filters.tags;
	const filterMode = filters.mode ?? "include";
	return Object.entries(verbs).filter(([, operation]) => {
		const isMatch = (operation.tags ?? []).some((tag) => filterTags.some((filterTag) => filterTag instanceof RegExp ? filterTag.test(tag) : filterTag === tag));
		return filterMode === "exclude" ? !isMatch : isMatch;
	});
}
function findRefs(value) {
	if (!value || typeof value !== "object") return [];
	if (Array.isArray(value)) return value.flatMap((item) => findRefs(item));
	const obj = value;
	if (typeof obj.$ref === "string") return [obj.$ref];
	return Object.values(obj).flatMap((val) => findRefs(val));
}
function parseComponentRef(ref) {
	const parts = ref.split("/");
	if (parts[0] !== "#" || parts[1] !== "components" || parts.length < 4) return;
	const type = parts[2];
	const name = parts[3];
	if (!COMPONENT_TYPES.includes(type)) return;
	return {
		type,
		name
	};
}
function getComponentNames(refs, spec) {
	return refs.map((ref) => parseComponentRef(ref)).filter((parsed) => !!parsed && !!spec.components?.[parsed.type]?.[parsed.name]);
}
function resolveReferencedComponents(refs, spec, resolved) {
	const newComponents = getComponentNames(refs, spec).filter(({ type, name }) => !resolved[type].includes(name));
	if (newComponents.length === 0) return resolved;
	const nextResolved = {
		schemas: [...resolved.schemas],
		responses: [...resolved.responses],
		parameters: [...resolved.parameters],
		requestBodies: [...resolved.requestBodies]
	};
	for (const { type, name } of newComponents) nextResolved[type].push(name);
	return resolveReferencedComponents(newComponents.flatMap(({ type, name }) => findRefs(spec.components?.[type]?.[name])), spec, nextResolved);
}
const collectReferencedComponents = (spec, tags, mode) => {
	const filters = {
		tags,
		mode
	};
	return resolveReferencedComponents(Object.values(spec.paths ?? {}).filter((pathItem) => !!pathItem).flatMap((pathItem) => {
		return [...filteredVerbs(pathItem, filters).flatMap(([, operation]) => findRefs(operation)), ...findRefs(pathItem.parameters)];
	}), spec, {
		schemas: [],
		responses: [],
		parameters: [],
		requestBodies: []
	});
};
//#endregion
//#region src/generators/models-inline.ts
function generateModelInline(acc, model) {
	return acc + `${model}\n`;
}
function generateModelsInline(obj) {
	const schemas = Array.isArray(obj) ? obj : Object.values(obj).flat();
	let result = "";
	for (const { model } of schemas) result = generateModelInline(result, model);
	return result;
}
//#endregion
//#region src/generators/mutator-info.ts
async function getMutatorInfo(filePath, options) {
	const { root = process.cwd(), namedExport = "default", alias, external, tsconfig } = options ?? {};
	return parseFile(await bundleFile(root, filePath, alias, external, tsconfig?.compilerOptions), namedExport, getEcmaVersion(tsconfig?.compilerOptions?.target));
}
async function bundleFile(root, fileName, alias, external, compilerOptions) {
	const { text } = (await build({
		absWorkingDir: root,
		entryPoints: [fileName],
		write: false,
		platform: "node",
		bundle: true,
		format: "esm",
		metafile: false,
		target: compilerOptions?.target ?? "es6",
		minify: false,
		minifyIdentifiers: false,
		minifySyntax: false,
		minifyWhitespace: false,
		treeShaking: false,
		keepNames: false,
		alias,
		external: external ?? ["*"]
	})).outputFiles[0];
	return text;
}
function parseFile(file, name, ecmaVersion = 6) {
	try {
		const ast = Parser.parse(file, {
			ecmaVersion,
			sourceType: "module"
		});
		const foundSpecifier = ast.body.filter((x) => x.type === "ExportNamedDeclaration").flatMap((x) => x.specifiers).find((x) => x.exported.type === "Identifier" && x.exported.name === name && x.local.type === "Identifier");
		if (foundSpecifier && "name" in foundSpecifier.local) {
			const exportedFuncName = foundSpecifier.local.name;
			return parseFunction(ast, exportedFuncName);
		}
	} catch {
		return;
	}
}
function parseFunction(ast, funcName) {
	const node = ast.body.find((childNode) => {
		if (childNode.type === "VariableDeclaration") return childNode.declarations.find((d) => d.id.type === "Identifier" && d.id.name === funcName);
		if (childNode.type === "FunctionDeclaration" && childNode.id.name === funcName) return childNode;
	});
	if (!node) return;
	if (node.type === "FunctionDeclaration") {
		const returnStatement = node.body.body.find((b) => b.type === "ReturnStatement");
		if (returnStatement?.argument && "params" in returnStatement.argument) return {
			numberOfParams: node.params.length,
			returnNumberOfParams: returnStatement.argument.params.length
		};
		else if (returnStatement?.argument?.type === "CallExpression") {
			const arrowFn = returnStatement.argument.arguments.at(0);
			if (arrowFn?.type === "ArrowFunctionExpression") return {
				numberOfParams: node.params.length,
				returnNumberOfParams: arrowFn.params.length
			};
		}
		return { numberOfParams: node.params.length };
	}
	const declaration = "declarations" in node ? node.declarations.find((d) => d.id.type === "Identifier" && d.id.name === funcName) : void 0;
	if (declaration?.init) {
		if ("name" in declaration.init) return parseFunction(ast, declaration.init.name);
		if ("body" in declaration.init && "params" in declaration.init && declaration.init.body.type === "ArrowFunctionExpression") return {
			numberOfParams: declaration.init.params.length,
			returnNumberOfParams: declaration.init.body.params.length
		};
		const returnStatement = "body" in declaration.init && "body" in declaration.init.body && isArray(declaration.init.body.body) ? declaration.init.body.body.find((b) => b.type === "ReturnStatement") : void 0;
		if ("params" in declaration.init) {
			if (returnStatement?.argument && "params" in returnStatement.argument) return {
				numberOfParams: declaration.init.params.length,
				returnNumberOfParams: returnStatement.argument.params.length
			};
			else if (returnStatement?.argument?.type === "CallExpression" && returnStatement.argument.arguments[0]?.type === "ArrowFunctionExpression") {
				const arrowFn = returnStatement.argument.arguments[0];
				return {
					numberOfParams: declaration.init.params.length,
					returnNumberOfParams: arrowFn.params.length
				};
			}
			return { numberOfParams: declaration.init.params.length };
		}
	}
}
function getEcmaVersion(target) {
	if (!target) return;
	if (target.toLowerCase() === "esnext") return "latest";
	try {
		return Number(target.toLowerCase().replace("es", ""));
	} catch {
		return;
	}
}
//#endregion
//#region src/generators/mutator.ts
const BODY_TYPE_NAME = "BodyType";
const getImport = (output, mutator) => {
	const outputFile = getFileInfo(output).path;
	return `${getRelativeImportPath(outputFile, mutator.path)}${mutator.extension ?? ""}`;
};
async function generateMutator({ output, mutator, name, workspace, tsconfig }) {
	if (!mutator || !output) return;
	const isDefault = mutator.default;
	const importName = mutator.name ?? `${name}Mutator`;
	const importPath = mutator.path;
	const mutatorInfoName = isDefault ? "default" : mutator.name;
	if (mutatorInfoName === void 0) throw new Error(styleText("red", `Mutator ${importPath} must have a named or default export.`));
	let rawFile = await fs$1.readFile(importPath, "utf8");
	rawFile = removeComments(rawFile);
	const hasErrorType = rawFile.includes("export type ErrorType") || rawFile.includes("export interface ErrorType");
	const hasBodyType = rawFile.includes(`export type BodyType`) || rawFile.includes(`export interface BodyType`);
	const errorTypeName = mutator.default ? `${pascal(name)}ErrorType` : "ErrorType";
	const bodyTypeName = mutator.default ? `${pascal(name)}${BODY_TYPE_NAME}` : BODY_TYPE_NAME;
	const mutatorInfo = await getMutatorInfo(importPath, {
		root: workspace,
		namedExport: mutatorInfoName,
		alias: mutator.alias,
		external: mutator.external,
		tsconfig
	});
	if (!mutatorInfo) throw new Error(styleText("red", `Your mutator file doesn't have the ${mutatorInfoName} exported function`));
	const importStatementPath = getImport(output, mutator);
	const isHook = mutator.name ? mutator.name.startsWith("use") && !mutatorInfo.numberOfParams : !mutatorInfo.numberOfParams;
	return {
		name: mutator.name || !isHook ? importName : `use${pascal(importName)}`,
		path: importStatementPath,
		default: isDefault,
		hasErrorType,
		errorTypeName,
		hasSecondArg: isHook ? (mutatorInfo.returnNumberOfParams ?? 0) > 1 : mutatorInfo.numberOfParams > 1,
		hasThirdArg: mutatorInfo.numberOfParams > 2,
		isHook,
		...hasBodyType ? { bodyTypeName } : {}
	};
}
function removeComments(file) {
	return file.replaceAll(/\/\/.*|\/\*[\s\S]*?\*\//g, "");
}
//#endregion
//#region src/generators/options.ts
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
const getAngularFilteredParamsExpression = (paramsExpression, requiredNullableParamKeys = [], preserveRequiredNullables = false) => {
	const filteredParamValueType = `string | number | boolean${preserveRequiredNullables ? " | null" : ""} | Array<string | number | boolean>`;
	const preserveNullableBranch = preserveRequiredNullables ? `    } else if (value === null && requiredNullableParamKeys.has(key)) {
      filteredParams[key] = null;
` : "";
	return `(() => {
  const requiredNullableParamKeys = new Set<string>(${JSON.stringify(requiredNullableParamKeys)});
  const filteredParams: Record<string, ${filteredParamValueType}> = {};
  for (const [key, value] of Object.entries(${paramsExpression})) {
    if (Array.isArray(value)) {
      const filtered = value.filter(
        (item) =>
          item != null &&
          (typeof item === 'string' ||
            typeof item === 'number' ||
            typeof item === 'boolean'),
      ) as Array<string | number | boolean>;
      if (filtered.length) {
        filteredParams[key] = filtered;
      }
${preserveNullableBranch}    } else if (
      value != null &&
      (typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean')
    ) {
      filteredParams[key] = value;
    }
  }
  return filteredParams;
})()`;
};
/**
* Returns the body of a standalone `filterParams` helper function
* to be emitted once in the generated file header, replacing the
* inline IIFE that was previously duplicated in every method.
*/
const getAngularFilteredParamsHelperBody = () => `type AngularHttpParamValue = string | number | boolean | Array<string | number | boolean>;
type AngularHttpParamValueWithNullable = AngularHttpParamValue | null;

function filterParams(
  params: Record<string, unknown>,
  requiredNullableKeys?: ReadonlySet<string>,
  preserveRequiredNullables?: false,
): Record<string, AngularHttpParamValue>;
function filterParams(
  params: Record<string, unknown>,
  requiredNullableKeys: ReadonlySet<string> | undefined,
  preserveRequiredNullables: true,
): Record<string, AngularHttpParamValueWithNullable>;
function filterParams(
  params: Record<string, unknown>,
  requiredNullableKeys: ReadonlySet<string> = new Set(),
  preserveRequiredNullables = false,
): Record<string, AngularHttpParamValueWithNullable> {
  const filteredParams: Record<string, AngularHttpParamValueWithNullable> = {};
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      const filtered = value.filter(
        (item) =>
          item != null &&
          (typeof item === 'string' ||
            typeof item === 'number' ||
            typeof item === 'boolean'),
      ) as Array<string | number | boolean>;
      if (filtered.length) {
        filteredParams[key] = filtered;
      }
    } else if (
      preserveRequiredNullables &&
      value === null &&
      requiredNullableKeys.has(key)
    ) {
      filteredParams[key] = null;
    } else if (
      value != null &&
      (typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean')
    ) {
      filteredParams[key] = value;
    }
  }
  return filteredParams;
}`;
/**
* Returns a call expression to the `filterParams` helper function.
*/
const getAngularFilteredParamsCallExpression = (paramsExpression, requiredNullableParamKeys = [], preserveRequiredNullables = false) => `filterParams(${paramsExpression}, new Set<string>(${JSON.stringify(requiredNullableParamKeys)})${preserveRequiredNullables ? ", true" : ""})`;
function generateBodyOptions(body, isFormData, isFormUrlEncoded) {
	if (isFormData && body.formData) return "\n      formData,";
	if (isFormUrlEncoded && body.formUrlEncoded) return "\n      formUrlEncoded,";
	if (body.implementation) return `\n      ${body.implementation},`;
	return "";
}
function generateAxiosOptions({ response, isExactOptionalPropertyTypes, angularObserve, angularParamsRef, requiredNullableQueryParamKeys, queryParams, headers, requestOptions, hasSignal, hasSignalParam = false, isVue, isAngular, paramsSerializer, paramsSerializerOptions }) {
	const isRequestOptions = requestOptions !== false;
	const signalVar = hasSignalParam ? "querySignal" : "signal";
	const signalProp = hasSignalParam ? `signal: ${signalVar}` : "signal";
	if (!queryParams && !headers && !response.isBlob && response.definition.success !== "string") {
		if (isRequestOptions) return isAngular ? angularObserve ? `{
        ...(options as Omit<NonNullable<typeof options>, 'observe'>),
        observe: '${angularObserve}',
      }` : "(options as Omit<NonNullable<typeof options>, 'observe'>)" : "options";
		if (hasSignal) return isExactOptionalPropertyTypes ? `...(${signalVar} ? { ${signalProp} } : {})` : signalProp;
		return "";
	}
	let value = "";
	if (!isRequestOptions) {
		if (queryParams) if (isAngular) {
			const iifeExpr = getAngularFilteredParamsExpression("params ?? {}", requiredNullableQueryParamKeys, !!paramsSerializer);
			value += paramsSerializer ? `\n        params: ${paramsSerializer.name}(${iifeExpr}),` : `\n        params: ${iifeExpr},`;
		} else value += "\n        params,";
		if (headers) value += "\n        headers,";
		if (hasSignal) value += isExactOptionalPropertyTypes ? `\n        ...(${signalVar} ? { ${signalProp} } : {}),` : `\n        ${signalProp},`;
	}
	if (!isObject(requestOptions) || !Object.hasOwn(requestOptions, "responseType")) {
		const successResponseType = getSuccessResponseType(response);
		if (successResponseType) value += `\n        responseType: '${successResponseType}',`;
	}
	if (isObject(requestOptions)) value += `\n ${stringify(requestOptions)?.slice(1, -1)}`;
	if (isRequestOptions) {
		value += isAngular ? "\n    ...(options as Omit<NonNullable<typeof options>, 'observe'>)," : "\n    ...options,";
		if (isAngular && angularObserve) value += `\n        observe: '${angularObserve}',`;
		if (queryParams) if (isVue) value += "\n        params: {...unref(params), ...options?.params},";
		else if (isAngular && angularParamsRef) value += `\n        params: ${angularParamsRef},`;
		else if (isAngular && paramsSerializer) {
			const callExpr = getAngularFilteredParamsCallExpression("{...params, ...options?.params}", requiredNullableQueryParamKeys, true);
			value += `\n        params: ${paramsSerializer.name}(${callExpr}),`;
		} else if (isAngular) value += `\n        params: ${getAngularFilteredParamsCallExpression("{...params, ...options?.params}", requiredNullableQueryParamKeys)},`;
		else value += "\n        params: {...params, ...options?.params},";
		if (headers) value += "\n        headers: {...headers, ...options?.headers},";
	}
	if (!isAngular && queryParams && (paramsSerializer || paramsSerializerOptions?.qs)) {
		const qsOptions = paramsSerializerOptions?.qs;
		value += paramsSerializer ? `\n        paramsSerializer: ${paramsSerializer.name},` : `\n        paramsSerializer: (params) => qs.stringify(params, ${JSON.stringify(qsOptions)}),`;
	}
	return value;
}
function generateOptions({ route, body, angularObserve, angularParamsRef, headers, queryParams, response, verb, requestOptions, isFormData, isFormUrlEncoded, isAngular, isExactOptionalPropertyTypes, hasSignal, hasSignalParam, isVue, paramsSerializer, paramsSerializerOptions }) {
	const bodyOptions = getIsBodyVerb(verb) ? generateBodyOptions(body, isFormData, isFormUrlEncoded) : "";
	const axiosOptions = generateAxiosOptions({
		response,
		angularObserve,
		angularParamsRef,
		requiredNullableQueryParamKeys: queryParams?.requiredNullableKeys,
		queryParams: queryParams?.schema,
		headers: headers?.schema,
		requestOptions,
		isExactOptionalPropertyTypes,
		hasSignal,
		hasSignalParam,
		isVue: isVue ?? false,
		isAngular: isAngular ?? false,
		paramsSerializer,
		paramsSerializerOptions
	});
	const trimmedAxiosOptions = axiosOptions.trim();
	const isRawOptionsArgument = trimmedAxiosOptions === "options" || trimmedAxiosOptions.startsWith("(") && trimmedAxiosOptions.endsWith(")") || trimmedAxiosOptions.startsWith("{") && trimmedAxiosOptions.endsWith("}");
	const optionsArgument = axiosOptions ? isRawOptionsArgument ? axiosOptions : `{${axiosOptions}}` : "";
	if (verb === Verbs.DELETE) {
		if (!bodyOptions) return `\n      \`${route}\`${optionsArgument ? `,${optionsArgument}` : ""}\n    `;
		const deleteBodyOptions = isRawOptionsArgument ? `...${optionsArgument}` : axiosOptions;
		return `\n      \`${route}\`,{${isAngular ? "body" : "data"}:${bodyOptions} ${axiosOptions ? deleteBodyOptions : ""}}\n    `;
	}
	const bodyOrOptions = getIsBodyVerb(verb) ? bodyOptions || "undefined," : "";
	return `\n      \`${route}\`${bodyOrOptions || optionsArgument ? "," : ""}${bodyOrOptions}${optionsArgument}\n    `;
}
function generateBodyMutatorConfig(body, isFormData, isFormUrlEncoded) {
	if (isFormData && body.formData) return ",\n       data: formData";
	if (isFormUrlEncoded && body.formUrlEncoded) return ",\n       data: formUrlEncoded";
	if (body.implementation) return `,\n      data: ${body.implementation}`;
	return "";
}
function generateQueryParamsAxiosConfig(response, isVue, isAngular, requiredNullableQueryParamKeys, queryParams) {
	if (!queryParams && !response.isBlob) return "";
	let value = "";
	if (queryParams) if (isVue) value += ",\n        params: unref(params)";
	else if (isAngular) value += `,\n        params: ${getAngularFilteredParamsExpression("params ?? {}", requiredNullableQueryParamKeys)}`;
	else value += ",\n        params";
	if (response.isBlob) value += `,\n        responseType: 'blob'`;
	return value;
}
function generateMutatorConfig({ route, body, headers, queryParams, response, verb, isFormData, isFormUrlEncoded, hasSignal, hasSignalParam = false, isExactOptionalPropertyTypes, isVue, isAngular }) {
	const bodyOptions = getIsBodyVerb(verb) ? generateBodyMutatorConfig(body, isFormData, isFormUrlEncoded) : "";
	const queryParamsOptions = generateQueryParamsAxiosConfig(response, isVue ?? false, isAngular ?? false, queryParams?.requiredNullableKeys, queryParams);
	const ignoreContentTypes = isAngular ? ["multipart/form-data"] : [];
	const headerOptions = body.contentType && !ignoreContentTypes.includes(body.contentType) ? `,\n      headers: {'Content-Type': '${body.contentType}', ${headers ? "...headers" : ""}}` : headers ? ",\n      headers" : "";
	const signalVar = hasSignalParam ? "querySignal" : "signal";
	const signalProp = hasSignalParam ? `signal: ${signalVar}` : "signal";
	return `{url: \`${route}\`, method: '${verb.toUpperCase()}'${headerOptions}${bodyOptions}${queryParamsOptions}${hasSignal ? `, ${isExactOptionalPropertyTypes ? `...(${signalVar} ? { ${signalProp} }: {})` : signalProp}` : ""}\n    }`;
}
function generateMutatorRequestOptions(requestOptions, hasSecondArgument) {
	if (!hasSecondArgument) return isObject(requestOptions) ? `{${stringify(requestOptions)?.slice(1, -1)}}` : "";
	if (isObject(requestOptions)) return `{${stringify(requestOptions)?.slice(1, -1)} ...options}`;
	return "options";
}
function generateFormDataAndUrlEncodedFunction({ body, formData, formUrlEncoded, isFormData, isFormUrlEncoded }) {
	if (isFormData && body.formData) {
		if (formData) return `const formData = ${formData.name}(${body.implementation})`;
		return body.formData;
	}
	if (isFormUrlEncoded && body.formUrlEncoded) {
		if (formUrlEncoded) return `const formUrlEncoded = ${formUrlEncoded.name}(${body.implementation})`;
		return body.formUrlEncoded;
	}
	return "";
}
//#endregion
//#region src/generators/parameter-definition.ts
function generateParameterDefinition(parameters = {}, context, suffix) {
	if (isEmptyish(parameters)) return [];
	const generatorSchemas = [];
	for (const [parameterName, parameter] of entries(parameters)) {
		const modelName = sanitize(`${pascal(parameterName)}${suffix}`, {
			underscore: "_",
			whitespace: "_",
			dash: true,
			es5keyword: true,
			es5IdentifierName: true
		});
		const { schema, imports } = resolveRef(parameter, context);
		if (schema.in !== "query" && schema.in !== "header") continue;
		if (!schema.schema || imports.length > 0) {
			generatorSchemas.push({
				name: modelName,
				imports: imports.length > 0 ? [{
					name: imports[0].name,
					schemaName: imports[0].schemaName
				}] : [],
				model: `export type ${modelName} = ${imports.length > 0 ? imports[0].name : "unknown"};\n`,
				dependencies: imports.length > 0 ? [imports[0].name] : []
			});
			continue;
		}
		const resolvedObject = resolveObject({
			schema: schema.schema,
			propName: modelName,
			context
		});
		const model = `${jsDoc(schema)}export type ${modelName} = ${resolvedObject.value || "unknown"};\n`;
		generatorSchemas.push(...resolvedObject.schemas);
		if (modelName !== resolvedObject.value) generatorSchemas.push({
			name: modelName,
			model,
			imports: resolvedObject.imports,
			dependencies: resolvedObject.dependencies
		});
	}
	return generatorSchemas;
}
//#endregion
//#region src/generators/interface.ts
/**
* Generate the interface string
* An eslint comment is insert if the resulted object is empty
*
* @param name interface name
* @param schema
*/
function generateInterface({ name, schema, context }) {
	const scalar = getScalar({
		item: schema,
		name,
		context
	});
	const isEmptyObject = scalar.value === "{}";
	const shouldUseTypeAlias = context.output.override.useTypeOverInterfaces ?? scalar.useTypeAlias;
	let model = "";
	model += jsDoc(schema);
	if (isEmptyObject) model += "// eslint-disable-next-line @typescript-eslint/no-empty-interface\n";
	if (scalar.type === "object" && !shouldUseTypeAlias) {
		const properties = schema.properties;
		if (properties && Object.values(properties).length > 0 && Object.values(properties).every((item) => "const" in item)) {
			const mappedScalarValue = scalar.value.replaceAll(";", ",").replaceAll("?:", ":");
			model += `export const ${name}Value = ${mappedScalarValue} as const;\nexport type ${name} = typeof ${name}Value;\n`;
		} else {
			const blankInterfaceValue = scalar.value === "unknown" ? "{}" : scalar.value;
			model += `export interface ${name} ${blankInterfaceValue}\n`;
		}
	} else model += `export type ${name} = ${scalar.value};\n`;
	const externalModulesImportsOnly = scalar.imports.filter((importName) => importName.alias ? importName.alias !== name : importName.name !== name);
	return [...scalar.schemas, {
		name,
		model,
		imports: externalModulesImportsOnly,
		dependencies: scalar.dependencies,
		schema
	}];
}
//#endregion
//#region src/generators/schema-definition.ts
/**
* Extract all types from #/components/schemas
*/
function generateSchemasDefinition(schemas = {}, context, suffix, filters) {
	if (isEmptyish(schemas)) return [];
	const transformedSchemas = resolveDiscriminators(schemas, context);
	let generateSchemas = Object.entries(transformedSchemas);
	if (filters?.schemas) {
		const schemasFilters = filters.schemas;
		const mode = filters.mode ?? "include";
		generateSchemas = generateSchemas.filter(([schemaName]) => {
			const isMatch = schemasFilters.some((filter) => isString(filter) ? filter === schemaName : filter.test(schemaName));
			return mode === "include" ? isMatch : !isMatch;
		});
	}
	const models = generateSchemas.flatMap(([schemaName, schema]) => generateSchemaDefinitions(schemaName, schema, context, suffix));
	const seenNames = /* @__PURE__ */ new Set();
	const deduplicatedModels = [];
	for (const schema of models) {
		const normalizedName = conventionName(schema.name, context.output.namingConvention);
		if (!seenNames.has(normalizedName)) {
			seenNames.add(normalizedName);
			deduplicatedModels.push(schema);
		}
	}
	return sortSchemasByDependencies(deduplicatedModels);
}
function sortSchemasByDependencies(schemas) {
	if (schemas.length === 0) return schemas;
	const schemaNames = new Set(schemas.map((schema) => schema.name));
	const dependencyMap = /* @__PURE__ */ new Map();
	for (const schema of schemas) {
		const dependencies = /* @__PURE__ */ new Set();
		if (schema.dependencies) {
			for (const dependencyName of schema.dependencies) if (dependencyName && schemaNames.has(dependencyName)) dependencies.add(dependencyName);
		}
		for (const imp of schema.imports) {
			const dependencyName = imp.alias ?? imp.name;
			if (dependencyName && schemaNames.has(dependencyName)) dependencies.add(dependencyName);
		}
		dependencyMap.set(schema.name, dependencies);
	}
	const sorted = [];
	const temporary = /* @__PURE__ */ new Set();
	const permanent = /* @__PURE__ */ new Set();
	const schemaMap = new Map(schemas.map((schema) => [schema.name, schema]));
	const visit = (name) => {
		if (permanent.has(name)) return;
		if (temporary.has(name)) return;
		temporary.add(name);
		const dependencies = dependencyMap.get(name);
		if (dependencies) {
			for (const dep of dependencies) if (dep !== name) visit(dep);
		}
		temporary.delete(name);
		permanent.add(name);
		const schema = schemaMap.get(name);
		if (schema) sorted.push(schema);
	};
	for (const schema of schemas) visit(schema.name);
	return sorted;
}
function shouldCreateInterface(schema) {
	const isNullable = isArray(schema.type) && schema.type.includes("null");
	return (!schema.type || schema.type === "object") && !schema.allOf && !schema.oneOf && !schema.anyOf && isDereferenced(schema) && !schema.enum && !isNullable;
}
function generateSchemaDefinitions(schemaName, schema, context, suffix) {
	const sanitizedSchemaName = sanitize(`${pascal(schemaName)}${suffix}`, {
		underscore: "_",
		whitespace: "_",
		dash: true,
		es5keyword: true,
		es5IdentifierName: true
	});
	if (isBoolean(schema)) return [{
		name: sanitizedSchemaName,
		model: `export type ${sanitizedSchemaName} = ${schema ? "any" : "never"};\n`,
		imports: [],
		schema
	}];
	if (shouldCreateInterface(schema)) return generateInterface({
		name: sanitizedSchemaName,
		schema,
		context
	});
	const resolvedValue = resolveValue({
		schema,
		name: sanitizedSchemaName,
		context
	});
	let output = "";
	let imports = resolvedValue.imports;
	output += jsDoc(schema);
	if (resolvedValue.isEnum && !resolvedValue.isRef) output += getEnum(resolvedValue.value, sanitizedSchemaName, getEnumNames(resolvedValue.originalSchema), context.output.override.enumGenerationType, getEnumDescriptions(resolvedValue.originalSchema), context.output.override.namingConvention.enum);
	else if (sanitizedSchemaName === resolvedValue.value && resolvedValue.isRef) {
		const { schema: referredSchema } = resolveRef(schema, context);
		if (!shouldCreateInterface(referredSchema)) {
			const imp = resolvedValue.imports.find((imp) => imp.name === sanitizedSchemaName);
			if (imp) {
				const alias = `${resolvedValue.value}Bis`;
				output += `export type ${sanitizedSchemaName} = ${alias};\n`;
				imports = imports.map((imp) => imp.name === sanitizedSchemaName ? {
					...imp,
					alias
				} : imp);
				resolvedValue.dependencies = [imp.name];
			} else output += `export type ${sanitizedSchemaName} = ${resolvedValue.value};\n`;
		}
	} else {
		resolvedValue.schemas = resolvedValue.schemas.filter((schema) => {
			if (schema.name !== sanitizedSchemaName) return true;
			output += `${schema.model}\n`;
			imports = [...imports, ...schema.imports];
			resolvedValue.dependencies.push(...schema.dependencies ?? []);
			return false;
		});
		output += `export type ${sanitizedSchemaName} = ${resolvedValue.value};\n`;
	}
	return [...resolvedValue.schemas, {
		name: sanitizedSchemaName,
		model: output,
		imports,
		dependencies: resolvedValue.dependencies,
		schema
	}];
}
//#endregion
//#region src/generators/verbs-options.ts
async function buildVerbOption({ verb, output, operation, route, pathRoute, verbParameters = [], context, body, operationName, operationId, override, tags, deprecated, description, summary }) {
	const response = getResponse({
		responses: operation.responses ?? {},
		operationName,
		context,
		contentType: override.contentType
	});
	const parameters = getParameters({
		parameters: [...verbParameters, ...operation.parameters ?? []],
		context
	});
	const queryParams = getQueryParams({
		queryParams: parameters.query,
		operationName,
		context
	});
	const headers = output.headers ? getQueryParams({
		queryParams: parameters.header,
		operationName,
		context,
		suffix: "headers"
	}) : void 0;
	const params = getParams({
		route,
		pathParams: parameters.path,
		operationId,
		context,
		output
	});
	const verbOption = {
		verb,
		tags,
		route,
		pathRoute,
		summary,
		operationId,
		operationName,
		response,
		body,
		headers,
		queryParams,
		params,
		props: getProps({
			body,
			queryParams,
			params,
			headers,
			operationName,
			context
		}),
		mutator: await generateMutator({
			output: output.target,
			name: operationName,
			mutator: override.mutator,
			workspace: context.workspace,
			tsconfig: context.output.tsconfig
		}),
		formData: !override.formData.disabled && body.formData ? await generateMutator({
			output: output.target,
			name: operationName,
			mutator: override.formData.mutator,
			workspace: context.workspace,
			tsconfig: context.output.tsconfig
		}) : void 0,
		formUrlEncoded: isString(override.formUrlEncoded) || isObject(override.formUrlEncoded) ? await generateMutator({
			output: output.target,
			name: operationName,
			mutator: override.formUrlEncoded,
			workspace: context.workspace,
			tsconfig: context.output.tsconfig
		}) : void 0,
		paramsSerializer: isString(override.paramsSerializer) || isObject(override.paramsSerializer) ? await generateMutator({
			output: output.target,
			name: "paramsSerializer",
			mutator: override.paramsSerializer,
			workspace: context.workspace,
			tsconfig: context.output.tsconfig
		}) : void 0,
		fetchReviver: isString(override.fetch.jsonReviver) || isObject(override.fetch.jsonReviver) ? await generateMutator({
			output: output.target,
			name: "fetchReviver",
			mutator: override.fetch.jsonReviver,
			workspace: context.workspace,
			tsconfig: context.output.tsconfig
		}) : void 0,
		override,
		doc: jsDoc({
			description,
			deprecated,
			summary
		}),
		deprecated,
		originalOperation: operation
	};
	const transformer = await dynamicImport(override.transformer, context.workspace);
	return transformer ? transformer(verbOption) : verbOption;
}
async function generateVerbOptions({ verb, output, operation, route, pathRoute, verbParameters = [], context }) {
	const { requestBody, tags: rawTags, deprecated: rawDeprecated, description: rawDescription, summary: rawSummary } = operation;
	const tags = rawTags ?? [];
	const deprecated = rawDeprecated;
	const description = rawDescription;
	const summary = rawSummary;
	const operationId = getOperationId(operation, route, verb);
	const overrideOperation = output.override.operations[operationId];
	let overrideTag = {};
	for (const [tag, options] of Object.entries(output.override.tags)) if (tags.includes(tag) && options) overrideTag = mergeDeep(overrideTag, options);
	const override = mergeDeep(mergeDeep(output.override, overrideTag), overrideOperation ?? {});
	const overrideOperationName = overrideOperation?.operationName ?? output.override.operationName;
	const operationName = overrideOperationName ? overrideOperationName(operation, route, verb) : sanitize(camel(operationId), { es5keyword: true });
	if (override.splitByContentType && requestBody) {
		const bodies = getBodiesByContentType({
			requestBody,
			operationName,
			context,
			contentType: override.contentType
		});
		const results = [];
		for (const bodyEntry of bodies) {
			const { contentTypeSuffix, ...body } = bodyEntry;
			const verbOption = await buildVerbOption({
				verb,
				output,
				operation,
				route,
				pathRoute,
				verbParameters,
				context,
				body,
				operationName: contentTypeSuffix ? `${operationName}With${contentTypeSuffix}` : operationName,
				operationId,
				override,
				tags,
				deprecated,
				description,
				summary
			});
			results.push(verbOption);
		}
		return results;
	}
	return [await buildVerbOption({
		verb,
		output,
		operation,
		route,
		pathRoute,
		verbParameters,
		context,
		body: requestBody ? getBody({
			requestBody,
			operationName,
			context,
			contentType: override.contentType
		}) : {
			originalSchema: {},
			definition: "",
			implementation: "",
			imports: [],
			schemas: [],
			formData: "",
			formUrlEncoded: "",
			contentType: "",
			isOptional: false
		},
		operationName,
		operationId,
		override,
		tags,
		deprecated,
		description,
		summary
	})];
}
function generateVerbsOptions({ verbs, input, output, route, pathRoute, context }) {
	return asyncReduce(filteredVerbs(verbs, input.filters), async (acc, [verb, operation]) => {
		if (isVerb(verb)) {
			const verbOptions = await generateVerbOptions({
				verb,
				output,
				verbParameters: verbs.parameters,
				route,
				pathRoute,
				operation,
				context
			});
			acc.push(...verbOptions);
		}
		return acc;
	}, []);
}
//#endregion
//#region src/writers/file.ts
const TRAILING_WHITESPACE_RE = /[^\S\r\n]+$/gm;
/**
* Write generated code to a file, stripping trailing whitespace from each line.
*
* Template literals in code generators can produce lines with only whitespace
* when conditional expressions evaluate to empty strings. This function
* ensures the output is always clean regardless of generator implementation.
*/
async function writeGeneratedFile(filePath, content) {
	await fs$1.outputFile(filePath, content.replaceAll(TRAILING_WHITESPACE_RE, ""));
}
//#endregion
//#region src/writers/schemas.ts
/**
* Patterns to detect operation-derived types (params, bodies, responses).
* These types are auto-generated from OpenAPI operations, not from component schemas.
*/
const OPERATION_TYPE_PATTERNS = [
	/Params$/i,
	/Body$/,
	/Body(One|Two|Three|Four|Five|Item)$/,
	/Parameter$/i,
	/Query$/i,
	/Header$/i,
	/Response\d*$/i,
	/^[1-5]\d{2}$/,
	/\d{3}(One|Two|Three|Four|Five|Item)$/i,
	/^(get|post|put|patch|delete|head|options)[A-Z].*\d{3}$/
];
/**
* Check if a schema name matches operation type patterns.
*/
function isOperationType(schemaName) {
	return OPERATION_TYPE_PATTERNS.some((pattern) => pattern.test(schemaName));
}
/**
* Split schemas into regular and operation types.
*/
function splitSchemasByType(schemas) {
	const regularSchemas = [];
	const operationSchemas = [];
	for (const schema of schemas) if (isOperationType(schema.name)) operationSchemas.push(schema);
	else regularSchemas.push(schema);
	return {
		regularSchemas,
		operationSchemas
	};
}
/**
* Get the import extension from a file extension.
* Removes `.ts` suffix since TypeScript doesn't need it in imports.
*/
function getImportExtension(fileExtension) {
	return fileExtension.replace(/\.ts$/, "") || "";
}
/**
* Fix cross-directory imports when schemas reference other schemas in a different directory.
* Updates import paths to use correct relative paths between directories.
*/
function fixSchemaImports(schemas, targetSchemaNames, fromPath, toPath, namingConvention, fileExtension) {
	const relativePath = relativeSafe(fromPath, toPath);
	const importExtension = getImportExtension(fileExtension);
	for (const schema of schemas) schema.imports = schema.imports.map((imp) => {
		if (targetSchemaNames.has(imp.name)) {
			const fileName = conventionName(imp.name, namingConvention);
			return {
				...imp,
				importPath: joinSafe(relativePath, fileName) + importExtension
			};
		}
		return imp;
	});
}
/**
* Fix imports in operation schemas that reference regular schemas.
*/
function fixCrossDirectoryImports(operationSchemas, regularSchemaNames, schemaPath, operationSchemaPath, namingConvention, fileExtension) {
	fixSchemaImports(operationSchemas, regularSchemaNames, operationSchemaPath, schemaPath, namingConvention, fileExtension);
}
/**
* Fix imports in regular schemas that reference operation schemas.
*/
function fixRegularSchemaImports(regularSchemas, operationSchemaNames, schemaPath, operationSchemaPath, namingConvention, fileExtension) {
	fixSchemaImports(regularSchemas, operationSchemaNames, schemaPath, operationSchemaPath, namingConvention, fileExtension);
}
function getSchemaKey(schemaPath, schemaName, namingConvention, fileExtension) {
	return getPath(schemaPath, conventionName(schemaName, namingConvention), fileExtension).toLowerCase().replaceAll("\\", "/");
}
function getSchemaGroups(schemaPath, schemas, namingConvention, fileExtension) {
	return groupBy(schemas, (schema) => getSchemaKey(schemaPath, schema.name, namingConvention, fileExtension));
}
function getCanonicalMap(schemaGroups, schemaPath, namingConvention, fileExtension) {
	const canonicalPathMap = /* @__PURE__ */ new Map();
	const canonicalNameMap = /* @__PURE__ */ new Map();
	for (const [key, groupSchemas] of Object.entries(schemaGroups)) {
		const canonicalInfo = {
			importPath: getPath(schemaPath, conventionName(groupSchemas[0].name, namingConvention), fileExtension),
			name: groupSchemas[0].name
		};
		canonicalPathMap.set(key, canonicalInfo);
		for (const schema of groupSchemas) canonicalNameMap.set(schema.name, canonicalInfo);
	}
	return {
		canonicalPathMap,
		canonicalNameMap
	};
}
function normalizeCanonicalImportPaths(schemas, canonicalPathMap, canonicalNameMap, schemaPath, namingConvention, fileExtension) {
	for (const schema of schemas) schema.imports = schema.imports.map((imp) => {
		const canonicalByName = canonicalNameMap.get(imp.name);
		const resolvedImportKey = resolveImportKey(schemaPath, imp.importPath ?? `./${conventionName(imp.name, namingConvention)}`, fileExtension);
		const canonicalByPath = canonicalPathMap.get(resolvedImportKey);
		const canonical = canonicalByName ?? canonicalByPath;
		if (!canonical?.importPath) return imp;
		const importPath = removeTSExtension(relativeSafe(schemaPath, canonical.importPath.replaceAll("\\", "/")));
		return {
			...imp,
			importPath
		};
	});
}
function mergeSchemaGroup(schemas) {
	const baseSchemaName = schemas[0].name;
	const baseSchema = schemas[0].schema;
	const mergedImports = [...new Map(schemas.flatMap((schema) => schema.imports).map((imp) => [JSON.stringify(imp), imp])).values()];
	const mergedDependencies = [...new Set(schemas.flatMap((schema) => schema.dependencies ?? []))];
	return {
		name: baseSchemaName,
		schema: baseSchema,
		model: schemas.map((schema) => schema.model).join("\n"),
		imports: mergedImports,
		dependencies: mergedDependencies
	};
}
function resolveImportKey(schemaPath, importPath, fileExtension) {
	return join(schemaPath, `${importPath}${fileExtension}`).toLowerCase().replaceAll("\\", "/");
}
function removeTSExtension(path) {
	return path.endsWith(".ts") ? path.slice(0, -3) : path;
}
function getSchema({ schema: { imports, model }, header, namingConvention = NamingConvention.CAMEL_CASE }) {
	let file = header;
	file += generateImports({
		imports: imports.filter((imp) => !model.includes(`type ${imp.alias ?? imp.name} =`) && !model.includes(`interface ${imp.alias ?? imp.name} {`)),
		namingConvention
	});
	file += imports.length > 0 ? "\n\n" : "\n";
	file += model;
	return file;
}
function getPath(path, name, fileExtension) {
	return nodePath.join(path, `${name}${fileExtension}`);
}
function writeModelInline(acc, model) {
	return acc + `${model}\n`;
}
function writeModelsInline(array) {
	let acc = "";
	for (const { model } of array) acc = writeModelInline(acc, model);
	return acc;
}
async function writeSchema({ path, schema, target, namingConvention, fileExtension, header }) {
	const name = conventionName(schema.name, namingConvention);
	try {
		await writeGeneratedFile(getPath(path, name, fileExtension), getSchema({
			schema,
			target,
			header,
			namingConvention
		}));
	} catch (error) {
		throw new Error(`Oups... 🍻. An Error occurred while writing schema ${name} => ${String(error)}`, { cause: error });
	}
}
async function writeSchemas({ schemaPath, schemas, target, namingConvention, fileExtension, header, indexFiles }) {
	const schemaGroups = getSchemaGroups(schemaPath, schemas, namingConvention, fileExtension);
	const { canonicalPathMap, canonicalNameMap } = getCanonicalMap(schemaGroups, schemaPath, namingConvention, fileExtension);
	normalizeCanonicalImportPaths(schemas, canonicalPathMap, canonicalNameMap, schemaPath, namingConvention, fileExtension);
	for (const groupSchemas of Object.values(schemaGroups)) {
		if (groupSchemas.length === 1) {
			await writeSchema({
				path: schemaPath,
				schema: groupSchemas[0],
				target,
				namingConvention,
				fileExtension,
				header
			});
			continue;
		}
		await writeSchema({
			path: schemaPath,
			schema: mergeSchemaGroup(groupSchemas),
			target,
			namingConvention,
			fileExtension,
			header
		});
	}
	if (indexFiles) {
		const schemaFilePath = nodePath.join(schemaPath, `index.ts`);
		await fs$1.ensureFile(schemaFilePath);
		const ext = fileExtension.endsWith(".ts") ? fileExtension.slice(0, -3) : fileExtension;
		const conventionNamesSet = new Set(Object.values(schemaGroups).map((group) => conventionName(group[0].name, namingConvention)));
		try {
			await writeGeneratedFile(schemaFilePath, `${header}\n${[...conventionNamesSet].map((schemaName) => `export * from './${schemaName}${ext}';`).toSorted((a, b) => a.localeCompare(b)).join("\n")}\n`);
		} catch (error) {
			throw new Error(`Oups... 🍻. An Error occurred while writing schema index file ${schemaFilePath} => ${String(error)}`, { cause: error });
		}
	}
}
//#endregion
//#region src/writers/generate-imports-for-builder.ts
function generateImportsForBuilder(output, imports, relativeSchemasPath) {
	const isZodSchemaOutput = isObject(output.schemas) && output.schemas.type === "zod";
	let schemaImports;
	if (output.indexFiles) schemaImports = isZodSchemaOutput ? [{
		exports: imports.filter((i) => !i.importPath),
		dependency: relativeSchemasPath
	}] : [{
		exports: imports.filter((i) => !i.importPath),
		dependency: relativeSchemasPath
	}];
	else {
		const importsByDependency = /* @__PURE__ */ new Map();
		for (const schemaImport of imports.filter((i) => !i.importPath)) {
			const dependency = joinSafe(relativeSchemasPath, `${conventionName(isZodSchemaOutput ? schemaImport.name : schemaImport.schemaName ?? schemaImport.name, output.namingConvention)}${isZodSchemaOutput ? ".zod" : ""}${output.fileExtension.replace(/\.ts$/, "") || ""}`);
			if (!importsByDependency.has(dependency)) importsByDependency.set(dependency, []);
			importsByDependency.get(dependency)?.push(schemaImport);
		}
		schemaImports = [...importsByDependency.entries()].map(([dependency, dependencyImports]) => ({
			dependency,
			exports: uniqueBy(dependencyImports, (entry) => `${entry.name}|${entry.alias ?? ""}|${String(entry.values)}|${String(entry.default)}`)
		}));
	}
	const otherImports = uniqueBy(imports.filter((i) => !!i.importPath), (x) => x.name + x.importPath).map((i) => {
		return {
			exports: [i],
			dependency: i.importPath
		};
	});
	return [...schemaImports, ...otherImports];
}
//#endregion
//#region src/writers/target.ts
function generateTarget(builder, options) {
	const operationNames = Object.values(builder.operations).map(({ operationName }) => operationName);
	const isAngularClient = options.client === OutputClient.ANGULAR;
	const titles = builder.title({
		outputClient: options.client,
		title: pascal(builder.info.title),
		customTitleFunc: options.override.title,
		output: options
	});
	const target = {
		imports: [],
		implementation: "",
		implementationMock: {
			function: "",
			handler: "",
			handlerName: ""
		},
		importsMock: [],
		mutators: [],
		clientMutators: [],
		formData: [],
		formUrlEncoded: [],
		paramsSerializer: [],
		fetchReviver: []
	};
	const operations = Object.values(builder.operations);
	for (const [index, operation] of operations.entries()) {
		target.imports.push(...operation.imports);
		target.importsMock.push(...operation.importsMock);
		target.implementation += operation.implementation + "\n";
		target.implementationMock.function += operation.implementationMock.function;
		target.implementationMock.handler += operation.implementationMock.handler;
		const handlerNameSeparator = target.implementationMock.handlerName.length > 0 ? ",\n  " : "  ";
		target.implementationMock.handlerName += handlerNameSeparator + operation.implementationMock.handlerName + "()";
		if (operation.mutator) target.mutators.push(operation.mutator);
		if (operation.formData) target.formData.push(operation.formData);
		if (operation.formUrlEncoded) target.formUrlEncoded.push(operation.formUrlEncoded);
		if (operation.paramsSerializer) target.paramsSerializer.push(operation.paramsSerializer);
		if (operation.clientMutators) target.clientMutators.push(...operation.clientMutators);
		if (operation.fetchReviver) target.fetchReviver.push(operation.fetchReviver);
		if (index === operations.length - 1) {
			const isMutator = target.mutators.some((mutator) => isAngularClient ? mutator.hasThirdArg : mutator.hasSecondArg);
			const hasAwaitedType = compareVersions(options.packageJson?.dependencies?.typescript ?? options.packageJson?.devDependencies?.typescript ?? "4.4.0", "4.5.0");
			const header = builder.header({
				outputClient: options.client,
				isRequestOptions: options.override.requestOptions !== false,
				isMutator,
				isGlobalMutator: !!options.override.mutator,
				provideIn: options.override.angular.provideIn,
				hasAwaitedType,
				titles,
				output: options,
				verbOptions: builder.verbOptions,
				clientImplementation: target.implementation
			});
			target.implementation = header.implementation + target.implementation;
			target.implementationMock.handler = target.implementationMock.handler + header.implementationMock + target.implementationMock.handlerName;
			const footer = builder.footer({
				outputClient: options.client,
				operationNames,
				hasMutator: target.mutators.length > 0,
				hasAwaitedType,
				titles,
				output: options
			});
			target.implementation += footer.implementation;
			target.implementationMock.handler += footer.implementationMock;
		}
	}
	return {
		...target,
		implementationMock: target.implementationMock.function + target.implementationMock.handler
	};
}
//#endregion
//#region src/writers/types.ts
function getOrvalGeneratedTypes() {
	return `
// https://stackoverflow.com/questions/49579094/typescript-conditional-types-filter-out-readonly-properties-pick-only-requir/49579497#49579497
type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <
T,
>() => T extends Y ? 1 : 2
? A
: B;

type WritableKeys<T> = {
[P in keyof T]-?: IfEquals<
  { [Q in P]: T[P] },
  { -readonly [Q in P]: T[P] },
  P
>;
}[keyof T];

type UnionToIntersection<U> =
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never;
type DistributeReadOnlyOverUnions<T> = T extends any ? NonReadonly<T> : never;

type Writable<T> = Pick<T, WritableKeys<T>>;
type NonReadonly<T> = [T] extends [UnionToIntersection<T>] ? {
  [P in keyof Writable<T>]: T[P] extends object
    ? NonReadonly<NonNullable<T[P]>>
    : T[P];
} : DistributeReadOnlyOverUnions<T>;
`;
}
function getTypedResponse() {
	return `
interface TypedResponse<T> extends Response {
  json(): Promise<T>;
}
`;
}
//#endregion
//#region src/writers/single-mode.ts
async function writeSingleMode({ builder, output, projectName, header, needSchema, generateSchemasInline }) {
	try {
		const { path } = getFileInfo(output.target, {
			backupFilename: conventionName(builder.info.title ?? "filename", output.namingConvention),
			extension: output.fileExtension
		});
		const { imports, importsMock, implementation, implementationMock, mutators, clientMutators, formData, formUrlEncoded, paramsSerializer, fetchReviver } = generateTarget(builder, output);
		let data = header;
		const schemasPath = output.schemas ? getRelativeImportPath(path, getFileInfo(isString(output.schemas) ? output.schemas : output.schemas.path, { extension: output.fileExtension }).dirname) : void 0;
		const isAllowSyntheticDefaultImports = isSyntheticDefaultImportsAllow(output.tsconfig);
		const normalizedImports = imports.filter((imp) => {
			const searchWords = [imp.alias, imp.name].filter((part) => Boolean(part?.length)).map((part) => escapeRegExp(part)).join("|");
			if (!searchWords) return false;
			return new RegExp(String.raw`\b(${searchWords})\b`, "g").test(implementation);
		}).map((imp) => ({ ...imp }));
		for (const mockImport of importsMock) {
			const matchingImport = normalizedImports.find((imp) => imp.name === mockImport.name && (imp.alias ?? "") === (mockImport.alias ?? ""));
			if (!matchingImport) continue;
			if (!!mockImport.values || !!mockImport.isConstant || !!mockImport.default || !!mockImport.namespaceImport || !!mockImport.syntheticDefaultImport) matchingImport.values = true;
		}
		const importsForBuilder = schemasPath ? generateImportsForBuilder(output, normalizedImports, schemasPath) : generateImportsForBuilder(output, normalizedImports.filter((imp) => !!imp.importPath), ".");
		data += builder.imports({
			client: output.client,
			implementation,
			imports: importsForBuilder,
			projectName,
			hasSchemaDir: !!output.schemas,
			isAllowSyntheticDefaultImports,
			hasGlobalMutator: !!output.override.mutator,
			hasTagsMutator: Object.values(output.override.tags).some((tag) => !!tag?.mutator),
			hasParamsSerializerOptions: !!output.override.paramsSerializerOptions,
			packageJson: output.packageJson,
			output
		});
		if (output.mock) {
			const filteredMockImports = importsMock.filter((impMock) => !normalizedImports.some((imp) => imp.name === impMock.name && (imp.alias ?? "") === (impMock.alias ?? "")));
			const importsMockForBuilder = schemasPath ? generateImportsForBuilder(output, filteredMockImports, schemasPath) : generateImportsForBuilder(output, filteredMockImports.filter((imp) => !!imp.importPath), ".");
			data += builder.importsMock({
				implementation: implementationMock,
				imports: importsMockForBuilder,
				projectName,
				hasSchemaDir: !!output.schemas,
				isAllowSyntheticDefaultImports,
				options: isFunction(output.mock) ? void 0 : output.mock
			});
		}
		if (mutators) data += generateMutatorImports({
			mutators,
			implementation
		});
		if (clientMutators) data += generateMutatorImports({ mutators: clientMutators });
		if (formData) data += generateMutatorImports({ mutators: formData });
		if (formUrlEncoded) data += generateMutatorImports({ mutators: formUrlEncoded });
		if (paramsSerializer) data += generateMutatorImports({ mutators: paramsSerializer });
		if (fetchReviver) data += generateMutatorImports({ mutators: fetchReviver });
		if (implementation.includes("NonReadonly<")) {
			data += getOrvalGeneratedTypes();
			data += "\n";
		}
		if (implementation.includes("TypedResponse<")) {
			data += getTypedResponse();
			data += "\n";
		}
		if (!output.schemas && needSchema) data += generateSchemasInline ? generateSchemasInline() : generateModelsInline(builder.schemas);
		data += `${implementation.trim()}\n`;
		if (output.mock) {
			data += "\n\n";
			data += implementationMock;
		}
		await writeGeneratedFile(path, data);
		return [path];
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : "unknown error";
		throw new Error(`Oups... 🍻. An Error occurred while writing file => ${errorMsg}`, { cause: error });
	}
}
//#endregion
//#region src/writers/split-mode.ts
async function writeSplitMode({ builder, output, projectName, header, needSchema, generateSchemasInline }) {
	try {
		const { path: targetPath, filename, dirname, extension } = getFileInfo(output.target, {
			backupFilename: conventionName(builder.info.title ?? "filename", output.namingConvention),
			extension: output.fileExtension
		});
		const { imports, implementation, implementationMock, importsMock, mutators, clientMutators, formData, formUrlEncoded, paramsSerializer, fetchReviver } = generateTarget(builder, output);
		let implementationData = header;
		let mockData = header;
		const relativeSchemasPath = output.schemas ? getRelativeImportPath(targetPath, getFileInfo(isString(output.schemas) ? output.schemas : output.schemas.path, { extension: output.fileExtension }).dirname) : "./" + filename + ".schemas" + extension.replace(/\.ts$/, "");
		const isAllowSyntheticDefaultImports = isSyntheticDefaultImportsAllow(output.tsconfig);
		const importsForBuilder = generateImportsForBuilder(output, imports, relativeSchemasPath);
		implementationData += builder.imports({
			client: output.client,
			implementation,
			imports: importsForBuilder,
			projectName,
			hasSchemaDir: !!output.schemas,
			isAllowSyntheticDefaultImports,
			hasGlobalMutator: !!output.override.mutator,
			hasTagsMutator: Object.values(output.override.tags).some((tag) => !!tag?.mutator),
			hasParamsSerializerOptions: !!output.override.paramsSerializerOptions,
			packageJson: output.packageJson,
			output
		});
		const importsMockForBuilder = generateImportsForBuilder(output, importsMock, relativeSchemasPath);
		mockData += builder.importsMock({
			implementation: implementationMock,
			imports: importsMockForBuilder,
			projectName,
			hasSchemaDir: !!output.schemas,
			isAllowSyntheticDefaultImports,
			options: isFunction(output.mock) ? void 0 : output.mock
		});
		const schemasPath = !output.schemas && needSchema ? nodePath.join(dirname, filename + ".schemas" + extension) : void 0;
		if (schemasPath) await writeGeneratedFile(schemasPath, generateSchemasInline ? header + generateSchemasInline() : header + generateModelsInline(builder.schemas));
		if (mutators) implementationData += generateMutatorImports({
			mutators,
			implementation
		});
		if (clientMutators) implementationData += generateMutatorImports({ mutators: clientMutators });
		if (formData) implementationData += generateMutatorImports({ mutators: formData });
		if (formUrlEncoded) implementationData += generateMutatorImports({ mutators: formUrlEncoded });
		if (paramsSerializer) implementationData += generateMutatorImports({ mutators: paramsSerializer });
		if (fetchReviver) implementationData += generateMutatorImports({ mutators: fetchReviver });
		if (implementation.includes("NonReadonly<")) {
			implementationData += getOrvalGeneratedTypes();
			implementationData += "\n";
		}
		if (implementation.includes("TypedResponse<")) {
			implementationData += getTypedResponse();
			implementationData += "\n";
		}
		implementationData += `\n${implementation}`;
		mockData += `\n${implementationMock}`;
		const implementationFilename = filename + (OutputClient.ANGULAR === output.client ? ".service" : "") + extension;
		const implementationPath = nodePath.join(dirname, implementationFilename);
		await writeGeneratedFile(implementationPath, implementationData);
		const mockPath = output.mock ? nodePath.join(dirname, filename + "." + getMockFileExtensionByTypeName(output.mock) + extension) : void 0;
		if (mockPath) await writeGeneratedFile(mockPath, mockData);
		return [
			implementationPath,
			...schemasPath ? [schemasPath] : [],
			...mockPath ? [mockPath] : []
		];
	} catch (error) {
		throw new Error(`Oups... 🍻. An Error occurred while splitting => ${String(error)}`, { cause: error });
	}
}
//#endregion
//#region src/writers/target-tags.ts
function addDefaultTagIfEmpty(operation) {
	return {
		...operation,
		tags: operation.tags.length > 0 ? operation.tags : ["default"]
	};
}
function generateTargetTags(currentAcc, operation) {
	const tag = kebab(operation.tags[0]);
	if (!(tag in currentAcc)) {
		currentAcc[tag] = {
			imports: operation.imports,
			importsMock: operation.importsMock,
			mutators: operation.mutator ? [operation.mutator] : [],
			clientMutators: operation.clientMutators ?? [],
			formData: operation.formData ? [operation.formData] : [],
			formUrlEncoded: operation.formUrlEncoded ? [operation.formUrlEncoded] : [],
			paramsSerializer: operation.paramsSerializer ? [operation.paramsSerializer] : [],
			fetchReviver: operation.fetchReviver ? [operation.fetchReviver] : [],
			implementation: operation.implementation,
			implementationMock: {
				function: operation.implementationMock.function,
				handler: operation.implementationMock.handler,
				handlerName: "  " + operation.implementationMock.handlerName + "()"
			}
		};
		return currentAcc;
	}
	const currentOperation = currentAcc[tag];
	currentAcc[tag] = {
		implementation: currentOperation.implementation + operation.implementation,
		imports: [...currentOperation.imports, ...operation.imports],
		importsMock: [...currentOperation.importsMock, ...operation.importsMock],
		implementationMock: {
			function: currentOperation.implementationMock.function + operation.implementationMock.function,
			handler: currentOperation.implementationMock.handler + operation.implementationMock.handler,
			handlerName: currentOperation.implementationMock.handlerName + ",\n  " + operation.implementationMock.handlerName + "()"
		},
		mutators: operation.mutator ? [...currentOperation.mutators ?? [], operation.mutator] : currentOperation.mutators,
		clientMutators: operation.clientMutators ? [...currentOperation.clientMutators ?? [], ...operation.clientMutators] : currentOperation.clientMutators,
		formData: operation.formData ? [...currentOperation.formData ?? [], operation.formData] : currentOperation.formData,
		formUrlEncoded: operation.formUrlEncoded ? [...currentOperation.formUrlEncoded ?? [], operation.formUrlEncoded] : currentOperation.formUrlEncoded,
		paramsSerializer: operation.paramsSerializer ? [...currentOperation.paramsSerializer ?? [], operation.paramsSerializer] : currentOperation.paramsSerializer,
		fetchReviver: operation.fetchReviver ? [...currentOperation.fetchReviver ?? [], operation.fetchReviver] : currentOperation.fetchReviver
	};
	return currentAcc;
}
function generateTargetForTags(builder, options) {
	const isAngularClient = options.client === OutputClient.ANGULAR;
	const operations = Object.values(builder.operations).map((operation) => addDefaultTagIfEmpty(operation));
	let allTargetTags = {};
	for (const [index, operation] of operations.entries()) {
		allTargetTags = generateTargetTags(allTargetTags, operation);
		if (index === operations.length - 1) {
			const transformed = {};
			for (const [tag, target] of Object.entries(allTargetTags)) {
				const isMutator = !!target.mutators?.some((mutator) => isAngularClient ? mutator.hasThirdArg : mutator.hasSecondArg);
				const operationNames = Object.values(builder.operations).filter(({ tags }) => tags.map((tag) => kebab(tag)).indexOf(kebab(tag)) === 0).map(({ operationName }) => operationName);
				const hasAwaitedType = compareVersions(options.packageJson?.dependencies?.typescript ?? options.packageJson?.devDependencies?.typescript ?? "4.4.0", "4.5.0");
				const titles = builder.title({
					outputClient: options.client,
					title: pascal(tag),
					customTitleFunc: options.override.title,
					output: options
				});
				const footer = builder.footer({
					outputClient: options.client,
					operationNames,
					hasMutator: !!target.mutators?.length,
					hasAwaitedType,
					titles,
					output: options
				});
				const header = builder.header({
					outputClient: options.client,
					isRequestOptions: options.override.requestOptions !== false,
					isMutator,
					isGlobalMutator: !!options.override.mutator,
					provideIn: options.override.angular.provideIn,
					hasAwaitedType,
					titles,
					output: options,
					verbOptions: builder.verbOptions,
					tag,
					clientImplementation: target.implementation
				});
				transformed[tag] = {
					implementation: header.implementation + target.implementation + footer.implementation,
					implementationMock: {
						function: target.implementationMock.function,
						handler: target.implementationMock.handler + header.implementationMock + target.implementationMock.handlerName + footer.implementationMock,
						handlerName: target.implementationMock.handlerName
					},
					imports: target.imports,
					importsMock: target.importsMock,
					mutators: target.mutators,
					clientMutators: target.clientMutators,
					formData: target.formData,
					formUrlEncoded: target.formUrlEncoded,
					paramsSerializer: target.paramsSerializer,
					fetchReviver: target.fetchReviver
				};
			}
			allTargetTags = transformed;
		}
	}
	const result = {};
	for (const [tag, target] of Object.entries(allTargetTags)) result[tag] = {
		...target,
		implementationMock: target.implementationMock.function + target.implementationMock.handler
	};
	return result;
}
//#endregion
//#region src/writers/split-tags-mode.ts
async function writeSplitTagsMode({ builder, output, projectName, header, needSchema, generateSchemasInline }) {
	const { filename, dirname, extension } = getFileInfo(output.target, {
		backupFilename: conventionName(builder.info.title ?? "filename", output.namingConvention),
		extension: output.fileExtension
	});
	const target = generateTargetForTags(builder, output);
	const isAllowSyntheticDefaultImports = isSyntheticDefaultImportsAllow(output.tsconfig);
	const mockOption = output.mock && !isFunction(output.mock) ? output.mock : void 0;
	const indexFilePath = mockOption?.indexMockFiles ? nodePath.join(dirname, "index." + getMockFileExtensionByTypeName(mockOption) + extension) : void 0;
	if (indexFilePath) await fs$1.outputFile(indexFilePath, "");
	const tagEntries = Object.entries(target);
	const generatedFilePathsArray = await Promise.all(tagEntries.map(async ([tag, target]) => {
		try {
			const { imports, implementation, implementationMock, importsMock, mutators, clientMutators, formData, fetchReviver, formUrlEncoded, paramsSerializer } = target;
			let implementationData = header;
			let mockData = header;
			const importerPath = nodePath.join(dirname, tag, tag + extension);
			const relativeSchemasPath = output.schemas ? getRelativeImportPath(importerPath, getFileInfo(isString(output.schemas) ? output.schemas : output.schemas.path, { extension: output.fileExtension }).dirname) : "../" + filename + ".schemas" + extension.replace(/\.ts$/, "");
			const tagNames = new Set(tagEntries.map(([t]) => t));
			const serviceSuffix = OutputClient.ANGULAR === output.client ? ".service" : "";
			const importsForBuilder = generateImportsForBuilder(output, imports.map((imp) => {
				if (!imp.importPath) return imp;
				if (!imp.importPath.startsWith(".")) return imp;
				const resolvedPath = nodePath.resolve(dirname, imp.importPath);
				const targetBasename = nodePath.basename(resolvedPath);
				let targetFile;
				if (tagNames.has(targetBasename)) {
					const tagFilename = targetBasename + serviceSuffix + extension;
					targetFile = nodePath.join(resolvedPath, tagFilename);
				} else targetFile = resolvedPath + extension;
				const adjustedPath = getRelativeImportPath(importerPath, targetFile);
				return {
					...imp,
					importPath: adjustedPath
				};
			}), relativeSchemasPath);
			implementationData += builder.imports({
				client: output.client,
				implementation,
				imports: importsForBuilder,
				projectName,
				hasSchemaDir: !!output.schemas,
				isAllowSyntheticDefaultImports,
				hasGlobalMutator: !!output.override.mutator,
				hasTagsMutator: Object.values(output.override.tags).some((tag) => !!tag?.mutator),
				hasParamsSerializerOptions: !!output.override.paramsSerializerOptions,
				packageJson: output.packageJson,
				output
			});
			const importsMockForBuilder = generateImportsForBuilder(output, importsMock, relativeSchemasPath);
			mockData += builder.importsMock({
				implementation: implementationMock,
				imports: importsMockForBuilder,
				projectName,
				hasSchemaDir: !!output.schemas,
				isAllowSyntheticDefaultImports,
				options: isFunction(output.mock) ? void 0 : output.mock
			});
			const schemasPath = !output.schemas && needSchema ? nodePath.join(dirname, filename + ".schemas" + extension) : void 0;
			if (schemasPath) await writeGeneratedFile(schemasPath, generateSchemasInline ? header + generateSchemasInline() : header + generateModelsInline(builder.schemas));
			if (mutators) implementationData += generateMutatorImports({
				mutators,
				implementation,
				oneMore: true
			});
			if (clientMutators) implementationData += generateMutatorImports({
				mutators: clientMutators,
				oneMore: true
			});
			if (formData) implementationData += generateMutatorImports({
				mutators: formData,
				oneMore: true
			});
			if (formUrlEncoded) implementationData += generateMutatorImports({
				mutators: formUrlEncoded,
				oneMore: true
			});
			if (paramsSerializer) implementationData += generateMutatorImports({
				mutators: paramsSerializer,
				oneMore: true
			});
			if (fetchReviver) implementationData += generateMutatorImports({
				mutators: fetchReviver,
				oneMore: true
			});
			if (implementation.includes("NonReadonly<")) {
				implementationData += getOrvalGeneratedTypes();
				implementationData += "\n";
			}
			if (implementation.includes("TypedResponse<")) {
				implementationData += getTypedResponse();
				implementationData += "\n";
			}
			implementationData += `\n${implementation}`;
			mockData += `\n${implementationMock}`;
			const implementationFilename = tag + (OutputClient.ANGULAR === output.client ? ".service" : "") + extension;
			const implementationPath = nodePath.join(dirname, tag, implementationFilename);
			await writeGeneratedFile(implementationPath, implementationData);
			const mockPath = output.mock ? nodePath.join(dirname, tag, tag + "." + getMockFileExtensionByTypeName(output.mock) + extension) : void 0;
			if (mockPath) await writeGeneratedFile(mockPath, mockData);
			return [
				implementationPath,
				...schemasPath ? [schemasPath] : [],
				...mockPath ? [mockPath] : []
			];
		} catch (error) {
			throw new Error(`Oups... 🍻. An Error occurred while splitting tag ${tag} => ${String(error)}`, { cause: error });
		}
	}));
	if (indexFilePath && mockOption) {
		const indexContent = tagEntries.map(([tag]) => {
			const localMockPath = joinSafe("./", tag, tag + "." + getMockFileExtensionByTypeName(mockOption));
			return `export { get${pascal(tag)}Mock } from '${localMockPath}'\n`;
		}).join("");
		await fs$1.appendFile(indexFilePath, indexContent);
	}
	return [...new Set([...indexFilePath ? [indexFilePath] : [], ...generatedFilePathsArray.flat()])];
}
//#endregion
//#region src/writers/tags-mode.ts
async function writeTagsMode({ builder, output, projectName, header, needSchema, generateSchemasInline }) {
	const { path: targetPath, filename, dirname, extension } = getFileInfo(output.target, {
		backupFilename: conventionName(builder.info.title ?? "filename", output.namingConvention),
		extension: output.fileExtension
	});
	const target = generateTargetForTags(builder, output);
	const isAllowSyntheticDefaultImports = isSyntheticDefaultImportsAllow(output.tsconfig);
	return (await Promise.all(Object.entries(target).map(async ([tag, target]) => {
		try {
			const { imports, implementation, implementationMock, importsMock, mutators, clientMutators, formData, formUrlEncoded, fetchReviver, paramsSerializer } = target;
			let data = header;
			const schemasPathRelative = output.schemas ? getRelativeImportPath(targetPath, getFileInfo(isString(output.schemas) ? output.schemas : output.schemas.path, { extension: output.fileExtension }).dirname) : "./" + filename + ".schemas" + extension.replace(/\.ts$/, "");
			const normalizedImports = imports.filter((imp) => {
				const searchWords = [imp.alias, imp.name].filter((part) => Boolean(part?.length)).map((part) => escapeRegExp(part)).join("|");
				if (!searchWords) return false;
				return new RegExp(String.raw`\b(${searchWords})\b`, "g").test(implementation);
			}).map((imp) => ({ ...imp }));
			for (const mockImport of importsMock) {
				const matchingImport = normalizedImports.find((imp) => imp.name === mockImport.name && (imp.alias ?? "") === (mockImport.alias ?? ""));
				if (!matchingImport) continue;
				if (!!mockImport.values || !!mockImport.isConstant || !!mockImport.default || !!mockImport.namespaceImport || !!mockImport.syntheticDefaultImport) matchingImport.values = true;
			}
			const importsForBuilder = generateImportsForBuilder(output, normalizedImports, schemasPathRelative);
			data += builder.imports({
				client: output.client,
				implementation,
				imports: importsForBuilder,
				projectName,
				hasSchemaDir: !!output.schemas,
				isAllowSyntheticDefaultImports,
				hasGlobalMutator: !!output.override.mutator,
				hasTagsMutator: Object.values(output.override.tags).some((tag) => !!tag?.mutator),
				hasParamsSerializerOptions: !!output.override.paramsSerializerOptions,
				packageJson: output.packageJson,
				output
			});
			if (output.mock) {
				const importsMockForBuilder = generateImportsForBuilder(output, importsMock.filter((impMock) => !normalizedImports.some((imp) => imp.name === impMock.name && (imp.alias ?? "") === (impMock.alias ?? ""))), schemasPathRelative);
				data += builder.importsMock({
					implementation: implementationMock,
					imports: importsMockForBuilder,
					projectName,
					hasSchemaDir: !!output.schemas,
					isAllowSyntheticDefaultImports,
					options: isFunction(output.mock) ? void 0 : output.mock
				});
			}
			const schemasPath = !output.schemas && needSchema ? nodePath.join(dirname, filename + ".schemas" + extension) : void 0;
			if (schemasPath) await writeGeneratedFile(schemasPath, generateSchemasInline ? header + generateSchemasInline() : header + generateModelsInline(builder.schemas));
			if (mutators) data += generateMutatorImports({
				mutators,
				implementation
			});
			if (clientMutators) data += generateMutatorImports({ mutators: clientMutators });
			if (formData) data += generateMutatorImports({ mutators: formData });
			if (formUrlEncoded) data += generateMutatorImports({ mutators: formUrlEncoded });
			if (paramsSerializer) data += generateMutatorImports({ mutators: paramsSerializer });
			if (fetchReviver) data += generateMutatorImports({ mutators: fetchReviver });
			data += "\n\n";
			if (implementation.includes("NonReadonly<")) {
				data += getOrvalGeneratedTypes();
				data += "\n";
			}
			if (implementation.includes("TypedResponse<")) {
				data += getTypedResponse();
				data += "\n";
			}
			data += implementation;
			if (output.mock) {
				data += "\n\n";
				data += implementationMock;
			}
			const implementationPath = nodePath.join(dirname, `${kebab(tag)}${extension}`);
			await writeGeneratedFile(implementationPath, data);
			return [implementationPath, ...schemasPath ? [schemasPath] : []];
		} catch (error) {
			throw new Error(`Oups... 🍻. An Error occurred while writing tag ${tag} => ${String(error)}`, { cause: error });
		}
	}))).flat();
}
//#endregion
export { BODY_TYPE_NAME, EnumGeneration, ErrorWithTag, FormDataArrayHandling, GetterPropType, LogLevels, NamingConvention, OutputClient, OutputHttpClient, OutputMockType, OutputMode, PropertySortOrder, RefComponentSuffix, SchemaType, SupportedFormatter, TEMPLATE_TAG_REGEX, URL_REGEX, VERBS_WITH_BODY, Verbs, addDependency, asyncReduce, camel, collectReferencedComponents, combineSchemas, compareVersions, conventionName, count, createDebugger, createLogger, createSuccessMessage, createTypeAliasIfNeeded, dedupeUnionType, dynamicImport, escape, escapeRegExp, filterByContentType, filteredVerbs, fixCrossDirectoryImports, fixRegularSchemaImports, generalJSTypes, generalJSTypesWithArray, generateAxiosOptions, generateBodyMutatorConfig, generateBodyOptions, generateComponentDefinition, generateDependencyImports, generateFormDataAndUrlEncodedFunction, generateImports, generateModelInline, generateModelsInline, generateMutator, generateMutatorConfig, generateMutatorImports, generateMutatorRequestOptions, generateOptions, generateParameterDefinition, generateQueryParamsAxiosConfig, generateSchemasDefinition, generateTarget, generateTargetForTags, generateVerbImports, generateVerbOptions, generateVerbsOptions, getAngularFilteredParamsCallExpression, getAngularFilteredParamsExpression, getAngularFilteredParamsHelperBody, getArray, getBaseUrlRuntimeImports, getBodiesByContentType, getBody, getCombinedEnumValue, getDefaultContentType, getEnum, getEnumDescriptions, getEnumImplementation, getEnumNames, getEnumUnionFromSchema, getExtension, getFileInfo, getFormDataFieldFileType, getFullRoute, getIsBodyVerb, getKey, getMockFileExtensionByTypeName, getNumberWord, getObject, getOperationId, getOrvalGeneratedTypes, getParameters, getParams, getParamsInPath, getPropertySafe, getProps, getQueryParams, getRefInfo, getResReqTypes, getResponse, getResponseTypeCategory, getRoute, getRouteAsArray, getScalar, getSuccessResponseType, getTypedResponse, getWarningCount, isBinaryContentType, isBoolean, isDirectory, isFunction, isModule, isNullish, isNumber, isNumeric, isObject, isReference, isSchema, isString, isStringLike, isSyntheticDefaultImportsAllow, isUrl, isVerb, isVerbose, jsDoc, jsStringEscape, kebab, keyValuePairsToJsDoc, log, logError, logVerbose, logWarning, mergeDeep, mismatchArgsMessage, pascal, removeFilesAndEmptyFolders, resetWarnings, resolveDiscriminators, resolveExampleRefs, resolveInstalledVersion, resolveInstalledVersions, resolveObject, resolveRef, resolveValue, sanitize, setVerbose, snake, sortByPriority, splitSchemasByType, startMessage, stringify, toObjectString, path_exports as upath, upper, writeModelInline, writeModelsInline, writeSchema, writeSchemas, writeSingleMode, writeSplitMode, writeSplitTagsMode, writeTagsMode };

//# sourceMappingURL=index.mjs.map