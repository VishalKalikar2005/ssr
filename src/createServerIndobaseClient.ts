import { createClient, IndobaseClient, IndobaseClientOptions } from "indobase-js";
import { VERSION } from "./version";
import type { ServerOptions } from "./types";

/**
 * Creates a Indobase Client for use on the server-side of a server-side
 * rendering (SSR) framework.
 *
 * @param indobaseUrl The URL of the Indobase project.
 * @param indobaseKey The `anon` API key of the Indobase project.
 * @param options Various configuration options.
 */
export function createServerIndobaseClient(
  indobaseUrl: string,
  indobaseKey: string,
  options?: IndobaseClientOptions & ServerOptions,
): IndobaseClient {
  if (!indobaseUrl || !indobaseKey) {
    throw new Error(
      `Your project's URL and Key are required to create a Indobase client!\n\nCheck your Indobase project's API settings to find these values\n\nhttps://indobase.com/dashboard/project/_/settings/api`,
    );
  }

  const client = createClient(indobaseUrl, indobaseKey, {
    ...options,
    global: {
      ...options?.global,
      headers: {
        ...options?.global?.headers,
        "X-Client-Info": `indobase-ssr/${VERSION} createServerIndobaseClient`,
      },
    },
  });

  return client;
}
