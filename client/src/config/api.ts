/**
 * Where the REST API lives — one source, because there used to be eleven.
 *
 * `NEXT_PUBLIC_*` values are inlined into the JavaScript bundle at **build**
 * time, not read at runtime. So a build that was not handed
 * `NEXT_PUBLIC_API_URL` ships whatever is written as the fallback here, and it
 * ships it to every visitor.
 *
 * The fallback used to be `http://localhost:5000/api` in all eleven places. On
 * a deployed site that does not mean "the server" — it means **the machine of
 * whoever is looking at the page**. Chrome sees a public page reaching for a
 * local address and asks the visitor for permission ("Access other apps and
 * services on this device"), on every page load, forever, because granting it
 * cannot help: there is no server on the visitor's machine. That is exactly
 * what happened to the Coolify deployment on 7 August 2026.
 *
 * So the fallback is now empty in production. An unconfigured build makes no
 * API calls at all rather than knocking on the visitor's door — see
 * `baseApi.ts`, which turns that into a clean error instead of a request.
 *
 * Development keeps the old default so nothing changes locally, and
 * `client/.env.local` sets it explicitly anyway.
 *
 * To point this at a real backend: set `NEXT_PUBLIC_API_URL` in Coolify as a
 * **Build Variable** (ticked as such — a plain runtime variable arrives too
 * late) and redeploy. It must be `https://` when the site is served over
 * https, or the browser blocks it as mixed content.
 */
const isDev = process.env.NODE_ENV === 'development';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || (isDev ? 'http://localhost:5000/api' : '');

/** False when the build was never told where the API is. */
export const API_CONFIGURED = API_URL !== '';
