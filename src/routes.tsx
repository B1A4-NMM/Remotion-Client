import Home from "./pages/Home";

import Calendar from "./pages/Calendar";
import Diary from "./pages/Diary";
import Relation from "./pages/Relation";
import Test from "./pages/Test";
import TestResult from "./pages/TestResult";
import Login from "./pages/Login";
import GetAccess from "./pages/GetAccess";
export const routes = [
  { path: "/", element: <Home /> },
  { path: "/diary", element: <Diary /> },
  { path: "/calendar", element: <Calendar /> },
  { path: "/relation", element: <Relation /> },

  { path: "/test", element: <Test /> },
  { path: "/test/result", element: <TestResult /> },
  { path: "/login", element: <Login /> },
  { path: "/getAccess", element: <GetAccess /> },
];
