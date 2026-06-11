import { t as inBrowser } from "./browser-CMFCxUv7.mjs";
import { t as ClerkRuntimeError } from "./clerkRuntimeError-DqAmLuLY.mjs";

//#region src/getToken.ts
const TIMEOUT_MS = 1e4;
function getWindowClerk() {
	if (inBrowser() && "Clerk" in window) {
		const clerk = window.Clerk;
		if (clerk && (clerk.status === "ready" || clerk.status === "degraded")) return clerk;
		if (clerk?.loaded && !clerk.status) return clerk;
	}
}
async function waitForClerk() {
	if (!inBrowser()) throw new ClerkRuntimeError("getToken can only be used in browser environments. To access auth data server-side, see the Auth object reference doc: https://clerk.com/docs/reference/backend/types/auth-object", { code: "clerk_runtime_not_browser" });
	const clerk = getWindowClerk();
	if (clerk) return clerk;
	const clerkWindow = window;
	if (!clerkWindow.__clerk_internal_ready) {
		let resolve;
		let reject;
		const promise = new Promise((res, rej) => {
			resolve = res;
			reject = rej;
		});
		promise.__resolve = resolve;
		promise.__reject = reject;
		clerkWindow.__clerk_internal_ready = promise;
	}
	const readyPromise = clerkWindow.__clerk_internal_ready;
	let timeoutId;
	const timeoutPromise = new Promise((_, reject) => {
		timeoutId = setTimeout(() => reject(new ClerkRuntimeError("Timeout waiting for Clerk to load.", { code: "clerk_runtime_load_timeout" })), TIMEOUT_MS);
	});
	return Promise.race([readyPromise, timeoutPromise]).finally(() => {
		clearTimeout(timeoutId);
	});
}
/**
* Retrieves the current session token, waiting for Clerk to initialize if necessary.
*
* This function is safe to call from anywhere in the browser, such as API interceptors,
* data fetching layers, or vanilla JavaScript code.
*
* **Note:** In frameworks with concurrent rendering (e.g., React 18+), a global token read
* may not correspond to the currently committed UI during transitions. This is a coherence
* consideration, not an auth safety issue.
*
* @param options - Optional configuration for token retrieval
* @param options.template - The name of a JWT template to use
* @param options.organizationId - Organization ID to include in the token
* @param options.skipCache - Whether to skip the token cache
* @returns A Promise that resolves to the session token, or `null` if the user is not signed in
*
* @throws {ClerkRuntimeError} When called in a non-browser environment (code: `clerk_runtime_not_browser`)
*
* @throws {ClerkRuntimeError} When Clerk fails to load within timeout (code: `clerk_runtime_load_timeout`)
*
* @throws {ClerkOfflineError} When the browser is offline and unable to fetch a token (code: `clerk_offline`).
* Use `ClerkOfflineError.is(error)` to check for this error type.
*
* @example
* ```typescript
* // In an Axios interceptor
* import { getToken } from '@clerk/nextjs';
*
* axios.interceptors.request.use(async (config) => {
*   const token = await getToken();
*   if (token) {
*     config.headers.Authorization = `Bearer ${token}`;
*   }
*   return config;
* });
* ```
*/
async function getToken(options) {
	const clerk = await waitForClerk();
	if (!clerk.session) return null;
	return clerk.session.getToken(options);
}

//#endregion
export { getToken };
//# sourceMappingURL=getToken.mjs.map