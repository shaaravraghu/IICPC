// src/errors/errorThrower.ts
import { buildErrorThrower } from "@clerk/shared/error";
var errorThrower = buildErrorThrower({ packageName: "@clerk/react" });
function setErrorThrowerOptions(options) {
  errorThrower.setMessages(options).setPackageName(options);
}

// src/contexts/IsomorphicClerkContext.tsx
import { useClerkInstanceContext } from "@clerk/shared/react";
var useIsomorphicClerkContext = useClerkInstanceContext;

// src/hooks/useAssertWrappedByClerkProvider.ts
import { useAssertWrappedByClerkProvider as useSharedAssertWrappedByClerkProvider } from "@clerk/shared/react";
var useAssertWrappedByClerkProvider = (source) => {
  useSharedAssertWrappedByClerkProvider(() => {
    errorThrower.throwMissingClerkProviderError({ source });
  });
};

export {
  errorThrower,
  setErrorThrowerOptions,
  useIsomorphicClerkContext,
  useAssertWrappedByClerkProvider
};
//# sourceMappingURL=chunk-RQWALB2R.mjs.map