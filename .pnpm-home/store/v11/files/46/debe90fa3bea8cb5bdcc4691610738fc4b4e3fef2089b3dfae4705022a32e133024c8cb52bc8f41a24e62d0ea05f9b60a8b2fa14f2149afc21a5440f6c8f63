require('../../../runtimeEnvironment-DJJWo5AR.js');
require('../../../handleValueOrFn-BmJC8Cue.js');
require('../../../instance-C1LlVxIp.js');
const require_noop = require('../../../noop-CVg8oVJr.js');
require('../../../createDeferredPromise-Bq0Rf2GM.js');
require('../../../utils-Y3tB5LFT.js');
const require_complexity = require('../../../complexity-DEun2UD2.js');
const require_strength = require('../../../strength-DMrZQDoO.js');

//#region src/internal/clerk-js/passwords/password.ts
const createValidatePassword = (loadZxcvbn, config, callbacks) => {
	const { onValidation = require_noop.noop, onValidationComplexity = require_noop.noop } = callbacks || {};
	const { show_zxcvbn, validatePassword: validatePasswordProp } = config;
	const getComplexity = require_complexity.createValidateComplexity(config);
	const getScore = require_strength.createValidatePasswordStrength(config);
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
exports.createValidatePassword = createValidatePassword;
//# sourceMappingURL=password.js.map