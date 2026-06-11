import { Uo as SessionTask, Vo as SessionResource } from "../../index-Ch3QvM-g.mjs";
import "../../moduleManager-BsmFyRrH.mjs";
import { t as buildURL } from "../../url-CKBsbfuw.mjs";

//#region src/internal/clerk-js/sessionTasks.d.ts
/**
 * @internal
 */
declare const INTERNAL_SESSION_TASK_ROUTE_BY_KEY: Record<SessionTask['key'], string>;
/**
 * @internal
 */
declare const getTaskEndpoint: (task: SessionTask) => string;
/**
 * @internal
 */
declare function buildTaskUrl(task: SessionTask, opts: Pick<Parameters<typeof buildURL>[0], 'base'>): string;
/**
 * @internal
 */
declare function navigateIfTaskExists(session: SessionResource, {
  navigate,
  baseUrl
}: {
  navigate: (to: string) => Promise<unknown>;
  baseUrl: string;
}): Promise<unknown> | undefined;
declare function warnMissingPendingTaskHandlers(options: Record<string, unknown>): void;
//#endregion
export { INTERNAL_SESSION_TASK_ROUTE_BY_KEY, buildTaskUrl, getTaskEndpoint, navigateIfTaskExists, warnMissingPendingTaskHandlers };
//# sourceMappingURL=sessionTasks.d.mts.map