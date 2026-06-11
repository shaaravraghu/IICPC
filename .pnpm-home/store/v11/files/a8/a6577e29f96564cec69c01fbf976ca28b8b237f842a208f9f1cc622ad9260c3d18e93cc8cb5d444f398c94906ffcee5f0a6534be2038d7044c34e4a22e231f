import "../../../runtimeEnvironment-D1yr0yUs.mjs";
import "../../../handleValueOrFn-iAIjw-kJ.mjs";
import "../../../instance-BmZr0cdE.mjs";
import { t as noop } from "../../../noop-B7RzLU-c.mjs";
import "../../../createDeferredPromise-CYCAgyvC.mjs";
import "../../../utils-TXJdVJx7.mjs";
import { t as createValidateComplexity } from "../../../complexity-DydNJOmy.mjs";
import { t as createValidatePasswordStrength } from "../../../strength-DPtAse7d.mjs";

//#region src/internal/clerk-js/passwords/password.ts
const createValidatePassword = (loadZxcvbn, config, callbacks) => {
	const { onValidation = noop, onValidationComplexity = noop } = callbacks || {};
	const { show_zxcvbn, validatePassword: validatePasswordProp } = config;
	const getComplexity = createValidateComplexity(config);
	const getScore = createValidatePasswordStrength(config);
	let result = {};
	return (password, internalCallbacks) => {
		const { onValidation: internalOnValidation = onValidation, onValidationComplexity: internalOnValidationComplexity = onValidationComplexity } = internalCallbacks || {};
		if (!validatePasswordProp) return;
		/**
		* Validate Complexity
		*/
		const failedValidationsComplexity = getComplexity(password);
		internalOnValidationComplexity(Object.keys(failedValidationsComplexity).length === 0);
		result = {
			...result,
			complexity: failedValidationsComplexity
		};
		/**
		* Validate score
		*/
		if (show_zxcvbn)
 /**
		* Lazy load zxcvbn without preventing a complexityError to be thrown if it exists
		*/
		loadZxcvbn().then((zxcvbn) => {
			const strength = getScore(zxcvbn)(password);
			result = {
				...result,
				strength
			};
			internalOnValidation({
				...result,
				strength
			});
		});
		if (result.complexity && Object.keys(result.complexity).length === 0 && show_zxcvbn) return;
		internalOnValidation(result);
	};
};

//#endregion
export { createValidatePassword };
//# sourceMappingURL=password.mjs.map