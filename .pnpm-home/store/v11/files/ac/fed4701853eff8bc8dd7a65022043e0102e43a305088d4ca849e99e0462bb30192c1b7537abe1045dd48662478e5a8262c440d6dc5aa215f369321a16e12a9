import {
  AuthenticateWithRedirectCallback,
  ClerkDegraded,
  ClerkFailed,
  ClerkLoaded,
  ClerkLoading,
  ClerkProvider,
  RedirectToCreateOrganization,
  RedirectToOrganizationProfile,
  RedirectToSignIn,
  RedirectToSignUp,
  RedirectToTasks,
  RedirectToUserProfile,
  Show
} from "./chunk-7QKVPCZK.mjs";
import {
  APIKeys,
  ConfigureSSO,
  CreateOrganization,
  GoogleOneTap,
  OAuthConsent,
  OrganizationList,
  OrganizationProfile,
  OrganizationSwitcher,
  PricingTable,
  SignIn,
  SignUp,
  TaskChooseOrganization,
  TaskResetPassword,
  TaskSetupMFA,
  UserAvatar,
  UserButton,
  UserProfile,
  Waitlist,
  __experimental_CheckoutProvider,
  __experimental_PaymentElement,
  __experimental_PaymentElementProvider,
  __experimental_useCheckout,
  __experimental_usePaymentElement,
  assertSingleChild,
  normalizeWithDefaultValue,
  safeExecute,
  useAPIKeys,
  useAuth,
  useClerk,
  useEmailLink,
  useOAuthConsent,
  useOrganization,
  useOrganizationCreationDefaults,
  useOrganizationList,
  useReverification,
  useSession,
  useSessionList,
  useSignIn,
  useSignUp,
  useUser,
  useWaitlist,
  withClerk
} from "./chunk-EQJEQXWW.mjs";
import {
  setErrorThrowerOptions
} from "./chunk-RQWALB2R.mjs";
import "./chunk-E5QRIS4Z.mjs";

// src/polyfills.ts
if (typeof window !== "undefined" && !window.global) {
  window.global = typeof global === "undefined" ? window : global;
}

// ../ui/register/index.mjs
import * as react from "react";
import * as reactDom from "react-dom";
import * as reactDomClient from "react-dom/client";
import * as jsxRuntime from "react/jsx-runtime";
var _a;
if (globalThis.__clerkSharedModules) {
  const existingVersion = (_a = globalThis.__clerkSharedModules.react) == null ? void 0 : _a.version;
  if (existingVersion && existingVersion !== react.version) {
    console.warn(
      `[@clerk/ui/register] React version mismatch detected. Already registered: ${existingVersion}, current import: ${react.version}. This may cause issues with the shared @clerk/ui variant.`
    );
  }
} else {
  globalThis.__clerkSharedModules = {
    react,
    "react-dom": reactDom,
    "react-dom/client": reactDomClient,
    "react/jsx-runtime": jsxRuntime
  };
}

// src/index.ts
import { setClerkJSLoadingErrorPackageName } from "@clerk/shared/loadClerkJsScript";

// src/components/SignInButton.tsx
import React from "react";
var SignInButton = withClerk(
  ({ clerk, children, ...props }) => {
    const {
      // @ts-expect-error - appearance is a valid prop for SignInProps & SignInButtonPropsModal
      appearance,
      getContainer,
      component,
      signUpFallbackRedirectUrl,
      forceRedirectUrl,
      fallbackRedirectUrl,
      signUpForceRedirectUrl,
      mode,
      initialValues,
      withSignUp,
      oauthFlow,
      ...rest
    } = props;
    children = normalizeWithDefaultValue(children, "Sign in");
    const child = assertSingleChild(children)("SignInButton");
    const clickHandler = () => {
      const opts = {
        forceRedirectUrl,
        fallbackRedirectUrl,
        signUpFallbackRedirectUrl,
        signUpForceRedirectUrl,
        initialValues,
        withSignUp,
        oauthFlow
      };
      if (mode === "modal") {
        return clerk.openSignIn({ ...opts, appearance, getContainer });
      }
      return clerk.redirectToSignIn({
        ...opts,
        signInFallbackRedirectUrl: fallbackRedirectUrl,
        signInForceRedirectUrl: forceRedirectUrl
      });
    };
    const wrappedChildClickHandler = async (e) => {
      if (child && typeof child === "object" && "props" in child) {
        await safeExecute(child.props.onClick)(e);
      }
      return clickHandler();
    };
    const childProps = { ...rest, onClick: wrappedChildClickHandler };
    return React.cloneElement(child, childProps);
  },
  { component: "SignInButton", renderWhileLoading: true }
);

// src/components/SignInWithMetamaskButton.tsx
import React2 from "react";
var SignInWithMetamaskButton = withClerk(
  ({ clerk, children, ...props }) => {
    const { redirectUrl, getContainer, component, ...rest } = props;
    children = normalizeWithDefaultValue(children, "Sign in with Metamask");
    const child = assertSingleChild(children)("SignInWithMetamaskButton");
    const clickHandler = async () => {
      async function authenticate() {
        await clerk.authenticateWithMetamask({ redirectUrl: redirectUrl || void 0 });
      }
      void authenticate();
    };
    const wrappedChildClickHandler = async (e) => {
      await safeExecute(child.props.onClick)(e);
      return clickHandler();
    };
    const childProps = { ...rest, onClick: wrappedChildClickHandler };
    return React2.cloneElement(child, childProps);
  },
  { component: "SignInWithMetamask", renderWhileLoading: true }
);

// src/components/SignOutButton.tsx
import { deprecated } from "@clerk/shared/deprecated";
import React3 from "react";
var SignOutButton = withClerk(
  ({ clerk, children, ...props }) => {
    const { redirectUrl = "/", sessionId, signOutOptions, getContainer, component, ...rest } = props;
    if (signOutOptions) {
      deprecated("SignOutButton `signOutOptions`", "Use the `redirectUrl` and `sessionId` props directly instead.");
    }
    children = normalizeWithDefaultValue(children, "Sign out");
    const child = assertSingleChild(children)("SignOutButton");
    const clickHandler = () => clerk.signOut({
      redirectUrl,
      ...sessionId !== void 0 && { sessionId },
      ...signOutOptions
    });
    const wrappedChildClickHandler = async (e) => {
      await safeExecute(child.props.onClick)(e);
      return clickHandler();
    };
    const childProps = { ...rest, onClick: wrappedChildClickHandler };
    return React3.cloneElement(child, childProps);
  },
  { component: "SignOutButton", renderWhileLoading: true }
);

// src/components/SignUpButton.tsx
import React4 from "react";
var SignUpButton = withClerk(
  ({ clerk, children, ...props }) => {
    const {
      // @ts-expect-error - appearance is a valid prop for SignUpProps & SignUpButtonPropsModal
      appearance,
      // @ts-expect-error - unsafeMetadata is a valid prop for SignUpProps & SignUpButtonPropsModal
      unsafeMetadata,
      getContainer,
      component,
      fallbackRedirectUrl,
      forceRedirectUrl,
      signInFallbackRedirectUrl,
      signInForceRedirectUrl,
      mode,
      initialValues,
      oauthFlow,
      ...rest
    } = props;
    children = normalizeWithDefaultValue(children, "Sign up");
    const child = assertSingleChild(children)("SignUpButton");
    const clickHandler = () => {
      const opts = {
        fallbackRedirectUrl,
        forceRedirectUrl,
        signInFallbackRedirectUrl,
        signInForceRedirectUrl,
        initialValues,
        oauthFlow
      };
      if (mode === "modal") {
        return clerk.openSignUp({
          ...opts,
          appearance,
          unsafeMetadata,
          getContainer
        });
      }
      return clerk.redirectToSignUp({
        ...opts,
        signUpFallbackRedirectUrl: fallbackRedirectUrl,
        signUpForceRedirectUrl: forceRedirectUrl
      });
    };
    const wrappedChildClickHandler = async (e) => {
      if (child && typeof child === "object" && "props" in child) {
        await safeExecute(child.props.onClick)(e);
      }
      return clickHandler();
    };
    const childProps = { ...rest, onClick: wrappedChildClickHandler };
    return React4.cloneElement(child, childProps);
  },
  { component: "SignUpButton", renderWhileLoading: true }
);

// src/components/HandleSSOCallback.tsx
import React5, { useEffect, useRef } from "react";
function HandleSSOCallback(props) {
  const { navigateToApp, navigateToSignIn, navigateToSignUp } = props;
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const hasRun = useRef(false);
  useEffect(() => {
    (async () => {
      var _a2, _b, _c;
      if (!clerk.loaded || hasRun.current) {
        return;
      }
      hasRun.current = true;
      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: async (...params) => {
            navigateToApp(...params);
          }
        });
        return;
      }
      if (signUp.isTransferable) {
        await signIn.create({ transfer: true });
        if (signIn.status === "complete") {
          await signIn.finalize({
            navigate: async (...params) => {
              navigateToApp(...params);
            }
          });
          return;
        }
        return navigateToSignIn();
      }
      if (signIn.status === "needs_first_factor" && !((_a2 = signIn.supportedFirstFactors) == null ? void 0 : _a2.every((f) => f.strategy === "enterprise_sso"))) {
        return navigateToSignIn();
      }
      if (signIn.isTransferable) {
        await signUp.create({ transfer: true });
        if (signUp.status === "complete") {
          await signUp.finalize({
            navigate: async (...params) => {
              navigateToApp(...params);
            }
          });
          return;
        }
        return navigateToSignUp();
      }
      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: async (...params) => {
            navigateToApp(...params);
          }
        });
        return;
      }
      if (signIn.status === "needs_second_factor" || signIn.status === "needs_new_password") {
        return navigateToSignIn();
      }
      if (signIn.existingSession || signUp.existingSession) {
        const sessionId = ((_b = signIn.existingSession) == null ? void 0 : _b.sessionId) || ((_c = signUp.existingSession) == null ? void 0 : _c.sessionId);
        if (sessionId) {
          await clerk.setActive({
            session: sessionId,
            navigate: async (...params) => {
              return navigateToApp(...params);
            }
          });
          return;
        }
      }
    })();
  }, [clerk, clerk.loaded, signIn, signUp]);
  return /* @__PURE__ */ React5.createElement("div", null, /* @__PURE__ */ React5.createElement("div", { id: "clerk-captcha" }));
}

// src/contexts/index.ts
import { UNSAFE_PortalProvider } from "@clerk/shared/react";

// src/index.ts
import { getToken } from "@clerk/shared/getToken";
setErrorThrowerOptions({ packageName: "@clerk/react" });
setClerkJSLoadingErrorPackageName("@clerk/react");
export {
  APIKeys,
  AuthenticateWithRedirectCallback,
  ClerkDegraded,
  ClerkFailed,
  ClerkLoaded,
  ClerkLoading,
  ClerkProvider,
  ConfigureSSO,
  CreateOrganization,
  GoogleOneTap,
  HandleSSOCallback,
  OAuthConsent,
  OrganizationList,
  OrganizationProfile,
  OrganizationSwitcher,
  PricingTable,
  RedirectToCreateOrganization,
  RedirectToOrganizationProfile,
  RedirectToSignIn,
  RedirectToSignUp,
  RedirectToTasks,
  RedirectToUserProfile,
  Show,
  SignIn,
  SignInButton,
  SignInWithMetamaskButton,
  SignOutButton,
  SignUp,
  SignUpButton,
  TaskChooseOrganization,
  TaskResetPassword,
  TaskSetupMFA,
  UNSAFE_PortalProvider,
  UserAvatar,
  UserButton,
  UserProfile,
  Waitlist,
  __experimental_CheckoutProvider,
  __experimental_PaymentElement,
  __experimental_PaymentElementProvider,
  __experimental_useCheckout,
  __experimental_usePaymentElement,
  getToken,
  useAPIKeys,
  useAuth,
  useClerk,
  useEmailLink,
  useOAuthConsent,
  useOrganization,
  useOrganizationCreationDefaults,
  useOrganizationList,
  useReverification,
  useSession,
  useSessionList,
  useSignIn,
  useSignUp,
  useUser,
  useWaitlist
};
//# sourceMappingURL=index.mjs.map