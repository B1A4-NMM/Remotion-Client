import api from "../axios";

// 스트레스 테스트 완료 알림
export const postStressTestComplete = async () => {
  try {
    const response = await api.post("/member/test/stress");
    return response.data;
  } catch (error) {
    console.error("스트레스 테스트 완료 알림 실패:", error);
    throw error;
  }
};

// 불안 테스트 완료 알림
export const postAnxietyTestComplete = async () => {
  try {
    const response = await api.post("/member/test/anxiety");
    return response.data;
  } catch (error) {
    console.error("불안 테스트 완료 알림 실패:", error);
    throw error;
  }
};

// 우울 테스트 완료 알림
export const postDepressionTestComplete = async () => {
  try {
    const response = await api.post("/member/test/depression");
    return response.data;
  } catch (error) {
    console.error("우울 테스트 완료 알림 실패:", error);
    throw error;
  }
};

// 통합 테스트 완료 알림 함수
export const postTestComplete = async (testType: "stress" | "anxiety" | "depression") => {
  try {
    let endpoint = "";
    switch (testType) {
      case "stress":
        endpoint = "/member/test/stress";
        break;
      case "anxiety":
        endpoint = "/member/test/anxiety";
        break;
      case "depression":
        endpoint = "/member/test/depression";
        break;
      default:
        throw new Error("유효하지 않은 테스트 타입입니다.");
    }

    const response = await api.post(endpoint);
    return response.data;
  } catch (error) {
    console.error("테스트 완료 알림 실패:", error);
    throw error;
  }
};
