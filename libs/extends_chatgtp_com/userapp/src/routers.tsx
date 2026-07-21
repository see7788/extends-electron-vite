import { Navigate, createHashRouter } from "react-router-dom";
import DouyinDetailRouter from "./douyin-detail-page/router";
import PlaceholderRouter from "./placeholder-page/router";

export default createHashRouter([
  {
    path: "/",
    element: <Navigate to="/douyin-detail?topicId=demo-topic" replace />,
  },
  {
    path: "/douyin-detail",
    element: <DouyinDetailRouter />,
  },
  {
    path: "/placeholder",
    element: <PlaceholderRouter />,
  },
  {
    path: "*",
    element: <Navigate to="/douyin-detail?topicId=demo-topic" replace />,
  },
]);
