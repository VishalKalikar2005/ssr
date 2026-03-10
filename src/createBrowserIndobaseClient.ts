import {
  createClient,
  IndobaseClient,
  IndobaseClientOptions,
} from "indobase-js";

import { VERSION } from "./version";
import { isBrowser } from "./utils";

import type {
  CookieMethodsBrowser,
  CookieMethodsBrowserDeprecated,
  CookieOptionsWithName,
} from "./types";

import { createStorageFromOptions } from "./cookies";

let cachedBrowserClient: IndobaseClient<any, any, any> | undefined;

/**
 * Creates a Indobase Client for use in a browser environment.
 *
 * In most cases you should not configure the `options.cookies` object, as this
 * is automatically handled for you. If you do customize this, prefer using the
 * `getAll` and `setAll` functions over `get`, `set` and `remove`. The latter
 * are deprecated due to being difficult to correctly implement and not
 * supporting some edge-cases. Both `getAll` and `setAll` (or both `get`, `set`
 * and `remove`) must be provided. Failing to provide the methods for setting
 * will throw an exception, and in previous versions of the library will result
 * in difficult to debug authentication issues such as random logouts, early
 * session termination or problems with inconsistent state.
 *
 * @param indobaseUrl The URL of the Indobase project.
 * @param indobaseKey The `anon` API key of the Indobase project.
 * @param options Various configuration options.
 */
export function createBrowserIndobaseClient<
  Database = any,
  SchemaName extends string &
    keyof Omit<Database, "__InternalIndobase"> = "public" extends keyof Omit<
    Database,
    "__InternalIndobase"
  >
    ? "public"
    : string & keyof Omit<Database, "__InternalIndobase">,
>(
  indobaseUrl: string,
  indobaseKey: string,
  options?: IndobaseClientOptions<SchemaName> & {
    cookies?: CookieMethodsBrowser;
    cookieOptions?: CookieOptionsWithName;
    cookieEncoding?: "raw" | "base64url";
    isSingleton?: boolean;
  },
): IndobaseClient<Database, SchemaName>;

/**
 * @deprecated Please specify `getAll` and `setAll` cookie methods instead of
 * the `get`, `set` and `remove`. These will not be supported in the next major
 * version.
 */
export function createBrowserIndobaseClient<
  Database = any,
  SchemaName extends string &
    keyof Omit<Database, "__InternalIndobase"> = "public" extends keyof Omit<
    Database,
    "__InternalIndobase"
  >
    ? "public"
    : string & keyof Omit<Database, "__InternalIndobase">,
>(
  indobaseUrl: string,
  indobaseKey: string,
  options?: IndobaseClientOptions<SchemaName> & {
    cookies: CookieMethodsBrowserDeprecated;
    cookieOptions?: CookieOptionsWithName;
    cookieEncoding?: "raw" | "base64url";
    isSingleton?: boolean;
  },
): IndobaseClient<Database, SchemaName>;

export function createBrowserIndobaseClient<
  Database = any,
  SchemaName extends string &
    keyof Omit<Database, "__InternalIndobase"> = "public" extends keyof Omit<
    Database,
    "__InternalIndobase"
  >
    ? "public"
    : string & keyof Omit<Database, "__InternalIndobase">,
>(
  indobaseUrl: string,
  indobaseKey: string,
  options?: IndobaseClientOptions<SchemaName> & {
    cookies?: CookieMethodsBrowser | CookieMethodsBrowserDeprecated;
    cookieOptions?: CookieOptionsWithName;
    cookieEncoding?: "raw" | "base64url";
    isSingleton?: boolean;
  },
): IndobaseClient<Database, SchemaName> {
  // singleton client is created only if isSingleton is set to true, or if isSingleton is not defined and we detect a browser
  const shouldUseSingleton =
    options?.isSingleton === true ||
    ((!options || !("isSingleton" in options)) && isBrowser());

  if (shouldUseSingleton && cachedBrowserClient) {
    return cachedBrowserClient;
  }

  if (!indobaseUrl || !indobaseKey) {
    throw new Error(
      `@indobase/ssr: Your project's URL and API key are required to create a Indobase client!\n\nCheck your Indobase project's API settings to find these values\n\nhttps://indobase.com/dashboard/project/_/settings/api`,
    );
  }

  const { storage } = createStorageFromOptions(
    {
      ...options,
      cookieEncoding: options?.cookieEncoding ?? "base64url",
    },
    false,
  );

  const client = createClient<Database, SchemaName>(indobaseUrl, indobaseKey, {
    // TODO: resolve type error
    ...(options as any),
    global: {
      ...options?.global,
      headers: {
        ...options?.global?.headers,
        "X-Client-Info": `indobase-ssr/${VERSION} createBrowserIndobaseClient`,
      },
    },
    auth: {
      ...options?.auth,
      ...(options?.cookieOptions?.name
        ? { storageKey: options.cookieOptions.name }
        : null),
      flowType: "pkce",
      autoRefreshToken: isBrowser(),
      detectSessionInUrl: isBrowser(),
      persistSession: true,
      storage,
      ...(options?.cookies &&
      "encode" in options.cookies &&
      options.cookies.encode === "tokens-only"
        ? {
            userStorage: options?.auth?.userStorage ?? window.localStorage,
          }
        : null),
    },
  });

  if (shouldUseSingleton) {
    cachedBrowserClient = client;
  }

  return client;
}
