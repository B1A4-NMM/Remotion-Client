// App.tsx에 추가
import { Link } from "react-router-dom";
import { routes } from "./routes";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </>
  );
}
