const require_netlifyCacheHandler = require('./netlifyCacheHandler-tf-8MGH1.js');
const require_constants = require('./constants-BUzkV8jh.js');

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
	require_netlifyCacheHandler.CLERK_NETLIFY_CACHE_BUST_PARAM,
	require_constants.CLERK_SYNCED,
	require_constants.CLERK_SATELLITE_URL,
	require_constants.CLERK_SUFFIXED_COOKIES
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
Object.defineProperty(exports, 'forwardClerkQueryParams', {
  enumerable: true,
  get: function () {
    return forwardClerkQueryParams;
  }
});
Object.defineProperty(exports, 'getClerkQueryParam', {
  enumerable: true,
  get: function () {
    return getClerkQueryParam;
  }
});
Object.defineProperty(exports, 'removeClerkQueryParam', {
  enumerable: true,
  get: function () {
    return removeClerkQueryParam;
  }
});
//# sourceMappingURL=queryParams-BIKo3ou8.js.map