import type { M2MTokenJSON } from './JSON';
type M2MJwtPayload = {
    sub: string;
    exp: number;
    iat: number;
    jti?: string;
    aud?: string[];
    scopes?: string;
    [key: string]: unknown;
};
/**
 * The Backend `M2MToken` object holds information about a machine-to-machine token.
 */
export declare class M2MToken {
    readonly id: string;
    readonly subject: string;
    readonly scopes: string[];
    readonly claims: Record<string, any> | null;
    readonly revoked: boolean;
    readonly revocationReason: string | null;
    readonly expired: boolean;
    readonly expiration: number | null;
    readonly createdAt: number;
    readonly updatedAt: number;
    readonly token?: string | undefined;
    constructor(id: string, subject: string, scopes: string[], claims: Record<string, any> | null, revoked: boolean, revocationReason: string | null, expired: boolean, expiration: number | null, createdAt: number, updatedAt: number, token?: string | undefined);
    static fromJSON(data: M2MTokenJSON): M2MToken;
    static fromJwtPayload(payload: M2MJwtPayload, clockSkewInMs?: number): M2MToken;
}
export {};
//# sourceMappingURL=M2MToken.d.ts.map