//#region src/internal/clerk-js/thirdPartyDomains.ts
/**
* Domains of third-party embedding platforms (e.g. online IDEs, preview environments)
* that require special handling for cookies and OAuth flows.
*
* These domains need:
* - `SameSite=None` on cookies to function correctly
* - Popup-based OAuth flows instead of redirects
*/
const THIRD_PARTY_COOKIE_DOMAINS = [
	".lovable.app",
	".lovableproject.com",
	".webcontainer-api.io",
	".vusercontent.net",
	".v0.dev",
	".v0.app",
	".lp.dev",
	".replit.dev"
];
/**
* Returns `true` if the current origin belongs to a known third-party
* embedding platform that requires `SameSite=None` on cookies.
*/
function isThirdPartyCookieDomain() {
	try {
		return THIRD_PARTY_COOKIE_DOMAINS.some((domain) => window.location.hostname.endsWith(domain));
	} catch {
		return false;
	}
}

//#endregion
export { THIRD_PARTY_COOKIE_DOMAINS, isThirdPartyCookieDomain };
//# sourceMappingURL=thirdPartyDomains.mjs.map