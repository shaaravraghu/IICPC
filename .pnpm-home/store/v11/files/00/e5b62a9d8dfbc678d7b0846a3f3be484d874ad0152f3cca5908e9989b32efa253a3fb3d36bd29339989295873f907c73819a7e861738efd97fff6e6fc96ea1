
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
Object.defineProperty(exports, 'decodeB64', {
  enumerable: true,
  get: function () {
    return decodeB64;
  }
});
Object.defineProperty(exports, 'encodeB64', {
  enumerable: true,
  get: function () {
    return encodeB64;
  }
});
Object.defineProperty(exports, 'urlDecodeB64', {
  enumerable: true,
  get: function () {
    return urlDecodeB64;
  }
});
Object.defineProperty(exports, 'urlEncodeB64', {
  enumerable: true,
  get: function () {
    return urlEncodeB64;
  }
});
//# sourceMappingURL=encoders-C_EA3--l.js.map