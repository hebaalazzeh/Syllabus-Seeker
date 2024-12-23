import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

module.exports = {
  rules: {
    "@typescript-eslint/no-unused-vars": "off", // Disable unused vars rule
    "@typescript-eslint/no-explicit-any": "warn", // Downgrade `any` errors to warnings
    "react/no-unescaped-entities": "off", // Allow unescaped characters
  },
};


export default eslintConfig;


