import Login from "./pages/Login";
import GetAccess from "./pages/GetAccess";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Diary from "./pages/Diary";
import SearchPage from "./pages/SearchPage";
import Result from "./pages/Result";
import Loading6 from "./components/Loading/Loading6";

import Video from "./pages/Video";
import Routine from "./pages/Routine";
import Contents from "./pages/Contents";

import Analysis from "./pages/Analysis";
import Strength from "./pages/analysis/Strength";
import Stress from "./pages/analysis/Stress";
import Anxiety from "./pages/analysis/Anxiety";
import Depress from "./pages/analysis/Depress";
import Character from "./pages/analysis/Character";
import Relation from "./pages/Relation";
import RelationDetail from "./pages/RelationDetail";

import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";
import Mypage from "./pages/Mypage";
// import Todos from "./pages/Todos";

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
    path: "/calendar",
    element: (
      <ProtectedRoute>
        <Calendar />
      </ProtectedRoute>
    ),
  },
  // {
  //   path: "/todos",
  //   element: (
  //     <ProtectedRoute>
  //       <Todos />
  //     </ProtectedRoute>
  //   ),
  // },
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
  { path: "/loading", element: <Loading6 /> },
  {
    path: "/analysis",
    element: (
      <ProtectedRoute>
        <Analysis />
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
    path: "/analysis/스트레스",
    element: (
      <ProtectedRoute>
        <Stress />
      </ProtectedRoute>
    ),
  },
  {
    path: "/analysis/불안",
    element: (
      <ProtectedRoute>
        <Anxiety />
      </ProtectedRoute>
    ),
  },
  {
    path: "/analysis/우울",
    element: (
      <ProtectedRoute>
        <Depress />
      </ProtectedRoute>
    ),
  },
  {
    path: "/analysis/character",
    element: (
      <ProtectedRoute>
        <Character />
      </ProtectedRoute>
    ),
  },
  {
    path: "/analysis/활력",
    element: (
      <ProtectedRoute>
        <Vitality />
      </ProtectedRoute>
    ),
  },
  {
    path: "/analysis/안정",
    element: (
      <ProtectedRoute>
        <Stable />
      </ProtectedRoute>
    ),
  },
  {
    path: "/analysis/유대",
    element: (
      <ProtectedRoute>
        <RelationBond />
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
    element: <NotFound />,
  },
];
