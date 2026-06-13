import type { BillingMoneyAmount } from '@clerk/shared/types';
import { BillingSubscriptionItem } from './CommerceSubscriptionItem';
import type { BillingSubscriptionJSON } from './JSON';
/**
 * The `BillingSubscription` object is similar to the [`BillingSubscriptionResource`](/docs/reference/types/billing-subscription-resource) object as it holds information about a subscription, as well as methods for managing it. However, the `BillingSubscription` object is different in that it is used in the [Backend API](https://clerk.com/docs/reference/backend-api/tag/billing/GET/organizations/%7Borganization_id%7D/billing/subscription) and is not directly accessible from the Frontend API.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
export declare class BillingSubscription {
    /**
     * The unique identifier for the billing subscription.
     */
    readonly id: string;
    /**
     * The current status of the subscription.
     */
    readonly status: BillingSubscriptionJSON['status'];
    /**
     * The ID of the payer for this subscription.
     */
    readonly payerId: string;
    /**
     * Unix timestamp (milliseconds) of when the subscription was created.
     */
    readonly createdAt: number;
    /**
     * Unix timestamp (milliseconds) of when the subscription was last updated.
     */
    readonly updatedAt: number;
    /**
     * Unix timestamp (milliseconds) of when the subscription became active.
     */
    readonly activeAt: number | null;
    /**
     * Unix timestamp (milliseconds) of when the subscription became past due.
     */
    readonly pastDueAt: number | null;
    /**
     * Array of subscription items in this subscription.
     */
    readonly subscriptionItems: BillingSubscriptionItem[];
    /**
     * Information about the next scheduled payment.
     */
    readonly nextPayment: {
        date: number;
        amount: BillingMoneyAmount;
    } | null;
    /**
     * Whether the payer is eligible for a free trial.
     */
    readonly eligibleForFreeTrial: boolean;
    constructor(
    /**
     * The unique identifier for the billing subscription.
     */
    id: string, 
    /**
     * The current status of the subscription.
     */
    status: BillingSubscriptionJSON['status'], 
    /**
     * The ID of the payer for this subscription.
     */
    payerId: string, 
    /**
     * Unix timestamp (milliseconds) of when the subscription was created.
     */
    createdAt: number, 
    /**
     * Unix timestamp (milliseconds) of when the subscription was last updated.
     */
    updatedAt: number, 
    /**
     * Unix timestamp (milliseconds) of when the subscription became active.
     */
    activeAt: number | null, 
    /**
     * Unix timestamp (milliseconds) of when the subscription became past due.
     */
    pastDueAt: number | null, 
    /**
     * Array of subscription items in this subscription.
     */
    subscriptionItems: BillingSubscriptionItem[], 
    /**
     * Information about the next scheduled payment.
     */
    nextPayment: {
        date: number;
        amount: BillingMoneyAmount;
    } | null, 
    /**
     * Whether the payer is eligible for a free trial.
     */
    eligibleForFreeTrial: boolean);
    static fromJSON(data: BillingSubscriptionJSON): BillingSubscription;
}
//# sourceMappingURL=CommerceSubscription.d.ts.map