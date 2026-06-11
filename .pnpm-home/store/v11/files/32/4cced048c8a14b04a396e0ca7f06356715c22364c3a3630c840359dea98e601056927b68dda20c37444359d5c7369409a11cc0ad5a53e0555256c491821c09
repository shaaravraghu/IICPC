import type { WaitlistEntryStatus } from './Enums';
import { Invitation } from './Invitation';
import type { WaitlistEntryJSON } from './JSON';
/**
 * The Backend `WaitlistEntry` object holds information about a waitlist entry for a given email address.
 */
export declare class WaitlistEntry {
    /**
     * The unique identifier for this waitlist entry.
     */
    readonly id: string;
    /**
     * The email address to add to the waitlist.
     */
    readonly emailAddress: string;
    /**
     * The status of the waitlist entry.
     */
    readonly status: WaitlistEntryStatus;
    /**
     * The invitation associated with this waitlist entry.
     */
    readonly invitation: Invitation | null;
    /**
     * The date when the waitlist entry was first created.
     */
    readonly createdAt: number;
    /**
     * The date when the waitlist entry was last updated.
     */
    readonly updatedAt: number;
    /**
     * Whether the waitlist entry is locked or not.
     */
    readonly isLocked?: boolean | undefined;
    constructor(
    /**
     * The unique identifier for this waitlist entry.
     */
    id: string, 
    /**
     * The email address to add to the waitlist.
     */
    emailAddress: string, 
    /**
     * The status of the waitlist entry.
     */
    status: WaitlistEntryStatus, 
    /**
     * The invitation associated with this waitlist entry.
     */
    invitation: Invitation | null, 
    /**
     * The date when the waitlist entry was first created.
     */
    createdAt: number, 
    /**
     * The date when the waitlist entry was last updated.
     */
    updatedAt: number, 
    /**
     * Whether the waitlist entry is locked or not.
     */
    isLocked?: boolean | undefined);
    static fromJSON(data: WaitlistEntryJSON): WaitlistEntry;
}
//# sourceMappingURL=WaitlistEntry.d.ts.map