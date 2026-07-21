import { lazy } from "react";
import { createHashRouter, Navigate } from "react-router-dom";

const TodoTree = lazy(() => import("./todotree"));

export default createHashRouter([
  {
    path: "/",
    element: <Navigate replace to="/todotree" />,
  },
  {
    path: "/todotree",
    element: <TodoTree />,
  },
]);
