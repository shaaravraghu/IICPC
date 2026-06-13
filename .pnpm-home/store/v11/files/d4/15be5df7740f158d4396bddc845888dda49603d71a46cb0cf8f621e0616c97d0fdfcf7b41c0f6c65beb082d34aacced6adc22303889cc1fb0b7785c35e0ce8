export type SlugifyOptions = {
    /**
     * A string of extra characters to allow through the non-word filter.
     * Each character in the string is treated literally.
     * @example '.' // keeps dots: "v1.2.3" → "v1.2.3"
     * @example '.@' // keeps dots and at-signs
     */
    allowedSpecialChars?: string;
    /**
     * When `true`, the result is preserved as-is (i.e. case is preserved). By default we lowercase the string.
     * @default false
     * @example slugify('MyAPI', { preserveCase: true }) // 'MyAPI'
     */
    preserveCase?: boolean;
};
/**
 * Normalizes and slugifies a string.
 *
 * By default the result is lowercased, limited to 255 characters, and stripped
 * of everything that is not a Unicode letter, mark, number, hyphen, or space
 * (spaces and hyphens are then collapsed into a single hyphen).
 *
 * Pass {@link SlugifyOptions} to adjust this behaviour.
 *
 * | Option               | Type       | Default | Description                                                                                  |
 * |----------------------|------------|---------|----------------------------------------------------------------------------------------------|
 * | `allowedSpecialChars`| `string`   | `""`    | Extra characters that should survive the non-word filter (e.g. `"."` keeps dots so `"v1.2"` → `"v1.2"` instead of `"v12"`). |
 * | `preserveCase`       | `boolean`  | `false` | When `true`, the case is preserved. By default we lowercase the string |
 */
export declare const slugify: (v: string, options?: SlugifyOptions) => string;
//# sourceMappingURL=slugify.d.ts.map