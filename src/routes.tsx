import Login from "./pages/Login";
import GetAccess from "./pages/GetAccess";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Diary from "./pages/Diary";
import SearchPage from "./pages/SearchPage";
import Result from "./pages/Result";
// import Loading6 from "./components/Loading/Loading6";

import Video from "./pages/Video";
import Routine from "./pages/Routine";
import Contents from "./pages/Contents";

import Analysis from "./pages/Analysis";
import Strength from "./pages/analysis/Strength";
import Relation from "./pages/Relation";
import RelationDetail from "./pages/RelationDetail";
import Notifications from "./pages/Notification";

import Todos from "./pages/Todos";
import Mypage from "./pages/Mypage";
import Negative from "./pages/analysis/Negative";
import Positive from "./pages/analysis/Positive";

export const routes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/diary/:date",
    element: (
      <ProtectedRoute>
        <Diary />
      </ProtectedRoute>
    ),
  },
  {
    path: "/todos",
    element: (
      <ProtectedRoute>
        <Todos />
      </ProtectedRoute>
    ),
  },
  {
    path: "/relation",
    element: (
      <ProtectedRoute>
        <Relation />
      </ProtectedRoute>
    ),
  },
  {
    path: "/relation/:id",
    element: (
      <ProtectedRoute>
        <RelationDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/result/:id",
    element: (
      <ProtectedRoute>
        <Result />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute requireAuth={false}>
        <Login />
      </ProtectedRoute>
    ),
  },
  {
    path: "/getAccess",
    element: (
      <ProtectedRoute requireAuth={false}>
        <GetAccess />
      </ProtectedRoute>
    ),
  },

  {
    path: "/video",
    element: (
      <ProtectedRoute>
        <Video />
      </ProtectedRoute>
    ),
  },
  {
    path: "/routine",
    element: (
      <ProtectedRoute>
        <Routine />
      </ProtectedRoute>
    ),
  },
  {
    path: "/contents",
    element: (
      <ProtectedRoute>
        <Contents />
      </ProtectedRoute>
    ),
  },
  {
    path: "/search",
    element: (
      <ProtectedRoute>
        <SearchPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/analysis/strength",
    element: (
      <ProtectedRoute>
        <Strength />
      </ProtectedRoute>
    ),
  },
  {
    path: "/analysis/부정",
    element: (
      <ProtectedRoute>
        <Negative />
      </ProtectedRoute>
    ),
  },
  {
    path: "/analysis/긍정",
    element: (
      <ProtectedRoute>
        <Positive />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mypage",
    element: (
      <ProtectedRoute>
        <Mypage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifications",
    element: (
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    ),
  },
];
