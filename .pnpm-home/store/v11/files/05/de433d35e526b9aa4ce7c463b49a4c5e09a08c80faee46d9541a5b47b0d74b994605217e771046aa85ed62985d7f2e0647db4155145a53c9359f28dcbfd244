
//#region src/devBrowser.ts
const DEV_BROWSER_KEY = "__clerk_db_jwt";
const DEV_BROWSER_HEADER = "Clerk-Db-Jwt";
function setDevBrowserInURL(url, devBrowser) {
	const resultURL = new URL(url);
	const existing = resultURL.searchParams.get(DEV_BROWSER_KEY);
	resultURL.searchParams.delete(DEV_BROWSER_KEY);
	const value = existing || devBrowser;
	if (value) resultURL.searchParams.set(DEV_BROWSER_KEY, value);
	return resultURL;
}
/**
* Gets the __clerk_db_jwt dev browser from either the hash or the search
* Side effect:
* Removes __clerk_db_jwt from the URL (hash and searchParams) and updates the browser history
*/
function extractDevBrowserFromURL(url) {
	const devBrowser = readDevBrowserFromSearchParams(url);
	const cleanUrl = removeDevBrowserFromURL(url);
	if (cleanUrl.href !== url.href && typeof globalThis.history !== "undefined") globalThis.history.replaceState(null, "", cleanUrl);
	return devBrowser;
}
const readDevBrowserFromSearchParams = (url) => {
	return url.searchParams.get(DEV_BROWSER_KEY) || "";
};
const removeDevBrowserFromURL = (url) => {
	return removeDevBrowserFromURLSearchParams(removeLegacyDevBrowser(url));
};
const removeDevBrowserFromURLSearchParams = (_url) => {
	const url = new URL(_url);
	url.searchParams.delete(DEV_BROWSER_KEY);
	return url;
};
/**
* Removes the __clerk_db_jwt dev browser from the URL hash, as well as
* the legacy __dev_session from the URL searchParams
* We no longer need to use this value, however, we should remove it from the URL
* Existing v4 apps will write the dev browser to the hash and the search params in order to ensure
* backwards compatibility with older v4 apps.
* The only use case where this is needed now is when a user upgrades to clerk@5 locally
* without changing the component's version on their dashboard.
* In this scenario, the AP@4 -> localhost@5 redirect will still have the value in the hash,
* in which case we need to remove it.
*/
const removeLegacyDevBrowser = (_url) => {
	const DEV_BROWSER_MARKER_REGEXP = /__clerk_db_jwt\[(.*)\]/;
	const DEV_BROWSER_LEGACY_KEY = "__dev_session";
	const url = new URL(_url);
	url.searchParams.delete(DEV_BROWSER_LEGACY_KEY);
	url.hash = decodeURI(url.hash).replace(DEV_BROWSER_MARKER_REGEXP, "");
	if (url.href.endsWith("#")) url.hash = "";
	return url;
};

//#endregion
exports.DEV_BROWSER_HEADER = DEV_BROWSER_HEADER;
exports.DEV_BROWSER_KEY = DEV_BROWSER_KEY;
exports.extractDevBrowserFromURL = extractDevBrowserFromURL;
exports.setDevBrowserInURL = setDevBrowserInURL;
//# sourceMappingURL=devBrowser.js.map