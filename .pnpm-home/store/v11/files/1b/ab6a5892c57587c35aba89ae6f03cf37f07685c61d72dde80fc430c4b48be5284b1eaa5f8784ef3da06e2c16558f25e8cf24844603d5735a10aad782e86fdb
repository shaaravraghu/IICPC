import { PendingSessionOptions } from '@clerk/shared/types';
import { createClerkClient } from '@clerk/backend';
import { AuthenticateRequestOptions, SignedInAuthObject, SignedOutAuthObject } from '@clerk/backend/internal';
import { ShouldProxyFn } from '@clerk/shared/proxy';
import { Request } from 'express';

type ExpressRequestWithAuth = Request & {
    auth: (options?: PendingSessionOptions) => SignedInAuthObject | SignedOutAuthObject;
};
/**
 * Options for configuring Frontend API proxy in clerkMiddleware
 */
interface FrontendApiProxyOptions {
    /**
     * Enable proxy handling. Can be:
     * - `true` - enable for all domains
     * - `false` - disable for all domains
     * - A function: (url: URL) => boolean - enable based on the request URL
     */
    enabled: boolean | ShouldProxyFn;
    /**
     * The path prefix for proxy requests.
     *
     * @default '/__clerk'
     */
    path?: string;
}
type ClerkMiddlewareOptionsCallback = (req: Request) => ClerkMiddlewareOptions | Promise<ClerkMiddlewareOptions>;
type ClerkMiddlewareOptions = AuthenticateRequestOptions & {
    debug?: boolean;
    clerkClient?: ClerkClient;
    /**
     * Configure Frontend API proxy handling. When set, requests to the proxy path
     * will skip authentication, and the proxyUrl will be automatically derived
     * for handshake redirects.
     *
     * @example
     * // Enable with defaults (path: '/__clerk')
     * clerkMiddleware({ frontendApiProxy: { enabled: true } })
     *
     * @example
     * // Custom path
     * clerkMiddleware({ frontendApiProxy: { enabled: true, path: '/my-proxy' } })
     *
     * @example
     * // Disable proxy handling
     * clerkMiddleware({ frontendApiProxy: { enabled: false } })
     */
    frontendApiProxy?: FrontendApiProxyOptions;
};
type ClerkClient = ReturnType<typeof createClerkClient>;
type AuthenticateRequestParams = {
    clerkClient: ClerkClient;
    request: Request;
    options?: ClerkMiddlewareOptions;
};

export type { AuthenticateRequestParams as A, ClerkMiddlewareOptions as C, ExpressRequestWithAuth as E, ClerkMiddlewareOptionsCallback as a };
