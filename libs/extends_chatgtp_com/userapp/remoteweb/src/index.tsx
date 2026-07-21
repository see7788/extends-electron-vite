import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import useUserAppStore from "userapp-src/store";
import router from "userapp-src/routers";
import { preloadResolve } from "userapp-src/preload";

const rootElement = document.getElementById("root");
if (rootElement) {
  const preload = preloadResolve();
  useUserAppStore.getState().userActions.ipcInit(preload);
  createRoot(rootElement).render(<RouterProvider router={router} />);
}
