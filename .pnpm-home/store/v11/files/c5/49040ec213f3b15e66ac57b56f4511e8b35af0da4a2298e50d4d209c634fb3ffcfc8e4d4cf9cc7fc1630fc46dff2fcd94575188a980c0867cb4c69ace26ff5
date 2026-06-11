
//#region src/internal/clerk-js/windowNavigate.ts
const CLERK_BEFORE_UNLOAD_EVENT = "clerk:beforeunload";
/**
* Additional protocols can be provided using the `allowedRedirectProtocols` Clerk option.
*/
const ALLOWED_PROTOCOLS = [
	"http:",
	"https:",
	"wails:",
	"chrome-extension:"
];
/**
* Helper utility to navigate via window.location.href. Also dispatches a clerk:beforeunload custom event.
*
* Note that this utility should **never** be called with a user-provided URL. We make no specific checks against the contents of the URL here and assume it is safe. Use `Clerk.navigate()` instead for user-provided URLs.
*/
function windowNavigate(to) {
	const toURL = new URL(to, window.location.href);
	window.dispatchEvent(new CustomEvent(CLERK_BEFORE_UNLOAD_EVENT));
	window.location.href = toURL.href;
}

//#endregion
exports.ALLOWED_PROTOCOLS = ALLOWED_PROTOCOLS;
exports.CLERK_BEFORE_UNLOAD_EVENT = CLERK_BEFORE_UNLOAD_EVENT;
exports.windowNavigate = windowNavigate;
//# sourceMappingURL=windowNavigate.js.map