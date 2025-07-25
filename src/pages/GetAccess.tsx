import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function GetAccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("access");

    if (token) {
      localStorage.setItem("accessToken", token);
      navigate("/");
    } else {
      console.error("토큰 없음");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-xl">로그인 처리 중...</p>
    </div>
  );
}
