import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function GetAccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("access");
    const refreshToken = params.get("refresh");

    if (accessToken && refreshToken) {
      // Access Token과 Refresh Token 모두 localStorage에 저장
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      navigate("/");
    } else {
      console.error("토큰 없음");
      navigate("/login");
    }
  }, [navigate, location.search]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-xl">로그인 처리 중...</p>
    </div>
  );
}
