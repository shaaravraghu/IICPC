import "./constants-Bta24VLk.mjs";
import "./isomorphicAtob-CoF80qYz.mjs";
import "./isomorphicBtoa-DWmLcIHi.mjs";
import { n as createDevOrStagingUrlCache, u as parsePublishableKey } from "./keys-ChIG_Ewf.mjs";
import { t as ClerkRuntimeError } from "./clerkRuntimeError-DqAmLuLY.mjs";
import { y as buildErrorThrower } from "./error-BwjsVTI1.mjs";
import "./retry-DqRIhHV5.mjs";
import { t as loadScript } from "./loadScript-UG_epen4.mjs";
import { a as isValidProxyUrl, i as isProxyUrlRelative, o as proxyUrlToAbsoluteURL } from "./proxy-uGxHFpDF.mjs";
import "./instance-BmZr0cdE.mjs";
import { t as addClerkPrefix } from "./url-C6gPMFx5.mjs";
import { n as versionSelector } from "./versionSelector-D16e9UdR.mjs";

//#region src/loadClerkJsScript.ts
const { isDevOrStagingUrl } = createDevOrStagingUrlCache();
const errorThrower = buildErrorThrower({ packageName: "@clerk/shared" });
/**
* Validates that window.Clerk exists and is properly initialized.
* This ensures we don't have false positives where the script loads but Clerk is malformed.
*
* @returns `true` if window.Clerk exists and has the expected structure with a load method.
*/
function isClerkGlobalProperlyLoaded(prop) {
	if (typeof window === "undefined" || !window[prop]) return false;
	return !!window[prop];
}
const isClerkProperlyLoaded = () => isClerkGlobalProperlyLoaded("Clerk");
const isClerkUIProperlyLoaded = () => isClerkGlobalProperlyLoaded("__internal_ClerkUICtor");
/**
* Checks if an existing script has a request error using Performance API.
*
* @param scriptUrl - The URL of the script to check.
* @returns True if the script has failed to load due to a network/HTTP error.
*/
function hasScriptRequestError(scriptUrl) {
	if (typeof window === "undefined" || !window.performance) return false;
	const entries = performance.getEntriesByName(scriptUrl, "resource");
	if (entries.length === 0) return false;
	const scriptEntry = entries[entries.length - 1];
	if (scriptEntry.transferSize === 0 && scriptEntry.decodedBodySize === 0) {
		if (scriptEntry.responseEnd === 0) return true;
		if (scriptEntry.responseEnd > 0 && scriptEntry.responseStart > 0) return true;
		if ("responseStatus" in scriptEntry) {
			if (scriptEntry.responseStatus >= 400) return true;
			if (scriptEntry.responseStatus === 0) return true;
		}
	}
	return false;
}
/**
* Hotloads the Clerk JS script with robust failure detection.
*
* Uses a timeout-based approach to ensure absolute certainty about load success/failure.
* If the script fails to load within the timeout period, or loads but doesn't create
* a proper Clerk instance, the promise rejects with an error.
*
* @param opts - The options used to build the Clerk JS script URL and load the script.
*               Must include a `publishableKey` if no existing script is found.
* @returns Promise that resolves with null if Clerk loads successfully, or rejects with an error.
*
* @example
* ```typescript
* try {
*   await loadClerkJsScript({ publishableKey: 'pk_test_...' });
*   console.log('Clerk loaded successfully');
* } catch (error) {
*   console.error('Failed to load Clerk:', error.message);
* }
* ```
*/
const loadClerkJSScript = async (opts) => {
	const timeout = opts?.scriptLoadTimeout ?? 15e3;
	const rejectWith = (error) => new ClerkRuntimeError("Failed to load Clerk JS" + (error?.message ? `, ${error.message}` : ""), {
		code: "failed_to_load_clerk_js",
		cause: error
	});
	if (isClerkProperlyLoaded()) return null;
	if (!opts?.publishableKey) {
		errorThrower.throwMissingPublishableKeyError();
		return null;
	}
	const scriptUrl = clerkJSScriptUrl(opts);
	const existingScript = document.querySelector("script[data-clerk-js-script]");
	if (existingScript) if (hasScriptRequestError(scriptUrl)) existingScript.remove();
	else try {
		await waitForPredicateWithTimeout(timeout, isClerkProperlyLoaded, rejectWith(), existingScript);
		return null;
	} catch {
		existingScript.remove();
	}
	const loadPromise = waitForPredicateWithTimeout(timeout, isClerkProperlyLoaded, rejectWith());
	loadScript(scriptUrl, {
		async: true,
		crossOrigin: "anonymous",
		nonce: opts.nonce,
		beforeLoad: applyAttributesToScript(buildClerkJSScriptAttributes(opts))
	}).catch((error) => {
		throw rejectWith(error);
	});
	return loadPromise;
};
const loadClerkUIScript = async (opts) => {
	const timeout = opts?.scriptLoadTimeout ?? 15e3;
	const rejectWith = (error) => new ClerkRuntimeError("Failed to load Clerk UI" + (error?.message ? `, ${error.message}` : ""), {
		code: "failed_to_load_clerk_ui",
		cause: error
	});
	if (isClerkUIProperlyLoaded()) return null;
	if (!opts?.publishableKey) {
		errorThrower.throwMissingPublishableKeyError();
		return null;
	}
	const scriptUrl = clerkUIScriptUrl(opts);
	const existingScript = document.querySelector("script[data-clerk-ui-script]");
	if (existingScript) if (hasScriptRequestError(scriptUrl)) existingScript.remove();
	else try {
		await waitForPredicateWithTimeout(timeout, isClerkUIProperlyLoaded, rejectWith(), existingScript);
		return null;
	} catch {
		existingScript.remove();
	}
	const loadPromise = waitForPredicateWithTimeout(timeout, isClerkUIProperlyLoaded, rejectWith());
	loadScript(scriptUrl, {
		async: true,
		crossOrigin: "anonymous",
		nonce: opts.nonce,
		beforeLoad: applyAttributesToScript(buildClerkUIScriptAttributes(opts))
	}).catch((error) => {
		throw rejectWith(error);
	});
	return loadPromise;
};
const clerkJSScriptUrl = (opts) => {
	const { __internal_clerkJSUrl, __internal_clerkJSVersion, proxyUrl, domain, publishableKey } = opts;
	if (__internal_clerkJSUrl) return __internal_clerkJSUrl;
	const version = versionSelector(__internal_clerkJSVersion);
	if (proxyUrl && isProxyUrlRelative(proxyUrl)) return buildRelativeProxyScriptUrl(proxyUrl, "clerk-js", version, "clerk.browser.js");
	return `https://${buildScriptHost({
		publishableKey,
		proxyUrl,
		domain
	})}/npm/@clerk/clerk-js@${version}/dist/clerk.browser.js`;
};
const clerkUIScriptUrl = (opts) => {
	const { __internal_clerkUIUrl, __internal_clerkUIVersion, proxyUrl, domain, publishableKey } = opts;
	if (__internal_clerkUIUrl) return __internal_clerkUIUrl;
	const version = versionSelector(__internal_clerkUIVersion, "1.14.0");
	if (proxyUrl && isProxyUrlRelative(proxyUrl)) return buildRelativeProxyScriptUrl(proxyUrl, "ui", version, "ui.browser.js");
	return `https://${buildScriptHost({
		publishableKey,
		proxyUrl,
		domain
	})}/npm/@clerk/ui@${version}/dist/ui.browser.js`;
};
const buildClerkJSScriptAttributes = (options) => {
	const obj = {};
	if (options.publishableKey) obj["data-clerk-publishable-key"] = options.publishableKey;
	if (options.proxyUrl) obj["data-clerk-proxy-url"] = options.proxyUrl;
	if (options.domain) obj["data-clerk-domain"] = options.domain;
	if (options.nonce) obj.nonce = options.nonce;
	return obj;
};
const buildClerkUIScriptAttributes = (options) => {
	return buildClerkJSScriptAttributes(options);
};
const applyAttributesToScript = (attributes) => (script) => {
	for (const attribute in attributes) script.setAttribute(attribute, attributes[attribute]);
};
const stripTrailingSlashes = (value) => {
	while (value.endsWith("/")) value = value.slice(0, -1);
	return value;
};
const buildRelativeProxyScriptUrl = (proxyUrl, packageName, version, fileName) => {
	return `${stripTrailingSlashes(proxyUrl)}/npm/@clerk/${packageName}@${version}/dist/${fileName}`;
};
const buildScriptHost = (opts) => {
	const { proxyUrl, domain, publishableKey } = opts;
	if (!!proxyUrl && isValidProxyUrl(proxyUrl)) {
		const resolvedProxyUrl = proxyUrlToAbsoluteURL(proxyUrl);
		if (isProxyUrlRelative(resolvedProxyUrl)) return parsePublishableKey(publishableKey)?.frontendApi || "";
		return resolvedProxyUrl.replace(/http(s)?:\/\//, "");
	} else if (domain && !isDevOrStagingUrl(parsePublishableKey(publishableKey)?.frontendApi || "")) return addClerkPrefix(domain);
	else return parsePublishableKey(publishableKey)?.frontendApi || "";
};
function waitForPredicateWithTimeout(timeoutMs, predicate, rejectWith, existingScript) {
	return new Promise((resolve, reject) => {
		let resolved = false;
		const cleanup = (timeoutId$1, pollInterval$1) => {
			clearTimeout(timeoutId$1);
			clearInterval(pollInterval$1);
		};
		existingScript?.addEventListener("error", () => {
			cleanup(timeoutId, pollInterval);
			reject(rejectWith);
		});
		const checkAndResolve = () => {
			if (resolved) return;
			if (predicate()) {
				resolved = true;
				cleanup(timeoutId, pollInterval);
				resolve(null);
			}
		};
		const handleTimeout = () => {
			if (resolved) return;
			resolved = true;
			cleanup(timeoutId, pollInterval);
			if (!predicate()) reject(rejectWith);
			else resolve(null);
		};
		const timeoutId = setTimeout(handleTimeout, timeoutMs);
		checkAndResolve();
		const pollInterval = setInterval(() => {
			if (resolved) {
				clearInterval(pollInterval);
				return;
			}
			checkAndResolve();
		}, 100);
	});
}
function setClerkJSLoadingErrorPackageName(packageName) {
	errorThrower.setPackageName({ packageName });
}
/**
* @deprecated Use `loadClerkJSScript` instead. This alias will be removed in a future major version.
*/
const loadClerkJsScript = loadClerkJSScript;
/**
* @deprecated Use `clerkJSScriptUrl` instead. This alias will be removed in a future major version.
*/
const clerkJsScriptUrl = clerkJSScriptUrl;
/**
* @deprecated Use `buildClerkJSScriptAttributes` instead. This alias will be removed in a future major version.
*/
const buildClerkJsScriptAttributes = buildClerkJSScriptAttributes;
/**
* @deprecated Use `setClerkJSLoadingErrorPackageName` instead. This alias will be removed in a future major version.
*/
const setClerkJsLoadingErrorPackageName = setClerkJSLoadingErrorPackageName;

//#endregion
export { buildClerkJSScriptAttributes, buildClerkJsScriptAttributes, buildClerkUIScriptAttributes, buildScriptHost, clerkJSScriptUrl, clerkJsScriptUrl, clerkUIScriptUrl, loadClerkJSScript, loadClerkJsScript, loadClerkUIScript, setClerkJSLoadingErrorPackageName, setClerkJsLoadingErrorPackageName };
//# sourceMappingURL=loadClerkJsScript.mjs.map