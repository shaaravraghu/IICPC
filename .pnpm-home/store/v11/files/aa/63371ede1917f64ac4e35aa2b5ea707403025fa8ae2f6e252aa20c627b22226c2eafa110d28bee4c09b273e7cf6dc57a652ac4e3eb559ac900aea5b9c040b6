import { Dt as SDKMetadata } from "./index-Ch3QvM-g.mjs";
import "./moduleManager-BsmFyRrH.mjs";

//#region src/loadClerkJsScript.d.ts
type LoadClerkJSScriptOptions = {
  publishableKey: string;
  /** @internal */
  __internal_clerkJSUrl?: string;
  /** @internal */
  __internal_clerkJSVersion?: string;
  sdkMetadata?: SDKMetadata;
  proxyUrl?: string;
  domain?: string;
  nonce?: string;
  /**
   * Timeout in milliseconds to wait for clerk-js to load before considering it failed.
   *
   * @default 15000 (15 seconds)
   */
  scriptLoadTimeout?: number;
};
/**
 * @deprecated Use `LoadClerkJSScriptOptions` instead. This alias will be removed in a future major version.
 */
type LoadClerkJsScriptOptions = LoadClerkJSScriptOptions;
type LoadClerkUIScriptOptions = {
  publishableKey: string;
  /** @internal */
  __internal_clerkUIUrl?: string;
  /** @internal */
  __internal_clerkUIVersion?: string;
  proxyUrl?: string;
  domain?: string;
  nonce?: string;
  scriptLoadTimeout?: number;
};
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
declare const loadClerkJSScript: (opts?: LoadClerkJSScriptOptions) => Promise<HTMLScriptElement | null>;
declare const loadClerkUIScript: (opts?: LoadClerkUIScriptOptions) => Promise<HTMLScriptElement | null>;
declare const clerkJSScriptUrl: (opts: LoadClerkJSScriptOptions) => string;
declare const clerkUIScriptUrl: (opts: LoadClerkUIScriptOptions) => string;
declare const buildClerkJSScriptAttributes: (options: LoadClerkJSScriptOptions) => Record<string, string>;
declare const buildClerkUIScriptAttributes: (options: LoadClerkUIScriptOptions) => Record<string, string>;
declare const buildScriptHost: (opts: {
  publishableKey: string;
  proxyUrl?: string;
  domain?: string;
}) => string;
declare function setClerkJSLoadingErrorPackageName(packageName: string): void;
/**
 * @deprecated Use `loadClerkJSScript` instead. This alias will be removed in a future major version.
 */
declare const loadClerkJsScript: (opts?: LoadClerkJSScriptOptions) => Promise<HTMLScriptElement | null>;
/**
 * @deprecated Use `clerkJSScriptUrl` instead. This alias will be removed in a future major version.
 */
declare const clerkJsScriptUrl: (opts: LoadClerkJSScriptOptions) => string;
/**
 * @deprecated Use `buildClerkJSScriptAttributes` instead. This alias will be removed in a future major version.
 */
declare const buildClerkJsScriptAttributes: (options: LoadClerkJSScriptOptions) => Record<string, string>;
/**
 * @deprecated Use `setClerkJSLoadingErrorPackageName` instead. This alias will be removed in a future major version.
 */
declare const setClerkJsLoadingErrorPackageName: typeof setClerkJSLoadingErrorPackageName;
//#endregion
export { LoadClerkJSScriptOptions, LoadClerkJsScriptOptions, LoadClerkUIScriptOptions, buildClerkJSScriptAttributes, buildClerkJsScriptAttributes, buildClerkUIScriptAttributes, buildScriptHost, clerkJSScriptUrl, clerkJsScriptUrl, clerkUIScriptUrl, loadClerkJSScript, loadClerkJsScript, loadClerkUIScript, setClerkJSLoadingErrorPackageName, setClerkJsLoadingErrorPackageName };
//# sourceMappingURL=loadClerkJsScript.d.mts.map