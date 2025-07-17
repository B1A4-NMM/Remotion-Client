import { useState } from "react";
import { Button } from "@/components/ui/button";
import BottomPopup from "@/components/routine/BottomPopup";
import kakao from "./../assets/img/kakao.svg";
import google from "./../assets/img/google.svg";
import { Canvas } from "@react-three/fiber";
import SimpleBlob from "@/components/Blob/Simple/SimpleBlob";
import { demoLogin } from "@/api/services/auth";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

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
      <h1 className="text-2xl font-bold mb-6 text-foreground text-left">
        하루를 기록하면 <br />
        내일이 달라지는 다이어리
      </h1>

      {/* 로고 */}
      <div className="w-40 h-40 m-10">
        <Canvas camera={{ position: [0, 0, 3], fov: 90 }}>
          <SimpleBlob />
        </Canvas>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button
          onClick={handleKakao}
          className="h-[48px] bg-white text-black hover:bg-[#ffe812] rounded-full justify-center items-center gap-3 px-4 py-2"
        >
          <img src={kakao} alt="Kakao Icon" className="w-5 h-5" />
          <span>카카오로 계속하기</span>
        </Button>

        <Button
          onClick={() => (window.location.href = SOCIAL_AUTH_URL.google + `?state=${REDIRECT_URI}`)}
          className="h-[48px] bg-white text-black hover:bg-gray-200 rounded-full justify-center items-center gap-3 px-4 py-2"
        >
          <img src={google} alt="Google Icon" className="w-5 h-5" />
          <span>구글로 계속하기</span>
        </Button>

        <Button
          onClick={() => setSheetOpen(true)}
          className="h-[48px] bg-white text-black hover:bg-gray-200 rounded-full justify-center items-center gap-3 px-4 py-2"
        >
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
            onClick={() => handleDemo("traveler")}
            className="h-[48px] bg-white text-black hover:bg-gray-200 rounded-full justify-center items-center gap-3 px-4 py-2"
          >
            <span>세계 여행자의 일기</span>
          </Button>

          <Button
            onClick={() => handleDemo("lee")}
            className="h-[48px] bg-white text-black hover:bg-gray-200 rounded-full justify-center items-center gap-3 px-4 py-2"
          >
            <span>이순신 장군의 난중일기</span>
          </Button>

          <Button
            onClick={() => handleDemo("harry")}
            className="h-[48px] bg-white text-black hover:bg-gray-200 rounded-full justify-center items-center gap-3 px-4 py-2"
          >
            <span>해리포터의 일기</span>
          </Button>

          <Button
            onClick={() => handleDemo("demo")}
            className="h-[48px] bg-white text-black hover:bg-gray-200 rounded-full justify-center items-center gap-3 px-4 py-2"
          >
            <span>demo data</span>
          </Button>
        </div>
      </BottomPopup>
    </div>
  );
}
