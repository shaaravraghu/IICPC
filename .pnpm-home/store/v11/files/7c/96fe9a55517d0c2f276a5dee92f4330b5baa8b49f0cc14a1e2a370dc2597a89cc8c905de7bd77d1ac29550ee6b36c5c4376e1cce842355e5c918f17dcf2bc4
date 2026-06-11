
//#region src/internal/clerk-js/runtime.ts
function inBrowser() {
	return typeof globalThis.document !== "undefined";
}
function inActiveBrowserTab() {
	return inBrowser() && globalThis.document.hasFocus();
}
function inIframe() {
	if (!inBrowser()) return false;
	try {
		return window.self !== window.top;
	} catch {
		return true;
	}
}
function inCrossOriginIframe() {
	if (!inIframe()) return false;
	try {
		window.top?.location.href;
		return false;
	} catch {
		return true;
	}
}

//#endregion
exports.inActiveBrowserTab = inActiveBrowserTab;
exports.inBrowser = inBrowser;
exports.inCrossOriginIframe = inCrossOriginIframe;
exports.inIframe = inIframe;
//# sourceMappingURL=runtime.js.map