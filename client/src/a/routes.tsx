import React from "react";
import { RouteObject } from "react-router-dom";
import Auth from "../pages/Auth";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Auth />,
  },
];
