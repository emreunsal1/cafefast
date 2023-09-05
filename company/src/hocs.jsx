import React from "react";

const { MenuDetailContext } = require("./context/MenuContext");

export const withMenuDetail = (component) => function () {
  return <MenuDetailContext>{component}</MenuDetailContext>;
};
