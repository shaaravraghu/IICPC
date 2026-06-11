import type { BillingMoneyAmount } from '@clerk/shared/types';
import { BillingPlan } from './CommercePlan';
import type { BillingSubscriptionItemJSON } from './JSON';
/**
 * The `BillingSubscriptionItem` object is similar to the [`BillingSubscriptionItemResource`](/docs/reference/types/billing-subscription-item-resource) object as it holds information about a subscription item, as well as methods for managing it. However, the `BillingSubscriptionItem` object is different in that it is used in the [Backend API](https://clerk.com/docs/reference/backend-api/tag/billing/GET/billing/subscription_items) and is not directly accessible from the Frontend API.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
export declare class BillingSubscriptionItem {
    /**
     * The unique identifier for the subscription item.
     */
    readonly id: string;
    /**
     * The status of the subscription item.
     */
    readonly status: BillingSubscriptionItemJSON['status'];
    /**
     * The Plan period for the subscription item.
     */
    readonly planPeriod: 'month' | 'annual';
    /**
     * Unix timestamp (milliseconds) of when the current period starts.
     */
    readonly periodStart: number;
    /**
     * The next payment information.
     */
    readonly nextPayment: {
        /**
         * The amount of the next payment.
         */
        amount: number;
        /**
         * Unix timestamp (milliseconds) of when the next payment is scheduled.
         */
        date: number;
    } | null | undefined;
    /**
     * The current amount for the subscription item.
     */
    readonly amount: BillingMoneyAmount | undefined;
    /**
     * The Plan associated with this subscription item.
     */
    readonly plan: BillingPlan | null;
    /**
     * The Plan ID.
     */
    readonly planId: string | null;
    /**
     * Unix timestamp (milliseconds) of when the subscription item was created.
     */
    readonly createdAt: number;
    /**
     * Unix timestamp (milliseconds) of when the subscription item was last updated.
     */
    readonly updatedAt: number;
    /**
     * Unix timestamp (milliseconds) of when the current period ends.
     */
    readonly periodEnd: number | null;
    /**
     * Unix timestamp (milliseconds) of when the subscription item was canceled.
     */
    readonly canceledAt: number | null;
    /**
     * Unix timestamp (milliseconds) of when the subscription item became past due.
     */
    readonly pastDueAt: number | null;
    /**
     * Unix timestamp (milliseconds) of when the subscription item ended.
     */
    readonly endedAt: number | null;
    /**
     * The payer ID.
     */
    readonly payerId: string | undefined;
    /**
     * Whether this subscription item is currently in a free trial period.
     */
    readonly isFreeTrial?: boolean | undefined;
    /**
     * The lifetime amount paid for this subscription item.
     */
    readonly lifetimePaid?: BillingMoneyAmount | undefined;
    constructor(
    /**
     * The unique identifier for the subscription item.
     */
    id: string, 
    /**
     * The status of the subscription item.
     */
    status: BillingSubscriptionItemJSON['status'], 
    /**
     * The Plan period for the subscription item.
     */
    planPeriod: 'month' | 'annual', 
    /**
     * Unix timestamp (milliseconds) of when the current period starts.
     */
    periodStart: number, 
    /**
     * The next payment information.
     */
    nextPayment: {
        /**
         * The amount of the next payment.
         */
        amount: number;
        /**
         * Unix timestamp (milliseconds) of when the next payment is scheduled.
         */
        date: number;
    } | null | undefined, 
    /**
     * The current amount for the subscription item.
     */
    amount: BillingMoneyAmount | undefined, 
    /**
     * The Plan associated with this subscription item.
     */
    plan: BillingPlan | null, 
    /**
     * The Plan ID.
     */
    planId: string | null, 
    /**
     * Unix timestamp (milliseconds) of when the subscription item was created.
     */
    createdAt: number, 
    /**
     * Unix timestamp (milliseconds) of when the subscription item was last updated.
     */
    updatedAt: number, 
    /**
     * Unix timestamp (milliseconds) of when the current period ends.
     */
    periodEnd: number | null, 
    /**
     * Unix timestamp (milliseconds) of when the subscription item was canceled.
     */
    canceledAt: number | null, 
    /**
     * Unix timestamp (milliseconds) of when the subscription item became past due.
     */
    pastDueAt: number | null, 
    /**
     * Unix timestamp (milliseconds) of when the subscription item ended.
     */
    endedAt: number | null, 
    /**
     * The payer ID.
     */
    payerId: string | undefined, 
    /**
     * Whether this subscription item is currently in a free trial period.
     */
    isFreeTrial?: boolean | undefined, 
    /**
     * The lifetime amount paid for this subscription item.
     */
    lifetimePaid?: BillingMoneyAmount | undefined);
    static fromJSON(data: BillingSubscriptionItemJSON): BillingSubscriptionItem;
}
//# sourceMappingURL=CommerceSubscriptionItem.d.ts.map