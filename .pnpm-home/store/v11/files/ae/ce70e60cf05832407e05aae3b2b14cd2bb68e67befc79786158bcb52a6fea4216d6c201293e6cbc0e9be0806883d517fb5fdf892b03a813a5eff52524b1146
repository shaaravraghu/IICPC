import type { FullConfig } from '@playwright/test';
export type WebServer = NonNullable<FullConfig['webServer']>;
/** Default playwright version */
export declare const DEFAULT_PLAYWRIGHT_VERSION = "1.59.1";
/** Options for getting a docker server */
type GetDockerServerOptions = {
    version: string;
    port: number;
} & Partial<WebServer>;
/**
 * Builds a Playwright {@link https://playwright.dev/docs/test-webserver | webServer} config
 * that starts the browser-side `playwright run-server` inside
 * {@link https://hub.docker.com/r/scalarapi/playwright-runner | `scalarapi/playwright-runner`}.
 *
 * **Important:** The `version` must stay aligned with the workspace `@playwright/test` major/minor
 * so the client and container speak the same protocol.
 */
export declare const getDockerServer: (opts?: Partial<GetDockerServerOptions>) => WebServer;
export {};
//# sourceMappingURL=docker.d.ts.map