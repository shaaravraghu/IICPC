import { Io as GetTokenOptions } from "./index-DAac51Y8.js";
import "./moduleManager-WB15hU3T.js";

//#region src/getToken.d.ts

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
declare function getToken(options?: GetTokenOptions): Promise<string | null>;
//#endregion
export { getToken };
//# sourceMappingURL=getToken.d.ts.map