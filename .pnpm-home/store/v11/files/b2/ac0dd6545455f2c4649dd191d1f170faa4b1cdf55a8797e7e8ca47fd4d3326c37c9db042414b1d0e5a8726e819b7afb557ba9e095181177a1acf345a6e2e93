import { t as CLERK_NETLIFY_CACHE_BUST_PARAM } from "./netlifyCacheHandler-BAoRn8m6.mjs";
import { a as CLERK_SUFFIXED_COOKIES, i as CLERK_SATELLITE_URL, o as CLERK_SYNCED } from "./constants-BulbbNR9.mjs";

//#region src/internal/clerk-js/queryParams.ts
const _ClerkQueryParams = [
	"__clerk_status",
	"__clerk_created_session",
	"__clerk_invitation_token",
	"__clerk_ticket",
	"__clerk_modal_state",
	"__clerk_handshake",
	"__clerk_handshake_nonce",
	"__clerk_help",
	CLERK_NETLIFY_CACHE_BUST_PARAM,
	CLERK_SYNCED,
	CLERK_SATELLITE_URL,
	CLERK_SUFFIXED_COOKIES
];
/**
*
*/
function getClerkQueryParam(param) {
	const val = new URL(window.location.href).searchParams.get(param);
	return val ? val : null;
}
/**
*
*/
function removeClerkQueryParam(param) {
	const url = new URL(window.location.href);
	if (url.searchParams.has(param)) {
		url.searchParams.delete(param);
		window.history.replaceState(window.history.state, "", url);
	}
}
/**
* Extracts and forwards Clerk query parameters from the current URL to a new URLSearchParams object.
* This is useful when navigating between pages while preserving Clerk-specific query parameters.
*
* @param params - Optional URLSearchParams object to add the parameters to. If not provided, a new one will be created.
* @returns A URLSearchParams object containing the forwarded Clerk parameters
*/
function forwardClerkQueryParams(params) {
	const currentSearchParams = new URLSearchParams(window.location.search);
	const newParams = params || new URLSearchParams();
	for (const param of _ClerkQueryParams) {
		const value = currentSearchParams.get(param);
		if (value) newParams.set(param, value);
	}
	return newParams;
}

//#endregion
export { getClerkQueryParam as n, removeClerkQueryParam as r, forwardClerkQueryParams as t };
//# sourceMappingURL=queryParams-DJX7tUZy.mjs.map