import { Ct as Resources, Qo as SignedInSessionResource, Xa as ActClaim, co as OrganizationSystemPermissionKey, dm as Autocomplete, ps as UserResource, t as InitialState, to as JwtPayload, xo as OrganizationResource } from "./index-DAac51Y8.js";
import "./moduleManager-WB15hU3T.js";

//#region src/deriveState.d.ts
type DeriveStateReturnType = ReturnType<typeof deriveFromSsrInitialState>;
/**
 * Derives authentication state based on the current rendering context (SSR or client-side).
 */
declare const deriveState: (clerkOperational: boolean, state: Resources, initialState: InitialState | undefined) => DeriveStateReturnType;
declare const deriveFromSsrInitialState: (initialState: InitialState) => ReturnType<typeof deriveFromClientSideState>;
declare const deriveFromClientSideState: (state: Resources) => {
  userId: string | null | undefined;
  user: UserResource | null | undefined;
  sessionId: string | null | undefined;
  session: SignedInSessionResource | null | undefined;
  sessionStatus: "active" | "pending" | undefined;
  sessionClaims: JwtPayload | null | undefined;
  organization: OrganizationResource | null | undefined;
  orgId: string | null | undefined;
  orgRole: string | null | undefined;
  orgSlug: string | null | undefined;
  orgPermissions: Autocomplete<OrganizationSystemPermissionKey>[] | null | undefined;
  actor: ActClaim | null | undefined;
  factorVerificationAge: [number, number] | null;
};
//#endregion
export { DeriveStateReturnType, deriveFromClientSideState, deriveFromSsrInitialState, deriveState };
//# sourceMappingURL=deriveState.d.ts.map