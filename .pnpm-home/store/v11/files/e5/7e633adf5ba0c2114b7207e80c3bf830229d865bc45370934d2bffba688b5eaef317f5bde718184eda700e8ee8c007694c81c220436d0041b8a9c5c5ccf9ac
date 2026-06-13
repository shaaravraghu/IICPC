import { Organization } from '../resources';
import type { OrganizationMembershipRole } from './Enums';
import type { OrganizationMembershipJSON, OrganizationMembershipPublicUserDataJSON } from './JSON';
/**
 * The Backend `OrganizationMembership` object is similar to the [`OrganizationMembership`](https://clerk.com/docs/reference/types/organization-membership) object as it's the model around an Organization membership entity and describes the relationship between users and Organizations. However, the Backend `OrganizationMembership` object is different in that it's used in the [Backend API](https://clerk.com/docs/reference/backend-api/model/OrganizationMembership){{ target: '_blank' }} and is not directly accessible from the Frontend API.
 */
export declare class OrganizationMembership {
    /**
     * The unique identifier for the membership.
     */
    readonly id: string;
    /**
     * The Role of the user.
     */
    readonly role: OrganizationMembershipRole;
    /**
     * The Permissions granted to the user in the Organization.
     */
    readonly permissions: string[];
    /**
     * Metadata that can be read from the Frontend API and [Backend API](https://clerk.com/docs/reference/backend-api){{ target: '_blank' }} and can be set only from the Backend API.
     */
    readonly publicMetadata: OrganizationMembershipPublicMetadata;
    /**
     * Metadata that can be read and set only from the [Backend API](https://clerk.com/docs/reference/backend-api){{ target: '_blank' }}.
     */
    readonly privateMetadata: OrganizationMembershipPrivateMetadata;
    /**
     * The date when the membership was first created.
     */
    readonly createdAt: number;
    /**
     * The date when the membership was last updated.
     */
    readonly updatedAt: number;
    /**
     * The Organization that the user is a member of.
     */
    readonly organization: Organization;
    /**
     * Public information about the user that this membership belongs to.
     */
    readonly publicUserData?: (OrganizationMembershipPublicUserData | null) | undefined;
    private _raw;
    get raw(): OrganizationMembershipJSON | null;
    constructor(
    /**
     * The unique identifier for the membership.
     */
    id: string, 
    /**
     * The Role of the user.
     */
    role: OrganizationMembershipRole, 
    /**
     * The Permissions granted to the user in the Organization.
     */
    permissions: string[], 
    /**
     * Metadata that can be read from the Frontend API and [Backend API](https://clerk.com/docs/reference/backend-api){{ target: '_blank' }} and can be set only from the Backend API.
     */
    publicMetadata: OrganizationMembershipPublicMetadata | undefined, 
    /**
     * Metadata that can be read and set only from the [Backend API](https://clerk.com/docs/reference/backend-api){{ target: '_blank' }}.
     */
    privateMetadata: OrganizationMembershipPrivateMetadata | undefined, 
    /**
     * The date when the membership was first created.
     */
    createdAt: number, 
    /**
     * The date when the membership was last updated.
     */
    updatedAt: number, 
    /**
     * The Organization that the user is a member of.
     */
    organization: Organization, 
    /**
     * Public information about the user that this membership belongs to.
     */
    publicUserData?: (OrganizationMembershipPublicUserData | null) | undefined);
    static fromJSON(data: OrganizationMembershipJSON): OrganizationMembership;
}
/**
 * @class
 */
export declare class OrganizationMembershipPublicUserData {
    /**
     * The identifier of the user.
     */
    readonly identifier: string;
    /**
     * The first name of the user.
     */
    readonly firstName: string | null;
    /**
     * The last name of the user.
     */
    readonly lastName: string | null;
    /**
     * Holds the default avatar or user's uploaded profile image. Compatible with Clerk's [Image Optimization](https://clerk.com/docs/guides/development/image-optimization).
     */
    readonly imageUrl: string;
    /**
     * Whether the user has a profile picture.
     */
    readonly hasImage: boolean;
    /**
     * The ID of the user that this public data belongs to.
     */
    readonly userId: string;
    constructor(
    /**
     * The identifier of the user.
     */
    identifier: string, 
    /**
     * The first name of the user.
     */
    firstName: string | null, 
    /**
     * The last name of the user.
     */
    lastName: string | null, 
    /**
     * Holds the default avatar or user's uploaded profile image. Compatible with Clerk's [Image Optimization](https://clerk.com/docs/guides/development/image-optimization).
     */
    imageUrl: string, 
    /**
     * Whether the user has a profile picture.
     */
    hasImage: boolean, 
    /**
     * The ID of the user that this public data belongs to.
     */
    userId: string);
    static fromJSON(data: OrganizationMembershipPublicUserDataJSON): OrganizationMembershipPublicUserData;
}
//# sourceMappingURL=OrganizationMembership.d.ts.map