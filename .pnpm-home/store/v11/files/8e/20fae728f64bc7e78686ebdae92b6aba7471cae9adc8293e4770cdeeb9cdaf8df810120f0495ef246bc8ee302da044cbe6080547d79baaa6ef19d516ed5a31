//#region src/internal/clerk-js/passwords/strength.ts
const createValidatePasswordStrength = ({ min_zxcvbn_strength, onResult }) => {
	return (zxcvbn) => (password) => {
		const result = zxcvbn(password);
		onResult?.(result);
		if (result.score >= min_zxcvbn_strength && result.score < 3) return {
			state: "pass",
			keys: ["unstable__errors.zxcvbn.couldBeStronger"],
			result
		};
		if (result.score >= min_zxcvbn_strength) return {
			state: "excellent",
			result
		};
		return {
			state: "fail",
			keys: ["unstable__errors.zxcvbn.notEnough", ...result.feedback.suggestions.map((er) => `unstable__errors.zxcvbn.suggestions.${er}`)],
			result
		};
	};
};

//#endregion
export { createValidatePasswordStrength as t };
//# sourceMappingURL=strength-DPtAse7d.mjs.map