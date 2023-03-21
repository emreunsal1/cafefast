module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["next", "plugin:react/recommended", "airbnb"],
  rules: {
    quotes: ["error", "double"],
    camelcase: "off",
    "max-len": ["error", { code: 150 }], // default 80miş de formatlamıyor 150 yaptım,
    "react/prop-types": "off",
    "react/jsx-props-no-spreading": "off",
    "import/prefer-default-export": "off",
  },
};
