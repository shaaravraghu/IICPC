import type { TelemetryCollectorOptions } from '@clerk/shared/telemetry';
import { TelemetryCollector } from '@clerk/shared/telemetry';
import type { SDKMetadata } from '@clerk/shared/types';
import type { ApiClient, CreateBackendApiOptions } from './api';
import type { CreateAuthenticateRequestOptions } from './tokens/factory';
import { createAuthenticateRequest } from './tokens/factory';
export declare const verifyToken: (token: string, options: {
    audience?: string | string[] | undefined;
    authorizedParties?: string[] | undefined;
    clockSkewInMs?: number | undefined;
    headerType?: string | string[] | undefined;
    secretKey?: string | undefined;
    apiUrl?: string | undefined;
    apiVersion?: string | undefined;
    skipJwksCache?: boolean | undefined;
    jwksCacheTtlInMs?: number | undefined;
    jwtKey?: string | undefined;
}) => Promise<NonNullable<import("@clerk/shared/types").JwtPayload | undefined>>;
export type ClerkOptions = Omit<CreateBackendApiOptions, 'skipApiVersionInUrl' | 'useMachineSecretKey'> & Partial<Pick<CreateAuthenticateRequestOptions['options'], 'audience' | 'jwtKey' | 'proxyUrl' | 'secretKey' | 'publishableKey' | 'domain' | 'isSatellite'>> & {
    sdkMetadata?: SDKMetadata;
    telemetry?: Pick<TelemetryCollectorOptions, 'disabled' | 'debug' | 'samplingRate'>;
};
export type ClerkClient = {
    telemetry: TelemetryCollector;
} & ApiClient & ReturnType<typeof createAuthenticateRequest>;
export declare function createClerkClient(options: ClerkOptions): ClerkClient;
/**
 * General Types
 */
export type { OrganizationMembershipRole } from './api/resources';
export type { VerifyTokenOptions } from './tokens/verify';
/**
 * JSON types
 */
export type { ActorTokenJSON, AgentTaskJSON, AccountlessApplicationJSON, ClerkResourceJSON, TokenJSON, AllowlistIdentifierJSON, BlocklistIdentifierJSON, ClientJSON, CnameTargetJSON, DomainJSON, EmailJSON, EmailAddressJSON, EnterpriseConnectionJSON, EnterpriseConnectionOauthConfigJSON, EnterpriseConnectionSamlConnectionJSON, ExternalAccountJSON, IdentificationLinkJSON, InstanceJSON, InstanceRestrictionsJSON, InstanceSettingsJSON, InvitationJSON, JwtTemplateJSON, OauthAccessTokenJSON, OAuthApplicationJSON, OrganizationJSON, OrganizationDomainJSON, OrganizationDomainVerificationJSON, OrganizationInvitationJSON, OrganizationSettingsJSON, PublicOrganizationDataJSON, OrganizationMembershipJSON, OrganizationMembershipPublicUserDataJSON, RoleSetJSON, RoleSetItemJSON, RoleSetMigrationJSON, PhoneNumberJSON, ProxyCheckJSON, RedirectUrlJSON, SessionJSON, SignInJSON, SignInTokenJSON, SignUpJSON, SignUpVerificationJSON, SignUpVerificationsJSON, SMSMessageJSON, UserJSON, UserDeletedJSON, VerificationJSON, WaitlistEntryJSON, Web3WalletJSON, DeletedObjectJSON, PaginatedResponseJSON, TestingTokenJSON, WebhooksSvixJSON, BillingPlanJSON, BillingSubscriptionJSON, BillingSubscriptionItemJSON, } from './api/resources/JSON';
/**
 * Resources
 */
export type { AgentTask, APIKey, ActorToken, AccountlessApplication, AllowlistIdentifier, BlocklistIdentifier, Client, CnameTarget, Domain, EmailAddress, EnterpriseConnection, EnterpriseConnectionOauthConfig, EnterpriseConnectionSamlConnection, ExternalAccount, Feature, Instance, InstanceRestrictions, InstanceSettings, Invitation, JwtTemplate, Machine, M2MToken, OauthAccessToken, OAuthApplication, Organization, OrganizationDomain, OrganizationDomainVerification, OrganizationInvitation, OrganizationMembership, OrganizationMembershipPublicUserData, OrganizationSettings, PhoneNumber, SamlConnection, Session, SignInToken, SignUpAttempt, SMSMessage, Token, User, TestingToken, WaitlistEntry, BillingPlan, BillingSubscription, BillingSubscriptionItem, } from './api/resources';
/**
 * Webhooks event types
 */
export type { EmailWebhookEvent, OrganizationWebhookEvent, OrganizationDomainWebhookEvent, OrganizationInvitationAcceptedWebhookEvent, OrganizationInvitationWebhookEvent, OrganizationMembershipWebhookEvent, RoleWebhookEvent, PermissionWebhookEvent, SessionWebhookEvent, SMSWebhookEvent, UserWebhookEvent, WaitlistEntryWebhookEvent, WebhookEvent, WebhookEventType, BillingPaymentAttemptWebhookEvent, BillingSubscriptionWebhookEvent, BillingSubscriptionItemWebhookEvent, } from './api/resources/Webhooks';
/**
 * Auth objects
 */
export type { AuthObject, InvalidTokenAuthObject } from './tokens/authObjects';
export type { SessionAuthObject, MachineAuthObject } from './tokens/types';
//# sourceMappingURL=index.d.ts.map