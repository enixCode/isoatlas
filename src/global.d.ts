// Values injected at build time by webpack's DefinePlugin.
declare global {
  let PACKAGE_VERSION: string;
  let REPOSITORY_URL: string;
}

// Keeps this file a module, which `declare global` requires.
export {};
