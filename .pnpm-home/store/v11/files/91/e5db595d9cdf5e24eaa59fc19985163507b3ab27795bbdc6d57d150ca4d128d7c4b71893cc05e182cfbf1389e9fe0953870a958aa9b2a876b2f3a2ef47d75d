/**
 * Formats milliseconds to seconds and appends an "s" if more than one second
 * else returns ms appended to the number
 */
export const formatMilliseconds = (ms, decimals = 2) => {
    if (ms > 1000) {
        return (ms / 1000).toFixed(decimals) + 's';
    }
    return ms.toFixed(decimals) + 'ms';
};
