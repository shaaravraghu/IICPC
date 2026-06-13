// src/utils.ts
import { isTruthy } from "@clerk/shared/underscore";
import { Readable } from "stream";
var requestHasAuthObject = (req) => {
  return "auth" in req;
};
var loadClientEnv = () => {
  return {
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY || "",
    __internal_clerkJSUrl: process.env.CLERK_JS || process.env.CLERK_JS_URL || "",
    __internal_clerkJSVersion: process.env.CLERK_JS_VERSION || "",
    __internal_clerkUIUrl: process.env.CLERK_UI_URL || "",
    __internal_clerkUIVersion: process.env.CLERK_UI_VERSION || "",
    prefetchUI: process.env.CLERK_PREFETCH_UI === "false" ? false : void 0
  };
};
var loadApiEnv = () => {
  return {
    secretKey: process.env.CLERK_SECRET_KEY || "",
    machineSecretKey: process.env.CLERK_MACHINE_SECRET_KEY || "",
    apiUrl: process.env.CLERK_API_URL || "https://api.clerk.com",
    apiVersion: process.env.CLERK_API_VERSION || "v1",
    domain: process.env.CLERK_DOMAIN || "",
    proxyUrl: process.env.CLERK_PROXY_URL || "",
    signInUrl: process.env.CLERK_SIGN_IN_URL || "",
    isSatellite: isTruthy(process.env.CLERK_IS_SATELLITE),
    jwtKey: process.env.CLERK_JWT_KEY || "",
    sdkMetadata: {
      name: "@clerk/express",
      version: "2.1.22",
      environment: process.env.NODE_ENV
    },
    telemetry: {
      disabled: isTruthy(process.env.CLERK_TELEMETRY_DISABLED),
      debug: isTruthy(process.env.CLERK_TELEMETRY_DEBUG)
    }
  };
};
var incomingMessageToRequest = (req) => {
  const headers = Object.keys(req.headers).reduce((acc, key) => Object.assign(acc, { [key]: req?.headers[key] }), {});
  const protocol = req.connection?.encrypted ? "https" : "http";
  const dummyOriginReqUrl = new URL(req.originalUrl || req.url || "", `${protocol}://clerk-dummy`);
  return new Request(dummyOriginReqUrl, {
    method: req.method,
    headers: new Headers(headers)
  });
};
var requestToProxyRequest = (req) => {
  const headers = new Headers();
  Object.entries(req.headers).forEach(([key, value]) => {
    if (value) {
      headers.set(key, Array.isArray(value) ? value.join(", ") : value);
    }
  });
  const protocol = req.protocol || (req.secure ? "https" : "http");
  const host = req.get("host") || "localhost";
  const url = new URL(req.originalUrl || req.url, `${protocol}://${host}`);
  const hasBody = ["POST", "PUT", "PATCH"].includes(req.method);
  return new Request(url.toString(), {
    method: req.method,
    headers,
    body: hasBody ? Readable.toWeb(req) : void 0,
    // @ts-expect-error - duplex required for streaming bodies but not in all TS definitions
    duplex: hasBody ? "half" : void 0
  });
};

export {
  requestHasAuthObject,
  loadClientEnv,
  loadApiEnv,
  incomingMessageToRequest,
  requestToProxyRequest
};
//# sourceMappingURL=chunk-6PRCMWR4.mjs.map