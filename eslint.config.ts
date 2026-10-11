import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
    { ignores: ["dist", "node_modules"] },
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    tseslint.configs.recommended,
    {
        rules: {
            "@typescript-eslint/no-unused-vars": "error",
            curly: "error",
            semi: ["error", "always"],
            quotes: ["error", "double"],
            indent: ["error", 4],
            "object-curly-spacing": ["error", "always"],
        },
    },
]);
