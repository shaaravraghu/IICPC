import * as _clerk_shared_types from '@clerk/shared/types';
import { HandleOAuthCallbackParams, ShowWhenCondition, PendingSessionOptions, UseAuthReturn } from '@clerk/shared/types';
import React from 'react';
import { WithClerkProp } from './types.js';

declare const ClerkLoaded: ({ children }: React.PropsWithChildren<unknown>) => React.ReactNode;
declare const ClerkLoading: ({ children }: React.PropsWithChildren<unknown>) => React.ReactNode;
declare const ClerkFailed: ({ children }: React.PropsWithChildren<unknown>) => React.ReactNode;
declare const ClerkDegraded: ({ children }: React.PropsWithChildren<unknown>) => React.ReactNode;
type ShowProps = React.PropsWithChildren<{
    fallback?: React.ReactNode;
    when: ShowWhenCondition;
} & PendingSessionOptions>;
/**
 * Use `<Show/>` to conditionally render content based on user authorization or sign-in state.
 * Returns `null` while auth is loading. Set `treatPendingAsSignedOut` to treat
 * pending sessions as signed out during that period.
 *
 * The `when` prop supports:
 * - `"signed-in"` or `"signed-out"` shorthands
 * - Authorization descriptors (e.g., `{ permission: "org:billing:manage" }`, `{ role: "admin" }`)
 * - A predicate function `(has) => boolean` that receives the `has` helper
 *
 * @example
 * ```tsx
 * <Show when={{ permission: "org:billing:manage" }} fallback={<p>Unauthorized</p>}>
 *   <BillingSettings />
 * </Show>
 *
 * <Show when={{ role: "admin" }}>
 *   <AdminPanel />
 * </Show>
 *
 * <Show when={(has) => has({ permission: "org:read" }) && isFeatureEnabled}>
 *   <ProtectedFeature />
 * </Show>
 * ```
 *
 */
declare const Show: ({ children, fallback, treatPendingAsSignedOut, when }: ShowProps) => React.ReactNode;
declare const RedirectToSignIn: {
    (props: _clerk_shared_types.Without<WithClerkProp<_clerk_shared_types.SignInRedirectOptions>, "clerk">): React.JSX.Element | null;
    displayName: string;
};
declare const RedirectToSignUp: {
    (props: _clerk_shared_types.Without<WithClerkProp<_clerk_shared_types.SignUpRedirectOptions>, "clerk">): React.JSX.Element | null;
    displayName: string;
};
declare const RedirectToTasks: {
    (props: _clerk_shared_types.Without<WithClerkProp<_clerk_shared_types.TasksRedirectOptions>, "clerk">): React.JSX.Element | null;
    displayName: string;
};
/**
 * @function
 * @deprecated Use [`redirectToUserProfile()`](https://clerk.com/docs/reference/objects/clerk#redirect-to-user-profile) instead.
 */
declare const RedirectToUserProfile: {
    (props: _clerk_shared_types.Without<{
        clerk: _clerk_shared_types.LoadedClerk;
        component?: string;
    }, "clerk">): React.JSX.Element | null;
    displayName: string;
};
/**
 * @function
 * @deprecated Use [`redirectToOrganizationProfile()`](https://clerk.com/docs/reference/objects/clerk#redirect-to-organization-profile) instead.
 */
declare const RedirectToOrganizationProfile: {
    (props: _clerk_shared_types.Without<{
        clerk: _clerk_shared_types.LoadedClerk;
        component?: string;
    }, "clerk">): React.JSX.Element | null;
    displayName: string;
};
/**
 * @function
 * @deprecated Use [`redirectToCreateOrganization()`](https://clerk.com/docs/reference/objects/clerk#redirect-to-create-organization) instead.
 */
declare const RedirectToCreateOrganization: {
    (props: _clerk_shared_types.Without<{
        clerk: _clerk_shared_types.LoadedClerk;
        component?: string;
    }, "clerk">): React.JSX.Element | null;
    displayName: string;
};
declare const AuthenticateWithRedirectCallback: {
    (props: _clerk_shared_types.Without<WithClerkProp<HandleOAuthCallbackParams>, "clerk">): React.JSX.Element | null;
    displayName: string;
};
declare const MultisessionAppSupport: ({ children }: React.PropsWithChildren<unknown>) => React.JSX.Element;

/**
 * @inline
 */
type UseAuthOptions = PendingSessionOptions | undefined | null;
/**
 * The `useAuth()` hook provides access to the current user's authentication state and methods to manage the active session.
 *
 * > [!NOTE]
 * > To access auth data server-side, see the [`Auth` object reference doc](https://clerk.com/docs/reference/backend/types/auth-object).
 *
 * <If sdk="nextjs">
 * By default, Next.js opts all routes into static rendering. If you need to opt a route or routes into dynamic rendering because you need to access the authentication data at request time, you can create a boundary by passing the `dynamic` prop to `<ClerkProvider>`. See the [guide on rendering modes](https://clerk.com/docs/guides/development/rendering-modes) for more information, including code examples.
 * </If>
 *
 * @unionReturnHeadings
 * ["Loading", "Signed out", "Signed in (no active organization)", "Signed in (with active organization)"]
 *
 * @param [options] - An object containing options for the `useAuth()` hook. `treatPendingAsSignedOut` is a boolean that indicates whether pending sessions are considered as signed out or not. Defaults to `true`.
 *
 * @function
 *
 * @example
 *
 * The following example demonstrates how to use the `useAuth()` hook to access the current auth state, like whether the user is signed in or not. It also includes a basic example for using the `getToken()` method to retrieve a session token for fetching data from an external resource.
 *
 * <Tabs items='React,Next.js'>
 * <Tab>
 *
 * ```tsx {{ filename: 'src/pages/ExternalDataPage.tsx' }}
 * import { useAuth } from '@clerk/react'
 *
 * export default function ExternalDataPage() {
 *   const { userId, sessionId, getToken, isLoaded, isSignedIn } = useAuth()
 *
 *   const fetchExternalData = async () => {
 *     const token = await getToken()
 *
 *     // Fetch data from an external API
 *     const response = await fetch('https://api.example.com/data', {
 *       headers: {
 *         Authorization: `Bearer ${token}`,
 *       },
 *     })
 *
 *     return response.json()
 *   }
 *
 *   if (!isLoaded) {
 *     return <div>Loading...</div>
 *   }
 *
 *   if (!isSignedIn) {
 *     return <div>Sign in to view this page</div>
 *   }
 *
 *   return (
 *     <div>
 *       <p>
 *         Hello, {userId}! Your current active session is {sessionId}.
 *       </p>
 *       <button onClick={fetchExternalData}>Fetch Data</button>
 *     </div>
 *   )
 * }
 * ```
 *
 * </Tab>
 * <Tab>
 *
 * {@include ../../docs/use-auth.md#nextjs-01}
 *
 * </Tab>
 * </Tabs>
 */
declare const useAuth: (options?: UseAuthOptions) => UseAuthReturn;
/**
 * A hook that derives and returns authentication state and utility functions based on the provided auth object.
 *
 * @param authObject - An object containing authentication-related properties and functions.
 *
 * @returns A derived authentication state with helper methods. If the authentication state is invalid, an error is thrown.
 *
 * @remarks
 * This hook inspects session, user, and organization information to determine the current authentication state.
 * It returns an object that includes various properties such as whether the state is loaded, if a user is signed in,
 * session and user identifiers, Organization Roles, and a `has` function for authorization checks.
 * Additionally, it provides `signOut` and `getToken` functions if applicable.
 *
 * @example
 * ```tsx
 * const {
 *   isLoaded,
 *   isSignedIn,
 *   userId,
 *   orgId,
 *   has,
 *   signOut,
 *   getToken
 * } = useDerivedAuth(authObject);
 * ```
 */
declare function useDerivedAuth(authObject: any, { treatPendingAsSignedOut }?: PendingSessionOptions): UseAuthReturn;

export { AuthenticateWithRedirectCallback as A, ClerkDegraded as C, MultisessionAppSupport as M, RedirectToCreateOrganization as R, Show as S, ClerkFailed as a, ClerkLoaded as b, ClerkLoading as c, RedirectToOrganizationProfile as d, RedirectToSignIn as e, RedirectToSignUp as f, RedirectToTasks as g, RedirectToUserProfile as h, type ShowProps as i, useAuth as j, useDerivedAuth as u };
