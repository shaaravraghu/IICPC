import {
  isConstructor,
  mergeWithEnv,
  multipleClerkProvidersError,
  unsupportedNonBrowserDomainOrProxyUrlFunction,
  useAuth,
  withClerk,
  withMaxAllowedInstancesGuard
} from "./chunk-EQJEQXWW.mjs";
import {
  errorThrower,
  useAssertWrappedByClerkProvider,
  useIsomorphicClerkContext
} from "./chunk-RQWALB2R.mjs";
import {
  __privateAdd,
  __privateGet,
  __privateMethod,
  __privateSet,
  define_CLERK_UI_SUPPORTED_REACT_BOUNDS_default
} from "./chunk-E5QRIS4Z.mjs";

// src/components/controlComponents.tsx
import { deprecated } from "@clerk/shared/deprecated";
import { __internal_useSessionBase } from "@clerk/shared/react";
import React from "react";
var ClerkLoaded = ({ children }) => {
  useAssertWrappedByClerkProvider("ClerkLoaded");
  const isomorphicClerk = useIsomorphicClerkContext();
  if (!isomorphicClerk.loaded) {
    return null;
  }
  return children;
};
var ClerkLoading = ({ children }) => {
  useAssertWrappedByClerkProvider("ClerkLoading");
  const isomorphicClerk = useIsomorphicClerkContext();
  if (isomorphicClerk.status !== "loading") {
    return null;
  }
  return children;
};
var ClerkFailed = ({ children }) => {
  useAssertWrappedByClerkProvider("ClerkFailed");
  const isomorphicClerk = useIsomorphicClerkContext();
  if (isomorphicClerk.status !== "error") {
    return null;
  }
  return children;
};
var ClerkDegraded = ({ children }) => {
  useAssertWrappedByClerkProvider("ClerkDegraded");
  const isomorphicClerk = useIsomorphicClerkContext();
  if (isomorphicClerk.status !== "degraded") {
    return null;
  }
  return children;
};
var Show = ({ children, fallback, treatPendingAsSignedOut, when }) => {
  useAssertWrappedByClerkProvider("Show");
  const { has, isLoaded, userId } = useAuth({ treatPendingAsSignedOut });
  if (!isLoaded) {
    return null;
  }
  const resolvedWhen = when;
  const authorized = children;
  const unauthorized = fallback != null ? fallback : null;
  if (resolvedWhen === "signed-out") {
    return userId ? unauthorized : authorized;
  }
  if (!userId) {
    return unauthorized;
  }
  if (resolvedWhen === "signed-in") {
    return authorized;
  }
  if (checkAuthorization(resolvedWhen, has)) {
    return authorized;
  }
  return unauthorized;
};
function checkAuthorization(when, has) {
  if (typeof when === "function") {
    return when(has);
  }
  return has(when);
}
var RedirectToSignIn = withClerk(({ clerk, ...props }) => {
  var _a, _b;
  const { client, session } = clerk;
  const hasSignedInSessions = ((_b = (_a = client.signedInSessions) == null ? void 0 : _a.length) != null ? _b : 0) > 0;
  React.useEffect(() => {
    if (session === null && hasSignedInSessions) {
      void clerk.redirectToAfterSignOut();
    } else {
      void clerk.redirectToSignIn(props);
    }
  }, []);
  return null;
}, "RedirectToSignIn");
var RedirectToSignUp = withClerk(({ clerk, ...props }) => {
  React.useEffect(() => {
    void clerk.redirectToSignUp(props);
  }, []);
  return null;
}, "RedirectToSignUp");
var RedirectToTasks = withClerk(({ clerk, ...props }) => {
  React.useEffect(() => {
    void clerk.redirectToTasks(props);
  }, []);
  return null;
}, "RedirectToTasks");
var RedirectToUserProfile = withClerk(({ clerk }) => {
  React.useEffect(() => {
    deprecated("RedirectToUserProfile", "Use the `redirectToUserProfile()` method instead.");
    void clerk.redirectToUserProfile();
  }, []);
  return null;
}, "RedirectToUserProfile");
var RedirectToOrganizationProfile = withClerk(({ clerk }) => {
  React.useEffect(() => {
    deprecated("RedirectToOrganizationProfile", "Use the `redirectToOrganizationProfile()` method instead.");
    void clerk.redirectToOrganizationProfile();
  }, []);
  return null;
}, "RedirectToOrganizationProfile");
var RedirectToCreateOrganization = withClerk(({ clerk }) => {
  React.useEffect(() => {
    deprecated("RedirectToCreateOrganization", "Use the `redirectToCreateOrganization()` method instead.");
    void clerk.redirectToCreateOrganization();
  }, []);
  return null;
}, "RedirectToCreateOrganization");
var AuthenticateWithRedirectCallback = withClerk(
  ({ clerk, ...handleRedirectCallbackParams }) => {
    React.useEffect(() => {
      void clerk.handleRedirectCallback(handleRedirectCallbackParams);
    }, []);
    return null;
  },
  "AuthenticateWithRedirectCallback"
);
var MultisessionAppSupport = ({ children }) => {
  useAssertWrappedByClerkProvider("MultisessionAppSupport");
  const session = __internal_useSessionBase();
  return /* @__PURE__ */ React.createElement(React.Fragment, { key: session ? session.id : "no-users" }, children);
};

// src/utils/versionCheck.ts
import { isVersionCompatible } from "@clerk/shared/versionCheck";
import React2 from "react";
import {
  checkVersionAgainstBounds,
  isVersionCompatible as isVersionCompatible2,
  parseVersion
} from "@clerk/shared/versionCheck";
function computeReactVersionCompatibility() {
  try {
    return isVersionCompatible(React2.version, define_CLERK_UI_SUPPORTED_REACT_BOUNDS_default);
  } catch {
    return false;
  }
}
var IS_REACT_SHARED_VARIANT_COMPATIBLE = computeReactVersionCompatibility();

// src/contexts/ClerkProvider.tsx
import { ClerkContextProvider } from "@clerk/shared/react";
import React3 from "react";

// src/isomorphicClerk.ts
import { inBrowser as inBrowser2 } from "@clerk/shared/browser";
import { clerkEvents, createClerkEventBus } from "@clerk/shared/clerkEventBus";
import { loadClerkJSScript, loadClerkUIScript } from "@clerk/shared/loadClerkJsScript";
import { handleValueOrFn } from "@clerk/shared/utils";

// src/stateProxy.ts
import { inBrowser } from "@clerk/shared/browser";
var defaultSignInErrors = () => ({
  fields: {
    identifier: null,
    password: null,
    code: null
  },
  raw: null,
  global: null
});
var defaultSignUpErrors = () => ({
  fields: {
    firstName: null,
    lastName: null,
    emailAddress: null,
    phoneNumber: null,
    password: null,
    username: null,
    code: null,
    captcha: null,
    legalAccepted: null
  },
  raw: null,
  global: null
});
var defaultWaitlistErrors = () => ({
  fields: {
    emailAddress: null
  },
  raw: null,
  global: null
});
var defaultVerificationResource = () => ({
  pathRoot: "",
  attempts: null,
  error: null,
  expireAt: null,
  externalVerificationRedirectURL: null,
  nonce: null,
  message: null,
  status: null,
  strategy: null,
  verifiedAtClient: null,
  verifiedFromTheSameClient() {
    return false;
  },
  reload() {
    throw new Error("reload() called before Clerk is loaded");
  },
  __internal_toSnapshot() {
    return {
      object: "verification",
      id: "",
      attempts: null,
      error: { code: "", message: "" },
      expire_at: null,
      externalVerificationRedirectURL: null,
      nonce: null,
      message: null,
      status: null,
      strategy: null,
      verified_at_client: null
    };
  }
});
var defaultSignUpVerificationResource = () => ({
  ...defaultVerificationResource(),
  supportedStrategies: [],
  nextAction: "",
  reload() {
    throw new Error("reload() called before Clerk is loaded");
  },
  __internal_toSnapshot() {
    return {
      ...defaultVerificationResource().__internal_toSnapshot(),
      next_action: this.nextAction,
      supported_strategies: this.supportedStrategies
    };
  }
});
var StateProxy = class {
  constructor(isomorphicClerk) {
    this.isomorphicClerk = isomorphicClerk;
    this.signInSignalProxy = this.buildSignInProxy();
    this.signUpSignalProxy = this.buildSignUpProxy();
    this.waitlistSignalProxy = this.buildWaitlistProxy();
  }
  signInSignal() {
    return this.signInSignalProxy;
  }
  signUpSignal() {
    return this.signUpSignalProxy;
  }
  waitlistSignal() {
    return this.waitlistSignalProxy;
  }
  get __internal_waitlist() {
    return this.state.__internal_waitlist;
  }
  checkoutSignal(params) {
    return this.buildCheckoutProxy(params);
  }
  buildSignInProxy() {
    const gateProperty = this.gateProperty.bind(this);
    const target = () => this.client.signIn.__internal_future;
    return {
      errors: defaultSignInErrors(),
      fetchStatus: "idle",
      signIn: {
        status: "needs_identifier",
        availableStrategies: [],
        get isTransferable() {
          return gateProperty(target, "isTransferable", false);
        },
        get id() {
          return gateProperty(target, "id", void 0);
        },
        get supportedFirstFactors() {
          return gateProperty(target, "supportedFirstFactors", []);
        },
        get supportedSecondFactors() {
          return gateProperty(target, "supportedSecondFactors", []);
        },
        get secondFactorVerification() {
          return gateProperty(target, "secondFactorVerification", {
            status: null,
            error: null,
            expireAt: null,
            externalVerificationRedirectURL: null,
            nonce: null,
            attempts: null,
            message: null,
            strategy: null,
            verifiedAtClient: null,
            verifiedFromTheSameClient: () => false,
            __internal_toSnapshot: () => {
              throw new Error("__internal_toSnapshot called before Clerk is loaded");
            },
            pathRoot: "",
            reload: () => {
              throw new Error("__internal_toSnapshot called before Clerk is loaded");
            }
          });
        },
        get identifier() {
          return gateProperty(target, "identifier", null);
        },
        get createdSessionId() {
          return gateProperty(target, "createdSessionId", null);
        },
        get userData() {
          return gateProperty(target, "userData", {});
        },
        get firstFactorVerification() {
          return gateProperty(target, "firstFactorVerification", {
            status: null,
            error: null,
            expireAt: null,
            externalVerificationRedirectURL: null,
            nonce: null,
            attempts: null,
            message: null,
            strategy: null,
            verifiedAtClient: null,
            verifiedFromTheSameClient: () => false,
            __internal_toSnapshot: () => {
              throw new Error("__internal_toSnapshot called before Clerk is loaded");
            },
            pathRoot: "",
            reload: () => {
              throw new Error("__internal_toSnapshot called before Clerk is loaded");
            }
          });
        },
        get canBeDiscarded() {
          return gateProperty(target, "canBeDiscarded", false);
        },
        create: this.gateMethod(target, "create"),
        password: this.gateMethod(target, "password"),
        sso: this.gateMethod(target, "sso"),
        finalize: this.gateMethod(target, "finalize"),
        reset: this.gateMethod(target, "reset"),
        emailCode: this.wrapMethods(() => target().emailCode, ["sendCode", "verifyCode"]),
        emailLink: this.wrapStruct(
          () => target().emailLink,
          ["sendLink", "waitForVerification"],
          ["verification"],
          { verification: null }
        ),
        resetPasswordEmailCode: this.wrapMethods(() => target().resetPasswordEmailCode, [
          "sendCode",
          "verifyCode",
          "submitPassword"
        ]),
        resetPasswordPhoneCode: this.wrapMethods(() => target().resetPasswordPhoneCode, [
          "sendCode",
          "verifyCode",
          "submitPassword"
        ]),
        phoneCode: this.wrapMethods(() => target().phoneCode, ["sendCode", "verifyCode"]),
        mfa: this.wrapMethods(() => target().mfa, [
          "sendPhoneCode",
          "verifyPhoneCode",
          "sendEmailCode",
          "verifyEmailCode",
          "verifyTOTP",
          "verifyBackupCode"
        ]),
        ticket: this.gateMethod(target, "ticket"),
        passkey: this.gateMethod(target, "passkey"),
        web3: this.gateMethod(target, "web3")
      }
    };
  }
  buildSignUpProxy() {
    const gateProperty = this.gateProperty.bind(this);
    const gateMethod = this.gateMethod.bind(this);
    const target = () => this.client.signUp.__internal_future;
    return {
      errors: defaultSignUpErrors(),
      fetchStatus: "idle",
      signUp: {
        get id() {
          return gateProperty(target, "id", void 0);
        },
        get requiredFields() {
          return gateProperty(target, "requiredFields", []);
        },
        get optionalFields() {
          return gateProperty(target, "optionalFields", []);
        },
        get missingFields() {
          return gateProperty(target, "missingFields", []);
        },
        get username() {
          return gateProperty(target, "username", null);
        },
        get firstName() {
          return gateProperty(target, "firstName", null);
        },
        get lastName() {
          return gateProperty(target, "lastName", null);
        },
        get emailAddress() {
          return gateProperty(target, "emailAddress", null);
        },
        get phoneNumber() {
          return gateProperty(target, "phoneNumber", null);
        },
        get web3Wallet() {
          return gateProperty(target, "web3Wallet", null);
        },
        get hasPassword() {
          return gateProperty(target, "hasPassword", false);
        },
        get unsafeMetadata() {
          return gateProperty(target, "unsafeMetadata", {});
        },
        get createdSessionId() {
          return gateProperty(target, "createdSessionId", null);
        },
        get createdUserId() {
          return gateProperty(target, "createdUserId", null);
        },
        get abandonAt() {
          return gateProperty(target, "abandonAt", null);
        },
        get legalAcceptedAt() {
          return gateProperty(target, "legalAcceptedAt", null);
        },
        get locale() {
          return gateProperty(target, "locale", null);
        },
        get status() {
          return gateProperty(target, "status", "missing_requirements");
        },
        get unverifiedFields() {
          return gateProperty(target, "unverifiedFields", []);
        },
        get isTransferable() {
          return gateProperty(target, "isTransferable", false);
        },
        get canBeDiscarded() {
          return gateProperty(target, "canBeDiscarded", false);
        },
        create: gateMethod(target, "create"),
        update: gateMethod(target, "update"),
        sso: gateMethod(target, "sso"),
        password: gateMethod(target, "password"),
        ticket: gateMethod(target, "ticket"),
        web3: gateMethod(target, "web3"),
        finalize: gateMethod(target, "finalize"),
        reset: gateMethod(target, "reset"),
        verifications: this.wrapStruct(
          () => target().verifications,
          [
            "sendEmailCode",
            "verifyEmailCode",
            "sendEmailLink",
            "waitForEmailLinkVerification",
            "sendPhoneCode",
            "verifyPhoneCode"
          ],
          ["emailAddress", "phoneNumber", "web3Wallet", "externalAccount", "emailLinkVerification"],
          {
            emailAddress: defaultSignUpVerificationResource(),
            phoneNumber: defaultSignUpVerificationResource(),
            web3Wallet: defaultSignUpVerificationResource(),
            externalAccount: defaultSignUpVerificationResource(),
            emailLinkVerification: null
          }
        )
      }
    };
  }
  buildWaitlistProxy() {
    const gateProperty = this.gateProperty.bind(this);
    const gateMethod = this.gateMethod.bind(this);
    const target = () => {
      return this.state.__internal_waitlist;
    };
    return {
      errors: defaultWaitlistErrors(),
      fetchStatus: "idle",
      waitlist: {
        pathRoot: "/waitlist",
        get id() {
          return gateProperty(target, "id", "");
        },
        get createdAt() {
          return gateProperty(target, "createdAt", null);
        },
        get updatedAt() {
          return gateProperty(target, "updatedAt", null);
        },
        join: gateMethod(target, "join"),
        reload: gateMethod(target, "reload")
      }
    };
  }
  buildCheckoutProxy(params) {
    const gateProperty = this.gateProperty.bind(this);
    const targetCheckout = () => this.checkout(params);
    const target = () => targetCheckout().checkout;
    return {
      errors: {
        raw: null,
        global: null
      },
      fetchStatus: "idle",
      checkout: {
        get status() {
          return gateProperty(target, "status", "needs_initialization");
        },
        get externalClientSecret() {
          return gateProperty(target, "externalClientSecret", null);
        },
        get externalGatewayId() {
          return gateProperty(target, "externalGatewayId", null);
        },
        get paymentMethod() {
          return gateProperty(target, "paymentMethod", null);
        },
        get plan() {
          return gateProperty(target, "plan", null);
        },
        get planPeriod() {
          return gateProperty(target, "planPeriod", null);
        },
        get totals() {
          return gateProperty(target, "totals", null);
        },
        get isImmediatePlanChange() {
          return gateProperty(target, "isImmediatePlanChange", false);
        },
        get freeTrialEndsAt() {
          return gateProperty(target, "freeTrialEndsAt", null);
        },
        get payer() {
          return gateProperty(target, "payer", null);
        },
        get planPeriodStart() {
          return gateProperty(target, "planPeriodStart", null);
        },
        get needsPaymentMethod() {
          return gateProperty(target, "needsPaymentMethod", null);
        },
        start: this.gateMethod(target, "start"),
        confirm: this.gateMethod(target, "confirm"),
        finalize: this.gateMethod(target, "finalize")
      }
    };
  }
  __internal_effect(_) {
    throw new Error("__internal_effect called before Clerk is loaded");
  }
  __internal_computed(_) {
    throw new Error("__internal_computed called before Clerk is loaded");
  }
  get state() {
    const s = this.isomorphicClerk.__internal_state;
    if (!s) {
      throw new Error("Clerk state not ready");
    }
    return s;
  }
  get client() {
    const c = this.isomorphicClerk.client;
    if (!c) {
      throw new Error("Clerk client not ready");
    }
    return c;
  }
  get checkout() {
    const c = this.isomorphicClerk.__experimental_checkout;
    if (!c) {
      throw new Error("Clerk checkout not ready");
    }
    return c;
  }
  gateProperty(getTarget, key, defaultValue) {
    return (() => {
      if (!inBrowser() || !this.isomorphicClerk.loaded) {
        return defaultValue;
      }
      const t = getTarget();
      return t[key];
    })();
  }
  gateMethod(getTarget, key) {
    return (async (...args) => {
      if (!inBrowser()) {
        return errorThrower.throw(`Attempted to call a method (${key}) that is not supported on the server.`);
      }
      if (!this.isomorphicClerk.loaded) {
        await new Promise((resolve) => this.isomorphicClerk.addOnLoaded(resolve));
      }
      const t = getTarget();
      return t[key].apply(t, args);
    });
  }
  wrapMethods(getTarget, keys) {
    return Object.fromEntries(keys.map((k) => [k, this.gateMethod(getTarget, k)]));
  }
  wrapStruct(getTarget, methods, getters, fallbacks) {
    const out = {};
    for (const m of methods) {
      out[m] = this.gateMethod(getTarget, m);
    }
    for (const g of getters) {
      Object.defineProperty(out, g, {
        get: () => this.gateProperty(getTarget, g, fallbacks[g]),
        enumerable: true
      });
    }
    return out;
  }
};

// src/isomorphicClerk.ts
if (typeof globalThis.__BUILD_DISABLE_RHC__ === "undefined") {
  globalThis.__BUILD_DISABLE_RHC__ = false;
}
var SDK_METADATA = {
  name: "@clerk/react",
  version: "6.7.2",
  environment: process.env.NODE_ENV
};
var _status, _domain, _proxyUrl, _publishableKey, _eventBus, _stateProxy, _instance, _IsomorphicClerk_instances, waitForClerkJS_fn;
var _IsomorphicClerk = class _IsomorphicClerk {
  constructor(options) {
    __privateAdd(this, _IsomorphicClerk_instances);
    this.clerkjs = null;
    this.preopenOneTap = null;
    this.preopenUserVerification = null;
    this.preopenEnableOrganizationsPrompt = null;
    this.preopenSignIn = null;
    this.preopenCheckout = null;
    this.preopenPlanDetails = null;
    this.preopenSubscriptionDetails = null;
    this.preopenSignUp = null;
    this.preopenUserProfile = null;
    this.preopenOrganizationProfile = null;
    this.preopenCreateOrganization = null;
    this.preOpenWaitlist = null;
    this.premountSignInNodes = /* @__PURE__ */ new Map();
    this.premountSignUpNodes = /* @__PURE__ */ new Map();
    this.premountUserAvatarNodes = /* @__PURE__ */ new Map();
    this.premountUserProfileNodes = /* @__PURE__ */ new Map();
    this.premountUserButtonNodes = /* @__PURE__ */ new Map();
    this.premountOrganizationProfileNodes = /* @__PURE__ */ new Map();
    this.premountCreateOrganizationNodes = /* @__PURE__ */ new Map();
    this.premountOrganizationSwitcherNodes = /* @__PURE__ */ new Map();
    this.premountOrganizationListNodes = /* @__PURE__ */ new Map();
    this.premountMethodCalls = /* @__PURE__ */ new Map();
    this.premountWaitlistNodes = /* @__PURE__ */ new Map();
    this.premountPricingTableNodes = /* @__PURE__ */ new Map();
    this.premountAPIKeysNodes = /* @__PURE__ */ new Map();
    this.premountConfigureSSONodes = /* @__PURE__ */ new Map();
    this.premountOAuthConsentNodes = /* @__PURE__ */ new Map();
    this.premountTaskChooseOrganizationNodes = /* @__PURE__ */ new Map();
    this.premountTaskResetPasswordNodes = /* @__PURE__ */ new Map();
    this.premountTaskSetupMFANodes = /* @__PURE__ */ new Map();
    // A separate Map of `addListener` method calls to handle multiple listeners.
    this.premountAddListenerCalls = /* @__PURE__ */ new Map();
    this.loadedListeners = [];
    __privateAdd(this, _status, "loading");
    __privateAdd(this, _domain);
    __privateAdd(this, _proxyUrl);
    __privateAdd(this, _publishableKey);
    __privateAdd(this, _eventBus, createClerkEventBus());
    __privateAdd(this, _stateProxy);
    this.buildSignInUrl = (opts) => {
      const callback = () => {
        var _a;
        return ((_a = this.clerkjs) == null ? void 0 : _a.buildSignInUrl(opts)) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildSignInUrl", callback);
      }
    };
    this.buildSignUpUrl = (opts) => {
      const callback = () => {
        var _a;
        return ((_a = this.clerkjs) == null ? void 0 : _a.buildSignUpUrl(opts)) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildSignUpUrl", callback);
      }
    };
    this.buildAfterSignInUrl = (...args) => {
      const callback = () => {
        var _a;
        return ((_a = this.clerkjs) == null ? void 0 : _a.buildAfterSignInUrl(...args)) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildAfterSignInUrl", callback);
      }
    };
    this.buildAfterSignUpUrl = (...args) => {
      const callback = () => {
        var _a;
        return ((_a = this.clerkjs) == null ? void 0 : _a.buildAfterSignUpUrl(...args)) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildAfterSignUpUrl", callback);
      }
    };
    this.buildAfterSignOutUrl = () => {
      const callback = () => {
        var _a;
        return ((_a = this.clerkjs) == null ? void 0 : _a.buildAfterSignOutUrl()) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildAfterSignOutUrl", callback);
      }
    };
    this.buildNewSubscriptionRedirectUrl = () => {
      const callback = () => {
        var _a;
        return ((_a = this.clerkjs) == null ? void 0 : _a.buildNewSubscriptionRedirectUrl()) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildNewSubscriptionRedirectUrl", callback);
      }
    };
    this.buildAfterMultiSessionSingleSignOutUrl = () => {
      const callback = () => {
        var _a;
        return ((_a = this.clerkjs) == null ? void 0 : _a.buildAfterMultiSessionSingleSignOutUrl()) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildAfterMultiSessionSingleSignOutUrl", callback);
      }
    };
    this.buildUserProfileUrl = () => {
      const callback = () => {
        var _a;
        return ((_a = this.clerkjs) == null ? void 0 : _a.buildUserProfileUrl()) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildUserProfileUrl", callback);
      }
    };
    this.buildCreateOrganizationUrl = () => {
      const callback = () => {
        var _a;
        return ((_a = this.clerkjs) == null ? void 0 : _a.buildCreateOrganizationUrl()) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildCreateOrganizationUrl", callback);
      }
    };
    this.buildOrganizationProfileUrl = () => {
      const callback = () => {
        var _a;
        return ((_a = this.clerkjs) == null ? void 0 : _a.buildOrganizationProfileUrl()) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildOrganizationProfileUrl", callback);
      }
    };
    this.buildWaitlistUrl = () => {
      const callback = () => {
        var _a;
        return ((_a = this.clerkjs) == null ? void 0 : _a.buildWaitlistUrl()) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildWaitlistUrl", callback);
      }
    };
    this.buildTasksUrl = () => {
      const callback = () => {
        var _a;
        return ((_a = this.clerkjs) == null ? void 0 : _a.buildTasksUrl()) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildTasksUrl", callback);
      }
    };
    this.buildUrlWithAuth = (to) => {
      const callback = () => {
        var _a;
        return ((_a = this.clerkjs) == null ? void 0 : _a.buildUrlWithAuth(to)) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildUrlWithAuth", callback);
      }
    };
    this.handleUnauthenticated = async () => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.handleUnauthenticated();
      };
      if (this.clerkjs && this.loaded) {
        void callback();
      } else {
        this.premountMethodCalls.set("handleUnauthenticated", callback);
      }
    };
    this.on = (...args) => {
      var _a;
      if ((_a = this.clerkjs) == null ? void 0 : _a.on) {
        return this.clerkjs.on(...args);
      } else {
        __privateGet(this, _eventBus).on(...args);
      }
    };
    this.off = (...args) => {
      var _a;
      if ((_a = this.clerkjs) == null ? void 0 : _a.off) {
        return this.clerkjs.off(...args);
      } else {
        __privateGet(this, _eventBus).off(...args);
      }
    };
    /**
     * @deprecated Please use `addStatusListener`. This api will be removed in the next major.
     */
    this.addOnLoaded = (cb) => {
      this.loadedListeners.push(cb);
      if (this.loaded) {
        this.emitLoaded();
      }
    };
    /**
     * @deprecated Please use `__internal_setStatus`. This api will be removed in the next major.
     */
    this.emitLoaded = () => {
      this.loadedListeners.forEach((cb) => cb());
      this.loadedListeners = [];
    };
    this.beforeLoad = (clerkjs) => {
      if (!clerkjs) {
        throw new Error("Failed to hydrate latest Clerk JS");
      }
    };
    this.replayInterceptedInvocations = (clerkjs) => {
      var _a;
      if (!clerkjs) {
        throw new Error("Failed to hydrate latest Clerk JS");
      }
      this.clerkjs = clerkjs;
      this.premountMethodCalls.forEach((cb) => cb());
      this.premountAddListenerCalls.forEach((listenerExtras, listener) => {
        listenerExtras.handlers.nativeUnsubscribe = clerkjs.addListener(listener, listenerExtras.options);
      });
      (_a = __privateGet(this, _eventBus).internal.retrieveListeners("status")) == null ? void 0 : _a.forEach((listener) => {
        this.on("status", listener, { notify: true });
      });
      if (this.preopenSignIn !== null) {
        clerkjs.openSignIn(this.preopenSignIn);
      }
      if (this.preopenCheckout !== null) {
        clerkjs.__internal_openCheckout(this.preopenCheckout);
      }
      if (this.preopenPlanDetails !== null) {
        clerkjs.__internal_openPlanDetails(this.preopenPlanDetails);
      }
      if (this.preopenSubscriptionDetails !== null) {
        clerkjs.__internal_openSubscriptionDetails(this.preopenSubscriptionDetails);
      }
      if (this.preopenSignUp !== null) {
        clerkjs.openSignUp(this.preopenSignUp);
      }
      if (this.preopenUserProfile !== null) {
        clerkjs.openUserProfile(this.preopenUserProfile);
      }
      if (this.preopenUserVerification !== null) {
        clerkjs.__internal_openReverification(this.preopenUserVerification);
      }
      if (this.preopenOneTap !== null) {
        clerkjs.openGoogleOneTap(this.preopenOneTap);
      }
      if (this.preopenOrganizationProfile !== null) {
        clerkjs.openOrganizationProfile(this.preopenOrganizationProfile);
      }
      if (this.preopenCreateOrganization !== null) {
        clerkjs.openCreateOrganization(this.preopenCreateOrganization);
      }
      if (this.preOpenWaitlist !== null) {
        clerkjs.openWaitlist(this.preOpenWaitlist);
      }
      if (this.preopenEnableOrganizationsPrompt) {
        clerkjs.__internal_openEnableOrganizationsPrompt(this.preopenEnableOrganizationsPrompt);
      }
      this.premountSignInNodes.forEach((props, node) => {
        clerkjs.mountSignIn(node, props);
      });
      this.premountSignUpNodes.forEach((props, node) => {
        clerkjs.mountSignUp(node, props);
      });
      this.premountUserProfileNodes.forEach((props, node) => {
        clerkjs.mountUserProfile(node, props);
      });
      this.premountUserAvatarNodes.forEach((props, node) => {
        clerkjs.mountUserAvatar(node, props);
      });
      this.premountUserButtonNodes.forEach((props, node) => {
        clerkjs.mountUserButton(node, props);
      });
      this.premountOrganizationListNodes.forEach((props, node) => {
        clerkjs.mountOrganizationList(node, props);
      });
      this.premountWaitlistNodes.forEach((props, node) => {
        clerkjs.mountWaitlist(node, props);
      });
      this.premountPricingTableNodes.forEach((props, node) => {
        clerkjs.mountPricingTable(node, props);
      });
      this.premountAPIKeysNodes.forEach((props, node) => {
        clerkjs.mountAPIKeys(node, props);
      });
      this.premountConfigureSSONodes.forEach((props, node) => {
        clerkjs.mountConfigureSSO(node, props);
      });
      this.premountOAuthConsentNodes.forEach((props, node) => {
        clerkjs.__internal_mountOAuthConsent(node, props);
      });
      this.premountTaskChooseOrganizationNodes.forEach((props, node) => {
        clerkjs.mountTaskChooseOrganization(node, props);
      });
      this.premountTaskResetPasswordNodes.forEach((props, node) => {
        clerkjs.mountTaskResetPassword(node, props);
      });
      this.premountTaskSetupMFANodes.forEach((props, node) => {
        clerkjs.mountTaskSetupMFA(node, props);
      });
      if (typeof this.clerkjs.status === "undefined") {
        __privateGet(this, _eventBus).emit(clerkEvents.Status, "ready");
      }
      this.emitLoaded();
      return this.clerkjs;
    };
    this.__experimental_checkout = (...args) => {
      return this.loaded && this.clerkjs ? this.clerkjs.__experimental_checkout(...args) : __privateGet(this, _stateProxy).checkoutSignal(...args);
    };
    // TODO @userland-errors:
    this.__internal_updateProps = async (props) => {
      const clerkjs = await __privateMethod(this, _IsomorphicClerk_instances, waitForClerkJS_fn).call(this);
      if (clerkjs && "__internal_updateProps" in clerkjs) {
        return clerkjs.__internal_updateProps(props);
      }
    };
    /**
     * `setActive` can be used to set the active session and/or organization.
     */
    this.setActive = (params) => {
      if (this.clerkjs) {
        return this.clerkjs.setActive(params);
      } else {
        return Promise.reject();
      }
    };
    this.openSignIn = (props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.openSignIn(props);
      } else {
        this.preopenSignIn = props;
      }
    };
    this.closeSignIn = () => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.closeSignIn();
      } else {
        this.preopenSignIn = null;
      }
    };
    this.__internal_openCheckout = (props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.__internal_openCheckout(props);
      } else {
        this.preopenCheckout = props;
      }
    };
    this.__internal_closeCheckout = () => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.__internal_closeCheckout();
      } else {
        this.preopenCheckout = null;
      }
    };
    this.__internal_openPlanDetails = (props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.__internal_openPlanDetails(props);
      } else {
        this.preopenPlanDetails = props;
      }
    };
    this.__internal_closePlanDetails = () => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.__internal_closePlanDetails();
      } else {
        this.preopenPlanDetails = null;
      }
    };
    this.__internal_openSubscriptionDetails = (props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.__internal_openSubscriptionDetails(props);
      } else {
        this.preopenSubscriptionDetails = props != null ? props : null;
      }
    };
    this.__internal_closeSubscriptionDetails = () => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.__internal_closeSubscriptionDetails();
      } else {
        this.preopenSubscriptionDetails = null;
      }
    };
    this.__internal_openReverification = (props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.__internal_openReverification(props);
      } else {
        this.preopenUserVerification = props;
      }
    };
    this.__internal_closeReverification = () => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.__internal_closeReverification();
      } else {
        this.preopenUserVerification = null;
      }
    };
    this.__internal_openEnableOrganizationsPrompt = (props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.__internal_openEnableOrganizationsPrompt(props);
      } else {
        this.preopenEnableOrganizationsPrompt = props;
      }
    };
    this.__internal_closeEnableOrganizationsPrompt = () => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.__internal_closeEnableOrganizationsPrompt();
      } else {
        this.preopenEnableOrganizationsPrompt = null;
      }
    };
    this.openGoogleOneTap = (props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.openGoogleOneTap(props);
      } else {
        this.preopenOneTap = props;
      }
    };
    this.closeGoogleOneTap = () => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.closeGoogleOneTap();
      } else {
        this.preopenOneTap = null;
      }
    };
    this.openUserProfile = (props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.openUserProfile(props);
      } else {
        this.preopenUserProfile = props;
      }
    };
    this.closeUserProfile = () => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.closeUserProfile();
      } else {
        this.preopenUserProfile = null;
      }
    };
    this.openOrganizationProfile = (props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.openOrganizationProfile(props);
      } else {
        this.preopenOrganizationProfile = props;
      }
    };
    this.closeOrganizationProfile = () => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.closeOrganizationProfile();
      } else {
        this.preopenOrganizationProfile = null;
      }
    };
    this.openCreateOrganization = (props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.openCreateOrganization(props);
      } else {
        this.preopenCreateOrganization = props;
      }
    };
    this.closeCreateOrganization = () => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.closeCreateOrganization();
      } else {
        this.preopenCreateOrganization = null;
      }
    };
    this.openWaitlist = (props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.openWaitlist(props);
      } else {
        this.preOpenWaitlist = props;
      }
    };
    this.closeWaitlist = () => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.closeWaitlist();
      } else {
        this.preOpenWaitlist = null;
      }
    };
    this.openSignUp = (props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.openSignUp(props);
      } else {
        this.preopenSignUp = props;
      }
    };
    this.closeSignUp = () => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.closeSignUp();
      } else {
        this.preopenSignUp = null;
      }
    };
    this.mountSignIn = (node, props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.mountSignIn(node, props);
      } else {
        this.premountSignInNodes.set(node, props);
      }
    };
    this.unmountSignIn = (node) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.unmountSignIn(node);
      } else {
        this.premountSignInNodes.delete(node);
      }
    };
    this.mountSignUp = (node, props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.mountSignUp(node, props);
      } else {
        this.premountSignUpNodes.set(node, props);
      }
    };
    this.unmountSignUp = (node) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.unmountSignUp(node);
      } else {
        this.premountSignUpNodes.delete(node);
      }
    };
    this.mountUserAvatar = (node, props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.mountUserAvatar(node, props);
      } else {
        this.premountUserAvatarNodes.set(node, props);
      }
    };
    this.unmountUserAvatar = (node) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.unmountUserAvatar(node);
      } else {
        this.premountUserAvatarNodes.delete(node);
      }
    };
    this.mountUserProfile = (node, props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.mountUserProfile(node, props);
      } else {
        this.premountUserProfileNodes.set(node, props);
      }
    };
    this.unmountUserProfile = (node) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.unmountUserProfile(node);
      } else {
        this.premountUserProfileNodes.delete(node);
      }
    };
    this.mountOrganizationProfile = (node, props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.mountOrganizationProfile(node, props);
      } else {
        this.premountOrganizationProfileNodes.set(node, props);
      }
    };
    this.unmountOrganizationProfile = (node) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.unmountOrganizationProfile(node);
      } else {
        this.premountOrganizationProfileNodes.delete(node);
      }
    };
    this.mountCreateOrganization = (node, props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.mountCreateOrganization(node, props);
      } else {
        this.premountCreateOrganizationNodes.set(node, props);
      }
    };
    this.unmountCreateOrganization = (node) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.unmountCreateOrganization(node);
      } else {
        this.premountCreateOrganizationNodes.delete(node);
      }
    };
    this.mountOrganizationSwitcher = (node, props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.mountOrganizationSwitcher(node, props);
      } else {
        this.premountOrganizationSwitcherNodes.set(node, props);
      }
    };
    this.unmountOrganizationSwitcher = (node) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.unmountOrganizationSwitcher(node);
      } else {
        this.premountOrganizationSwitcherNodes.delete(node);
      }
    };
    this.__experimental_prefetchOrganizationSwitcher = () => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.__experimental_prefetchOrganizationSwitcher();
      };
      if (this.clerkjs && this.loaded) {
        void callback();
      } else {
        this.premountMethodCalls.set("__experimental_prefetchOrganizationSwitcher", callback);
      }
    };
    this.mountOrganizationList = (node, props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.mountOrganizationList(node, props);
      } else {
        this.premountOrganizationListNodes.set(node, props);
      }
    };
    this.unmountOrganizationList = (node) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.unmountOrganizationList(node);
      } else {
        this.premountOrganizationListNodes.delete(node);
      }
    };
    this.mountUserButton = (node, userButtonProps) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.mountUserButton(node, userButtonProps);
      } else {
        this.premountUserButtonNodes.set(node, userButtonProps);
      }
    };
    this.unmountUserButton = (node) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.unmountUserButton(node);
      } else {
        this.premountUserButtonNodes.delete(node);
      }
    };
    this.mountWaitlist = (node, props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.mountWaitlist(node, props);
      } else {
        this.premountWaitlistNodes.set(node, props);
      }
    };
    this.unmountWaitlist = (node) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.unmountWaitlist(node);
      } else {
        this.premountWaitlistNodes.delete(node);
      }
    };
    this.mountPricingTable = (node, props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.mountPricingTable(node, props);
      } else {
        this.premountPricingTableNodes.set(node, props);
      }
    };
    this.unmountPricingTable = (node) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.unmountPricingTable(node);
      } else {
        this.premountPricingTableNodes.delete(node);
      }
    };
    this.mountAPIKeys = (node, props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.mountAPIKeys(node, props);
      } else {
        this.premountAPIKeysNodes.set(node, props);
      }
    };
    this.unmountAPIKeys = (node) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.unmountAPIKeys(node);
      } else {
        this.premountAPIKeysNodes.delete(node);
      }
    };
    this.mountConfigureSSO = (node, props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.mountConfigureSSO(node, props);
      } else {
        this.premountConfigureSSONodes.set(node, props);
      }
    };
    this.unmountConfigureSSO = (node) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.unmountConfigureSSO(node);
      } else {
        this.premountConfigureSSONodes.delete(node);
      }
    };
    /**
     * @deprecated Use `mountConfigureSSO` instead.
     */
    this.__experimental_mountConfigureSSO = (node, props) => {
      this.mountConfigureSSO(node, props);
    };
    /**
     * @deprecated Use `unmountConfigureSSO` instead.
     */
    this.__experimental_unmountConfigureSSO = (node) => {
      this.unmountConfigureSSO(node);
    };
    this.__internal_mountOAuthConsent = (node, props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.__internal_mountOAuthConsent(node, props);
      } else {
        this.premountOAuthConsentNodes.set(node, props);
      }
    };
    this.__internal_unmountOAuthConsent = (node) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.__internal_unmountOAuthConsent(node);
      } else {
        this.premountOAuthConsentNodes.delete(node);
      }
    };
    this.mountOAuthConsent = (node, props) => {
      this.__internal_mountOAuthConsent(node, props);
    };
    this.unmountOAuthConsent = (node) => {
      this.__internal_unmountOAuthConsent(node);
    };
    this.mountTaskChooseOrganization = (node, props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.mountTaskChooseOrganization(node, props);
      } else {
        this.premountTaskChooseOrganizationNodes.set(node, props);
      }
    };
    this.unmountTaskChooseOrganization = (node) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.unmountTaskChooseOrganization(node);
      } else {
        this.premountTaskChooseOrganizationNodes.delete(node);
      }
    };
    this.mountTaskResetPassword = (node, props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.mountTaskResetPassword(node, props);
      } else {
        this.premountTaskResetPasswordNodes.set(node, props);
      }
    };
    this.unmountTaskResetPassword = (node) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.unmountTaskResetPassword(node);
      } else {
        this.premountTaskResetPasswordNodes.delete(node);
      }
    };
    this.mountTaskSetupMFA = (node, props) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.mountTaskSetupMFA(node, props);
      } else {
        this.premountTaskSetupMFANodes.set(node, props);
      }
    };
    this.unmountTaskSetupMFA = (node) => {
      if (this.clerkjs && this.loaded) {
        this.clerkjs.unmountTaskSetupMFA(node);
      } else {
        this.premountTaskSetupMFANodes.delete(node);
      }
    };
    this.addListener = (listener, options) => {
      if (this.clerkjs) {
        return this.clerkjs.addListener(listener, options);
      } else {
        const unsubscribe = () => {
          var _a, _b;
          const listenerExtras = this.premountAddListenerCalls.get(listener);
          if (listenerExtras == null ? void 0 : listenerExtras.handlers) {
            (_b = listenerExtras == null ? void 0 : (_a = listenerExtras.handlers).nativeUnsubscribe) == null ? void 0 : _b.call(_a);
            this.premountAddListenerCalls.delete(listener);
          }
        };
        this.premountAddListenerCalls.set(listener, { options, handlers: { unsubscribe, nativeUnsubscribe: void 0 } });
        return unsubscribe;
      }
    };
    this.navigate = (to) => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.navigate(to);
      };
      if (this.clerkjs && this.loaded) {
        void callback();
      } else {
        this.premountMethodCalls.set("navigate", callback);
      }
    };
    this.redirectWithAuth = async (...args) => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.redirectWithAuth(...args);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("redirectWithAuth", callback);
        return;
      }
    };
    this.redirectToSignIn = async (opts) => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.redirectToSignIn(opts);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("redirectToSignIn", callback);
        return;
      }
    };
    this.redirectToSignUp = async (opts) => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.redirectToSignUp(opts);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("redirectToSignUp", callback);
        return;
      }
    };
    this.redirectToUserProfile = async () => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.redirectToUserProfile();
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("redirectToUserProfile", callback);
        return;
      }
    };
    this.redirectToAfterSignUp = () => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.redirectToAfterSignUp();
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("redirectToAfterSignUp", callback);
      }
    };
    this.redirectToAfterSignIn = () => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.redirectToAfterSignIn();
      };
      if (this.clerkjs && this.loaded) {
        callback();
      } else {
        this.premountMethodCalls.set("redirectToAfterSignIn", callback);
      }
    };
    this.redirectToAfterSignOut = () => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.redirectToAfterSignOut();
      };
      if (this.clerkjs && this.loaded) {
        callback();
      } else {
        this.premountMethodCalls.set("redirectToAfterSignOut", callback);
      }
    };
    this.redirectToOrganizationProfile = async () => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.redirectToOrganizationProfile();
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("redirectToOrganizationProfile", callback);
        return;
      }
    };
    this.redirectToCreateOrganization = async () => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.redirectToCreateOrganization();
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("redirectToCreateOrganization", callback);
        return;
      }
    };
    this.redirectToWaitlist = async () => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.redirectToWaitlist();
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("redirectToWaitlist", callback);
        return;
      }
    };
    this.redirectToTasks = async (opts) => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.redirectToTasks(opts);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("redirectToTasks", callback);
        return;
      }
    };
    this.handleRedirectCallback = async (params) => {
      var _a;
      const callback = () => {
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.handleRedirectCallback(params);
      };
      if (this.clerkjs && this.loaded) {
        void ((_a = callback()) == null ? void 0 : _a.catch(() => {
        }));
      } else {
        this.premountMethodCalls.set("handleRedirectCallback", callback);
      }
    };
    this.handleGoogleOneTapCallback = async (signInOrUp, params) => {
      var _a;
      const callback = () => {
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.handleGoogleOneTapCallback(signInOrUp, params);
      };
      if (this.clerkjs && this.loaded) {
        void ((_a = callback()) == null ? void 0 : _a.catch(() => {
        }));
      } else {
        this.premountMethodCalls.set("handleGoogleOneTapCallback", callback);
      }
    };
    this.handleEmailLinkVerification = async (params) => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.handleEmailLinkVerification(params);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("handleEmailLinkVerification", callback);
      }
    };
    this.authenticateWithMetamask = async (params) => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.authenticateWithMetamask(params);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("authenticateWithMetamask", callback);
      }
    };
    this.authenticateWithCoinbaseWallet = async (params) => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.authenticateWithCoinbaseWallet(params);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("authenticateWithCoinbaseWallet", callback);
      }
    };
    this.authenticateWithBase = async (params) => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.authenticateWithBase(params);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("authenticateWithBase", callback);
      }
    };
    this.authenticateWithOKXWallet = async (params) => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.authenticateWithOKXWallet(params);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("authenticateWithOKXWallet", callback);
      }
    };
    this.authenticateWithSolana = async (params) => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.authenticateWithSolana(params);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("authenticateWithSolana", callback);
      }
    };
    this.authenticateWithWeb3 = async (params) => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.authenticateWithWeb3(params);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("authenticateWithWeb3", callback);
      }
    };
    this.authenticateWithGoogleOneTap = async (params) => {
      const clerkjs = await __privateMethod(this, _IsomorphicClerk_instances, waitForClerkJS_fn).call(this);
      return clerkjs.authenticateWithGoogleOneTap(params);
    };
    this.__internal_loadStripeJs = async () => {
      const clerkjs = await __privateMethod(this, _IsomorphicClerk_instances, waitForClerkJS_fn).call(this);
      return clerkjs.__internal_loadStripeJs();
    };
    this.createOrganization = async (params) => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.createOrganization(params);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("createOrganization", callback);
      }
    };
    this.getOrganization = async (organizationId) => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.getOrganization(organizationId);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("getOrganization", callback);
      }
    };
    this.joinWaitlist = async (params) => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.joinWaitlist(params);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("joinWaitlist", callback);
      }
    };
    this.signOut = async (...args) => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.signOut(...args);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("signOut", callback);
      }
    };
    this.__internal_attemptToEnableEnvironmentSetting = (options) => {
      const callback = () => {
        var _a;
        return (_a = this.clerkjs) == null ? void 0 : _a.__internal_attemptToEnableEnvironmentSetting(options);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("__internal_attemptToEnableEnvironmentSetting", callback);
      }
    };
    var _a;
    __privateSet(this, _publishableKey, options == null ? void 0 : options.publishableKey);
    __privateSet(this, _proxyUrl, options == null ? void 0 : options.proxyUrl);
    __privateSet(this, _domain, options == null ? void 0 : options.domain);
    this.options = options;
    this.Clerk = (options == null ? void 0 : options.Clerk) || null;
    this.mode = inBrowser2() ? "browser" : "server";
    __privateSet(this, _stateProxy, new StateProxy(this));
    if (!this.options.sdkMetadata) {
      this.options.sdkMetadata = SDK_METADATA;
    }
    __privateGet(this, _eventBus).emit(clerkEvents.Status, "loading");
    __privateGet(this, _eventBus).prioritizedOn(clerkEvents.Status, (status) => __privateSet(this, _status, status));
    if (__privateGet(this, _publishableKey) && ((_a = this.options.experimental) == null ? void 0 : _a.runtimeEnvironment) === "headless" && this.options.Clerk) {
      void this.loadHeadlessClerk();
    } else if (__privateGet(this, _publishableKey)) {
      void this.getEntryChunks();
    }
  }
  get publishableKey() {
    return __privateGet(this, _publishableKey);
  }
  get loaded() {
    var _a;
    return ((_a = this.clerkjs) == null ? void 0 : _a.loaded) || false;
  }
  get status() {
    var _a;
    if (!this.clerkjs) {
      return __privateGet(this, _status);
    }
    return ((_a = this.clerkjs) == null ? void 0 : _a.status) || /**
     * Support older clerk-js versions.
     * If clerk-js is available but `.status` is missing it we need to fallback to `.loaded`.
     * Since "degraded" an "error" did not exist before,
     * map "loaded" to "ready" and "not loaded" to "loading".
     */
    (this.clerkjs.loaded ? "ready" : "loading");
  }
  static getOrCreateInstance(options) {
    if (!inBrowser2() || !__privateGet(this, _instance) || options.Clerk && __privateGet(this, _instance).Clerk !== options.Clerk || // Allow hot swapping PKs on the client
    __privateGet(this, _instance).publishableKey !== options.publishableKey) {
      __privateSet(this, _instance, new _IsomorphicClerk(options));
    }
    return __privateGet(this, _instance);
  }
  static clearInstance() {
    __privateSet(this, _instance, null);
  }
  get domain() {
    if (typeof window !== "undefined" && window.location) {
      return handleValueOrFn(__privateGet(this, _domain), new URL(window.location.href), "");
    }
    if (typeof __privateGet(this, _domain) === "function") {
      return errorThrower.throw(unsupportedNonBrowserDomainOrProxyUrlFunction);
    }
    return __privateGet(this, _domain) || "";
  }
  get proxyUrl() {
    if (typeof window !== "undefined" && window.location) {
      return handleValueOrFn(__privateGet(this, _proxyUrl), new URL(window.location.href), "");
    }
    if (typeof __privateGet(this, _proxyUrl) === "function") {
      return errorThrower.throw(unsupportedNonBrowserDomainOrProxyUrlFunction);
    }
    return __privateGet(this, _proxyUrl) || "";
  }
  /**
   * Accesses private options from the `Clerk` instance and defaults to
   * `IsomorphicClerk` options when in SSR context.
   *  @internal
   */
  __internal_getOption(key) {
    var _a, _b;
    return ((_a = this.clerkjs) == null ? void 0 : _a.__internal_getOption) ? (_b = this.clerkjs) == null ? void 0 : _b.__internal_getOption(key) : this.options[key];
  }
  /**
   * Initialize Clerk for headless/React Native environments where a Clerk instance is provided directly.
   * Only handles Clerk construction and loading — post-load wiring is shared via replayInterceptedInvocations.
   */
  loadHeadlessClerk() {
    const clerk = isConstructor(this.options.Clerk) ? new this.options.Clerk(__privateGet(this, _publishableKey), { proxyUrl: this.proxyUrl, domain: this.domain }) : this.options.Clerk;
    if (!clerk) {
      __privateGet(this, _eventBus).emit(clerkEvents.Status, "error");
      return;
    }
    const onLoaded = () => {
      this.replayInterceptedInvocations(clerk);
    };
    if (!clerk.loaded) {
      clerk.load(this.options).then(() => onLoaded()).catch((err) => {
        if (false) {
          console.error("Clerk: Failed to load:", err);
        }
        __privateGet(this, _eventBus).emit(clerkEvents.Status, "error");
        this.emitLoaded();
      });
    } else {
      onLoaded();
    }
  }
  get sdkMetadata() {
    var _a;
    return ((_a = this.clerkjs) == null ? void 0 : _a.sdkMetadata) || this.options.sdkMetadata || void 0;
  }
  get instanceType() {
    var _a;
    return (_a = this.clerkjs) == null ? void 0 : _a.instanceType;
  }
  get frontendApi() {
    var _a;
    return ((_a = this.clerkjs) == null ? void 0 : _a.frontendApi) || "";
  }
  get isStandardBrowser() {
    var _a;
    return ((_a = this.clerkjs) == null ? void 0 : _a.isStandardBrowser) || this.options.standardBrowser || false;
  }
  get isSatellite() {
    if (typeof window !== "undefined" && window.location) {
      return handleValueOrFn(this.options.isSatellite, new URL(window.location.href), false);
    }
    if (typeof this.options.isSatellite === "function") {
      return errorThrower.throw(unsupportedNonBrowserDomainOrProxyUrlFunction);
    }
    return false;
  }
  async getEntryChunks() {
    var _a;
    if (this.mode !== "browser" || this.loaded) {
      return;
    }
    if (typeof window !== "undefined") {
      window.__clerk_publishable_key = __privateGet(this, _publishableKey);
      window.__clerk_proxy_url = this.proxyUrl;
      window.__clerk_domain = this.domain;
    }
    try {
      const clerk = await this.getClerkJsEntryChunk();
      if (!clerk.loaded) {
        this.beforeLoad(clerk);
        const shouldLoadUi = this.options.standardBrowser !== false && !this.options.Clerk || !!((_a = this.options.ui) == null ? void 0 : _a.ClerkUI);
        const ClerkUI = shouldLoadUi ? await this.getClerkUIEntryChunk() : void 0;
        await clerk.load({ ...this.options, ui: { ...this.options.ui, ClerkUI } });
      }
      if (clerk.loaded) {
        this.replayInterceptedInvocations(clerk);
      }
    } catch (err) {
      const error = err;
      __privateGet(this, _eventBus).emit(clerkEvents.Status, "error");
      console.error(error.stack || error.message || error);
      return;
    }
  }
  async getClerkJsEntryChunk() {
    if ((!this.options.Clerk || this.options.__internal_clerkJSUrl) && !__BUILD_DISABLE_RHC__) {
      await loadClerkJSScript({
        ...this.options,
        publishableKey: __privateGet(this, _publishableKey),
        proxyUrl: this.proxyUrl,
        domain: this.domain,
        nonce: this.options.nonce
      });
    }
    if (this.options.Clerk && !this.options.__internal_clerkJSUrl) {
      global.Clerk = isConstructor(this.options.Clerk) ? new this.options.Clerk(__privateGet(this, _publishableKey), { proxyUrl: this.proxyUrl, domain: this.domain }) : this.options.Clerk;
    }
    if (!global.Clerk) {
      throw new Error("Failed to download latest ClerkJS. Contact support@clerk.com.");
    }
    return global.Clerk;
  }
  async getClerkUIEntryChunk() {
    const uiProp = this.options.ui;
    const hasInternalUrl = !!this.options.__internal_clerkUIUrl;
    if ((uiProp == null ? void 0 : uiProp.ClerkUI) && !hasInternalUrl) {
      return uiProp.ClerkUI;
    }
    if ((uiProp || this.options.prefetchUI === false) && !hasInternalUrl) {
      return void 0;
    }
    await loadClerkUIScript({
      ...this.options,
      publishableKey: __privateGet(this, _publishableKey),
      proxyUrl: this.proxyUrl,
      domain: this.domain,
      nonce: this.options.nonce
    });
    if (!global.__internal_ClerkUICtor) {
      throw new Error("Failed to download latest Clerk UI. Contact support@clerk.com.");
    }
    return global.__internal_ClerkUICtor;
  }
  get version() {
    var _a;
    return (_a = this.clerkjs) == null ? void 0 : _a.version;
  }
  get client() {
    if (this.clerkjs) {
      return this.clerkjs.client;
    } else {
      return void 0;
    }
  }
  get session() {
    if (this.clerkjs) {
      return this.clerkjs.session;
    } else {
      return void 0;
    }
  }
  get user() {
    if (this.clerkjs) {
      return this.clerkjs.user;
    } else {
      return void 0;
    }
  }
  get organization() {
    if (this.clerkjs) {
      return this.clerkjs.organization;
    } else {
      return void 0;
    }
  }
  get telemetry() {
    if (this.clerkjs) {
      return this.clerkjs.telemetry;
    } else {
      return void 0;
    }
  }
  get __internal_environment() {
    if (this.clerkjs) {
      return this.clerkjs.__internal_environment;
    } else {
      return void 0;
    }
  }
  get isSignedIn() {
    if (this.clerkjs) {
      return this.clerkjs.isSignedIn;
    } else {
      return false;
    }
  }
  get billing() {
    var _a;
    return (_a = this.clerkjs) == null ? void 0 : _a.billing;
  }
  get __internal_state() {
    return this.loaded && this.clerkjs ? this.clerkjs.__internal_state : __privateGet(this, _stateProxy);
  }
  get apiKeys() {
    var _a;
    return (_a = this.clerkjs) == null ? void 0 : _a.apiKeys;
  }
  get oauthApplication() {
    var _a;
    return (_a = this.clerkjs) == null ? void 0 : _a.oauthApplication;
  }
  __internal_setEnvironment(...args) {
    if (this.clerkjs && "__internal_setEnvironment" in this.clerkjs) {
      this.clerkjs.__internal_setEnvironment(args);
    } else {
      return void 0;
    }
  }
  get __internal_lastEmittedResources() {
    var _a;
    return (_a = this.clerkjs) == null ? void 0 : _a.__internal_lastEmittedResources;
  }
};
_status = new WeakMap();
_domain = new WeakMap();
_proxyUrl = new WeakMap();
_publishableKey = new WeakMap();
_eventBus = new WeakMap();
_stateProxy = new WeakMap();
_instance = new WeakMap();
_IsomorphicClerk_instances = new WeakSet();
waitForClerkJS_fn = function() {
  return new Promise((resolve) => {
    this.addOnLoaded(() => resolve(this.clerkjs));
  });
};
__privateAdd(_IsomorphicClerk, _instance);
var IsomorphicClerk = _IsomorphicClerk;

// src/contexts/ClerkProvider.tsx
function ClerkProviderBase(props) {
  const { initialState, children, ...restIsomorphicClerkOptions } = props;
  const mergedOptions = mergeWithEnv(restIsomorphicClerkOptions);
  const { isomorphicClerk, clerkStatus } = useLoadedIsomorphicClerk(mergedOptions);
  return /* @__PURE__ */ React3.createElement(
    ClerkContextProvider,
    {
      initialState,
      clerk: isomorphicClerk,
      clerkStatus
    },
    children
  );
}
var ClerkProvider = withMaxAllowedInstancesGuard(ClerkProviderBase, "ClerkProvider", multipleClerkProvidersError);
ClerkProvider.displayName = "ClerkProvider";
var DEFAULT_CLERK_UI_VARIANT = IS_REACT_SHARED_VARIANT_COMPATIBLE ? "shared" : "";
var useLoadedIsomorphicClerk = (mergedOptions) => {
  const optionsWithDefaults = React3.useMemo(
    () => ({
      clerkUIVariant: DEFAULT_CLERK_UI_VARIANT,
      ...mergedOptions
    }),
    [mergedOptions]
  );
  const isomorphicClerkRef = React3.useRef(IsomorphicClerk.getOrCreateInstance(optionsWithDefaults));
  const [clerkStatus, setClerkStatus] = React3.useState(isomorphicClerkRef.current.status);
  React3.useEffect(() => {
    void isomorphicClerkRef.current.__internal_updateProps({ appearance: mergedOptions.appearance });
  }, [mergedOptions.appearance]);
  React3.useEffect(() => {
    void isomorphicClerkRef.current.__internal_updateProps({ options: mergedOptions });
  }, [mergedOptions.localization]);
  React3.useEffect(() => {
    isomorphicClerkRef.current.on("status", setClerkStatus);
    return () => {
      if (isomorphicClerkRef.current) {
        isomorphicClerkRef.current.off("status", setClerkStatus);
      }
      IsomorphicClerk.clearInstance();
    };
  }, []);
  return { isomorphicClerk: isomorphicClerkRef.current, clerkStatus };
};

export {
  ClerkLoaded,
  ClerkLoading,
  ClerkFailed,
  ClerkDegraded,
  Show,
  RedirectToSignIn,
  RedirectToSignUp,
  RedirectToTasks,
  RedirectToUserProfile,
  RedirectToOrganizationProfile,
  RedirectToCreateOrganization,
  AuthenticateWithRedirectCallback,
  MultisessionAppSupport,
  IS_REACT_SHARED_VARIANT_COMPATIBLE,
  ClerkProvider
};
//# sourceMappingURL=chunk-7QKVPCZK.mjs.map