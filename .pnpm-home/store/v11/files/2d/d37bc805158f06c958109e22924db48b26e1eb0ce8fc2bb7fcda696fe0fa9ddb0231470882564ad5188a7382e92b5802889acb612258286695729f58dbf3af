import { dereference } from '../../../utils/dereference.js';
import { filter } from '../../../utils/filter.js';
import { load } from '../../../utils/load/load.js';
import { upgrade } from '../../../utils/upgrade.js';
import { validate } from '../../../utils/validate.js';
/**
 * Takes a queue of tasks and works through them
 */
export async function workThroughQueue(queue) {
    const { input } = {
        ...queue,
    };
    let result = {};
    // Work through the whole queue
    for (const task of queue.tasks) {
        const name = task.name;
        const options = 'options' in task ? task.options : undefined;
        // Use the result of the previous task, or fall back to the original input
        const currentSpecification = result.specification
            ? result.specification
            : typeof input === 'object'
                ? // Detach from the original object
                    structuredClone(input)
                : input;
        // load
        if (name === 'load') {
            result = {
                ...result,
                ...(await load(input, options)),
            };
        }
        // validate
        else if (name === 'filter') {
            result = {
                ...result,
                ...filter(currentSpecification, options),
            };
        }
        // dereference
        else if (name === 'dereference') {
            result = {
                ...result,
                ...dereference(currentSpecification, options),
            };
        }
        // upgrade
        else if (name === 'upgrade') {
            result = {
                ...result,
                ...upgrade(currentSpecification),
            };
        }
        // validate
        else if (name === 'validate') {
            result = {
                ...result,
                ...(await validate(currentSpecification, options)),
            };
        }
        // Make TS complain when we forgot to handle a command.
        else {
            name;
        }
    }
    return result;
}
