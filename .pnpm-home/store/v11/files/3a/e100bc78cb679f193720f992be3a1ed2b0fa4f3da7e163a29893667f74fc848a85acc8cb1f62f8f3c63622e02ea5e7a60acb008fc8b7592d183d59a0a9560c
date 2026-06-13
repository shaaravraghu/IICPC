/**
 * Creates a debounced function executor that delays execution until after a specified time.
 * Multiple calls with the same key will cancel previous pending executions.
 *
 * This is useful for batching rapid updates (like auto-save or API calls) to avoid
 * unnecessary processing or network requests.
 *
 * @param options - Configuration options for delay, maxWait, and key separator
 * @returns A function that accepts a key array and callback to execute
 *
 * @example
 * const debouncedSave = debounce({ delay: 328 })
 * debouncedSave.execute(['user', '123'], () => saveUser(user))
 *
 * @example
 * // With maxWait to guarantee execution even with continuous calls
 * const debouncedSave = debounce({ delay: 328, maxWait: 2000 })
 * debouncedSave.execute(['user', '123'], () => saveUser(user))
 */
export const debounce = (options = {}) => {
    const { delay = 328, maxWait } = options;
    const timeouts = new Map();
    const maxWaitTimeouts = new Map();
    const latestFunctions = new Map();
    const cleanup = () => {
        timeouts.forEach(clearTimeout);
        maxWaitTimeouts.forEach(clearTimeout);
        timeouts.clear();
        maxWaitTimeouts.clear();
        latestFunctions.clear();
    };
    /** Executes the function and cleans up all associated timeouts */
    const executeAndCleanup = (key) => {
        // Get the latest function for this key
        const fn = latestFunctions.get(key);
        // Clear both timeout types
        const timeout = timeouts.get(key);
        if (timeout !== undefined) {
            clearTimeout(timeout);
            timeouts.delete(key);
        }
        const maxWaitTimeout = maxWaitTimeouts.get(key);
        if (maxWaitTimeout !== undefined) {
            clearTimeout(maxWaitTimeout);
            maxWaitTimeouts.delete(key);
        }
        // Clear the latest function reference
        latestFunctions.delete(key);
        // Execute the function if it exists
        if (fn !== undefined) {
            try {
                fn();
            }
            catch {
                // Errors are silently caught to prevent the debounce mechanism from breaking
            }
        }
    };
    const execute = (key, fn) => {
        // Store the latest function for this key
        latestFunctions.set(key, fn);
        // Clear existing debounce timeout
        const existingTimeout = timeouts.get(key);
        if (existingTimeout !== undefined) {
            clearTimeout(existingTimeout);
        }
        // Set debounce timeout
        timeouts.set(key, setTimeout(() => executeAndCleanup(key), delay));
        // Set maxWait timeout only if configured and this is a new sequence
        if (maxWait !== undefined && !maxWaitTimeouts.has(key)) {
            maxWaitTimeouts.set(key, setTimeout(() => executeAndCleanup(key), maxWait));
        }
    };
    const flush = (key) => {
        if (!latestFunctions.has(key)) {
            return;
        }
        executeAndCleanup(key);
    };
    const flushAll = () => {
        const keys = [...latestFunctions.keys()];
        for (const key of keys) {
            executeAndCleanup(key);
        }
    };
    return { execute, cleanup, flush, flushAll };
};
