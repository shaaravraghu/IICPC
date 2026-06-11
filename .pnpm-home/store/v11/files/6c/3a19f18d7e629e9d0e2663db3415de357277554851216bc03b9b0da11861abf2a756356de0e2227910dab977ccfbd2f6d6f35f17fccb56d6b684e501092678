"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  APIKeys: () => APIKeys,
  AuthenticateWithRedirectCallback: () => AuthenticateWithRedirectCallback,
  ClerkDegraded: () => ClerkDegraded,
  ClerkFailed: () => ClerkFailed,
  ClerkLoaded: () => ClerkLoaded,
  ClerkLoading: () => ClerkLoading,
  ClerkProvider: () => ClerkProvider,
  ConfigureSSO: () => ConfigureSSO,
  CreateOrganization: () => CreateOrganization,
  GoogleOneTap: () => GoogleOneTap,
  HandleSSOCallback: () => HandleSSOCallback,
  OAuthConsent: () => OAuthConsent,
  OrganizationList: () => OrganizationList,
  OrganizationProfile: () => OrganizationProfile,
  OrganizationSwitcher: () => OrganizationSwitcher,
  PricingTable: () => PricingTable,
  RedirectToCreateOrganization: () => RedirectToCreateOrganization,
  RedirectToOrganizationProfile: () => RedirectToOrganizationProfile,
  RedirectToSignIn: () => RedirectToSignIn,
  RedirectToSignUp: () => RedirectToSignUp,
  RedirectToTasks: () => RedirectToTasks,
  RedirectToUserProfile: () => RedirectToUserProfile,
  Show: () => Show,
  SignIn: () => SignIn,
  SignInButton: () => SignInButton,
  SignInWithMetamaskButton: () => SignInWithMetamaskButton,
  SignOutButton: () => SignOutButton,
  SignUp: () => SignUp,
  SignUpButton: () => SignUpButton,
  TaskChooseOrganization: () => TaskChooseOrganization,
  TaskResetPassword: () => TaskResetPassword,
  TaskSetupMFA: () => TaskSetupMFA,
  UNSAFE_PortalProvider: () => import_react31.UNSAFE_PortalProvider,
  UserAvatar: () => UserAvatar,
  UserButton: () => UserButton,
  UserProfile: () => UserProfile,
  Waitlist: () => Waitlist,
  __experimental_CheckoutProvider: () => import_react20.__experimental_CheckoutProvider,
  __experimental_PaymentElement: () => import_react20.__experimental_PaymentElement,
  __experimental_PaymentElementProvider: () => import_react20.__experimental_PaymentElementProvider,
  __experimental_useCheckout: () => import_react20.__experimental_useCheckout,
  __experimental_usePaymentElement: () => import_react20.__experimental_usePaymentElement,
  getToken: () => import_getToken.getToken,
  useAPIKeys: () => import_react20.useAPIKeys,
  useAuth: () => useAuth,
  useClerk: () => import_react20.useClerk,
  useEmailLink: () => useEmailLink,
  useOAuthConsent: () => import_react20.useOAuthConsent,
  useOrganization: () => import_react20.useOrganization,
  useOrganizationCreationDefaults: () => import_react20.useOrganizationCreationDefaults,
  useOrganizationList: () => import_react20.useOrganizationList,
  useReverification: () => import_react20.useReverification,
  useSession: () => import_react20.useSession,
  useSessionList: () => import_react20.useSessionList,
  useSignIn: () => useSignIn,
  useSignUp: () => useSignUp,
  useUser: () => import_react20.useUser,
  useWaitlist: () => useWaitlist
});
module.exports = __toCommonJS(src_exports);

// <define:__CLERK_UI_SUPPORTED_REACT_BOUNDS__>
var define_CLERK_UI_SUPPORTED_REACT_BOUNDS_default = [[18, 0, -1, 0], [19, 0, 0, 3], [19, 1, 1, 4], [19, 2, 2, 3], [19, 3, 3, 0]];

// src/polyfills.ts
if (typeof window !== "undefined" && !window.global) {
  window.global = typeof global === "undefined" ? window : global;
}

// ../ui/register/index.mjs
var react = __toESM(require("react"), 1);
var reactDom = __toESM(require("react-dom"), 1);
var reactDomClient = __toESM(require("react-dom/client"), 1);
var jsxRuntime = __toESM(require("react/jsx-runtime"), 1);
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
var import_loadClerkJsScript2 = require("@clerk/shared/loadClerkJsScript");

// src/errors/errorThrower.ts
var import_error = require("@clerk/shared/error");
var errorThrower = (0, import_error.buildErrorThrower)({ packageName: "@clerk/react" });
function setErrorThrowerOptions(options) {
  errorThrower.setMessages(options).setPackageName(options);
}

// src/components/uiComponents.tsx
var import_utils3 = require("@clerk/shared/utils");
var import_react14 = __toESM(require("react"));

// src/errors/messages.ts
var multipleClerkProvidersError = "You've added multiple <ClerkProvider> components in your React component tree. Wrap your components in a single <ClerkProvider>.";
var multipleChildrenInButtonComponent = (name) => `You've passed multiple children components to <${name}/>. You can only pass a single child component or text.`;
var invalidStateError = "Invalid state. Feel free to submit a bug or reach out to support here: https://clerk.com/contact/support";
var unsupportedNonBrowserDomainOrProxyUrlFunction = "Unsupported usage of isSatellite, domain or proxyUrl. The usage of isSatellite, domain or proxyUrl as function is not supported in non-browser environments.";
var userProfilePageRenderedError = "<UserProfile.Page /> component needs to be a direct child of `<UserProfile />` or `<UserButton />`.";
var userProfileLinkRenderedError = "<UserProfile.Link /> component needs to be a direct child of `<UserProfile />` or `<UserButton />`.";
var organizationProfilePageRenderedError = "<OrganizationProfile.Page /> component needs to be a direct child of `<OrganizationProfile />` or `<OrganizationSwitcher />`.";
var organizationProfileLinkRenderedError = "<OrganizationProfile.Link /> component needs to be a direct child of `<OrganizationProfile />` or `<OrganizationSwitcher />`.";
var customPagesIgnoredComponent = (componentName) => `<${componentName} /> can only accept <${componentName}.Page /> and <${componentName}.Link /> as its children. Any other provided component will be ignored. Additionally, please ensure that the component is rendered in a client component.`;
var customPageWrongProps = (componentName) => `Missing props. <${componentName}.Page /> component requires the following props: url, label, labelIcon, alongside with children to be rendered inside the page.`;
var customLinkWrongProps = (componentName) => `Missing props. <${componentName}.Link /> component requires the following props: url, label and labelIcon.`;
var userButtonIgnoredComponent = `<UserButton /> can only accept <UserButton.UserProfilePage />, <UserButton.UserProfileLink /> and <UserButton.MenuItems /> as its children. Any other provided component will be ignored. Additionally, please ensure that the component is rendered in a client component.`;
var customMenuItemsIgnoredComponent = "<UserButton.MenuItems /> component can only accept <UserButton.Action /> and <UserButton.Link /> as its children. Any other provided component will be ignored. Additionally, please ensure that the component is rendered in a client component.";
var userButtonMenuItemsRenderedError = "<UserButton.MenuItems /> component needs to be a direct child of `<UserButton />`.";
var userButtonMenuActionRenderedError = "<UserButton.Action /> component needs to be a direct child of `<UserButton.MenuItems />`.";
var userButtonMenuLinkRenderedError = "<UserButton.Link /> component needs to be a direct child of `<UserButton.MenuItems />`.";
var userButtonMenuItemLinkWrongProps = "Missing props. <UserButton.Link /> component requires the following props: href, label and labelIcon.";
var userButtonMenuItemsActionWrongsProps = "Missing props. <UserButton.Action /> component requires the following props: label.";

// src/utils/childrenUtils.tsx
var import_react = __toESM(require("react"));
var assertSingleChild = (children) => (name) => {
  try {
    return import_react.default.Children.only(children);
  } catch {
    const childArray = import_react.default.Children.toArray(children);
    if (childArray.length === 1 && import_react.default.isValidElement(childArray[0])) {
      return childArray[0];
    }
    return errorThrower.throw(multipleChildrenInButtonComponent(name));
  }
};
var normalizeWithDefaultValue = (children, defaultText) => {
  if (!children) {
    children = defaultText;
  }
  if (typeof children === "string") {
    children = /* @__PURE__ */ import_react.default.createElement("button", null, children);
  }
  return children;
};
var safeExecute = (cb) => (...args) => {
  if (cb && typeof cb === "function") {
    return cb(...args);
  }
};

// src/utils/envVariables.ts
var import_getEnvVariable = require("@clerk/shared/getEnvVariable");
var getEnvVar = (name) => {
  return (0, import_getEnvVariable.getEnvVariable)(`VITE_${name}`) || (0, import_getEnvVariable.getEnvVariable)(name);
};
var withEnvFallback = (value, envVarName) => {
  if (value !== void 0) {
    return value;
  }
  const envValue = getEnvVar(envVarName);
  return envValue || void 0;
};
var mergeWithEnv = (options) => {
  const publishableKey = withEnvFallback(options.publishableKey, "CLERK_PUBLISHABLE_KEY");
  return {
    ...options,
    ...publishableKey !== void 0 && { publishableKey }
  };
};

// src/utils/isConstructor.ts
function isConstructor(f) {
  return typeof f === "function";
}

// src/utils/useMaxAllowedInstancesGuard.tsx
var import_react2 = __toESM(require("react"));
var counts = /* @__PURE__ */ new Map();
function useMaxAllowedInstancesGuard(name, error, maxCount = 1) {
  import_react2.default.useEffect(() => {
    const count = counts.get(name) || 0;
    if (count == maxCount) {
      return errorThrower.throw(error);
    }
    counts.set(name, count + 1);
    return () => {
      counts.set(name, (counts.get(name) || 1) - 1);
    };
  }, []);
}
function withMaxAllowedInstancesGuard(WrappedComponent, name, error) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || name || "Component";
  const Hoc = (props) => {
    useMaxAllowedInstancesGuard(name, error);
    return /* @__PURE__ */ import_react2.default.createElement(WrappedComponent, { ...props });
  };
  Hoc.displayName = `withMaxAllowedInstancesGuard(${displayName})`;
  return Hoc;
}

// src/utils/useCustomElementPortal.tsx
var import_react3 = require("react");
var import_react_dom = require("react-dom");
var useCustomElementPortal = (elements) => {
  const [nodeMap, setNodeMap] = (0, import_react3.useState)(/* @__PURE__ */ new Map());
  return elements.map((el) => ({
    id: el.id,
    mount: (node) => setNodeMap((prev) => new Map(prev).set(String(el.id), node)),
    unmount: () => setNodeMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(String(el.id), null);
      return newMap;
    }),
    portal: () => {
      const node = nodeMap.get(String(el.id));
      return node ? (0, import_react_dom.createPortal)(el.component, node) : null;
    }
  }));
};

// src/utils/useCustomPages.tsx
var import_utils = require("@clerk/shared/utils");
var import_react5 = __toESM(require("react"));

// src/utils/componentValidation.ts
var import_react4 = __toESM(require("react"));
var isThatComponent = (v, component) => {
  return !!v && import_react4.default.isValidElement(v) && (v == null ? void 0 : v.type) === component;
};

// src/utils/useCustomPages.tsx
var useUserProfileCustomPages = (children, options) => {
  const reorderItemsLabels = ["account", "security", "billing", "apiKeys"];
  return useCustomPages(
    {
      children,
      reorderItemsLabels,
      LinkComponent: UserProfileLink,
      PageComponent: UserProfilePage,
      MenuItemsComponent: MenuItems,
      componentName: "UserProfile"
    },
    options
  );
};
var useOrganizationProfileCustomPages = (children, options) => {
  const reorderItemsLabels = ["general", "members", "billing", "apiKeys"];
  return useCustomPages(
    {
      children,
      reorderItemsLabels,
      LinkComponent: OrganizationProfileLink,
      PageComponent: OrganizationProfilePage,
      componentName: "OrganizationProfile"
    },
    options
  );
};
var useSanitizedChildren = (children) => {
  const sanitizedChildren = [];
  const excludedComponents = [
    OrganizationProfileLink,
    OrganizationProfilePage,
    MenuItems,
    UserProfilePage,
    UserProfileLink
  ];
  import_react5.default.Children.forEach(children, (child) => {
    if (!excludedComponents.some((component) => isThatComponent(child, component))) {
      sanitizedChildren.push(child);
    }
  });
  return sanitizedChildren;
};
var useCustomPages = (params, options) => {
  const { children, LinkComponent, PageComponent, MenuItemsComponent, reorderItemsLabels, componentName } = params;
  const { allowForAnyChildren = false } = options || {};
  const validChildren = [];
  import_react5.default.Children.forEach(children, (child) => {
    if (!isThatComponent(child, PageComponent) && !isThatComponent(child, LinkComponent) && !isThatComponent(child, MenuItemsComponent)) {
      if (child && !allowForAnyChildren) {
        (0, import_utils.logErrorInDevMode)(customPagesIgnoredComponent(componentName));
      }
      return;
    }
    const { props } = child;
    const { children: children2, label, url, labelIcon } = props;
    if (isThatComponent(child, PageComponent)) {
      if (isReorderItem(props, reorderItemsLabels)) {
        validChildren.push({ label });
      } else if (isCustomPage(props)) {
        validChildren.push({ label, labelIcon, children: children2, url });
      } else {
        (0, import_utils.logErrorInDevMode)(customPageWrongProps(componentName));
        return;
      }
    }
    if (isThatComponent(child, LinkComponent)) {
      if (isExternalLink(props)) {
        validChildren.push({ label, labelIcon, url });
      } else {
        (0, import_utils.logErrorInDevMode)(customLinkWrongProps(componentName));
        return;
      }
    }
  });
  const customPageContents = [];
  const customPageLabelIcons = [];
  const customLinkLabelIcons = [];
  validChildren.forEach((cp, index) => {
    if (isCustomPage(cp)) {
      customPageContents.push({ component: cp.children, id: index });
      customPageLabelIcons.push({ component: cp.labelIcon, id: index });
      return;
    }
    if (isExternalLink(cp)) {
      customLinkLabelIcons.push({ component: cp.labelIcon, id: index });
    }
  });
  const customPageContentsPortals = useCustomElementPortal(customPageContents);
  const customPageLabelIconsPortals = useCustomElementPortal(customPageLabelIcons);
  const customLinkLabelIconsPortals = useCustomElementPortal(customLinkLabelIcons);
  const customPages = [];
  const customPagesPortals = [];
  validChildren.forEach((cp, index) => {
    if (isReorderItem(cp, reorderItemsLabels)) {
      customPages.push({ label: cp.label });
      return;
    }
    if (isCustomPage(cp)) {
      const {
        portal: contentPortal,
        mount,
        unmount
      } = customPageContentsPortals.find((p) => p.id === index);
      const {
        portal: labelPortal,
        mount: mountIcon,
        unmount: unmountIcon
      } = customPageLabelIconsPortals.find((p) => p.id === index);
      customPages.push({ label: cp.label, url: cp.url, mount, unmount, mountIcon, unmountIcon });
      customPagesPortals.push(contentPortal);
      customPagesPortals.push(labelPortal);
      return;
    }
    if (isExternalLink(cp)) {
      const {
        portal: labelPortal,
        mount: mountIcon,
        unmount: unmountIcon
      } = customLinkLabelIconsPortals.find((p) => p.id === index);
      customPages.push({ label: cp.label, url: cp.url, mountIcon, unmountIcon });
      customPagesPortals.push(labelPortal);
      return;
    }
  });
  return { customPages, customPagesPortals };
};
var isReorderItem = (childProps, validItems) => {
  const { children, label, url, labelIcon } = childProps;
  return !children && !url && !labelIcon && validItems.some((v) => v === label);
};
var isCustomPage = (childProps) => {
  const { children, label, url, labelIcon } = childProps;
  return !!children && !!url && !!labelIcon && !!label;
};
var isExternalLink = (childProps) => {
  const { children, label, url, labelIcon } = childProps;
  return !children && !!url && !!labelIcon && !!label;
};

// src/utils/useCustomMenuItems.tsx
var import_utils2 = require("@clerk/shared/utils");
var import_react6 = __toESM(require("react"));
var useUserButtonCustomMenuItems = (children, options) => {
  var _a2;
  const reorderItemsLabels = ["manageAccount", "signOut"];
  return useCustomMenuItems({
    children,
    reorderItemsLabels,
    MenuItemsComponent: MenuItems,
    MenuActionComponent: MenuAction,
    MenuLinkComponent: MenuLink,
    UserProfileLinkComponent: UserProfileLink,
    UserProfilePageComponent: UserProfilePage,
    allowForAnyChildren: (_a2 = options == null ? void 0 : options.allowForAnyChildren) != null ? _a2 : false
  });
};
var useCustomMenuItems = ({
  children,
  MenuItemsComponent,
  MenuActionComponent,
  MenuLinkComponent,
  UserProfileLinkComponent,
  UserProfilePageComponent,
  reorderItemsLabels,
  allowForAnyChildren = false
}) => {
  const validChildren = [];
  const customMenuItems = [];
  const customMenuItemsPortals = [];
  import_react6.default.Children.forEach(children, (child) => {
    if (!isThatComponent(child, MenuItemsComponent) && !isThatComponent(child, UserProfileLinkComponent) && !isThatComponent(child, UserProfilePageComponent)) {
      if (child && !allowForAnyChildren) {
        (0, import_utils2.logErrorInDevMode)(userButtonIgnoredComponent);
      }
      return;
    }
    if (isThatComponent(child, UserProfileLinkComponent) || isThatComponent(child, UserProfilePageComponent)) {
      return;
    }
    const { props } = child;
    import_react6.default.Children.forEach(props.children, (child2) => {
      if (!isThatComponent(child2, MenuActionComponent) && !isThatComponent(child2, MenuLinkComponent)) {
        if (child2) {
          (0, import_utils2.logErrorInDevMode)(customMenuItemsIgnoredComponent);
        }
        return;
      }
      const { props: props2 } = child2;
      const { label, labelIcon, href, onClick, open } = props2;
      if (isThatComponent(child2, MenuActionComponent)) {
        if (isReorderItem2(props2, reorderItemsLabels)) {
          validChildren.push({ label });
        } else if (isCustomMenuItem(props2)) {
          const baseItem = {
            label,
            labelIcon
          };
          if (onClick !== void 0) {
            validChildren.push({
              ...baseItem,
              onClick
            });
          } else if (open !== void 0) {
            validChildren.push({
              ...baseItem,
              open: open.startsWith("/") ? open : `/${open}`
            });
          } else {
            (0, import_utils2.logErrorInDevMode)("Custom menu item must have either onClick or open property");
            return;
          }
        } else {
          (0, import_utils2.logErrorInDevMode)(userButtonMenuItemsActionWrongsProps);
          return;
        }
      }
      if (isThatComponent(child2, MenuLinkComponent)) {
        if (isExternalLink2(props2)) {
          validChildren.push({ label, labelIcon, href });
        } else {
          (0, import_utils2.logErrorInDevMode)(userButtonMenuItemLinkWrongProps);
          return;
        }
      }
    });
  });
  const customMenuItemLabelIcons = [];
  const customLinkLabelIcons = [];
  validChildren.forEach((mi, index) => {
    if (isCustomMenuItem(mi)) {
      customMenuItemLabelIcons.push({ component: mi.labelIcon, id: index });
    }
    if (isExternalLink2(mi)) {
      customLinkLabelIcons.push({ component: mi.labelIcon, id: index });
    }
  });
  const customMenuItemLabelIconsPortals = useCustomElementPortal(customMenuItemLabelIcons);
  const customLinkLabelIconsPortals = useCustomElementPortal(customLinkLabelIcons);
  validChildren.forEach((mi, index) => {
    if (isReorderItem2(mi, reorderItemsLabels)) {
      customMenuItems.push({
        label: mi.label
      });
    }
    if (isCustomMenuItem(mi)) {
      const {
        portal: iconPortal,
        mount: mountIcon,
        unmount: unmountIcon
      } = customMenuItemLabelIconsPortals.find((p) => p.id === index);
      const menuItem = {
        label: mi.label,
        mountIcon,
        unmountIcon
      };
      if ("onClick" in mi) {
        menuItem.onClick = mi.onClick;
      } else if ("open" in mi) {
        menuItem.open = mi.open;
      }
      customMenuItems.push(menuItem);
      customMenuItemsPortals.push(iconPortal);
    }
    if (isExternalLink2(mi)) {
      const {
        portal: iconPortal,
        mount: mountIcon,
        unmount: unmountIcon
      } = customLinkLabelIconsPortals.find((p) => p.id === index);
      customMenuItems.push({
        label: mi.label,
        href: mi.href,
        mountIcon,
        unmountIcon
      });
      customMenuItemsPortals.push(iconPortal);
    }
  });
  return { customMenuItems, customMenuItemsPortals };
};
var isReorderItem2 = (childProps, validItems) => {
  const { children, label, onClick, labelIcon } = childProps;
  return !children && !onClick && !labelIcon && validItems.some((v) => v === label);
};
var isCustomMenuItem = (childProps) => {
  const { label, labelIcon, onClick, open } = childProps;
  return !!labelIcon && !!label && (typeof onClick === "function" || typeof open === "string");
};
var isExternalLink2 = (childProps) => {
  const { label, href, labelIcon } = childProps;
  return !!href && !!labelIcon && !!label;
};

// src/utils/useWaitForComponentMount.ts
var import_react7 = require("react");
var createAwaitableMutationObserver = (globalOptions) => {
  const isReady = globalOptions == null ? void 0 : globalOptions.isReady;
  return (options) => new Promise((resolve, reject) => {
    const { root = document == null ? void 0 : document.body, selector, timeout = 0 } = options;
    if (!root) {
      reject(new Error("No root element provided"));
      return;
    }
    let elementToWatch = root;
    if (selector) {
      elementToWatch = root == null ? void 0 : root.querySelector(selector);
    }
    if (isReady(elementToWatch, selector)) {
      resolve();
      return;
    }
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (!elementToWatch && selector) {
          elementToWatch = root == null ? void 0 : root.querySelector(selector);
        }
        if (globalOptions.childList && mutation.type === "childList" || globalOptions.attributes && mutation.type === "attributes") {
          if (isReady(elementToWatch, selector)) {
            observer.disconnect();
            resolve();
            return;
          }
        }
      }
    });
    observer.observe(root, globalOptions);
    if (timeout > 0) {
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Timeout waiting for ${selector}`));
      }, timeout);
    }
  });
};
var waitForElementChildren = createAwaitableMutationObserver({
  childList: true,
  subtree: true,
  isReady: (el, selector) => {
    var _a2;
    return !!(el == null ? void 0 : el.childElementCount) && ((_a2 = el == null ? void 0 : el.matches) == null ? void 0 : _a2.call(el, selector)) && el.childElementCount > 0;
  }
});
function useWaitForComponentMount(component, options) {
  const watcherRef = (0, import_react7.useRef)();
  const [status, setStatus] = (0, import_react7.useState)("rendering");
  (0, import_react7.useEffect)(() => {
    if (!component) {
      throw new Error("Clerk: no component name provided, unable to detect mount.");
    }
    if (typeof window !== "undefined" && !watcherRef.current) {
      const defaultSelector = `[data-clerk-component="${component}"]`;
      const selector = options == null ? void 0 : options.selector;
      watcherRef.current = waitForElementChildren({
        selector: selector ? (
          // Allows for `[data-clerk-component="xxxx"][data-some-attribute="123"] .my-class`
          defaultSelector + selector
        ) : defaultSelector
      }).then(() => {
        setStatus("rendered");
      }).catch(() => {
        setStatus("error");
      });
    }
  }, [component, options == null ? void 0 : options.selector]);
  return status;
}

// src/components/ClerkHostRenderer.tsx
var import_object = require("@clerk/shared/object");
var import_react8 = require("@clerk/shared/react");
var import_react9 = __toESM(require("react"));
var isMountProps = (props) => {
  return "mount" in props;
};
var isOpenProps = (props) => {
  return "open" in props;
};
var stripMenuItemIconHandlers = (menuItems) => {
  return menuItems == null ? void 0 : menuItems.map(({ mountIcon, unmountIcon, ...rest }) => rest);
};
var ClerkHostRenderer = class extends import_react9.default.PureComponent {
  constructor() {
    super(...arguments);
    this.rootRef = import_react9.default.createRef();
  }
  componentDidUpdate(_prevProps) {
    var _a2, _b, _c, _d;
    if (!isMountProps(_prevProps) || !isMountProps(this.props)) {
      return;
    }
    const prevProps = (0, import_object.without)(_prevProps.props, "customPages", "customMenuItems", "children");
    const newProps = (0, import_object.without)(this.props.props, "customPages", "customMenuItems", "children");
    const customPagesChanged = ((_a2 = prevProps.customPages) == null ? void 0 : _a2.length) !== ((_b = newProps.customPages) == null ? void 0 : _b.length);
    const customMenuItemsChanged = ((_c = prevProps.customMenuItems) == null ? void 0 : _c.length) !== ((_d = newProps.customMenuItems) == null ? void 0 : _d.length);
    const prevMenuItemsWithoutHandlers = stripMenuItemIconHandlers(_prevProps.props.customMenuItems);
    const newMenuItemsWithoutHandlers = stripMenuItemIconHandlers(this.props.props.customMenuItems);
    if (!(0, import_react8.isDeeplyEqual)(prevProps, newProps) || !(0, import_react8.isDeeplyEqual)(prevMenuItemsWithoutHandlers, newMenuItemsWithoutHandlers) || customPagesChanged || customMenuItemsChanged) {
      if (this.rootRef.current) {
        this.props.updateProps({ node: this.rootRef.current, props: this.props.props });
      }
    }
  }
  componentDidMount() {
    if (this.rootRef.current) {
      if (isMountProps(this.props)) {
        this.props.mount(this.rootRef.current, this.props.props);
      }
      if (isOpenProps(this.props)) {
        this.props.open(this.props.props);
      }
    }
  }
  componentWillUnmount() {
    if (this.rootRef.current) {
      if (isMountProps(this.props)) {
        this.props.unmount(this.rootRef.current);
      }
      if (isOpenProps(this.props)) {
        this.props.close();
      }
    }
  }
  render() {
    const { hideRootHtmlElement = false } = this.props;
    const rootAttributes = {
      ref: this.rootRef,
      ...this.props.rootProps,
      ...this.props.component && { "data-clerk-component": this.props.component }
    };
    return /* @__PURE__ */ import_react9.default.createElement(import_react9.default.Fragment, null, !hideRootHtmlElement && /* @__PURE__ */ import_react9.default.createElement("div", { ...rootAttributes }), this.props.children);
  }
};

// src/components/withClerk.tsx
var import_react12 = require("@clerk/shared/react");
var import_react13 = __toESM(require("react"));

// src/contexts/IsomorphicClerkContext.tsx
var import_react10 = require("@clerk/shared/react");
var useIsomorphicClerkContext = import_react10.useClerkInstanceContext;

// src/hooks/useAssertWrappedByClerkProvider.ts
var import_react11 = require("@clerk/shared/react");
var useAssertWrappedByClerkProvider = (source) => {
  (0, import_react11.useAssertWrappedByClerkProvider)(() => {
    errorThrower.throwMissingClerkProviderError({ source });
  });
};

// src/components/withClerk.tsx
var withClerk = (Component, displayNameOrOptions) => {
  const passedDisplayedName = typeof displayNameOrOptions === "string" ? displayNameOrOptions : displayNameOrOptions == null ? void 0 : displayNameOrOptions.component;
  const displayName = passedDisplayedName || Component.displayName || Component.name || "Component";
  Component.displayName = displayName;
  const options = typeof displayNameOrOptions === "string" ? void 0 : displayNameOrOptions;
  const HOC = (props) => {
    useAssertWrappedByClerkProvider(displayName || "withClerk");
    const clerk = useIsomorphicClerkContext();
    const getContainer = (0, import_react12.usePortalRoot)();
    if (!clerk.loaded && !(options == null ? void 0 : options.renderWhileLoading)) {
      return null;
    }
    return /* @__PURE__ */ import_react13.default.createElement(
      Component,
      {
        getContainer,
        ...props,
        component: displayName,
        clerk
      }
    );
  };
  HOC.displayName = `withClerk(${displayName})`;
  return HOC;
};

// src/components/uiComponents.tsx
var CustomPortalsRenderer = (props) => {
  var _a2, _b;
  return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, (_a2 = props == null ? void 0 : props.customPagesPortals) == null ? void 0 : _a2.map((portal, index) => (0, import_react14.createElement)(portal, { key: index })), (_b = props == null ? void 0 : props.customMenuItemsPortals) == null ? void 0 : _b.map((portal, index) => (0, import_react14.createElement)(portal, { key: index })));
};
var SignIn = withClerk(
  ({ clerk, component, fallback, ...props }) => {
    const mountingStatus = useWaitForComponentMount(component);
    const shouldShowFallback = mountingStatus === "rendering" || !clerk.loaded;
    const rendererRootProps = {
      ...shouldShowFallback && fallback && { style: { display: "none" } }
    };
    return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react14.default.createElement(
      ClerkHostRenderer,
      {
        component,
        mount: clerk.mountSignIn,
        unmount: clerk.unmountSignIn,
        updateProps: clerk.__internal_updateProps,
        props,
        rootProps: rendererRootProps
      }
    ));
  },
  { component: "SignIn", renderWhileLoading: true }
);
var SignUp = withClerk(
  ({ clerk, component, fallback, ...props }) => {
    const mountingStatus = useWaitForComponentMount(component);
    const shouldShowFallback = mountingStatus === "rendering" || !clerk.loaded;
    const rendererRootProps = {
      ...shouldShowFallback && fallback && { style: { display: "none" } }
    };
    return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react14.default.createElement(
      ClerkHostRenderer,
      {
        component,
        mount: clerk.mountSignUp,
        unmount: clerk.unmountSignUp,
        updateProps: clerk.__internal_updateProps,
        props,
        rootProps: rendererRootProps
      }
    ));
  },
  { component: "SignUp", renderWhileLoading: true }
);
function UserProfilePage({ children }) {
  (0, import_utils3.logErrorInDevMode)(userProfilePageRenderedError);
  return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, children);
}
function UserProfileLink({ children }) {
  (0, import_utils3.logErrorInDevMode)(userProfileLinkRenderedError);
  return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, children);
}
var _UserProfile = withClerk(
  ({
    clerk,
    component,
    fallback,
    ...props
  }) => {
    const mountingStatus = useWaitForComponentMount(component);
    const shouldShowFallback = mountingStatus === "rendering" || !clerk.loaded;
    const rendererRootProps = {
      ...shouldShowFallback && fallback && { style: { display: "none" } }
    };
    const { customPages, customPagesPortals } = useUserProfileCustomPages(props.children);
    return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, shouldShowFallback && fallback, /* @__PURE__ */ import_react14.default.createElement(
      ClerkHostRenderer,
      {
        component,
        mount: clerk.mountUserProfile,
        unmount: clerk.unmountUserProfile,
        updateProps: clerk.__internal_updateProps,
        props: { ...props, customPages },
        rootProps: rendererRootProps
      },
      /* @__PURE__ */ import_react14.default.createElement(CustomPortalsRenderer, { customPagesPortals })
    ));
  },
  { component: "UserProfile", renderWhileLoading: true }
);
var UserProfile = Object.assign(_UserProfile, {
  Page: UserProfilePage,
  Link: UserProfileLink
});
var UserButtonContext = (0, import_react14.createContext)({
  mount: () => {
  },
  unmount: () => {
  },
  updateProps: () => {
  }
});
var _UserButton = withClerk(
  ({
    clerk,
    component,
    fallback,
    ...props
  }) => {
    const mountingStatus = useWaitForComponentMount(component);
    const shouldShowFallback = mountingStatus === "rendering" || !clerk.loaded;
    const rendererRootProps = {
      ...shouldShowFallback && fallback && { style: { display: "none" } }
    };
    const { customPages, customPagesPortals } = useUserProfileCustomPages(props.children, {
      allowForAnyChildren: !!props.__experimental_asProvider
    });
    const userProfileProps = { ...props.userProfileProps, customPages };
    const { customMenuItems, customMenuItemsPortals } = useUserButtonCustomMenuItems(props.children, {
      allowForAnyChildren: !!props.__experimental_asProvider
    });
    const sanitizedChildren = useSanitizedChildren(props.children);
    const passableProps = {
      mount: clerk.mountUserButton,
      unmount: clerk.unmountUserButton,
      updateProps: clerk.__internal_updateProps,
      props: { ...props, userProfileProps, customMenuItems }
    };
    const portalProps = {
      customPagesPortals,
      customMenuItemsPortals
    };
    return /* @__PURE__ */ import_react14.default.createElement(UserButtonContext.Provider, { value: passableProps }, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react14.default.createElement(
      ClerkHostRenderer,
      {
        component,
        ...passableProps,
        hideRootHtmlElement: !!props.__experimental_asProvider,
        rootProps: rendererRootProps
      },
      props.__experimental_asProvider ? sanitizedChildren : null,
      /* @__PURE__ */ import_react14.default.createElement(CustomPortalsRenderer, { ...portalProps })
    ));
  },
  { component: "UserButton", renderWhileLoading: true }
);
function MenuItems({ children }) {
  (0, import_utils3.logErrorInDevMode)(userButtonMenuItemsRenderedError);
  return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, children);
}
function MenuAction({ children }) {
  (0, import_utils3.logErrorInDevMode)(userButtonMenuActionRenderedError);
  return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, children);
}
function MenuLink({ children }) {
  (0, import_utils3.logErrorInDevMode)(userButtonMenuLinkRenderedError);
  return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, children);
}
function UserButtonOutlet(outletProps) {
  const providerProps = (0, import_react14.useContext)(UserButtonContext);
  const portalProps = {
    ...providerProps,
    props: {
      ...providerProps.props,
      ...outletProps
    }
  };
  return /* @__PURE__ */ import_react14.default.createElement(ClerkHostRenderer, { ...portalProps });
}
var UserButton = Object.assign(_UserButton, {
  UserProfilePage,
  UserProfileLink,
  MenuItems,
  Action: MenuAction,
  Link: MenuLink,
  __experimental_Outlet: UserButtonOutlet
});
function OrganizationProfilePage({ children }) {
  (0, import_utils3.logErrorInDevMode)(organizationProfilePageRenderedError);
  return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, children);
}
function OrganizationProfileLink({ children }) {
  (0, import_utils3.logErrorInDevMode)(organizationProfileLinkRenderedError);
  return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, children);
}
var _OrganizationProfile = withClerk(
  ({
    clerk,
    component,
    fallback,
    ...props
  }) => {
    const mountingStatus = useWaitForComponentMount(component);
    const shouldShowFallback = mountingStatus === "rendering" || !clerk.loaded;
    const rendererRootProps = {
      ...shouldShowFallback && fallback && { style: { display: "none" } }
    };
    const { customPages, customPagesPortals } = useOrganizationProfileCustomPages(props.children);
    return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react14.default.createElement(
      ClerkHostRenderer,
      {
        component,
        mount: clerk.mountOrganizationProfile,
        unmount: clerk.unmountOrganizationProfile,
        updateProps: clerk.__internal_updateProps,
        props: { ...props, customPages },
        rootProps: rendererRootProps
      },
      /* @__PURE__ */ import_react14.default.createElement(CustomPortalsRenderer, { customPagesPortals })
    ));
  },
  { component: "OrganizationProfile", renderWhileLoading: true }
);
var OrganizationProfile = Object.assign(_OrganizationProfile, {
  Page: OrganizationProfilePage,
  Link: OrganizationProfileLink
});
var CreateOrganization = withClerk(
  ({ clerk, component, fallback, ...props }) => {
    const mountingStatus = useWaitForComponentMount(component);
    const shouldShowFallback = mountingStatus === "rendering" || !clerk.loaded;
    const rendererRootProps = {
      ...shouldShowFallback && fallback && { style: { display: "none" } }
    };
    return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react14.default.createElement(
      ClerkHostRenderer,
      {
        component,
        mount: clerk.mountCreateOrganization,
        unmount: clerk.unmountCreateOrganization,
        updateProps: clerk.__internal_updateProps,
        props,
        rootProps: rendererRootProps
      }
    ));
  },
  { component: "CreateOrganization", renderWhileLoading: true }
);
var OrganizationSwitcherContext = (0, import_react14.createContext)({
  mount: () => {
  },
  unmount: () => {
  },
  updateProps: () => {
  }
});
var _OrganizationSwitcher = withClerk(
  ({
    clerk,
    component,
    fallback,
    ...props
  }) => {
    const mountingStatus = useWaitForComponentMount(component);
    const shouldShowFallback = mountingStatus === "rendering" || !clerk.loaded;
    const rendererRootProps = {
      ...shouldShowFallback && fallback && { style: { display: "none" } }
    };
    const { customPages, customPagesPortals } = useOrganizationProfileCustomPages(props.children, {
      allowForAnyChildren: !!props.__experimental_asProvider
    });
    const organizationProfileProps = { ...props.organizationProfileProps, customPages };
    const sanitizedChildren = useSanitizedChildren(props.children);
    const passableProps = {
      mount: clerk.mountOrganizationSwitcher,
      unmount: clerk.unmountOrganizationSwitcher,
      updateProps: clerk.__internal_updateProps,
      props: { ...props, organizationProfileProps },
      rootProps: rendererRootProps,
      component
    };
    clerk.__experimental_prefetchOrganizationSwitcher();
    return /* @__PURE__ */ import_react14.default.createElement(OrganizationSwitcherContext.Provider, { value: passableProps }, /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react14.default.createElement(
      ClerkHostRenderer,
      {
        ...passableProps,
        hideRootHtmlElement: !!props.__experimental_asProvider
      },
      props.__experimental_asProvider ? sanitizedChildren : null,
      /* @__PURE__ */ import_react14.default.createElement(CustomPortalsRenderer, { customPagesPortals })
    )));
  },
  { component: "OrganizationSwitcher", renderWhileLoading: true }
);
function OrganizationSwitcherOutlet(outletProps) {
  const providerProps = (0, import_react14.useContext)(OrganizationSwitcherContext);
  const portalProps = {
    ...providerProps,
    props: {
      ...providerProps.props,
      ...outletProps
    }
  };
  return /* @__PURE__ */ import_react14.default.createElement(ClerkHostRenderer, { ...portalProps });
}
var OrganizationSwitcher = Object.assign(_OrganizationSwitcher, {
  OrganizationProfilePage,
  OrganizationProfileLink,
  __experimental_Outlet: OrganizationSwitcherOutlet
});
var OrganizationList = withClerk(
  ({ clerk, component, fallback, ...props }) => {
    const mountingStatus = useWaitForComponentMount(component);
    const shouldShowFallback = mountingStatus === "rendering" || !clerk.loaded;
    const rendererRootProps = {
      ...shouldShowFallback && fallback && { style: { display: "none" } }
    };
    return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react14.default.createElement(
      ClerkHostRenderer,
      {
        component,
        mount: clerk.mountOrganizationList,
        unmount: clerk.unmountOrganizationList,
        updateProps: clerk.__internal_updateProps,
        props,
        rootProps: rendererRootProps
      }
    ));
  },
  { component: "OrganizationList", renderWhileLoading: true }
);
var GoogleOneTap = withClerk(
  ({ clerk, component, fallback, ...props }) => {
    const mountingStatus = useWaitForComponentMount(component);
    const shouldShowFallback = mountingStatus === "rendering" || !clerk.loaded;
    const rendererRootProps = {
      ...shouldShowFallback && fallback && { style: { display: "none" } }
    };
    return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react14.default.createElement(
      ClerkHostRenderer,
      {
        component,
        open: clerk.openGoogleOneTap,
        close: clerk.closeGoogleOneTap,
        updateProps: clerk.__internal_updateProps,
        props,
        rootProps: rendererRootProps
      }
    ));
  },
  { component: "GoogleOneTap", renderWhileLoading: true }
);
var Waitlist = withClerk(
  ({ clerk, component, fallback, ...props }) => {
    const mountingStatus = useWaitForComponentMount(component);
    const shouldShowFallback = mountingStatus === "rendering" || !clerk.loaded;
    const rendererRootProps = {
      ...shouldShowFallback && fallback && { style: { display: "none" } }
    };
    return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react14.default.createElement(
      ClerkHostRenderer,
      {
        component,
        mount: clerk.mountWaitlist,
        unmount: clerk.unmountWaitlist,
        updateProps: clerk.__internal_updateProps,
        props,
        rootProps: rendererRootProps
      }
    ));
  },
  { component: "Waitlist", renderWhileLoading: true }
);
var PricingTable = withClerk(
  ({ clerk, component, fallback, ...props }) => {
    const mountingStatus = useWaitForComponentMount(component, {
      // This attribute is added to the PricingTable root element after we've successfully fetched the plans asynchronously.
      selector: '[data-component-status="ready"]'
    });
    const shouldShowFallback = mountingStatus === "rendering" || !clerk.loaded;
    const rendererRootProps = {
      ...shouldShowFallback && fallback && { style: { display: "none" } }
    };
    return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react14.default.createElement(
      ClerkHostRenderer,
      {
        component,
        mount: clerk.mountPricingTable,
        unmount: clerk.unmountPricingTable,
        updateProps: clerk.__internal_updateProps,
        props,
        rootProps: rendererRootProps
      }
    ));
  },
  { component: "PricingTable", renderWhileLoading: true }
);
var APIKeys = withClerk(
  ({ clerk, component, fallback, ...props }) => {
    const mountingStatus = useWaitForComponentMount(component);
    const shouldShowFallback = mountingStatus === "rendering" || !clerk.loaded;
    const rendererRootProps = {
      ...shouldShowFallback && fallback && { style: { display: "none" } }
    };
    return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react14.default.createElement(
      ClerkHostRenderer,
      {
        component,
        mount: clerk.mountAPIKeys,
        unmount: clerk.unmountAPIKeys,
        updateProps: clerk.__internal_updateProps,
        props,
        rootProps: rendererRootProps
      }
    ));
  },
  { component: "ApiKeys", renderWhileLoading: true }
);
var ConfigureSSO = withClerk(
  ({ clerk, component, fallback, ...props }) => {
    const mountingStatus = useWaitForComponentMount(component);
    const shouldShowFallback = mountingStatus === "rendering" || !clerk.loaded;
    const rendererRootProps = {
      ...shouldShowFallback && fallback && { style: { display: "none" } }
    };
    return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react14.default.createElement(
      ClerkHostRenderer,
      {
        component,
        mount: clerk.mountConfigureSSO,
        unmount: clerk.unmountConfigureSSO,
        updateProps: clerk.__internal_updateProps,
        props,
        rootProps: rendererRootProps
      }
    ));
  },
  { component: "ConfigureSSO", renderWhileLoading: true }
);
var OAuthConsent = withClerk(
  ({ clerk, component, fallback, ...props }) => {
    const mountingStatus = useWaitForComponentMount(component);
    const shouldShowFallback = mountingStatus === "rendering" || !clerk.loaded;
    const rendererRootProps = {
      ...shouldShowFallback && fallback && { style: { display: "none" } }
    };
    return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react14.default.createElement(
      ClerkHostRenderer,
      {
        component,
        mount: clerk.__internal_mountOAuthConsent,
        unmount: clerk.__internal_unmountOAuthConsent,
        updateProps: clerk.__internal_updateProps,
        props,
        rootProps: rendererRootProps
      }
    ));
  },
  { component: "OAuthConsent", renderWhileLoading: true }
);
var UserAvatar = withClerk(
  ({ clerk, component, fallback, ...props }) => {
    const mountingStatus = useWaitForComponentMount(component);
    const shouldShowFallback = mountingStatus === "rendering" || !clerk.loaded;
    const rendererRootProps = {
      ...shouldShowFallback && fallback && { style: { display: "none" } }
    };
    return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react14.default.createElement(
      ClerkHostRenderer,
      {
        component,
        mount: clerk.mountUserAvatar,
        unmount: clerk.unmountUserAvatar,
        updateProps: clerk.__internal_updateProps,
        props,
        rootProps: rendererRootProps
      }
    ));
  },
  { component: "UserAvatar", renderWhileLoading: true }
);
var TaskChooseOrganization = withClerk(
  ({ clerk, component, fallback, ...props }) => {
    const mountingStatus = useWaitForComponentMount(component);
    const shouldShowFallback = mountingStatus === "rendering" || !clerk.loaded;
    const rendererRootProps = {
      ...shouldShowFallback && fallback && { style: { display: "none" } }
    };
    return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react14.default.createElement(
      ClerkHostRenderer,
      {
        component,
        mount: clerk.mountTaskChooseOrganization,
        unmount: clerk.unmountTaskChooseOrganization,
        updateProps: clerk.__internal_updateProps,
        props,
        rootProps: rendererRootProps
      }
    ));
  },
  { component: "TaskChooseOrganization", renderWhileLoading: true }
);
var TaskResetPassword = withClerk(
  ({ clerk, component, fallback, ...props }) => {
    const mountingStatus = useWaitForComponentMount(component);
    const shouldShowFallback = mountingStatus === "rendering" || !clerk.loaded;
    const rendererRootProps = {
      ...shouldShowFallback && fallback && { style: { display: "none" } }
    };
    return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react14.default.createElement(
      ClerkHostRenderer,
      {
        component,
        mount: clerk.mountTaskResetPassword,
        unmount: clerk.unmountTaskResetPassword,
        updateProps: clerk.__internal_updateProps,
        props,
        rootProps: rendererRootProps
      }
    ));
  },
  { component: "TaskResetPassword", renderWhileLoading: true }
);
var TaskSetupMFA = withClerk(
  ({ clerk, component, fallback, ...props }) => {
    const mountingStatus = useWaitForComponentMount(component);
    const shouldShowFallback = mountingStatus === "rendering" || !clerk.loaded;
    const rendererRootProps = {
      ...shouldShowFallback && fallback && { style: { display: "none" } }
    };
    return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ import_react14.default.createElement(
      ClerkHostRenderer,
      {
        component,
        mount: clerk.mountTaskSetupMFA,
        unmount: clerk.unmountTaskSetupMFA,
        updateProps: clerk.__internal_updateProps,
        props,
        rootProps: rendererRootProps
      }
    ));
  },
  { component: "TaskSetupMFA", renderWhileLoading: true }
);

// src/components/controlComponents.tsx
var import_deprecated = require("@clerk/shared/deprecated");
var import_react21 = require("@clerk/shared/react");
var import_react22 = __toESM(require("react"));

// src/hooks/useAuth.ts
var import_authorization = require("@clerk/shared/authorization");
var import_telemetry = require("@clerk/shared/telemetry");
var import_react17 = require("react");

// src/hooks/useAuthBase.tsx
var import_deriveState = require("@clerk/shared/deriveState");
var import_react15 = require("@clerk/shared/react");
var import_react16 = require("react");
var defaultDerivedInitialState = {
  actor: void 0,
  factorVerificationAge: null,
  orgId: void 0,
  orgPermissions: void 0,
  orgRole: void 0,
  orgSlug: void 0,
  sessionClaims: void 0,
  sessionId: void 0,
  sessionStatus: void 0,
  userId: void 0
};
function useAuthBase() {
  const clerk = (0, import_react15.useClerkInstanceContext)();
  const initialState = (0, import_react15.useInitialStateContext)();
  const getInitialState = (0, import_react16.useCallback)(() => initialState, [initialState]);
  const state = (0, import_react16.useSyncExternalStore)(
    (0, import_react16.useCallback)((callback) => clerk.addListener(callback, { skipInitialEmit: true }), [clerk]),
    (0, import_react16.useCallback)(() => {
      if (!clerk.loaded || !clerk.__internal_lastEmittedResources) {
        return getInitialState();
      }
      return clerk.__internal_lastEmittedResources;
    }, [clerk, getInitialState]),
    getInitialState
  );
  const authState = (0, import_react16.useMemo)(() => {
    if (!state) {
      return defaultDerivedInitialState;
    }
    const fullState = isInitialState(state) ? (0, import_deriveState.deriveState)(false, {}, state) : (0, import_deriveState.deriveState)(true, state, void 0);
    return authStateFromFull(fullState);
  }, [state]);
  return authState;
}
function authStateFromFull(derivedState) {
  return {
    sessionId: derivedState.sessionId,
    sessionStatus: derivedState.sessionStatus,
    sessionClaims: derivedState.sessionClaims,
    userId: derivedState.userId,
    actor: derivedState.actor,
    orgId: derivedState.orgId,
    orgRole: derivedState.orgRole,
    orgSlug: derivedState.orgSlug,
    orgPermissions: derivedState.orgPermissions,
    factorVerificationAge: derivedState.factorVerificationAge
  };
}
function isInitialState(state) {
  return !("client" in state);
}

// src/hooks/utils.ts
var import_browser = require("@clerk/shared/browser");
var import_error2 = require("@clerk/shared/error");
var clerkLoaded = (isomorphicClerk) => {
  return new Promise((resolve) => {
    const handler = (status) => {
      if (["ready", "degraded"].includes(status)) {
        resolve();
        isomorphicClerk.off("status", handler);
      }
    };
    isomorphicClerk.on("status", handler, { notify: true });
  });
};
var createGetToken = (isomorphicClerk) => {
  return async (options) => {
    if (!(0, import_browser.inBrowser)()) {
      throw new import_error2.ClerkRuntimeError(
        "useAuth().getToken() can only be used in browser environments. To access auth data server-side, see the Auth object reference doc: https://clerk.com/docs/reference/backend/types/auth-object",
        {
          code: "clerk_runtime_not_browser"
        }
      );
    }
    await clerkLoaded(isomorphicClerk);
    if (!isomorphicClerk.session) {
      return null;
    }
    return isomorphicClerk.session.getToken(options);
  };
};
var createSignOut = (isomorphicClerk) => {
  return async (...args) => {
    await clerkLoaded(isomorphicClerk);
    return isomorphicClerk.signOut(...args);
  };
};

// src/hooks/useAuth.ts
var useAuth = (options = {}) => {
  var _a2;
  useAssertWrappedByClerkProvider("useAuth");
  const { treatPendingAsSignedOut } = options != null ? options : {};
  const authState = useAuthBase();
  const isomorphicClerk = useIsomorphicClerkContext();
  const getToken2 = (0, import_react17.useCallback)(createGetToken(isomorphicClerk), [isomorphicClerk]);
  const signOut = (0, import_react17.useCallback)(createSignOut(isomorphicClerk), [isomorphicClerk]);
  (_a2 = isomorphicClerk.telemetry) == null ? void 0 : _a2.record((0, import_telemetry.eventMethodCalled)("useAuth", { treatPendingAsSignedOut }));
  return useDerivedAuth(
    {
      ...authState,
      getToken: getToken2,
      signOut
    },
    {
      treatPendingAsSignedOut
    }
  );
};
function useDerivedAuth(authObject, { treatPendingAsSignedOut = true } = {}) {
  const { userId, orgId, orgRole, has, signOut, getToken: getToken2, orgPermissions, factorVerificationAge, sessionClaims } = authObject != null ? authObject : {};
  const derivedHas = (0, import_react17.useCallback)(
    (params) => {
      if (has) {
        return has(params);
      }
      return (0, import_authorization.createCheckAuthorization)({
        userId,
        orgId,
        orgRole,
        orgPermissions,
        factorVerificationAge,
        features: (sessionClaims == null ? void 0 : sessionClaims.fea) || "",
        plans: (sessionClaims == null ? void 0 : sessionClaims.pla) || ""
      })(params);
    },
    [has, userId, orgId, orgRole, orgPermissions, factorVerificationAge, sessionClaims]
  );
  const payload = (0, import_authorization.resolveAuthState)({
    authObject: {
      ...authObject,
      getToken: getToken2,
      signOut,
      has: derivedHas
    },
    options: {
      treatPendingAsSignedOut
    }
  });
  if (!payload) {
    return errorThrower.throw(invalidStateError);
  }
  return payload;
}

// src/hooks/useEmailLink.ts
var import_react18 = __toESM(require("react"));
function useEmailLink(resource) {
  const { startEmailLinkFlow, cancelEmailLinkFlow } = import_react18.default.useMemo(() => resource.createEmailLinkFlow(), [resource]);
  import_react18.default.useEffect(() => {
    return cancelEmailLinkFlow;
  }, []);
  return {
    startEmailLinkFlow,
    cancelEmailLinkFlow
  };
}

// src/hooks/useClerkSignal.ts
var import_telemetry2 = require("@clerk/shared/telemetry");
var import_react19 = require("react");
function useClerkSignal(signal) {
  var _a2, _b, _c;
  useAssertWrappedByClerkProvider("useClerkSignal");
  const clerk = useIsomorphicClerkContext();
  switch (signal) {
    case "signIn":
      (_a2 = clerk.telemetry) == null ? void 0 : _a2.record((0, import_telemetry2.eventMethodCalled)("useSignIn", { apiVersion: "2025-11" }));
      break;
    case "signUp":
      (_b = clerk.telemetry) == null ? void 0 : _b.record((0, import_telemetry2.eventMethodCalled)("useSignUp", { apiVersion: "2025-11" }));
      break;
    case "waitlist":
      (_c = clerk.telemetry) == null ? void 0 : _c.record((0, import_telemetry2.eventMethodCalled)("useWaitlist", { apiVersion: "2025-11" }));
      break;
    default:
      break;
  }
  const subscribe = (0, import_react19.useCallback)(
    (callback) => {
      if (!clerk.loaded) {
        return () => {
        };
      }
      return clerk.__internal_state.__internal_effect(() => {
        switch (signal) {
          case "signIn":
            clerk.__internal_state.signInSignal();
            break;
          case "signUp":
            clerk.__internal_state.signUpSignal();
            break;
          case "waitlist":
            clerk.__internal_state.waitlistSignal();
            break;
          default:
            throw new Error(`Unknown signal: ${signal}`);
        }
        callback();
      });
    },
    [clerk, clerk.loaded, clerk.__internal_state]
  );
  const getSnapshot = (0, import_react19.useCallback)(() => {
    switch (signal) {
      case "signIn":
        return clerk.__internal_state.signInSignal();
      case "signUp":
        return clerk.__internal_state.signUpSignal();
      case "waitlist":
        return clerk.__internal_state.waitlistSignal();
      default:
        throw new Error(`Unknown signal: ${signal}`);
    }
  }, [clerk.__internal_state]);
  const value = (0, import_react19.useSyncExternalStore)(subscribe, getSnapshot, getSnapshot);
  return value;
}
var useSignIn = () => {
  return useClerkSignal("signIn");
};
var useSignUp = () => {
  return useClerkSignal("signUp");
};
function useWaitlist() {
  return useClerkSignal("waitlist");
}

// src/hooks/index.ts
var import_react20 = require("@clerk/shared/react");

// src/components/controlComponents.tsx
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
  var _a2, _b;
  const { client, session } = clerk;
  const hasSignedInSessions = ((_b = (_a2 = client.signedInSessions) == null ? void 0 : _a2.length) != null ? _b : 0) > 0;
  import_react22.default.useEffect(() => {
    if (session === null && hasSignedInSessions) {
      void clerk.redirectToAfterSignOut();
    } else {
      void clerk.redirectToSignIn(props);
    }
  }, []);
  return null;
}, "RedirectToSignIn");
var RedirectToSignUp = withClerk(({ clerk, ...props }) => {
  import_react22.default.useEffect(() => {
    void clerk.redirectToSignUp(props);
  }, []);
  return null;
}, "RedirectToSignUp");
var RedirectToTasks = withClerk(({ clerk, ...props }) => {
  import_react22.default.useEffect(() => {
    void clerk.redirectToTasks(props);
  }, []);
  return null;
}, "RedirectToTasks");
var RedirectToUserProfile = withClerk(({ clerk }) => {
  import_react22.default.useEffect(() => {
    (0, import_deprecated.deprecated)("RedirectToUserProfile", "Use the `redirectToUserProfile()` method instead.");
    void clerk.redirectToUserProfile();
  }, []);
  return null;
}, "RedirectToUserProfile");
var RedirectToOrganizationProfile = withClerk(({ clerk }) => {
  import_react22.default.useEffect(() => {
    (0, import_deprecated.deprecated)("RedirectToOrganizationProfile", "Use the `redirectToOrganizationProfile()` method instead.");
    void clerk.redirectToOrganizationProfile();
  }, []);
  return null;
}, "RedirectToOrganizationProfile");
var RedirectToCreateOrganization = withClerk(({ clerk }) => {
  import_react22.default.useEffect(() => {
    (0, import_deprecated.deprecated)("RedirectToCreateOrganization", "Use the `redirectToCreateOrganization()` method instead.");
    void clerk.redirectToCreateOrganization();
  }, []);
  return null;
}, "RedirectToCreateOrganization");
var AuthenticateWithRedirectCallback = withClerk(
  ({ clerk, ...handleRedirectCallbackParams }) => {
    import_react22.default.useEffect(() => {
      void clerk.handleRedirectCallback(handleRedirectCallbackParams);
    }, []);
    return null;
  },
  "AuthenticateWithRedirectCallback"
);

// src/components/SignInButton.tsx
var import_react23 = __toESM(require("react"));
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
    return import_react23.default.cloneElement(child, childProps);
  },
  { component: "SignInButton", renderWhileLoading: true }
);

// src/components/SignInWithMetamaskButton.tsx
var import_react24 = __toESM(require("react"));
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
    return import_react24.default.cloneElement(child, childProps);
  },
  { component: "SignInWithMetamask", renderWhileLoading: true }
);

// src/components/SignOutButton.tsx
var import_deprecated2 = require("@clerk/shared/deprecated");
var import_react25 = __toESM(require("react"));
var SignOutButton = withClerk(
  ({ clerk, children, ...props }) => {
    const { redirectUrl = "/", sessionId, signOutOptions, getContainer, component, ...rest } = props;
    if (signOutOptions) {
      (0, import_deprecated2.deprecated)("SignOutButton `signOutOptions`", "Use the `redirectUrl` and `sessionId` props directly instead.");
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
    return import_react25.default.cloneElement(child, childProps);
  },
  { component: "SignOutButton", renderWhileLoading: true }
);

// src/components/SignUpButton.tsx
var import_react26 = __toESM(require("react"));
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
    return import_react26.default.cloneElement(child, childProps);
  },
  { component: "SignUpButton", renderWhileLoading: true }
);

// src/components/HandleSSOCallback.tsx
var import_react27 = __toESM(require("react"));
function HandleSSOCallback(props) {
  const { navigateToApp, navigateToSignIn, navigateToSignUp } = props;
  const clerk = (0, import_react20.useClerk)();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const hasRun = (0, import_react27.useRef)(false);
  (0, import_react27.useEffect)(() => {
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
  return /* @__PURE__ */ import_react27.default.createElement("div", null, /* @__PURE__ */ import_react27.default.createElement("div", { id: "clerk-captcha" }));
}

// src/contexts/ClerkProvider.tsx
var import_react29 = require("@clerk/shared/react");
var import_react30 = __toESM(require("react"));

// src/isomorphicClerk.ts
var import_browser3 = require("@clerk/shared/browser");
var import_clerkEventBus = require("@clerk/shared/clerkEventBus");
var import_loadClerkJsScript = require("@clerk/shared/loadClerkJsScript");
var import_utils10 = require("@clerk/shared/utils");

// src/stateProxy.ts
var import_browser2 = require("@clerk/shared/browser");
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
      if (!(0, import_browser2.inBrowser)() || !this.isomorphicClerk.loaded) {
        return defaultValue;
      }
      const t = getTarget();
      return t[key];
    })();
  }
  gateMethod(getTarget, key) {
    return (async (...args) => {
      if (!(0, import_browser2.inBrowser)()) {
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
    __privateAdd(this, _eventBus, (0, import_clerkEventBus.createClerkEventBus)());
    __privateAdd(this, _stateProxy);
    this.buildSignInUrl = (opts) => {
      const callback = () => {
        var _a2;
        return ((_a2 = this.clerkjs) == null ? void 0 : _a2.buildSignInUrl(opts)) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildSignInUrl", callback);
      }
    };
    this.buildSignUpUrl = (opts) => {
      const callback = () => {
        var _a2;
        return ((_a2 = this.clerkjs) == null ? void 0 : _a2.buildSignUpUrl(opts)) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildSignUpUrl", callback);
      }
    };
    this.buildAfterSignInUrl = (...args) => {
      const callback = () => {
        var _a2;
        return ((_a2 = this.clerkjs) == null ? void 0 : _a2.buildAfterSignInUrl(...args)) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildAfterSignInUrl", callback);
      }
    };
    this.buildAfterSignUpUrl = (...args) => {
      const callback = () => {
        var _a2;
        return ((_a2 = this.clerkjs) == null ? void 0 : _a2.buildAfterSignUpUrl(...args)) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildAfterSignUpUrl", callback);
      }
    };
    this.buildAfterSignOutUrl = () => {
      const callback = () => {
        var _a2;
        return ((_a2 = this.clerkjs) == null ? void 0 : _a2.buildAfterSignOutUrl()) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildAfterSignOutUrl", callback);
      }
    };
    this.buildNewSubscriptionRedirectUrl = () => {
      const callback = () => {
        var _a2;
        return ((_a2 = this.clerkjs) == null ? void 0 : _a2.buildNewSubscriptionRedirectUrl()) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildNewSubscriptionRedirectUrl", callback);
      }
    };
    this.buildAfterMultiSessionSingleSignOutUrl = () => {
      const callback = () => {
        var _a2;
        return ((_a2 = this.clerkjs) == null ? void 0 : _a2.buildAfterMultiSessionSingleSignOutUrl()) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildAfterMultiSessionSingleSignOutUrl", callback);
      }
    };
    this.buildUserProfileUrl = () => {
      const callback = () => {
        var _a2;
        return ((_a2 = this.clerkjs) == null ? void 0 : _a2.buildUserProfileUrl()) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildUserProfileUrl", callback);
      }
    };
    this.buildCreateOrganizationUrl = () => {
      const callback = () => {
        var _a2;
        return ((_a2 = this.clerkjs) == null ? void 0 : _a2.buildCreateOrganizationUrl()) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildCreateOrganizationUrl", callback);
      }
    };
    this.buildOrganizationProfileUrl = () => {
      const callback = () => {
        var _a2;
        return ((_a2 = this.clerkjs) == null ? void 0 : _a2.buildOrganizationProfileUrl()) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildOrganizationProfileUrl", callback);
      }
    };
    this.buildWaitlistUrl = () => {
      const callback = () => {
        var _a2;
        return ((_a2 = this.clerkjs) == null ? void 0 : _a2.buildWaitlistUrl()) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildWaitlistUrl", callback);
      }
    };
    this.buildTasksUrl = () => {
      const callback = () => {
        var _a2;
        return ((_a2 = this.clerkjs) == null ? void 0 : _a2.buildTasksUrl()) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildTasksUrl", callback);
      }
    };
    this.buildUrlWithAuth = (to) => {
      const callback = () => {
        var _a2;
        return ((_a2 = this.clerkjs) == null ? void 0 : _a2.buildUrlWithAuth(to)) || "";
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("buildUrlWithAuth", callback);
      }
    };
    this.handleUnauthenticated = async () => {
      const callback = () => {
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.handleUnauthenticated();
      };
      if (this.clerkjs && this.loaded) {
        void callback();
      } else {
        this.premountMethodCalls.set("handleUnauthenticated", callback);
      }
    };
    this.on = (...args) => {
      var _a2;
      if ((_a2 = this.clerkjs) == null ? void 0 : _a2.on) {
        return this.clerkjs.on(...args);
      } else {
        __privateGet(this, _eventBus).on(...args);
      }
    };
    this.off = (...args) => {
      var _a2;
      if ((_a2 = this.clerkjs) == null ? void 0 : _a2.off) {
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
      var _a2;
      if (!clerkjs) {
        throw new Error("Failed to hydrate latest Clerk JS");
      }
      this.clerkjs = clerkjs;
      this.premountMethodCalls.forEach((cb) => cb());
      this.premountAddListenerCalls.forEach((listenerExtras, listener) => {
        listenerExtras.handlers.nativeUnsubscribe = clerkjs.addListener(listener, listenerExtras.options);
      });
      (_a2 = __privateGet(this, _eventBus).internal.retrieveListeners("status")) == null ? void 0 : _a2.forEach((listener) => {
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
        __privateGet(this, _eventBus).emit(import_clerkEventBus.clerkEvents.Status, "ready");
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
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.__experimental_prefetchOrganizationSwitcher();
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
          var _a2, _b;
          const listenerExtras = this.premountAddListenerCalls.get(listener);
          if (listenerExtras == null ? void 0 : listenerExtras.handlers) {
            (_b = listenerExtras == null ? void 0 : (_a2 = listenerExtras.handlers).nativeUnsubscribe) == null ? void 0 : _b.call(_a2);
            this.premountAddListenerCalls.delete(listener);
          }
        };
        this.premountAddListenerCalls.set(listener, { options, handlers: { unsubscribe, nativeUnsubscribe: void 0 } });
        return unsubscribe;
      }
    };
    this.navigate = (to) => {
      const callback = () => {
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.navigate(to);
      };
      if (this.clerkjs && this.loaded) {
        void callback();
      } else {
        this.premountMethodCalls.set("navigate", callback);
      }
    };
    this.redirectWithAuth = async (...args) => {
      const callback = () => {
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.redirectWithAuth(...args);
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
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.redirectToSignIn(opts);
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
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.redirectToSignUp(opts);
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
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.redirectToUserProfile();
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
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.redirectToAfterSignUp();
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("redirectToAfterSignUp", callback);
      }
    };
    this.redirectToAfterSignIn = () => {
      const callback = () => {
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.redirectToAfterSignIn();
      };
      if (this.clerkjs && this.loaded) {
        callback();
      } else {
        this.premountMethodCalls.set("redirectToAfterSignIn", callback);
      }
    };
    this.redirectToAfterSignOut = () => {
      const callback = () => {
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.redirectToAfterSignOut();
      };
      if (this.clerkjs && this.loaded) {
        callback();
      } else {
        this.premountMethodCalls.set("redirectToAfterSignOut", callback);
      }
    };
    this.redirectToOrganizationProfile = async () => {
      const callback = () => {
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.redirectToOrganizationProfile();
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
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.redirectToCreateOrganization();
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
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.redirectToWaitlist();
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
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.redirectToTasks(opts);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("redirectToTasks", callback);
        return;
      }
    };
    this.handleRedirectCallback = async (params) => {
      var _a2;
      const callback = () => {
        var _a3;
        return (_a3 = this.clerkjs) == null ? void 0 : _a3.handleRedirectCallback(params);
      };
      if (this.clerkjs && this.loaded) {
        void ((_a2 = callback()) == null ? void 0 : _a2.catch(() => {
        }));
      } else {
        this.premountMethodCalls.set("handleRedirectCallback", callback);
      }
    };
    this.handleGoogleOneTapCallback = async (signInOrUp, params) => {
      var _a2;
      const callback = () => {
        var _a3;
        return (_a3 = this.clerkjs) == null ? void 0 : _a3.handleGoogleOneTapCallback(signInOrUp, params);
      };
      if (this.clerkjs && this.loaded) {
        void ((_a2 = callback()) == null ? void 0 : _a2.catch(() => {
        }));
      } else {
        this.premountMethodCalls.set("handleGoogleOneTapCallback", callback);
      }
    };
    this.handleEmailLinkVerification = async (params) => {
      const callback = () => {
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.handleEmailLinkVerification(params);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("handleEmailLinkVerification", callback);
      }
    };
    this.authenticateWithMetamask = async (params) => {
      const callback = () => {
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.authenticateWithMetamask(params);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("authenticateWithMetamask", callback);
      }
    };
    this.authenticateWithCoinbaseWallet = async (params) => {
      const callback = () => {
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.authenticateWithCoinbaseWallet(params);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("authenticateWithCoinbaseWallet", callback);
      }
    };
    this.authenticateWithBase = async (params) => {
      const callback = () => {
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.authenticateWithBase(params);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("authenticateWithBase", callback);
      }
    };
    this.authenticateWithOKXWallet = async (params) => {
      const callback = () => {
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.authenticateWithOKXWallet(params);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("authenticateWithOKXWallet", callback);
      }
    };
    this.authenticateWithSolana = async (params) => {
      const callback = () => {
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.authenticateWithSolana(params);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("authenticateWithSolana", callback);
      }
    };
    this.authenticateWithWeb3 = async (params) => {
      const callback = () => {
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.authenticateWithWeb3(params);
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
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.createOrganization(params);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("createOrganization", callback);
      }
    };
    this.getOrganization = async (organizationId) => {
      const callback = () => {
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.getOrganization(organizationId);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("getOrganization", callback);
      }
    };
    this.joinWaitlist = async (params) => {
      const callback = () => {
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.joinWaitlist(params);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("joinWaitlist", callback);
      }
    };
    this.signOut = async (...args) => {
      const callback = () => {
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.signOut(...args);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("signOut", callback);
      }
    };
    this.__internal_attemptToEnableEnvironmentSetting = (options) => {
      const callback = () => {
        var _a2;
        return (_a2 = this.clerkjs) == null ? void 0 : _a2.__internal_attemptToEnableEnvironmentSetting(options);
      };
      if (this.clerkjs && this.loaded) {
        return callback();
      } else {
        this.premountMethodCalls.set("__internal_attemptToEnableEnvironmentSetting", callback);
      }
    };
    var _a2;
    __privateSet(this, _publishableKey, options == null ? void 0 : options.publishableKey);
    __privateSet(this, _proxyUrl, options == null ? void 0 : options.proxyUrl);
    __privateSet(this, _domain, options == null ? void 0 : options.domain);
    this.options = options;
    this.Clerk = (options == null ? void 0 : options.Clerk) || null;
    this.mode = (0, import_browser3.inBrowser)() ? "browser" : "server";
    __privateSet(this, _stateProxy, new StateProxy(this));
    if (!this.options.sdkMetadata) {
      this.options.sdkMetadata = SDK_METADATA;
    }
    __privateGet(this, _eventBus).emit(import_clerkEventBus.clerkEvents.Status, "loading");
    __privateGet(this, _eventBus).prioritizedOn(import_clerkEventBus.clerkEvents.Status, (status) => __privateSet(this, _status, status));
    if (__privateGet(this, _publishableKey) && ((_a2 = this.options.experimental) == null ? void 0 : _a2.runtimeEnvironment) === "headless" && this.options.Clerk) {
      void this.loadHeadlessClerk();
    } else if (__privateGet(this, _publishableKey)) {
      void this.getEntryChunks();
    }
  }
  get publishableKey() {
    return __privateGet(this, _publishableKey);
  }
  get loaded() {
    var _a2;
    return ((_a2 = this.clerkjs) == null ? void 0 : _a2.loaded) || false;
  }
  get status() {
    var _a2;
    if (!this.clerkjs) {
      return __privateGet(this, _status);
    }
    return ((_a2 = this.clerkjs) == null ? void 0 : _a2.status) || /**
     * Support older clerk-js versions.
     * If clerk-js is available but `.status` is missing it we need to fallback to `.loaded`.
     * Since "degraded" an "error" did not exist before,
     * map "loaded" to "ready" and "not loaded" to "loading".
     */
    (this.clerkjs.loaded ? "ready" : "loading");
  }
  static getOrCreateInstance(options) {
    if (!(0, import_browser3.inBrowser)() || !__privateGet(this, _instance) || options.Clerk && __privateGet(this, _instance).Clerk !== options.Clerk || // Allow hot swapping PKs on the client
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
      return (0, import_utils10.handleValueOrFn)(__privateGet(this, _domain), new URL(window.location.href), "");
    }
    if (typeof __privateGet(this, _domain) === "function") {
      return errorThrower.throw(unsupportedNonBrowserDomainOrProxyUrlFunction);
    }
    return __privateGet(this, _domain) || "";
  }
  get proxyUrl() {
    if (typeof window !== "undefined" && window.location) {
      return (0, import_utils10.handleValueOrFn)(__privateGet(this, _proxyUrl), new URL(window.location.href), "");
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
    var _a2, _b;
    return ((_a2 = this.clerkjs) == null ? void 0 : _a2.__internal_getOption) ? (_b = this.clerkjs) == null ? void 0 : _b.__internal_getOption(key) : this.options[key];
  }
  /**
   * Initialize Clerk for headless/React Native environments where a Clerk instance is provided directly.
   * Only handles Clerk construction and loading — post-load wiring is shared via replayInterceptedInvocations.
   */
  loadHeadlessClerk() {
    const clerk = isConstructor(this.options.Clerk) ? new this.options.Clerk(__privateGet(this, _publishableKey), { proxyUrl: this.proxyUrl, domain: this.domain }) : this.options.Clerk;
    if (!clerk) {
      __privateGet(this, _eventBus).emit(import_clerkEventBus.clerkEvents.Status, "error");
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
        __privateGet(this, _eventBus).emit(import_clerkEventBus.clerkEvents.Status, "error");
        this.emitLoaded();
      });
    } else {
      onLoaded();
    }
  }
  get sdkMetadata() {
    var _a2;
    return ((_a2 = this.clerkjs) == null ? void 0 : _a2.sdkMetadata) || this.options.sdkMetadata || void 0;
  }
  get instanceType() {
    var _a2;
    return (_a2 = this.clerkjs) == null ? void 0 : _a2.instanceType;
  }
  get frontendApi() {
    var _a2;
    return ((_a2 = this.clerkjs) == null ? void 0 : _a2.frontendApi) || "";
  }
  get isStandardBrowser() {
    var _a2;
    return ((_a2 = this.clerkjs) == null ? void 0 : _a2.isStandardBrowser) || this.options.standardBrowser || false;
  }
  get isSatellite() {
    if (typeof window !== "undefined" && window.location) {
      return (0, import_utils10.handleValueOrFn)(this.options.isSatellite, new URL(window.location.href), false);
    }
    if (typeof this.options.isSatellite === "function") {
      return errorThrower.throw(unsupportedNonBrowserDomainOrProxyUrlFunction);
    }
    return false;
  }
  async getEntryChunks() {
    var _a2;
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
        const shouldLoadUi = this.options.standardBrowser !== false && !this.options.Clerk || !!((_a2 = this.options.ui) == null ? void 0 : _a2.ClerkUI);
        const ClerkUI = shouldLoadUi ? await this.getClerkUIEntryChunk() : void 0;
        await clerk.load({ ...this.options, ui: { ...this.options.ui, ClerkUI } });
      }
      if (clerk.loaded) {
        this.replayInterceptedInvocations(clerk);
      }
    } catch (err) {
      const error = err;
      __privateGet(this, _eventBus).emit(import_clerkEventBus.clerkEvents.Status, "error");
      console.error(error.stack || error.message || error);
      return;
    }
  }
  async getClerkJsEntryChunk() {
    if ((!this.options.Clerk || this.options.__internal_clerkJSUrl) && !__BUILD_DISABLE_RHC__) {
      await (0, import_loadClerkJsScript.loadClerkJSScript)({
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
    await (0, import_loadClerkJsScript.loadClerkUIScript)({
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
    var _a2;
    return (_a2 = this.clerkjs) == null ? void 0 : _a2.version;
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
    var _a2;
    return (_a2 = this.clerkjs) == null ? void 0 : _a2.billing;
  }
  get __internal_state() {
    return this.loaded && this.clerkjs ? this.clerkjs.__internal_state : __privateGet(this, _stateProxy);
  }
  get apiKeys() {
    var _a2;
    return (_a2 = this.clerkjs) == null ? void 0 : _a2.apiKeys;
  }
  get oauthApplication() {
    var _a2;
    return (_a2 = this.clerkjs) == null ? void 0 : _a2.oauthApplication;
  }
  __internal_setEnvironment(...args) {
    if (this.clerkjs && "__internal_setEnvironment" in this.clerkjs) {
      this.clerkjs.__internal_setEnvironment(args);
    } else {
      return void 0;
    }
  }
  get __internal_lastEmittedResources() {
    var _a2;
    return (_a2 = this.clerkjs) == null ? void 0 : _a2.__internal_lastEmittedResources;
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

// src/utils/versionCheck.ts
var import_versionCheck = require("@clerk/shared/versionCheck");
var import_react28 = __toESM(require("react"));
var import_versionCheck2 = require("@clerk/shared/versionCheck");
function computeReactVersionCompatibility() {
  try {
    return (0, import_versionCheck.isVersionCompatible)(import_react28.default.version, define_CLERK_UI_SUPPORTED_REACT_BOUNDS_default);
  } catch {
    return false;
  }
}
var IS_REACT_SHARED_VARIANT_COMPATIBLE = computeReactVersionCompatibility();

// src/contexts/ClerkProvider.tsx
function ClerkProviderBase(props) {
  const { initialState, children, ...restIsomorphicClerkOptions } = props;
  const mergedOptions = mergeWithEnv(restIsomorphicClerkOptions);
  const { isomorphicClerk, clerkStatus } = useLoadedIsomorphicClerk(mergedOptions);
  return /* @__PURE__ */ import_react30.default.createElement(
    import_react29.ClerkContextProvider,
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
  const optionsWithDefaults = import_react30.default.useMemo(
    () => ({
      clerkUIVariant: DEFAULT_CLERK_UI_VARIANT,
      ...mergedOptions
    }),
    [mergedOptions]
  );
  const isomorphicClerkRef = import_react30.default.useRef(IsomorphicClerk.getOrCreateInstance(optionsWithDefaults));
  const [clerkStatus, setClerkStatus] = import_react30.default.useState(isomorphicClerkRef.current.status);
  import_react30.default.useEffect(() => {
    void isomorphicClerkRef.current.__internal_updateProps({ appearance: mergedOptions.appearance });
  }, [mergedOptions.appearance]);
  import_react30.default.useEffect(() => {
    void isomorphicClerkRef.current.__internal_updateProps({ options: mergedOptions });
  }, [mergedOptions.localization]);
  import_react30.default.useEffect(() => {
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

// src/contexts/index.ts
var import_react31 = require("@clerk/shared/react");

// src/index.ts
var import_getToken = require("@clerk/shared/getToken");
setErrorThrowerOptions({ packageName: "@clerk/react" });
(0, import_loadClerkJsScript2.setClerkJSLoadingErrorPackageName)("@clerk/react");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.js.map