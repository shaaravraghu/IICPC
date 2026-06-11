
//#region src/internal/clerk-js/errors.ts
const errorPrefix = "ClerkJS:";
/**
*
*/
function clerkErrorPathRouterMissingPath(componentName) {
	throw new Error(`${errorPrefix} Missing path option. The ${componentName} component was mounted with path routing so you need to specify the path where the component is mounted on e.g. path="/sign-in".`);
}
/**
*
*/
function clerkInvalidRoutingStrategy(strategy) {
	throw new Error(`${errorPrefix} Invalid routing strategy, path cannot be used in tandem with ${strategy}.`);
}
/**
*
*/
function clerkCoreErrorNoClerkSingleton() {
	throw new Error(`${errorPrefix} Clerk instance not found. Make sure Clerk is initialized before using any Clerk components.`);
}
/**
*
*/
function clerkCoreErrorContextProviderNotFound(providerName) {
	throw new Error(`${errorPrefix} ${providerName} not found. Make sure you wrap your app with <${providerName}>.`);
}
/**
*
*/
function clerkUIErrorDOMElementNotFound() {
	throw new Error(`${errorPrefix} The target element is empty. Provide a valid DOM element.`);
}
/**
* Used to log a warning when a Clerk feature is used in an unsupported environment.
* (Development Only)
* This is a warning and not an error because the application will still work, but the feature will not be available.
*
* @param strategy - The strategy that is not supported in the current environment.
* @returns void
*/
function clerkUnsupportedEnvironmentWarning(strategy) {
	console.warn(`${errorPrefix} ${strategy} is not supported in this environment.`);
}
/**
*
*/
function clerkNetworkError(url, e) {
	throw new Error(`${errorPrefix} Network error at "${url}" - ${e}. Please try again.`);
}
/**
*
*/
function clerkErrorInitFailed() {
	throw new Error(`${errorPrefix} Something went wrong initializing Clerk.`);
}
/**
*
*/
function clerkErrorDevInitFailed(msg = "") {
	throw new Error(`${errorPrefix} Something went wrong initializing Clerk in development mode.${msg && ` ${msg}`}`);
}
/**
*
*/
function clerkMissingFapiClientInResources() {
	throw new Error(`${errorPrefix} Missing FAPI client in resources.`);
}
/**
*
*/
function clerkOAuthCallbackDidNotCompleteSignInSignUp(type) {
	throw new Error(`${errorPrefix} Something went wrong initializing Clerk during the ${type} flow. Please contact support.`);
}
/**
*
*/
function clerkVerifyEmailAddressCalledBeforeCreate(type) {
	throw new Error(`${errorPrefix} You need to start a ${type} flow by calling ${type}.create() first.`);
}
/**
*
*/
function clerkInvalidStrategy(functionaName, strategy) {
	throw new Error(`${errorPrefix} Strategy "${strategy}" is not a valid strategy for ${functionaName}.`);
}
/**
*
*/
function clerkVerifyWeb3WalletCalledBeforeCreate(type) {
	throw new Error(`${errorPrefix} You need to start a ${type} flow by calling ${type}.create({ identifier: 'your web3 wallet address' }) first`);
}
/**
*
*/
function clerkVerifyPasskeyCalledBeforeCreate() {
	throw new Error(`${errorPrefix} You need to start a SignIn flow by calling SignIn.create({ strategy: 'passkey' }) first`);
}
/**
*
*/
function clerkMissingOptionError(name = "") {
	throw new Error(`${errorPrefix} Missing '${name}' option`);
}
/**
*
*/
function clerkInvalidFAPIResponse(status, supportEmail) {
	throw new Error(`${errorPrefix} Response: ${status || 0} not supported yet.\nFor more information contact us at ${supportEmail}`);
}
/**
*
*/
function clerkMissingDevBrowser() {
	throw new Error(`${errorPrefix} Missing dev browser. Please contact support.`);
}
/**
*
*/
function clerkMissingProxyUrlAndDomain() {
	throw new Error(`${errorPrefix} Missing domain and proxyUrl. A satellite application needs to specify a domain or a proxyUrl.`);
}
/**
*
*/
function clerkInvalidSignInUrlOrigin() {
	throw new Error(`${errorPrefix} The signInUrl needs to be on a different origin than your satellite application.`);
}
/**
*
*/
function clerkInvalidSignInUrlFormat() {
	throw new Error(`${errorPrefix} The signInUrl needs to have a absolute url format.`);
}
/**
*
*/
function clerkMissingSignInUrlAsSatellite() {
	throw new Error(`${errorPrefix} Missing signInUrl. A satellite application needs to specify the signInUrl for development instances.`);
}
/**
*
*/
function clerkRedirectUrlIsMissingScheme() {
	throw new Error(`${errorPrefix} Invalid redirect_url. A valid http or https url should be used for the redirection.`);
}
/**
*
*/
function clerkFailedToLoadThirdPartyScript(name) {
	throw new Error(`${errorPrefix} Unable to retrieve a third party script${name ? ` ${name}` : ""}.`);
}
/**
*
*/
function clerkUnsupportedReloadMethod(className) {
	throw new Error(`${errorPrefix} Calling ${className}.reload is not currently supported. Please contact support.`);
}
/**
*
*/
function clerkMissingWebAuthnPublicKeyOptions(name) {
	throw new Error(`${errorPrefix} Missing publicKey. When calling 'navigator.credentials.${name}()' it is required to pass a publicKey object.`);
}

//#endregion
Object.defineProperty(exports, 'clerkCoreErrorContextProviderNotFound', {
  enumerable: true,
  get: function () {
    return clerkCoreErrorContextProviderNotFound;
  }
});
Object.defineProperty(exports, 'clerkCoreErrorNoClerkSingleton', {
  enumerable: true,
  get: function () {
    return clerkCoreErrorNoClerkSingleton;
  }
});
Object.defineProperty(exports, 'clerkErrorDevInitFailed', {
  enumerable: true,
  get: function () {
    return clerkErrorDevInitFailed;
  }
});
Object.defineProperty(exports, 'clerkErrorInitFailed', {
  enumerable: true,
  get: function () {
    return clerkErrorInitFailed;
  }
});
Object.defineProperty(exports, 'clerkErrorPathRouterMissingPath', {
  enumerable: true,
  get: function () {
    return clerkErrorPathRouterMissingPath;
  }
});
Object.defineProperty(exports, 'clerkFailedToLoadThirdPartyScript', {
  enumerable: true,
  get: function () {
    return clerkFailedToLoadThirdPartyScript;
  }
});
Object.defineProperty(exports, 'clerkInvalidFAPIResponse', {
  enumerable: true,
  get: function () {
    return clerkInvalidFAPIResponse;
  }
});
Object.defineProperty(exports, 'clerkInvalidRoutingStrategy', {
  enumerable: true,
  get: function () {
    return clerkInvalidRoutingStrategy;
  }
});
Object.defineProperty(exports, 'clerkInvalidSignInUrlFormat', {
  enumerable: true,
  get: function () {
    return clerkInvalidSignInUrlFormat;
  }
});
Object.defineProperty(exports, 'clerkInvalidSignInUrlOrigin', {
  enumerable: true,
  get: function () {
    return clerkInvalidSignInUrlOrigin;
  }
});
Object.defineProperty(exports, 'clerkInvalidStrategy', {
  enumerable: true,
  get: function () {
    return clerkInvalidStrategy;
  }
});
Object.defineProperty(exports, 'clerkMissingDevBrowser', {
  enumerable: true,
  get: function () {
    return clerkMissingDevBrowser;
  }
});
Object.defineProperty(exports, 'clerkMissingFapiClientInResources', {
  enumerable: true,
  get: function () {
    return clerkMissingFapiClientInResources;
  }
});
Object.defineProperty(exports, 'clerkMissingOptionError', {
  enumerable: true,
  get: function () {
    return clerkMissingOptionError;
  }
});
Object.defineProperty(exports, 'clerkMissingProxyUrlAndDomain', {
  enumerable: true,
  get: function () {
    return clerkMissingProxyUrlAndDomain;
  }
});
Object.defineProperty(exports, 'clerkMissingSignInUrlAsSatellite', {
  enumerable: true,
  get: function () {
    return clerkMissingSignInUrlAsSatellite;
  }
});
Object.defineProperty(exports, 'clerkMissingWebAuthnPublicKeyOptions', {
  enumerable: true,
  get: function () {
    return clerkMissingWebAuthnPublicKeyOptions;
  }
});
Object.defineProperty(exports, 'clerkNetworkError', {
  enumerable: true,
  get: function () {
    return clerkNetworkError;
  }
});
Object.defineProperty(exports, 'clerkOAuthCallbackDidNotCompleteSignInSignUp', {
  enumerable: true,
  get: function () {
    return clerkOAuthCallbackDidNotCompleteSignInSignUp;
  }
});
Object.defineProperty(exports, 'clerkRedirectUrlIsMissingScheme', {
  enumerable: true,
  get: function () {
    return clerkRedirectUrlIsMissingScheme;
  }
});
Object.defineProperty(exports, 'clerkUIErrorDOMElementNotFound', {
  enumerable: true,
  get: function () {
    return clerkUIErrorDOMElementNotFound;
  }
});
Object.defineProperty(exports, 'clerkUnsupportedEnvironmentWarning', {
  enumerable: true,
  get: function () {
    return clerkUnsupportedEnvironmentWarning;
  }
});
Object.defineProperty(exports, 'clerkUnsupportedReloadMethod', {
  enumerable: true,
  get: function () {
    return clerkUnsupportedReloadMethod;
  }
});
Object.defineProperty(exports, 'clerkVerifyEmailAddressCalledBeforeCreate', {
  enumerable: true,
  get: function () {
    return clerkVerifyEmailAddressCalledBeforeCreate;
  }
});
Object.defineProperty(exports, 'clerkVerifyPasskeyCalledBeforeCreate', {
  enumerable: true,
  get: function () {
    return clerkVerifyPasskeyCalledBeforeCreate;
  }
});
Object.defineProperty(exports, 'clerkVerifyWeb3WalletCalledBeforeCreate', {
  enumerable: true,
  get: function () {
    return clerkVerifyWeb3WalletCalledBeforeCreate;
  }
});
//# sourceMappingURL=errors-FAXDzRsM.js.map