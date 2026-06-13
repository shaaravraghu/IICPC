import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { ERRORS } from '../../configuration/index.js';
import { isJson } from '../../utils/is-json.js';
import { isYaml } from '../../utils/is-yaml.js';
export const readFiles = () => {
    return {
        check(value) {
            // Not a string
            if (typeof value !== 'string') {
                return false;
            }
            // URL
            if (value.startsWith('http://') || value.startsWith('https://')) {
                return false;
            }
            // Line breaks
            if (value.includes('\n')) {
                return false;
            }
            // JSON
            if (isJson(value)) {
                return false;
            }
            // YAML (run through YAML.parse)
            if (isYaml(value)) {
                return false;
            }
            return true;
        },
        get(value) {
            if (!fs.existsSync(value)) {
                throw new Error(ERRORS.FILE_DOES_NOT_EXIST.replace('%s', value));
            }
            try {
                return fs.readFileSync(value, 'utf-8');
            }
            catch (error) {
                console.error('[readFiles]', error);
                return false;
            }
        },
        resolvePath(value, reference) {
            const dir = dirname(value);
            return join(dir, reference);
        },
        getDir(value) {
            return dirname(value);
        },
        getFilename(value) {
            return value.split('/').pop();
        },
    };
};
