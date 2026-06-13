
//#region ../../node_modules/.pnpm/@wallet-standard+app@1.1.0/node_modules/@wallet-standard/app/lib/esm/wallets.js
var __classPrivateFieldGet = void 0 && (void 0).__classPrivateFieldGet || function(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = void 0 && (void 0).__classPrivateFieldSet || function(receiver, state, value, kind, f) {
	if (kind === "m") throw new TypeError("Private method is not writable");
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
	return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var _AppReadyEvent_detail;
let wallets = void 0;
const registeredWalletsSet = /* @__PURE__ */ new Set();
function addRegisteredWallet(wallet) {
	cachedWalletsArray = void 0;
	registeredWalletsSet.add(wallet);
}
function removeRegisteredWallet(wallet) {
	cachedWalletsArray = void 0;
	registeredWalletsSet.delete(wallet);
}
const listeners = {};
/**
* Get an API for {@link Wallets.get | getting}, {@link Wallets.on | listening for}, and
* {@link Wallets.register | registering} {@link "@wallet-standard/base".Wallet | Wallets}.
*
* When called for the first time --
*
* This dispatches a {@link "@wallet-standard/base".WindowAppReadyEvent} to notify each Wallet that the app is ready
* to register it.
*
* This also adds a listener for {@link "@wallet-standard/base".WindowRegisterWalletEvent} to listen for a notification
* from each Wallet that the Wallet is ready to be registered by the app.
*
* This combination of event dispatch and listener guarantees that each Wallet will be registered synchronously as soon
* as the app is ready whether the app loads before or after each Wallet.
*
* @return API for getting, listening for, and registering Wallets.
*
* @group App
*/
function getWallets() {
	if (wallets) return wallets;
	wallets = Object.freeze({
		register,
		get,
		on
	});
	if (typeof window === "undefined") return wallets;
	const api = Object.freeze({ register });
	try {
		window.addEventListener("wallet-standard:register-wallet", ({ detail: callback }) => callback(api));
	} catch (error) {
		console.error("wallet-standard:register-wallet event listener could not be added\n", error);
	}
	try {
		window.dispatchEvent(new AppReadyEvent(api));
	} catch (error) {
		console.error("wallet-standard:app-ready event could not be dispatched\n", error);
	}
	return wallets;
}
function register(...wallets$1) {
	wallets$1 = wallets$1.filter((wallet) => !registeredWalletsSet.has(wallet));
	if (!wallets$1.length) return () => {};
	wallets$1.forEach((wallet) => addRegisteredWallet(wallet));
	listeners["register"]?.forEach((listener) => guard(() => listener(...wallets$1)));
	return function unregister() {
		wallets$1.forEach((wallet) => removeRegisteredWallet(wallet));
		listeners["unregister"]?.forEach((listener) => guard(() => listener(...wallets$1)));
	};
}
let cachedWalletsArray;
function get() {
	if (!cachedWalletsArray) cachedWalletsArray = [...registeredWalletsSet];
	return cachedWalletsArray;
}
function on(event, listener) {
	listeners[event]?.push(listener) || (listeners[event] = [listener]);
	return function off() {
		listeners[event] = listeners[event]?.filter((existingListener) => listener !== existingListener);
	};
}
function guard(callback) {
	try {
		callback();
	} catch (error) {
		console.error(error);
	}
}
var AppReadyEvent = class extends Event {
	get detail() {
		return __classPrivateFieldGet(this, _AppReadyEvent_detail, "f");
	}
	get type() {
		return "wallet-standard:app-ready";
	}
	constructor(api) {
		super("wallet-standard:app-ready", {
			bubbles: false,
			cancelable: false,
			composed: false
		});
		_AppReadyEvent_detail.set(this, void 0);
		__classPrivateFieldSet(this, _AppReadyEvent_detail, api, "f");
	}
	/** @deprecated */
	preventDefault() {
		throw new Error("preventDefault cannot be called");
	}
	/** @deprecated */
	stopImmediatePropagation() {
		throw new Error("stopImmediatePropagation cannot be called");
	}
	/** @deprecated */
	stopPropagation() {
		throw new Error("stopPropagation cannot be called");
	}
};
_AppReadyEvent_detail = /* @__PURE__ */ new WeakMap();

//#endregion
exports.getWallets = getWallets;
//# sourceMappingURL=esm-D9kK-xzr.js.map