require('../../constants-WYhx_umW.js');
require('../../isomorphicAtob-Hkpnx2p8.js');
require('../../isomorphicBtoa-_pSA92Q9.js');
require('../../keys-nhSphkCl.js');
require('../../netlifyCacheHandler-tf-8MGH1.js');
require('../../constants-BUzkV8jh.js');
const require_queryParams = require('../../queryParams-BIKo3ou8.js');

//#region src/internal/clerk-js/completeSignUpFlow.ts
const completeSignUpFlow = ({ signUp, verifyEmailPath, verifyPhonePath, continuePath, navigate, handleComplete, redirectUrl = "", redirectUrlComplete = "", oidcPrompt }) => {
	if (signUp.status === "complete") return handleComplete && handleComplete();
	else if (signUp.status === "missing_requirements") {
		if (signUp.missingFields.some((mf) => mf === "enterprise_sso")) return signUp.authenticateWithRedirect({
			strategy: "enterprise_sso",
			redirectUrl,
			redirectUrlComplete,
			continueSignUp: true,
			oidcPrompt
		});
		const params = require_queryParams.forwardClerkQueryParams();
		if (signUp.unverifiedFields?.includes("email_address") && verifyEmailPath) return navigate(verifyEmailPath, { searchParams: params });
		if (signUp.unverifiedFields?.includes("phone_number") && verifyPhonePath) return navigate(verifyPhonePath, { searchParams: params });
		if (continuePath) return navigate(continuePath, { searchParams: params });
	}
};

//#endregion
exports.completeSignUpFlow = completeSignUpFlow;
//# sourceMappingURL=completeSignUpFlow.js.map