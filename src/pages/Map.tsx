import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

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
  initialCenter?: {
    // ✅ 초기 중심점 props 추가
    lat: number;
    lng: number;
  } | null;
}

const Map: React.FC<MapProps> = ({ initialCenter }) => {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);

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

      // ✅ initialCenter가 있으면 우선 사용, 없으면 fallback 사용
      const mapCenter = initialCenter || fallbackCenter;

      const map = new window.google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom: 14,
      });

      setMapInstance(map);

      // ✅ initialCenter가 있으면 해당 위치에 마커 생성, 없으면 현재 위치 요청
      if (initialCenter) {
        // DiaryLocation에서 온 경우 해당 위치에 마커 표시
        new window.google.maps.Marker({
          position: initialCenter,
          map,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <!-- 막대기 (아래 부분) - 회색 -->
                    <rect x="18" y="20" width="4" height="16" fill="#666666" rx="2"/>
                    
                    <!-- 동그란 부분 (위쪽) - 빨간색 -->
                    <circle cx="20" cy="16" r="8" fill="#FF4444" stroke="#CC0000" stroke-width="1"/>
                    
                    <!-- 동그란 부분 내부 하이라이트 -->
                    <circle cx="18" cy="14" r="3" fill="rgba(255,255,255,0.3)"/>
                    
                    <!-- 중앙 점 -->
                    <circle cx="20" cy="16" r="2" fill="white"/>
                  </svg>
                `),
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 40),
          },
          title: "일기 위치",
        });
      } else {
        // 일반적인 Map 접근인 경우 현재 위치 요청
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
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <!-- 막대기 (아래 부분) - 회색 -->
                          <rect x="18" y="20" width="4" height="16" fill="#666666" rx="2"/>
                          
                          <!-- 동그란 부분 (위쪽) - 빨간색 -->
                          <circle cx="20" cy="16" r="8" fill="#FF4444" stroke="#CC0000" stroke-width="1"/>
                          
                          <!-- 동그간 부분 내부 하이라이트 -->
                          <circle cx="18" cy="14" r="3" fill="rgba(255,255,255,0.3)"/>
                          
                          <!-- 중앙 점 -->
                          <circle cx="20" cy="16" r="2" fill="white"/>
                        </svg>
                      `),
                  scaledSize: new google.maps.Size(40, 40),
                  anchor: new google.maps.Point(20, 40),
                },
                title: "현재 위치",
              });
            },
            error => {
              console.warn("⚠️ 위치 오류:", error.message);
            }
          );
        } else {
          console.warn("이 브라우저에서는 위치 정보가 지원되지 않습니다.");
        }
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
            bubble.style.border = "2px solid white";
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
            tailBorder.style.borderTop = "6px solid white";
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
            tail.style.borderTop = "5px solid white";
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
        className="absolute z-50 bg-[#FAF6F4] dark:bg-[#4A3551] shadow-lg rounded-lg px-3 py-2 text-sm font-medium text-black dark:text-black transition-colors"
        style={{ left: "10px", top: "60px" }}
      >
        줌아웃
      </button>

      {/* 지도 컨테이너 */}
      <div
        ref={mapRef}
        className="rounded-2xl shadow overflow-hidden md:rounded-xl md:shadow-xl"
        style={{ height: "calc(100vh - 250px)", minHeight: 150 }}
      />
    </div>
  );
};

export default Map;
