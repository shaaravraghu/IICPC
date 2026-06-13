import type { AgentTaskJSON } from './JSON';
/**
 * Represents a agent token resource.
 *
 * Agent tokens are used for testing purposes and allow creating sessions
 * for users without requiring full authentication flows.
 */
export declare class AgentTask {
    /**
     * A stable identifier for the agent, unique per agent_name within an instance.
     */
    readonly agentId: string;
    /**
     * A unique identifier for this agent task.
     * @deprecated Use agentTaskId instead.
     */
    readonly taskId: string;
    /**
     * A unique identifier for this agent task.
     */
    readonly agentTaskId: string;
    /**
     * The FAPI URL that, when visited, creates a session for the user.
     */
    readonly url: string;
    constructor(
    /**
     * A stable identifier for the agent, unique per agent_name within an instance.
     */
    agentId: string, 
    /**
     * A unique identifier for this agent task.
     * @deprecated Use agentTaskId instead.
     */
    taskId: string, 
    /**
     * A unique identifier for this agent task.
     */
    agentTaskId: string, 
    /**
     * The FAPI URL that, when visited, creates a session for the user.
     */
    url: string);
    /**
     * Creates a AgentTask instance from a JSON object.
     *
     * @param data - The JSON object containing agent task data
     * @returns A new AgentTask instance
     */
    static fromJSON(data: AgentTaskJSON): AgentTask;
}
//# sourceMappingURL=AgentTask.d.ts.map