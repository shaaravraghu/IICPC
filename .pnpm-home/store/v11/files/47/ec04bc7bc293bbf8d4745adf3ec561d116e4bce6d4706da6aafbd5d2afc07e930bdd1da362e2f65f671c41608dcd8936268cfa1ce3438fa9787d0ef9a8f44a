import type { BillingMoneyAmount } from '@clerk/shared/types';
import { Feature } from './Feature';
import type { BillingPlanJSON } from './JSON';
/**
 * The `BillingPlan` object is similar to the [`BillingPlanResource`](/docs/reference/types/billing-plan-resource) object as it holds information about a Plan, as well as methods for managing it. However, the `BillingPlan` object is different in that it is used in the [Backend API](https://clerk.com/docs/reference/backend-api/tag/billing/GET/billing/plans) and is not directly accessible from the Frontend API.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
export declare class BillingPlan {
    /**
     * The unique identifier for the Plan.
     */
    readonly id: string;
    /**
     * The name of the Plan.
     */
    readonly name: string;
    /**
     * The URL-friendly identifier of the Plan.
     */
    readonly slug: string;
    /**
     * The description of the Plan.
     */
    readonly description: string | null;
    /**
     * Whether the Plan is the default Plan.
     */
    readonly isDefault: boolean;
    /**
     * Whether the Plan is recurring.
     */
    readonly isRecurring: boolean;
    /**
     * Whether the Plan has a base fee.
     */
    readonly hasBaseFee: boolean;
    /**
     * Whether the Plan is displayed in the `<PriceTable/>` component.
     */
    readonly publiclyVisible: boolean;
    /**
     * The monthly fee of the Plan.
     */
    readonly fee: BillingMoneyAmount | null;
    /**
     * The annual fee of the Plan.
     */
    readonly annualFee: BillingMoneyAmount | null;
    /**
     * The annual fee of the Plan on a monthly basis.
     */
    readonly annualMonthlyFee: BillingMoneyAmount | null;
    /**
     * The type of payer for the Plan.
     */
    readonly forPayerType: 'org' | 'user';
    /**
     * The features the Plan offers.
     */
    readonly features: Feature[];
    /**
     * The URL of the Plan's avatar image.
     */
    readonly avatarUrl: string | null;
    /**
     * Number of free trial days for this plan.
     */
    readonly freeTrialDays: number | null;
    /**
     * Whether free trial is enabled for this plan.
     */
    readonly freeTrialEnabled: boolean;
    constructor(
    /**
     * The unique identifier for the Plan.
     */
    id: string, 
    /**
     * The name of the Plan.
     */
    name: string, 
    /**
     * The URL-friendly identifier of the Plan.
     */
    slug: string, 
    /**
     * The description of the Plan.
     */
    description: string | null, 
    /**
     * Whether the Plan is the default Plan.
     */
    isDefault: boolean, 
    /**
     * Whether the Plan is recurring.
     */
    isRecurring: boolean, 
    /**
     * Whether the Plan has a base fee.
     */
    hasBaseFee: boolean, 
    /**
     * Whether the Plan is displayed in the `<PriceTable/>` component.
     */
    publiclyVisible: boolean, 
    /**
     * The monthly fee of the Plan.
     */
    fee: BillingMoneyAmount | null, 
    /**
     * The annual fee of the Plan.
     */
    annualFee: BillingMoneyAmount | null, 
    /**
     * The annual fee of the Plan on a monthly basis.
     */
    annualMonthlyFee: BillingMoneyAmount | null, 
    /**
     * The type of payer for the Plan.
     */
    forPayerType: 'org' | 'user', 
    /**
     * The features the Plan offers.
     */
    features: Feature[], 
    /**
     * The URL of the Plan's avatar image.
     */
    avatarUrl: string | null, 
    /**
     * Number of free trial days for this plan.
     */
    freeTrialDays: number | null, 
    /**
     * Whether free trial is enabled for this plan.
     */
    freeTrialEnabled: boolean);
    static fromJSON(data: BillingPlanJSON): BillingPlan;
}
//# sourceMappingURL=CommercePlan.d.ts.map