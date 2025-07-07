import React, { useEffect } from "react";

const Loading4 = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes spin3D {
        from {
          transform: rotate3d(0.5, 0.5, 0.5, 360deg);
        }
        to {
          transform: rotate3d(0deg);
        }
      }

      * {
        box-sizing: border-box;
      }

      body, html {
        margin: 0;
        padding: 0;
        background-color: #1d2630;
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .spinner-box {
        width: 300px;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        background-color: transparent;
      }

      .leo-border-1, .leo-border-2 {
        position: absolute;
        width: 150px;
        height: 150px;
        padding: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        animation: spin3D 2s linear infinite;
      }

      .leo-border-1 {
        background: linear-gradient(
          0deg,
          rgba(63, 249, 220, 0.1) 33%,
          rgba(63, 249, 220, 1) 100%
        );
        animation-duration: 1.8s;
      }

      .leo-border-2 {
        background: linear-gradient(
          0deg,
          rgba(251, 91, 83, 0.1) 33%,
          rgba(251, 91, 83, 1) 100%
        );
        animation-duration: 2.2s;
      }

      .leo-core-1, .leo-core-2 {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }

      .leo-core-1 {
        background-color: #37474faa;
      }

      .leo-core-2 {
        background-color: #1d2630aa;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="spinner-box">
      <div className="leo-border-1">
        <div className="leo-core-1"></div>
      </div>
      <div className="leo-border-2">
        <div className="leo-core-2"></div>
      </div>
    </div>
  );
};

export default Loading4;
