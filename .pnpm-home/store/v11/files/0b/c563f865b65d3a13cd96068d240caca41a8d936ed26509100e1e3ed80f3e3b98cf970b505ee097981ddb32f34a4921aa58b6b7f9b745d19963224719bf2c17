import type { ClerkPaginationRequest } from '@clerk/shared/types';
import type { JwtMachineVerifyOptions } from '../../jwt/verifyMachineJwt';
import type { RequestFunction } from '../request';
import type { PaginatedResourceResponse } from '../resources/Deserializer';
import type { M2MToken } from '../resources/M2MToken';
import { AbstractAPI } from './AbstractApi';
/**
 * Format of the M2M token to create.
 * - 'opaque': Opaque token with mt_ prefix
 * - 'jwt': JWT signed with instance keys
 */
export type M2MTokenFormat = 'opaque' | 'jwt';
type GetM2MTokenListParams = ClerkPaginationRequest<{
    /**
     * Custom machine secret key for authentication.
     */
    machineSecretKey?: string;
    /**
     * The machine ID to query machine-to-machine tokens by
     */
    subject: string;
    /**
     * Whether to include revoked machine-to-machine tokens.
     *
     * @default false
     */
    revoked?: boolean;
    /**
     * Whether to include expired machine-to-machine tokens.
     *
     * @default false
     */
    expired?: boolean;
}>;
type CreateM2MTokenParams = {
    /**
     * Custom machine secret key for authentication.
     */
    machineSecretKey?: string;
    /**
     * Number of seconds until the token expires.
     *
     * @default null - Token does not expire
     */
    secondsUntilExpiration?: number | null;
    claims?: Record<string, unknown> | null;
    /**
     * Enables server-side token reuse for opaque tokens when an existing token
     * with matching claims/scopes still has at least this many seconds remaining.
     */
    minRemainingTtlSeconds?: number;
    /**
     * @default 'opaque'
     */
    tokenFormat?: M2MTokenFormat;
};
type RevokeM2MTokenParams = {
    /**
     * Custom machine secret key for authentication.
     */
    machineSecretKey?: string;
    /**
     * Machine-to-machine token ID to revoke.
     */
    m2mTokenId: string;
    revocationReason?: string | null;
};
type VerifyM2MTokenParams = {
    /**
     * Custom machine secret key for authentication.
     */
    machineSecretKey?: string;
    /**
     * Machine-to-machine token to verify.
     */
    token: string;
};
export declare class M2MTokenApi extends AbstractAPI {
    #private;
    /**
     * @param verifyOptions - JWT verification options (secretKey, apiUrl, etc.).
     * Passed explicitly because BuildRequestOptions are captured inside the buildRequest closure
     * and are not accessible from the RequestFunction itself.
     */
    constructor(request: RequestFunction, verifyOptions?: JwtMachineVerifyOptions);
    list(queryParams: GetM2MTokenListParams): Promise<PaginatedResourceResponse<M2MToken[]>>;
    createToken(params?: CreateM2MTokenParams): Promise<M2MToken>;
    revokeToken(params: RevokeM2MTokenParams): Promise<M2MToken>;
    verify(params: VerifyM2MTokenParams): Promise<M2MToken>;
}
export {};
//# sourceMappingURL=M2MTokenApi.d.ts.map