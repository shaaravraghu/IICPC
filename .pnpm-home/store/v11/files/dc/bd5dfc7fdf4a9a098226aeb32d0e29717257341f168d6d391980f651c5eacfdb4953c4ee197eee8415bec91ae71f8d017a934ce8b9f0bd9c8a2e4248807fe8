import {
  assertSingleChild,
  normalizeWithDefaultValue,
  safeExecute,
  useAuth,
  withClerk
} from "./chunk-EQJEQXWW.mjs";
import "./chunk-RQWALB2R.mjs";
import "./chunk-E5QRIS4Z.mjs";

// src/components/CheckoutButton.tsx
import React from "react";
var CheckoutButton = withClerk(
  ({ clerk, children, ...props }) => {
    const {
      planId,
      planPeriod,
      for: _for,
      onSubscriptionComplete,
      newSubscriptionRedirectUrl,
      checkoutProps,
      getContainer,
      component,
      ...rest
    } = props;
    const { userId, orgId } = useAuth();
    if (userId === null) {
      throw new Error(
        'Clerk: Ensure that `<CheckoutButton />` is rendered only when the user is signed in (wrap with `<Show when="signed-in">` or guard with `useAuth()`).'
      );
    }
    if (orgId === null && _for === "organization") {
      throw new Error(
        'Clerk: Wrap `<CheckoutButton for="organization" />` with a check for an active organization. Retrieve `orgId` from `useAuth()` and confirm it is defined. For SSR, see: https://clerk.com/docs/reference/backend/types/auth-object#how-to-access-the-auth-object'
      );
    }
    children = normalizeWithDefaultValue(children, "Checkout");
    const child = assertSingleChild(children)("CheckoutButton");
    const clickHandler = () => {
      if (!clerk) {
        return;
      }
      return clerk.__internal_openCheckout({
        planId,
        planPeriod,
        for: _for,
        onSubscriptionComplete,
        newSubscriptionRedirectUrl,
        ...checkoutProps
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
  { component: "CheckoutButton", renderWhileLoading: true }
);

// src/components/PlanDetailsButton.tsx
import React2 from "react";
var PlanDetailsButton = withClerk(
  ({ clerk, children, ...props }) => {
    const { plan, planId, initialPlanPeriod, planDetailsProps, getContainer, component, ...rest } = props;
    children = normalizeWithDefaultValue(children, "Plan details");
    const child = assertSingleChild(children)("PlanDetailsButton");
    const clickHandler = () => {
      if (!clerk) {
        return;
      }
      return clerk.__internal_openPlanDetails({
        plan,
        planId,
        initialPlanPeriod,
        ...planDetailsProps
      });
    };
    const wrappedChildClickHandler = async (e) => {
      if (child && typeof child === "object" && "props" in child) {
        await safeExecute(child.props.onClick)(e);
      }
      return clickHandler();
    };
    const childProps = { ...rest, onClick: wrappedChildClickHandler };
    return React2.cloneElement(child, childProps);
  },
  { component: "PlanDetailsButton", renderWhileLoading: true }
);

// src/components/SubscriptionDetailsButton.tsx
import React3 from "react";
var SubscriptionDetailsButton = withClerk(
  ({
    clerk,
    children,
    ...props
  }) => {
    const { for: _for, subscriptionDetailsProps, onSubscriptionCancel, getContainer, component, ...rest } = props;
    children = normalizeWithDefaultValue(children, "Subscription details");
    const child = assertSingleChild(children)("SubscriptionDetailsButton");
    const { userId, orgId } = useAuth();
    if (userId === null) {
      throw new Error(
        'Clerk: Ensure that `<SubscriptionDetailsButton />` is rendered only when the user is signed in (wrap with `<Show when="signed-in">` or guard with `useAuth()`).'
      );
    }
    if (orgId === null && _for === "organization") {
      throw new Error(
        'Clerk: Wrap `<SubscriptionDetailsButton for="organization" />` with a check for an active organization. Retrieve `orgId` from `useAuth()` and confirm it is defined. For SSR, see: https://clerk.com/docs/reference/backend/types/auth-object#how-to-access-the-auth-object'
      );
    }
    const clickHandler = () => {
      if (!clerk) {
        return;
      }
      return clerk.__internal_openSubscriptionDetails({
        for: _for,
        onSubscriptionCancel,
        ...subscriptionDetailsProps
      });
    };
    const wrappedChildClickHandler = async (e) => {
      if (child && typeof child === "object" && "props" in child) {
        await safeExecute(child.props.onClick)(e);
      }
      return clickHandler();
    };
    const childProps = { ...rest, onClick: wrappedChildClickHandler };
    return React3.cloneElement(child, childProps);
  },
  { component: "SubscriptionDetailsButton", renderWhileLoading: true }
);

// src/experimental.ts
import {
  __experimental_PaymentElementProvider,
  __experimental_usePaymentElement,
  __experimental_PaymentElement,
  __experimental_usePaymentAttempts,
  __experimental_useStatements,
  __experimental_usePaymentMethods,
  __experimental_usePlans,
  __experimental_useSubscription,
  __experimental_CheckoutProvider,
  __experimental_useCheckout
} from "@clerk/shared/react";
export {
  CheckoutButton,
  __experimental_CheckoutProvider as CheckoutProvider,
  __experimental_PaymentElement as PaymentElement,
  __experimental_PaymentElementProvider as PaymentElementProvider,
  PlanDetailsButton,
  SubscriptionDetailsButton,
  __experimental_useCheckout as useCheckout,
  __experimental_usePaymentAttempts as usePaymentAttempts,
  __experimental_usePaymentElement as usePaymentElement,
  __experimental_usePaymentMethods as usePaymentMethods,
  __experimental_usePlans as usePlans,
  __experimental_useStatements as useStatements,
  __experimental_useSubscription as useSubscription
};
//# sourceMappingURL=experimental.mjs.map