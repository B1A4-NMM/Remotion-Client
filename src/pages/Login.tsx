import { useState } from "react";
import { Button } from "@/components/ui/button";
import BottomPopup from "@/components/BottomPopup";
import kakao from "./../assets/img/kakao.svg";
import google from "./../assets/img/google.svg";
import { Canvas } from "@react-three/fiber";
import LoadingBlob from "@/components/Blob/Loading/LodingBlob";
import { demoLogin } from "@/api/services/auth";
// import { useAuth } from "@/hooks/useAuth";
// import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || "http://localhost:5173";

const SOCIAL_AUTH_URL = {
  kakao: `${BASE_URL}/auth/kakao`,
  google: `${BASE_URL}/auth/google`,
};

export default function Login() {
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleKakao = () =>
    (window.location.href = SOCIAL_AUTH_URL.kakao + `?state=${REDIRECT_URI}`);

  const handleGoogle = () =>
    (window.location.href = SOCIAL_AUTH_URL.google + `?state=${REDIRECT_URI}`);

  const handleDemo = async (id: "traveler" | "lee" | "harry" | "demo") => {
    try {
      const res = await demoLogin(id);
      const token = res.accessToken;
      if (token) {
        localStorage.setItem("accessToken", token);
        window.location.href = "/";
      } else {
        alert("토큰을 받아오지 못했습니다.");
      }
    } catch (e) {
      alert("데모 로그인 실패");
      console.error(e);
    }
  };

  return (
    <div className="relative min-h-screen h-full flex flex-col justify-center items-center px-4 text-foreground">
      <h1 className="text-2xl font-semibold mb-2 text-foreground text-center text-[#404040] dark:text-[#F5F5F5]">
        하루를 기록하면<br />
        내일이 달라지는 다이어리 <br />
      </h1>
      <h1 className="text-4xl font-semibold text-foreground text-center text-[#404040] dark:text-[#F5F5F5]">
        HaruDew
      </h1>

      {/* 로고 */}
      <div className="w-40 h-40 m-10">
        <Canvas camera={{ position: [0, 0, 3], fov: 90 }}>
          <LoadingBlob />
        </Canvas>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Button
          onClick={handleKakao}
          className="h-[48px] bg-white text-black hover:bg-[#ffe812] rounded-full justify-center items-center gap-3 px-4 py-2"
        >
          <img src={kakao} alt="Kakao Icon" className="w-5 h-5" />
          <span>카카오로 계속하기</span>
        </Button>

        <Button
          onClick={() => (window.location.href = SOCIAL_AUTH_URL.google + `?state=${REDIRECT_URI}`)}
          className="h-[48px] bg-white text-black hover:bg-[#404040] hover:text-white rounded-full justify-center items-center gap-3 px-4 py-2"
        >
          <img src={google} alt="Google Icon" className="w-5 h-5" />
          <span>구글로 계속하기</span>
        </Button>

        <Button
          onClick={() => setSheetOpen(true)}
          className="h-[48px] bg-white text-black hover:bg-[#F36B6B] hover:text-white rounded-full justify-center items-center gap-3 px-4 py-2"
        >
          <img src="./../assets/img/harudew_light.svg" alt="HaruDew Icon" className="w-5 h-5" />
          <span>하루뒤 둘러보기</span>
        </Button>
      </div>

      <BottomPopup
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        heightOption={{ wrapChildren: true }}
      >
        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
          <Button
            onClick={() => handleDemo("anne")}
            className="h-[48px] bg-white text-black hover:bg-[#F36B6B] hover:text-white rounded-full justify-center items-center gap-3 px-4 py-2"
          >
            <span>[Coming Soon] 🙋🏻‍♀️ 안네의 일기</span>
          </Button>

          <Button
            onClick={() => handleDemo("harry")}
            className="h-[48px] bg-white text-black hover:bg-[#72C9A3] hover:text-white rounded-full justify-center items-center gap-3 px-4 py-2"
          >
            <span>[Coming Soon] 🪄 해리포터의 일기</span>
          </Button>

          <Button
            onClick={() => handleDemo("lee")}
            className="h-[48px] bg-white text-black hover:bg-[#7DA7E3] hover:text-white rounded-full justify-center items-center gap-3 px-4 py-2"
          >
            <span>🌊 이순신 장군의 난중일기</span>
          </Button>

          <Button
            onClick={() => handleDemo("demo")}
            className="h-[48px] bg-white text-black hover:bg-[#FFD47A] hover:text-white rounded-full justify-center items-center gap-3 px-4 py-2"
          >
            <span>B1A4 아이들아 테스트는 여기서 하렴</span>
          </Button>
        </div>
      </BottomPopup>
    </div>
  );
}
