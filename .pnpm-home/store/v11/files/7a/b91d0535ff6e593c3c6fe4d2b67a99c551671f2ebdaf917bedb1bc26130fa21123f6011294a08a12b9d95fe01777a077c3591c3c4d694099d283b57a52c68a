import "../../constants-Bta24VLk.mjs";
import "../../isomorphicAtob-CoF80qYz.mjs";
import "../../isomorphicBtoa-DWmLcIHi.mjs";
import "../../keys-ChIG_Ewf.mjs";
import "../../netlifyCacheHandler-BAoRn8m6.mjs";
import "../../constants-BulbbNR9.mjs";
import { t as forwardClerkQueryParams } from "../../queryParams-DJX7tUZy.mjs";

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
		const params = forwardClerkQueryParams();
		if (signUp.unverifiedFields?.includes("email_address") && verifyEmailPath) return navigate(verifyEmailPath, { searchParams: params });
		if (signUp.unverifiedFields?.includes("phone_number") && verifyPhonePath) return navigate(verifyPhonePath, { searchParams: params });
		if (continuePath) return navigate(continuePath, { searchParams: params });
	}
};

//#endregion
export { completeSignUpFlow };
//# sourceMappingURL=completeSignUpFlow.mjs.map