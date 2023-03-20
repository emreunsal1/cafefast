module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "next/babel",
    "next/core-web-vitals",
    "plugin:react/recommended",
    "airbnb",
  ],
  rules: {
    quotes: ["error", "double"],
    "max-len": ["error", { code: 150 }], // default 80miş de formatlamıyor 150 yaptım,
  },
};
