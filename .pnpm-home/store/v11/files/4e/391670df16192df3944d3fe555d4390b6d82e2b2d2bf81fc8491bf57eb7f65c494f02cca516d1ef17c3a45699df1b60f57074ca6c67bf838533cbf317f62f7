"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/legacy.ts
var legacy_exports = {};
__export(legacy_exports, {
  useSignIn: () => useSignIn,
  useSignUp: () => useSignUp
});
module.exports = __toCommonJS(legacy_exports);

// src/hooks/legacy/useSignIn.ts
var import_react3 = require("@clerk/shared/react");
var import_telemetry = require("@clerk/shared/telemetry");

// src/contexts/IsomorphicClerkContext.tsx
var import_react = require("@clerk/shared/react");
var useIsomorphicClerkContext = import_react.useClerkInstanceContext;

// src/hooks/useAssertWrappedByClerkProvider.ts
var import_react2 = require("@clerk/shared/react");

// src/errors/errorThrower.ts
var import_error = require("@clerk/shared/error");
var errorThrower = (0, import_error.buildErrorThrower)({ packageName: "@clerk/react" });

// src/hooks/useAssertWrappedByClerkProvider.ts
var useAssertWrappedByClerkProvider = (source) => {
  (0, import_react2.useAssertWrappedByClerkProvider)(() => {
    errorThrower.throwMissingClerkProviderError({ source });
  });
};

// src/hooks/legacy/useSignIn.ts
var useSignIn = () => {
  var _a;
  useAssertWrappedByClerkProvider("useSignIn");
  const isomorphicClerk = useIsomorphicClerkContext();
  const client = (0, import_react3.__internal_useClientBase)();
  (_a = isomorphicClerk.telemetry) == null ? void 0 : _a.record((0, import_telemetry.eventMethodCalled)("useSignIn"));
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
var import_react4 = require("@clerk/shared/react");
var import_telemetry2 = require("@clerk/shared/telemetry");
var useSignUp = () => {
  var _a;
  useAssertWrappedByClerkProvider("useSignUp");
  const isomorphicClerk = useIsomorphicClerkContext();
  const client = (0, import_react4.__internal_useClientBase)();
  (_a = isomorphicClerk.telemetry) == null ? void 0 : _a.record((0, import_telemetry2.eventMethodCalled)("useSignUp"));
  if (!client) {
    return { isLoaded: false, signUp: void 0, setActive: void 0 };
  }
  return {
    isLoaded: true,
    signUp: client.signUp,
    setActive: isomorphicClerk.setActive
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useSignIn,
  useSignUp
});
//# sourceMappingURL=legacy.js.map