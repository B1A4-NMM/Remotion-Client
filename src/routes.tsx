import Home from "./pages/home";
import About from "./pages/about";
import Calendar from "./pages/calendar";
import Diary from "./pages/diary";
import Relation from "./pages/relation";
export const routes = [
  { path: "/home", element: <Home /> },
  { path: "/", element: <About /> },
  { path: "/diary", element: <Diary /> },
  { path: "/calendar", element: <Calendar /> },
  { path: "/relation", element: <Relation /> },
];
