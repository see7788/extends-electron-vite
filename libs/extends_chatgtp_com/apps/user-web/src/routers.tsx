import { Navigate, createHashRouter } from "react-router-dom";
import User from "./user";

export default createHashRouter([
  {
    path: "/",
    element: <Navigate to="/chat" replace />,
  },
  {
    path: "/chat",
    element: <User userRoute="chat" />,
  },
  {
    path: "/image",
    element: <User userRoute="image" />,
  },
  {
    path: "/research",
    element: <User userRoute="research" />,
  },
  {
    path: "*",
    element: <Navigate to="/chat" replace />,
  },
]);
