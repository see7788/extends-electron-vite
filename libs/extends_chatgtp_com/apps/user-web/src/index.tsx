import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routers";

const rootElement = document.getElementById("root");
createRoot(rootElement!).render(<RouterProvider router={router} />);
