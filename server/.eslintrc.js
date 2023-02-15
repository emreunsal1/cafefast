module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base"],
  plugins: ["@typescript-eslint"],
  settings: {
    "import/resolver": {
      node: {
        paths: ["src"],
        extensions: [".ts"],
      },
    },
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    quotes: ["error", "double"],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        tsx: "never",
        ts: "never",
      },
    ],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: false,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    camelcase: "off",
    "max-len": ["error", { code: 150 }],
    "import/prefer-default-export": "off",
    "consistent-return": "off",
    "no-underscore-dangle": "off",
  },
};
