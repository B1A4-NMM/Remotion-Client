import Login from "./pages/Login";
import GetAccess from "./pages/GetAccess";

import Home from "./pages/Home";
import Diary from "./pages/Diary";
import SearchPage from "./pages/SearchPage";
import Result from "./pages/Result";
import Loading6 from "./components/Loading/Loading6";
import Loading7 from "./components/Loading/Loading7";
import LoadingDiaryAnalysis from "./pages/LoadingDiaryAnalysis";

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

export const routes = [
  { path: "/", element: <Home /> },
  { path: "/diary/:date", element: <Diary /> },
  { path: "/calendar", element: <Calendar /> },
  { path: "/relation", element: <Relation /> },
  { path: "/relation/:id", element: <RelationDetail /> },
  { path: "/result/:id", element: <Result /> },
  { path: "/login", element: <Login /> },
  { path: "/getAccess", element: <GetAccess /> },
  { path: "/loading", element: <Loading6 /> },
  { path: "/analysis", element: <Analysis /> },
  { path: "/video", element: <Video /> },
  { path: "/routine", element: <Routine /> },
  { path: "/contents", element: <Contents /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/analysis/strength", element: <Strength /> },
  { path: "/analysis/stress", element: <Stress /> },
  { path: "/analysis/anxiety", element: <Anxiety /> },
  { path: "/analysis/depress", element: <Depress /> },
  { path: "/analysis/character", element: <Character /> },
  { path: "/loading7", element: <Loading7 /> },
];
