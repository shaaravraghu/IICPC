import {
  incomingMessageToRequest,
  loadApiEnv,
  loadClientEnv,
  requestHasAuthObject,
  requestToProxyRequest
} from "./chunk-6PRCMWR4.mjs";

// src/index.ts
export * from "@clerk/backend";

// src/clerkClient.ts
import { createClerkClient } from "@clerk/backend";
var clerkClientSingleton = {};
var clerkClient = new Proxy(clerkClientSingleton, {
  get(_target, property) {
    if (property in clerkClientSingleton) {
      return clerkClientSingleton[property];
    }
    const env = { ...loadApiEnv(), ...loadClientEnv() };
    const client = createClerkClient({ ...env, userAgent: `${"@clerk/express"}@${"2.1.22"}` });
    if (env.secretKey) {
      clerkClientSingleton = client;
    }
    return client[property];
  },
  set() {
    return false;
  }
});

// src/authenticateRequest.ts
import { createClerkClient as createClerkClient2 } from "@clerk/backend";
import { AuthStatus, createClerkRequest } from "@clerk/backend/internal";
import { clerkFrontendApiProxy, DEFAULT_PROXY_PATH, stripTrailingSlashes } from "@clerk/backend/proxy";
import { isDevelopmentFromSecretKey } from "@clerk/shared/keys";
import { isHttpOrHttps, isProxyUrlRelative, isValidProxyUrl } from "@clerk/shared/proxy";
import { handleValueOrFn } from "@clerk/shared/utils";
import { Readable } from "stream";

// src/errors.ts
var createErrorMessage = (msg) => {
  return `\u{1F512} Clerk: ${msg.trim()}

  For more info, check out the docs: https://clerk.com/docs,
  or come say hi in our discord server: https://clerk.com/discord
  `;
};
var middlewareRequired = (fnName) => createErrorMessage(`The "clerkMiddleware" should be registered before using "${fnName}".
Example:

import express from 'express';
import { clerkMiddleware } from '@clerk/express';

const app = express();
app.use(clerkMiddleware());
`);
var satelliteAndMissingProxyUrlAndDomain = "Missing domain and proxyUrl. A satellite application needs to specify a domain or a proxyUrl";
var satelliteAndMissingSignInUrl = `
Invalid signInUrl. A satellite application requires a signInUrl for development instances.
Check if signInUrl is missing from your configuration or if it is not an absolute URL.`;

// src/authenticateRequest.ts
var authenticateRequest = (opts) => {
  const { clerkClient: clerkClient2, request, options } = opts;
  const {
    clerkClient: _clerkClient,
    debug: _debug,
    frontendApiProxy: _frontendApiProxy,
    isSatellite: isSatelliteInput,
    domain: domainInput,
    signInUrl: signInUrlInput,
    proxyUrl: proxyUrlInput,
    secretKey: secretKeyInput,
    machineSecretKey: machineSecretKeyInput,
    publishableKey: publishableKeyInput,
    ...restOptions
  } = options || {};
  const clerkRequest = createClerkRequest(incomingMessageToRequest(request));
  const env = { ...loadApiEnv(), ...loadClientEnv() };
  const secretKey = secretKeyInput || env.secretKey;
  const machineSecretKey = machineSecretKeyInput || env.machineSecretKey;
  const publishableKey = publishableKeyInput || env.publishableKey;
  const isSatellite = handleValueOrFn(isSatelliteInput, clerkRequest.clerkUrl, env.isSatellite);
  const domain = handleValueOrFn(domainInput, clerkRequest.clerkUrl) || env.domain;
  const signInUrl = signInUrlInput || env.signInUrl;
  const proxyUrl = absoluteProxyUrl(
    handleValueOrFn(proxyUrlInput, clerkRequest.clerkUrl, env.proxyUrl),
    clerkRequest.clerkUrl.toString()
  );
  if (isSatellite && !proxyUrl && !domain) {
    throw new Error(satelliteAndMissingProxyUrlAndDomain);
  }
  if (isSatellite && !isHttpOrHttps(signInUrl) && isDevelopmentFromSecretKey(secretKey || "")) {
    throw new Error(satelliteAndMissingSignInUrl);
  }
  return clerkClient2.authenticateRequest(clerkRequest, {
    ...restOptions,
    secretKey,
    machineSecretKey,
    publishableKey,
    proxyUrl,
    isSatellite,
    domain,
    signInUrl
  });
};
var setResponseHeaders = (requestState, res) => {
  if (requestState.headers) {
    requestState.headers.forEach((value, key) => res.appendHeader(key, value));
  }
  return setResponseForHandshake(requestState, res);
};
var setResponseForHandshake = (requestState, res) => {
  const hasLocationHeader = requestState.headers.get("location");
  if (hasLocationHeader) {
    res.status(307).end();
    return;
  }
  if (requestState.status === AuthStatus.Handshake) {
    return new Error("Clerk: unexpected handshake without redirect");
  }
  return;
};
var absoluteProxyUrl = (relativeOrAbsoluteUrl, baseUrl) => {
  if (!relativeOrAbsoluteUrl || !isValidProxyUrl(relativeOrAbsoluteUrl) || !isProxyUrlRelative(relativeOrAbsoluteUrl)) {
    return relativeOrAbsoluteUrl;
  }
  return new URL(relativeOrAbsoluteUrl, baseUrl).toString();
};
var resolveDefaultClerkClient = (options) => {
  if (!options.apiUrl && !options.apiVersion) {
    return clerkClient;
  }
  const env = { ...loadApiEnv(), ...loadClientEnv() };
  return createClerkClient2({
    ...env,
    ...options.apiUrl ? { apiUrl: options.apiUrl } : {},
    ...options.apiVersion ? { apiVersion: options.apiVersion } : {},
    userAgent: `${"@clerk/express"}@${"2.1.22"}`
  });
};
var authenticateAndDecorateRequest = (options = {}) => {
  const clerkClient2 = options.clerkClient || resolveDefaultClerkClient(options);
  const frontendApiProxy = options.frontendApiProxy;
  const proxyPath = stripTrailingSlashes(frontendApiProxy?.path ?? DEFAULT_PROXY_PATH) || DEFAULT_PROXY_PATH;
  const middleware = async (request, response, next) => {
    if (request.auth) {
      return next();
    }
    const env = { ...loadApiEnv(), ...loadClientEnv() };
    const publishableKey = options.publishableKey || env.publishableKey;
    const secretKey = options.secretKey || env.secretKey;
    if (frontendApiProxy) {
      const requestUrl = new URL(request.originalUrl || request.url, `http://${request.headers.host}`);
      const isEnabled = typeof frontendApiProxy.enabled === "function" ? frontendApiProxy.enabled(requestUrl) : frontendApiProxy.enabled;
      if (isEnabled && (requestUrl.pathname === proxyPath || requestUrl.pathname.startsWith(proxyPath + "/"))) {
        const proxyRequest = requestToProxyRequest(request);
        const proxyResponse = await clerkFrontendApiProxy(proxyRequest, {
          proxyPath,
          publishableKey,
          secretKey
        });
        response.status(proxyResponse.status);
        proxyResponse.headers.forEach((value, key) => {
          response.setHeader(key, value);
        });
        if (proxyResponse.body) {
          const reader = proxyResponse.body.getReader();
          const stream = new Readable({
            async read() {
              try {
                const { done, value } = await reader.read();
                if (done) {
                  this.push(null);
                } else {
                  this.push(Buffer.from(value));
                }
              } catch (error) {
                this.destroy(error instanceof Error ? error : new Error(String(error)));
              }
            }
          });
          stream.pipe(response);
        } else {
          response.end();
        }
        return;
      }
    }
    let resolvedOptions = options;
    if (frontendApiProxy && !options.proxyUrl) {
      const requestUrl = new URL(request.originalUrl || request.url, `http://${request.headers.host}`);
      const isProxyEnabled = typeof frontendApiProxy.enabled === "function" ? frontendApiProxy.enabled(requestUrl) : frontendApiProxy.enabled;
      if (isProxyEnabled) {
        resolvedOptions = { ...options, proxyUrl: proxyPath };
      }
    }
    try {
      const requestState = await authenticateRequest({
        clerkClient: clerkClient2,
        request,
        options: resolvedOptions
      });
      const err = setResponseHeaders(requestState, response);
      if (err) {
        return next(err);
      }
      if (response.writableEnded) {
        return;
      }
      const auth = (opts) => requestState.toAuth(opts);
      Object.assign(request, { auth });
      next();
    } catch (err) {
      next(err);
    }
  };
  return middleware;
};

// src/clerkMiddleware.ts
var clerkMiddleware = (options = {}) => {
  if (typeof options !== "function") {
    const authMiddleware = authenticateAndDecorateRequest({
      ...options,
      acceptsToken: "any"
    });
    return (request, response, next) => {
      authMiddleware(request, response, next);
    };
  }
  return async (request, response, next) => {
    try {
      const resolvedOptions = await options(request);
      const handler = authenticateAndDecorateRequest({
        ...resolvedOptions,
        acceptsToken: "any"
      });
      handler(request, response, next);
    } catch (err) {
      next(err);
    }
  };
};

// src/getAuth.ts
import { getAuthObjectForAcceptedToken } from "@clerk/backend/internal";
var getAuth = ((req, options) => {
  if (!requestHasAuthObject(req)) {
    throw new Error(middlewareRequired("getAuth"));
  }
  const authObject = req.auth(options);
  return getAuthObjectForAcceptedToken({ authObject, acceptsToken: options?.acceptsToken });
});

// src/requireAuth.ts
import { deprecated } from "@clerk/shared/deprecated";
var requireAuth = (options = {}) => {
  const authMiddleware = authenticateAndDecorateRequest({
    ...options,
    acceptsToken: "any"
  });
  return (request, response, next) => {
    deprecated(
      "requireAuth",
      "Use `clerkMiddleware()` with `getAuth()` instead. `requireAuth` will be removed in the next major version."
    );
    authMiddleware(request, response, (err) => {
      if (err) {
        return next(err);
      }
      const signInUrl = options.signInUrl || process.env.CLERK_SIGN_IN_URL || "/";
      if (!request.auth()?.userId) {
        return response.redirect(signInUrl);
      }
      next();
    });
  };
};
export {
  authenticateRequest,
  clerkClient,
  clerkMiddleware,
  getAuth,
  requireAuth
};
//# sourceMappingURL=index.mjs.map