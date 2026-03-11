import { createClient, IndobaseClient, IndobaseClientOptions } from "indobase-js";
import { VERSION } from "./version";

let cachedBrowserClient: IndobaseClient | undefined;

/**
 * Creates a Indobase Client for use in a browser environment.
 *
 * @param indobaseUrl The URL of the Indobase project.
 * @param indobaseKey The `anon` API key of the Indobase project.
 * @param options Various configuration options.
 */
export function createBrowserIndobaseClient(
  indobaseUrl: string,
  indobaseKey: string,
  options?: IndobaseClientOptions & {
    isSingleton?: boolean;
  },
): IndobaseClient {
  const shouldUseSingleton =
    options?.isSingleton === true ||
    ((!options || !("isSingleton" in options)) && typeof window !== "undefined");

  if (shouldUseSingleton && cachedBrowserClient) {
    return cachedBrowserClient;
  }

  if (!indobaseUrl || !indobaseKey) {
    throw new Error(
      `@indobase/ssr: Your project's URL and API key are required to create a Indobase client!\n\nCheck your Indobase project's API settings to find these values\n\nhttps://indobase.com/dashboard/project/_/settings/api`,
    );
  }

  const client = createClient(indobaseUrl, indobaseKey, {
    ...options,
    global: {
      ...options?.global,
      headers: {
        ...options?.global?.headers,
        "X-Client-Info": `indobase-ssr/${VERSION} createBrowserIndobaseClient`,
      },
    },
  });

  if (shouldUseSingleton) {
    cachedBrowserClient = client;
  }

  return client;
}
