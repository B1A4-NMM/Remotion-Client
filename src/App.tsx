import { Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { routes } from "./routes";
import Layout from "./Layout";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./contexts/AuthContext";
import LogoutModal from "./components/LogoutModal";
import { useLogoutModalStore } from "./store/logoutModalStore";
import { setLogoutModalStore } from "./api/axios";
import { useEffect } from "react";

export default function App() {
  const { isOpen, closeModal } = useLogoutModalStore();

  useEffect(() => {
    // axios 인터셉터에 store 설정
    setLogoutModalStore(useLogoutModalStore.getState());
  }, []);

  const handleLogoutConfirm = () => {
    closeModal();
    window.location.href = "/login";
  };

  return (
    <AuthProvider>
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
        <LogoutModal open={isOpen} onConfirm={handleLogoutConfirm} />
      </ThemeProvider>
    </AuthProvider>
  );
}
