import React, { useEffect } from "react";

const Loading = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400&display=swap');

      * {
        box-sizing: border-box;
      }
      *::before, *::after {
        box-sizing: border-box;
      }

      body, html {
        margin: 0;
        padding: 0;
        overflow: hidden;
        font-family: 'Roboto', sans-serif;
        background: #1E1E1E;
        min-height: 100vh;
      }

      #container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        position: relative;
        transform: scale(0.85);
      }

      .divider {
        position: absolute;
        z-index: 2;
        top: 65px;
        left: 200px;
        width: 50px;
        height: 15px;
        background: #fff;
      }

      .loading-text {
        position: relative;
        font-size: 3.75rem;
        font-weight: 300;
        margin: 0;
        white-space: nowrap;
      }

      .loading-text::before {
        content: "";
        position: absolute;
        z-index: 1;
        top: 40px;
        left: 115px;
        width: 6px;
        height: 6px;
        background: #fff;
        border-radius: 50%;
        animation: dotMove 1800ms cubic-bezier(0.25,0.25,0.75,0.75) infinite;
      }

      .letter {
        display: inline-block;
        position: relative;
        color: #fff;
        letter-spacing: 8px;
      }

      /* ✅ L에 직접 애니메이션 적용 */
      .letter:nth-child(1) {
        transform-origin: bottom;
        animation: lineStretch 1800ms cubic-bezier(0.25, 0.25, 0.75, 0.75) infinite;
      }

      /* i 글자 애니메이션은 기존대로 유지 */
      .letter:nth-child(5) {
        transform-origin: 100% 70%;
        animation: letterStretch 1800ms cubic-bezier(0.25,0.23,0.73,0.75) infinite;
      }

      .letter:nth-child(5)::before {
        content: "";
        position: absolute;
        top: 15px;
        left: 2px;
        width: 9px;
        height: 15px;
        background: #fff;
      }

      /* 점 애니메이션 */
      @keyframes dotMove {
        0%, 100% {
          transform: rotate(180deg) translate(-110px, -10px) rotate(-180deg);
        }
        50% {
          transform: rotate(0deg) translate(-111px, 10px) rotate(0deg);
        }
      }

      @keyframes letterStretch {
        0%, 100% {
          transform: scale(1, 0.35);
          transform-origin: 100% 75%;
        }
        8%, 28% {
          transform: scale(1, 2.125);
          transform-origin: 100% 67%;
        }
        37% {
          transform: scale(1, 0.875);
          transform-origin: 100% 75%;
        }
        46% {
          transform: scale(1, 1.03);
          transform-origin: 100% 75%;
        }
        50%, 97% {
          transform: scale(1);
          transform-origin: 100% 75%;
        }
      }

      /* ✅ L 텍스트 자체를 scaleY로 늘리는 애니메이션 */
      @keyframes lineStretch {
        0%, 100% {
          transform: scaleY(1);
        }
        50% {
          transform: scaleY(1.5);
        }
      }

      @media(min-width: 768px) {
        #container {
          transform: scale(0.725);
        }
      }

      @media(min-width: 992px) {
        #container {
          transform: scale(0.85);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div id="container">
      <div className="divider" aria-hidden="true"></div>
      <p className="loading-text" aria-label="Loading">
        <span className="letter" aria-hidden="true">
          L
        </span>
        <span className="letter" aria-hidden="true">
          o
        </span>
        <span className="letter" aria-hidden="true">
          a
        </span>
        <span className="letter" aria-hidden="true">
          d
        </span>
        <span className="letter" aria-hidden="true">
          i
        </span>
        <span className="letter" aria-hidden="true">
          n
        </span>
        <span className="letter" aria-hidden="true">
          g
        </span>
      </p>
    </div>
  );
};

export default Loading;
