import api from "../axios";

export const getMentalData = async (
  emotion: "스트레스" | "불안" | "우울" | "활력" | "안정" | "유대",
  period: string | number
) => {
  const response = await api.get("/emotion", {
    params: {
      emotion,
      period,
    },
    paramsSerializer: params => {
      const usp = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        usp.append(key, String(value));
      });
      return usp.toString();
    },
    timeout: 15000, // 15초 타임아웃 유지
  });

  return response.data;
};


export const getNegativeData = async (
  period: string | number
) => {
  const response = await api.get("/emotion/negative", {
    params: {
      period,
    }
  });

  return response.data;
};

export const getPositiveData = async (
  period: string | number
) => {
  const response = await api.get("/emotion/positive", {
    params: {
      period,
    }
  });

  return response.data;
};


export const getNegativeActData = async (
  period: string | number
) => {
  const response = await api.get("/emotion/activity/negative", {
    params: {
      period,
    }
  });

  return response.data;
};

export const getPositiveActData = async (
  period: string | number
) => {
  const response = await api.get("/emotion/activity/positive", {
    params: {
      period,
    }
  });

  return response.data;
};



