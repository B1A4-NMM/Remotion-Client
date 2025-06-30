import { Button } from "@/components/ui/button";
import homeLogo from "./../assets/img/homeLogo.svg";
import kakao from "./../assets/img/kakao.svg";
import google from "./../assets/img/google.svg";

const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

const SOCIAL_AUTH_URL = {
  kakao: `${BASE_URL}/auth/kakao`,
  google: `${BASE_URL}/auth/google`,
};
export default function Login() {
  return (
    <div className=" min-h-screen h-full flex flex-col justify-center items-center px-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">
        A journal for your wellbeing
      </h1>

      {/* 로고 */}
      <div className="w-40 h-40 mb-10">
        <img
          src={homeLogo}
          alt="Wellbeing Logo"
          className="w-full h-full object-contain rounded-full shadow-xl"
        />
      </div>

      {/* 소셜 로그인 버튼 */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button
          onClick={() => (window.location.href = SOCIAL_AUTH_URL.kakao)}
          className="bg-white text-black hover:bg-[#ffe812] rounded-full justify-start gap-3 px-4 py-2"
        >
          <img src={kakao} alt="Kakao Icon" className="w-5 h-5" />
          <span>카카오로 계속하기</span>
        </Button>

        <Button
          onClick={() => (window.location.href = SOCIAL_AUTH_URL.google)}
          className="bg-white text-black hover:bg-gray-200 rounded-full justify-start gap-3 px-4 py-2"
        >
          <img src={google} alt="Google Icon" className="w-5 h-5" />
          <span>구글로 계속하기</span>
        </Button>
      </div>
    </div>
  );
}
