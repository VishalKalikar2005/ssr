import { createServerClient, createBrowserClient } from "./src/index";

async function main() {
  console.log("Testing aliases...");

  const serverClient = createServerClient("https://example.indobase.co", "key", {
    cookies: {
      getAll() { return [] },
      setAll() {}
    }
  });

  const browserClient = createBrowserClient("https://example.indobase.co", "key", {
    isSingleton: false
  });

  console.log("Server Client created:", !!serverClient);
  console.log("Browser Client created:", !!browserClient);

  if (serverClient && browserClient) {
    console.log("SUCCESS: Rebranded aliases work perfectly!");
  } else {
    throw new Error("FAILED: Clients were not created.");
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
