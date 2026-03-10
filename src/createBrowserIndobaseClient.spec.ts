import { describe, it, expect } from "vitest";

import { MAX_CHUNK_SIZE, stringToBase64URL } from "./utils";
import { CookieOptions } from "./types";
import { createBrowserIndobaseClient } from "./createBrowserIndobaseClient";

describe("createServerIndobaseClient", () => {
  describe("validation", () => {
    it("should throw an error on empty URL and anon key", async () => {
      expect(() => {
        createBrowserIndobaseClient("URL", "");
      }).toThrow();

      expect(() => {
        createBrowserIndobaseClient("", "anon key");
      }).toThrow();
    });
  });
});
