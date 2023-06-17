const defaultEslintrc = require("./.eslintrc.cjs");

module.exports = {
  ...defaultEslintrc,
  rules: {
    ...defaultEslintrc.rules,
    indent: ["error", 2],
    semi: ["error", "always"],
    "lines-between-class-members": ["error", "always"],
    "padding-line-between-statements": [
      "error",
      {
        blankLine: "always",
        prev: ["let", "const"],
        next: ["multiline-block-like", "multiline-expression"],
      },
      { blankLine: "always", prev: "function", next: "*" },
      {
        blankLine: "always",
        prev: ["multiline-block-like", "multiline-expression"],
        next: ["let", "const", "function", "try", "return"],
      },
      {
        blankLine: "always",
        prev: "import",
        next: ["let", "const", "function", "try"],
      },
      { blankLine: "always", prev: "*", next: "export" },
      {
        blankLine: "always",
        prev: ["multiline-let", "multiline-const", "multiline-expression"],
        next: "function",
      },
    ],
  },
  ignorePatterns: ["**/*.test.*", "**/*.d.*"],
};
