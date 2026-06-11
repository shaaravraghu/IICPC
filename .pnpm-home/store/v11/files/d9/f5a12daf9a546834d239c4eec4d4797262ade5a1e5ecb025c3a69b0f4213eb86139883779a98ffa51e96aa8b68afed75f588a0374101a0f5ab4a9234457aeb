import { t as isDevelopmentEnvironment } from "./runtimeEnvironment-D1yr0yUs.mjs";

//#region src/utils/allSettled.ts
/**
* A ES6 compatible utility that implements `Promise.allSettled`
*
* @internal
*/
function allSettled(iterable) {
	const promises = Array.from(iterable).map((p) => p.then((value) => ({
		status: "fulfilled",
		value
	}), (reason) => ({
		status: "rejected",
		reason
	})));
	return Promise.all(promises);
}

//#endregion
//#region src/utils/logErrorInDevMode.ts
const logErrorInDevMode = (message) => {
	if (isDevelopmentEnvironment()) console.error(`Clerk: ${message}`);
};

//#endregion
//#region src/utils/runIfFunctionOrReturn.ts
/**
*
*/
function runIfFunctionOrReturn(o) {
	if (typeof o === "function") return o();
	return o;
}

//#endregion
//#region src/utils/fastDeepMerge.ts
const DANGEROUS_KEYS = new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
/**
* Merges 2 objects without creating new object references
* The merged props will appear on the `target` object
* If `target` already has a value for a given key it will not be overwritten
*/
const fastDeepMergeAndReplace = (source, target) => {
	if (!source || !target) return;
	for (const key in source) {
		if (DANGEROUS_KEYS.has(key)) continue;
		if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== null && typeof source[key] === `object`) {
			if (target[key] === void 0) target[key] = new (Object.getPrototypeOf(source[key])).constructor();
			fastDeepMergeAndReplace(source[key], target[key]);
		} else if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== void 0) target[key] = source[key];
	}
};
const fastDeepMergeAndKeep = (source, target) => {
	if (!source || !target) return;
	for (const key in source) {
		if (DANGEROUS_KEYS.has(key)) continue;
		if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== null && typeof source[key] === `object`) {
			if (target[key] === void 0) target[key] = new (Object.getPrototypeOf(source[key])).constructor();
			fastDeepMergeAndKeep(source[key], target[key]);
		} else if (Object.prototype.hasOwnProperty.call(source, key) && target[key] === void 0) target[key] = source[key];
	}
};

//#endregion
export { allSettled as a, logErrorInDevMode as i, fastDeepMergeAndReplace as n, runIfFunctionOrReturn as r, fastDeepMergeAndKeep as t };
//# sourceMappingURL=utils-TXJdVJx7.mjs.map