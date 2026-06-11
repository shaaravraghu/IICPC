import {
  ClerkProvider,
  IS_REACT_SHARED_VARIANT_COMPATIBLE,
  MultisessionAppSupport
} from "./chunk-7QKVPCZK.mjs";
import {
  OAuthConsent,
  incompatibleRoutingWithPathProvidedError,
  noPathProvidedError,
  useDerivedAuth
} from "./chunk-EQJEQXWW.mjs";
import {
  errorThrower,
  setErrorThrowerOptions
} from "./chunk-RQWALB2R.mjs";
import "./chunk-E5QRIS4Z.mjs";

// src/internal.ts
import { useOAuthConsent as useOAuthConsentOriginal } from "@clerk/shared/react";
import { publishableKeyFromHost } from "@clerk/shared/keys";

// src/hooks/useRoutingProps.ts
function useRoutingProps(componentName, props, routingOptions) {
  const path = props.path || (routingOptions == null ? void 0 : routingOptions.path);
  const routing = props.routing || (routingOptions == null ? void 0 : routingOptions.routing) || "path";
  if (routing === "path") {
    if (!path) {
      return errorThrower.throw(noPathProvidedError(componentName));
    }
    return {
      ...routingOptions,
      ...props,
      routing: "path"
    };
  }
  if (props.path) {
    return errorThrower.throw(incompatibleRoutingWithPathProvidedError(componentName));
  }
  return {
    ...routingOptions,
    ...props,
    path: void 0
  };
}

// src/internal.ts
import {
  clerkJSScriptUrl,
  buildClerkJSScriptAttributes,
  clerkUIScriptUrl,
  buildClerkUIScriptAttributes,
  setClerkJSLoadingErrorPackageName,
  clerkJsScriptUrl,
  buildClerkJsScriptAttributes,
  setClerkJsLoadingErrorPackageName
} from "@clerk/shared/loadClerkJsScript";
var useOAuthConsent = useOAuthConsentOriginal;
var OAuthConsent2 = OAuthConsent;
var InternalClerkProvider = ClerkProvider;
export {
  IS_REACT_SHARED_VARIANT_COMPATIBLE,
  InternalClerkProvider,
  MultisessionAppSupport,
  OAuthConsent2 as OAuthConsent,
  buildClerkJSScriptAttributes,
  buildClerkJsScriptAttributes,
  buildClerkUIScriptAttributes,
  clerkJSScriptUrl,
  clerkJsScriptUrl,
  clerkUIScriptUrl,
  publishableKeyFromHost,
  setClerkJSLoadingErrorPackageName,
  setClerkJsLoadingErrorPackageName,
  setErrorThrowerOptions,
  useDerivedAuth,
  useOAuthConsent,
  useRoutingProps
};
//# sourceMappingURL=internal.mjs.map