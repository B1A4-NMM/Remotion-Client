import Home from "./pages/Home";

import Calendar from "./pages/Calendar";
import Diary from "./pages/Diary";
import Relation from "./pages/Relation";
import Result from "./pages/Result";
export const routes = [
  { path: "/", element: <Home /> },

  { path: "/diary", element: <Diary /> },
  { path: "/calendar", element: <Calendar /> },
  { path: "/relation", element: <Relation /> },
  { path: "/result", element: <Result /> },
];
