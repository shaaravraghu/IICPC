
//#region src/internal/clerk-js/path.ts
const SEPARATOR = "/";
const MULTIPLE_SEPARATOR_REGEX = new RegExp(SEPARATOR + "{1,}", "g");
function joinPaths(a, b) {
	return [a, b].filter((p) => p).join(SEPARATOR).replace(MULTIPLE_SEPARATOR_REGEX, SEPARATOR);
}

//#endregion
Object.defineProperty(exports, 'joinPaths', {
  enumerable: true,
  get: function () {
    return joinPaths;
  }
});
//# sourceMappingURL=path-ci3QmWY8.js.map