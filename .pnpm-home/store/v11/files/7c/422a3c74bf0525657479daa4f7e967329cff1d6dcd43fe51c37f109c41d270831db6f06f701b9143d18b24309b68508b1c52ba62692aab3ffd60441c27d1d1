//#region src/authorization-errors.ts
const REVERIFICATION_REASON = "reverification-error";
const reverificationError = (missingConfig) => ({ clerk_error: {
	type: "forbidden",
	reason: REVERIFICATION_REASON,
	metadata: { reverification: missingConfig }
} });
const reverificationErrorResponse = (...args) => new Response(JSON.stringify(reverificationError(...args)), { status: 403 });
const isReverificationHint = (result) => {
	return result && typeof result === "object" && "clerk_error" in result && result.clerk_error?.type === "forbidden" && result.clerk_error?.reason === REVERIFICATION_REASON;
};

//#endregion
export { reverificationError as n, reverificationErrorResponse as r, isReverificationHint as t };
//# sourceMappingURL=authorization-errors-CBHAr6Ld.mjs.map