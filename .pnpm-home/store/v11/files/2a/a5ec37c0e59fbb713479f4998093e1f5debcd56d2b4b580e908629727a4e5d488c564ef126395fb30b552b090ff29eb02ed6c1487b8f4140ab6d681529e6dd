//#region src/proxy.d.ts
/**
 *
 */
declare function isValidProxyUrl(key: string | undefined): boolean;
/**
 *
 */
declare function isHttpOrHttps(key: string | undefined): boolean;
/**
 *
 */
declare function isProxyUrlRelative(key: string): boolean;
/**
 *
 */
declare function proxyUrlToAbsoluteURL(url: string | undefined): string;
declare const AUTO_PROXY_PATH = "/__clerk";
declare function shouldAutoProxy(hostname: string): boolean;
type GetAutoProxyUrlFromEnvironmentOptions = {
  publishableKey: string;
  hasDomain?: boolean;
  hasProxyUrl?: boolean;
  environment?: NodeJS.ProcessEnv;
};
/**
 * Determines if the current Vercel environment should use auto-proxy.
 * Note: This runs both at build time (static generation) and at runtime
 * (server-side rendering) via mergeNextClerkPropsWithEnv in providers.
 * The return value may become the proxyUrl or the script src prefix.
 */
declare function getAutoProxyUrlFromEnvironment({
  publishableKey,
  hasDomain,
  hasProxyUrl,
  environment
}: GetAutoProxyUrlFromEnvironmentOptions): string;
/**
 * Function that determines whether proxy should be used for a given URL.
 */
type ShouldProxyFn = (url: URL) => boolean;
//#endregion
export { AUTO_PROXY_PATH, ShouldProxyFn, getAutoProxyUrlFromEnvironment, isHttpOrHttps, isProxyUrlRelative, isValidProxyUrl, proxyUrlToAbsoluteURL, shouldAutoProxy };
//# sourceMappingURL=proxy.d.ts.map