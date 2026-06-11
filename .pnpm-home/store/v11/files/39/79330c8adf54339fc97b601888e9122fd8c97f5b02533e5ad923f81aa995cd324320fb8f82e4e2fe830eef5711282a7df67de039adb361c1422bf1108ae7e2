import YAML from 'yaml';
import { isYaml } from '../../../helpers/is-yaml.js';
/**
 * Creates a plugin that parses YAML strings into JavaScript objects.
 * @returns A plugin object with validate and exec functions
 * @example
 * ```ts
 * const yamlPlugin = parseYaml()
 * const result = yamlPlugin.exec('name: John\nage: 30')
 * // result = { name: 'John', age: 30 }
 * ```
 */
export function parseYaml() {
    return {
        type: 'loader',
        validate: isYaml,
        exec: (value) => {
            try {
                return Promise.resolve({
                    ok: true,
                    data: YAML.parse(value, { merge: true, maxAliasCount: 10000 }),
                    raw: value,
                });
            }
            catch {
                return Promise.resolve({
                    ok: false,
                });
            }
        },
    };
}
