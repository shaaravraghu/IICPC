import { a as LOCAL_API_URL, c as PROD_API_URL, d as STAGING_ENV_SUFFIXES, i as LEGACY_DEV_INSTANCE_SUFFIXES, o as LOCAL_ENV_SUFFIXES, u as STAGING_API_URL } from "./constants-Bta24VLk.mjs";
import "./isomorphicAtob-CoF80qYz.mjs";
import "./isomorphicBtoa-DWmLcIHi.mjs";
import { u as parsePublishableKey } from "./keys-ChIG_Ewf.mjs";

//#region src/apiUrlFromPublishableKey.ts
/**
* Get the correct API url based on the publishable key.
*
* @param publishableKey - The publishable key to parse.
* @returns One of Clerk's API URLs.
*/
const apiUrlFromPublishableKey = (publishableKey) => {
	const frontendApi = parsePublishableKey(publishableKey)?.frontendApi;
	if (frontendApi?.startsWith("clerk.") && LEGACY_DEV_INSTANCE_SUFFIXES.some((suffix) => frontendApi?.endsWith(suffix))) return PROD_API_URL;
	if (LOCAL_ENV_SUFFIXES.some((suffix) => frontendApi?.endsWith(suffix))) return LOCAL_API_URL;
	if (STAGING_ENV_SUFFIXES.some((suffix) => frontendApi?.endsWith(suffix))) return STAGING_API_URL;
	return PROD_API_URL;
};

//#endregion
export { apiUrlFromPublishableKey };
//# sourceMappingURL=apiUrlFromPublishableKey.mjs.map