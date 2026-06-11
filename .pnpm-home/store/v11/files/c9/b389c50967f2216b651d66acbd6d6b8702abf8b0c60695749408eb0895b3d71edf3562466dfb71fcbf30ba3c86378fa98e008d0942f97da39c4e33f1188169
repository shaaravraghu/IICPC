import { REGEX } from '../regex/regex-helpers.js';
/**
 * This function takes a string and replaces both {single} and {{double}} curly brace variables with given values.
 * Use the replacePathVariables and replaceEnvVariables functions if you only need to replace one type of variable.
 */
export function replaceVariables(value, variablesOrCallback) {
    // Replace all variables (example: {{ baseurl }} with an HTML tag)
    const doubleCurlyBrackets = /{{\s*([\w.-]+)\s*}}/g;
    const singleCurlyBrackets = /{\s*([\w.-]+)\s*}/g;
    const callback = (_, match) => {
        if (typeof variablesOrCallback === 'function') {
            return variablesOrCallback(match);
        }
        return variablesOrCallback[match]?.toString() || `{${match}}`;
    };
    // Loop through all matches and replace the match with the variable value
    return value.replace(doubleCurlyBrackets, callback).replace(singleCurlyBrackets, callback);
}
/** Replace {path} variables with their values */
export const replacePathVariables = (path, variables = {}) => path.replace(REGEX.PATH, (match, key) => variables[key] ?? match);
/** Replace {{env}} variables with their values */
export const replaceEnvVariables = (path, variables = {}) => path.replace(REGEX.VARIABLES, (match, key) => typeof variables === 'function' ? (variables(key) ?? match) : (variables[key] ?? match));
