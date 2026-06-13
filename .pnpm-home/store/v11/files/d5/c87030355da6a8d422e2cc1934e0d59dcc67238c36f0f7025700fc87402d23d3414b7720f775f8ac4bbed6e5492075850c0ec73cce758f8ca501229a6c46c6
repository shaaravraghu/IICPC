import { Theme, Ui } from '@clerk/ui/internal';
import * as _clerk_shared_types from '@clerk/shared/types';
import { Without, APIKeysProps, ConfigureSSOProps, CreateOrganizationProps, OrganizationListProps, OrganizationProfileProps, OrganizationSwitcherProps, SignInProps, SignUpProps, TaskChooseOrganizationProps, TaskResetPasswordProps, TaskSetupMFAProps, UserAvatarProps, UserButtonProps, UserProfileProps, WaitlistProps, SignInButtonProps, SignOutOptions, SignUpButtonProps, SetActiveNavigate, SignInResource, CreateEmailLinkFlowReturn, SignInStartEmailLinkFlowParams, SignUpResource, StartEmailLinkFlowParams, EmailAddressResource, SignInSignalValue, SignUpSignalValue, WaitlistSignalValue } from '@clerk/shared/types';
export { BrowserClerk, BrowserClerkConstructor, ClerkProp, HeadlessBrowserClerk, HeadlessBrowserClerkConstructor, IsomorphicClerkOptions } from '@clerk/shared/types';
import React, { ReactNode, PropsWithChildren } from 'react';
import { WithClerkProp, OrganizationProfilePageProps, OrganizationProfileLinkProps, UserProfilePageProps, UserProfileLinkProps, UserButtonActionProps, UserButtonLinkProps, SignInWithMetamaskButtonProps, ClerkProviderProps } from './types.js';
export { A as AuthenticateWithRedirectCallback, C as ClerkDegraded, a as ClerkFailed, b as ClerkLoaded, c as ClerkLoading, R as RedirectToCreateOrganization, d as RedirectToOrganizationProfile, e as RedirectToSignIn, f as RedirectToSignUp, g as RedirectToTasks, h as RedirectToUserProfile, S as Show, i as ShowProps, j as useAuth } from './useAuth-DFYP0feq.js';
export { UNSAFE_PortalProvider, __experimental_CheckoutProvider, __experimental_PaymentElement, __experimental_PaymentElementProvider, __experimental_useCheckout, __experimental_usePaymentElement, useAPIKeys, useClerk, useOAuthConsent, useOrganization, useOrganizationCreationDefaults, useOrganizationList, useReverification, useSession, useSessionList, useUser } from '@clerk/shared/react';
export { getToken } from '@clerk/shared/getToken';
import '@clerk/shared/ui';

/**
 * Augments the global ClerkAppearanceRegistry with the Theme type from @clerk/ui.
 * This provides full type safety for appearance props in @clerk/react without creating circular dependencies.
 */

declare global {
    interface ClerkAppearanceRegistry {
        theme: Theme;
    }
}

type FallbackProp = {
    /**
     * An optional element to render while the component is mounting.
     */
    fallback?: ReactNode;
};
type UserProfileExportType = typeof _UserProfile & {
    Page: typeof UserProfilePage;
    Link: typeof UserProfileLink;
};
type UserButtonExportType = typeof _UserButton & {
    UserProfilePage: typeof UserProfilePage;
    UserProfileLink: typeof UserProfileLink;
    MenuItems: typeof MenuItems;
    Action: typeof MenuAction;
    Link: typeof MenuLink;
    /**
     * The `<Outlet />` component can be used in conjunction with `asProvider` in order to control rendering
     * of the `<UserButton />` without affecting its configuration or any custom pages that could be mounted
     * @experimental This API is experimental and may change at any moment.
     */
    __experimental_Outlet: typeof UserButtonOutlet;
};
type UserButtonPropsWithoutCustomPages = Without<UserButtonProps, 'userProfileProps' | '__experimental_asStandalone'> & {
    userProfileProps?: Pick<UserProfileProps, 'additionalOAuthScopes' | 'appearance' | 'apiKeysProps'>;
    /**
     * Adding `asProvider` will defer rendering until the `<Outlet />` component is mounted.
     *
     * @experimental This API is experimental and may change at any moment.
     * @default undefined
     */
    __experimental_asProvider?: boolean;
};
type OrganizationProfileExportType = typeof _OrganizationProfile & {
    Page: typeof OrganizationProfilePage;
    Link: typeof OrganizationProfileLink;
};
type OrganizationSwitcherExportType = typeof _OrganizationSwitcher & {
    OrganizationProfilePage: typeof OrganizationProfilePage;
    OrganizationProfileLink: typeof OrganizationProfileLink;
    /**
     * The `<Outlet />` component can be used in conjunction with `asProvider` in order to control rendering
     * of the `<OrganizationSwitcher />` without affecting its configuration or any custom pages that could be mounted
     *
     * @experimental This API is experimental and may change at any moment.
     */
    __experimental_Outlet: typeof OrganizationSwitcherOutlet;
};
type OrganizationSwitcherPropsWithoutCustomPages = Without<OrganizationSwitcherProps, 'organizationProfileProps' | '__experimental_asStandalone'> & {
    organizationProfileProps?: Pick<OrganizationProfileProps, 'appearance'>;
    /**
     * Adding `asProvider` will defer rendering until the `<Outlet />` component is mounted.
     *
     * @experimental This API is experimental and may change at any moment.
     * @default undefined
     */
    __experimental_asProvider?: boolean;
};
declare const SignIn: {
    (props: Without<WithClerkProp<SignInProps & FallbackProp>, "clerk">): React.JSX.Element | null;
    displayName: string;
};
declare const SignUp: {
    (props: Without<WithClerkProp<SignUpProps & FallbackProp>, "clerk">): React.JSX.Element | null;
    displayName: string;
};
declare function UserProfilePage({ children }: PropsWithChildren<UserProfilePageProps>): React.JSX.Element;
declare function UserProfileLink({ children }: PropsWithChildren<UserProfileLinkProps>): React.JSX.Element;
declare const _UserProfile: {
    (props: Without<WithClerkProp<PropsWithChildren<Without<UserProfileProps, "customPages">> & FallbackProp>, "clerk">): React.JSX.Element | null;
    displayName: string;
};
declare const UserProfile: UserProfileExportType;
declare const _UserButton: {
    (props: Without<WithClerkProp<PropsWithChildren<UserButtonPropsWithoutCustomPages> & FallbackProp>, "clerk">): React.JSX.Element | null;
    displayName: string;
};
declare function MenuItems({ children }: PropsWithChildren): React.JSX.Element;
declare function MenuAction({ children }: PropsWithChildren<UserButtonActionProps>): React.JSX.Element;
declare function MenuLink({ children }: PropsWithChildren<UserButtonLinkProps>): React.JSX.Element;
declare function UserButtonOutlet(outletProps: Without<UserButtonProps, 'userProfileProps'>): React.JSX.Element;
declare const UserButton: UserButtonExportType;
declare function OrganizationProfilePage({ children }: PropsWithChildren<OrganizationProfilePageProps>): React.JSX.Element;
declare function OrganizationProfileLink({ children }: PropsWithChildren<OrganizationProfileLinkProps>): React.JSX.Element;
declare const _OrganizationProfile: {
    (props: Without<WithClerkProp<PropsWithChildren<Without<OrganizationProfileProps, "customPages">> & FallbackProp>, "clerk">): React.JSX.Element | null;
    displayName: string;
};
declare const OrganizationProfile: OrganizationProfileExportType;
declare const CreateOrganization: {
    (props: Without<WithClerkProp<CreateOrganizationProps & FallbackProp>, "clerk">): React.JSX.Element | null;
    displayName: string;
};
declare const _OrganizationSwitcher: {
    (props: Without<WithClerkProp<PropsWithChildren<OrganizationSwitcherPropsWithoutCustomPages> & FallbackProp>, "clerk">): React.JSX.Element | null;
    displayName: string;
};
declare function OrganizationSwitcherOutlet(outletProps: Without<OrganizationSwitcherProps, 'organizationProfileProps'>): React.JSX.Element;
declare const OrganizationSwitcher: OrganizationSwitcherExportType;
declare const OrganizationList: {
    (props: Without<WithClerkProp<OrganizationListProps & FallbackProp>, "clerk">): React.JSX.Element | null;
    displayName: string;
};
declare const GoogleOneTap: {
    (props: Without<WithClerkProp<_clerk_shared_types.SignInForceRedirectUrl & _clerk_shared_types.SignUpForceRedirectUrl & {
        cancelOnTapOutside?: boolean;
        itpSupport?: boolean;
        fedCmSupport?: boolean;
        appearance?: _clerk_shared_types.ClerkAppearanceTheme;
    } & FallbackProp>, "clerk">): React.JSX.Element | null;
    displayName: string;
};
declare const Waitlist: {
    (props: Without<WithClerkProp<WaitlistProps & FallbackProp>, "clerk">): React.JSX.Element | null;
    displayName: string;
};
declare const PricingTable: {
    (props: Without<WithClerkProp<{
        highlightedPlan?: string;
        for?: _clerk_shared_types.ForPayerType;
        appearance?: _clerk_shared_types.ClerkAppearanceTheme;
        checkoutProps?: Pick<_clerk_shared_types.__internal_CheckoutProps, "appearance">;
    } & {
        ctaPosition?: "top" | "bottom";
        collapseFeatures?: boolean;
        newSubscriptionRedirectUrl?: string;
    } & FallbackProp>, "clerk">): React.JSX.Element | null;
    displayName: string;
};
/**
 * @experimental This component is in early access and may change in future releases.
 */
declare const APIKeys: {
    (props: Without<WithClerkProp<APIKeysProps & FallbackProp>, "clerk">): React.JSX.Element | null;
    displayName: string;
};
declare const ConfigureSSO: {
    (props: Without<WithClerkProp<ConfigureSSOProps & FallbackProp>, "clerk">): React.JSX.Element | null;
    displayName: string;
};
declare const OAuthConsent: {
    (props: Without<WithClerkProp<_clerk_shared_types.OAuthConsentProps & FallbackProp>, "clerk">): React.JSX.Element | null;
    displayName: string;
};
declare const UserAvatar: {
    (props: Without<WithClerkProp<UserAvatarProps & FallbackProp>, "clerk">): React.JSX.Element | null;
    displayName: string;
};
declare const TaskChooseOrganization: {
    (props: Without<WithClerkProp<TaskChooseOrganizationProps & FallbackProp>, "clerk">): React.JSX.Element | null;
    displayName: string;
};
declare const TaskResetPassword: {
    (props: Without<WithClerkProp<TaskResetPasswordProps & FallbackProp>, "clerk">): React.JSX.Element | null;
    displayName: string;
};
declare const TaskSetupMFA: {
    (props: Without<WithClerkProp<TaskSetupMFAProps & FallbackProp>, "clerk">): React.JSX.Element | null;
    displayName: string;
};

declare const SignInButton: {
    (props: _clerk_shared_types.Without<WithClerkProp<React.PropsWithChildren<SignInButtonProps>>, "clerk">): React.JSX.Element | null;
    displayName: string;
};

declare const SignInWithMetamaskButton: {
    (props: _clerk_shared_types.Without<WithClerkProp<SignInWithMetamaskButtonProps>, "clerk">): React.JSX.Element | null;
    displayName: string;
};

type SignOutButtonProps = {
    redirectUrl?: string;
    sessionId?: string;
    /**
     * @deprecated Use the `redirectUrl` and `sessionId` props directly instead.
     */
    signOutOptions?: SignOutOptions;
    children?: React.ReactNode;
};
declare const SignOutButton: {
    (props: _clerk_shared_types.Without<React.PropsWithChildren<WithClerkProp<SignOutButtonProps>>, "clerk">): React.JSX.Element | null;
    displayName: string;
};

declare const SignUpButton: {
    (props: _clerk_shared_types.Without<WithClerkProp<React.PropsWithChildren<SignUpButtonProps>>, "clerk">): React.JSX.Element | null;
    displayName: string;
};

interface HandleSSOCallbackProps {
    /**
     * Called when the SSO callback is complete and a session has been created.
     */
    navigateToApp: (...params: Parameters<SetActiveNavigate>) => void;
    /**
     * Called when a sign-in requires additional verification, or a sign-up is transfered to a sign-in that requires
     * additional verification.
     */
    navigateToSignIn: () => void;
    /**
     * Called when a sign-in is transfered to a sign-up that requires additional verification.
     */
    navigateToSignUp: () => void;
}
/**
 * Use this component when building custom UI to handle the SSO callback and navigate to the appropriate page based on
 * the status of the sign-in or sign-up. By default, this component might render a captcha element to handle captchas
 * when required by the Clerk API.
 *
 * @example
 * ```tsx
 * import { HandleSSOCallback } from '@clerk/react';
 * import { useNavigate } from 'react-router';
 *
 * export default function Page() {
 *   const navigate = useNavigate();
 *
 *   return (
 *     <HandleSSOCallback
 *       navigateToApp={({ session, decorateUrl }) => {
 *         if (session?.currentTask) {
 *           const destination = decorateUrl(`/onboarding/${session?.currentTask.key}`);
 *           if (destination.startsWith('http')) {
 *             window.location.href = destination;
 *             return;
 *           }
 *           navigate(destination);
 *           return;
 *         }
 *
 *         const destination = decorateUrl('/dashboard');
 *         if (destination.startsWith('http')) {
 *           window.location.href = destination;
 *           return;
 *         }
 *         navigate(destination);
 *       }}
 *       navigateToSignIn={() => {
 *         navigate('/sign-in');
 *       }}
 *       navigateToSignUp={() => {
 *         navigate('/sign-up');
 *       }}
 *     />
 *   );
 * }
 * ```
 */
declare function HandleSSOCallback(props: HandleSSOCallbackProps): ReactNode;

declare function ClerkProviderBase<TUi extends Ui>(props: ClerkProviderProps<TUi>): React.JSX.Element;
declare const ClerkProvider: typeof ClerkProviderBase & {
    displayName: string;
};

type UseEmailLinkSignInReturn = CreateEmailLinkFlowReturn<SignInStartEmailLinkFlowParams, SignInResource>;
type UseEmailLinkSignUpReturn = CreateEmailLinkFlowReturn<StartEmailLinkFlowParams, SignUpResource>;
type UseEmailLinkEmailAddressReturn = CreateEmailLinkFlowReturn<StartEmailLinkFlowParams, EmailAddressResource>;
declare function useEmailLink(resource: SignInResource): UseEmailLinkSignInReturn;
declare function useEmailLink(resource: SignUpResource): UseEmailLinkSignUpReturn;
declare function useEmailLink(resource: EmailAddressResource): UseEmailLinkEmailAddressReturn;

/**
 * This hook allows you to access the Signal-based `SignIn` resource.
 *
 * @example
 * import { useSignIn } from "@clerk/react";
 *
 * function SignInForm() {
 *   const { signIn, errors, fetchStatus } = useSignIn();
 *   //
 * }
 */
declare const useSignIn: () => SignInSignalValue;
/**
 * This hook allows you to access the Signal-based `SignUp` resource.
 *
 * @example
 * import { useSignUp } from "@clerk/react";
 *
 * function SignUpForm() {
 *   const { signUp, errors, fetchStatus } = useSignUp();
 *   //
 * }
 */
declare const useSignUp: () => SignUpSignalValue;
/**
 * This hook allows you to access the Signal-based `Waitlist` resource.
 *
 * @example
 * import { useWaitlist } from "@clerk/react";
 *
 * function WaitlistForm() {
 *   const { waitlist, errors, fetchStatus } = useWaitlist();
 *   //
 * }
 */
declare function useWaitlist(): WaitlistSignalValue;

export { APIKeys, ClerkProvider, ClerkProviderProps, ConfigureSSO, CreateOrganization, GoogleOneTap, HandleSSOCallback, OAuthConsent, OrganizationList, OrganizationProfile, OrganizationSwitcher, PricingTable, SignIn, SignInButton, SignInWithMetamaskButton, SignOutButton, SignUp, SignUpButton, TaskChooseOrganization, TaskResetPassword, TaskSetupMFA, UserAvatar, UserButton, UserProfile, Waitlist, useEmailLink, useSignIn, useSignUp, useWaitlist };
