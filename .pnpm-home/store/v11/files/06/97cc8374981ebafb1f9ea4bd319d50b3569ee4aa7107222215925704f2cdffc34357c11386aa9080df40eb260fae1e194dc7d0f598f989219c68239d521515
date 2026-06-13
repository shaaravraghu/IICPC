import type { ClerkPaginationRequest } from '@clerk/shared/types';
import type { PaginatedResourceResponse } from '../resources/Deserializer';
import type { InvitationStatus } from '../resources/Enums';
import type { Invitation } from '../resources/Invitation';
import { AbstractAPI } from './AbstractApi';
import type { WithSign } from './util-types';
type TemplateSlug = 'invitation' | 'waitlist_invitation';
type CreateParams = {
    emailAddress: string;
    expiresInDays?: number;
    ignoreExisting?: boolean;
    notify?: boolean;
    publicMetadata?: UserPublicMetadata;
    redirectUrl?: string;
    templateSlug?: TemplateSlug;
};
type CreateBulkParams = Array<CreateParams>;
type GetInvitationListParams = ClerkPaginationRequest<{
    /**
     * Orders the returned invitations by a specific field and direction.
     *
     * Use a leading '-' for descending order, or no sign/'+' for ascending.
     *
     * Supported fields:
     * - 'created_at' — when the invitation was created
     * - 'email_address' — recipient email address
     * - 'expires_at' — when the invitation expires
     *
     * @example
     * ```ts
     * // Newest first
     * await clerkClient.invitations.getInvitationList({ orderBy: '-created_at' });
     *
     * // Alphabetical by email
     * await clerkClient.invitations.getInvitationList({ orderBy: 'email_address' });
     * ```
     */
    orderBy?: WithSign<'created_at' | 'email_address' | 'expires_at'>;
    /**
     * Filters invitations based on their status.
     *
     * @example
     * Get all revoked invitations
     * ```ts
     * import { createClerkClient } from '@clerk/backend';
     * const clerkClient = createClerkClient(...)
     * await clerkClient.invitations.getInvitationList({ status: 'revoked' })
     * ```
     */
    status?: InvitationStatus;
    /**
     * Filters invitations based on `email_address` or `id`.
     *
     * @example
     * Get all invitations for a specific email address
     * ```ts
     * import { createClerkClient } from '@clerk/backend';
     * const clerkClient = createClerkClient(...)
     * await clerkClient.invitations.getInvitationList({ query: 'user@example.com' })
     * ```
     */
    query?: string;
}>;
export declare class InvitationAPI extends AbstractAPI {
    getInvitationList(params?: GetInvitationListParams): Promise<PaginatedResourceResponse<Invitation[]>>;
    createInvitation(params: CreateParams): Promise<Invitation>;
    createInvitationBulk(params: CreateBulkParams): Promise<Invitation[]>;
    revokeInvitation(invitationId: string): Promise<Invitation>;
}
export {};
//# sourceMappingURL=InvitationApi.d.ts.map