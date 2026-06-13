
//#region src/isomorphicBtoa.ts
const isomorphicBtoa = (data) => {
	if (typeof btoa !== "undefined" && typeof btoa === "function") return btoa(data);
	else if (typeof globalThis.Buffer !== "undefined") return globalThis.Buffer.from(data).toString("base64");
	return data;
};

//#endregion
Object.defineProperty(exports, 'isomorphicBtoa', {
  enumerable: true,
  get: function () {
    return isomorphicBtoa;
  }
});
//# sourceMappingURL=isomorphicBtoa-_pSA92Q9.js.map