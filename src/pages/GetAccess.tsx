import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function GetAccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("access");
    // refreshToken은 이제 쿠키(HttpOnly)로 전달되므로 URL에 노출되지 않음

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
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
