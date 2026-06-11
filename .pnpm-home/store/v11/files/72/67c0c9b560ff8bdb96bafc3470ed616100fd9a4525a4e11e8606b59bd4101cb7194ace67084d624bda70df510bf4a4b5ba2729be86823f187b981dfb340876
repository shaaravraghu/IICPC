import type { ClerkPaginationRequest } from '@clerk/shared/types';
import type { BillingPlan } from '../resources/CommercePlan';
import type { BillingSubscription } from '../resources/CommerceSubscription';
import type { BillingSubscriptionItem } from '../resources/CommerceSubscriptionItem';
import type { PaginatedResourceResponse } from '../resources/Deserializer';
import { AbstractAPI } from './AbstractApi';
type GetOrganizationListParams = ClerkPaginationRequest<{
    payerType: 'org' | 'user';
}>;
type CancelSubscriptionItemParams = {
    /**
     * If true, the subscription item will be canceled immediately. If false or undefined, the subscription item will be canceled at the end of the current billing period.
     * @default undefined
     */
    endNow?: boolean;
};
type ExtendSubscriptionItemFreeTrialParams = {
    /**
     * RFC3339 timestamp to extend the free trial to.
     * Must be in the future and not more than 365 days from the current trial end.
     */
    extendTo: Date;
};
export declare class BillingAPI extends AbstractAPI {
    /**
     * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
     */
    getPlanList(params?: GetOrganizationListParams): Promise<PaginatedResourceResponse<BillingPlan[]>>;
    /**
     * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
     */
    cancelSubscriptionItem(subscriptionItemId: string, params?: CancelSubscriptionItemParams): Promise<BillingSubscriptionItem>;
    /**
     * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
     */
    extendSubscriptionItemFreeTrial(subscriptionItemId: string, params: ExtendSubscriptionItemFreeTrialParams): Promise<BillingSubscriptionItem>;
    /**
     * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
     */
    getOrganizationBillingSubscription(organizationId: string): Promise<BillingSubscription>;
    /**
     * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
     */
    getUserBillingSubscription(userId: string): Promise<BillingSubscription>;
}
export {};
//# sourceMappingURL=BillingApi.d.ts.map