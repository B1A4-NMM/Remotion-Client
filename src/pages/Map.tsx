import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface MarkerData {
  lat: number;
  lng: number;
  imageUrl?: string;
  text?: string;
}
import { useGetMapData } from "../api/queries/map/useGetMapData";

// API 응답 타입
interface ApiMarkerData {
  latitude: number;
  longitude: number;
  diaryId: number;
  photo_path?: string;
  content?: string;
}

interface MapProps {
  continuousWritingDate: number;
  emotionCountByMonth: number;
  totalDiaryCount: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Map: React.FC<MapProps> = _ => {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ React Query로 지도 데이터 받아오기
  const { data: markerDataList } = useGetMapData();

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });

    loader.load().then(() => {
      if (!window.google || !mapRef.current) return;

      const fallbackCenter = { lat: 37.5665, lng: 126.978 };

      const map = new window.google.maps.Map(mapRef.current, {
        center: fallbackCenter,
        zoom: 14,
      });

      setMapInstance(map);

      // ✅ 현재 위치 요청
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const userLatLng = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            map.setCenter(userLatLng);

            new window.google.maps.Marker({
              position: userLatLng,
              map,
              icon: {
                url:
                  "data:image/svg+xml;charset=UTF-8," +
                  encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
                            fill="#2a1c31" stroke="#2a1c31" stroke-width="2"/>
                    </svg>
                  `),
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 32),
              },
              title: "현재 위치",
            });
          },
          error => {
            setErrorMsg("현재 위치 정보를 가져올 수 없습니다.");
            console.warn("⚠️ 위치 오류:", error.message);
          }
        );
      } else {
        setErrorMsg("이 브라우저에서는 위치 정보가 지원되지 않습니다.");
      }

      // ✅ 마커 + 말풍선 생성 (API로 받은 markerDataList)
      (markerDataList?.result || []).forEach((markerData: ApiMarkerData) => {
        const position = new window.google.maps.LatLng(markerData.latitude, markerData.longitude);

        class CustomOverlay extends window.google.maps.OverlayView {
          div: HTMLElement | null = null;

          onAdd() {
            this.div = document.createElement("div");
            this.div.style.position = "absolute";
            this.div.style.transform = "translate(-50%, -100%)";
            this.div.style.zIndex = "100";

            const bubble = document.createElement("div");
            bubble.style.position = "relative";
            bubble.style.width = "70px";
            bubble.style.height = "70px";
            bubble.style.background = "white";
            bubble.style.border = "2px solid #ccc";
            bubble.style.borderRadius = "16px";
            bubble.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
            bubble.style.display = "flex";
            bubble.style.alignItems = "center";
            bubble.style.justifyContent = "center";
            bubble.style.overflow = "hidden";
            bubble.style.fontFamily = "sans-serif";

            // 줌 레벨에 따른 크기 조정 함수 (꼬리 요소들은 나중에 정의되므로 제외)
            const updateBubbleSize = () => {
              const currentZoom = map.getZoom() || 14;
              const baseSize = 70;
              // 줌 레벨에 따른 크기 조정 (줌이 작을수록 크기도 작아짐)
              let newSize;
              if (currentZoom >= 17) {
                newSize = baseSize;
              } else if (currentZoom >= 10) {
                newSize = baseSize * 0.9;
              } else if (currentZoom >= 7) {
                newSize = baseSize * 0.7;
              } else if (currentZoom >= 5) {
                newSize = baseSize * 0.6;
              } else if (currentZoom >= 3) {
                newSize = baseSize * 0.4;
              } else if (currentZoom >= 1) {
                newSize = baseSize * 0.3;
              } else if (currentZoom >= 0) {
                newSize = baseSize * 0.2;
              } else {
                // 최대 줌아웃 상태 (줌 레벨이 음수일 때)
                newSize = baseSize * 0.1;
              }

              bubble.style.width = `${Math.round(newSize)}px`;
              bubble.style.height = `${Math.round(newSize)}px`;
            };

            // 초기 크기 설정
            updateBubbleSize();

            // 줌 변경 이벤트 리스너 추가
            google.maps.event.addListener(map, "zoom_changed", updateBubbleSize);

            // 🖼️ 이미지 or 텍스트 삽입
            if (markerData.photo_path) {
              const img = document.createElement("img");
              img.src = markerData.photo_path;
              img.alt = "이미지";
              img.style.width = "100%";
              img.style.height = "100%";
              img.style.objectFit = "cover";
              img.style.objectPosition = "center";
              bubble.appendChild(img);
            } else if (markerData.content) {
              const span = document.createElement("span");
              span.textContent = markerData.content;
              span.style.padding = "8px";
              span.style.fontSize = "13px";
              span.style.textAlign = "center";
              span.style.color = "black";
              bubble.appendChild(span);
            }

            // 꼬리 테두리
            const tailBorder = document.createElement("div");
            tailBorder.style.position = "absolute";
            tailBorder.style.top = "100%";
            tailBorder.style.left = "50%";
            tailBorder.style.transform = "translateX(-50%)";
            tailBorder.style.width = "0";
            tailBorder.style.height = "0";
            tailBorder.style.borderLeft = "6px solid transparent";
            tailBorder.style.borderRight = "6px solid transparent";
            tailBorder.style.borderTop = "6px solid #ccc";
            tailBorder.style.zIndex = "0";

            // 꼬리 내부 (border와 같은 색상)
            const tail = document.createElement("div");
            tail.style.position = "absolute";
            tail.style.top = "100%";
            tail.style.left = "50%";
            tail.style.transform = "translateX(-50%)";
            tail.style.width = "0";
            tail.style.height = "0";
            tail.style.borderLeft = "5px solid transparent";
            tail.style.borderRight = "5px solid transparent";
            tail.style.borderTop = "5px solid #ccc";
            tail.style.zIndex = "1";

            // 외부 래퍼
            const outer = document.createElement("div");
            outer.style.position = "relative";
            outer.appendChild(tailBorder);
            outer.appendChild(bubble);
            outer.appendChild(tail);
            outer.style.cursor = "pointer"; // ✅ 마우스 포인터 커서
            outer.onclick = () => {
              window.location.href = `/result/${markerData.diaryId}`;
            };
            this.div.appendChild(outer);

            const panes = this.getPanes();
            panes?.floatPane.appendChild(this.div);
          }

          draw() {
            const projection = this.getProjection();
            const pos = projection.fromLatLngToDivPixel(position);
            if (pos && this.div) {
              this.div.style.left = `${pos.x}px`;
              this.div.style.top = `${pos.y}px`;
            }
          }

          onRemove() {
            this.div?.parentNode?.removeChild(this.div);
            this.div = null;
          }
        }

        const overlay = new CustomOverlay();
        overlay.setMap(map);
      });
    });
  }, [markerDataList]);

  return (
    <div style={{ position: "relative" }}>
      {/* 줌아웃 버튼 */}
      <button
        onClick={() => {
          if (mapInstance) {
            mapInstance.setZoom(5);
          }
        }}
        className="absolute top-4 right-4 z-50 bg-[#FAF6F4] dark:bg-[#4A3551] shadow-lg rounded-lg px-3 py-2 text-sm font-medium text-black dark:text-black transition-colors"
      >
        줌아웃
      </button>

      {/* 지도 컨테이너 */}
      <div
        ref={mapRef}
        className="rounded-2xl shadow overflow-hidden"
        style={{ height: "calc(100vh - 250px)", minHeight: 150 }}
      />
    </div>
  );
};

export default Map;
