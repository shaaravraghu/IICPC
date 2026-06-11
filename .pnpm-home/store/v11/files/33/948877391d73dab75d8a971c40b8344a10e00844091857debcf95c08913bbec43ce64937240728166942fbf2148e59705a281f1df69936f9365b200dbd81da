import { a as defineConfig, i as startWatcher, n as loadConfigFile, o as defineTransformer, r as generateSpec, s as normalizeOptions, t as findConfigFile } from "./config-DHMhmS0P.mjs";
import { getWarningCount, isString, logError, resetWarnings, setVerbose } from "@orval/core";
export * from "@orval/core";
//#region src/generate.ts
async function generate(optionsExport, workspace = process.cwd(), options) {
	setVerbose(!!options?.verbose);
	resetWarnings();
	if (!optionsExport || isString(optionsExport)) {
		const configFile = await loadConfigFile(findConfigFile(optionsExport));
		const configs = Object.entries(configFile);
		let hasErrors = false;
		for (const [projectName, config] of configs) {
			const normalizedOptions = await normalizeOptions(config, workspace, options);
			try {
				await generateSpec(workspace, normalizedOptions, projectName);
			} catch (error) {
				hasErrors = true;
				logError(error, projectName);
			}
			if (options?.watch !== void 0) {
				const fileToWatch = isString(normalizedOptions.input.target) ? normalizedOptions.input.target : void 0;
				await startWatcher(options.watch, async () => {
					resetWarnings();
					try {
						await generateSpec(workspace, normalizedOptions, projectName);
					} catch (error) {
						logError(error, projectName);
					}
					if (options.failOnWarnings && getWarningCount() > 0) throw new Error(`Process failed with ${getWarningCount()} warning(s) due to failOnWarnings option`);
				}, fileToWatch);
			}
		}
		if (hasErrors) logError("One or more project failed, see above for details");
		if (options?.failOnWarnings && getWarningCount() > 0) throw new Error(`Process failed with ${getWarningCount()} warning(s) due to failOnWarnings option`);
		return;
	}
	const normalizedOptions = await normalizeOptions(optionsExport, workspace, options);
	try {
		await generateSpec(workspace, normalizedOptions);
	} catch (error) {
		logError(error);
	}
	if (options?.watch) await startWatcher(options.watch, async () => {
		resetWarnings();
		try {
			await generateSpec(workspace, normalizedOptions);
		} catch (error) {
			logError(error);
		}
		if (options.failOnWarnings && getWarningCount() > 0) throw new Error(`Process failed with ${getWarningCount()} warning(s) due to failOnWarnings option`);
	}, normalizedOptions.input.target);
	if (options?.failOnWarnings && getWarningCount() > 0) throw new Error(`Process failed with ${getWarningCount()} warning(s) due to failOnWarnings option`);
}
//#endregion
export { generate as default, generate, defineConfig, defineTransformer };

//# sourceMappingURL=index.mjs.map