import Home from "./pages/Home";

import Calendar from "./pages/Calendar";
import Diary from "./pages/Diary";
import Relation from "./pages/Relation";

import Result from "./pages/Result";
import Test from "./pages/Test";
import TestResult from "./components/TestResult";
import Login from "./pages/Login";
import GetAccess from "./pages/GetAccess";
import Loading6 from "./components/Loading/Loading6";
import Analysis from "./pages/Analysis";
import AboutMe from "./pages/AboutMe";
import Map from "./pages/Map";
import Video from "./pages/Video";
import Routine from "./pages/Routine";
import Contents from "./pages/Contents";

import Strength from "./pages/analysis/Strength";
import Stress from "./pages/analysis/Stress";
import Anxiety from "./pages/analysis/Anxiety";
import Depress from "./pages/analysis/Depress";
import Character from "./pages/analysis/Character";

import Action from "./pages/Action";
export const routes = [
  { path: "/", element: <Home /> },
  { path: "/diary/:date", element: <Diary /> },
  { path: "/calendar", element: <Calendar /> },
  { path: "/relation", element: <Relation /> },
  { path: "/result/:id", element: <Result /> },
  { path: "/test", element: <Test /> },
  { path: "/test/result", element: <TestResult /> },
  { path: "/login", element: <Login /> },
  { path: "/getAccess", element: <GetAccess /> },
  { path: "/loading", element: <Loading6 /> },
  { path: "/analysis", element: <Analysis /> },
  { path: "/aboutme", element: <AboutMe /> },
  { path: "/map", element: <Map /> },
  { path: "/video", element: <Video /> },
  { path: "/action", element: <Action /> },
  { path: "/routine", element: <Routine /> },
  { path: "/contents", element: <Contents /> },
  { path: "/analysis/strength", element: <Strength /> },
  { path: "/analysis/stress", element: <Stress /> },
  { path: "/analysis/anxiety", element: <Anxiety /> },
  { path: "/analysis/depress", element: <Depress /> },
  { path: "/analysis/character", element: <Character /> },
];
