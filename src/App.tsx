// App.tsx에 추가
import { Routes, Route } from "react-router-dom";
import { routes } from "./routes";

export default function App() {
  return (
    <div className="w-full flex justify-center items-start bg-white min-h-screen">
      <div className="w-full max-w-[414px] bg-black text-white min-h-screen border border-gray-300">
        {/* ✅ 라우팅되는 컴포넌트들이 여기에 그려짐 */}
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </div>
    </div>
  );
}
