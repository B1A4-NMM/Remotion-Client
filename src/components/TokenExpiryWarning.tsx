import React, { useEffect } from "react";
import { useUserStore } from "../store/userStore";

const TokenExpiryWarning: React.FC = () => {
  const { tokenExpiryWarning, setTokenExpiryWarning } = useUserStore();

  // 10초 후 경고 자동 숨김
  useEffect(() => {
    if (tokenExpiryWarning) {
      const timer = setTimeout(() => {
        setTokenExpiryWarning(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [tokenExpiryWarning, setTokenExpiryWarning]);

  if (!tokenExpiryWarning) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded shadow-lg max-w-sm">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">세션이 곧 만료됩니다</p>
          <p className="text-xs mt-1">작업을 저장하고 다시 로그인해주세요.</p>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={() => setTokenExpiryWarning(false)}
            className="text-yellow-400 hover:text-yellow-600"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenExpiryWarning;
