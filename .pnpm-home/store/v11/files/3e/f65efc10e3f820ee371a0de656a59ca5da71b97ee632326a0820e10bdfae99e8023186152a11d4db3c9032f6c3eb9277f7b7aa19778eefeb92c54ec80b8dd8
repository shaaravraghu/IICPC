import { pathToRegexp } from "./pathToRegexp-Bu45OrlU.mjs";

//#region src/pathMatcher.ts
var MalformedURLError = class extends Error {
	statusCode = 400;
	constructor(pathname, cause) {
		super(`Malformed encoding in URL path: ${pathname}`);
		this.name = "MalformedURLError";
		this.cause = cause;
	}
};
/**
* String-based check for MalformedURLError that works across package bundles
* where `instanceof` would fail due to duplicate class identities.
*/
function isMalformedURLError(e) {
	return e instanceof Error && e.name === "MalformedURLError";
}
const precomputePathRegex = (patterns) => {
	return patterns.map((pattern) => pattern instanceof RegExp ? pattern : pathToRegexp(pattern));
};
/**
* Normalizes a URL path for safe route matching.
*
* 1. Decodes percent-encoded unreserved characters using decodeURI (not
*    decodeURIComponent) so path-reserved delimiters like %2F, %3F, %23
*    are preserved — matching how framework routers interpret paths.
* 2. Collapses consecutive slashes (e.g. //api/admin → /api/admin) to
*    prevent bypass via extra slashes.
*
* @throws {MalformedURLError} if the path contains invalid percent-encoding
*/
const normalizePath = (pathname) => {
	try {
		pathname = decodeURI(pathname);
	} catch (e) {
		throw new MalformedURLError(pathname, e);
	}
	return pathname.replace(/\/\/+/g, "/");
};
/**
* Creates a function that matches paths against a set of patterns.
*
* @param patterns - A string, RegExp, or array of patterns to match against
* @returns A function that takes a pathname and returns true if it matches any of the patterns
*/
const createPathMatcher = (patterns) => {
	const matchers = precomputePathRegex([patterns || ""].flat().filter(Boolean));
	return (pathname) => matchers.some((matcher) => matcher.test(normalizePath(pathname)));
};

//#endregion
export { MalformedURLError, createPathMatcher, isMalformedURLError, normalizePath };
//# sourceMappingURL=pathMatcher-DAPlUWyF.mjs.map