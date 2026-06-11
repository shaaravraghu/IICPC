import {
  useAssertWrappedByClerkProvider,
  useIsomorphicClerkContext
} from "./chunk-RQWALB2R.mjs";
import "./chunk-E5QRIS4Z.mjs";

// src/hooks/legacy/useSignIn.ts
import { __internal_useClientBase } from "@clerk/shared/react";
import { eventMethodCalled } from "@clerk/shared/telemetry";
var useSignIn = () => {
  var _a;
  useAssertWrappedByClerkProvider("useSignIn");
  const isomorphicClerk = useIsomorphicClerkContext();
  const client = __internal_useClientBase();
  (_a = isomorphicClerk.telemetry) == null ? void 0 : _a.record(eventMethodCalled("useSignIn"));
  if (!client) {
    return { isLoaded: false, signIn: void 0, setActive: void 0 };
  }
  return {
    isLoaded: true,
    signIn: client.signIn,
    setActive: isomorphicClerk.setActive
  };
};

// src/hooks/legacy/useSignUp.ts
import { __internal_useClientBase as __internal_useClientBase2 } from "@clerk/shared/react";
import { eventMethodCalled as eventMethodCalled2 } from "@clerk/shared/telemetry";
var useSignUp = () => {
  var _a;
  useAssertWrappedByClerkProvider("useSignUp");
  const isomorphicClerk = useIsomorphicClerkContext();
  const client = __internal_useClientBase2();
  (_a = isomorphicClerk.telemetry) == null ? void 0 : _a.record(eventMethodCalled2("useSignUp"));
  if (!client) {
    return { isLoaded: false, signUp: void 0, setActive: void 0 };
  }
  return {
    isLoaded: true,
    signUp: client.signUp,
    setActive: isomorphicClerk.setActive
  };
};
export {
  useSignIn,
  useSignUp
};
//# sourceMappingURL=legacy.mjs.map