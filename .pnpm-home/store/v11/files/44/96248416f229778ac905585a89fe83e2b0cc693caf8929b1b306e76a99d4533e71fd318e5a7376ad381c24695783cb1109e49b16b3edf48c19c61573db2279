import { type SlugifyOptions } from './slugify.js';
/**
 * Creates a stateful slug generator that tracks previously seen slugs and
 * appends an incrementing numeric suffix to avoid collisions, mirroring the
 * behaviour of `github-slugger`.
 *
 * @example
 * const { slug, reset } = createSlugger()
 * slug('Hello World') // 'hello-world'
 * slug('Hello World') // 'hello-world-1'
 * slug('Hello World') // 'hello-world-2'
 * reset() // Clears the seen slugs
 * slug('Hello World') // 'hello-world'
 */
export declare const slugger: (options?: SlugifyOptions) => {
    slug(v: string): string;
    reset(): void;
};
//# sourceMappingURL=slugger.d.ts.map