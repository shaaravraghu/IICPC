//#region src/internal/clerk-js/encoders.ts
function encodeB64(input) {
	return globalThis.btoa(input);
}
function decodeB64(input) {
	return decodeURIComponent(globalThis.atob(input).split("").map((c) => {
		return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(""));
}
function urlEncodeB64(input) {
	const b64Chars = {
		"+": "-",
		"/": "_",
		"=": ""
	};
	return encodeB64(input).replace(/[+/=]/g, (m) => b64Chars[m]);
}
function urlDecodeB64(input) {
	return decodeB64(input.replace(/_/g, "/").replace(/-/g, "+"));
}

//#endregion
export { urlEncodeB64 as i, encodeB64 as n, urlDecodeB64 as r, decodeB64 as t };
//# sourceMappingURL=encoders-CAjYroSe.mjs.map