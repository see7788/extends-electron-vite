import { createHashRouter, Navigate } from "react-router-dom";

export default createHashRouter([
  {
    path: "/",
    element: <Navigate replace to="/todotree" />,
  },
  {
    path: "/todotree",
    lazy: async () => ({ Component: (await import("./todotree")).default }),
  },
  {
    path: "/email",
    lazy: async () => ({ Component: (await import("./email")).default }),
  },
  {
    path: "/file",
    lazy: async () => ({ Component: (await import("./file")).default }),
  },
  {
    path: "/sse",
    lazy: async () => ({ Component: (await import("./sse")).default }),
  },
  {
    path: "/tpl",
    lazy: async () => ({ Component: (await import("./tpl")).default }),
  },
  {
    path: "/tpl2",
    lazy: async () => ({ Component: (await import("./tpl2")).default }),
  },
  {
    path: "/tpl/global",
    lazy: async () => ({ Component: (await import("./tpl/global")).default }),
  },
]);
