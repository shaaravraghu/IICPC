require('../../clerkRuntimeError-CaS4sM5w.js');
const require_error = require('../../error-DsxScX2y.js');

//#region src/internal/clerk-js/passkeys.ts
var Base64Converter = class {
	static encode(buffer) {
		return btoa(String.fromCharCode(...new Uint8Array(buffer))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
	}
	static decode(base64url) {
		const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
		const binaryString = atob(base64);
		const length = binaryString.length;
		const bytes = new Uint8Array(length);
		for (let i = 0; i < length; i++) bytes[i] = binaryString.charCodeAt(i);
		return bytes.buffer;
	}
};
async function webAuthnCreateCredential(publicKeyOptions) {
	try {
		const credential = await navigator.credentials.create({ publicKey: publicKeyOptions });
		if (!credential) return {
			error: new require_error.ClerkWebAuthnError("Browser failed to create credential", { code: "passkey_registration_failed" }),
			publicKeyCredential: null
		};
		return {
			publicKeyCredential: credential,
			error: null
		};
	} catch (e) {
		return {
			error: handlePublicKeyCreateError(e),
			publicKeyCredential: null
		};
	}
}
var WebAuthnAbortService = class {
	controller;
	__abort() {
		if (!this.controller) return;
		const abortError = /* @__PURE__ */ new Error();
		abortError.name = "AbortError";
		this.controller.abort(abortError);
	}
	createAbortSignal() {
		this.__abort();
		const newController = new AbortController();
		this.controller = newController;
		return newController.signal;
	}
	abort() {
		this.__abort();
		this.controller = void 0;
	}
};
const __internal_WebAuthnAbortService = new WebAuthnAbortService();
async function webAuthnGetCredential({ publicKeyOptions, conditionalUI }) {
	try {
		const credential = await navigator.credentials.get({
			publicKey: publicKeyOptions,
			mediation: conditionalUI ? "conditional" : "optional",
			signal: __internal_WebAuthnAbortService.createAbortSignal()
		});
		if (!credential) return {
			error: new require_error.ClerkWebAuthnError("Browser failed to get credential", { code: "passkey_retrieval_failed" }),
			publicKeyCredential: null
		};
		return {
			publicKeyCredential: credential,
			error: null
		};
	} catch (e) {
		return {
			error: handlePublicKeyGetError(e),
			publicKeyCredential: null
		};
	}
}
function handlePublicKeyError(error) {
	if (error.name === "AbortError") return new require_error.ClerkWebAuthnError(error.message, { code: "passkey_operation_aborted" });
	if (error.name === "SecurityError") return new require_error.ClerkWebAuthnError(error.message, {
		code: "passkey_invalid_rpID_or_domain",
		docsUrl: "https://clerk.com/docs/deployments/overview#authentication-across-subdomains"
	});
	return error;
}
/**
* Map webauthn errors from `navigator.credentials.create()` to Clerk-js errors
*
* @param error
*/
function handlePublicKeyCreateError(error) {
	if (error.name === "InvalidStateError") return new require_error.ClerkWebAuthnError(error.message, { code: "passkey_already_exists" });
	if (error.name === "NotAllowedError") return new require_error.ClerkWebAuthnError(error.message, { code: "passkey_registration_cancelled" });
	return handlePublicKeyError(error);
}
/**
* Map webauthn errors from `navigator.credentials.get()` to Clerk-js errors
*
* @param error
*/
function handlePublicKeyGetError(error) {
	if (error.name === "NotAllowedError") return new require_error.ClerkWebAuthnError(error.message, { code: "passkey_retrieval_cancelled" });
	return handlePublicKeyError(error);
}
function convertJSONToPublicKeyCreateOptions(jsonPublicKey) {
	const userIdBuffer = base64UrlToBuffer(jsonPublicKey.user.id);
	const challengeBuffer = base64UrlToBuffer(jsonPublicKey.challenge);
	const excludeCredentialsWithBuffer = (jsonPublicKey.excludeCredentials || []).map((cred) => ({
		...cred,
		id: base64UrlToBuffer(cred.id)
	}));
	return {
		...jsonPublicKey,
		excludeCredentials: excludeCredentialsWithBuffer,
		challenge: challengeBuffer,
		user: {
			...jsonPublicKey.user,
			id: userIdBuffer
		}
	};
}
function convertJSONToPublicKeyRequestOptions(jsonPublicKey) {
	const challengeBuffer = base64UrlToBuffer(jsonPublicKey.challenge);
	const allowCredentialsWithBuffer = (jsonPublicKey.allowCredentials || []).map((cred) => ({
		...cred,
		id: base64UrlToBuffer(cred.id)
	}));
	return {
		...jsonPublicKey,
		allowCredentials: allowCredentialsWithBuffer,
		challenge: challengeBuffer
	};
}
function __serializePublicKeyCredential(pkc) {
	return {
		type: pkc.type,
		id: pkc.id,
		rawId: bufferToBase64Url(pkc.rawId),
		authenticatorAttachment: pkc.authenticatorAttachment
	};
}
function serializePublicKeyCredential(pkc) {
	const response = pkc.response;
	return {
		...__serializePublicKeyCredential(pkc),
		response: {
			clientDataJSON: bufferToBase64Url(response.clientDataJSON),
			attestationObject: bufferToBase64Url(response.attestationObject),
			transports: response.getTransports()
		}
	};
}
function serializePublicKeyCredentialAssertion(pkc) {
	const response = pkc.response;
	return {
		...__serializePublicKeyCredential(pkc),
		response: {
			clientDataJSON: bufferToBase64Url(response.clientDataJSON),
			authenticatorData: bufferToBase64Url(response.authenticatorData),
			signature: bufferToBase64Url(response.signature),
			userHandle: response.userHandle ? bufferToBase64Url(response.userHandle) : null
		}
	};
}
const bufferToBase64Url = Base64Converter.encode.bind(Base64Converter);
const base64UrlToBuffer = Base64Converter.decode.bind(Base64Converter);

//#endregion
exports.__internal_WebAuthnAbortService = __internal_WebAuthnAbortService;
exports.base64UrlToBuffer = base64UrlToBuffer;
exports.bufferToBase64Url = bufferToBase64Url;
exports.convertJSONToPublicKeyCreateOptions = convertJSONToPublicKeyCreateOptions;
exports.convertJSONToPublicKeyRequestOptions = convertJSONToPublicKeyRequestOptions;
exports.handlePublicKeyCreateError = handlePublicKeyCreateError;
exports.serializePublicKeyCredential = serializePublicKeyCredential;
exports.serializePublicKeyCredentialAssertion = serializePublicKeyCredentialAssertion;
exports.webAuthnCreateCredential = webAuthnCreateCredential;
exports.webAuthnGetCredential = webAuthnGetCredential;
//# sourceMappingURL=passkeys.js.map