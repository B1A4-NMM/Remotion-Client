import { Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Layout 이라는 껍데기로 감싼다!  */}
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>
    </Routes>
  );
}
