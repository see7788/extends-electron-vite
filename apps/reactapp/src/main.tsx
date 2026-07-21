import { ConfigProvider } from "antd";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routers";

createRoot(document.getElementById("root")!).render(
  <ConfigProvider theme={{
    token: {
      colorPrimary: "#52c41a",
      colorPrimaryHover: "#73d13d",
      colorPrimaryActive: "#389e0d",
    },
  }}>
    <Suspense fallback={null}>
      <RouterProvider router={router} />
    </Suspense>
  </ConfigProvider>,
);
