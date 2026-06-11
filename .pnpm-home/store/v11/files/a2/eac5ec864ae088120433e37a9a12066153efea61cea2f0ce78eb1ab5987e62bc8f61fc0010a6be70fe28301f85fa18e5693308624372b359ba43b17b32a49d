import {
  errorThrower,
  useAssertWrappedByClerkProvider,
  useIsomorphicClerkContext
} from "./chunk-RQWALB2R.mjs";

// src/components/uiComponents.tsx
import { logErrorInDevMode as logErrorInDevMode3 } from "@clerk/shared/utils";
import React8, { createContext, createElement, useContext } from "react";

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
var noPathProvidedError = (componentName) => `The <${componentName}/> component uses path-based routing by default unless a different routing strategy is provided using the \`routing\` prop. When path-based routing is used, you need to provide the path where the component is mounted on by using the \`path\` prop. Example: <${componentName} path={'/my-path'} />`;
var incompatibleRoutingWithPathProvidedError = (componentName) => `The \`path\` prop will only be respected when the Clerk component uses path-based routing. To resolve this error, pass \`routing='path'\` to the <${componentName}/> component, or drop the \`path\` prop to switch to hash-based routing. For more details please refer to our docs: https://clerk.com/docs`;
var userButtonIgnoredComponent = `<UserButton /> can only accept <UserButton.UserProfilePage />, <UserButton.UserProfileLink /> and <UserButton.MenuItems /> as its children. Any other provided component will be ignored. Additionally, please ensure that the component is rendered in a client component.`;
var customMenuItemsIgnoredComponent = "<UserButton.MenuItems /> component can only accept <UserButton.Action /> and <UserButton.Link /> as its children. Any other provided component will be ignored. Additionally, please ensure that the component is rendered in a client component.";
var userButtonMenuItemsRenderedError = "<UserButton.MenuItems /> component needs to be a direct child of `<UserButton />`.";
var userButtonMenuActionRenderedError = "<UserButton.Action /> component needs to be a direct child of `<UserButton.MenuItems />`.";
var userButtonMenuLinkRenderedError = "<UserButton.Link /> component needs to be a direct child of `<UserButton.MenuItems />`.";
var userButtonMenuItemLinkWrongProps = "Missing props. <UserButton.Link /> component requires the following props: href, label and labelIcon.";
var userButtonMenuItemsActionWrongsProps = "Missing props. <UserButton.Action /> component requires the following props: label.";

// src/utils/childrenUtils.tsx
import React from "react";
var assertSingleChild = (children) => (name) => {
  try {
    return React.Children.only(children);
  } catch {
    const childArray = React.Children.toArray(children);
    if (childArray.length === 1 && React.isValidElement(childArray[0])) {
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
    children = /* @__PURE__ */ React.createElement("button", null, children);
  }
  return children;
};
var safeExecute = (cb) => (...args) => {
  if (cb && typeof cb === "function") {
    return cb(...args);
  }
};

// src/utils/envVariables.ts
import { getEnvVariable } from "@clerk/shared/getEnvVariable";
var getEnvVar = (name) => {
  return getEnvVariable(`VITE_${name}`) || getEnvVariable(name);
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
import React2 from "react";
var counts = /* @__PURE__ */ new Map();
function useMaxAllowedInstancesGuard(name, error, maxCount = 1) {
  React2.useEffect(() => {
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
    return /* @__PURE__ */ React2.createElement(WrappedComponent, { ...props });
  };
  Hoc.displayName = `withMaxAllowedInstancesGuard(${displayName})`;
  return Hoc;
}

// src/utils/useCustomElementPortal.tsx
import { useState } from "react";
import { createPortal } from "react-dom";
var useCustomElementPortal = (elements) => {
  const [nodeMap, setNodeMap] = useState(/* @__PURE__ */ new Map());
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
      return node ? createPortal(el.component, node) : null;
    }
  }));
};

// src/utils/useCustomPages.tsx
import { logErrorInDevMode } from "@clerk/shared/utils";
import React4 from "react";

// src/utils/componentValidation.ts
import React3 from "react";
var isThatComponent = (v, component) => {
  return !!v && React3.isValidElement(v) && (v == null ? void 0 : v.type) === component;
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
  React4.Children.forEach(children, (child) => {
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
  React4.Children.forEach(children, (child) => {
    if (!isThatComponent(child, PageComponent) && !isThatComponent(child, LinkComponent) && !isThatComponent(child, MenuItemsComponent)) {
      if (child && !allowForAnyChildren) {
        logErrorInDevMode(customPagesIgnoredComponent(componentName));
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
        logErrorInDevMode(customPageWrongProps(componentName));
        return;
      }
    }
    if (isThatComponent(child, LinkComponent)) {
      if (isExternalLink(props)) {
        validChildren.push({ label, labelIcon, url });
      } else {
        logErrorInDevMode(customLinkWrongProps(componentName));
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
import { logErrorInDevMode as logErrorInDevMode2 } from "@clerk/shared/utils";
import React5 from "react";
var useUserButtonCustomMenuItems = (children, options) => {
  var _a;
  const reorderItemsLabels = ["manageAccount", "signOut"];
  return useCustomMenuItems({
    children,
    reorderItemsLabels,
    MenuItemsComponent: MenuItems,
    MenuActionComponent: MenuAction,
    MenuLinkComponent: MenuLink,
    UserProfileLinkComponent: UserProfileLink,
    UserProfilePageComponent: UserProfilePage,
    allowForAnyChildren: (_a = options == null ? void 0 : options.allowForAnyChildren) != null ? _a : false
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
  React5.Children.forEach(children, (child) => {
    if (!isThatComponent(child, MenuItemsComponent) && !isThatComponent(child, UserProfileLinkComponent) && !isThatComponent(child, UserProfilePageComponent)) {
      if (child && !allowForAnyChildren) {
        logErrorInDevMode2(userButtonIgnoredComponent);
      }
      return;
    }
    if (isThatComponent(child, UserProfileLinkComponent) || isThatComponent(child, UserProfilePageComponent)) {
      return;
    }
    const { props } = child;
    React5.Children.forEach(props.children, (child2) => {
      if (!isThatComponent(child2, MenuActionComponent) && !isThatComponent(child2, MenuLinkComponent)) {
        if (child2) {
          logErrorInDevMode2(customMenuItemsIgnoredComponent);
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
            logErrorInDevMode2("Custom menu item must have either onClick or open property");
            return;
          }
        } else {
          logErrorInDevMode2(userButtonMenuItemsActionWrongsProps);
          return;
        }
      }
      if (isThatComponent(child2, MenuLinkComponent)) {
        if (isExternalLink2(props2)) {
          validChildren.push({ label, labelIcon, href });
        } else {
          logErrorInDevMode2(userButtonMenuItemLinkWrongProps);
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
import { useEffect, useRef, useState as useState2 } from "react";
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
    var _a;
    return !!(el == null ? void 0 : el.childElementCount) && ((_a = el == null ? void 0 : el.matches) == null ? void 0 : _a.call(el, selector)) && el.childElementCount > 0;
  }
});
function useWaitForComponentMount(component, options) {
  const watcherRef = useRef();
  const [status, setStatus] = useState2("rendering");
  useEffect(() => {
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
import { without } from "@clerk/shared/object";
import { isDeeplyEqual } from "@clerk/shared/react";
import React6 from "react";
var isMountProps = (props) => {
  return "mount" in props;
};
var isOpenProps = (props) => {
  return "open" in props;
};
var stripMenuItemIconHandlers = (menuItems) => {
  return menuItems == null ? void 0 : menuItems.map(({ mountIcon, unmountIcon, ...rest }) => rest);
};
var ClerkHostRenderer = class extends React6.PureComponent {
  constructor() {
    super(...arguments);
    this.rootRef = React6.createRef();
  }
  componentDidUpdate(_prevProps) {
    var _a, _b, _c, _d;
    if (!isMountProps(_prevProps) || !isMountProps(this.props)) {
      return;
    }
    const prevProps = without(_prevProps.props, "customPages", "customMenuItems", "children");
    const newProps = without(this.props.props, "customPages", "customMenuItems", "children");
    const customPagesChanged = ((_a = prevProps.customPages) == null ? void 0 : _a.length) !== ((_b = newProps.customPages) == null ? void 0 : _b.length);
    const customMenuItemsChanged = ((_c = prevProps.customMenuItems) == null ? void 0 : _c.length) !== ((_d = newProps.customMenuItems) == null ? void 0 : _d.length);
    const prevMenuItemsWithoutHandlers = stripMenuItemIconHandlers(_prevProps.props.customMenuItems);
    const newMenuItemsWithoutHandlers = stripMenuItemIconHandlers(this.props.props.customMenuItems);
    if (!isDeeplyEqual(prevProps, newProps) || !isDeeplyEqual(prevMenuItemsWithoutHandlers, newMenuItemsWithoutHandlers) || customPagesChanged || customMenuItemsChanged) {
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
    return /* @__PURE__ */ React6.createElement(React6.Fragment, null, !hideRootHtmlElement && /* @__PURE__ */ React6.createElement("div", { ...rootAttributes }), this.props.children);
  }
};

// src/components/withClerk.tsx
import { usePortalRoot } from "@clerk/shared/react";
import React7 from "react";
var withClerk = (Component, displayNameOrOptions) => {
  const passedDisplayedName = typeof displayNameOrOptions === "string" ? displayNameOrOptions : displayNameOrOptions == null ? void 0 : displayNameOrOptions.component;
  const displayName = passedDisplayedName || Component.displayName || Component.name || "Component";
  Component.displayName = displayName;
  const options = typeof displayNameOrOptions === "string" ? void 0 : displayNameOrOptions;
  const HOC = (props) => {
    useAssertWrappedByClerkProvider(displayName || "withClerk");
    const clerk = useIsomorphicClerkContext();
    const getContainer = usePortalRoot();
    if (!clerk.loaded && !(options == null ? void 0 : options.renderWhileLoading)) {
      return null;
    }
    return /* @__PURE__ */ React7.createElement(
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
  var _a, _b;
  return /* @__PURE__ */ React8.createElement(React8.Fragment, null, (_a = props == null ? void 0 : props.customPagesPortals) == null ? void 0 : _a.map((portal, index) => createElement(portal, { key: index })), (_b = props == null ? void 0 : props.customMenuItemsPortals) == null ? void 0 : _b.map((portal, index) => createElement(portal, { key: index })));
};
var SignIn = withClerk(
  ({ clerk, component, fallback, ...props }) => {
    const mountingStatus = useWaitForComponentMount(component);
    const shouldShowFallback = mountingStatus === "rendering" || !clerk.loaded;
    const rendererRootProps = {
      ...shouldShowFallback && fallback && { style: { display: "none" } }
    };
    return /* @__PURE__ */ React8.createElement(React8.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ React8.createElement(
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
    return /* @__PURE__ */ React8.createElement(React8.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ React8.createElement(
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
  logErrorInDevMode3(userProfilePageRenderedError);
  return /* @__PURE__ */ React8.createElement(React8.Fragment, null, children);
}
function UserProfileLink({ children }) {
  logErrorInDevMode3(userProfileLinkRenderedError);
  return /* @__PURE__ */ React8.createElement(React8.Fragment, null, children);
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
    return /* @__PURE__ */ React8.createElement(React8.Fragment, null, shouldShowFallback && fallback, /* @__PURE__ */ React8.createElement(
      ClerkHostRenderer,
      {
        component,
        mount: clerk.mountUserProfile,
        unmount: clerk.unmountUserProfile,
        updateProps: clerk.__internal_updateProps,
        props: { ...props, customPages },
        rootProps: rendererRootProps
      },
      /* @__PURE__ */ React8.createElement(CustomPortalsRenderer, { customPagesPortals })
    ));
  },
  { component: "UserProfile", renderWhileLoading: true }
);
var UserProfile = Object.assign(_UserProfile, {
  Page: UserProfilePage,
  Link: UserProfileLink
});
var UserButtonContext = createContext({
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
    return /* @__PURE__ */ React8.createElement(UserButtonContext.Provider, { value: passableProps }, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ React8.createElement(
      ClerkHostRenderer,
      {
        component,
        ...passableProps,
        hideRootHtmlElement: !!props.__experimental_asProvider,
        rootProps: rendererRootProps
      },
      props.__experimental_asProvider ? sanitizedChildren : null,
      /* @__PURE__ */ React8.createElement(CustomPortalsRenderer, { ...portalProps })
    ));
  },
  { component: "UserButton", renderWhileLoading: true }
);
function MenuItems({ children }) {
  logErrorInDevMode3(userButtonMenuItemsRenderedError);
  return /* @__PURE__ */ React8.createElement(React8.Fragment, null, children);
}
function MenuAction({ children }) {
  logErrorInDevMode3(userButtonMenuActionRenderedError);
  return /* @__PURE__ */ React8.createElement(React8.Fragment, null, children);
}
function MenuLink({ children }) {
  logErrorInDevMode3(userButtonMenuLinkRenderedError);
  return /* @__PURE__ */ React8.createElement(React8.Fragment, null, children);
}
function UserButtonOutlet(outletProps) {
  const providerProps = useContext(UserButtonContext);
  const portalProps = {
    ...providerProps,
    props: {
      ...providerProps.props,
      ...outletProps
    }
  };
  return /* @__PURE__ */ React8.createElement(ClerkHostRenderer, { ...portalProps });
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
  logErrorInDevMode3(organizationProfilePageRenderedError);
  return /* @__PURE__ */ React8.createElement(React8.Fragment, null, children);
}
function OrganizationProfileLink({ children }) {
  logErrorInDevMode3(organizationProfileLinkRenderedError);
  return /* @__PURE__ */ React8.createElement(React8.Fragment, null, children);
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
    return /* @__PURE__ */ React8.createElement(React8.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ React8.createElement(
      ClerkHostRenderer,
      {
        component,
        mount: clerk.mountOrganizationProfile,
        unmount: clerk.unmountOrganizationProfile,
        updateProps: clerk.__internal_updateProps,
        props: { ...props, customPages },
        rootProps: rendererRootProps
      },
      /* @__PURE__ */ React8.createElement(CustomPortalsRenderer, { customPagesPortals })
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
    return /* @__PURE__ */ React8.createElement(React8.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ React8.createElement(
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
var OrganizationSwitcherContext = createContext({
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
    return /* @__PURE__ */ React8.createElement(OrganizationSwitcherContext.Provider, { value: passableProps }, /* @__PURE__ */ React8.createElement(React8.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ React8.createElement(
      ClerkHostRenderer,
      {
        ...passableProps,
        hideRootHtmlElement: !!props.__experimental_asProvider
      },
      props.__experimental_asProvider ? sanitizedChildren : null,
      /* @__PURE__ */ React8.createElement(CustomPortalsRenderer, { customPagesPortals })
    )));
  },
  { component: "OrganizationSwitcher", renderWhileLoading: true }
);
function OrganizationSwitcherOutlet(outletProps) {
  const providerProps = useContext(OrganizationSwitcherContext);
  const portalProps = {
    ...providerProps,
    props: {
      ...providerProps.props,
      ...outletProps
    }
  };
  return /* @__PURE__ */ React8.createElement(ClerkHostRenderer, { ...portalProps });
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
    return /* @__PURE__ */ React8.createElement(React8.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ React8.createElement(
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
    return /* @__PURE__ */ React8.createElement(React8.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ React8.createElement(
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
    return /* @__PURE__ */ React8.createElement(React8.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ React8.createElement(
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
    return /* @__PURE__ */ React8.createElement(React8.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ React8.createElement(
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
    return /* @__PURE__ */ React8.createElement(React8.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ React8.createElement(
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
    return /* @__PURE__ */ React8.createElement(React8.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ React8.createElement(
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
    return /* @__PURE__ */ React8.createElement(React8.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ React8.createElement(
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
    return /* @__PURE__ */ React8.createElement(React8.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ React8.createElement(
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
    return /* @__PURE__ */ React8.createElement(React8.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ React8.createElement(
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
    return /* @__PURE__ */ React8.createElement(React8.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ React8.createElement(
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
    return /* @__PURE__ */ React8.createElement(React8.Fragment, null, shouldShowFallback && fallback, clerk.loaded && /* @__PURE__ */ React8.createElement(
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

// src/hooks/useAuth.ts
import { createCheckAuthorization, resolveAuthState } from "@clerk/shared/authorization";
import { eventMethodCalled } from "@clerk/shared/telemetry";
import { useCallback as useCallback2 } from "react";

// src/hooks/useAuthBase.tsx
import { deriveState } from "@clerk/shared/deriveState";
import { useClerkInstanceContext, useInitialStateContext } from "@clerk/shared/react";
import { useCallback, useMemo, useSyncExternalStore } from "react";
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
  const clerk = useClerkInstanceContext();
  const initialState = useInitialStateContext();
  const getInitialState = useCallback(() => initialState, [initialState]);
  const state = useSyncExternalStore(
    useCallback((callback) => clerk.addListener(callback, { skipInitialEmit: true }), [clerk]),
    useCallback(() => {
      if (!clerk.loaded || !clerk.__internal_lastEmittedResources) {
        return getInitialState();
      }
      return clerk.__internal_lastEmittedResources;
    }, [clerk, getInitialState]),
    getInitialState
  );
  const authState = useMemo(() => {
    if (!state) {
      return defaultDerivedInitialState;
    }
    const fullState = isInitialState(state) ? deriveState(false, {}, state) : deriveState(true, state, void 0);
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
import { inBrowser } from "@clerk/shared/browser";
import { ClerkRuntimeError } from "@clerk/shared/error";
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
    if (!inBrowser()) {
      throw new ClerkRuntimeError(
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
  var _a;
  useAssertWrappedByClerkProvider("useAuth");
  const { treatPendingAsSignedOut } = options != null ? options : {};
  const authState = useAuthBase();
  const isomorphicClerk = useIsomorphicClerkContext();
  const getToken = useCallback2(createGetToken(isomorphicClerk), [isomorphicClerk]);
  const signOut = useCallback2(createSignOut(isomorphicClerk), [isomorphicClerk]);
  (_a = isomorphicClerk.telemetry) == null ? void 0 : _a.record(eventMethodCalled("useAuth", { treatPendingAsSignedOut }));
  return useDerivedAuth(
    {
      ...authState,
      getToken,
      signOut
    },
    {
      treatPendingAsSignedOut
    }
  );
};
function useDerivedAuth(authObject, { treatPendingAsSignedOut = true } = {}) {
  const { userId, orgId, orgRole, has, signOut, getToken, orgPermissions, factorVerificationAge, sessionClaims } = authObject != null ? authObject : {};
  const derivedHas = useCallback2(
    (params) => {
      if (has) {
        return has(params);
      }
      return createCheckAuthorization({
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
  const payload = resolveAuthState({
    authObject: {
      ...authObject,
      getToken,
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
import React9 from "react";
function useEmailLink(resource) {
  const { startEmailLinkFlow, cancelEmailLinkFlow } = React9.useMemo(() => resource.createEmailLinkFlow(), [resource]);
  React9.useEffect(() => {
    return cancelEmailLinkFlow;
  }, []);
  return {
    startEmailLinkFlow,
    cancelEmailLinkFlow
  };
}

// src/hooks/useClerkSignal.ts
import { eventMethodCalled as eventMethodCalled2 } from "@clerk/shared/telemetry";
import { useCallback as useCallback3, useSyncExternalStore as useSyncExternalStore2 } from "react";
function useClerkSignal(signal) {
  var _a, _b, _c;
  useAssertWrappedByClerkProvider("useClerkSignal");
  const clerk = useIsomorphicClerkContext();
  switch (signal) {
    case "signIn":
      (_a = clerk.telemetry) == null ? void 0 : _a.record(eventMethodCalled2("useSignIn", { apiVersion: "2025-11" }));
      break;
    case "signUp":
      (_b = clerk.telemetry) == null ? void 0 : _b.record(eventMethodCalled2("useSignUp", { apiVersion: "2025-11" }));
      break;
    case "waitlist":
      (_c = clerk.telemetry) == null ? void 0 : _c.record(eventMethodCalled2("useWaitlist", { apiVersion: "2025-11" }));
      break;
    default:
      break;
  }
  const subscribe = useCallback3(
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
  const getSnapshot = useCallback3(() => {
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
  const value = useSyncExternalStore2(subscribe, getSnapshot, getSnapshot);
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
import {
  useClerk,
  useOrganization,
  useOrganizationCreationDefaults,
  useOrganizationList,
  useSessionList,
  useUser,
  useSession,
  useReverification,
  useAPIKeys,
  useOAuthConsent,
  __experimental_useCheckout,
  __experimental_CheckoutProvider,
  __experimental_usePaymentElement,
  __experimental_PaymentElementProvider,
  __experimental_PaymentElement
} from "@clerk/shared/react";

export {
  multipleClerkProvidersError,
  unsupportedNonBrowserDomainOrProxyUrlFunction,
  noPathProvidedError,
  incompatibleRoutingWithPathProvidedError,
  assertSingleChild,
  normalizeWithDefaultValue,
  safeExecute,
  mergeWithEnv,
  isConstructor,
  withMaxAllowedInstancesGuard,
  withClerk,
  SignIn,
  SignUp,
  UserProfile,
  UserButton,
  OrganizationProfile,
  CreateOrganization,
  OrganizationSwitcher,
  OrganizationList,
  GoogleOneTap,
  Waitlist,
  PricingTable,
  APIKeys,
  ConfigureSSO,
  OAuthConsent,
  UserAvatar,
  TaskChooseOrganization,
  TaskResetPassword,
  TaskSetupMFA,
  useAuth,
  useDerivedAuth,
  useEmailLink,
  useSignIn,
  useSignUp,
  useWaitlist,
  useClerk,
  useOrganization,
  useOrganizationCreationDefaults,
  useOrganizationList,
  useSessionList,
  useUser,
  useSession,
  useReverification,
  useAPIKeys,
  useOAuthConsent,
  __experimental_useCheckout,
  __experimental_CheckoutProvider,
  __experimental_usePaymentElement,
  __experimental_PaymentElementProvider,
  __experimental_PaymentElement
};
//# sourceMappingURL=chunk-EQJEQXWW.mjs.map