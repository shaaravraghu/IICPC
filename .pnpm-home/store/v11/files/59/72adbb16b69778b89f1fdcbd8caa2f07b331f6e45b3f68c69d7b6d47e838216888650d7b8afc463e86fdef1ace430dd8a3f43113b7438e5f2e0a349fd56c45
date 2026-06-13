import { AccountlessApplicationAPI, ActorTokenAPI, AgentTaskAPI, AllowlistIdentifierAPI, APIKeysAPI, BetaFeaturesAPI, BlocklistIdentifierAPI, ClientAPI, DomainAPI, EmailAddressAPI, EnterpriseConnectionAPI, IdPOAuthAccessTokenApi, InstanceAPI, InvitationAPI, JwksAPI, JwtTemplatesApi, M2MTokenApi, MachineApi, OAuthApplicationsApi, OrganizationAPI, PhoneNumberAPI, ProxyCheckAPI, RedirectUrlAPI, SamlConnectionAPI, SessionAPI, SignInTokenAPI, SignUpAPI, TestingTokenAPI, UserAPI, WaitlistEntryAPI, WebhookAPI } from './endpoints';
import { BillingAPI } from './endpoints/BillingApi';
import { buildRequest } from './request';
export type CreateBackendApiOptions = Parameters<typeof buildRequest>[0] & {
    jwtKey?: string;
};
export type ApiClient = ReturnType<typeof createBackendApiClient>;
export declare function createBackendApiClient(options: CreateBackendApiOptions): {
    __experimental_accountlessApplications: AccountlessApplicationAPI;
    actorTokens: ActorTokenAPI;
    /**
     * @experimental This is an experimental API for the Agent Tasks feature that is available under a private beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
     */
    agentTasks: AgentTaskAPI;
    allowlistIdentifiers: AllowlistIdentifierAPI;
    apiKeys: APIKeysAPI;
    betaFeatures: BetaFeaturesAPI;
    blocklistIdentifiers: BlocklistIdentifierAPI;
    /**
     * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
     */
    billing: BillingAPI;
    clients: ClientAPI;
    domains: DomainAPI;
    emailAddresses: EmailAddressAPI;
    enterpriseConnections: EnterpriseConnectionAPI;
    idPOAuthAccessToken: IdPOAuthAccessTokenApi;
    instance: InstanceAPI;
    invitations: InvitationAPI;
    jwks: JwksAPI;
    jwtTemplates: JwtTemplatesApi;
    machines: MachineApi;
    m2m: M2MTokenApi;
    oauthApplications: OAuthApplicationsApi;
    organizations: OrganizationAPI;
    phoneNumbers: PhoneNumberAPI;
    proxyChecks: ProxyCheckAPI;
    redirectUrls: RedirectUrlAPI;
    sessions: SessionAPI;
    signInTokens: SignInTokenAPI;
    signUps: SignUpAPI;
    testingTokens: TestingTokenAPI;
    users: UserAPI;
    waitlistEntries: WaitlistEntryAPI;
    webhooks: WebhookAPI;
    /**
     * @deprecated Use `enterpriseConnections` instead.
     */
    samlConnections: SamlConnectionAPI;
};
//# sourceMappingURL=factory.d.ts.map