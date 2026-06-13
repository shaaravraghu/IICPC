import { loadCommand } from './commands/loadCommand.js';
/**
 * Creates a fluent OpenAPI pipeline
 *
 * @deprecated We are about to drop the pipeline syntax. Use the individual utilities instead.
 */
export function openapi(globalOptions) {
    // Create a new queue
    const queue = {
        input: null,
        options: globalOptions,
        tasks: [],
    };
    return {
        load: (input, options) => loadCommand(queue, input, options),
    };
}
