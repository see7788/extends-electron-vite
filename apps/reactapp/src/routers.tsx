import { createHashRouter, Navigate } from "react-router-dom";

export default createHashRouter([
  {
    path: "/",
    element: <Navigate replace to="/todotree" />,
  },
  {
    path: "/todotree",
    lazy: async () => {
      const { default: TodoTree } = await import("./todotree");
      return { Component: TodoTree };
    },
  },
]);
