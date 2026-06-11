import { upgradeFromThreeOneToThreeTwo } from './3.1-to-3.2/index.js';
import { upgradeFromTwoToThree } from './2.0-to-3.0/index.js';
import { upgradeFromThreeToThreeOne } from './3.0-to-3.1/index.js';
export function upgrade(value, targetVersion) {
    // Swagger 2.0 -> OpenAPI 3.0
    const openapi30 = upgradeFromTwoToThree(value);
    if (targetVersion === '3.0') {
        return openapi30;
    }
    // OpenAPI 3.0 -> OpenAPI 3.1
    const openapi31 = upgradeFromThreeToThreeOne(openapi30);
    if (targetVersion === '3.1') {
        return openapi31;
    }
    // OpenAPI 3.1 -> OpenAPI 3.2
    const openapi32 = upgradeFromThreeOneToThreeTwo(openapi31);
    if (targetVersion === '3.2') {
        return openapi32;
    }
    return openapi32;
}
