import { UseSignInReturn, UseSignUpReturn } from '@clerk/shared/types';

/**
 * The `useSignIn()` hook provides access to the [`SignIn`](https://clerk.com/docs/reference/objects/sign-in) object, which allows you to check the current state of a sign-in attempt and manage the sign-in flow. You can use this to create a [custom sign-in flow](https://clerk.com/docs/guides/development/custom-flows/overview).
 *
 * @unionReturnHeadings
 * ["Initialization", "Loaded"]
 *
 * @example
 * ### Check the current state of a sign-in
 *
 * The following example uses the `useSignIn()` hook to access the [`SignIn`](https://clerk.com/docs/reference/objects/sign-in) object, which contains the current sign-in attempt status and methods to create a new sign-in attempt. The `isLoaded` property is used to handle the loading state.
 *
 * <Tabs items='React,Next.js'>
 * <Tab>
 *
 * ```tsx {{ filename: 'src/pages/SignInPage.tsx' }}
 * import { useSignIn } from '@clerk/react'
 *
 * export default function SignInPage() {
 *   const { isLoaded, signIn } = useSignIn()
 *
 *   if (!isLoaded) {
 *     // Handle loading state
 *     return null
 *   }
 *
 *   return <div>The current sign-in attempt status is {signIn?.status}.</div>
 * }
 * ```
 *
 * </Tab>
 * <Tab>
 *
 * {@include ../../../docs/legacy-use-sign-in.md#nextjs-01}
 *
 * </Tab>
 * </Tabs>
 *
 * @example
 * ### Create a custom sign-in flow with `useSignIn()`
 *
 * The `useSignIn()` hook can also be used to build fully custom sign-in flows, if Clerk's prebuilt components don't meet your specific needs or if you require more control over the authentication flow. Different sign-in flows include email and password, email and phone codes, email links, and multifactor (MFA). To learn more about using the `useSignIn()` hook to create custom flows, see the [custom flow guides](https://clerk.com/docs/guides/development/custom-flows/overview).
 *
 * ```empty```
 */
declare const useSignIn: () => UseSignInReturn;

/**
 * The `useSignUp()` hook provides access to the [`SignUp`](https://clerk.com/docs/reference/objects/sign-up) object, which allows you to check the current state of a sign-up attempt and manage the sign-up flow. You can use this to create a [custom sign-up flow](https://clerk.com/docs/guides/development/custom-flows/overview).
 *
 * @unionReturnHeadings
 * ["Initialization", "Loaded"]
 *
 * @example
 * ### Check the current state of a sign-up
 *
 * The following example uses the `useSignUp()` hook to access the [`SignUp`](https://clerk.com/docs/reference/objects/sign-up) object, which contains the current sign-up attempt status and methods to create a new sign-up attempt. The `isLoaded` property is used to handle the loading state.
 *
 * <Tabs items='React,Next.js'>
 * <Tab>
 *
 * ```tsx {{ filename: 'src/pages/SignUpPage.tsx' }}
 * import { useSignUp } from '@clerk/react'
 *
 * export default function SignUpPage() {
 *   const { isLoaded, signUp } = useSignUp()
 *
 *   if (!isLoaded) {
 *     // Handle loading state
 *     return null
 *   }
 *
 *   return <div>The current sign-up attempt status is {signUp?.status}.</div>
 * }
 * ```
 *
 * </Tab>
 * <Tab>
 *
 * {@include ../../../docs/legacy-use-sign-up.md#nextjs-01}
 *
 * </Tab>
 * </Tabs>
 *
 * @example
 * ### Create a custom sign-up flow with `useSignUp()`
 *
 * The `useSignUp()` hook can also be used to build fully custom sign-up flows, if Clerk's prebuilt components don't meet your specific needs or if you require more control over the authentication flow. Different sign-up flows include email and password, email and phone codes, email links, and multifactor (MFA). To learn more about using the `useSignUp()` hook to create custom flows, see the [custom flow guides](https://clerk.com/docs/guides/development/custom-flows/overview).
 *
 * ```empty```
 */
declare const useSignUp: () => UseSignUpReturn;

export { useSignIn, useSignUp };
