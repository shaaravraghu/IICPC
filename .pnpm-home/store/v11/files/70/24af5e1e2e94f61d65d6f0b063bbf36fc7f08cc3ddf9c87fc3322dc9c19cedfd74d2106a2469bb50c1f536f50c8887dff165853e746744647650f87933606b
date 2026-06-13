import { Clerk, LoadedClerk, IsomorphicClerkOptions, InternalClerkScriptProps, InitialState, RedirectUrlProp, SignInRedirectOptions, SignUpRedirectOptions, TasksRedirectOptions } from '@clerk/shared/types';
export * from '@clerk/shared/types';
import { ClerkUIConstructor } from '@clerk/shared/ui';
import { Ui, ExtractAppearanceType, Appearance } from '@clerk/ui/internal';
import React from 'react';

declare global {
    interface Window {
        __clerk_publishable_key?: string;
        __clerk_proxy_url?: Clerk['proxyUrl'];
        __clerk_domain?: Clerk['domain'];
        __internal_ClerkUICtor?: ClerkUIConstructor;
    }
}
/**
 * @interface
 */
type ClerkProviderProps<TUi extends Ui = Ui> = Omit<IsomorphicClerkOptions, 'appearance' | keyof InternalClerkScriptProps> & {
    children: React.ReactNode;
    /**
     * Provide an initial state of the Clerk client during server-side rendering. You don't need to set this value yourself unless you're [developing an SDK](https://clerk.com/docs/guides/development/sdk-development/overview).
     */
    initialState?: InitialState;
    /**
     * Indicates to silently fail the initialization process when the publishable keys is not provided, instead of throwing an error.
     * @default false
     * @internal
     */
    __internal_bypassMissingPublishableKey?: boolean;
    /**
     * Optional object to style your components. Will only affect [Clerk Components](https://clerk.com/docs/reference/components/overview) and not [Account Portal](https://clerk.com/docs/guides/account-portal/overview) pages.
     */
    appearance?: ExtractAppearanceType<TUi, Appearance>;
    /**
     * Optional object to use the bundled Clerk UI instead of loading from CDN.
     * Import `ui` from `@clerk/ui` and pass it here to bundle the UI with your application.
     * When omitted, UI is loaded from Clerk's CDN.
     * Note: When `ui` is used, appearance is automatically typed based on the specific UI version.
     */
    ui?: TUi;
};
type WithClerkProp<T = unknown> = T & {
    clerk: LoadedClerk;
    component?: string;
    getContainer?: () => HTMLElement | null;
};
interface CustomPortalsRendererProps {
    customPagesPortals?: any[];
    customMenuItemsPortals?: any[];
}
interface MountProps {
    mount: (node: HTMLDivElement, props: any) => void;
    unmount: (node: HTMLDivElement) => void;
    updateProps: (props: any) => void;
    props?: any;
}
interface OpenProps {
    open: (props: any) => void;
    close: () => void;
    props?: any;
}
type SignInWithMetamaskButtonProps = {
    mode?: 'redirect' | 'modal';
    children?: React.ReactNode;
} & RedirectUrlProp;
type RedirectToSignInProps = SignInRedirectOptions;
type RedirectToSignUpProps = SignUpRedirectOptions;
type RedirectToTasksProps = TasksRedirectOptions;
type PageProps<T extends string> = {
    label: string;
    url: string;
    labelIcon: React.ReactNode;
} | {
    label: T;
    url?: never;
    labelIcon?: never;
};
type UserProfilePageProps = PageProps<'account' | 'security' | 'billing' | 'apiKeys'>;
type UserProfileLinkProps = {
    url: string;
    label: string;
    labelIcon: React.ReactNode;
};
type OrganizationProfilePageProps = PageProps<'general' | 'members' | 'billing' | 'apiKeys'>;
type OrganizationProfileLinkProps = UserProfileLinkProps;
type ButtonActionProps<T extends string> = {
    label: string;
    labelIcon: React.ReactNode;
    onClick: () => void;
    open?: never;
} | {
    label: T;
    labelIcon?: never;
    onClick?: never;
    open?: never;
} | {
    label: string;
    labelIcon: React.ReactNode;
    onClick?: never;
    open: string;
};
type UserButtonActionProps = ButtonActionProps<'manageAccount' | 'signOut'>;
type UserButtonLinkProps = {
    href: string;
    label: string;
    labelIcon: React.ReactNode;
};

export type { ClerkProviderProps, CustomPortalsRendererProps, MountProps, OpenProps, OrganizationProfileLinkProps, OrganizationProfilePageProps, RedirectToSignInProps, RedirectToSignUpProps, RedirectToTasksProps, SignInWithMetamaskButtonProps, UserButtonActionProps, UserButtonLinkProps, UserProfileLinkProps, UserProfilePageProps, WithClerkProp };
