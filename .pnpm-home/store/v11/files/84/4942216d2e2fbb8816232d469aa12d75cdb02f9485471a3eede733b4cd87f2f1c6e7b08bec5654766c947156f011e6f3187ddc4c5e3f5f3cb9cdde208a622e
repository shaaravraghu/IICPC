//#region src/safeImport.d.ts
/**
 * Safely imports a module with automatic retries on failure.
 * Useful for dynamic imports that might fail due to network issues or temporary loading problems.
 * Retries up to 3 times with exponential backoff.
 *
 * @param importFn - A function that returns a dynamic import promise
 * @returns A promise that resolves to the imported module
 *
 * @example
 * ```typescript
 * const module = await safeImport(() => import('./my-module'));
 * ```
 */
declare const safeImport: <T = any>(importFn: () => Promise<T>) => Promise<T>;
//#endregion
export { safeImport };
//# sourceMappingURL=safeImport.d.mts.map