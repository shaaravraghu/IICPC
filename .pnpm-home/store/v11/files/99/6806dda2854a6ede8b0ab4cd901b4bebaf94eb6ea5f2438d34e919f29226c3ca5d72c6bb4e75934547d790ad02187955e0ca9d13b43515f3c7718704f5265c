import type { Jwt } from '@clerk/shared/types';
import { IdPOAuthAccessToken } from '../api/resources/IdPOAuthAccessToken';
import { M2MToken } from '../api/resources/M2MToken';
import { MachineTokenVerificationError } from '../errors';
import type { MachineTokenReturnType } from '../jwt/types';
import type { LoadClerkJWKFromRemoteOptions } from '../tokens/keys';
export type JwtMachineVerifyOptions = Pick<LoadClerkJWKFromRemoteOptions, 'secretKey' | 'apiUrl' | 'skipJwksCache'> & {
    jwtKey?: string;
    clockSkewInMs?: number;
};
/**
 * Verifies a pre-decoded M2M JWT (identified by `sub` starting with `mch_`).
 */
export declare function verifyM2MJwt(token: string, decoded: Jwt, options: JwtMachineVerifyOptions): Promise<MachineTokenReturnType<M2MToken, MachineTokenVerificationError>>;
/**
 * Verifies a pre-decoded OAuth access token JWT (identified by `typ: at+jwt` or `application/at+jwt`).
 */
export declare function verifyOAuthJwt(token: string, decoded: Jwt, options: JwtMachineVerifyOptions): Promise<MachineTokenReturnType<IdPOAuthAccessToken, MachineTokenVerificationError>>;
//# sourceMappingURL=verifyMachineJwt.d.ts.map