import * as _clerk_shared_types from '@clerk/shared/types';
import { DeepPartial, Theme, BaseTheme, Elements } from '@clerk/shared/types';
import { I as InternalTheme } from './defaultFoundations-BIF9oq59.js';

interface CreateClerkThemeParams extends DeepPartial<Theme>, Pick<BaseTheme, 'cssLayerName'> {
    /**
     * Optional name for the theme, used for telemetry and debugging.
     * @example 'shadcn', 'neobrutalism', 'custom-dark'
     */
    name?: string;
    /**
     * {@link Theme.elements}
     */
    elements?: Elements | ((params: {
        theme: InternalTheme;
    }) => Elements);
}
declare const experimental_createTheme: (themeParams: CreateClerkThemeParams) => {
    __type: "prebuilt_appearance";
    /**
     * Optional name for the theme, used for telemetry and debugging.
     * @example 'shadcn', 'neobrutalism', 'custom-dark'
     */
    name?: string;
    /**
     * {@link Theme.elements}
     */
    elements?: Elements | ((params: {
        theme: InternalTheme;
    }) => Elements);
    theme?: (BaseTheme | BaseTheme[]) | undefined;
    baseTheme?: (BaseTheme | BaseTheme[]) | undefined;
    layout?: _clerk_shared_types.Layout | undefined;
    variables?: _clerk_shared_types.Variables | undefined;
    captcha?: _clerk_shared_types.CaptchaAppearanceOptions | undefined;
    cssLayerName?: string | undefined;
};

export { experimental_createTheme };
