import type { ClerkPaginationRequest } from '@clerk/shared/types';
import type { PaginatedResourceResponse } from '../../api/resources/Deserializer';
import type { APIKey } from '../resources/APIKey';
import type { DeletedObject } from '../resources/DeletedObject';
import { AbstractAPI } from './AbstractApi';
type GetAPIKeyListParams = ClerkPaginationRequest<{
    /**
     * The user or Organization ID to query API keys by
     */
    subject: string;
    /**
     * Whether to include invalid API keys.
     *
     * @default false
     */
    includeInvalid?: boolean;
}>;
type CreateAPIKeyParams = {
    /**
     * API key name
     */
    name: string;
    /**
     * The user or Organization ID to associate the API key with
     */
    subject: string;
    /**
     * API key description
     */
    description?: string | null;
    claims?: Record<string, any> | null;
    scopes?: string[];
    createdBy?: string | null;
    secondsUntilExpiration?: number | null;
};
type RevokeAPIKeyParams = {
    /**
     * API key ID
     */
    apiKeyId: string;
    /**
     * Reason for revocation
     */
    revocationReason?: string | null;
};
type UpdateAPIKeyParams = {
    /**
     * API key ID
     */
    apiKeyId: string;
    /**
     * The user or Organization ID to associate the API key with
     */
    subject: string;
    /**
     * API key description
     */
    description?: string | null;
    claims?: Record<string, any> | null;
    scopes?: string[];
    secondsUntilExpiration?: number | null;
};
export declare class APIKeysAPI extends AbstractAPI {
    list(queryParams: GetAPIKeyListParams): Promise<PaginatedResourceResponse<APIKey[]>>;
    create(params: CreateAPIKeyParams): Promise<APIKey>;
    get(apiKeyId: string): Promise<APIKey>;
    update(params: UpdateAPIKeyParams): Promise<APIKey>;
    delete(apiKeyId: string): Promise<DeletedObject>;
    revoke(params: RevokeAPIKeyParams): Promise<APIKey>;
    getSecret(apiKeyId: string): Promise<{
        secret: string;
    }>;
    verify(secret: string): Promise<APIKey>;
}
export {};
//# sourceMappingURL=APIKeysApi.d.ts.map