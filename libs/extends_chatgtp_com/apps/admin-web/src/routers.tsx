import { Navigate, createHashRouter } from "react-router-dom";
import AdminWebLayout from "./layout";

const chatgptBrowserLazy = async () => {
  const { default: ChatgptBrowser } = await import("./chatgptBrowser");
  return { Component: ChatgptBrowser };
};

export default createHashRouter([
  {
    element: <AdminWebLayout />,
    HydrateFallback: () => null,
    children: [
      {
        path: "/",
        element: <Navigate to="/admin" replace />,
      },
      {
        path: "/admin",
        lazy: async () => {
          const { default: Admin } = await import("./admin");
          return { Component: Admin };
        },
        children: [
          {
            path: "chatgptBrowser",
            lazy: chatgptBrowserLazy,
          },
        ],
      },
      {
        path: "/chatgptBrowser",
        lazy: chatgptBrowserLazy,
      },
      {
        path: "/topic",
        lazy: async () => {
          const { default: Topic } = await import("./topic");
          return { Component: Topic };
        },
      },
      {
        path: "/connection",
        lazy: async () => {
          const { default: ConnectionPanel } = await import("./connection");
          return { Component: ConnectionPanel };
        },
      },
      {
        path: "/connection",
        element: <Navigate to="/connection" replace />,
      },
      {
        path: "*",
        element: <Navigate to="/admin" replace />,
      },
    ],
  },
]);
