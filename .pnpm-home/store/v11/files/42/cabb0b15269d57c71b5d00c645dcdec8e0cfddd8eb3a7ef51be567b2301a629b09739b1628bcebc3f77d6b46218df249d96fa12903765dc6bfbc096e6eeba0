import { a as createErrorTypeGuard, n as isClerkRuntimeError, r as ClerkError, t as ClerkRuntimeError } from "./clerkRuntimeError-DqAmLuLY.mjs";

//#region src/errors/clerkApiError.ts
/**
* This error contains the specific error message, code, and any additional metadata that was returned by the Clerk API.
*/
var ClerkAPIError = class {
	static kind = "ClerkAPIError";
	code;
	message;
	longMessage;
	meta;
	constructor(json) {
		const parsedError = {
			code: json.code,
			message: json.message,
			longMessage: json.long_message,
			meta: {
				paramName: json.meta?.param_name,
				sessionId: json.meta?.session_id,
				emailAddresses: json.meta?.email_addresses,
				identifiers: json.meta?.identifiers,
				zxcvbn: json.meta?.zxcvbn,
				plan: json.meta?.plan,
				isPlanUpgradePossible: json.meta?.is_plan_upgrade_possible
			}
		};
		this.code = parsedError.code;
		this.message = parsedError.message;
		this.longMessage = parsedError.longMessage;
		this.meta = parsedError.meta;
	}
};
/**
* Type guard to check if a value is a ClerkAPIError instance.
*/
const isClerkAPIError = createErrorTypeGuard(ClerkAPIError);

//#endregion
//#region src/errors/parseError.ts
/**
* Parses an array of ClerkAPIErrorJSON objects into an array of ClerkAPIError objects.
*
* @internal
*/
function parseErrors(data = []) {
	return data.length > 0 ? data.map((e) => new ClerkAPIError(e)) : [];
}
/**
* Parses a ClerkAPIErrorJSON object into a ClerkAPIError object.
*
* @deprecated Use `ClerkAPIError` class instead
*
* @internal
*/
function parseError(error) {
	return new ClerkAPIError(error);
}
/**
* Converts a ClerkAPIError object into a ClerkAPIErrorJSON object.
*
* @internal
*/
function errorToJSON(error) {
	return {
		code: error?.code || "",
		message: error?.message || "",
		long_message: error?.longMessage,
		meta: {
			param_name: error?.meta?.paramName,
			session_id: error?.meta?.sessionId,
			email_addresses: error?.meta?.emailAddresses,
			identifiers: error?.meta?.identifiers,
			zxcvbn: error?.meta?.zxcvbn,
			plan: error?.meta?.plan,
			is_plan_upgrade_possible: error?.meta?.isPlanUpgradePossible
		}
	};
}

//#endregion
//#region src/errors/clerkApiResponseError.ts
var ClerkAPIResponseError = class ClerkAPIResponseError extends ClerkError {
	static kind = "ClerkAPIResponseError";
	status;
	clerkTraceId;
	retryAfter;
	errors;
	constructor(message, options) {
		const { data: errorsJson, status, clerkTraceId, retryAfter } = options;
		super({
			...options,
			message,
			code: "api_response_error"
		});
		Object.setPrototypeOf(this, ClerkAPIResponseError.prototype);
		this.status = status;
		this.clerkTraceId = clerkTraceId;
		this.retryAfter = retryAfter;
		this.errors = (errorsJson || []).map((e) => new ClerkAPIError(e));
	}
	toString() {
		let message = `[${this.name}]\nMessage:${this.message}\nStatus:${this.status}\nSerialized errors: ${this.errors.map((e) => JSON.stringify(e))}`;
		if (this.clerkTraceId) message += `\nClerk Trace ID: ${this.clerkTraceId}`;
		return message;
	}
	static formatMessage(name, msg, _, __) {
		return msg;
	}
};
/**
* Type guard to check if an error is a ClerkAPIResponseError.
* Can be called as a standalone function or as a method on an error object.
*
* @example
* // As a standalone function
* if (isClerkAPIResponseError(error)) { ... }
*
* // As a method (when attached to error object)
* if (error.isClerkAPIResponseError()) { ... }
*/
const isClerkAPIResponseError = createErrorTypeGuard(ClerkAPIResponseError);

//#endregion
//#region src/errors/missingExpiredTokenError.ts
/**
* Error class representing a missing expired token error from the API.
* This error occurs when the server requires an expired token to mint a new session token.
*
* Use the static `is` method to check if a ClerkAPIResponseError matches this error type.
*
* @example
* ```typescript
* if (MissingExpiredTokenError.is(error)) {
*   // Handle the missing expired token error
* }
* ```
*/
var MissingExpiredTokenError = class MissingExpiredTokenError extends ClerkAPIResponseError {
	static kind = "MissingExpiredTokenError";
	static ERROR_CODE = "missing_expired_token";
	static STATUS = 422;
	/**
	* Type guard to check if an error is a MissingExpiredTokenError.
	* This checks the error's properties (status and error code) rather than instanceof,
	* allowing it to work with ClerkAPIResponseError instances thrown from the API layer.
	*
	* @example
	* ```typescript
	* try {
	*   await someApiCall();
	* } catch (e) {
	*   if (MissingExpiredTokenError.is(e)) {
	*     // e is typed as ClerkAPIResponseError with the specific error properties
	*   }
	* }
	* ```
	*/
	static is(err) {
		return isClerkAPIResponseError(err) && err.status === MissingExpiredTokenError.STATUS && err.errors.length > 0 && err.errors[0].code === MissingExpiredTokenError.ERROR_CODE;
	}
};

//#endregion
//#region src/errors/clerkOfflineError.ts
/**
* Error thrown when a network request fails due to the client being offline.
*
* This error is thrown instead of returning `null` to make it explicit that
* the failure was due to network conditions, not authentication state.
*
* @example
* ```typescript
* try {
*   const token = await session.getToken();
* } catch (error) {
*   if (ClerkOfflineError.is(error)) {
*     // Handle offline scenario
*     showOfflineScreen();
*   }
* }
* ```
*/
var ClerkOfflineError = class ClerkOfflineError extends ClerkRuntimeError {
	static kind = "ClerkOfflineError";
	static ERROR_CODE = "clerk_offline";
	constructor(message) {
		super(message, { code: ClerkOfflineError.ERROR_CODE });
		Object.setPrototypeOf(this, ClerkOfflineError.prototype);
	}
	/**
	* Type guard to check if an error is a ClerkOfflineError.
	* This checks both instanceof and the error code to support cross-bundle/cross-realm errors
	*
	* @example
	* ```typescript
	* try {
	*   const token = await session.getToken();
	* } catch (error) {
	*   if (ClerkOfflineError.is(error)) {
	*     // error is typed as ClerkOfflineError
	*     console.log('User is offline');
	*   }
	* }
	* ```
	*/
	static is(error) {
		if (error === null || error === void 0) return false;
		return error instanceof ClerkOfflineError || isClerkRuntimeError(error) && error.code === ClerkOfflineError.ERROR_CODE;
	}
};

//#endregion
//#region src/errors/errorThrower.ts
const DefaultMessages = Object.freeze({
	InvalidProxyUrlErrorMessage: `The proxyUrl passed to Clerk is invalid. The expected value for proxyUrl is an absolute URL or a relative path with a leading '/'. (key={{url}})`,
	InvalidPublishableKeyErrorMessage: `The publishableKey passed to Clerk is invalid. You can get your Publishable key at https://dashboard.clerk.com/last-active?path=api-keys. (key={{key}})`,
	MissingPublishableKeyErrorMessage: `Missing publishableKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.`,
	MissingSecretKeyErrorMessage: `Missing secretKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.`,
	MissingClerkProvider: `{{source}} can only be used within the <ClerkProvider /> component. Learn more: https://clerk.com/docs/components/clerk-provider`
});
/**
* Builds an error thrower.
*
* @internal
*/
function buildErrorThrower({ packageName, customMessages }) {
	let pkg = packageName;
	/**
	* Builds a message from a raw message and replacements.
	*
	* @internal
	*/
	function buildMessage(rawMessage, replacements) {
		if (!replacements) return `${pkg}: ${rawMessage}`;
		let msg = rawMessage;
		const matches = rawMessage.matchAll(/{{([a-zA-Z0-9-_]+)}}/g);
		for (const match of matches) {
			const replacement = (replacements[match[1]] || "").toString();
			msg = msg.replace(`{{${match[1]}}}`, replacement);
		}
		return `${pkg}: ${msg}`;
	}
	const messages = {
		...DefaultMessages,
		...customMessages
	};
	return {
		setPackageName({ packageName: packageName$1 }) {
			if (typeof packageName$1 === "string") pkg = packageName$1;
			return this;
		},
		setMessages({ customMessages: customMessages$1 }) {
			Object.assign(messages, customMessages$1 || {});
			return this;
		},
		throwInvalidPublishableKeyError(params) {
			throw new Error(buildMessage(messages.InvalidPublishableKeyErrorMessage, params));
		},
		throwInvalidProxyUrl(params) {
			throw new Error(buildMessage(messages.InvalidProxyUrlErrorMessage, params));
		},
		throwMissingPublishableKeyError() {
			throw new Error(buildMessage(messages.MissingPublishableKeyErrorMessage));
		},
		throwMissingSecretKeyError() {
			throw new Error(buildMessage(messages.MissingSecretKeyErrorMessage));
		},
		throwMissingClerkProviderError(params) {
			throw new Error(buildMessage(messages.MissingClerkProvider, params));
		},
		throw(message) {
			throw new Error(buildMessage(message));
		}
	};
}

//#endregion
//#region src/errors/emailLinkError.ts
var EmailLinkError = class EmailLinkError extends Error {
	code;
	constructor(code) {
		super(code);
		this.code = code;
		this.name = "EmailLinkError";
		Object.setPrototypeOf(this, EmailLinkError.prototype);
	}
};
/**
* @deprecated Use `EmailLinkErrorCodeStatus` instead.
*
* @internal
*/
const EmailLinkErrorCode = {
	Expired: "expired",
	Failed: "failed",
	ClientMismatch: "client_mismatch"
};
const EmailLinkErrorCodeStatus = {
	Expired: "expired",
	Failed: "failed",
	ClientMismatch: "client_mismatch"
};

//#endregion
//#region src/errors/webAuthNError.ts
var ClerkWebAuthnError = class extends ClerkRuntimeError {
	/**
	* A unique code identifying the error, can be used for localization.
	*/
	code;
	constructor(message, options) {
		super(message, options);
		this.code = options.code;
	}
};

//#endregion
//#region src/errors/helpers.ts
/**
* Checks if the provided error object is an unauthorized error.
*
* @internal
*
* @deprecated This is no longer used, and will be removed in the next major version.
*/
function isUnauthorizedError(e) {
	const status = e?.status;
	return e?.errors?.[0]?.code === "authentication_invalid" && status === 401;
}
/**
* Checks if the provided error object is a captcha error.
*
* @internal
*/
function isCaptchaError(e) {
	return [
		"captcha_invalid",
		"captcha_not_enabled",
		"captcha_missing_token"
	].includes(e.errors[0].code);
}
/**
* Checks if the provided error is a 4xx error.
*
* @internal
*/
function is4xxError(e) {
	const status = e?.status;
	return !!status && status >= 400 && status < 500;
}
/**
* Checks if the provided error is a 429 (Too Many Requests) error.
*
* @internal
*/
function is429Error(e) {
	return e?.status === 429;
}
const unauthenticated403ErrorCodes = new Set(["user_banned", "user_deactivated"]);
/**
* Checks if the provided error indicates the user's session is no longer valid
* and should trigger the unauthenticated flow (e.g. sign-out / redirect to sign-in).
*
* Only matches explicit authentication failure status codes:
* - 401: session is invalid or expired
* - 422: invalid session state (e.g. missing_expired_token)
* - 403: terminal user state (e.g. user_banned, user_deactivated)
*
* 404 is intentionally excluded despite being returned for "session not found",
* because it's also returned for unrelated resources (org not found, JWT template
* not found) and shares the same `resource_not_found` error code, making it
* impossible to distinguish. Session-not-found 401s are already handled directly
* by Base._fetch.
*
* @internal
*/
function isUnauthenticatedError(e) {
	const status = e?.status;
	const hasTerminalUserErrorCode = Array.isArray(e?.errors) && e.errors.some((error) => unauthenticated403ErrorCodes.has(error?.code));
	return status === 401 || status === 422 || status === 403 && hasTerminalUserErrorCode;
}
/**
* Checks if the provided error is a network error.
*
* @internal
*/
function isNetworkError(e) {
	return (`${e.message}${e.name}` || "").toLowerCase().replace(/\s+/g, "").includes("networkerror");
}
/**
* Checks if the provided error is either a ClerkAPIResponseError, a ClerkRuntimeError, or a MetamaskError.
*/
function isKnownError(error) {
	return isClerkAPIResponseError(error) || isMetamaskError(error) || isClerkRuntimeError(error);
}
/**
* Checks if the provided error is a Clerk runtime error indicating a reverification was cancelled.
*/
function isReverificationCancelledError(err) {
	return isClerkRuntimeError(err) && err.code === "reverification_cancelled";
}
/**
* Checks if the provided error is a Metamask error.
*/
function isMetamaskError(err) {
	return "code" in err && [
		4001,
		32602,
		32603
	].includes(err.code) && "message" in err;
}
/**
* Checks if the provided error is clerk api response error indicating a user is locked.
*/
function isUserLockedError(err) {
	return isClerkAPIResponseError(err) && err.errors?.[0]?.code === "user_locked";
}
/**
* Checks if the provided error is a clerk api response error indicating a password was pwned.
*
* @internal
*/
function isPasswordPwnedError(err) {
	return isClerkAPIResponseError(err) && err.errors?.[0]?.code === "form_password_pwned";
}
/**
* Checks if the provided error is a clerk api response error indicating a password was compromised.
*
* @internal
*/
function isPasswordCompromisedError(err) {
	return isClerkAPIResponseError(err) && err.errors?.[0]?.code === "form_password_compromised";
}
/**
* Checks if the provided error is an EmailLinkError.
*/
function isEmailLinkError(err) {
	return err.name === "EmailLinkError";
}

//#endregion
//#region src/errors/globalHookError.ts
/**
* Creates a ClerkGlobalHookError object from a ClerkError instance.
* It's a wrapper for all the different instances of Clerk errors that can
* be returned when using Clerk hooks.
*/
function createClerkGlobalHookError(error) {
	const predicates = {
		isClerkAPIResponseError,
		isClerkRuntimeError
	};
	for (const [name, fn] of Object.entries(predicates)) Object.assign(error, { [name]: fn });
	return error;
}

//#endregion
export { isClerkAPIResponseError as C, ClerkAPIError as D, parseErrors as E, isClerkAPIError as O, ClerkAPIResponseError as S, parseError as T, EmailLinkErrorCode as _, isEmailLinkError as a, ClerkOfflineError as b, isNetworkError as c, isReverificationCancelledError as d, isUnauthenticatedError as f, EmailLinkError as g, ClerkWebAuthnError as h, isCaptchaError as i, isPasswordCompromisedError as l, isUserLockedError as m, is429Error as n, isKnownError as o, isUnauthorizedError as p, is4xxError as r, isMetamaskError as s, createClerkGlobalHookError as t, isPasswordPwnedError as u, EmailLinkErrorCodeStatus as v, errorToJSON as w, MissingExpiredTokenError as x, buildErrorThrower as y };
//# sourceMappingURL=error-BwjsVTI1.mjs.map