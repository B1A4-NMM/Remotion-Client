import { Link, useLocation } from "react-router-dom";

export default function BottomNavigation() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full max-w-[414px] mx-auto flex justify-around items-center h-14 z-50 bg-white">
      {/* Diary */}
      <Link to="/diary">
        <div className="flex flex-col items-center">
          <svg
            width="29"
            height="28"
            viewBox="0 0 29 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.5 3V25"
              stroke={path === "/diary" ? "#111111" : "#9C9C9C"}
              strokeWidth="1.5"
              strokeLinecap="square"
            />
            <path
              d="M25.5 14L3.5 14"
              stroke={path === "/diary" ? "#111111" : "#9C9C9C"}
              strokeWidth="1.5"
              strokeLinecap="square"
            />
            <path
              d="M22.5 6.16L6.07 21.93"
              stroke="#999C9C"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
            <path
              d="M22.5 22.16L6.07 6.07"
              stroke="#999C9C"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
          <span
            className={`text-xs ${path === "/diary" ? "text-[#111111] font-medium" : "text-[#9C9C9C] font-normal"}`}
          >
            Diary
          </span>
        </div>
      </Link>

      {/* Relation */}
      <Link to="/relation">
        <div className="flex flex-col items-center">
          <svg
            width="29"
            height="28"
            viewBox="0 0 29 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.91 18.17L12.19 12.92L15.85 17.1L19.29 11.71"
              stroke={path === "/relation" ? "#111111" : "#9C9C9C"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="22.87"
              cy="5.60"
              r="2.10"
              stroke={path === "/relation" ? "#111111" : "#9C9C9C"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className={`text-xs ${path === "/relation" ? "text-[#111111] font-medium" : "text-[#9C9C9C] font-normal"}`}
          >
            Relation
          </span>
        </div>
      </Link>

      {/* Calendar */}
      <Link to="/calendar">
        <div className="flex flex-col items-center">
          <svg
            width="29"
            height="28"
            viewBox="0 0 29 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.919 17.173L12.193 12.919L15.926 15.852L19.129 11.718"
              stroke={path === "/calendar" ? "#111111" : "#9C9C9C"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="22.863"
              cy="5.602"
              r="2.102"
              stroke={path === "/calendar" ? "#111111" : "#9C9C9C"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.318 4.421H4.035V24.5H24.5V11.187"
              stroke="#656565"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className={`text-xs ${path === "/calendar" ? "text-[#111111] font-medium" : "text-[#9C9C9C] font-normal"}`}
          >
            Calendar
          </span>
        </div>
      </Link>
    </div>
  );
}
