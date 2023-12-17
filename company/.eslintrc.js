module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "airbnb", "next"],
  plugins: ["import"],
  settings: {
    "import/resolver": {
      alias: {
        extensions: [".js", ".jsx"],
        map: [
          ["@", "./src"],
        ],
      },
    },
  },
  rules: {
    quotes: ["error", "double"],
    camelcase: "off",
    "max-len": ["error", { code: 150 }],
    "react/prop-types": "off",
    "react/jsx-props-no-spreading": "off",
    "import/prefer-default-export": "off",
    "consistent-return": "off",
    "react/button-has-type": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "react/no-array-index-key": "off",
    "no-underscore-dangle": "off",
    "no-param-reassign": "off",
    "react/jsx-no-constructed-context-values": "off",
    "@next/next/no-img-element": "off",
    "jsx-a11y/alt-text": "off",
  },
};
