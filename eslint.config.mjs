import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Workspace-local dirs that are not app source:
    "Replit App/**", // reference copy of the Joyest Enterprise app (not ours to lint)
    ".opencode/**", // OpenCode tooling
    ".tmp/**", // scratch/context files
  ]),
]);

export default eslintConfig;
