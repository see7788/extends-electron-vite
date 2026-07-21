import { createHashRouter, Navigate } from "react-router-dom";
import TopicChat from "./topic/chat";
import TopicImage from "./topic/image";
import TopicResearch from "./topic/research";

export default createHashRouter([
  {
    path: "/",
    element: <Navigate to="/chat" replace />,
  },
  {
    path: "/chat",
    element: <TopicChat />,
  },
  {
    path: "/image",
    element: <TopicImage />,
  },
  {
    path: "/research",
    element: <TopicResearch />,
  },
  {
    path: "*",
    element: <Navigate to="/chat" replace />,
  },
]);

