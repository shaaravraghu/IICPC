import "./chunk-TOROEX6P.mjs";

// src/proxy.ts
import {
  DEFAULT_PROXY_PATH,
  LEGACY_DEV_INSTANCE_SUFFIXES,
  LOCAL_ENV_SUFFIXES,
  LOCAL_FAPI_URL,
  PROD_FAPI_URL,
  STAGING_ENV_SUFFIXES,
  STAGING_FAPI_URL
} from "@clerk/shared/constants";
import { parsePublishableKey } from "@clerk/shared/keys";
import { DEFAULT_PROXY_PATH as DEFAULT_PROXY_PATH2 } from "@clerk/shared/constants";
var HOP_BY_HOP_HEADERS = /* @__PURE__ */ new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade"
]);
function getDynamicHopByHopHeaders(headers) {
  const connectionValue = headers.get("connection");
  if (!connectionValue) {
    return /* @__PURE__ */ new Set();
  }
  return new Set(
    connectionValue.split(",").map((h) => h.trim().toLowerCase()).filter((h) => h.length > 0)
  );
}
var RESPONSE_HEADERS_TO_STRIP = /* @__PURE__ */ new Set(["content-encoding", "content-length"]);
function fapiUrlFromPublishableKey(publishableKey) {
  const frontendApi = parsePublishableKey(publishableKey)?.frontendApi;
  if (frontendApi?.startsWith("clerk.") && LEGACY_DEV_INSTANCE_SUFFIXES.some((suffix) => frontendApi?.endsWith(suffix))) {
    return PROD_FAPI_URL;
  }
  if (LOCAL_ENV_SUFFIXES.some((suffix) => frontendApi?.endsWith(suffix))) {
    return LOCAL_FAPI_URL;
  }
  if (STAGING_ENV_SUFFIXES.some((suffix) => frontendApi?.endsWith(suffix))) {
    return STAGING_FAPI_URL;
  }
  return PROD_FAPI_URL;
}
function stripTrailingSlashes(str) {
  while (str.endsWith("/")) {
    str = str.slice(0, -1);
  }
  return str;
}
function matchProxyPath(request, options) {
  const proxyPath = stripTrailingSlashes(options?.proxyPath || DEFAULT_PROXY_PATH);
  const url = new URL(request.url);
  return url.pathname === proxyPath || url.pathname.startsWith(proxyPath + "/");
}
function createErrorResponse(code, message, status) {
  const error = { code, message };
  return new Response(JSON.stringify({ errors: [error] }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}
function derivePublicOrigin(request, requestUrl) {
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  return requestUrl.origin;
}
function getClientIp(request) {
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp;
  }
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0]?.trim();
  }
  return void 0;
}
async function clerkFrontendApiProxy(request, options) {
  const proxyPath = stripTrailingSlashes(options?.proxyPath || DEFAULT_PROXY_PATH);
  const publishableKey = options?.publishableKey || (typeof process !== "undefined" ? process.env?.CLERK_PUBLISHABLE_KEY : void 0);
  const secretKey = options?.secretKey || (typeof process !== "undefined" ? process.env?.CLERK_SECRET_KEY : void 0);
  if (!publishableKey) {
    return createErrorResponse(
      "proxy_configuration_error",
      "Missing publishableKey. Provide it in options or set CLERK_PUBLISHABLE_KEY environment variable.",
      500
    );
  }
  if (!secretKey) {
    return createErrorResponse(
      "proxy_configuration_error",
      "Missing secretKey. Provide it in options or set CLERK_SECRET_KEY environment variable.",
      500
    );
  }
  const requestUrl = new URL(request.url);
  const pathMatches = requestUrl.pathname === proxyPath || requestUrl.pathname.startsWith(proxyPath + "/");
  if (!pathMatches) {
    return createErrorResponse(
      "proxy_path_mismatch",
      `Request path "${requestUrl.pathname}" does not match proxy path "${proxyPath}"`,
      400
    );
  }
  const fapiBaseUrl = fapiUrlFromPublishableKey(publishableKey);
  const fapiHost = new URL(fapiBaseUrl).host;
  const targetPath = requestUrl.pathname.slice(proxyPath.length) || "/";
  const targetUrl = new URL(`${fapiBaseUrl}${targetPath}`);
  targetUrl.search = requestUrl.search;
  if (targetUrl.host !== fapiHost) {
    return createErrorResponse("proxy_request_failed", "Resolved target does not match the expected host", 400);
  }
  const headers = new Headers();
  const dynamicHopByHop = getDynamicHopByHopHeaders(request.headers);
  request.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (!HOP_BY_HOP_HEADERS.has(lower) && !dynamicHopByHop.has(lower)) {
      headers.set(key, value);
    }
  });
  const publicOrigin = derivePublicOrigin(request, requestUrl);
  const proxyUrl = `${publicOrigin}${proxyPath}`;
  headers.set("Clerk-Proxy-Url", proxyUrl);
  headers.set("Clerk-Secret-Key", secretKey);
  headers.set("Host", fapiHost);
  headers.set("Accept-Encoding", "identity");
  if (!headers.has("X-Forwarded-Host")) {
    headers.set("X-Forwarded-Host", requestUrl.host);
  }
  if (!headers.has("X-Forwarded-Proto")) {
    headers.set("X-Forwarded-Proto", requestUrl.protocol.replace(":", ""));
  }
  const clientIp = getClientIp(request);
  if (clientIp) {
    headers.set("X-Forwarded-For", clientIp);
  }
  const hasBody = request.body !== null;
  try {
    const fetchOptions = {
      method: request.method,
      headers,
      redirect: "manual"
    };
    if (hasBody) {
      fetchOptions.duplex = "half";
      fetchOptions.body = request.body;
    }
    const response = await fetch(targetUrl.toString(), fetchOptions);
    const responseDynamicHopByHop = getDynamicHopByHopHeaders(response.headers);
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (!HOP_BY_HOP_HEADERS.has(lower) && !RESPONSE_HEADERS_TO_STRIP.has(lower) && !responseDynamicHopByHop.has(lower)) {
        if (lower === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    });
    const locationHeader = response.headers.get("location");
    if (locationHeader) {
      try {
        const locationUrl = new URL(locationHeader, fapiBaseUrl);
        if (locationUrl.host === fapiHost) {
          const rewrittenLocation = `${proxyUrl}${locationUrl.pathname}${locationUrl.search}${locationUrl.hash}`;
          responseHeaders.set("Location", rewrittenLocation);
        }
      } catch {
      }
    }
    const proxyResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
    for (const header of RESPONSE_HEADERS_TO_STRIP) {
      proxyResponse.headers.delete(header);
    }
    return proxyResponse;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return createErrorResponse("proxy_request_failed", `Failed to proxy request to Clerk FAPI: ${message}`, 502);
  }
}
export {
  DEFAULT_PROXY_PATH2 as DEFAULT_PROXY_PATH,
  clerkFrontendApiProxy,
  fapiUrlFromPublishableKey,
  matchProxyPath,
  stripTrailingSlashes
};
//# sourceMappingURL=proxy.mjs.map