import { ClerkProviderProps, WithClerkProp } from './types.js';
import * as _clerk_shared_types from '@clerk/shared/types';
import { RoutingOptions, InternalClerkScriptProps } from '@clerk/shared/types';
export { InternalClerkScriptProps } from '@clerk/shared/types';
import { useOAuthConsent as useOAuthConsent$1 } from '@clerk/shared/react';
import { Ui } from '@clerk/ui/internal';
export { Ui } from '@clerk/ui/internal';
import React from 'react';
export { publishableKeyFromHost } from '@clerk/shared/keys';
import { ErrorThrowerOptions } from '@clerk/shared/error';
export { M as MultisessionAppSupport, u as useDerivedAuth } from './useAuth-DFYP0feq.js';
export { buildClerkJSScriptAttributes, buildClerkJsScriptAttributes, buildClerkUIScriptAttributes, clerkJSScriptUrl, clerkJsScriptUrl, clerkUIScriptUrl, setClerkJSLoadingErrorPackageName, setClerkJsLoadingErrorPackageName } from '@clerk/shared/loadClerkJsScript';
import '@clerk/shared/ui';

/**
 * Overrides options of the internal errorThrower (eg setting packageName prefix).
 *
 * @internal
 */
declare function setErrorThrowerOptions(options: ErrorThrowerOptions): void;

declare function useRoutingProps<T extends RoutingOptions>(componentName: string, props: T, routingOptions?: RoutingOptions): T;

/**
 * Whether the host React version is compatible with the shared @clerk/ui variant.
 * This is computed once at module load time for optimal performance.
 */
declare const IS_REACT_SHARED_VARIANT_COMPATIBLE: boolean;

/**
 * @deprecated Import `useOAuthConsent` from `@clerk/react` instead.
 */
declare const useOAuthConsent: typeof useOAuthConsent$1;

/**
 * @deprecated Import `OAuthConsent` from `@clerk/react` instead.
 */
declare const OAuthConsent: {
    (props: _clerk_shared_types.Without<WithClerkProp<_clerk_shared_types.OAuthConsentProps & {
        fallback?: React.ReactNode;
    }>, "clerk">): React.JSX.Element | null;
    displayName: string;
};

/**
 * A wider-typed version of ClerkProvider that accepts internal script props.
 * Framework SDKs should use this instead of the public ClerkProvider.
 */
declare const InternalClerkProvider: (<TUi extends Ui = Ui>(props: ClerkProviderProps<TUi> & InternalClerkScriptProps) => React.JSX.Element) & {
    displayName: string;
};

export { IS_REACT_SHARED_VARIANT_COMPATIBLE, InternalClerkProvider, OAuthConsent, setErrorThrowerOptions, useOAuthConsent, useRoutingProps };
