import { ar as EmailLinkErrorCodeStatus } from "../../index-Ch3QvM-g.mjs";
import "../../moduleManager-BsmFyRrH.mjs";

//#region src/internal/clerk-js/queryParams.d.ts
declare const _ClerkQueryParams: readonly ["__clerk_status", "__clerk_created_session", "__clerk_invitation_token", "__clerk_ticket", "__clerk_modal_state", "__clerk_handshake", "__clerk_handshake_nonce", "__clerk_help", "__clerk_netlify_cache_bust", "__clerk_synced", "__clerk_satellite_url", "suffixed_cookies"];
type ClerkQueryParam = (typeof _ClerkQueryParams)[number];
/**
 * Used for email link verification
 */
type VerifyTokenStatus = 'verified' | (typeof EmailLinkErrorCodeStatus)[keyof typeof EmailLinkErrorCodeStatus];
/**
 * Used for instance invitations and organization invitations
 */
type TicketStatus = 'sign_in' | 'sign_up' | 'complete';
type ClerkQueryParamsToValuesMap = {
  __clerk_status: TicketStatus | VerifyTokenStatus;
} & Record<(typeof _ClerkQueryParams)[number], string>;
/**
 *
 */
declare function getClerkQueryParam<T extends ClerkQueryParam>(param: T): ClerkQueryParamsToValuesMap[T] | null;
/**
 *
 */
declare function removeClerkQueryParam<T extends ClerkQueryParam>(param: T): void;
/**
 * Extracts and forwards Clerk query parameters from the current URL to a new URLSearchParams object.
 * This is useful when navigating between pages while preserving Clerk-specific query parameters.
 *
 * @param params - Optional URLSearchParams object to add the parameters to. If not provided, a new one will be created.
 * @returns A URLSearchParams object containing the forwarded Clerk parameters
 */
declare function forwardClerkQueryParams(params?: URLSearchParams): URLSearchParams;
//#endregion
export { VerifyTokenStatus, forwardClerkQueryParams, getClerkQueryParam, removeClerkQueryParam };
//# sourceMappingURL=queryParams.d.mts.map