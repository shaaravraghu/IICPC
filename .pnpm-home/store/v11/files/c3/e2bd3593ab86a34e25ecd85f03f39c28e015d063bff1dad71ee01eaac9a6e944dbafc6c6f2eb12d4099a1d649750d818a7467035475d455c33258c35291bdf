/**
 * Convenience constructor for the success variant of {@link Result}.
 *
 * Lets call sites avoid spelling out `{ ok: true, data: ... }` over and
 * over while keeping the discriminant inferable.
 *
 * @example
 * return ok(user)
 */
export const ok = (data) => ({ ok: true, data });
/**
 * Convenience constructor for the failure variant of {@link Result}.
 *
 * Accepts the typed error and an optional human-readable message so
 * callers can surface user-facing details alongside the discriminated
 * code.
 *
 * @example
 * return err('CONFLICT', 'Slug is already taken')
 *
 * @example
 * return err('Document not found')
 */
export const err = (error, message) => ({
    ok: false,
    error,
    message,
});
