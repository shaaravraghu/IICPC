import "../constants-Bta24VLk.mjs";
import "../isomorphicAtob-CoF80qYz.mjs";
import "../isomorphicBtoa-DWmLcIHi.mjs";
import "../keys-ChIG_Ewf.mjs";
import { n as reverificationError, t as isReverificationHint } from "../authorization-errors-CBHAr6Ld.mjs";
import { i as validateReverificationConfig } from "../authorization-Bayl2soX.mjs";
import { n as deriveFromSsrInitialState } from "../deriveState-CQUgOdaO.mjs";
import { t as ClerkRuntimeError } from "../clerkRuntimeError-DqAmLuLY.mjs";
import { C as isClerkAPIResponseError } from "../error-BwjsVTI1.mjs";
import { t as getCurrentOrganizationMembership } from "../organization-C75z74_V.mjs";
import "../noop-B7RzLU-c.mjs";
import "../underscore-ClYSgvuy.mjs";
import { a as eventMethodCalled } from "../telemetry-ZzMitk4y.mjs";
import { t as createDeferredPromise } from "../createDeferredPromise-CYCAgyvC.mjs";
import { n as clerkCoreErrorNoClerkSingleton } from "../errors-oOcNTWU9.mjs";
import * as React$1 from "react";
import React, { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { InfiniteQueryObserver, QueryClient, QueryObserver, noop, notifyManager } from "@tanstack/query-core";
import { dequal } from "dequal";

//#region src/react/hooks/createContextAndHook.ts
/**
* Assert that the context value exists, otherwise throw an error.
*
* @internal
*/
function assertContextExists(contextVal, msgOrCtx) {
	if (!contextVal) throw typeof msgOrCtx === "string" ? new Error(msgOrCtx) : /* @__PURE__ */ new Error(`${msgOrCtx.displayName} not found`);
}
/**
* Create and return a Context and two hooks that return the context value.
* The Context type is derived from the type passed in by the user.
*
* The first hook returned guarantees that the context exists so the returned value is always `CtxValue`
* The second hook makes no guarantees, so the returned value can be `CtxValue | undefined`
*
* @internal
*/
const createContextAndHook = (displayName, options) => {
	const { assertCtxFn = assertContextExists } = options || {};
	const Ctx = React.createContext(void 0);
	Ctx.displayName = displayName;
	const useCtx = () => {
		const ctx = React.useContext(Ctx);
		assertCtxFn(ctx, `${displayName} not found`);
		return ctx.value;
	};
	const useCtxWithoutGuarantee = () => {
		const ctx = React.useContext(Ctx);
		return ctx ? ctx.value : {};
	};
	return [
		Ctx,
		useCtx,
		useCtxWithoutGuarantee
	];
};

//#endregion
//#region src/react/contexts.tsx
const [ClerkInstanceContext, useClerkInstanceContext] = createContextAndHook("ClerkInstanceContext");
const [InitialStateContext, _useInitialStateContext] = createContextAndHook("InitialStateContext");
/**
* Provides initial Clerk state (session, user, organization data) from server-side rendering
* to child components via React context.
*
* Passing in a promise is only supported for React >= 19.
*
* The initialState is snapshotted on mount and cannot change during the component lifecycle.
*
* Note that different parts of the React tree can use separate InitialStateProvider instances
* with different initialState values if needed.
*/
function InitialStateProvider({ children, initialState }) {
	const [initialStateSnapshot] = useState(initialState);
	const initialStateCtx = React.useMemo(() => ({ value: initialStateSnapshot }), [initialStateSnapshot]);
	return /* @__PURE__ */ React.createElement(InitialStateContext.Provider, { value: initialStateCtx }, children);
}
function useInitialStateContext() {
	const initialState = _useInitialStateContext();
	if (initialState instanceof Promise) if ("use" in React && typeof React.use === "function") return React.use(initialState);
	else throw new Error("initialState cannot be a promise if React version is less than 19");
	return initialState;
}
const OptionsContext = React.createContext({});
const [CheckoutContext, useCheckoutContext] = createContextAndHook("CheckoutContext");
const __experimental_CheckoutProvider = ({ children,...rest }) => {
	return /* @__PURE__ */ React.createElement(CheckoutContext.Provider, { value: { value: rest } }, children);
};
/**
* @internal
*/
function useOptionsContext() {
	const context = React.useContext(OptionsContext);
	if (context === void 0) throw new Error("useOptions must be used within an OptionsContext");
	return context;
}
/**
* @internal
*/
function useAssertWrappedByClerkProvider(displayNameOrFn) {
	if (!React.useContext(ClerkInstanceContext)) {
		if (typeof displayNameOrFn === "function") {
			displayNameOrFn();
			return;
		}
		throw new Error(`${displayNameOrFn} can only be used within the <ClerkProvider /> component.

Possible fixes:
1. Ensure that the <ClerkProvider /> is correctly wrapping your application where this component is used.
2. Check for multiple versions of the \`@clerk/shared\` package in your project. Use a tool like \`npm ls @clerk/shared\` to identify multiple versions, and update your dependencies to only rely on one.

Learn more: https://clerk.com/docs/components/clerk-provider`.trim());
	}
}

//#endregion
//#region src/react/stable-keys.ts
const USER_MEMBERSHIPS_KEY = "userMemberships";
const USER_INVITATIONS_KEY = "userInvitations";
const USER_SUGGESTIONS_KEY = "userSuggestions";
const DOMAINS_KEY = "domains";
const MEMBERSHIP_REQUESTS_KEY = "membershipRequests";
const MEMBERSHIPS_KEY = "memberships";
const INVITATIONS_KEY = "invitations";
const API_KEYS_KEY = "apiKeys";
const ORGANIZATION_CREATION_DEFAULTS_KEY = "organizationCreationDefaults";
const OAUTH_CONSENT_INFO_KEY = "oauthConsentInfo";
const PLANS_KEY = "billing-plans";
const SUBSCRIPTION_KEY = "billing-subscription";
const PAYMENT_METHODS_KEY = "billing-payment-methods";
const PAYMENT_ATTEMPTS_KEY = "billing-payment-attempts";
const STATEMENTS_KEY = "billing-statements";
const STABLE_KEYS = {
	USER_MEMBERSHIPS_KEY,
	USER_INVITATIONS_KEY,
	USER_SUGGESTIONS_KEY,
	DOMAINS_KEY,
	MEMBERSHIP_REQUESTS_KEY,
	MEMBERSHIPS_KEY,
	INVITATIONS_KEY,
	PLANS_KEY,
	SUBSCRIPTION_KEY,
	PAYMENT_METHODS_KEY,
	PAYMENT_ATTEMPTS_KEY,
	STATEMENTS_KEY,
	API_KEYS_KEY,
	ORGANIZATION_CREATION_DEFAULTS_KEY,
	OAUTH_CONSENT_INFO_KEY
};
/**
* Internal stable keys for queries only used by our UI components.
* These keys are not used by the hooks themselves.
*/
const PAYMENT_ATTEMPT_KEY = "billing-payment-attempt";
const BILLING_PLANS_KEY = "billing-plan";
const BILLING_STATEMENTS_KEY = "billing-statement";
const USER_ENTERPRISE_CONNECTIONS_KEY = "userEnterpriseConnections";
const ENTERPRISE_CONNECTION_TEST_RUNS_KEY = "enterpriseConnectionTestRuns";
const INTERNAL_STABLE_KEYS = {
	PAYMENT_ATTEMPT_KEY,
	BILLING_PLANS_KEY,
	BILLING_STATEMENTS_KEY,
	USER_ENTERPRISE_CONNECTIONS_KEY,
	ENTERPRISE_CONNECTION_TEST_RUNS_KEY
};

//#endregion
//#region src/react/hooks/createCacheKeys.ts
/**
* @internal
*/
function createCacheKeys(params) {
	return {
		queryKey: [
			params.stablePrefix,
			params.authenticated,
			params.tracked,
			params.untracked
		],
		invalidationKey: [
			params.stablePrefix,
			params.authenticated,
			params.tracked
		],
		stableKey: params.stablePrefix,
		authenticated: params.authenticated
	};
}

//#endregion
//#region src/react/query/keep-previous-data.ts
/**
* @internal
*/
function defineKeepPreviousDataFn(enabled) {
	if (enabled) return function KeepPreviousDataFn(previousData) {
		return previousData;
	};
}

//#endregion
//#region src/react/query/clerk-query-client.ts
/**
* The QueryClient backing every clerk-query hook. Owned by `@clerk/shared` so the
* `QueryObserver` that observes it and the `Query` objects inside it always
* resolve to the same `@tanstack/query-core` (no cross-bundle drift between
* the consumer-side `@clerk/shared` and the production CDN `clerk-js` bundle).
*
* Lazily instantiated on the client only. Server-side renders return
* `undefined` so per-request renders never share a cache across requests.
*/
let clerkQueryClient;
let initialized = false;
function getClerkQueryClient() {
	if (typeof window === "undefined") return;
	if (!initialized) {
		clerkQueryClient = new QueryClient();
		initialized = true;
	}
	return clerkQueryClient;
}
/**
* Test-only: install a custom client (for deterministic defaults like
* `staleTime: Infinity`) or pass `undefined` to simulate the "no client"
* state without triggering lazy creation on subsequent reads.
*/
function __setClerkQueryClientForTest(client) {
	clerkQueryClient = client;
	initialized = true;
}
/**
* Test-only: build and install a fresh `QueryClient` with deterministic
* defaults (no retries, infinite stale time, no refetching). Returns the
* client so the spec can read/write its cache directly.
*
* Avoids forcing every test consumer to depend on `@tanstack/query-core`.
*/
function __createClerkTestQueryClient() {
	const client = new QueryClient({ defaultOptions: { queries: {
		retry: false,
		staleTime: Infinity,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchOnMount: false
	} } });
	__setClerkQueryClientForTest(client);
	return client;
}
/**
* Test-only: clear both the override and the initialization flag so the
* next read lazy-creates a fresh client.
*/
function __resetClerkQueryClientForTest() {
	clerkQueryClient = void 0;
	initialized = false;
}

//#endregion
//#region src/react/query/use-clerk-query-client.ts
/**
* Creates a recursively self-referential Proxy that safely handles:
* - Arbitrary property access (e.g., obj.any.prop.path)
* - Function calls at any level (e.g., obj.a().b.c())
* - Construction (e.g., new obj.a.b())
*
* Always returns itself to allow infinite chaining without throwing.
*/
function createRecursiveProxy(label) {
	const callableTarget = function noop$1() {};
	let self;
	self = new Proxy(callableTarget, {
		get(_target, prop) {
			if (prop === "then") return;
			if (prop === "toString") return () => `[${label}]`;
			if (prop === Symbol.toPrimitive) return () => 0;
			return self;
		},
		apply() {
			return self;
		},
		construct() {
			return self;
		},
		has() {
			return false;
		},
		set() {
			return false;
		}
	});
	return self;
}
const mockQueryClient = createRecursiveProxy("ClerkMockQueryClient");
/**
* Returns `[client, isLoaded]`. The real client is owned by `@clerk/shared`
* and lazily instantiated on the browser only — SSR returns the proxy mock
* + `isLoaded: false` so per-request renders never share a query cache.
*/
const useClerkQueryClient = () => {
	const client = getClerkQueryClient();
	return [client ?? mockQueryClient, Boolean(client)];
};

//#endregion
//#region src/react/query/useBaseQuery.ts
/**
* Stripped down version of useBaseQuery from @tanstack/query-core.
* This implementation allows for an observer to be created every time a query client changes.
*/
/**
* An alternative `useBaseQuery` implementation that allows for an observer to be created every time a query client changes.
*
* @internal
*/
function useBaseQuery(options, Observer) {
	const [client, isQueryClientLoaded] = useClerkQueryClient();
	const defaultedOptions = isQueryClientLoaded ? client.defaultQueryOptions(options) : options;
	defaultedOptions._optimisticResults = "optimistic";
	const observer = React$1.useMemo(() => {
		return new Observer(client, defaultedOptions);
	}, [client]);
	const result = observer.getOptimisticResult(defaultedOptions);
	const shouldSubscribe = options.subscribed !== false;
	React$1.useSyncExternalStore(React$1.useCallback((onStoreChange) => {
		const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
		observer.updateResult();
		return unsubscribe;
	}, [observer, shouldSubscribe]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
	React$1.useEffect(() => {
		observer.setOptions(defaultedOptions);
	}, [defaultedOptions, observer]);
	if (!isQueryClientLoaded) return {
		data: void 0,
		error: null,
		isLoading: options.enabled !== false,
		isFetching: false,
		status: "pending"
	};
	return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}

//#endregion
//#region src/react/query/useInfiniteQuery.ts
/**
*
*/
function useClerkInfiniteQuery(options) {
	return useBaseQuery(options, InfiniteQueryObserver);
}

//#endregion
//#region src/react/query/useQuery.ts
/**
*
*/
function useClerkQuery(options) {
	return useBaseQuery(options, QueryObserver);
}

//#endregion
//#region src/react/hooks/usePreviousValue.ts
/**
* A hook that retains the previous value of a primitive type.
* It uses a ref to prevent causing unnecessary re-renders.
*
* @internal
*
* @example
* ```
* Render 1: value = 'A' → returns null
* Render 2: value = 'B' → returns 'A'
* Render 3: value = 'B' → returns 'A'
* Render 4: value = 'B' → returns 'A'
* Render 5: value = 'C' → returns 'B'
* ```
*/
function usePreviousValue(value) {
	const currentRef = useRef(value);
	const previousRef = useRef(null);
	if (currentRef.current !== value) {
		previousRef.current = currentRef.current;
		currentRef.current = value;
	}
	return previousRef.current;
}

//#endregion
//#region src/react/hooks/useClearQueriesOnSignOut.ts
const withInfiniteKey = (key) => [key, `${key}-inf`];
/**
* Clears React Query caches associated with the given stable prefixes when
* the authenticated state transitions from signed-in to signed-out.
*
* @internal
*/
function useClearQueriesOnSignOut(options) {
	const { isSignedOut, stableKeys, authenticated = true, onCleanup } = options;
	const stableKeysRef = useRef(stableKeys);
	const [queryClient] = useClerkQueryClient();
	const previousIsSignedIn = usePreviousValue(!isSignedOut);
	useEffect(() => {
		if (authenticated !== true) return;
		if (previousIsSignedIn && isSignedOut === true) {
			queryClient.removeQueries({ predicate: (query) => {
				const [cachedStableKey, queryAuthenticated] = query.queryKey;
				return queryAuthenticated === true && typeof cachedStableKey === "string" && (Array.isArray(stableKeysRef.current) ? stableKeysRef.current.includes(cachedStableKey) : stableKeysRef.current === cachedStableKey);
			} });
			onCleanup?.();
		}
	}, [
		authenticated,
		isSignedOut,
		previousIsSignedIn,
		queryClient
	]);
}

//#endregion
//#region src/react/hooks/usePagesOrInfinite.shared.ts
/**
* A hook that safely merges user-provided pagination options with default values.
* It caches initial pagination values (page and size) until component unmount to prevent unwanted rerenders.
*
* @internal
*
* @example
* ```typescript
* // Example 1: With user-provided options
* const userOptions = { initialPage: 2, pageSize: 20, infinite: true };
* const defaults = { initialPage: 1, pageSize: 10, infinite: false };
* useWithSafeValues(userOptions, defaults);
* // Returns { initialPage: 2, pageSize: 20, infinite: true }
*
* // Example 2: With boolean true (use defaults)
* const params = true;
* const defaults = { initialPage: 1, pageSize: 10, infinite: false };
* useWithSafeValues(params, defaults);
* // Returns { initialPage: 1, pageSize: 10, infinite: false }
*
* // Example 3: With undefined options (fallback to defaults)
* const params = undefined;
* const defaults = { initialPage: 1, pageSize: 10, infinite: false };
* useWithSafeValues(params, defaults);
* // Returns { initialPage: 1, pageSize: 10, infinite: false }
* ```
*/
const useWithSafeValues = (params, defaultValues) => {
	const shouldUseDefaults = typeof params === "boolean" && params;
	const initialPageRef = useRef(shouldUseDefaults ? defaultValues.initialPage : params?.initialPage ?? defaultValues.initialPage);
	const pageSizeRef = useRef(shouldUseDefaults ? defaultValues.pageSize : params?.pageSize ?? defaultValues.pageSize);
	const newObj = {};
	for (const key of Object.keys(defaultValues)) newObj[key] = shouldUseDefaults ? defaultValues[key] : params?.[key] ?? defaultValues[key];
	return {
		...newObj,
		initialPage: initialPageRef.current,
		pageSize: pageSizeRef.current
	};
};
/**
* Calculates the offset count for pagination based on initial page and page size.
* This represents the number of items to skip before the first page.
*
* @param initialPage - The starting page number (1-based)
* @param pageSize - The number of items per page
* @returns The number of items to offset
*
* @example
* ```typescript
* calculateOffsetCount(1, 10); // Returns 0 (no offset for first page)
* calculateOffsetCount(2, 10); // Returns 10 (skip first 10 items)
* calculateOffsetCount(3, 20); // Returns 40 (skip first 40 items)
* ```
*/
function calculateOffsetCount(initialPage, pageSize) {
	return (initialPage - 1) * pageSize;
}
/**
* Calculates the total number of pages based on total count, offset, and page size.
*
* @param totalCount - The total number of items
* @param offsetCount - The number of items to offset (from calculateOffsetCount)
* @param pageSize - The number of items per page
* @returns The total number of pages
*
* @example
* ```typescript
* calculatePageCount(100, 0, 10);  // Returns 10
* calculatePageCount(95, 0, 10);   // Returns 10 (rounds up)
* calculatePageCount(100, 20, 10); // Returns 8 (100 - 20 = 80 items, 8 pages)
* ```
*/
function calculatePageCount(totalCount, offsetCount, pageSize) {
	return Math.ceil((totalCount - offsetCount) / pageSize);
}
/**
* Determines if there is a next page available in non-infinite pagination mode.
*
* @param totalCount - The total number of items
* @param offsetCount - The number of items to offset
* @param currentPage - The current page number (1-based)
* @param pageSize - The number of items per page
* @returns True if there are more items beyond the current page
*
* @example
* ```typescript
* calculateHasNextPage(100, 0, 1, 10);  // Returns true (page 1 of 10)
* calculateHasNextPage(100, 0, 10, 10); // Returns false (last page)
* calculateHasNextPage(25, 0, 2, 10);   // Returns true (page 2, 5 more items)
* calculateHasNextPage(20, 0, 2, 10);   // Returns false (exactly 2 pages)
* ```
*/
function calculateHasNextPage(totalCount, offsetCount, currentPage, pageSize) {
	return totalCount - offsetCount > currentPage * pageSize;
}
/**
* Determines if there is a previous page available in non-infinite pagination mode.
*
* @param currentPage - The current page number (1-based)
* @param pageSize - The number of items per page
* @param offsetCount - The number of items to offset
* @returns True if there are pages before the current page
*
* @example
* ```typescript
* calculateHasPreviousPage(1, 10, 0);  // Returns false (first page)
* calculateHasPreviousPage(2, 10, 0);  // Returns true (can go back to page 1)
* calculateHasPreviousPage(1, 10, 10); // Returns false (first page with offset)
* ```
*/
function calculateHasPreviousPage(currentPage, pageSize, offsetCount) {
	return (currentPage - 1) * pageSize > offsetCount;
}

//#endregion
//#region src/react/hooks/usePagesOrInfinite.tsx
const usePagesOrInfinite = (params) => {
	const { fetcher, config, keys } = params;
	const [paginatedPage, setPaginatedPage] = useState(config.initialPage ?? 1);
	const initialPageRef = useRef(config.initialPage ?? 1);
	const pageSizeRef = useRef(config.pageSize ?? 10);
	const enabled = config.enabled ?? true;
	const isSignedIn = config.isSignedIn;
	const triggerInfinite = config.infinite ?? false;
	const cacheMode = config.__experimental_mode === "cache";
	const keepPreviousData = config.keepPreviousData ?? false;
	const [queryClient] = useClerkQueryClient();
	const queriesEnabled = enabled && Boolean(fetcher) && !cacheMode && isSignedIn !== false;
	const [forceUpdateCounter, setForceUpdateCounter] = useState(0);
	const forceUpdate = useCallback((updater) => {
		setForceUpdateCounter(updater);
	}, []);
	const pagesQueryKey = useMemo(() => {
		const [stablePrefix, authenticated, tracked, untracked] = keys.queryKey;
		return [
			stablePrefix,
			authenticated,
			tracked,
			{
				...untracked,
				args: {
					...untracked.args,
					initialPage: paginatedPage,
					pageSize: pageSizeRef.current
				}
			}
		];
	}, [keys.queryKey, paginatedPage]);
	const singlePageQuery = useClerkQuery({
		queryKey: pagesQueryKey,
		queryFn: ({ queryKey }) => {
			const { args } = queryKey[3];
			if (!fetcher) return;
			return fetcher(args);
		},
		staleTime: 6e4,
		enabled: queriesEnabled && !triggerInfinite,
		placeholderData: defineKeepPreviousDataFn(keepPreviousData)
	});
	const infiniteQueryKey = useMemo(() => {
		const [stablePrefix, authenticated, tracked, untracked] = keys.queryKey;
		return [
			stablePrefix + "-inf",
			authenticated,
			tracked,
			untracked
		];
	}, [keys.queryKey]);
	const infiniteQuery = useClerkInfiniteQuery({
		queryKey: infiniteQueryKey,
		initialPageParam: config.initialPage ?? 1,
		getNextPageParam: (lastPage, allPages, lastPageParam) => {
			const total = lastPage?.total_count ?? 0;
			return (allPages.length + (config.initialPage ? config.initialPage - 1 : 0)) * (config.pageSize ?? 10) < total ? lastPageParam + 1 : void 0;
		},
		queryFn: ({ pageParam, queryKey }) => {
			const { args } = queryKey[3];
			if (!fetcher) return;
			return fetcher({
				...args,
				initialPage: pageParam,
				pageSize: pageSizeRef.current
			});
		},
		staleTime: 6e4,
		enabled: queriesEnabled && triggerInfinite
	});
	useClearQueriesOnSignOut({
		isSignedOut: isSignedIn === false,
		authenticated: keys.authenticated,
		stableKeys: withInfiniteKey(keys.stableKey),
		onCleanup: () => {
			setPaginatedPage(initialPageRef.current);
			Promise.resolve().then(() => forceUpdate((n) => n + 1));
		}
	});
	const { data, count, page } = useMemo(() => {
		if (triggerInfinite) {
			const cachedData = queryClient.getQueryData(infiniteQueryKey);
			const pages = queriesEnabled ? infiniteQuery.data?.pages ?? cachedData?.pages ?? [] : cachedData?.pages ?? [];
			const validPages = Array.isArray(pages) ? pages.filter(Boolean) : [];
			return {
				data: validPages.map((a) => a?.data).flat().filter(Boolean) ?? [],
				count: validPages[validPages.length - 1]?.total_count ?? 0,
				page: validPages.length > 0 ? validPages.length : initialPageRef.current
			};
		}
		const pageData = queriesEnabled ? singlePageQuery.data ?? queryClient.getQueryData(pagesQueryKey) : queryClient.getQueryData(pagesQueryKey);
		return {
			data: Array.isArray(pageData?.data) ? pageData.data : [],
			count: typeof pageData?.total_count === "number" ? pageData.total_count : 0,
			page: paginatedPage
		};
	}, [
		queriesEnabled,
		forceUpdateCounter,
		triggerInfinite,
		infiniteQuery.data?.pages,
		singlePageQuery.data,
		queryClient,
		infiniteQueryKey,
		pagesQueryKey,
		paginatedPage
	]);
	const fetchPage = useCallback((numberOrgFn) => {
		if (triggerInfinite) {
			const next = typeof numberOrgFn === "function" ? numberOrgFn(page) : numberOrgFn;
			const targetCount = Math.max(0, next);
			const cachedData = queryClient.getQueryData(infiniteQueryKey);
			if (targetCount - (infiniteQuery.data?.pages ?? cachedData?.pages ?? []).length > 0) infiniteQuery.fetchNextPage({ cancelRefetch: false });
			return;
		}
		return setPaginatedPage(numberOrgFn);
	}, [
		infiniteQuery,
		page,
		triggerInfinite,
		queryClient,
		infiniteQueryKey
	]);
	const isLoading = triggerInfinite ? infiniteQuery.isLoading : singlePageQuery.isLoading;
	const isFetching = triggerInfinite ? infiniteQuery.isFetching : singlePageQuery.isFetching;
	const error = (triggerInfinite ? infiniteQuery.error : singlePageQuery.error) ?? null;
	const isError = !!error;
	const fetchNext = useCallback(() => {
		if (triggerInfinite) {
			infiniteQuery.fetchNextPage({ cancelRefetch: false });
			return;
		}
		setPaginatedPage((n) => Math.max(0, n + 1));
	}, [infiniteQuery, triggerInfinite]);
	const fetchPrevious = useCallback(() => {
		if (triggerInfinite) return;
		setPaginatedPage((n) => Math.max(0, n - 1));
	}, [triggerInfinite]);
	const offsetCount = calculateOffsetCount(initialPageRef.current, pageSizeRef.current);
	const pageCount = calculatePageCount(count, offsetCount, pageSizeRef.current);
	const hasNextPage = triggerInfinite ? Boolean(infiniteQuery.hasNextPage) : calculateHasNextPage(count, offsetCount, page, pageSizeRef.current);
	const hasPreviousPage = triggerInfinite ? Boolean(infiniteQuery.hasPreviousPage) : calculateHasPreviousPage(page, pageSizeRef.current, offsetCount);
	const setData = (value) => {
		if (triggerInfinite) {
			queryClient.setQueryData(infiniteQueryKey, (prevValue = {}) => {
				const prevPages = Array.isArray(prevValue?.pages) ? prevValue.pages : [];
				const nextPages = typeof value === "function" ? value(prevPages) : value;
				return {
					...prevValue,
					pages: nextPages
				};
			});
			forceUpdate((n) => n + 1);
			return Promise.resolve();
		}
		queryClient.setQueryData(pagesQueryKey, (prevValue = {
			data: [],
			total_count: 0
		}) => {
			return typeof value === "function" ? value(prevValue) : value;
		});
		forceUpdate((n) => n + 1);
		return Promise.resolve();
	};
	const revalidate = async () => {
		await queryClient.invalidateQueries({ queryKey: keys.invalidationKey });
		const [stablePrefix, ...rest] = keys.invalidationKey;
		return queryClient.invalidateQueries({ queryKey: [stablePrefix + "-inf", ...rest] });
	};
	return {
		data,
		count,
		error,
		isLoading,
		isFetching,
		isError,
		page,
		pageCount,
		fetchPage,
		fetchNext,
		fetchPrevious,
		hasNextPage,
		hasPreviousPage,
		revalidate,
		setData
	};
};

//#endregion
//#region src/react/hooks/useAPIKeys.tsx
/**
* The `useAPIKeys()` hook provides access to paginated API keys for the current user or organization.
*
* @example
* ### Basic usage with default pagination
*
* ```tsx
* const { data, isLoading, page, pageCount, fetchNext, fetchPrevious } = useAPIKeys({
*   subject: 'user_123',
*   pageSize: 10,
*   initialPage: 1,
* });
* ```
*
* @example
* ### With search query
*
* ```tsx
* const [searchValue, setSearchValue] = useState('');
* const debouncedSearch = useDebounce(searchValue, 500);
*
* const { data, isLoading } = useAPIKeys({
*   subject: 'user_123',
*   query: debouncedSearch.trim(),
*   pageSize: 10,
* });
* ```
*
* @example
* ### Infinite scroll
*
* ```tsx
* const { data, isLoading, fetchNext, hasNextPage } = useAPIKeys({
*   subject: 'user_123',
*   infinite: true,
* });
* ```
*/
function useAPIKeys(params) {
	useAssertWrappedByClerkProvider("useAPIKeys");
	const safeValues = useWithSafeValues(params, {
		initialPage: 1,
		pageSize: 10,
		keepPreviousData: false,
		infinite: false,
		subject: "",
		query: "",
		enabled: true
	});
	const clerk = useClerkInstanceContext();
	clerk.telemetry?.record(eventMethodCalled("useAPIKeys"));
	const hookParams = {
		initialPage: safeValues.initialPage,
		pageSize: safeValues.pageSize,
		...safeValues.subject ? { subject: safeValues.subject } : {},
		...safeValues.query ? { query: safeValues.query } : {}
	};
	const isEnabled = (safeValues.enabled ?? true) && clerk.loaded;
	return usePagesOrInfinite({
		fetcher: clerk.apiKeys?.getAll ? (params$1) => clerk.apiKeys.getAll({
			...params$1,
			subject: safeValues.subject
		}) : void 0,
		config: {
			keepPreviousData: safeValues.keepPreviousData,
			infinite: safeValues.infinite,
			enabled: isEnabled,
			isSignedIn: clerk.user !== null,
			initialPage: safeValues.initialPage,
			pageSize: safeValues.pageSize
		},
		keys: createCacheKeys({
			stablePrefix: STABLE_KEYS.API_KEYS_KEY,
			authenticated: true,
			tracked: { subject: safeValues.subject },
			untracked: { args: hookParams }
		})
	});
}

//#endregion
//#region src/react/hooks/base/useUserBase.ts
function useUserBase() {
	const clerk = useClerkInstanceContext();
	const initialState = useInitialStateContext();
	const getInitialState = useCallback(() => initialState?.user, [initialState?.user]);
	return useSyncExternalStore(useCallback((callback) => {
		return clerk.addListener(callback, { skipInitialEmit: true });
	}, [clerk]), useCallback(() => {
		if (!clerk.loaded || !clerk.__internal_lastEmittedResources) return getInitialState();
		return clerk.__internal_lastEmittedResources.user;
	}, [clerk, getInitialState]), getInitialState);
}

//#endregion
//#region src/react/hooks/useOAuthConsent.shared.ts
function useOAuthConsentCacheKeys(params) {
	const { userId, oauthClientId, scope } = params;
	return useMemo(() => {
		const args = { oauthClientId };
		if (scope !== void 0) args.scope = scope;
		return createCacheKeys({
			stablePrefix: STABLE_KEYS.OAUTH_CONSENT_INFO_KEY,
			authenticated: true,
			tracked: { userId: userId ?? null },
			untracked: { args }
		});
	}, [
		userId,
		oauthClientId,
		scope
	]);
}

//#endregion
//#region src/react/hooks/useOAuthConsent.tsx
const HOOK_NAME$2 = "useOAuthConsent";
/**
* The `useOAuthConsent()` hook loads OAuth application consent metadata for the **signed-in** user
* (`GET /me/oauth/consent/{oauthClientId}`). Ensure the user is authenticated before relying on this hook
* (for example, redirect to sign-in on your custom consent route).
*
* @example
* ```tsx
* import { useOAuthConsent } from '@clerk/react/internal'
*
* const { data, isLoading, error } = useOAuthConsent({
*   oauthClientId: clientIdFromProps,
*   scope: scopeFromProps,
* })
* ```
*/
function useOAuthConsent(params) {
	useAssertWrappedByClerkProvider(HOOK_NAME$2);
	const { oauthClientId: oauthClientIdParam, scope, keepPreviousData = true, enabled = true } = params;
	const clerk = useClerkInstanceContext();
	const user = useUserBase();
	const oauthClientId = (oauthClientIdParam ?? "").trim();
	clerk.telemetry?.record(eventMethodCalled(HOOK_NAME$2));
	const { queryKey } = useOAuthConsentCacheKeys({
		userId: user?.id ?? null,
		oauthClientId,
		scope
	});
	const hasClientId = oauthClientId.length > 0;
	const queryEnabled = Boolean(user) && hasClientId && enabled && clerk.loaded;
	const query = useClerkQuery({
		queryKey,
		queryFn: () => fetchConsentInfo(clerk, {
			oauthClientId,
			scope
		}),
		enabled: queryEnabled,
		placeholderData: defineKeepPreviousDataFn(keepPreviousData && queryEnabled)
	});
	return {
		data: query.data,
		error: query.error ?? null,
		isLoading: query.isLoading,
		isFetching: query.isFetching
	};
}
function fetchConsentInfo(clerk, params) {
	const { oauthClientId, scope } = params;
	return clerk.oauthApplication.getConsentInfo(scope !== void 0 ? {
		oauthClientId,
		scope
	} : { oauthClientId });
}

//#endregion
//#region src/react/hooks/base/useOrganizationBase.ts
function useOrganizationBase() {
	const clerk = useClerkInstanceContext();
	const initialState = useInitialStateContext();
	const getInitialState = useCallback(() => initialState?.organization, [initialState?.organization]);
	return useSyncExternalStore(useCallback((callback) => clerk.addListener(callback, { skipInitialEmit: true }), [clerk]), useCallback(() => {
		if (!clerk.loaded || !clerk.__internal_lastEmittedResources) return getInitialState();
		return clerk.__internal_lastEmittedResources.organization;
	}, [clerk, getInitialState]), getInitialState);
}

//#endregion
//#region src/react/hooks/base/useSessionBase.ts
function useSessionBase() {
	const clerk = useClerkInstanceContext();
	const initialState = useInitialStateContext();
	const getInitialState = useCallback(() => {
		return initialState ? deriveFromSsrInitialState(initialState)?.session : void 0;
	}, [initialState]);
	return useSyncExternalStore(useCallback((callback) => clerk.addListener(callback, { skipInitialEmit: true }), [clerk]), useCallback(() => {
		if (!clerk.loaded || !clerk.__internal_lastEmittedResources) return getInitialState();
		return clerk.__internal_lastEmittedResources.session;
	}, [clerk, getInitialState]), getInitialState);
}

//#endregion
//#region src/react/hooks/useClerk.ts
/**
* > [!WARNING]
* > This hook should only be used for advanced use cases, such as building a completely custom OAuth flow or as an escape hatch to access to the `Clerk` object.
*
* The `useClerk()` hook provides access to the [`Clerk`](https://clerk.com/docs/reference/objects/clerk) object, allowing you to build alternatives to any Clerk Component.
*
* @function
*
* @returns The `useClerk()` hook returns the `Clerk` object, which includes all the methods and properties listed in the [`Clerk` reference](https://clerk.com/docs/reference/objects/clerk).
*
* @example
*
* The following example uses the `useClerk()` hook to access the `clerk` object. The `clerk` object is used to call the [`openSignIn()`](https://clerk.com/docs/reference/objects/clerk#sign-in) method to open the sign-in modal.
*
* <Tabs items='React,Next.js'>
* <Tab>
*
* ```tsx {{ filename: 'src/Home.tsx' }}
* import { useClerk } from '@clerk/react'
*
* export default function Home() {
*   const clerk = useClerk()
*
*   return <button onClick={() => clerk.openSignIn({})}>Sign in</button>
* }
* ```
*
* </Tab>
* <Tab>
*
* {@include ../../../docs/use-clerk.md#nextjs-01}
*
* </Tab>
* </Tabs>
*/
const useClerk = () => {
	useAssertWrappedByClerkProvider("useClerk");
	return useClerkInstanceContext();
};

//#endregion
//#region src/react/hooks/useAttemptToEnableOrganizations.ts
/**
* Attempts to enable the organizations environment setting for a given caller
*
* @internal
*/
function useAttemptToEnableOrganizations(caller) {
	const clerk = useClerk();
	const hasAttempted = useRef(false);
	useEffect(() => {
		if (hasAttempted.current) return;
		hasAttempted.current = true;
		clerk.__internal_attemptToEnableEnvironmentSetting?.({
			for: "organizations",
			caller
		});
	}, [clerk, caller]);
}

//#endregion
//#region src/react/hooks/useOrganization.tsx
const undefinedPaginatedResource$1 = {
	data: void 0,
	count: void 0,
	error: void 0,
	isLoading: false,
	isFetching: false,
	isError: false,
	page: void 0,
	pageCount: void 0,
	fetchPage: void 0,
	fetchNext: void 0,
	fetchPrevious: void 0,
	hasNextPage: false,
	hasPreviousPage: false,
	revalidate: void 0,
	setData: void 0
};
/**
* The `useOrganization()` hook retrieves attributes of the currently Active Organization.
*
* @example
* ### Expand and paginate attributes
*
* To keep network usage to a minimum, developers are required to opt-in by specifying which resource they need to fetch and paginate through. By default, the `memberships`, `invitations`, `membershipRequests`, and `domains` attributes are not populated. You must pass `true` or an object with the desired properties to fetch and paginate the data.
*
* ```tsx
* // invitations.data will never be populated.
* const { invitations } = useOrganization()
*
* // Use default values to fetch invitations, such as initialPage = 1 and pageSize = 10
* const { invitations } = useOrganization({
*   invitations: true,
* })
*
* // Pass your own values to fetch invitations
* const { invitations } = useOrganization({
*   invitations: {
*     pageSize: 20,
*     initialPage: 2, // skips the first page
*   },
* })
*
* // Aggregate pages in order to render an infinite list
* const { invitations } = useOrganization({
*   invitations: {
*     infinite: true,
*   },
* })
* ```
*
* @example
* ### Infinite pagination
*
* The following example demonstrates how to use the `infinite` property to fetch and append new data to the existing list. The `memberships` attribute will be populated with the first page of the Organization's memberships. When the "Load more" button is clicked, the `fetchNext` helper function will be called to append the next page of memberships to the list.
*
* ```tsx
* import { useOrganization } from '@clerk/react'
*
* export default function MemberList() {
*   const { memberships } = useOrganization({
*     memberships: {
*       infinite: true, // Append new data to the existing list
*       keepPreviousData: true, // Persist the cached data until the new data has been fetched
*     },
*   })
*
*   if (!memberships) {
*     // Handle loading state
*     return null
*   }
*
*   return (
*     <div>
*       <h2>Organization members</h2>
*       <ul>
*         {memberships.data?.map((membership) => (
*           <li key={membership.id}>
*             {membership.publicUserData.firstName} {membership.publicUserData.lastName} <
*             {membership.publicUserData.identifier}> :: {membership.role}
*           </li>
*         ))}
*       </ul>
*
*       <button
*         disabled={!memberships.hasNextPage} // Disable the button if there are no more available pages to be fetched
*         onClick={memberships.fetchNext}
*       >
*         Load more
*       </button>
*     </div>
*   )
* }
* ```
*
* @example
* ### Simple pagination
*
* The following example demonstrates how to use the `fetchPrevious` and `fetchNext` helper functions to paginate through the data. The `memberships` attribute will be populated with the first page of the Organization's memberships. When the "Previous page" or "Next page" button is clicked, the `fetchPrevious` or `fetchNext` helper function will be called to fetch the previous or next page of memberships.
*
* Notice the difference between this example's pagination and the infinite pagination example above.
*
* ```tsx
* import { useOrganization } from '@clerk/react'
*
* export default function MemberList() {
*   const { memberships } = useOrganization({
*     memberships: {
*       keepPreviousData: true, // Persist the cached data until the new data has been fetched
*     },
*   })
*
*   if (!memberships) {
*     // Handle loading state
*     return null
*   }
*
*   return (
*     <div>
*       <h2>Organization members</h2>
*       <ul>
*         {memberships.data?.map((membership) => (
*           <li key={membership.id}>
*             {membership.publicUserData.firstName} {membership.publicUserData.lastName} <
*             {membership.publicUserData.identifier}> :: {membership.role}
*           </li>
*         ))}
*       </ul>
*
*       <button disabled={!memberships.hasPreviousPage} onClick={memberships.fetchPrevious}>
*         Previous page
*       </button>
*
*       <button disabled={!memberships.hasNextPage} onClick={memberships.fetchNext}>
*         Next page
*       </button>
*     </div>
*   )
* }
* ```
*/
function useOrganization(params) {
	const { domains: domainListParams, membershipRequests: membershipRequestsListParams, memberships: membersListParams, invitations: invitationsListParams } = params || {};
	useAssertWrappedByClerkProvider("useOrganization");
	useAttemptToEnableOrganizations("useOrganization");
	const organization = useOrganizationBase();
	const session = useSessionBase();
	const domainSafeValues = useWithSafeValues(domainListParams, {
		initialPage: 1,
		pageSize: 10,
		keepPreviousData: false,
		infinite: false,
		enrollmentMode: void 0
	});
	const membershipRequestSafeValues = useWithSafeValues(membershipRequestsListParams, {
		initialPage: 1,
		pageSize: 10,
		status: "pending",
		keepPreviousData: false,
		infinite: false
	});
	const membersSafeValues = useWithSafeValues(membersListParams, {
		initialPage: 1,
		pageSize: 10,
		role: void 0,
		keepPreviousData: false,
		infinite: false,
		query: void 0
	});
	const invitationsSafeValues = useWithSafeValues(invitationsListParams, {
		initialPage: 1,
		pageSize: 10,
		status: ["pending"],
		keepPreviousData: false,
		infinite: false
	});
	const clerk = useClerkInstanceContext();
	clerk.telemetry?.record(eventMethodCalled("useOrganization"));
	const domainParams = typeof domainListParams === "undefined" ? void 0 : {
		initialPage: domainSafeValues.initialPage,
		pageSize: domainSafeValues.pageSize,
		enrollmentMode: domainSafeValues.enrollmentMode
	};
	const membershipRequestParams = typeof membershipRequestsListParams === "undefined" ? void 0 : {
		initialPage: membershipRequestSafeValues.initialPage,
		pageSize: membershipRequestSafeValues.pageSize,
		status: membershipRequestSafeValues.status
	};
	const membersParams = typeof membersListParams === "undefined" ? void 0 : {
		initialPage: membersSafeValues.initialPage,
		pageSize: membersSafeValues.pageSize,
		role: membersSafeValues.role,
		query: membersSafeValues.query
	};
	const invitationsParams = typeof invitationsListParams === "undefined" ? void 0 : {
		initialPage: invitationsSafeValues.initialPage,
		pageSize: invitationsSafeValues.pageSize,
		status: invitationsSafeValues.status
	};
	const domains = usePagesOrInfinite({
		fetcher: organization?.getDomains,
		config: {
			keepPreviousData: domainSafeValues.keepPreviousData,
			infinite: domainSafeValues.infinite,
			enabled: !!domainParams,
			isSignedIn: organization !== null,
			initialPage: domainSafeValues.initialPage,
			pageSize: domainSafeValues.pageSize
		},
		keys: createCacheKeys({
			stablePrefix: STABLE_KEYS.DOMAINS_KEY,
			authenticated: true,
			tracked: { organizationId: organization?.id },
			untracked: { args: domainParams }
		})
	});
	const membershipRequests = usePagesOrInfinite({
		fetcher: organization?.getMembershipRequests,
		config: {
			keepPreviousData: membershipRequestSafeValues.keepPreviousData,
			infinite: membershipRequestSafeValues.infinite,
			enabled: !!membershipRequestParams,
			isSignedIn: organization !== null,
			initialPage: membershipRequestSafeValues.initialPage,
			pageSize: membershipRequestSafeValues.pageSize
		},
		keys: createCacheKeys({
			stablePrefix: STABLE_KEYS.MEMBERSHIP_REQUESTS_KEY,
			authenticated: true,
			tracked: { organizationId: organization?.id },
			untracked: { args: membershipRequestParams }
		})
	});
	const memberships = usePagesOrInfinite({
		fetcher: organization?.getMemberships,
		config: {
			keepPreviousData: membersSafeValues.keepPreviousData,
			infinite: membersSafeValues.infinite,
			enabled: !!membersParams,
			isSignedIn: organization !== null,
			initialPage: membersSafeValues.initialPage,
			pageSize: membersSafeValues.pageSize
		},
		keys: createCacheKeys({
			stablePrefix: STABLE_KEYS.MEMBERSHIPS_KEY,
			authenticated: true,
			tracked: { organizationId: organization?.id },
			untracked: { args: membersParams }
		})
	});
	const invitations = usePagesOrInfinite({
		fetcher: organization?.getInvitations,
		config: {
			keepPreviousData: invitationsSafeValues.keepPreviousData,
			infinite: invitationsSafeValues.infinite,
			enabled: !!invitationsParams,
			isSignedIn: organization !== null,
			initialPage: invitationsSafeValues.initialPage,
			pageSize: invitationsSafeValues.pageSize
		},
		keys: createCacheKeys({
			stablePrefix: STABLE_KEYS.INVITATIONS_KEY,
			authenticated: true,
			tracked: { organizationId: organization?.id },
			untracked: { args: invitationsParams }
		})
	});
	if (organization === void 0) return {
		isLoaded: false,
		organization: void 0,
		membership: void 0,
		domains: undefinedPaginatedResource$1,
		membershipRequests: undefinedPaginatedResource$1,
		memberships: undefinedPaginatedResource$1,
		invitations: undefinedPaginatedResource$1
	};
	if (organization === null) return {
		isLoaded: true,
		organization: null,
		membership: null,
		domains: null,
		membershipRequests: null,
		memberships: null,
		invitations: null
	};
	/** In SSR context we include only the organization object when loadOrg is set to true. */
	if (!clerk.loaded && organization) return {
		isLoaded: true,
		organization,
		membership: void 0,
		domains: undefinedPaginatedResource$1,
		membershipRequests: undefinedPaginatedResource$1,
		memberships: undefinedPaginatedResource$1,
		invitations: undefinedPaginatedResource$1
	};
	return {
		isLoaded: clerk.loaded,
		organization,
		membership: getCurrentOrganizationMembership(session.user.organizationMemberships, organization.id),
		domains,
		membershipRequests,
		memberships,
		invitations
	};
}

//#endregion
//#region src/react/hooks/useOrganizationCreationDefaults.shared.ts
function useOrganizationCreationDefaultsCacheKeys(params) {
	const { userId } = params;
	return useMemo(() => {
		return createCacheKeys({
			stablePrefix: STABLE_KEYS.ORGANIZATION_CREATION_DEFAULTS_KEY,
			authenticated: Boolean(userId),
			tracked: { userId: userId ?? null },
			untracked: { args: {} }
		});
	}, [userId]);
}

//#endregion
//#region src/react/hooks/useOrganizationCreationDefaults.tsx
const HOOK_NAME$1 = "useOrganizationCreationDefaults";
/**
* The `useOrganizationCreationDefaults()` hook retrieves the organization creation defaults for the current user.
*
* @example
* ### Basic usage
*
* ```tsx
* import { useOrganizationCreationDefaults } from '@clerk/clerk-react'
*
* export default function CreateOrganizationForm() {
*   const { data, isLoading } = useOrganizationCreationDefaults()
*
*   if (isLoading) return <div>Loading...</div>
*
*   return (
*     <form>
*       <input defaultValue={data?.form.name} placeholder="Organization name" />
*       <input defaultValue={data?.form.slug} placeholder="Slug" />
*       <button type="submit">Create</button>
*     </form>
*   )
* }
* ```
*/
function useOrganizationCreationDefaults(params = {}) {
	useAssertWrappedByClerkProvider(HOOK_NAME$1);
	const { keepPreviousData = true, enabled = true } = params;
	const clerk = useClerkInstanceContext();
	const user = useUserBase();
	const featureEnabled = clerk.__internal_environment?.organizationSettings?.organizationCreationDefaults?.enabled ?? false;
	clerk.telemetry?.record(eventMethodCalled(HOOK_NAME$1));
	const { queryKey } = useOrganizationCreationDefaultsCacheKeys({ userId: user?.id ?? null });
	const queryEnabled = Boolean(user) && enabled && featureEnabled && clerk.loaded;
	const query = useClerkQuery({
		queryKey,
		queryFn: user?.getOrganizationCreationDefaults,
		enabled: queryEnabled,
		placeholderData: defineKeepPreviousDataFn(keepPreviousData)
	});
	return {
		data: query.data,
		error: query.error ?? null,
		isLoading: query.isLoading,
		isFetching: query.isFetching
	};
}

//#endregion
//#region src/react/hooks/useOrganizationList.tsx
const undefinedPaginatedResource = {
	data: void 0,
	count: void 0,
	error: void 0,
	isLoading: false,
	isFetching: false,
	isError: false,
	page: void 0,
	pageCount: void 0,
	fetchPage: void 0,
	fetchNext: void 0,
	fetchPrevious: void 0,
	hasNextPage: false,
	hasPreviousPage: false,
	revalidate: void 0,
	setData: void 0
};
/**
* The `useOrganizationList()` hook provides access to the current user's organization memberships, invitations, and suggestions. It also includes methods for creating new organizations and managing the active organization.
*
* @example
* ### Expanding and paginating attributes
*
* To keep network usage to a minimum, developers are required to opt-in by specifying which resource they need to fetch and paginate through. So by default, the `userMemberships`, `userInvitations`, and `userSuggestions` attributes are not populated. You must pass true or an object with the desired properties to fetch and paginate the data.
*
* ```tsx
* // userMemberships.data will never be populated
* const { userMemberships } = useOrganizationList()
*
* // Use default values to fetch userMemberships, such as initialPage = 1 and pageSize = 10
* const { userMemberships } = useOrganizationList({
*   userMemberships: true,
* })
*
* // Pass your own values to fetch userMemberships
* const { userMemberships } = useOrganizationList({
*   userMemberships: {
*     pageSize: 20,
*     initialPage: 2, // skips the first page
*   },
* })
*
* // Aggregate pages in order to render an infinite list
* const { userMemberships } = useOrganizationList({
*   userMemberships: {
*     infinite: true,
*   },
* })
* ```
*
* @example
* ### Infinite pagination
*
* The following example demonstrates how to use the `infinite` property to fetch and append new data to the existing list. The `userMemberships` attribute will be populated with the first page of the user's Organization memberships. When the "Load more" button is clicked, the `fetchNext` helper function will be called to append the next page of memberships to the list.
*
* ```tsx {{ filename: 'src/components/JoinedOrganizations.tsx' }}
* import { useOrganizationList } from '@clerk/react'
* import React from 'react'
*
* const JoinedOrganizations = () => {
*   const { isLoaded, setActive, userMemberships } = useOrganizationList({
*     userMemberships: {
*       infinite: true,
*     },
*   })
*
*   if (!isLoaded) {
*     return <>Loading</>
*   }
*
*   return (
*     <>
*       <ul>
*         {userMemberships.data?.map((mem) => (
*           <li key={mem.id}>
*             <span>{mem.organization.name}</span>
*             <button onClick={() => setActive({ organization: mem.organization.id })}>Select</button>
*           </li>
*         ))}
*       </ul>
*
*       <button disabled={!userMemberships.hasNextPage} onClick={() => userMemberships.fetchNext()}>
*         Load more
*       </button>
*     </>
*   )
* }
*
* export default JoinedOrganizations
* ```
*
* @example
* ### Simple pagination
*
* The following example demonstrates how to use the `fetchPrevious` and `fetchNext` helper functions to paginate through the data. The `userInvitations` attribute will be populated with the first page of invitations. When the "Previous page" or "Next page" button is clicked, the `fetchPrevious` or `fetchNext` helper function will be called to fetch the previous or next page of invitations.
*
* Notice the difference between this example's pagination and the infinite pagination example above.
*
* ```tsx {{ filename: 'src/components/UserInvitationsTable.tsx' }}
* import { useOrganizationList } from '@clerk/react'
* import React from 'react'
*
* const UserInvitationsTable = () => {
*   const { isLoaded, userInvitations } = useOrganizationList({
*     userInvitations: {
*       infinite: true,
*       keepPreviousData: true,
*     },
*   })
*
*   if (!isLoaded || userInvitations.isLoading) {
*     return <>Loading</>
*   }
*
*   return (
*     <>
*       <table>
*         <thead>
*           <tr>
*             <th>Email</th>
*             <th>Org name</th>
*           </tr>
*         </thead>
*
*         <tbody>
*           {userInvitations.data?.map((inv) => (
*             <tr key={inv.id}>
*               <th>{inv.emailAddress}</th>
*               <th>{inv.publicOrganizationData.name}</th>
*             </tr>
*           ))}
*         </tbody>
*       </table>
*
*       <button disabled={!userInvitations.hasPreviousPage} onClick={userInvitations.fetchPrevious}>
*         Prev
*       </button>
*       <button disabled={!userInvitations.hasNextPage} onClick={userInvitations.fetchNext}>
*         Next
*       </button>
*     </>
*   )
* }
*
* export default UserInvitationsTable
* ```
*/
function useOrganizationList(params) {
	const { userMemberships, userInvitations, userSuggestions } = params || {};
	useAssertWrappedByClerkProvider("useOrganizationList");
	useAttemptToEnableOrganizations("useOrganizationList");
	const userMembershipsSafeValues = useWithSafeValues(userMemberships, {
		initialPage: 1,
		pageSize: 10,
		keepPreviousData: false,
		infinite: false
	});
	const userInvitationsSafeValues = useWithSafeValues(userInvitations, {
		initialPage: 1,
		pageSize: 10,
		status: "pending",
		keepPreviousData: false,
		infinite: false
	});
	const userSuggestionsSafeValues = useWithSafeValues(userSuggestions, {
		initialPage: 1,
		pageSize: 10,
		status: "pending",
		keepPreviousData: false,
		infinite: false
	});
	const clerk = useClerkInstanceContext();
	const user = useUserBase();
	clerk.telemetry?.record(eventMethodCalled("useOrganizationList"));
	const userMembershipsParams = typeof userMemberships === "undefined" ? void 0 : {
		initialPage: userMembershipsSafeValues.initialPage,
		pageSize: userMembershipsSafeValues.pageSize
	};
	const userInvitationsParams = typeof userInvitations === "undefined" ? void 0 : {
		initialPage: userInvitationsSafeValues.initialPage,
		pageSize: userInvitationsSafeValues.pageSize,
		status: userInvitationsSafeValues.status
	};
	const userSuggestionsParams = typeof userSuggestions === "undefined" ? void 0 : {
		initialPage: userSuggestionsSafeValues.initialPage,
		pageSize: userSuggestionsSafeValues.pageSize,
		status: userSuggestionsSafeValues.status
	};
	const isClerkLoaded = !!(clerk.loaded && user);
	const memberships = usePagesOrInfinite({
		fetcher: user?.getOrganizationMemberships,
		config: {
			keepPreviousData: userMembershipsSafeValues.keepPreviousData,
			infinite: userMembershipsSafeValues.infinite,
			enabled: !!userMembershipsParams,
			isSignedIn: user !== null,
			initialPage: userMembershipsSafeValues.initialPage,
			pageSize: userMembershipsSafeValues.pageSize
		},
		keys: createCacheKeys({
			stablePrefix: STABLE_KEYS.USER_MEMBERSHIPS_KEY,
			authenticated: true,
			tracked: { userId: user?.id },
			untracked: { args: userMembershipsParams }
		})
	});
	const invitations = usePagesOrInfinite({
		fetcher: user?.getOrganizationInvitations,
		config: {
			keepPreviousData: userInvitationsSafeValues.keepPreviousData,
			infinite: userInvitationsSafeValues.infinite,
			enabled: !!userInvitationsParams,
			isSignedIn: user !== null,
			initialPage: userInvitationsSafeValues.initialPage,
			pageSize: userInvitationsSafeValues.pageSize
		},
		keys: createCacheKeys({
			stablePrefix: STABLE_KEYS.USER_INVITATIONS_KEY,
			authenticated: true,
			tracked: { userId: user?.id },
			untracked: { args: userInvitationsParams }
		})
	});
	const suggestions = usePagesOrInfinite({
		fetcher: user?.getOrganizationSuggestions,
		config: {
			keepPreviousData: userSuggestionsSafeValues.keepPreviousData,
			infinite: userSuggestionsSafeValues.infinite,
			enabled: !!userSuggestionsParams,
			isSignedIn: user !== null,
			initialPage: userSuggestionsSafeValues.initialPage,
			pageSize: userSuggestionsSafeValues.pageSize
		},
		keys: createCacheKeys({
			stablePrefix: STABLE_KEYS.USER_SUGGESTIONS_KEY,
			authenticated: true,
			tracked: { userId: user?.id },
			untracked: { args: userSuggestionsParams }
		})
	});
	if (!isClerkLoaded) return {
		isLoaded: false,
		createOrganization: void 0,
		setActive: void 0,
		userMemberships: undefinedPaginatedResource,
		userInvitations: undefinedPaginatedResource,
		userSuggestions: undefinedPaginatedResource
	};
	return {
		isLoaded: isClerkLoaded,
		setActive: clerk.setActive,
		createOrganization: clerk.createOrganization,
		userMemberships: memberships,
		userInvitations: invitations,
		userSuggestions: suggestions
	};
}

//#endregion
//#region src/react/hooks/useSafeLayoutEffect.tsx
/**
* @internal
*/
const useSafeLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

//#endregion
//#region src/react/hooks/useSession.ts
const hookName$2 = `useSession`;
/**
* The `useSession()` hook provides access to the current user's [`Session`](https://clerk.com/docs/reference/objects/session) object, as well as helpers for setting the active session.
*
* @unionReturnHeadings
* ["Loading", "Signed out", "Signed in"]
*
* @function
*
* @param [options] - An object containing options for the `useSession()` hook.
* @example
* ### Access the `Session` object
*
* The following example uses the `useSession()` hook to access the `Session` object, which has the `lastActiveAt` property. The `lastActiveAt` property is a `Date` object used to show the time the session was last active.
*
* <Tabs items='React,Next.js'>
* <Tab>
*
* ```tsx {{ filename: 'src/Home.tsx' }}
* import { useSession } from '@clerk/react'
*
* export default function Home() {
*   const { isLoaded, session, isSignedIn } = useSession()
*
*   if (!isLoaded) {
*     // Handle loading state
*     return null
*   }
*   if (!isSignedIn) {
*     // Handle signed out state
*     return null
*   }
*
*   return (
*     <div>
*       <p>This session has been active since {session.lastActiveAt.toLocaleString()}</p>
*     </div>
*   )
* }
* ```
*
* </Tab>
* <Tab>
*
* {@include ../../../docs/use-session.md#nextjs-01}
*
* </Tab>
* </Tabs>
*/
const useSession = () => {
	useAssertWrappedByClerkProvider(hookName$2);
	const session = useSessionBase();
	const clerk = useClerkInstanceContext();
	clerk.telemetry?.record(eventMethodCalled(hookName$2));
	if (session === void 0) return {
		isLoaded: false,
		isSignedIn: void 0,
		session: void 0
	};
	if (session === null) return {
		isLoaded: true,
		isSignedIn: false,
		session: null
	};
	return {
		isLoaded: true,
		isSignedIn: clerk.isSignedIn,
		session
	};
};

//#endregion
//#region src/react/hooks/base/useClientBase.ts
const initialSnapshot = void 0;
const getInitialSnapshot = () => initialSnapshot;
function useClientBase() {
	const clerk = useClerkInstanceContext();
	return useSyncExternalStore(useCallback((callback) => clerk.addListener(callback, { skipInitialEmit: true }), [clerk]), useCallback(() => {
		if (!clerk.loaded || !clerk.__internal_lastEmittedResources) return initialSnapshot;
		return clerk.__internal_lastEmittedResources.client;
	}, [clerk]), getInitialSnapshot);
}

//#endregion
//#region src/react/hooks/useSessionList.ts
const hookName$1 = "useSessionList";
/**
* The `useSessionList()` hook returns an array of [`Session`](https://clerk.com/docs/reference/objects/session) objects that have been registered on the client device.
*
* @unionReturnHeadings
* ["Initialization", "Loaded"]
*
* @function
*
* @example
* ### Get a list of sessions
*
* The following example uses `useSessionList()` to get a list of sessions that have been registered on the client device. The `sessions` property is used to show the number of times the user has visited the page.
*
* <Tabs items='React,Next.js'>
* <Tab>
*
* ```tsx {{ filename: 'src/Home.tsx' }}
* import { useSessionList } from '@clerk/react'
*
* export default function Home() {
*   const { isLoaded, sessions } = useSessionList()
*
*   if (!isLoaded) {
*     // Handle loading state
*     return null
*   }
*
*   return (
*     <div>
*       <p>Welcome back. You've been here {sessions.length} times before.</p>
*     </div>
*   )
* }
* ```
*
* </Tab>
* <Tab>
*
* {@include ../../../docs/use-session-list.md#nextjs-01}
*
* </Tab>
* </Tabs>
*/
const useSessionList = () => {
	useAssertWrappedByClerkProvider(hookName$1);
	const isomorphicClerk = useClerkInstanceContext();
	const client = useClientBase();
	useClerkInstanceContext().telemetry?.record(eventMethodCalled(hookName$1));
	if (!client) return {
		isLoaded: false,
		sessions: void 0,
		setActive: void 0
	};
	return {
		isLoaded: true,
		sessions: client.sessions,
		setActive: isomorphicClerk.setActive
	};
};

//#endregion
//#region src/react/hooks/useUser.ts
const hookName = "useUser";
/**
* The `useUser()` hook provides access to the current user's [`User`](https://clerk.com/docs/reference/objects/user) object, which contains all the data for a single user in your application and provides methods to manage their account. This hook also allows you to check if the user is signed in and if Clerk has loaded.
*
* @unionReturnHeadings
* ["Loading", "Signed out", "Signed in"]
*
* @example
* ### Get the current user
*
* The following example uses the `useUser()` hook to access the [`User`](https://clerk.com/docs/reference/objects/user) object, which contains the current user's data such as their full name. The `isLoaded` and `isSignedIn` properties are used to handle the loading state and to check if the user is signed in, respectively.
*
* ```tsx {{ filename: 'src/Example.tsx' }}
* import { useUser } from '@clerk/react'
*
* export default function Example() {
*   const { isSignedIn, user, isLoaded } = useUser()
*
*   if (!isLoaded) {
*     return <div>Loading...</div>
*   }
*
*   if (!isSignedIn) {
*     return <div>Sign in to view this page</div>
*   }
*
*   return <div>Hello {user.firstName}!</div>
* }
* ```
*
* @example
* ### Update user data
*
* The following example uses the `useUser()` hook to access the [`User`](https://clerk.com/docs/reference/objects/user) object, which calls the [`update()`](https://clerk.com/docs/reference/objects/user#update) method to update the current user's information.
*
* <Tabs items='React,Next.js'>
* <Tab>
*
* ```tsx {{ filename: 'src/Home.tsx' }}
* import { useUser } from '@clerk/react'
*
* export default function Home() {
*   const { isSignedIn, isLoaded, user } = useUser()
*
*   if (!isLoaded) {
*     // Handle loading state
*     return null
*   }
*
*   if (!isSignedIn) return null
*
*   const updateUser = async () => {
*     await user.update({
*       firstName: 'John',
*       lastName: 'Doe',
*     })
*   }
*
*   return (
*     <>
*       <button onClick={updateUser}>Update your name</button>
*       <p>user.firstName: {user.firstName}</p>
*       <p>user.lastName: {user.lastName}</p>
*     </>
*   )
* }
* ```
* </Tab>
* <Tab>
*
* {@include ../../../docs/use-user.md#nextjs-01}
*
* </Tab>
* </Tabs>
*
* @example
* ### Reload user data
*
* The following example uses the `useUser()` hook to access the [`User`](https://clerk.com/docs/reference/objects/user) object, which calls the [`reload()`](https://clerk.com/docs/reference/objects/user#reload) method to get the latest user's information.
*
* <Tabs items='React,Next.js'>
* <Tab>
*
* ```tsx {{ filename: 'src/Home.tsx' }}
* import { useUser } from '@clerk/react'
*
* export default function Home() {
*   const { isSignedIn, isLoaded, user } = useUser();
*
*   if (!isLoaded) {
*     // Handle loading state
*     return null;
*   }
*
*   if (!isSignedIn) return null;
*
*   const updateUser = async () => {
*     // Update data via an API endpoint
*     const updateMetadata = await fetch('/api/updateMetadata', {
*       method: 'POST',
*       body: JSON.stringify({
*         role: 'admin'
*       })
*     });
*
*     // Check if the update was successful
*     if ((await updateMetadata.json()).message !== 'success') {
*       throw new Error('Error updating');
*     }
*
*     // If the update was successful, reload the user data
*     await user.reload();
*   };
*
*   return (
*     <>
*       <button onClick={updateUser}>Update your metadata</button>
*       <p>user role: {user.publicMetadata.role}</p>
*     </>
*   );
* }
* ```
*
* </Tab>
* <Tab>
*
* {@include ../../../docs/use-user.md#nextjs-02}
*
* </Tab>
* </Tabs>
*/
function useUser() {
	useAssertWrappedByClerkProvider(hookName);
	const user = useUserBase();
	useClerkInstanceContext().telemetry?.record(eventMethodCalled(hookName));
	if (user === void 0) return {
		isLoaded: false,
		isSignedIn: void 0,
		user: void 0
	};
	if (user === null) return {
		isLoaded: true,
		isSignedIn: false,
		user: null
	};
	return {
		isLoaded: true,
		isSignedIn: true,
		user
	};
}

//#endregion
//#region src/react/hooks/useDeepEqualMemo.ts
const useDeepEqualMemoize = (value) => {
	const ref = React.useRef(value);
	if (!dequal(value, ref.current)) ref.current = value;
	return React.useMemo(() => ref.current, [ref.current]);
};
/**
* @internal
*/
const useDeepEqualMemo = (factory, dependencyArray) => {
	return React.useMemo(factory, useDeepEqualMemoize(dependencyArray));
};
/**
* @internal
*/
const isDeeplyEqual = dequal;

//#endregion
//#region src/react/hooks/useReverification.ts
const CLERK_API_REVERIFICATION_ERROR_CODE = "session_reverification_required";
/**
*
*/
async function resolveResult(result) {
	try {
		const r = await result;
		if (r instanceof Response) return r.json();
		return r;
	} catch (e) {
		if (isClerkAPIResponseError(e) && e.errors.find(({ code }) => code === CLERK_API_REVERIFICATION_ERROR_CODE)) return reverificationError();
		throw e;
	}
}
/**
*
*/
function createReverificationHandler(params) {
	/**
	*
	*/
	function assertReverification(fetcher) {
		return (async (...args) => {
			let result = await resolveResult(fetcher(...args));
			if (isReverificationHint(result)) {
				/**
				* Create a promise
				*/
				const resolvers = createDeferredPromise();
				const isValidMetadata = validateReverificationConfig(result.clerk_error.metadata?.reverification);
				const level = isValidMetadata ? isValidMetadata().level : void 0;
				const cancel = () => {
					resolvers.reject(new ClerkRuntimeError("User cancelled attempted verification", { code: "reverification_cancelled" }));
				};
				const complete = () => {
					resolvers.resolve(true);
				};
				if (params.onNeedsReverification === void 0)
 /**
				* On success resolve the pending promise
				* On cancel reject the pending promise
				*/
				params.openUIComponent?.({
					level,
					afterVerification: complete,
					afterVerificationCancelled: cancel
				});
				else params.onNeedsReverification({
					cancel,
					complete,
					level
				});
				/**
				* Wait until the promise from above have been resolved or rejected
				*/
				await resolvers.promise;
				/**
				* After the promise resolved successfully try the original request one more time
				*/
				result = await resolveResult(fetcher(...args));
			}
			return result;
		});
	}
	return assertReverification;
}
/**
* > [!WARNING]
* >
* > Depending on the SDK you're using, this feature requires `@clerk/nextjs@6.12.7` or later, `@clerk/react@5.25.1` or later, and `@clerk/clerk-js@5.57.1` or later.
*
* The `useReverification()` hook is used to handle a session's reverification flow. If a request requires reverification, a modal will display, prompting the user to verify their credentials. Upon successful verification, the original request will automatically retry.
*
* @function
*
* @returns The `useReverification()` hook returns an array with the "enhanced" fetcher.
*
* @example
* ### Handle cancellation of the reverification process
*
* The following example demonstrates how to handle scenarios where a user cancels the reverification flow, such as closing the modal, which might result in `myData` being `null`.
*
* In the following example, `myFetcher` would be a function in your backend that fetches data from the route that requires reverification. See the [guide on how to require reverification](https://clerk.com/docs/guides/secure/reverification) for more information.
*
* ```tsx {{ filename: 'src/components/MyButton.tsx' }}
* import { useReverification } from '@clerk/react'
* import { isReverificationCancelledError } from '@clerk/react/error'
*
* type MyData = {
*   balance: number
* }
*
* export function MyButton() {
*   const fetchMyData = () => fetch('/api/balance').then(res=> res.json() as Promise<MyData>)
*   const enhancedFetcher = useReverification(fetchMyData);
*
*   const handleClick = async () => {
*     try {
*       const myData = await enhancedFetcher()
*       //     ^ is types as `MyData`
*     } catch (e) {
*       // Handle error returned from the fetcher here
*
*       // You can also handle cancellation with the following
*       if (isReverificationCancelledError(err)) {
*         // Handle the cancellation error here
*       }
*     }
*   }
*
*   return <button onClick={handleClick}>Update User</button>
* }
* ```
*/
const useReverification = (fetcher, options) => {
	const { __internal_openReverification, telemetry } = useClerk();
	const fetcherRef = useRef(fetcher);
	const optionsRef = useRef(options);
	telemetry?.record(eventMethodCalled("useReverification", { onNeedsReverification: Boolean(options?.onNeedsReverification) }));
	useSafeLayoutEffect(() => {
		fetcherRef.current = fetcher;
		optionsRef.current = options;
	});
	return useCallback((...args) => {
		return createReverificationHandler({
			openUIComponent: __internal_openReverification,
			telemetry,
			...optionsRef.current
		})(fetcherRef.current)(...args);
	}, [__internal_openReverification, telemetry]);
};

//#endregion
//#region src/react/hooks/useBillingIsEnabled.ts
/**
* @internal
*/
function useBillingIsEnabled(params) {
	const clerk = useClerkInstanceContext();
	const enabledFromParam = params?.enabled ?? true;
	const environment = clerk.__internal_environment;
	const user = useUserBase();
	const organization = useOrganizationBase();
	const userBillingEnabled = environment?.commerceSettings.billing.user.enabled;
	const orgBillingEnabled = environment?.commerceSettings.billing.organization.enabled;
	const billingEnabled = params?.for === "organization" ? orgBillingEnabled : params?.for === "user" ? userBillingEnabled : userBillingEnabled || orgBillingEnabled;
	const isOrganization = params?.for === "organization";
	const requireUserAndOrganizationWhenAuthenticated = params?.authenticated ?? true ? (isOrganization ? Boolean(organization?.id) : true) && Boolean(user?.id) : true;
	return billingEnabled && enabledFromParam && clerk.loaded && requireUserAndOrganizationWhenAuthenticated;
}

//#endregion
//#region src/react/hooks/createBillingPaginatedHook.tsx
/**
* A hook factory that creates paginated data fetching hooks for commerce-related resources.
* It provides a standardized way to create hooks that can fetch either user or Organization resources
* with built-in pagination support.
*
* The generated hooks handle:
* - Clerk authentication context
* - Resource-specific data fetching
* - Pagination (both traditional and infinite scroll)
* - Telemetry tracking
* - Type safety for the specific resource.
*
* @internal
*/
function createBillingPaginatedHook({ hookName: hookName$3, resourceType, useFetcher, options }) {
	return function useBillingHook(params) {
		const { for: _for, enabled: externalEnabled,...paginationParams } = params || {};
		const safeFor = _for || "user";
		useAssertWrappedByClerkProvider(hookName$3);
		const fetchFn = useFetcher(safeFor);
		const safeValues = useWithSafeValues(paginationParams, {
			initialPage: 1,
			pageSize: 10,
			keepPreviousData: false,
			infinite: false,
			__experimental_mode: void 0
		});
		const clerk = useClerkInstanceContext();
		const user = useUserBase();
		const organization = useOrganizationBase();
		clerk.telemetry?.record(eventMethodCalled(hookName$3));
		const isForOrganization = safeFor === "organization";
		const billingEnabled = useBillingIsEnabled({
			for: safeFor,
			enabled: externalEnabled,
			authenticated: !options?.unauthenticated
		});
		const hookParams = typeof paginationParams === "undefined" ? void 0 : {
			initialPage: safeValues.initialPage,
			pageSize: safeValues.pageSize,
			...options?.unauthenticated ? {} : isForOrganization ? { orgId: organization?.id } : {}
		};
		const isEnabled = !!hookParams && clerk.loaded && !!billingEnabled;
		return usePagesOrInfinite({
			fetcher: fetchFn,
			config: {
				keepPreviousData: safeValues.keepPreviousData,
				infinite: safeValues.infinite,
				enabled: isEnabled,
				...options?.unauthenticated ? {} : { isSignedIn: user !== null },
				__experimental_mode: safeValues.__experimental_mode,
				initialPage: safeValues.initialPage,
				pageSize: safeValues.pageSize
			},
			keys: createCacheKeys({
				stablePrefix: resourceType,
				authenticated: !options?.unauthenticated,
				tracked: options?.unauthenticated ? { for: safeFor } : {
					userId: user?.id,
					...isForOrganization ? { orgId: organization?.id } : {}
				},
				untracked: { args: hookParams }
			})
		});
	};
}

//#endregion
//#region src/react/hooks/useStatements.tsx
/**
* @internal
*/
const useStatements = createBillingPaginatedHook({
	hookName: "useStatements",
	resourceType: STABLE_KEYS.STATEMENTS_KEY,
	useFetcher: () => {
		const clerk = useClerkInstanceContext();
		if (clerk.loaded) return clerk.billing.getStatements;
	}
});

//#endregion
//#region src/react/hooks/usePaymentAttempts.tsx
/**
* @internal
*/
const usePaymentAttempts = createBillingPaginatedHook({
	hookName: "usePaymentAttempts",
	resourceType: STABLE_KEYS.PAYMENT_ATTEMPTS_KEY,
	useFetcher: () => {
		const clerk = useClerkInstanceContext();
		if (clerk.loaded) return clerk.billing.getPaymentAttempts;
	}
});

//#endregion
//#region src/react/hooks/usePaymentMethods.tsx
/**
* @internal
*/
const usePaymentMethods = createBillingPaginatedHook({
	hookName: "usePaymentMethods",
	resourceType: STABLE_KEYS.PAYMENT_METHODS_KEY,
	useFetcher: (resource) => {
		const organization = useOrganizationBase();
		const user = useUserBase();
		if (resource === "organization") return organization?.getPaymentMethods;
		return user?.getPaymentMethods;
	}
});

//#endregion
//#region src/react/hooks/usePlans.tsx
/**
* @internal
*/
const usePlans = createBillingPaginatedHook({
	hookName: "usePlans",
	resourceType: STABLE_KEYS.PLANS_KEY,
	useFetcher: (_for) => {
		const clerk = useClerkInstanceContext();
		if (!clerk.loaded) return;
		return (params) => clerk.billing.getPlans({
			...params,
			for: _for
		});
	},
	options: { unauthenticated: true }
});

//#endregion
//#region src/react/hooks/useSubscription.shared.ts
function useSubscriptionCacheKeys(params) {
	const { userId, orgId, for: forType } = params;
	return useMemo(() => {
		const safeOrgId = forType === "organization" ? orgId : void 0;
		return createCacheKeys({
			stablePrefix: STABLE_KEYS.SUBSCRIPTION_KEY,
			authenticated: true,
			tracked: {
				userId,
				orgId: safeOrgId
			},
			untracked: { args: { orgId: safeOrgId } }
		});
	}, [
		userId,
		orgId,
		forType
	]);
}

//#endregion
//#region src/react/hooks/useSubscription.tsx
const HOOK_NAME = "useSubscription";
/**
* @internal
*/
function useSubscription(params) {
	useAssertWrappedByClerkProvider(HOOK_NAME);
	const clerk = useClerkInstanceContext();
	const user = useUserBase();
	const organization = useOrganizationBase();
	const billingEnabled = useBillingIsEnabled(params);
	const recordedRef = useRef(false);
	useEffect(() => {
		if (!recordedRef.current && clerk?.telemetry) {
			clerk.telemetry.record(eventMethodCalled(HOOK_NAME));
			recordedRef.current = true;
		}
	}, [clerk]);
	const keepPreviousData = params?.keepPreviousData ?? false;
	const [queryClient] = useClerkQueryClient();
	const { queryKey, invalidationKey, stableKey, authenticated } = useSubscriptionCacheKeys({
		userId: user?.id,
		orgId: organization?.id,
		for: params?.for
	});
	const queriesEnabled = Boolean(user?.id && billingEnabled);
	useClearQueriesOnSignOut({
		isSignedOut: user === null,
		authenticated,
		stableKeys: stableKey
	});
	const query = useClerkQuery({
		queryKey,
		queryFn: ({ queryKey: queryKey$1 }) => {
			const obj = queryKey$1[3];
			return clerk.billing.getSubscription(obj.args);
		},
		staleTime: 1e3 * 60,
		enabled: queriesEnabled,
		placeholderData: defineKeepPreviousDataFn(keepPreviousData && queriesEnabled)
	});
	const revalidate = useCallback(() => queryClient.invalidateQueries({ queryKey: invalidationKey }), [queryClient, invalidationKey]);
	return {
		data: query.data,
		error: query.error ?? void 0,
		isLoading: query.isLoading,
		isFetching: query.isFetching,
		revalidate
	};
}

//#endregion
//#region src/react/hooks/useCheckout.ts
/**
* @function
*
* @param [options] - An object containing the configuration for the checkout flow.
*
* **Required** if the hook is used without a `<CheckoutProvider />` wrapping the component tree.
*/
const useCheckout = (options) => {
	const contextOptions = useCheckoutContext();
	const { for: forOrganization, planId, planPeriod } = options || contextOptions;
	const organization = useOrganizationBase();
	const { isLoaded, user } = useUser();
	const clerk = useClerkInstanceContext();
	if (user === null && isLoaded) throw new Error("Clerk: Ensure that `useCheckout` is inside a component wrapped with `<Show when=\"signed-in\" />`.");
	if (isLoaded && forOrganization === "organization" && organization === null) throw new Error("Clerk: Ensure your flow checks for an active organization. Retrieve `orgId` from `useAuth()` and confirm it is defined. For SSR, see: https://clerk.com/docs/reference/backend/types/auth-object#how-to-access-the-auth-object");
	const signal = useCallback(() => {
		return clerk.__experimental_checkout({
			planId,
			planPeriod,
			for: forOrganization
		});
	}, [
		user?.id,
		organization?.id,
		planId,
		planPeriod,
		forOrganization
	]);
	const subscribe = useCallback((callback) => {
		if (!clerk.loaded) return () => {};
		return clerk.__internal_state.__internal_effect(() => {
			signal();
			callback();
		});
	}, [
		signal,
		clerk.loaded,
		clerk.__internal_state
	]);
	const getSnapshot = useCallback(() => {
		return signal();
	}, [signal]);
	return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};

//#endregion
//#region src/react/hooks/useStatementQuery.shared.ts
function useStatementQueryCacheKeys(params) {
	const { statementId, userId, orgId, for: forType } = params;
	return useMemo(() => {
		return createCacheKeys({
			stablePrefix: INTERNAL_STABLE_KEYS.BILLING_STATEMENTS_KEY,
			authenticated: true,
			tracked: {
				statementId,
				forType,
				userId,
				orgId
			},
			untracked: { args: {
				id: statementId ?? void 0,
				orgId: orgId ?? void 0
			} }
		});
	}, [
		statementId,
		forType,
		userId,
		orgId
	]);
}

//#endregion
//#region src/react/hooks/useStatementQuery.tsx
/**
* @internal
*/
function useStatementQuery(params = {}) {
	const { statementId = null, keepPreviousData = false, for: forType = "user" } = params;
	const clerk = useClerkInstanceContext();
	const user = useUserBase();
	const organization = useOrganizationBase();
	const organizationId = forType === "organization" ? organization?.id ?? null : null;
	const { queryKey, stableKey, authenticated } = useStatementQueryCacheKeys({
		statementId,
		userId: user?.id ?? null,
		orgId: organizationId,
		for: forType
	});
	const billingEnabled = useBillingIsEnabled(params);
	const queryEnabled = Boolean(statementId) && billingEnabled;
	useClearQueriesOnSignOut({
		isSignedOut: user === null,
		authenticated,
		stableKeys: stableKey
	});
	const query = useClerkQuery({
		queryKey,
		queryFn: () => {
			if (!statementId) throw new Error("statementId is required to fetch a statement");
			return clerk.billing.getStatement({
				id: statementId,
				orgId: organizationId ?? void 0
			});
		},
		enabled: queryEnabled,
		placeholderData: defineKeepPreviousDataFn(keepPreviousData),
		staleTime: 1e3 * 60
	});
	return {
		data: query.data,
		error: query.error ?? null,
		isLoading: query.isLoading,
		isFetching: query.isFetching
	};
}

//#endregion
//#region src/react/hooks/usePlanDetailsQuery.shared.ts
function usePlanDetailsQueryCacheKeys(params) {
	const { planId } = params;
	return useMemo(() => {
		return createCacheKeys({
			stablePrefix: INTERNAL_STABLE_KEYS.BILLING_PLANS_KEY,
			authenticated: false,
			tracked: { planId: planId ?? null },
			untracked: { args: { id: planId ?? void 0 } }
		});
	}, [planId]);
}

//#endregion
//#region src/react/hooks/usePlanDetailsQuery.tsx
/**
* @internal
*/
function __internal_usePlanDetailsQuery(params = {}) {
	const { planId, initialPlan = null, keepPreviousData = true } = params;
	const clerk = useClerkInstanceContext();
	const targetPlanId = planId ?? initialPlan?.id ?? null;
	const { queryKey } = usePlanDetailsQueryCacheKeys({ planId: targetPlanId });
	const billingEnabled = useBillingIsEnabled({ authenticated: false });
	const query = useClerkQuery({
		queryKey,
		queryFn: () => {
			if (!targetPlanId) throw new Error("planId is required to fetch plan details");
			return clerk.billing.getPlan({ id: targetPlanId });
		},
		enabled: Boolean(targetPlanId) && billingEnabled,
		initialData: initialPlan ?? void 0,
		placeholderData: defineKeepPreviousDataFn(keepPreviousData),
		initialDataUpdatedAt: 0
	});
	return {
		data: query.data,
		error: query.error ?? null,
		isLoading: query.isLoading,
		isFetching: query.isFetching
	};
}

//#endregion
//#region src/react/hooks/usePaymentAttemptQuery.shared.ts
function usePaymentAttemptQueryCacheKeys(params) {
	const { paymentAttemptId, userId, orgId, for: forType } = params;
	return useMemo(() => {
		return createCacheKeys({
			stablePrefix: INTERNAL_STABLE_KEYS.PAYMENT_ATTEMPT_KEY,
			authenticated: true,
			tracked: {
				paymentAttemptId,
				forType,
				userId,
				orgId
			},
			untracked: { args: {
				id: paymentAttemptId ?? void 0,
				orgId: orgId ?? void 0
			} }
		});
	}, [
		paymentAttemptId,
		forType,
		userId,
		orgId
	]);
}

//#endregion
//#region src/react/hooks/usePaymentAttemptQuery.tsx
/**
* @internal
*/
function usePaymentAttemptQuery(params) {
	const { paymentAttemptId, keepPreviousData = false, for: forType = "user" } = params;
	const clerk = useClerkInstanceContext();
	const user = useUserBase();
	const organization = useOrganizationBase();
	const organizationId = forType === "organization" ? organization?.id ?? null : null;
	const { queryKey, stableKey, authenticated } = usePaymentAttemptQueryCacheKeys({
		paymentAttemptId,
		userId: user?.id ?? null,
		orgId: organizationId,
		for: forType
	});
	const billingEnabled = useBillingIsEnabled(params);
	const queryEnabled = Boolean(paymentAttemptId) && billingEnabled;
	useClearQueriesOnSignOut({
		isSignedOut: user === null,
		authenticated,
		stableKeys: stableKey
	});
	const query = useClerkQuery({
		queryKey,
		queryFn: ({ queryKey: queryKey$1 }) => {
			const args = queryKey$1[3].args;
			return clerk.billing.getPaymentAttempt(args);
		},
		enabled: queryEnabled,
		placeholderData: defineKeepPreviousDataFn(keepPreviousData),
		staleTime: 1e3 * 60
	});
	return {
		data: query.data,
		error: query.error ?? null,
		isLoading: query.isLoading,
		isFetching: query.isFetching
	};
}

//#endregion
//#region src/react/hooks/useUserEnterpriseConnections.shared.ts
/**
* @internal
*/
function useUserEnterpriseConnectionsCacheKeys(params) {
	const { userId, withOrganizationAccountLinking = false } = params;
	return useMemo(() => {
		return createCacheKeys({
			stablePrefix: INTERNAL_STABLE_KEYS.USER_ENTERPRISE_CONNECTIONS_KEY,
			authenticated: Boolean(userId),
			tracked: {
				userId: userId ?? null,
				withOrganizationAccountLinking
			},
			untracked: { args: {} }
		});
	}, [userId, withOrganizationAccountLinking]);
}

//#endregion
//#region src/react/hooks/useUserEnterpriseConnections.tsx
/**
* Enterprise connections for the signed-in user
*
* @internal
*/
function useUserEnterpriseConnections(params = {}) {
	const { keepPreviousData = true, enabled = true, withOrganizationAccountLinking = false } = params;
	const clerk = useClerkInstanceContext();
	const user = useUserBase();
	const [queryClient] = useClerkQueryClient();
	const { queryKey, stableKey, authenticated } = useUserEnterpriseConnectionsCacheKeys({
		userId: user?.id ?? null,
		withOrganizationAccountLinking
	});
	const queryEnabled = enabled && clerk.loaded && Boolean(user);
	useClearQueriesOnSignOut({
		isSignedOut: user === null,
		authenticated,
		stableKeys: stableKey
	});
	const query = useClerkQuery({
		queryKey,
		queryFn: () => user?.getEnterpriseConnections({ withOrganizationAccountLinking }),
		enabled: queryEnabled,
		placeholderData: defineKeepPreviousDataFn(keepPreviousData)
	});
	const revalidate = useCallback(() => queryClient.invalidateQueries({ queryKey: [stableKey] }), [queryClient, stableKey]);
	const createEnterpriseConnection = useCallback(async (createParams) => {
		const created = await user?.createEnterpriseConnection(createParams);
		await revalidate();
		return created;
	}, [user, revalidate]);
	const updateEnterpriseConnection = useCallback(async (enterpriseConnectionId, updateParams) => {
		const updated = await user?.updateEnterpriseConnection(enterpriseConnectionId, updateParams);
		await revalidate();
		return updated;
	}, [user, revalidate]);
	const deleteEnterpriseConnection = useCallback(async (enterpriseConnectionId) => {
		const deleted = await user?.deleteEnterpriseConnection(enterpriseConnectionId);
		await revalidate();
		return deleted;
	}, [user, revalidate]);
	return {
		data: query.data,
		error: query.error ?? null,
		isLoading: query.isLoading,
		isFetching: query.isFetching,
		createEnterpriseConnection,
		updateEnterpriseConnection,
		deleteEnterpriseConnection,
		revalidate
	};
}

//#endregion
//#region src/react/hooks/useEnterpriseConnectionTestRuns.shared.ts
/**
* @internal
*/
function useEnterpriseConnectionTestRunsCacheKeys(params) {
	const { userId, enterpriseConnectionId, args } = params;
	return useMemo(() => {
		return createCacheKeys({
			stablePrefix: INTERNAL_STABLE_KEYS.ENTERPRISE_CONNECTION_TEST_RUNS_KEY,
			authenticated: Boolean(userId),
			tracked: {
				userId: userId ?? null,
				enterpriseConnectionId: enterpriseConnectionId ?? null
			},
			untracked: { args }
		});
	}, [
		userId,
		enterpriseConnectionId,
		JSON.stringify(args)
	]);
}

//#endregion
//#region src/react/hooks/useEnterpriseConnectionTestRuns.tsx
const DEFAULT_POLL_INTERVAL_MS = 2e3;
/**
* Subscribes to the list of enterprise-connection test runs for the signed-in user
*
* @internal
*/
function useEnterpriseConnectionTestRuns(params) {
	const { enterpriseConnectionId, params: fetchParams = {
		initialPage: 1,
		pageSize: 10
	}, pollIntervalMs = DEFAULT_POLL_INTERVAL_MS, enabled = true } = params;
	const clerk = useClerkInstanceContext();
	const user = useUserBase();
	const [queryClient] = useClerkQueryClient();
	const { queryKey, invalidationKey, stableKey, authenticated } = useEnterpriseConnectionTestRunsCacheKeys({
		userId: user?.id ?? null,
		enterpriseConnectionId,
		args: fetchParams
	});
	useClearQueriesOnSignOut({
		isSignedOut: user === null,
		authenticated,
		stableKeys: stableKey
	});
	const queryEnabled = enabled && clerk.loaded && Boolean(user) && Boolean(enterpriseConnectionId);
	const [shouldPoll, setShouldPoll] = useState(false);
	const query = useClerkQuery({
		queryKey,
		queryFn: () => {
			if (!enterpriseConnectionId) throw new Error("enterpriseConnectionId is required to fetch test runs");
			return user?.getEnterpriseConnectionTestRuns(enterpriseConnectionId, fetchParams);
		},
		refetchInterval: (q) => {
			if (!shouldPoll) return false;
			return (q.state.data?.data?.length ?? 0) > 0 ? false : pollIntervalMs;
		},
		enabled: queryEnabled,
		refetchIntervalInBackground: false
	});
	const hasRows = (query.data?.data?.length ?? 0) > 0;
	useEffect(() => {
		if (shouldPoll && hasRows) setShouldPoll(false);
	}, [shouldPoll, hasRows]);
	const revalidate = useCallback(async () => {
		if (!hasRows) setShouldPoll(true);
		await queryClient.invalidateQueries({ queryKey: invalidationKey });
	}, [
		queryClient,
		invalidationKey,
		hasRows
	]);
	const isPolling = queryEnabled && shouldPoll && !hasRows;
	return {
		data: query.data?.data,
		totalCount: query.data?.total_count,
		error: query.error ?? null,
		isLoading: query.isLoading,
		isFetching: query.isFetching,
		isPolling,
		revalidate
	};
}

//#endregion
//#region src/react/utils.ts
function assertClerkSingletonExists(clerk) {
	if (!clerk) clerkCoreErrorNoClerkSingleton();
}

//#endregion
//#region src/react/ClerkContextProvider.tsx
function ClerkContextProvider(props) {
	const clerk = props.clerk;
	assertClerkSingletonExists(clerk);
	if (props.initialState instanceof Promise && !("use" in React && typeof React.use === "function")) throw new Error("initialState cannot be a promise if React version is less than 19");
	const clerkCtx = React.useMemo(() => ({ value: clerk }), [props.clerkStatus]);
	return /* @__PURE__ */ React.createElement(InitialStateProvider, { initialState: props.initialState }, /* @__PURE__ */ React.createElement(ClerkInstanceContext.Provider, { value: clerkCtx }, /* @__PURE__ */ React.createElement(__experimental_CheckoutProvider, { value: void 0 }, props.children)));
}

//#endregion
//#region src/react/stripe-react/utils.ts
const usePrevious = (value) => {
	const ref = useRef(value);
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
};
const useAttachEvent = (element, event, cb) => {
	const cbDefined = !!cb;
	const cbRef = useRef(cb);
	useEffect(() => {
		cbRef.current = cb;
	}, [cb]);
	useEffect(() => {
		if (!cbDefined || !element) return () => {};
		const decoratedCb = (...args) => {
			if (cbRef.current) cbRef.current(...args);
		};
		element.on(event, decoratedCb);
		return () => {
			element.off(event, decoratedCb);
		};
	}, [
		cbDefined,
		event,
		element,
		cbRef
	]);
};

//#endregion
//#region src/react/stripe-react/index.tsx
const ElementsContext = React.createContext(null);
ElementsContext.displayName = "ElementsContext";
const parseElementsContext = (ctx, useCase) => {
	if (!ctx) throw new Error(`Could not find Elements context; You need to wrap the part of your app that ${useCase} in an <Elements> provider.`);
	return ctx;
};
/**
* The `Elements` provider allows you to use [Element components](https://stripe.com/docs/stripe-js/react#element-components) and access the [Stripe object](https://stripe.com/docs/js/initializing) in any nested component.
* Render an `Elements` provider at the root of your React app so that it is available everywhere you need it.
*
* To use the `Elements` provider, call `loadStripe` from `@stripe/stripe-js` with your publishable key.
* The `loadStripe` function will asynchronously load the Stripe.js script and initialize a `Stripe` object.
* Pass the returned `Promise` to `Elements`.
*
* @docs https://stripe.com/docs/stripe-js/react#elements-provider
*/
const Elements = (({ stripe: rawStripeProp, options, children }) => {
	const parsed = React.useMemo(() => parseStripeProp(rawStripeProp), [rawStripeProp]);
	const [ctx, setContext] = React.useState(() => ({
		stripe: parsed.tag === "sync" ? parsed.stripe : null,
		elements: parsed.tag === "sync" ? parsed.stripe.elements(options) : null
	}));
	React.useEffect(() => {
		let isMounted = true;
		const safeSetContext = (stripe) => {
			setContext((ctx$1) => {
				if (ctx$1.stripe) return ctx$1;
				return {
					stripe,
					elements: stripe.elements(options)
				};
			});
		};
		if (parsed.tag === "async" && !ctx.stripe) parsed.stripePromise.then((stripe) => {
			if (stripe && isMounted) safeSetContext(stripe);
		});
		else if (parsed.tag === "sync" && !ctx.stripe) safeSetContext(parsed.stripe);
		return () => {
			isMounted = false;
		};
	}, [
		parsed,
		ctx,
		options
	]);
	const prevStripe = usePrevious(rawStripeProp);
	React.useEffect(() => {
		if (prevStripe !== null && prevStripe !== rawStripeProp) console.warn("Unsupported prop change on Elements: You cannot change the `stripe` prop after setting it.");
	}, [prevStripe, rawStripeProp]);
	const prevOptions = usePrevious(options);
	React.useEffect(() => {
		if (!ctx.elements) return;
		const updates = extractAllowedOptionsUpdates(options, prevOptions, ["clientSecret", "fonts"]);
		if (updates) ctx.elements.update(updates);
	}, [
		options,
		prevOptions,
		ctx.elements
	]);
	return /* @__PURE__ */ React.createElement(ElementsContext.Provider, { value: ctx }, children);
});
const useElementsContextWithUseCase = (useCaseMessage) => {
	return parseElementsContext(React.useContext(ElementsContext), useCaseMessage);
};
const useElements = () => {
	const { elements } = useElementsContextWithUseCase("calls useElements()");
	return elements;
};
const INVALID_STRIPE_ERROR = "Invalid prop `stripe` supplied to `Elements`. We recommend using the `loadStripe` utility from `@stripe/stripe-js`. See https://stripe.com/docs/stripe-js/react#elements-props-stripe for details.";
const validateStripe = (maybeStripe, errorMsg = INVALID_STRIPE_ERROR) => {
	if (maybeStripe === null || isStripe(maybeStripe)) return maybeStripe;
	throw new Error(errorMsg);
};
const parseStripeProp = (raw, errorMsg = INVALID_STRIPE_ERROR) => {
	if (isPromise(raw)) return {
		tag: "async",
		stripePromise: Promise.resolve(raw).then((result) => validateStripe(result, errorMsg))
	};
	const stripe = validateStripe(raw, errorMsg);
	if (stripe === null) return { tag: "empty" };
	return {
		tag: "sync",
		stripe
	};
};
const isUnknownObject = (raw) => {
	return raw !== null && typeof raw === "object";
};
const isPromise = (raw) => {
	return isUnknownObject(raw) && typeof raw.then === "function";
};
const isStripe = (raw) => {
	return isUnknownObject(raw) && typeof raw.elements === "function" && typeof raw.createToken === "function" && typeof raw.createPaymentMethod === "function" && typeof raw.confirmCardPayment === "function";
};
const extractAllowedOptionsUpdates = (options, prevOptions, immutableKeys) => {
	if (!isUnknownObject(options)) return null;
	return Object.keys(options).reduce((newOptions, key) => {
		const isUpdated = !isUnknownObject(prevOptions) || !isEqual(options[key], prevOptions[key]);
		if (immutableKeys.includes(key)) {
			if (isUpdated) console.warn(`Unsupported prop change: options.${key} is not a mutable property.`);
			return newOptions;
		}
		if (!isUpdated) return newOptions;
		return {
			...newOptions || {},
			[key]: options[key]
		};
	}, null);
};
const PLAIN_OBJECT_STR = "[object Object]";
const isEqual = (left, right) => {
	if (!isUnknownObject(left) || !isUnknownObject(right)) return left === right;
	const leftArray = Array.isArray(left);
	if (leftArray !== Array.isArray(right)) return false;
	const leftPlainObject = Object.prototype.toString.call(left) === PLAIN_OBJECT_STR;
	if (leftPlainObject !== (Object.prototype.toString.call(right) === PLAIN_OBJECT_STR)) return false;
	if (!leftPlainObject && !leftArray) return left === right;
	const leftKeys = Object.keys(left);
	const rightKeys = Object.keys(right);
	if (leftKeys.length !== rightKeys.length) return false;
	const keySet = {};
	for (let i = 0; i < leftKeys.length; i += 1) keySet[leftKeys[i]] = true;
	for (let i = 0; i < rightKeys.length; i += 1) keySet[rightKeys[i]] = true;
	const allKeys = Object.keys(keySet);
	if (allKeys.length !== leftKeys.length) return false;
	const l = left;
	const r = right;
	const pred = (key) => {
		return isEqual(l[key], r[key]);
	};
	return allKeys.every(pred);
};
const useStripe = () => {
	const { stripe } = useElementsOrCheckoutSdkContextWithUseCase("calls useStripe()");
	return stripe;
};
const useElementsOrCheckoutSdkContextWithUseCase = (useCaseString) => {
	return parseElementsContext(React.useContext(ElementsContext), useCaseString);
};
const capitalized = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const createElementComponent = (type, isServer) => {
	const displayName = `${capitalized(type)}Element`;
	const ClientElement = ({ id, className, fallback, options = {}, onBlur, onFocus, onReady, onChange, onEscape, onClick, onLoadError, onLoaderStart, onNetworksChange, onConfirm, onCancel, onShippingAddressChange, onShippingRateChange }) => {
		const ctx = useElementsOrCheckoutSdkContextWithUseCase(`mounts <${displayName}>`);
		const elements = "elements" in ctx ? ctx.elements : null;
		const [element, setElement] = React.useState(null);
		const elementRef = React.useRef(null);
		const domNode = React.useRef(null);
		const [isReady, setReady] = useState(false);
		useAttachEvent(element, "blur", onBlur);
		useAttachEvent(element, "focus", onFocus);
		useAttachEvent(element, "escape", onEscape);
		useAttachEvent(element, "click", onClick);
		useAttachEvent(element, "loaderror", onLoadError);
		useAttachEvent(element, "loaderstart", onLoaderStart);
		useAttachEvent(element, "networkschange", onNetworksChange);
		useAttachEvent(element, "confirm", onConfirm);
		useAttachEvent(element, "cancel", onCancel);
		useAttachEvent(element, "shippingaddresschange", onShippingAddressChange);
		useAttachEvent(element, "shippingratechange", onShippingRateChange);
		useAttachEvent(element, "change", onChange);
		let readyCallback;
		if (onReady) readyCallback = () => {
			setReady(true);
			onReady(element);
		};
		useAttachEvent(element, "ready", readyCallback);
		React.useLayoutEffect(() => {
			if (elementRef.current === null && domNode.current !== null && elements) {
				let newElement = null;
				if (elements) newElement = elements.create(type, options);
				elementRef.current = newElement;
				setElement(newElement);
				if (newElement) newElement.mount(domNode.current);
			}
		}, [elements, options]);
		const prevOptions = usePrevious(options);
		React.useEffect(() => {
			if (!elementRef.current) return;
			const updates = extractAllowedOptionsUpdates(options, prevOptions, ["paymentRequest"]);
			if (updates && "update" in elementRef.current) elementRef.current.update(updates);
		}, [options, prevOptions]);
		React.useLayoutEffect(() => {
			return () => {
				if (elementRef.current && typeof elementRef.current.destroy === "function") try {
					elementRef.current.destroy();
					elementRef.current = null;
				} catch {}
			};
		}, []);
		return /* @__PURE__ */ React.createElement(React.Fragment, null, !isReady && fallback, /* @__PURE__ */ React.createElement("div", {
			id,
			style: {
				height: isReady ? "unset" : "0px",
				visibility: isReady ? "visible" : "hidden"
			},
			className,
			ref: domNode
		}));
	};
	const ServerElement = (props) => {
		useElementsOrCheckoutSdkContextWithUseCase(`mounts <${displayName}>`);
		const { id, className } = props;
		return /* @__PURE__ */ React.createElement("div", {
			id,
			className
		});
	};
	const Element = isServer ? ServerElement : ClientElement;
	Element.displayName = displayName;
	Element.__elementType = type;
	return Element;
};
const PaymentElement$1 = createElementComponent("payment", typeof window === "undefined");

//#endregion
//#region src/react/billing/useInitializePaymentMethod.tsx
/**
* @internal
*/
function useInitializePaymentMethod(options) {
	const { for: forType } = options ?? {};
	const organization = useOrganizationBase();
	const user = useUserBase();
	const resource = forType === "organization" ? organization : user;
	const billingEnabled = useBillingIsEnabled(options);
	const stableKey = "billing-payment-method-initialize";
	const authenticated = true;
	const queryKey = useMemo(() => {
		return [
			stableKey,
			authenticated,
			{ resourceId: resource?.id },
			{}
		];
	}, [resource?.id]);
	const isEnabled = Boolean(resource?.id) && billingEnabled;
	useClearQueriesOnSignOut({
		isSignedOut: user === null,
		authenticated,
		stableKeys: stableKey
	});
	const query = useClerkQuery({
		queryKey,
		queryFn: async () => {
			if (!resource) return;
			return resource.initializePaymentMethod({ gateway: "stripe" });
		},
		enabled: isEnabled,
		staleTime: 1e3 * 60,
		refetchOnWindowFocus: false,
		placeholderData: defineKeepPreviousDataFn(isEnabled)
	});
	const [queryClient] = useClerkQueryClient();
	const initializePaymentMethod = useCallback(async () => {
		if (!resource) return;
		const result = await resource.initializePaymentMethod({ gateway: "stripe" });
		queryClient.setQueryData(queryKey, result);
		return result;
	}, [
		queryClient,
		queryKey,
		resource
	]);
	return {
		initializedPaymentMethod: query.data ?? void 0,
		initializePaymentMethod
	};
}

//#endregion
//#region src/react/billing/useStripeClerkLibs.tsx
/**
* @internal
*/
function useStripeClerkLibs() {
	const clerk = useClerk();
	return useClerkQuery({
		queryKey: ["clerk-stripe-sdk"],
		queryFn: async () => {
			return { loadStripe: await clerk.__internal_loadStripeJs() };
		},
		staleTime: Infinity,
		refetchOnWindowFocus: false,
		placeholderData: defineKeepPreviousDataFn(true)
	}).data ?? null;
}

//#endregion
//#region src/react/billing/useStripeLoader.tsx
/**
* @internal
*/
function useStripeLoader(options) {
	const { stripeClerkLibs, externalGatewayId, stripePublishableKey } = options;
	const queryKey = useMemo(() => {
		return ["stripe-sdk", {
			externalGatewayId,
			stripePublishableKey
		}];
	}, [externalGatewayId, stripePublishableKey]);
	const billingEnabled = useBillingIsEnabled({ authenticated: true });
	return useClerkQuery({
		queryKey,
		queryFn: () => {
			if (!stripeClerkLibs || !externalGatewayId || !stripePublishableKey) return null;
			return stripeClerkLibs.loadStripe(stripePublishableKey, { stripeAccount: externalGatewayId });
		},
		enabled: Boolean(stripeClerkLibs && externalGatewayId && stripePublishableKey) && billingEnabled,
		staleTime: 1e3 * 60,
		refetchOnWindowFocus: false,
		placeholderData: defineKeepPreviousDataFn(true)
	}).data;
}

//#endregion
//#region src/react/billing/payment-element.tsx
const useInternalEnvironment = () => {
	return useClerk().__internal_environment;
};
const useLocalization = () => {
	const clerk = useClerk();
	let locale = "en";
	try {
		locale = clerk.__internal_getOption("localization")?.locale || "en";
	} catch {}
	return locale.split("-")[0];
};
const usePaymentSourceUtils = (forResource = "user") => {
	const stripeClerkLibs = useStripeClerkLibs();
	const environment = useInternalEnvironment();
	const { initializedPaymentMethod, initializePaymentMethod } = useInitializePaymentMethod({ for: forResource });
	const stripePublishableKey = environment?.commerceSettings.billing.stripePublishableKey ?? void 0;
	return {
		stripe: useStripeLoader({
			stripeClerkLibs,
			externalGatewayId: initializedPaymentMethod?.externalGatewayId,
			stripePublishableKey
		}),
		initializePaymentMethod,
		externalClientSecret: initializedPaymentMethod?.externalClientSecret,
		paymentMethodOrder: initializedPaymentMethod?.paymentMethodOrder
	};
};
const [PaymentElementContext, usePaymentElementContext] = createContextAndHook("PaymentElementContext");
const [StripeUtilsContext, useStripeUtilsContext] = createContextAndHook("StripeUtilsContext");
const ValidateStripeUtils = ({ children }) => {
	const stripe = useStripe();
	const elements = useElements();
	return /* @__PURE__ */ React.createElement(StripeUtilsContext.Provider, { value: { value: {
		stripe,
		elements
	} } }, children);
};
const DummyStripeUtils = ({ children }) => {
	return /* @__PURE__ */ React.createElement(StripeUtilsContext.Provider, { value: { value: {} } }, children);
};
const PropsProvider = ({ children,...props }) => {
	const utils = usePaymentSourceUtils(props.for);
	const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);
	return /* @__PURE__ */ React.createElement(PaymentElementContext.Provider, { value: { value: {
		...props,
		...utils,
		setIsPaymentElementReady,
		isPaymentElementReady
	} } }, children);
};
const PaymentElementProvider = ({ children,...props }) => {
	return /* @__PURE__ */ React.createElement(PropsProvider, props, /* @__PURE__ */ React.createElement(PaymentElementInternalRoot, null, children));
};
const PaymentElementInternalRoot = (props) => {
	const { stripe, externalClientSecret, stripeAppearance } = usePaymentElementContext();
	const locale = useLocalization();
	if (stripe && externalClientSecret) return /* @__PURE__ */ React.createElement(Elements, {
		key: externalClientSecret,
		stripe,
		options: {
			loader: "never",
			clientSecret: externalClientSecret,
			appearance: { variables: stripeAppearance },
			locale
		}
	}, /* @__PURE__ */ React.createElement(ValidateStripeUtils, null, props.children));
	return /* @__PURE__ */ React.createElement(DummyStripeUtils, null, props.children);
};
const PaymentElement = ({ fallback }) => {
	const { setIsPaymentElementReady, paymentMethodOrder, checkout, stripe, externalClientSecret, paymentDescription, for: _for } = usePaymentElementContext();
	const environment = useInternalEnvironment();
	const applePay = useMemo(() => {
		if (!checkout || !checkout.totals || !checkout.plan) return;
		return { recurringPaymentRequest: {
			paymentDescription: paymentDescription || "",
			managementURL: _for === "organization" ? environment?.displayConfig.organizationProfileUrl || "" : environment?.displayConfig.userProfileUrl || "",
			regularBilling: {
				amount: checkout.totals.totalDueNow?.amount || checkout.totals.grandTotal.amount,
				label: checkout.plan.name,
				recurringPaymentIntervalUnit: checkout.planPeriod === "annual" ? "year" : "month"
			}
		} };
	}, [
		checkout,
		paymentDescription,
		_for,
		environment
	]);
	const options = useMemo(() => {
		return {
			layout: {
				type: "tabs",
				defaultCollapsed: false
			},
			paymentMethodOrder,
			applePay
		};
	}, [applePay, paymentMethodOrder]);
	const onReady = useCallback(() => {
		setIsPaymentElementReady(true);
	}, [setIsPaymentElementReady]);
	if (!stripe || !externalClientSecret) return /* @__PURE__ */ React.createElement(React.Fragment, null, fallback);
	return /* @__PURE__ */ React.createElement(PaymentElement$1, {
		fallback,
		onReady,
		options
	});
};
const throwLibsMissingError = () => {
	throw new Error("Clerk: Unable to submit, Stripe libraries are not yet loaded. Be sure to check `isFormReady` before calling `submit`.");
};
const usePaymentElement = () => {
	const { isPaymentElementReady, initializePaymentMethod } = usePaymentElementContext();
	const { stripe, elements } = useStripeUtilsContext();
	const { externalClientSecret } = usePaymentElementContext();
	const submit = useCallback(async () => {
		if (!stripe || !elements) return throwLibsMissingError();
		const { setupIntent, error } = await stripe.confirmSetup({
			elements,
			confirmParams: { return_url: window.location.href },
			redirect: "if_required"
		});
		if (error) return {
			data: null,
			error: {
				gateway: "stripe",
				error: {
					code: error.code,
					message: error.message,
					type: error.type
				}
			}
		};
		return {
			data: {
				gateway: "stripe",
				paymentToken: setupIntent.payment_method
			},
			error: null
		};
	}, [stripe, elements]);
	const reset = useCallback(async () => {
		if (!stripe || !elements) return throwLibsMissingError();
		await initializePaymentMethod();
	}, [
		stripe,
		elements,
		initializePaymentMethod
	]);
	const isProviderReady = Boolean(stripe && externalClientSecret);
	if (!isProviderReady) return {
		submit: throwLibsMissingError,
		reset: throwLibsMissingError,
		isFormReady: false,
		provider: void 0,
		isProviderReady: false
	};
	return {
		submit,
		reset,
		isFormReady: isPaymentElementReady,
		provider: { name: "stripe" },
		isProviderReady
	};
};

//#endregion
//#region src/react/PortalProvider.tsx
const [PortalContext, , usePortalContextWithoutGuarantee] = createContextAndHook("PortalProvider");
/**
* UNSAFE_PortalProvider allows you to specify a custom container for Clerk floating UI elements
* (popovers, modals, tooltips, etc.) that use portals.
*
* Only components within this provider will be affected. Components outside the provider
* will continue to use the default document.body for portals.
*
* This is particularly useful when using Clerk components inside external UI libraries
* like Radix Dialog or React Aria Components, where portaled elements need to render
* within the dialog's container to remain interactable.
*
* @example
* ```tsx
* function Example() {
*   const containerRef = useRef(null);
*   return (
*     <RadixDialog ref={containerRef}>
*       <UNSAFE_PortalProvider getContainer={() => containerRef.current}>
*         <UserButton />
*       </UNSAFE_PortalProvider>
*     </RadixDialog>
*   );
* }
* ```
*/
const UNSAFE_PortalProvider = ({ children, getContainer }) => {
	const contextValue = React.useMemo(() => ({ value: { getContainer } }), [getContainer]);
	return /* @__PURE__ */ React.createElement(PortalContext.Provider, { value: contextValue }, children);
};
UNSAFE_PortalProvider.displayName = "UNSAFE_PortalProvider";
/**
* Hook to get the current portal root container.
* Returns the getContainer function from context if inside a PortalProvider,
* otherwise returns a function that returns null (default behavior).
*/
const usePortalRoot = () => {
	const contextValue = usePortalContextWithoutGuarantee();
	if (contextValue && "getContainer" in contextValue && contextValue.getContainer) return contextValue.getContainer;
	return () => null;
};

//#endregion
export { ClerkContextProvider, ClerkInstanceContext, InitialStateProvider, OptionsContext, UNSAFE_PortalProvider, __createClerkTestQueryClient, __experimental_CheckoutProvider, PaymentElement as __experimental_PaymentElement, PaymentElementProvider as __experimental_PaymentElementProvider, useCheckout as __experimental_useCheckout, usePaymentAttempts as __experimental_usePaymentAttempts, usePaymentElement as __experimental_usePaymentElement, usePaymentMethods as __experimental_usePaymentMethods, usePlans as __experimental_usePlans, useStatements as __experimental_useStatements, useSubscription as __experimental_useSubscription, useClientBase as __internal_useClientBase, useEnterpriseConnectionTestRuns as __internal_useEnterpriseConnectionTestRuns, useOrganizationBase as __internal_useOrganizationBase, usePaymentAttemptQuery as __internal_usePaymentAttemptQuery, __internal_usePlanDetailsQuery, useSessionBase as __internal_useSessionBase, useStatementQuery as __internal_useStatementQuery, useUserBase as __internal_useUserBase, useUserEnterpriseConnections as __internal_useUserEnterpriseConnections, __resetClerkQueryClientForTest, __setClerkQueryClientForTest, assertContextExists, createContextAndHook, getClerkQueryClient, isDeeplyEqual, useAPIKeys, useAssertWrappedByClerkProvider, useAttemptToEnableOrganizations, useClerk, useClerkInstanceContext, useDeepEqualMemo, useInitialStateContext, useOAuthConsent, useOptionsContext, useOrganization, useOrganizationCreationDefaults, useOrganizationList, usePortalRoot, useReverification, useSafeLayoutEffect, useSession, useSessionList, useUser };
//# sourceMappingURL=index.mjs.map