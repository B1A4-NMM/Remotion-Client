import { useAuth } from "@/hooks/useAuth";

// API 요청에 토큰 자동 추가
export const createAuthenticatedRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 401 Unauthorized 응답 시 자동 로그아웃
  if (response.status === 401) {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
    throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
  }

  return response;
};

// API 응답 처리 유틸리티
export const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// API 요청 래퍼 함수
export const apiRequest = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const response = await createAuthenticatedRequest(url, options);
  return handleApiResponse(response);
};
