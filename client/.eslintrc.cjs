module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react/recommended",
    "airbnb",
    "airbnb-typescript",
  ],
  plugins: ["jsx-a11y", "@typescript-eslint", "import"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./client/tsconfig.json",
  },
  rules: {
    "react/jsx-filename-extension": [2, { extensions: [".ts", ".tsx"] }],
    "import/prefer-default-export": "off",
    "@typescript-eslint/quotes": ["error", "double"],
  },
};
