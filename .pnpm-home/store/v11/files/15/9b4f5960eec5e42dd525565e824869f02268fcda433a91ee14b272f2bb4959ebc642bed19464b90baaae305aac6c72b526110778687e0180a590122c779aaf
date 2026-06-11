import type { AgentTask } from '../resources/AgentTask';
import { AbstractAPI } from './AbstractApi';
type CreateAgentTaskParams = {
    /**
     * The user to create an agent task for.
     */
    onBehalfOf: {
        /**
         * The identifier of the user to create an agent task for.
         */
        identifier: string;
        userId?: never;
    } | {
        /**
         * The ID of the user to create an agent task for.
         */
        userId: string;
        identifier?: never;
    };
    /**
     * The permissions the agent task will have.
     */
    permissions: string;
    /**
     * The name of the agent to create an agent task for.
     */
    agentName: string;
    /**
     * The description of the agent task to create.
     */
    taskDescription: string;
    /**
     * The URL to redirect to after the agent task is consumed.
     */
    redirectUrl: string;
    /**
     * The maximum duration that the session which will be created by the generated agent task should last.
     * By default, the duration is 30 minutes.
     */
    sessionMaxDurationInSeconds?: number;
};
export declare class AgentTaskAPI extends AbstractAPI {
    create(params: CreateAgentTaskParams): Promise<AgentTask>;
    revoke(agentTaskId: string): Promise<Omit<AgentTask, "url">>;
}
export {};
//# sourceMappingURL=AgentTaskApi.d.ts.map