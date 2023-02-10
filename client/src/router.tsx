import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Orders from "./components/Orders";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App />
    ),
  },
  {
    path: "/siparislerim",
    element: (
      <Orders />
    ),
  },
]);

export default router;
