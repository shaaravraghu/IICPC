
//#region src/authorization.ts
const TYPES_TO_OBJECTS = {
	strict_mfa: {
		afterMinutes: 10,
		level: "multi_factor"
	},
	strict: {
		afterMinutes: 10,
		level: "second_factor"
	},
	moderate: {
		afterMinutes: 60,
		level: "second_factor"
	},
	lax: {
		afterMinutes: 1440,
		level: "second_factor"
	}
};
const ALLOWED_LEVELS = new Set([
	"first_factor",
	"second_factor",
	"multi_factor"
]);
const ALLOWED_TYPES = new Set([
	"strict_mfa",
	"strict",
	"moderate",
	"lax"
]);
const isValidMaxAge = (maxAge) => typeof maxAge === "number" && maxAge > 0;
const isValidLevel = (level) => ALLOWED_LEVELS.has(level);
const isValidVerificationType = (type) => ALLOWED_TYPES.has(type);
const isValidFactorAge = (x) => typeof x === "number" && Number.isFinite(x) && (x === -1 || x >= 0);
const prefixWithOrg = (value) => value.replace(/^(org:)*/, "org:");
/**
* Checks if a user has the required organization-level authorization.
* If both role and permission are provided, both must match (AND).
*/
const checkOrgAuthorization = (params, options) => {
	const { orgId, orgRole, orgPermissions } = options;
	const roleAsked = params.role !== void 0;
	const permissionAsked = params.permission !== void 0;
	if (!roleAsked && !permissionAsked) return "skip";
	if (roleAsked && typeof params.role !== "string") return "fail";
	if (permissionAsked && typeof params.permission !== "string") return "fail";
	if (!orgId) return "fail";
	if (roleAsked) {
		if (typeof orgRole !== "string" || !orgRole) return "fail";
		if (prefixWithOrg(orgRole) !== prefixWithOrg(params.role)) return "fail";
	}
	if (permissionAsked) {
		if (!Array.isArray(orgPermissions)) return "fail";
		if (!orgPermissions.includes(prefixWithOrg(params.permission))) return "fail";
	}
	return "pass";
};
const checkForFeatureOrPlan = (claim, featureOrPlan) => {
	const { org: orgFeatures, user: userFeatures } = splitByScope(claim);
	const [scope, _id] = featureOrPlan.split(":");
	const id = _id || scope;
	if (scope === "org") return orgFeatures.includes(id);
	else if (scope === "user") return userFeatures.includes(id);
	else return [...orgFeatures, ...userFeatures].includes(id);
};
/**
* Checks if a user is entitled to the requested feature or plan.
* If both feature and plan are provided, both must match (AND).
*/
const checkBillingAuthorization = (params, options) => {
	const { features, plans } = options;
	const featureAsked = params.feature !== void 0;
	const planAsked = params.plan !== void 0;
	if (!featureAsked && !planAsked) return "skip";
	if (featureAsked && typeof params.feature !== "string") return "fail";
	if (planAsked && typeof params.plan !== "string") return "fail";
	if (featureAsked) {
		if (typeof features !== "string" || !features) return "fail";
		try {
			if (!checkForFeatureOrPlan(features, params.feature)) return "fail";
		} catch {
			return "fail";
		}
	}
	if (planAsked) {
		if (typeof plans !== "string" || !plans) return "fail";
		try {
			if (!checkForFeatureOrPlan(plans, params.plan)) return "fail";
		} catch {
			return "fail";
		}
	}
	return "pass";
};
const splitByScope = (fea) => {
	const features = fea ? fea.split(",").map((f) => f.trim()) : [];
	return {
		org: features.filter((f) => f.split(":")[0].includes("o")).map((f) => f.split(":")[1]),
		user: features.filter((f) => f.split(":")[0].includes("u")).map((f) => f.split(":")[1])
	};
};
const validateReverificationConfig = (config) => {
	if (!config) return false;
	const convertConfigToObject = (config$1) => {
		if (typeof config$1 === "string") return TYPES_TO_OBJECTS[config$1];
		return config$1;
	};
	const isValidStringValue = typeof config === "string" && isValidVerificationType(config);
	const isValidObjectValue = typeof config === "object" && isValidLevel(config.level) && isValidMaxAge(config.afterMinutes);
	if (isValidStringValue || isValidObjectValue) return convertConfigToObject.bind(null, config);
	return false;
};
/**
* Evaluates if the user meets re-verification authentication requirements.
* Handles different verification levels (first factor, second factor, multi-factor).
*/
const checkReverificationAuthorization = (params, { factorVerificationAge }) => {
	if (params.reverification === void 0) return "skip";
	if (!factorVerificationAge) return "fail";
	if (!Array.isArray(factorVerificationAge) || factorVerificationAge.length !== 2 || !isValidFactorAge(factorVerificationAge[0]) || !isValidFactorAge(factorVerificationAge[1])) return "fail";
	const getConfig = validateReverificationConfig(params.reverification);
	if (!getConfig) return "fail";
	const { level, afterMinutes } = getConfig();
	const [factor1Age, factor2Age] = factorVerificationAge;
	if (factor1Age === -1 && factor2Age === -1) return "fail";
	const factor1FreshEnough = factor1Age !== -1 && afterMinutes > factor1Age;
	const factor2FreshEnough = factor2Age !== -1 && afterMinutes > factor2Age;
	switch (level) {
		case "first_factor": return factor1FreshEnough ? "pass" : "fail";
		case "second_factor":
			if (factor2Age === -1) return factor1FreshEnough ? "pass" : "fail";
			if (factor1Age === -1) return factor2FreshEnough ? "pass" : "fail";
			return factor2FreshEnough ? "pass" : "fail";
		case "multi_factor":
			if (factor2Age === -1) return factor1FreshEnough ? "pass" : "fail";
			if (factor1Age === -1) return "fail";
			return factor1FreshEnough && factor2FreshEnough ? "pass" : "fail";
	}
};
const combine = (results) => results.some((r) => r === "pass") && results.every((r) => r === "pass" || r === "skip");
/**
* Creates a function for comprehensive user authorization checks.
* Combines organization, billing, and reverification checks. The returned function
* authorizes only when every requested dimension passes; any requested dimension
* that cannot be satisfied (including missing or malformed session data) denies
* the request. Fails if `userId` is missing.
*/
const createCheckAuthorization = (options) => {
	return (params) => {
		if (!options.userId) return false;
		return combine([
			checkOrgAuthorization(params, options),
			checkBillingAuthorization(params, options),
			checkReverificationAuthorization(params, options)
		]);
	};
};
/**
* Shared utility function that centralizes auth state resolution logic,
* preventing duplication across different packages.
* @internal
*/
const resolveAuthState = ({ authObject: { sessionId, sessionStatus, userId, actor, orgId, orgRole, orgSlug, signOut, getToken, has, sessionClaims }, options: { treatPendingAsSignedOut = true } }) => {
	if (sessionId === void 0 && userId === void 0) return {
		isLoaded: false,
		isSignedIn: void 0,
		sessionId,
		sessionClaims: void 0,
		userId,
		actor: void 0,
		orgId: void 0,
		orgRole: void 0,
		orgSlug: void 0,
		has: void 0,
		signOut,
		getToken
	};
	if (sessionId === null && userId === null) return {
		isLoaded: true,
		isSignedIn: false,
		sessionId,
		userId,
		sessionClaims: null,
		actor: null,
		orgId: null,
		orgRole: null,
		orgSlug: null,
		has: () => false,
		signOut,
		getToken
	};
	if (treatPendingAsSignedOut && sessionStatus === "pending") return {
		isLoaded: true,
		isSignedIn: false,
		sessionId: null,
		userId: null,
		sessionClaims: null,
		actor: null,
		orgId: null,
		orgRole: null,
		orgSlug: null,
		has: () => false,
		signOut,
		getToken
	};
	if (!!sessionId && !!sessionClaims && !!userId && !!orgId && !!orgRole) return {
		isLoaded: true,
		isSignedIn: true,
		sessionId,
		sessionClaims,
		userId,
		actor: actor || null,
		orgId,
		orgRole,
		orgSlug: orgSlug || null,
		has,
		signOut,
		getToken
	};
	if (!!sessionId && !!sessionClaims && !!userId && !orgId) return {
		isLoaded: true,
		isSignedIn: true,
		sessionId,
		sessionClaims,
		userId,
		actor: actor || null,
		orgId: null,
		orgRole: null,
		orgSlug: null,
		has,
		signOut,
		getToken
	};
};

//#endregion
Object.defineProperty(exports, 'createCheckAuthorization', {
  enumerable: true,
  get: function () {
    return createCheckAuthorization;
  }
});
Object.defineProperty(exports, 'resolveAuthState', {
  enumerable: true,
  get: function () {
    return resolveAuthState;
  }
});
Object.defineProperty(exports, 'splitByScope', {
  enumerable: true,
  get: function () {
    return splitByScope;
  }
});
Object.defineProperty(exports, 'validateReverificationConfig', {
  enumerable: true,
  get: function () {
    return validateReverificationConfig;
  }
});
//# sourceMappingURL=authorization-lbuZP-Q_.js.map