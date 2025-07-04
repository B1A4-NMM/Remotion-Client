import { Link, useLocation } from "react-router-dom";

export default function BottomNavigation() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full max-w-[414px] mx-auto flex justify-around items-center h-14 z-50 bg-[#1E1E1E]">
      {/* Diary */}
      <Link to="/">
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
              stroke={path === "/" ? "#ffffff" : "#9C9C9C"}
              strokeWidth="1.5"
              strokeLinecap="square"
            />
            <path
              d="M25.5 14L3.5 14"
              stroke={path === "/" ? "#ffffff" : "#9C9C9C"}
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
            className={`text-xs ${path === "/" ? "text-white font-medium" : "text-[#9C9C9C] font-normal"}`}
          >
            Diary
          </span>
        </div>
      </Link>

      {/* Report */}
      <Link to="/report">
        <div className="flex flex-col items-center">
          <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color={path === "/report" ? "#ffffff" : "#9C9C9C"}>
          <path d="M10 9H6" stroke={path === "/report" ? "#ffffff" : "#9C9C9C"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M15.5 11C14.1193 11 13 9.88071 13 8.5C13 7.11929 14.1193 6 15.5 6C16.8807 6 18 7.11929 18 8.5C18 9.88071 16.8807 11 15.5 11Z" stroke={path === "/report" ? "#ffffff" : "#9C9C9C"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M6 6H9" stroke={path === "/report" ? "#ffffff" : "#9C9C9C"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M18 18L13.5 15L11 17L6 13" stroke={path === "/report" ? "#ffffff" : "#9C9C9C"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4Z" stroke={path === "/report" ? "#ffffff" : "#9C9C9C"} stroke-width="1.5"></path></svg>
          <span
            className={`text-xs ${path === "/report" ? "text-white font-medium" : "text-[#9C9C9C] font-normal"}`}
          >
            Report
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
              stroke={path === "/relation" ? "#ffffff" : "#9C9C9C"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="22.87"
              cy="5.60"
              r="2.10"
              stroke={path === "/relation" ? "#ffffff" : "#9C9C9C"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className={`text-xs ${path === "/relation" ? "text-white font-medium" : "text-[#9C9C9C] font-normal"}`}
          >
            Analysis
          </span>
        </div>
      </Link>

      {/* Calendar */}
      <Link to="/calendar">
        <div className="flex flex-col items-center">
        <svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color={path === "/action" ? "#ffffff" : "#9C9C9C"}>
        <path d="M9.95242 9.62272L11.5109 6.31816C11.711 5.89395 12.289 5.89395 12.4891 6.31816L14.0476 9.62272L17.5329 10.1559C17.9801 10.2243 18.1583 10.7996 17.8346 11.1296L15.313 13.7001L15.9081 17.3314C15.9845 17.7978 15.5168 18.1534 15.1167 17.9331L12 16.2177L8.88328 17.9331C8.48316 18.1534 8.01545 17.7978 8.09187 17.3314L8.68695 13.7001L6.16545 11.1296C5.8417 10.7996 6.01993 10.2243 6.46711 10.1559L9.95242 9.62272Z" stroke={path === "/action" ? "#ffffff" : "#9C9C9C"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M22 12L23 12" stroke={path === "/action" ? "#ffffff" : "#9C9C9C"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M12 2V1" stroke={path === "/action" ? "#ffffff" : "#9C9C9C"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M12 23V22" stroke={path === "/action" ? "#ffffff" : "#9C9C9C"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M20 20L19 19" stroke={path === "/action" ? "#ffffff" : "#9C9C9C"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M20 4L19 5" stroke={path === "/action" ? "#ffffff" : "#9C9C9C"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M4 20L5 19" stroke={path === "/action" ? "#ffffff" : "#9C9C9C"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M4 4L5 5" stroke={path === "/action" ? "#ffffff" : "#9C9C9C"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M1 12L2 12" stroke={path === "/action" ? "#ffffff" : "#9C9C9C"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          <span
            className={`text-xs ${path === "/calendar" ? "text-white font-medium" : "text-[#9C9C9C] font-normal"}`}
          >
            Action
          </span>
        </div>
      </Link>
    </div>
  );
}
