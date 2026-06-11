import "../../constants-Bta24VLk.mjs";
import "../../isomorphicAtob-CoF80qYz.mjs";
import "../../isomorphicBtoa-DWmLcIHi.mjs";
import "../../keys-ChIG_Ewf.mjs";
import "../../netlifyCacheHandler-BAoRn8m6.mjs";
import { r as CLERK_MODAL_STATE } from "../../constants-BulbbNR9.mjs";
import { n as getClerkQueryParam } from "../../queryParams-DJX7tUZy.mjs";
import { n as encodeB64 } from "../../encoders-CAjYroSe.mjs";

//#region src/internal/clerk-js/queryStateParams.ts
const readStateParam = () => {
	const urlClerkState = getClerkQueryParam(CLERK_MODAL_STATE) ?? "";
	return urlClerkState ? JSON.parse(atob(urlClerkState)) : null;
};
const appendModalState = ({ url, startPath = "/user", currentPath = "", componentName, socialProvider = "" }) => {
	const redirectParams = {
		path: currentPath.replace(/CLERK-ROUTER\/VIRTUAL\/.*\//, "") || "",
		componentName,
		startPath,
		socialProvider
	};
	const encodedRedirectParams = encodeB64(JSON.stringify(redirectParams));
	const urlWithParams = new URL(url);
	const searchParams = urlWithParams.searchParams;
	searchParams.set(CLERK_MODAL_STATE, encodedRedirectParams);
	urlWithParams.search = searchParams.toString();
	return urlWithParams.toString();
};

//#endregion
export { appendModalState, readStateParam };
//# sourceMappingURL=queryStateParams.mjs.map