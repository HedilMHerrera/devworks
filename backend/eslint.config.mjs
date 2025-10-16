import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores:[
      "prisma/",
    ],
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    rules: {
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
      "indent": ["error", 2],
      "comma-dangle": ["error", "always-multiline"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "space-before-function-paren": ["error", "never"],
      "keyword-spacing": ["error", { "before": true, "after": true }],
      "no-multiple-empty-lines": ["error", { "max": 1 }],
      "eol-last": ["error", "always"],
      "no-trailing-spaces": "error",

      "eqeqeq": ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",
      "curly": ["error", "all"],
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": "warn",
    },
  },
  {
    files: ["**/*.test.js", "**/__tests__/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
]);
