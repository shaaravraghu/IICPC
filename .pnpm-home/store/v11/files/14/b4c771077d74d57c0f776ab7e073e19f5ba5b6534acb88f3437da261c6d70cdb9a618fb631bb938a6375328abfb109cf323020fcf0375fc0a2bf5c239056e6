import { Bu as PublicKeyCredentialWithAuthenticatorAssertionResponse, Iu as CredentialReturn, Ru as PublicKeyCredentialCreationOptionsWithoutExtensions, Vu as PublicKeyCredentialWithAuthenticatorAttestationResponse, Xi as PublicKeyCredentialCreationOptionsJSON, Zi as PublicKeyCredentialRequestOptionsJSON, tr as ClerkWebAuthnError, zm as ClerkRuntimeError, zu as PublicKeyCredentialRequestOptionsWithoutExtensions } from "../../index-DAac51Y8.js";
import "../../moduleManager-WB15hU3T.js";

//#region src/internal/clerk-js/passkeys.d.ts
type WebAuthnCreateCredentialReturn = CredentialReturn<PublicKeyCredentialWithAuthenticatorAttestationResponse>;
type WebAuthnGetCredentialReturn = CredentialReturn<PublicKeyCredentialWithAuthenticatorAssertionResponse>;
declare class Base64Converter {
  static encode(buffer: ArrayBuffer): string;
  static decode(base64url: string): ArrayBuffer;
}
declare function webAuthnCreateCredential(publicKeyOptions: PublicKeyCredentialCreationOptionsWithoutExtensions): Promise<WebAuthnCreateCredentialReturn>;
declare class WebAuthnAbortService {
  private controller;
  private __abort;
  createAbortSignal(): AbortSignal;
  abort(): void;
}
declare const __internal_WebAuthnAbortService: WebAuthnAbortService;
declare function webAuthnGetCredential({
  publicKeyOptions,
  conditionalUI
}: {
  publicKeyOptions: PublicKeyCredentialRequestOptionsWithoutExtensions;
  conditionalUI: boolean;
}): Promise<WebAuthnGetCredentialReturn>;
/**
 * Map webauthn errors from `navigator.credentials.create()` to Clerk-js errors
 *
 * @param error
 */
declare function handlePublicKeyCreateError(error: Error): ClerkWebAuthnError | ClerkRuntimeError | Error;
declare function convertJSONToPublicKeyCreateOptions(jsonPublicKey: PublicKeyCredentialCreationOptionsJSON): PublicKeyCredentialCreationOptionsWithoutExtensions;
declare function convertJSONToPublicKeyRequestOptions(jsonPublicKey: PublicKeyCredentialRequestOptionsJSON): PublicKeyCredentialRequestOptionsWithoutExtensions;
declare function serializePublicKeyCredential(pkc: PublicKeyCredentialWithAuthenticatorAttestationResponse): {
  response: {
    clientDataJSON: string;
    attestationObject: string;
    transports: string[];
  };
  type: string;
  id: string;
  rawId: string;
  authenticatorAttachment: string | null;
};
declare function serializePublicKeyCredentialAssertion(pkc: PublicKeyCredentialWithAuthenticatorAssertionResponse): {
  response: {
    clientDataJSON: string;
    authenticatorData: string;
    signature: string;
    userHandle: string | null;
  };
  type: string;
  id: string;
  rawId: string;
  authenticatorAttachment: string | null;
};
declare const bufferToBase64Url: typeof Base64Converter.encode;
declare const base64UrlToBuffer: typeof Base64Converter.decode;
//#endregion
export { __internal_WebAuthnAbortService, base64UrlToBuffer, bufferToBase64Url, convertJSONToPublicKeyCreateOptions, convertJSONToPublicKeyRequestOptions, handlePublicKeyCreateError, serializePublicKeyCredential, serializePublicKeyCredentialAssertion, webAuthnCreateCredential, webAuthnGetCredential };
//# sourceMappingURL=passkeys.d.ts.map