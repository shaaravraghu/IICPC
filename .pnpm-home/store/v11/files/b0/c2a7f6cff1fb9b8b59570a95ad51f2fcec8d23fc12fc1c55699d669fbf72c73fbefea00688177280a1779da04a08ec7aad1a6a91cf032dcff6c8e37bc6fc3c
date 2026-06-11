require('../../constants-WYhx_umW.js');
require('../../isomorphicAtob-Hkpnx2p8.js');
require('../../isomorphicBtoa-_pSA92Q9.js');
require('../../keys-nhSphkCl.js');
require('../../netlifyCacheHandler-tf-8MGH1.js');
const require_constants$1 = require('../../constants-BUzkV8jh.js');
const require_queryParams = require('../../queryParams-BIKo3ou8.js');
const require_encoders = require('../../encoders-C_EA3--l.js');

//#region src/internal/clerk-js/queryStateParams.ts
const readStateParam = () => {
	const urlClerkState = require_queryParams.getClerkQueryParam(require_constants$1.CLERK_MODAL_STATE) ?? "";
	return urlClerkState ? JSON.parse(atob(urlClerkState)) : null;
};
const appendModalState = ({ url, startPath = "/user", currentPath = "", componentName, socialProvider = "" }) => {
	const redirectParams = {
		path: currentPath.replace(/CLERK-ROUTER\/VIRTUAL\/.*\//, "") || "",
		componentName,
		startPath,
		socialProvider
	};
	const encodedRedirectParams = require_encoders.encodeB64(JSON.stringify(redirectParams));
	const urlWithParams = new URL(url);
	const searchParams = urlWithParams.searchParams;
	searchParams.set(require_constants$1.CLERK_MODAL_STATE, encodedRedirectParams);
	urlWithParams.search = searchParams.toString();
	return urlWithParams.toString();
};

//#endregion
exports.appendModalState = appendModalState;
exports.readStateParam = readStateParam;
//# sourceMappingURL=queryStateParams.js.map