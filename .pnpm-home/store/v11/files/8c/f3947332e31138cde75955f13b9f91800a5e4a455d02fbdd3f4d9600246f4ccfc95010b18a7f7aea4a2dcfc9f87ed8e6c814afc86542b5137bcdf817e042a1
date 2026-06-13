import { n as createDevOrStagingUrlCache } from "./keys-ChIG_Ewf.mjs";
import { t as globs } from "./globs-u_gXJPLt.mjs";
import { c as isCurrentDevAccountPortalOrigin, l as isLegacyDevAccountPortalOrigin } from "./url-C6gPMFx5.mjs";
import { t as logger } from "./logger-DISzhF9M.mjs";
import { t as camelToSnake } from "./underscore-ClYSgvuy.mjs";
import { t as joinPaths } from "./path-BLD6zl1u.mjs";
import { t as getQueryParams } from "./querystring-pXtwII0l.mjs";

//#region src/internal/clerk-js/url.ts
const DUMMY_URL_BASE = "http://clerk-dummy";
const BANNED_URI_PROTOCOLS = ["javascript:"];
const BANNED_HREF_PROTOCOLS = [
	"javascript:",
	"data:",
	"vbscript:",
	"blob:"
];
const { isDevOrStagingUrl } = createDevOrStagingUrlCache();
const accountPortalCache = /* @__PURE__ */ new Map();
function isDevAccountPortalOrigin(hostname = window.location.hostname) {
	if (!hostname) return false;
	let res = accountPortalCache.get(hostname);
	if (res === void 0) {
		res = isLegacyDevAccountPortalOrigin(hostname) || isCurrentDevAccountPortalOrigin(hostname);
		accountPortalCache.set(hostname, res);
	}
	return res;
}
function getETLDPlusOneFromFrontendApi(frontendApi) {
	return frontendApi.replace("clerk.", "");
}
function buildURL(params, options = {}) {
	const { base, hashPath, hashSearch, searchParams, hashSearchParams,...rest } = params;
	let fallbackBase = "";
	if (typeof window !== "undefined" && !!window.location) fallbackBase = window.location.href;
	else fallbackBase = "http://react-native-fake-base-url";
	const url = new URL(base || "", fallbackBase);
	if (searchParams instanceof URLSearchParams) searchParams.forEach((value, key) => {
		if (value !== null && value !== void 0) url.searchParams.set(camelToSnake(key), value);
	});
	Object.assign(url, rest);
	if (hashPath || hashSearch || hashSearchParams) {
		const dummyUrlForHash = new URL(DUMMY_URL_BASE + url.hash.substring(1));
		dummyUrlForHash.pathname = joinPaths(dummyUrlForHash.pathname, hashPath || "");
		const searchParamsFromHashSearchString = getQueryParams(hashSearch || "");
		for (const [key, val] of Object.entries(searchParamsFromHashSearchString)) dummyUrlForHash.searchParams.append(key, val);
		if (hashSearchParams) {
			const paramsArr = Array.isArray(hashSearchParams) ? hashSearchParams : [hashSearchParams];
			for (const _params of paramsArr) {
				if (!(_params instanceof URLSearchParams) && typeof _params !== "object") continue;
				new URLSearchParams(_params).forEach((value, key) => {
					if (value !== null && value !== void 0) dummyUrlForHash.searchParams.set(camelToSnake(key), value);
				});
			}
		}
		const newHash = dummyUrlForHash.href.replace(DUMMY_URL_BASE, "");
		if (newHash !== "/") url.hash = newHash;
	}
	const { stringify, skipOrigin } = options;
	if (stringify) return skipOrigin ? url.href.replace(url.origin, "") : url.href;
	return url;
}
function toURL(url) {
	return new URL(url.toString(), window.location.origin);
}
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
function stripOrigin(url) {
	if (typeof window.location === "undefined" && typeof url === "string") return url;
	url = toURL(url);
	return url.href.replace(url.origin, "");
}
/**
* trimTrailingSlash(path: string): string
*
* Strips the trailing slashes from a string
*
* @returns Returns the string without trailing slashes
*
* @param path
*/
const trimTrailingSlash = (path) => {
	return (path || "").replace(/\/+$/, "");
};
/**
* trimLeadingSlash(path: string): string
*
* Strips the leading slashes from a string
*
* @returns Returns the string without leading slashes
*
* @param path
*/
const trimLeadingSlash = (path) => {
	return (path || "").replace(/^\/+/, "");
};
const hasExternalAccountSignUpError = (signUp) => {
	const { externalAccount } = signUp.verifications;
	return !!externalAccount.error;
};
function getSearchParameterFromHash({ hash = window.location.hash, paramName }) {
	const h = hash.startsWith("#") ? hash.substring(1) : hash;
	return new URL(h, DUMMY_URL_BASE).searchParams.get(paramName);
}
function isValidUrl(val) {
	if (!val) return false;
	try {
		new URL(val);
		return true;
	} catch {
		return false;
	}
}
function relativeToAbsoluteUrl(url, origin) {
	try {
		return new URL(url);
	} catch {
		return new URL(url, origin);
	}
}
const disallowedPatterns = [
	/\0/,
	/^\/\//,
	/[\x00-\x1F]/
];
/**
* Check for potentially problematic URLs that could have been crafted to intentionally bypass the origin check. Note that the URLs passed to this
* function are assumed to be from an "allowed origin", so we are not executing origin-specific checks here.
*/
function isProblematicUrl(url) {
	if (hasBannedProtocol(url)) return true;
	for (const pattern of disallowedPatterns) if (pattern.test(url.pathname)) return true;
	return false;
}
function isDataUri(val) {
	if (!val || !isValidUrl(val)) return false;
	return new URL(val).protocol === "data:";
}
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
function hasBannedProtocol(val) {
	if (!isValidUrl(val)) return false;
	const protocol = new URL(val).protocol;
	return BANNED_URI_PROTOCOLS.some((bp) => bp === protocol);
}
/**
* Checks if a URL contains a banned protocol for href attributes in links.
* This prevents some XSS attacks through javascript:, data:, vbscript:, and blob: URLs.
*
* @param val - The URL to check
* @returns True if the URL contains a banned protocol, false otherwise
*/
function hasBannedHrefProtocol(val) {
	if (!isValidUrl(val)) return false;
	const protocol = new URL(val).protocol;
	return BANNED_HREF_PROTOCOLS.some((bp) => bp === protocol);
}
/**
* Sanitizes an href value by checking for dangerous protocols.
* Returns null if the href contains a dangerous protocol, otherwise returns the original href.
* This prevents some XSS attacks through javascript:, data:, vbscript:, and blob: URLs.
*
* @param href - The href value to sanitize
* @returns The sanitized href or null if dangerous
*/
function sanitizeHref(href) {
	if (!href || href.trim() === "") return null;
	if (href.startsWith("/") || href.startsWith("#") || href.startsWith("?")) return href;
	if (!href.includes(":")) return href;
	try {
		if (hasBannedHrefProtocol(new URL(href))) return null;
		return href;
	} catch {
		return href;
	}
}
const hasUrlInFragment = (_url) => {
	return new URL(_url, DUMMY_URL_BASE).hash.startsWith("#/");
};
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
const mergeFragmentIntoUrl = (_url) => {
	const url = new URL(_url);
	if (!hasUrlInFragment(url)) return url;
	const fragmentUrl = new URL(url.hash.replace("#/", "/"), url.href);
	const mergedPathname = [url.pathname, fragmentUrl.pathname].map((s) => s.split("/")).flat().filter(Boolean).join("/");
	const mergedUrl = new URL(mergedPathname, url.origin);
	url.searchParams.forEach((val, key) => {
		mergedUrl.searchParams.set(key, val);
	});
	fragmentUrl.searchParams.forEach((val, key) => {
		mergedUrl.searchParams.set(key, val);
	});
	return mergedUrl;
};
const pathFromFullPath = (fullPath) => {
	return fullPath.replace(/CLERK-ROUTER\/(.*?)\//, "");
};
const frontendApiRedirectPathsWithUserInput = ["/oauth/authorize"];
const frontendApiRedirectPathsNoUserInput = [
	"/v1/verify",
	"/v1/tickets/accept",
	"/oauth/authorize-with-immediate-redirect",
	"/oauth/end_session"
];
function isRedirectForFAPIInitiatedFlow(frontendApi, redirectUrl) {
	const url = new URL(redirectUrl, DUMMY_URL_BASE);
	const path = url.pathname;
	const isValidFrontendRedirectPath = frontendApiRedirectPathsWithUserInput.includes(path) || frontendApiRedirectPathsNoUserInput.includes(path);
	return frontendApi === url.host && isValidFrontendRedirectPath;
}
function requiresUserInput(redirectUrl) {
	const url = new URL(redirectUrl, DUMMY_URL_BASE);
	return frontendApiRedirectPathsWithUserInput.includes(url.pathname);
}
const isAllowedRedirect = (allowedRedirectOrigins, currentOrigin) => (_url) => {
	let url = _url;
	if (typeof url === "string") url = relativeToAbsoluteUrl(url, currentOrigin);
	if (!allowedRedirectOrigins) return true;
	const isSameOrigin = currentOrigin === url.origin;
	const isAllowed = !isProblematicUrl(url) && (isSameOrigin || allowedRedirectOrigins.map((origin) => typeof origin === "string" ? globs.toRegexp(trimTrailingSlash(origin)) : origin).some((origin) => origin.test(trimTrailingSlash(url.origin))));
	if (!isAllowed) logger.warnOnce(`Clerk: Redirect URL ${url} is not on one of the allowedRedirectOrigins, falling back to the default redirect URL.`);
	return isAllowed;
};
function createAllowedRedirectOrigins(allowedRedirectOrigins, frontendApi, instanceType) {
	if (Array.isArray(allowedRedirectOrigins) && !!allowedRedirectOrigins.length) return allowedRedirectOrigins;
	const origins = [];
	if (typeof window !== "undefined" && !!window.location) origins.push(window.location.origin);
	origins.push(`https://${getETLDPlusOneFromFrontendApi(frontendApi)}`);
	origins.push(`https://*.${getETLDPlusOneFromFrontendApi(frontendApi)}`);
	if (instanceType === "development") origins.push(`https://${frontendApi}`);
	return origins;
}

//#endregion
export { trimLeadingSlash as C, toURL as S, pathFromFullPath as _, hasBannedHrefProtocol as a, sanitizeHref as b, hasUrlInFragment as c, isDevAccountPortalOrigin as d, isDevOrStagingUrl as f, mergeFragmentIntoUrl as g, isValidUrl as h, getSearchParameterFromHash as i, isAllowedRedirect as l, isRedirectForFAPIInitiatedFlow as m, createAllowedRedirectOrigins as n, hasBannedProtocol as o, isProblematicUrl as p, getETLDPlusOneFromFrontendApi as r, hasExternalAccountSignUpError as s, buildURL as t, isDataUri as u, relativeToAbsoluteUrl as v, trimTrailingSlash as w, stripOrigin as x, requiresUserInput as y };
//# sourceMappingURL=url-BbdQYzdN.mjs.map