
//#region src/internal/clerk-js/passwords/loadZxcvbn.ts
const createLoadZxcvbn = (moduleManager) => {
	const loadZxcvbn = () => {
		return Promise.all([moduleManager.import("@zxcvbn-ts/core"), moduleManager.import("@zxcvbn-ts/language-common")]).then(([coreModule, languageCommonModule]) => {
			if (!coreModule || !languageCommonModule) throw new Error("Failed to load zxcvbn modules");
			const { zxcvbnOptions, zxcvbn } = coreModule;
			const { dictionary, adjacencyGraphs } = languageCommonModule;
			zxcvbnOptions.setOptions({
				dictionary: { ...dictionary },
				graphs: adjacencyGraphs
			});
			return zxcvbn;
		});
	};
	return { loadZxcvbn };
};

//#endregion
exports.createLoadZxcvbn = createLoadZxcvbn;
//# sourceMappingURL=loadZxcvbn.js.map