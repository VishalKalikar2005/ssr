// Check if this package is being used as one of the deprecated auth-helpers packages
if (typeof process !== "undefined" && process.env?.npm_package_name) {
  const packageName = process.env.npm_package_name;
  const deprecatedPackages = [
    "@indobase/auth-helpers-nextjs",
    "@indobase/auth-helpers-react",
    "@indobase/auth-helpers-remix",
    "@indobase/auth-helpers-sveltekit",
  ];

  if (deprecatedPackages.includes(packageName)) {
    console.warn(`
╔════════════════════════════════════════════════════════════════════════════╗
║ ⚠️  IMPORTANT: Package Consolidation Notice                                ║
║                                                                            ║
║ The ${packageName.padEnd(35)} package name is deprecated.  ║
║                                                                            ║
║ You are now using @indobase/ssr - a unified solution for all frameworks.  ║
║                                                                            ║
║ The auth-helpers packages have been consolidated into @indobase/ssr       ║
║ to provide better maintenance and consistent APIs across frameworks.      ║
║                                                                            ║
║ Please update your package.json to use @indobase/ssr directly:            ║
║   npm uninstall ${packageName.padEnd(42)} ║
║   npm install @indobase/ssr                                               ║
║                                                                            ║
║ For more information, visit:                                              ║
║ https://indobase.com/docs/guides/auth/server-side                         ║
╚════════════════════════════════════════════════════════════════════════════╝
    `);
  }
}

export * from "./createBrowserIndobaseClient";
export * from "./createServerIndobaseClient";
export * from "./types";
export * from "./utils";

export { createBrowserIndobaseClient as createBrowserClient } from "./createBrowserIndobaseClient";
export { createServerIndobaseClient as createServerClient } from "./createServerIndobaseClient";
