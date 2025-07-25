import { useNavigate, useLocation } from "react-router-dom"; // React Router import 추가
import "@/styles/togle.css";

const Title = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 확인용

  // 현재 경로에 따라 활성 버튼 판단
  const isTodosActive = location.pathname === "/todos";
  const isRoutineActive = location.pathname === "/routine";
  const isContentsActive = location.pathname === "/contents";
  const handleTodosClick = () => {
    if (!isTodosActive) {
      // 이미 캘린더 페이지라면 이동하지 않음
      navigate("/todos");
    }
  };

  const handleRoutineClick = () => {
    if (!isRoutineActive) {
      // 이미 루틴 페이지라면 이동하지 않음
      navigate("/routine");
    }
  };

  const handleContentsClick = () => {
    if (!isContentsActive) {
      // 이미 컨텐츠 페이지라면 이동하지 않음
      navigate("/contents");
    }
  };

  return (
    <div className="w-full pt-8">
      {/* 메인 헤더 */}
      <h1 className="text-3xl font-bold text-gray-900 pb-3">추천</h1>

      {/* 버튼 위치 - 3개 버튼 정렬 */}
      <div className="buttonContainer shadow-md">
        <button
          className={`button ${isTodosActive ? "active" : ""}`}
          onClick={handleTodosClick}
          aria-label="할일 버튼"
        >
          할 일
        </button>
        <button
          className={`button ${isRoutineActive ? "active" : ""}`}
          onClick={handleRoutineClick}
          aria-label="루틴 버튼"
        >
          회복 루틴
        </button>
        <button
          className={`button ${isContentsActive ? "active" : ""}`}
          onClick={handleContentsClick}
          aria-label="컨텐츠 버튼"
        >
          컨텐츠
        </button>
      </div>
    </div>
  );
};

export default Title;
