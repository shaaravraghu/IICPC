//#region src/internal/clerk-js/querystring.ts
const getQueryParams = (queryString) => {
	const queryParamsObject = {};
	new URLSearchParams(queryString).forEach((value, key) => {
		if (key in queryParamsObject) {
			const existingValue = queryParamsObject[key];
			if (Array.isArray(existingValue)) existingValue.push(value);
			else queryParamsObject[key] = [existingValue, value];
		} else queryParamsObject[key] = value;
	});
	return queryParamsObject;
};
const stringifyQueryParams = (params, opts = {}) => {
	if (params === null || params === void 0) return "";
	if (!params || typeof params !== "object") return "";
	const queryParams = new URLSearchParams();
	Object.keys(params).forEach((key) => {
		const encodedKey = opts.keyEncoder ? opts.keyEncoder(key) : key;
		const value = params[key];
		if (Array.isArray(value)) value.forEach((v) => v !== void 0 && queryParams.append(encodedKey, v || ""));
		else if (value === void 0) return;
		else if (typeof value === "object" && value !== null) queryParams.append(encodedKey, JSON.stringify(value));
		else queryParams.append(encodedKey, String(value ?? ""));
	});
	return queryParams.toString();
};

//#endregion
export { stringifyQueryParams as n, getQueryParams as t };
//# sourceMappingURL=querystring-pXtwII0l.mjs.map