/** HTTP Methods which can have a body */
export declare const BODY_METHODS: Set<string>;
/**
 * Makes a check to see if this method CAN have a body.
 *
 * When running inside Electron, all requests are also allowed to have a body because the underlying
 * undici implementation does not reject it, which matches the behavior users expect from desktop API clients.
 */
export declare const canMethodHaveBody: (method: string, skipElectron?: boolean) => boolean;
/*** We must purge body from requests that cannot accept it, skips the electron check */
export declare const buildSafeBodyRequest: (url: string, init: RequestInit) => Request;
//# sourceMappingURL=can-method-have-body.d.ts.map