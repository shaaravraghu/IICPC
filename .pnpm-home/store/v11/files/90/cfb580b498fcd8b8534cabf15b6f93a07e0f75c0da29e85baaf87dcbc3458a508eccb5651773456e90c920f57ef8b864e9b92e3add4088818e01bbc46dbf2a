import { workThroughQueue } from '../utils/workThroughQueue.js';
/**
 * Run the chained tasks and return just the filesystem
 */
export async function files(queue) {
    const { filesystem } = await workThroughQueue(queue);
    return filesystem;
}
