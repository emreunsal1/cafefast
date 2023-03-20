import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Orders from "./components/Orders";
import Register from "./pages/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App />
    ),
  },
  {
    path: "/register",
    element: (
      <Register />
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
