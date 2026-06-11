import * as _clerk_shared_types from '@clerk/shared/types';
import { __experimental_CheckoutButtonProps, __experimental_PlanDetailsButtonProps, __experimental_SubscriptionDetailsButtonProps } from '@clerk/shared/types';
export { __experimental_CheckoutButtonProps as CheckoutButtonProps, __experimental_PlanDetailsButtonProps as PlanDetailsButtonProps, __experimental_SubscriptionDetailsButtonProps as SubscriptionDetailsButtonProps } from '@clerk/shared/types';
import React from 'react';
import { WithClerkProp } from './types.js';
export { __experimental_CheckoutProvider as CheckoutProvider, __experimental_PaymentElement as PaymentElement, __experimental_PaymentElementProvider as PaymentElementProvider, __experimental_useCheckout as useCheckout, __experimental_usePaymentAttempts as usePaymentAttempts, __experimental_usePaymentElement as usePaymentElement, __experimental_usePaymentMethods as usePaymentMethods, __experimental_usePlans as usePlans, __experimental_useStatements as useStatements, __experimental_useSubscription as useSubscription } from '@clerk/shared/react';
import '@clerk/shared/ui';
import '@clerk/ui/internal';

/**
 * A button component that opens the Clerk Checkout drawer when clicked. Render only when the user is signed in (e.g., wrap with `<Show when="signed-in">`).
 *
 * @example
 * ```tsx
 * import { Show } from '@clerk/react';
 * import { CheckoutButton } from '@clerk/react/experimental';
 *
 * // Basic usage with default "Checkout" text
 * function BasicCheckout() {
 *   return (
 *     <Show when="signed-in">
 *       <CheckoutButton planId="plan_123" />
 *     </Show>
 *   );
 * }
 *
 * // Custom button with organization subscription
 * function OrganizationCheckout() {
 *   return (
 *     <Show when="signed-in">
 *       <CheckoutButton
 *         planId="plan_123"
 *         planPeriod="month"
 *         for="organization"
 *         onSubscriptionComplete={() => console.log('Subscription completed!')}
 *       >
 *         <button className="custom-button">Subscribe Now</button>
 *       </CheckoutButton>
 *     </Show>
 *   );
 * }
 * ```
 *
 * @throws {Error} When rendered while the user is signed out
 * @throws {Error} When `for="organization"` is used without an active organization context
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
declare const CheckoutButton: {
    (props: _clerk_shared_types.Without<WithClerkProp<React.PropsWithChildren<__experimental_CheckoutButtonProps>>, "clerk">): React.JSX.Element | null;
    displayName: string;
};

/**
 * A button component that opens the Clerk Plan Details drawer when clicked. This component is part of
 * Clerk's Billing feature which is available under a public beta.
 *
 * @example
 * ```tsx
 * import { Show } from '@clerk/react';
 * import { PlanDetailsButton } from '@clerk/react/experimental';
 *
 * // Basic usage with default "Plan details" text
 * function BasicPlanDetails() {
 *   return <PlanDetailsButton planId="plan_123" />;
 * }
 *
 * // Custom button with custom text
 * function CustomPlanDetails() {
 *   return (
 *     <Show when="signed-in">
 *       <PlanDetailsButton planId="plan_123">
 *         <button>View Plan Details</button>
 *       </PlanDetailsButton>
 *     </Show>
 *   );
 * }
 * ```
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
declare const PlanDetailsButton: {
    (props: _clerk_shared_types.Without<WithClerkProp<React.PropsWithChildren<__experimental_PlanDetailsButtonProps>>, "clerk">): React.JSX.Element | null;
    displayName: string;
};

/**
 * A button component that opens the Clerk Subscription Details drawer when clicked. Render only when the user is signed in (e.g., wrap with `<Show when="signed-in">`).
 *
 * @example
 * ```tsx
 * import { Show } from '@clerk/react';
 * import { SubscriptionDetailsButton } from '@clerk/react/experimental';
 *
 * // Basic usage with default "Subscription details" text
 * function BasicSubscriptionDetails() {
 *   return (
 *     <Show when="signed-in">
 *       <SubscriptionDetailsButton />
 *     </Show>
 *   );
 * }
 *
 * // Custom button with Organization Subscription
 * function OrganizationSubscriptionDetails() {
 *   return (
 *     <Show when="signed-in">
 *       <SubscriptionDetailsButton
 *         for="organization"
 *         onSubscriptionCancel={() => console.log('Subscription canceled')}
 *       >
 *         <button>View Organization Subscription</button>
 *       </SubscriptionDetailsButton>
 *     </Show>
 *   );
 * }
 * ```
 *
 * @throws {Error} When rendered while the user is signed out
 * @throws {Error} When `for="organization"` is used without an Active Organization context
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
declare const SubscriptionDetailsButton: {
    (props: _clerk_shared_types.Without<WithClerkProp<React.PropsWithChildren<__experimental_SubscriptionDetailsButtonProps>>, "clerk">): React.JSX.Element | null;
    displayName: string;
};

export { CheckoutButton, PlanDetailsButton, SubscriptionDetailsButton };
