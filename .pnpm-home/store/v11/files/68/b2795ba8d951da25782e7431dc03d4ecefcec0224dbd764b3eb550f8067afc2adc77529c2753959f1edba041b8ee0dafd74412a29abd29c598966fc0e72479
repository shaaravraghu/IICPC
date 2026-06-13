import type { AuthenticateRequestOptions } from '../tokens/types';
import type { MachineTokenType } from './tokenTypes';
import { TokenType } from './tokenTypes';
export declare const M2M_TOKEN_PREFIX = "mt_";
export declare const M2M_SUBJECT_PREFIX = "mch_";
export declare const OAUTH_TOKEN_PREFIX = "oat_";
export declare const API_KEY_PREFIX = "ak_";
export declare const JwtFormatRegExp: RegExp;
export declare function isJwtFormat(token: string): boolean;
/**
 * Valid OAuth 2.0 JWT access token type values per RFC 9068.
 * @see https://www.rfc-editor.org/rfc/rfc9068.html#section-2.1
 */
export declare const OAUTH_ACCESS_TOKEN_TYPES: string[];
/**
 * Checks if a token is an OAuth 2.0 JWT access token.
 * Validates the JWT format and verifies the header 'typ' field matches RFC 9068 values.
 *
 * @param token - The token string to check
 * @returns true if the token is a valid OAuth JWT access token
 * @see https://www.rfc-editor.org/rfc/rfc9068.html#section-2.1
 */
export declare function isOAuthJwt(token: string): boolean;
/**
 * Checks if a token is an M2M JWT token.
 * Validates the JWT format and verifies the payload 'sub' field starts with 'mch_'.
 *
 * @param token - The token string to check
 * @returns true if the token is a valid M2M JWT token
 */
export declare function isM2MJwt(token: string): boolean;
/**
 * Checks if a token is a machine JWT (OAuth JWT or M2M JWT).
 * Useful for rejecting machine JWTs when expecting session tokens.
 *
 * @param token - The token string to check
 * @returns true if the token is an OAuth or M2M JWT
 */
export declare function isMachineJwt(token: string): boolean;
/**
 * Checks if a token is a machine token by looking at its prefix.
 *
 * @remarks
 * In the future, this will support custom prefixes that can be prepended to the base prefixes
 * (e.g. "org_a_m2m_", "org_a_oauth_access_", "org_a_api_key_")
 *
 * @param token - The token string to check
 * @returns true if the token starts with a recognized machine token prefix
 */
export declare function isMachineTokenByPrefix(token: string): boolean;
/**
 * Checks if a token is a machine token by looking at its prefix or if it's an OAuth/M2M JWT.
 *
 * @param token - The token string to check
 * @returns true if the token is a machine token
 */
export declare function isMachineToken(token: string): boolean;
/**
 * Gets the specific type of machine token based on its prefix or JWT claims.
 *
 * @remarks
 * In the future, this will support custom prefixes that can be prepended to the base prefixes
 * (e.g. "org_a_m2m_", "org_a_oauth_access_", "org_a_api_key_")
 *
 * @param token - The token string to check
 * @returns The specific MachineTokenType
 * @throws Error if the token doesn't match any known machine token type
 */
export declare function getMachineTokenType(token: string): MachineTokenType;
/**
 * Check if a token type is accepted given a requested token type or list of token types.
 *
 * @param tokenType - The token type to check (can be null if the token is invalid)
 * @param acceptsToken - The requested token type or list of token types
 * @returns true if the token type is accepted
 */
export declare const isTokenTypeAccepted: (tokenType: TokenType | null, acceptsToken: NonNullable<AuthenticateRequestOptions["acceptsToken"]>) => boolean;
/**
 * Checks if a token type string is a machine token type (api_key, m2m_token, or oauth_token).
 *
 * @param type - The token type string to check
 * @returns true if the type is a machine token type
 */
export declare function isMachineTokenType(type: string): type is MachineTokenType;
//# sourceMappingURL=machine.d.ts.map