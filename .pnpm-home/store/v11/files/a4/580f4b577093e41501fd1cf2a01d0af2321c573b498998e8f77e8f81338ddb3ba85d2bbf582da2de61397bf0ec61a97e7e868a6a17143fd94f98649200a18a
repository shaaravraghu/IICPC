//#region src/keyless/types.d.ts
/**
 * Represents an accountless application created in keyless mode.
 *
 * This interface matches the shape of `AccountlessApplication` from `@clerk/backend`.
 * We define it here to avoid a circular dependency (shared cannot depend on backend).
 * Framework packages that depend on both shared and backend can use either type
 * interchangeably since they have the same structure.
 */
interface AccountlessApplication {
  readonly publishableKey: string;
  readonly secretKey: string;
  readonly claimUrl: string;
  readonly apiKeysUrl: string;
}
/**
 * Public-facing keyless application data (without secret key).
 */
type PublicKeylessApplication = Omit<AccountlessApplication, 'secretKey'>;
//#endregion
//#region src/keyless/devCache.d.ts
interface ClerkDevCache {
  __cache: Map<string, {
    expiresAt: number;
    data?: unknown;
  }>;
  /**
   * Log a message with throttling to prevent spam.
   */
  log: (params: {
    cacheKey: string;
    msg: string;
  }) => void;
  /**
   * Run an async callback with caching.
   */
  run: <T>(callback: () => Promise<T>, options: {
    cacheKey: string;
    onSuccessStale?: number;
    onErrorStale?: number;
  }) => Promise<T | undefined>;
}
declare global {
  var __clerk_internal_keyless_logger: ClerkDevCache | undefined;
}
/**
 * Creates a development-only cache for keyless mode logging and API calls.
 * This prevents console spam and duplicate API requests.
 *
 * @returns The cache instance or undefined in non-development environments
 */
declare function createClerkDevCache(): ClerkDevCache | undefined;
/**
 * Creates the console message shown when running in keyless mode.
 *
 * @param keys - The keyless application keys
 * @returns Formatted console message
 */
declare function createKeylessModeMessage(keys: AccountlessApplication | PublicKeylessApplication): string;
/**
 * Creates the console message shown when keys have been claimed.
 *
 * @returns Formatted console message
 */
declare function createConfirmationMessage(): string;
/**
 * Shared singleton instance of the development cache.
 */
declare const clerkDevelopmentCache: ClerkDevCache | undefined;
//#endregion
//#region src/keyless/service.d.ts
/**
 * Storage adapter interface for keyless mode.
 * Implementations can use file system, cookies, or other storage mechanisms.
 *
 * Implementations are responsible for their own concurrency handling
 * (e.g., file locking for file-based storage).
 */
interface KeylessStorage {
  /**
   * Reads the stored keyless configuration.
   *
   * @returns The JSON string of the stored config, or empty string if not found.
   */
  read(): string;
  /**
   * Writes the keyless configuration to storage.
   *
   * @param data - The JSON string to store.
   */
  write(data: string): void;
  /**
   * Removes the keyless configuration from storage.
   */
  remove(): void;
}
/**
 * API adapter for keyless mode operations.
 * This abstraction allows the service to work without depending on @clerk/backend.
 */
interface KeylessAPI {
  /**
   * Creates a new accountless application.
   *
   * @param requestHeaders - Optional headers to include with the request.
   * @returns The created AccountlessApplication or null if failed.
   */
  createAccountlessApplication(requestHeaders?: Headers): Promise<AccountlessApplication | null>;
  /**
   * Notifies the backend that onboarding is complete (instance has been claimed).
   *
   * @param requestHeaders - Optional headers to include with the request.
   * @returns The updated AccountlessApplication or null if failed.
   */
  completeOnboarding(requestHeaders?: Headers): Promise<AccountlessApplication | null>;
}
/**
 * Options for creating a keyless service.
 */
interface KeylessServiceOptions {
  /**
   * Storage adapter for reading/writing keyless configuration.
   */
  storage: KeylessStorage;
  /**
   * API adapter for keyless operations (create application, complete onboarding).
   */
  api: KeylessAPI;
  /**
   * Optional: Framework name for metadata (e.g., 'Next.js', 'TanStack Start').
   */
  framework?: string;
  /**
   * Optional: Framework version for metadata.
   */
  frameworkVersion?: string;
}
/**
 * Result type for key resolution.
 */
interface KeylessResult$1 {
  publishableKey: string | undefined;
  secretKey: string | undefined;
  claimUrl: string | undefined;
  apiKeysUrl: string | undefined;
}
/**
 * The keyless service interface.
 */
interface KeylessService {
  /**
   * Gets existing keyless keys or creates new ones via the API.
   */
  getOrCreateKeys: () => Promise<AccountlessApplication | null>;
  /**
   * Reads existing keyless keys without creating new ones.
   */
  readKeys: () => AccountlessApplication | undefined;
  /**
   * Removes the keyless configuration.
   */
  removeKeys: () => void;
  /**
   * Notifies the backend that the instance has been claimed/onboarded.
   * This should be called once when the user claims their instance.
   */
  completeOnboarding: () => Promise<AccountlessApplication | null>;
  /**
   * Logs a keyless mode message to the console (throttled to once per process).
   */
  logKeylessMessage: (claimUrl: string) => void;
  /**
   * Resolves Clerk keys, falling back to keyless mode if configured keys are missing.
   *
   * @param configuredPublishableKey - The publishable key from options or environment
   * @param configuredSecretKey - The secret key from options or environment
   * @returns The resolved keys (either configured or from keyless mode)
   */
  resolveKeysWithKeylessFallback: (configuredPublishableKey: string | undefined, configuredSecretKey: string | undefined) => Promise<KeylessResult$1>;
}
/**
 * Creates a keyless service that handles accountless application creation and storage.
 * This provides a simple API for frameworks to integrate keyless mode.
 *
 * @param options - Configuration for the service including storage and API adapters
 * @returns A keyless service instance
 *
 * @example
 * ```ts
 * import { createKeylessService } from '@clerk/shared/keyless';
 *
 * const keylessService = createKeylessService({
 *   storage: createFileStorage(),
 *   api: createKeylessAPI({ secretKey }),
 *   framework: 'TanStack Start',
 * });
 *
 * const keys = await keylessService.getOrCreateKeys(request);
 * if (keys) {
 *   console.log('Publishable Key:', keys.publishableKey);
 * }
 * ```
 */
declare function createKeylessService(options: KeylessServiceOptions): KeylessService;
//#endregion
//#region src/keyless/nodeFileStorage.d.ts
interface NodeFileStorageOptions {
  /**
   * Function that returns the current working directory.
   * Defaults to process.cwd().
   */
  cwd?: () => string;
  /**
   * The framework name for the README message.
   *
   * @example '@clerk/nextjs'
   */
  frameworkPackageName?: string;
}
interface FileSystemAdapter {
  existsSync: (path: string) => boolean;
  readFileSync: (path: string, options: {
    encoding: BufferEncoding;
  }) => string;
  writeFileSync: (path: string, data: string, options: {
    encoding: BufferEncoding;
    mode?: number;
  }) => void;
  appendFileSync: (path: string, data: string) => void;
  mkdirSync: (path: string, options: {
    recursive: boolean;
  }) => void;
  rmSync: (path: string, options: {
    force?: boolean;
    recursive?: boolean;
  }) => void;
}
interface PathAdapter {
  join: (...paths: string[]) => string;
}
/**
 * Creates a file-based storage adapter for keyless mode.
 * This is used by Node.js-based frameworks (Next.js, TanStack Start, etc.)
 * to persist keyless configuration to the file system.
 *
 * @param fs - Node.js fs module or compatible adapter
 * @param path - Node.js path module or compatible adapter
 * @param options - Configuration options
 * @returns A KeylessStorage implementation
 */
declare function createNodeFileStorage(fs: FileSystemAdapter, path: PathAdapter, options?: NodeFileStorageOptions): KeylessStorage;
//#endregion
//#region src/keyless/resolveKeysWithKeylessFallback.d.ts
interface KeylessResult {
  publishableKey: string | undefined;
  secretKey: string | undefined;
  claimUrl: string | undefined;
  apiKeysUrl: string | undefined;
}
/**
 * Resolves Clerk keys, falling back to keyless mode in development if configured keys are missing.
 *
 * @param configuredPublishableKey - The publishable key from options or environment
 * @param configuredSecretKey - The secret key from options or environment
 * @param keylessService - The keyless service instance (or null if unavailable)
 * @param canUseKeyless - Whether keyless mode is enabled in the current environment
 * @returns The resolved keys (either configured or from keyless mode)
 */
declare function resolveKeysWithKeylessFallback(configuredPublishableKey: string | undefined, configuredSecretKey: string | undefined, keylessService: KeylessService | null, canUseKeyless: boolean): Promise<KeylessResult>;
//#endregion
export { type AccountlessApplication, type ClerkDevCache, type FileSystemAdapter, type KeylessAPI, type KeylessResult, type KeylessService, type KeylessServiceOptions, type KeylessStorage, type NodeFileStorageOptions, type PathAdapter, type PublicKeylessApplication, clerkDevelopmentCache, createClerkDevCache, createConfirmationMessage, createKeylessModeMessage, createKeylessService, createNodeFileStorage, resolveKeysWithKeylessFallback };
//# sourceMappingURL=index.d.ts.map