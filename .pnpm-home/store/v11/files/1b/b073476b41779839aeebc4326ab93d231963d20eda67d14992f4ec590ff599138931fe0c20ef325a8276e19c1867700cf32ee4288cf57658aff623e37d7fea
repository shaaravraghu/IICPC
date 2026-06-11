const require_runtimeEnvironment = require('../runtimeEnvironment-DJJWo5AR.js');

//#region src/keyless/devCache.ts
const THROTTLE_DURATION_MS = 600 * 1e3;
/**
* Creates a development-only cache for keyless mode logging and API calls.
* This prevents console spam and duplicate API requests.
*
* @returns The cache instance or undefined in non-development environments
*/
function createClerkDevCache() {
	if (!require_runtimeEnvironment.isDevelopmentEnvironment()) return;
	if (!globalThis.__clerk_internal_keyless_logger) globalThis.__clerk_internal_keyless_logger = {
		__cache: /* @__PURE__ */ new Map(),
		log: function({ cacheKey, msg }) {
			if (this.__cache.has(cacheKey) && Date.now() < (this.__cache.get(cacheKey)?.expiresAt || 0)) return;
			console.log(msg);
			this.__cache.set(cacheKey, { expiresAt: Date.now() + THROTTLE_DURATION_MS });
		},
		run: async function(callback, { cacheKey, onSuccessStale = THROTTLE_DURATION_MS, onErrorStale = THROTTLE_DURATION_MS }) {
			if (this.__cache.has(cacheKey) && Date.now() < (this.__cache.get(cacheKey)?.expiresAt || 0)) return this.__cache.get(cacheKey)?.data;
			try {
				const result = await callback();
				this.__cache.set(cacheKey, {
					expiresAt: Date.now() + onSuccessStale,
					data: result
				});
				return result;
			} catch (e) {
				this.__cache.set(cacheKey, { expiresAt: Date.now() + onErrorStale });
				throw e;
			}
		}
	};
	return globalThis.__clerk_internal_keyless_logger;
}
/**
* Creates the console message shown when running in keyless mode.
*
* @param keys - The keyless application keys
* @returns Formatted console message
*/
function createKeylessModeMessage(keys) {
	return `\n\x1b[35m\n[Clerk]:\x1b[0m You are running in keyless mode.\nYou can \x1b[35mclaim your keys\x1b[0m by visiting ${keys.claimUrl}\n`;
}
/**
* Creates the console message shown when keys have been claimed.
*
* @returns Formatted console message
*/
function createConfirmationMessage() {
	return `\n\x1b[35m\n[Clerk]:\x1b[0m Your application is running with your claimed keys.\nYou can safely remove the \x1b[35m.clerk/\x1b[0m from your project.\n`;
}
/**
* Shared singleton instance of the development cache.
*/
const clerkDevelopmentCache = createClerkDevCache();

//#endregion
//#region src/keyless/nodeFileStorage.ts
const CLERK_HIDDEN = ".clerk";
const CLERK_LOCK = "clerk.lock";
const TEMP_DIR_NAME = ".tmp";
const CONFIG_FILE = "keyless.json";
const README_FILE = "README.md";
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
function createNodeFileStorage(fs, path, options = {}) {
	const { cwd = () => process.cwd(), frameworkPackageName = "@clerk/shared" } = options;
	let inMemoryLock = false;
	const getClerkDir = () => path.join(cwd(), CLERK_HIDDEN);
	const getTempDir = () => path.join(getClerkDir(), TEMP_DIR_NAME);
	const getConfigPath = () => path.join(getTempDir(), CONFIG_FILE);
	const getReadmePath = () => path.join(getTempDir(), README_FILE);
	const getLockPath = () => path.join(cwd(), CLERK_LOCK);
	const isLocked = () => inMemoryLock || fs.existsSync(getLockPath());
	const lock = () => {
		if (isLocked()) return false;
		inMemoryLock = true;
		try {
			fs.writeFileSync(getLockPath(), "This file can be deleted if your app is stuck.", {
				encoding: "utf8",
				mode: 420
			});
			return true;
		} catch {
			inMemoryLock = false;
			return false;
		}
	};
	const unlock = () => {
		inMemoryLock = false;
		try {
			if (fs.existsSync(getLockPath())) fs.rmSync(getLockPath(), { force: true });
		} catch {}
	};
	const ensureDirectoryExists = () => {
		const tempDir = getTempDir();
		if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
	};
	const updateGitignore = () => {
		const gitignorePath = path.join(cwd(), ".gitignore");
		const entry = `/${CLERK_HIDDEN}/`;
		if (!fs.existsSync(gitignorePath)) fs.writeFileSync(gitignorePath, "", {
			encoding: "utf8",
			mode: 420
		});
		if (!fs.readFileSync(gitignorePath, { encoding: "utf-8" }).includes(entry)) fs.appendFileSync(gitignorePath, `\n# clerk configuration (can include secrets)\n${entry}\n`);
	};
	const writeReadme = () => {
		const readme = `## DO NOT COMMIT
This directory is auto-generated from \`${frameworkPackageName}\` because you are running in Keyless mode.
Avoid committing the \`.clerk/\` directory as it includes the secret key of the unclaimed instance.
`;
		fs.writeFileSync(getReadmePath(), readme, {
			encoding: "utf8",
			mode: 384
		});
	};
	return {
		read() {
			try {
				if (!fs.existsSync(getConfigPath())) return "";
				return fs.readFileSync(getConfigPath(), { encoding: "utf-8" });
			} catch {
				return "";
			}
		},
		write(data) {
			if (!lock()) return;
			try {
				ensureDirectoryExists();
				updateGitignore();
				writeReadme();
				fs.writeFileSync(getConfigPath(), data, {
					encoding: "utf8",
					mode: 384
				});
			} finally {
				unlock();
			}
		},
		remove() {
			if (!lock()) return;
			try {
				if (fs.existsSync(getClerkDir())) fs.rmSync(getClerkDir(), {
					recursive: true,
					force: true
				});
			} finally {
				unlock();
			}
		}
	};
}

//#endregion
//#region src/keyless/service.ts
/**
* Creates metadata headers for the keyless service.
*/
function createMetadataHeaders(framework, frameworkVersion) {
	const headers = new Headers();
	if (framework) headers.set("Clerk-Framework", framework);
	if (frameworkVersion) headers.set("Clerk-Framework-Version", frameworkVersion);
	return headers;
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
function createKeylessService(options) {
	const { storage, api, framework, frameworkVersion } = options;
	let hasLoggedKeylessMessage = false;
	const safeParseConfig = () => {
		try {
			const data = storage.read();
			if (!data) return;
			return JSON.parse(data);
		} catch {
			return;
		}
	};
	return {
		async getOrCreateKeys() {
			const existingConfig = safeParseConfig();
			if (existingConfig?.publishableKey && existingConfig?.secretKey) return existingConfig;
			const headers = createMetadataHeaders(framework, frameworkVersion);
			const accountlessApplication = await api.createAccountlessApplication(headers);
			if (accountlessApplication) storage.write(JSON.stringify(accountlessApplication));
			return accountlessApplication;
		},
		readKeys() {
			return safeParseConfig();
		},
		removeKeys() {
			storage.remove();
		},
		async completeOnboarding() {
			const headers = createMetadataHeaders(framework, frameworkVersion);
			return api.completeOnboarding(headers);
		},
		logKeylessMessage(claimUrl) {
			if (!hasLoggedKeylessMessage) {
				hasLoggedKeylessMessage = true;
				console.log(`[Clerk]: Running in keyless mode. Claim your keys at: ${claimUrl}`);
			}
		},
		async resolveKeysWithKeylessFallback(configuredPublishableKey, configuredSecretKey) {
			let publishableKey = configuredPublishableKey;
			let secretKey = configuredSecretKey;
			let claimUrl;
			let apiKeysUrl;
			try {
				const locallyStoredKeys = safeParseConfig();
				if (Boolean(configuredPublishableKey) && configuredPublishableKey === locallyStoredKeys?.publishableKey && locallyStoredKeys) {
					try {
						await clerkDevelopmentCache?.run(() => this.completeOnboarding(), {
							cacheKey: `${locallyStoredKeys.publishableKey}_complete`,
							onSuccessStale: 1440 * 60 * 1e3
						});
					} catch {}
					clerkDevelopmentCache?.log({
						cacheKey: `${locallyStoredKeys.publishableKey}_claimed`,
						msg: createConfirmationMessage()
					});
					return {
						publishableKey,
						secretKey,
						claimUrl,
						apiKeysUrl
					};
				}
				if (!publishableKey && !secretKey) {
					const keylessApp = await this.getOrCreateKeys();
					if (keylessApp) {
						publishableKey = keylessApp.publishableKey;
						secretKey = keylessApp.secretKey;
						claimUrl = keylessApp.claimUrl;
						apiKeysUrl = keylessApp.apiKeysUrl;
						clerkDevelopmentCache?.log({
							cacheKey: keylessApp.publishableKey,
							msg: createKeylessModeMessage(keylessApp)
						});
					}
				}
			} catch {}
			return {
				publishableKey,
				secretKey,
				claimUrl,
				apiKeysUrl
			};
		}
	};
}

//#endregion
//#region src/keyless/resolveKeysWithKeylessFallback.ts
/**
* Resolves Clerk keys, falling back to keyless mode in development if configured keys are missing.
*
* @param configuredPublishableKey - The publishable key from options or environment
* @param configuredSecretKey - The secret key from options or environment
* @param keylessService - The keyless service instance (or null if unavailable)
* @param canUseKeyless - Whether keyless mode is enabled in the current environment
* @returns The resolved keys (either configured or from keyless mode)
*/
async function resolveKeysWithKeylessFallback(configuredPublishableKey, configuredSecretKey, keylessService, canUseKeyless) {
	let publishableKey = configuredPublishableKey;
	let secretKey = configuredSecretKey;
	let claimUrl;
	let apiKeysUrl;
	if (!canUseKeyless) return {
		publishableKey,
		secretKey,
		claimUrl,
		apiKeysUrl
	};
	if (!keylessService) return {
		publishableKey,
		secretKey,
		claimUrl,
		apiKeysUrl
	};
	try {
		const locallyStoredKeys = keylessService.readKeys();
		if (Boolean(configuredPublishableKey) && configuredPublishableKey === locallyStoredKeys?.publishableKey && locallyStoredKeys) {
			try {
				await clerkDevelopmentCache?.run(() => keylessService.completeOnboarding(), {
					cacheKey: `${locallyStoredKeys.publishableKey}_complete`,
					onSuccessStale: 1440 * 60 * 1e3
				});
			} catch {}
			clerkDevelopmentCache?.log({
				cacheKey: `${locallyStoredKeys.publishableKey}_claimed`,
				msg: createConfirmationMessage()
			});
			return {
				publishableKey,
				secretKey,
				claimUrl,
				apiKeysUrl
			};
		}
		if (!publishableKey && !secretKey) {
			const keylessApp = await keylessService.getOrCreateKeys();
			if (keylessApp) {
				publishableKey = keylessApp.publishableKey;
				secretKey = keylessApp.secretKey;
				claimUrl = keylessApp.claimUrl;
				apiKeysUrl = keylessApp.apiKeysUrl;
				clerkDevelopmentCache?.log({
					cacheKey: keylessApp.publishableKey,
					msg: createKeylessModeMessage(keylessApp)
				});
			}
		}
	} catch {}
	return {
		publishableKey,
		secretKey,
		claimUrl,
		apiKeysUrl
	};
}

//#endregion
exports.clerkDevelopmentCache = clerkDevelopmentCache;
exports.createClerkDevCache = createClerkDevCache;
exports.createConfirmationMessage = createConfirmationMessage;
exports.createKeylessModeMessage = createKeylessModeMessage;
exports.createKeylessService = createKeylessService;
exports.createNodeFileStorage = createNodeFileStorage;
exports.resolveKeysWithKeylessFallback = resolveKeysWithKeylessFallback;
//# sourceMappingURL=index.js.map