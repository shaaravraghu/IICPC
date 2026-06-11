import type { OrganizationJSON } from './JSON';
/**
 * The Backend `Organization` object is similar to the [`Organization`](https://clerk.com/docs/reference/objects/organization) object as it holds information about an Organization, as well as methods for managing it. However, the Backend `Organization` object is different in that it is used in the [Backend API](https://clerk.com/docs/reference/backend-api/model/Organization){{ target: '_blank' }} and is not directly accessible from the Frontend API.
 */
export declare class Organization {
    /**
     * The unique identifier for the Organization.
     */
    readonly id: string;
    /**
     * The name of the Organization.
     */
    readonly name: string;
    /**
     * The URL-friendly identifier of the user's active Organization. If supplied, it must be unique for the instance.
     */
    readonly slug: string;
    /**
     * Holds the Organization's logo. Compatible with Clerk's [Image Optimization](https://clerk.com/docs/guides/development/image-optimization).
     */
    readonly imageUrl: string;
    /**
     * Whether the Organization has an image.
     */
    readonly hasImage: boolean;
    /**
     * The date when the Organization was first created.
     */
    readonly createdAt: number;
    /**
     * The date when the Organization was last updated.
     */
    readonly updatedAt: number;
    /**
     * Metadata that can be read from the Frontend API and [Backend API](https://clerk.com/docs/reference/backend-api){{ target: '_blank' }} and can be set only from the Backend API.
     */
    readonly publicMetadata: OrganizationPublicMetadata | null;
    /**
     * Metadata that can be read and set only from the [Backend API](https://clerk.com/docs/reference/backend-api){{ target: '_blank' }}.
     */
    readonly privateMetadata: OrganizationPrivateMetadata;
    /**
     * The maximum number of memberships allowed in the Organization.
     */
    readonly maxAllowedMemberships: number;
    /**
     * Whether the Organization allows admins to delete users.
     */
    readonly adminDeleteEnabled: boolean;
    /**
     * The number of members in the Organization.
     */
    readonly membersCount?: number | undefined;
    /**
     * The ID of the user who created the Organization.
     */
    readonly createdBy?: string | undefined;
    private _raw;
    get raw(): OrganizationJSON | null;
    constructor(
    /**
     * The unique identifier for the Organization.
     */
    id: string, 
    /**
     * The name of the Organization.
     */
    name: string, 
    /**
     * The URL-friendly identifier of the user's active Organization. If supplied, it must be unique for the instance.
     */
    slug: string, 
    /**
     * Holds the Organization's logo. Compatible with Clerk's [Image Optimization](https://clerk.com/docs/guides/development/image-optimization).
     */
    imageUrl: string, 
    /**
     * Whether the Organization has an image.
     */
    hasImage: boolean, 
    /**
     * The date when the Organization was first created.
     */
    createdAt: number, 
    /**
     * The date when the Organization was last updated.
     */
    updatedAt: number, 
    /**
     * Metadata that can be read from the Frontend API and [Backend API](https://clerk.com/docs/reference/backend-api){{ target: '_blank' }} and can be set only from the Backend API.
     */
    publicMetadata: (OrganizationPublicMetadata | null) | undefined, 
    /**
     * Metadata that can be read and set only from the [Backend API](https://clerk.com/docs/reference/backend-api){{ target: '_blank' }}.
     */
    privateMetadata: OrganizationPrivateMetadata | undefined, 
    /**
     * The maximum number of memberships allowed in the Organization.
     */
    maxAllowedMemberships: number, 
    /**
     * Whether the Organization allows admins to delete users.
     */
    adminDeleteEnabled: boolean, 
    /**
     * The number of members in the Organization.
     */
    membersCount?: number | undefined, 
    /**
     * The ID of the user who created the Organization.
     */
    createdBy?: string | undefined);
    static fromJSON(data: OrganizationJSON): Organization;
}
//# sourceMappingURL=Organization.d.ts.map