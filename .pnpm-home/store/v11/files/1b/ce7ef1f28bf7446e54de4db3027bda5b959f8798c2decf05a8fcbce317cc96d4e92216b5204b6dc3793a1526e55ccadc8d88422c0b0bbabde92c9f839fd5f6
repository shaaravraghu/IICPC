import {
  createAuthenticateRequest,
  createBackendApiClient,
  verifyToken
} from "./chunk-COVYMSO6.mjs";
import "./chunk-YBVFDYDR.mjs";
import {
  withLegacyReturn
} from "./chunk-P263NW7Z.mjs";
import "./chunk-J2CDX2WG.mjs";
import "./chunk-RZ7A7F6X.mjs";
import "./chunk-TOROEX6P.mjs";

// src/index.ts
import { TelemetryCollector } from "@clerk/shared/telemetry";
var verifyToken2 = withLegacyReturn(verifyToken);
function createClerkClient(options) {
  const opts = { ...options };
  const apiClient = createBackendApiClient(opts);
  const requestState = createAuthenticateRequest({ options: opts, apiClient });
  const telemetry = new TelemetryCollector({
    publishableKey: opts.publishableKey,
    secretKey: opts.secretKey,
    samplingRate: 0.1,
    ...opts.sdkMetadata ? { sdk: opts.sdkMetadata.name, sdkVersion: opts.sdkMetadata.version } : {},
    ...opts.telemetry || {}
  });
  return {
    ...apiClient,
    ...requestState,
    telemetry
  };
}
export {
  createClerkClient,
  verifyToken2 as verifyToken
};
//# sourceMappingURL=index.mjs.map