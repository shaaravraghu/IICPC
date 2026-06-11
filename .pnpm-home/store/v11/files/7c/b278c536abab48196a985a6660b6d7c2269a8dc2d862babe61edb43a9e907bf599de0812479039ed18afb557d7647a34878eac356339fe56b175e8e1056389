import type { ClerkPaginationRequest } from '@clerk/shared/types';
import type { EnterpriseConnection } from '../resources';
import type { PaginatedResourceResponse } from '../resources/Deserializer';
import { AbstractAPI } from './AbstractApi';
type EnterpriseConnectionListParams = ClerkPaginationRequest<{
    organizationId?: string;
    active?: boolean;
}>;
export interface EnterpriseConnectionOidcParams {
    authUrl?: string;
    clientId?: string;
    clientSecret?: string;
    discoveryUrl?: string;
    requiresPkce?: boolean;
    tokenUrl?: string;
    userInfoUrl?: string;
}
export interface EnterpriseConnectionSamlAttributeMappingParams {
    userId?: string | null;
    emailAddress?: string | null;
    firstName?: string | null;
    lastName?: string | null;
}
export interface EnterpriseConnectionSamlParams {
    allowIdpInitiated?: boolean;
    allowSubdomains?: boolean;
    attributeMapping?: EnterpriseConnectionSamlAttributeMappingParams;
    forceAuthn?: boolean;
    idpCertificate?: string;
    idpEntityId?: string;
    idpMetadata?: string;
    idpMetadataUrl?: string;
    idpSsoUrl?: string;
}
type CreateEnterpriseConnectionParams = {
    name?: string;
    domains?: string[];
    organizationId?: string;
    active?: boolean;
    syncUserAttributes?: boolean;
    oidc?: EnterpriseConnectionOidcParams;
    saml?: EnterpriseConnectionSamlParams;
};
type UpdateEnterpriseConnectionParams = {
    name?: string;
    domains?: string[];
    organizationId?: string;
    active?: boolean;
    syncUserAttributes?: boolean;
    provider?: string;
    oidc?: EnterpriseConnectionOidcParams;
    saml?: EnterpriseConnectionSamlParams;
};
export declare class EnterpriseConnectionAPI extends AbstractAPI {
    createEnterpriseConnection(params: CreateEnterpriseConnectionParams): Promise<EnterpriseConnection>;
    updateEnterpriseConnection(enterpriseConnectionId: string, params: UpdateEnterpriseConnectionParams): Promise<EnterpriseConnection>;
    getEnterpriseConnectionList(params?: EnterpriseConnectionListParams): Promise<PaginatedResourceResponse<EnterpriseConnection[]>>;
    getEnterpriseConnection(enterpriseConnectionId: string): Promise<EnterpriseConnection>;
    deleteEnterpriseConnection(enterpriseConnectionId: string): Promise<EnterpriseConnection>;
}
export {};
//# sourceMappingURL=EnterpriseConnectionApi.d.ts.map