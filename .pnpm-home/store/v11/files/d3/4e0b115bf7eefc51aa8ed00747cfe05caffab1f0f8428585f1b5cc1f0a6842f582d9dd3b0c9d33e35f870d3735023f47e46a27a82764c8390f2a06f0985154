//#region src/internal/clerk-js/passwords/complexity.ts
const createTestComplexityCases = (config) => {
	let specialCharsRegex;
	if (config.allowed_special_characters) {
		let escaped = config.allowed_special_characters.replace("[", "\\[");
		escaped = escaped.replace("]", "\\]");
		specialCharsRegex = /* @__PURE__ */ new RegExp(`[${escaped}]`);
	} else specialCharsRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/;
	return (password, { minLength, maxLength }) => {
		return {
			max_length: password.length < maxLength,
			min_length: password.length >= minLength,
			require_numbers: /\d/.test(password),
			require_lowercase: /[a-z]/.test(password),
			require_uppercase: /[A-Z]/.test(password),
			require_special_char: specialCharsRegex.test(password)
		};
	};
};
const validate = (password, config) => {
	const { max_length, min_length, require_special_char, require_lowercase, require_numbers, require_uppercase } = config;
	const testCases = createTestComplexityCases(config)(password, {
		maxLength: config.max_length,
		minLength: config.min_length
	});
	const keys = {
		max_length,
		min_length,
		require_special_char,
		require_lowercase,
		require_numbers,
		require_uppercase
	};
	const _validationsFailedMap = /* @__PURE__ */ new Map();
	for (const k in keys) {
		const key = k;
		if (!keys[key]) continue;
		if (!testCases[key]) _validationsFailedMap.set(key, true);
	}
	return Object.freeze(Object.fromEntries(_validationsFailedMap));
};
const createValidateComplexity = (config) => {
	return (password) => validate(password, config);
};

//#endregion
export { validate as n, createValidateComplexity as t };
//# sourceMappingURL=complexity-DydNJOmy.mjs.map