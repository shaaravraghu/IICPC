import { dm as Autocomplete } from "./index-DAac51Y8.js";
import "./moduleManager-WB15hU3T.js";

//#region src/pathMatcher.d.ts
type WithPathPatternWildcard<T = string> = `${T & string}(.*)`;
type PathPattern = Autocomplete<WithPathPatternWildcard>;
type PathMatcherParam = Array<RegExp | PathPattern> | RegExp | PathPattern;
declare class MalformedURLError extends Error {
  readonly statusCode = 400;
  constructor(pathname: string, cause?: unknown);
}
/**
 * String-based check for MalformedURLError that works across package bundles
 * where `instanceof` would fail due to duplicate class identities.
 */
declare function isMalformedURLError(e: unknown): e is MalformedURLError;
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
declare const normalizePath: (pathname: string) => string;
/**
 * Creates a function that matches paths against a set of patterns.
 *
 * @param patterns - A string, RegExp, or array of patterns to match against
 * @returns A function that takes a pathname and returns true if it matches any of the patterns
 */
declare const createPathMatcher: (patterns: PathMatcherParam) => (pathname: string) => boolean;
//#endregion
export { MalformedURLError, PathMatcherParam, PathPattern, WithPathPatternWildcard, createPathMatcher, isMalformedURLError, normalizePath };
//# sourceMappingURL=pathMatcher.d.ts.map