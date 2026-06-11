export { DEFAULT_PROXY_PATH } from '@clerk/shared/constants';
/**
 * Options for the Frontend API proxy
 */
export interface FrontendApiProxyOptions {
    /**
     * The path prefix for proxy requests. Defaults to `/__clerk`.
     */
    proxyPath?: string;
    /**
     * The Clerk publishable key. Falls back to CLERK_PUBLISHABLE_KEY env var.
     */
    publishableKey?: string;
    /**
     * The Clerk secret key. Falls back to CLERK_SECRET_KEY env var.
     */
    secretKey?: string;
}
/**
 * Error codes for proxy errors
 */
export type ProxyErrorCode = 'proxy_configuration_error' | 'proxy_path_mismatch' | 'proxy_request_failed';
/**
 * Error response structure for proxy errors
 */
export interface ProxyError {
    code: ProxyErrorCode;
    message: string;
}
/**
 * Derives the Frontend API URL from a publishable key.
 * @param publishableKey - The Clerk publishable key
 * @returns The Frontend API URL for the environment
 */
export declare function fapiUrlFromPublishableKey(publishableKey: string): string;
/**
 * Removes trailing slashes from a string without using regex
 * to avoid potential ReDoS concerns flagged by security scanners.
 */
export declare function stripTrailingSlashes(str: string): string;
/**
 * Checks if a request path matches the proxy path.
 * @param request - The incoming request
 * @param options - Proxy options including the proxy path
 * @returns True if the request matches the proxy path
 */
export declare function matchProxyPath(request: Request, options?: Pick<FrontendApiProxyOptions, 'proxyPath'>): boolean;
/**
 * Proxies a request to Clerk's Frontend API.
 *
 * This function handles forwarding requests from your application to Clerk's
 * Frontend API, enabling scenarios where direct communication with Clerk's API
 * is blocked or needs to go through your application server.
 *
 * @param request - The incoming request to proxy
 * @param options - Proxy configuration options
 * @returns A Response from Clerk's Frontend API
 *
 * @example
 * ```typescript
 * import { clerkFrontendApiProxy } from '@clerk/backend/proxy';
 *
 * // In a route handler
 * const response = await clerkFrontendApiProxy(request, {
 *   proxyPath: '/__clerk',
 *   publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
 *   secretKey: process.env.CLERK_SECRET_KEY,
 * });
 * ```
 */
export declare function clerkFrontendApiProxy(request: Request, options?: FrontendApiProxyOptions): Promise<Response>;
//# sourceMappingURL=proxy.d.ts.map