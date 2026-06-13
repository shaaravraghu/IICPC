import { Br as SignUpResource } from "./index-DAac51Y8.js";

//#region src/internal/clerk-js/url.d.ts
declare global {
  export interface Window {
    tldts: {
      getDomain(hostname: string, {
        allowPrivateDomains
      }: {
        allowPrivateDomains: boolean;
      }): string;
    };
  }
}
declare const isDevOrStagingUrl: (url: string | URL) => boolean;
declare function isDevAccountPortalOrigin(hostname?: string): boolean;
declare function getETLDPlusOneFromFrontendApi(frontendApi: string): string;
interface BuildURLParams extends Partial<URL> {
  base?: string;
  hashPath?: string;
  hashSearch?: string;
  hashSearchParams?: URLSearchParams | Record<string, string> | Array<URLSearchParams | Record<string, string>>;
}
interface BuildURLOptions<T> {
  skipOrigin?: boolean;
  stringify?: T;
}
/**
 *
 * buildURL(params: URLParams, options: BuildURLOptions): string
 *
 * Builds a URL safely by using the native URL() constructor. It can
 * also build a secondary path and search URL that lives inside the hash
 * of the main URL. For example:
 *
 * https://foo.com/bar?qux=42#/hash-bar?hash-qux=42
 *
 * References:
 * https://developer.mozilla.org/en-US/docs/Web/API/URL
 *
 * @param params
 * @param options
 * @returns Returns the URL href
 */
declare function buildURL<B extends boolean>(params: BuildURLParams, options?: BuildURLOptions<B>): B extends true ? string : URL;
declare function toURL(url: string | URL): URL;
/**
 *
 * stripOrigin(url: URL | string): string
 *
 * Strips the origin part of a URL and preserves path, search and hash is applicable
 *
 * References:
 * https://developer.mozilla.org/en-US/docs/Web/API/URL
 *
 * @param url
 * @returns Returns the URL href without the origin
 */
declare function stripOrigin(url: URL | string): string;
/**
 * trimTrailingSlash(path: string): string
 *
 * Strips the trailing slashes from a string
 *
 * @returns Returns the string without trailing slashes
 *
 * @param path
 */
declare const trimTrailingSlash: (path: string) => string;
/**
 * trimLeadingSlash(path: string): string
 *
 * Strips the leading slashes from a string
 *
 * @returns Returns the string without leading slashes
 *
 * @param path
 */
declare const trimLeadingSlash: (path: string) => string;
declare const hasExternalAccountSignUpError: (signUp: SignUpResource) => boolean;
declare function getSearchParameterFromHash({
  hash,
  paramName
}: {
  hash?: string;
  paramName: string;
}): string | null;
declare function isValidUrl(val: string | URL | undefined | null): boolean;
declare function relativeToAbsoluteUrl(url: string, origin: string | URL): URL;
/**
 * Check for potentially problematic URLs that could have been crafted to intentionally bypass the origin check. Note that the URLs passed to this
 * function are assumed to be from an "allowed origin", so we are not executing origin-specific checks here.
 */
declare function isProblematicUrl(url: URL): boolean;
declare function isDataUri(val?: string): val is string;
/**
 * Checks if a URL uses javascript: protocol.
 * This prevents some XSS attacks through javascript: URLs.
 *
 * IMPORTANT: This does not check for `data:` or other protocols which
 * are dangerous if used for links or setting the window location.
 *
 * @param val - The URL to check
 * @returns True if the URL contains a banned protocol, false otherwise
 */
declare function hasBannedProtocol(val: string | URL): boolean;
/**
 * Checks if a URL contains a banned protocol for href attributes in links.
 * This prevents some XSS attacks through javascript:, data:, vbscript:, and blob: URLs.
 *
 * @param val - The URL to check
 * @returns True if the URL contains a banned protocol, false otherwise
 */
declare function hasBannedHrefProtocol(val: string | URL): boolean;
/**
 * Sanitizes an href value by checking for dangerous protocols.
 * Returns null if the href contains a dangerous protocol, otherwise returns the original href.
 * This prevents some XSS attacks through javascript:, data:, vbscript:, and blob: URLs.
 *
 * @param href - The href value to sanitize
 * @returns The sanitized href or null if dangerous
 */
declare function sanitizeHref(href: string | undefined | null): string | null;
declare const hasUrlInFragment: (_url: URL | string) => boolean;
/**
 * Creates a new URL by merging a fragment-based URL, if found.
 * The result URL has the original and the fragment pathnames appended
 * and also includes all search params from both places.
 *
 * @example
 * ```ts
 * mergeFragmentIntoUrl('https://accounts.clerk.com/sign-in?user_param=hello#/verify/factor-one?redirect_url=/protected')
 * // Returns: 'https://accounts.clerk.com/sign-in/verify/factor-one?user_param=hello&redirect_url=/protected'
 * ```
 */
declare const mergeFragmentIntoUrl: (_url: string | URL) => URL;
declare const pathFromFullPath: (fullPath: string) => string;
declare function isRedirectForFAPIInitiatedFlow(frontendApi: string, redirectUrl: string): boolean;
declare function requiresUserInput(redirectUrl: string): boolean;
declare const isAllowedRedirect: (allowedRedirectOrigins: Array<string | RegExp> | undefined, currentOrigin: string) => (_url: URL | string) => boolean;
declare function createAllowedRedirectOrigins(allowedRedirectOrigins: Array<string | RegExp> | undefined, frontendApi: string, instanceType?: string): (string | RegExp)[] | undefined;
//#endregion
export { trimLeadingSlash as C, toURL as S, pathFromFullPath as _, hasBannedHrefProtocol as a, sanitizeHref as b, hasUrlInFragment as c, isDevAccountPortalOrigin as d, isDevOrStagingUrl as f, mergeFragmentIntoUrl as g, isValidUrl as h, getSearchParameterFromHash as i, isAllowedRedirect as l, isRedirectForFAPIInitiatedFlow as m, createAllowedRedirectOrigins as n, hasBannedProtocol as o, isProblematicUrl as p, getETLDPlusOneFromFrontendApi as r, hasExternalAccountSignUpError as s, buildURL as t, isDataUri as u, relativeToAbsoluteUrl as v, trimTrailingSlash as w, stripOrigin as x, requiresUserInput as y };
//# sourceMappingURL=url-5qasB1Py.d.ts.map