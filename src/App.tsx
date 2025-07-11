import { Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { routes } from "./routes";
import Layout from "./Layout";
import { ThemeProvider } from "./components/Theme-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AnimatePresence mode="wait">

        <Routes>
          <Route element={<Layout />}>
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>
        </Routes>
      </AnimatePresence>
    </ThemeProvider>
  );
}
