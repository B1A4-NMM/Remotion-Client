import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "@googlemaps/js-api-loader";
import { useState, useEffect, useRef } from "react";
import { X, Check, MapPin } from "lucide-react";

interface LocationPickerProps {
  open: boolean;
  onClose: () => void;
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
}

interface LocationPreviewProps {
  location: { latitude: number; longitude: number };
  onEdit?: () => void;
}

interface LocationOption {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
}

const LocationPicker = ({ open, onClose, onLocationSelect }: LocationPickerProps) => {
  const [mapInitialized, setMapInitialized] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      if (!mapRef.current || mapInitialized) return;

      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        version: "weekly",
      });

      loader
        .load()
        .then(() => {
          if (!window.google || !window.google.maps) {
            console.error("❌ Google Maps 객체가 존재하지 않습니다.");
            return;
          }

          try {
            // 위치 권한 요청
            navigator.geolocation.getCurrentPosition(
              position => {
                const { latitude, longitude } = position.coords;
                const currentLocation = { lat: latitude, lng: longitude };

                const map = new window.google.maps.Map(mapRef.current!, {
                  center: currentLocation,
                  zoom: 15,
                  mapTypeControl: false,
                  streetViewControl: false,
                  fullscreenControl: false,
                });

                mapInstanceRef.current = map;
                setSelectedLocation(currentLocation);
                setMapInitialized(true);

                // 지도 중심에 구글 지도 기본 마커 생성
                markerRef.current = new window.google.maps.Marker({
                  position: currentLocation,
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
                          
                          <!-- 중앙 점 -->
                          <circle cx="20" cy="16" r="2" fill="white"/>
                        </svg>
                      `),
                    scaledSize: new google.maps.Size(40, 40),
                    anchor: new google.maps.Point(20, 40),
                  },
                });

                // 지도 중심이 바뀔 때마다 마커 위치 갱신
                map.addListener("center_changed", () => {
                  const center = map.getCenter();
                  if (center) {
                    setSelectedLocation({ lat: center.lat(), lng: center.lng() });
                    if (markerRef.current) {
                      markerRef.current.setPosition(center);
                    }
                  }
                });
              },
              error => {
                console.warn("위치 정보 가져오기 실패. 기본 위치로 지도 초기화", error);
                const fallbackLatLng = { lat: 37.5665, lng: 126.978 }; // 서울 시청

                const map = new window.google.maps.Map(mapRef.current!, {
                  center: fallbackLatLng,
                  zoom: 13,
                  mapTypeControl: false,
                  streetViewControl: false,
                  fullscreenControl: false,
                });

                mapInstanceRef.current = map;
                setSelectedLocation(fallbackLatLng);
                setMapInitialized(true);

                // 지도 중심에 구글 지도 기본 마커 생성
                markerRef.current = new window.google.maps.Marker({
                  position: fallbackLatLng,
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
                          
                          <!-- 중앙 점 -->
                          <circle cx="20" cy="16" r="2" fill="white"/>
                        </svg>
                      `),
                    scaledSize: new google.maps.Size(40, 40),
                    anchor: new google.maps.Point(20, 40),
                  },
                });

                // 지도 중심이 바뀔 때마다 마커 위치 갱신
                map.addListener("center_changed", () => {
                  const center = map.getCenter();
                  if (center) {
                    setSelectedLocation({ lat: center.lat(), lng: center.lng() });
                    if (markerRef.current) {
                      markerRef.current.setPosition(center);
                    }
                  }
                });
              }
            );
          } catch (error) {
            console.error("지도 초기화 중 에러 발생:", error);
          }
        })
        .catch(err => {
          console.error("❌ Google Maps 로딩 실패:", err);
        });
    }, 100);

    return () => {
      clearTimeout(timer);
      // 지도 정리 시 에러 방지
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current = null;
        }
      } catch (error) {
        console.warn("지도 정리 중 에러:", error);
      }
    };
  }, [open, mapInitialized]);

  // 확인 버튼 클릭 핸들러
  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect({
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
      });
      handleClose();
    }
  };

  // 모달이 닫힐 때 상태 초기화
  const handleClose = () => {
    try {
      // 지도 정리 시 에러 방지
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    } catch (error) {
      console.warn("지도 정리 중 에러:", error);
    }

    onClose();
    setMapInitialized(false);
    setSelectedLocation(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent className="w-full max-w-md h-[70vh] p-0 rounded-t-2xl overflow-visible bg-gray-900 dark:bg-white">
        <DialogTitle className="sr-only">위치 선택</DialogTitle>

        {/* X 버튼 */}
        <DialogClose
          className="absolute top-2 right-2 z-50 text-black dark:text-white bg-[#FFFFFF] dark:bg-[#2a1c31] rounded-full p-1  transition-colors"
          onClick={handleClose}
        >
          <X className="w-5 h-5" />
          <span className="sr-only">Close</span>
        </DialogClose>

        {/* 지도 영역 */}
        <div className="w-full h-full bg-gray-100 relative" id="map-container" ref={mapRef} />
        {/* 지도 위에 겹치는 툴팁 */}

        {/* 하단 컨트롤 영역 */}
        <div className="absolute bottom-4 left-4 right-4 z-20 space-y-3">
          {/* 안내 메시지 */}
          <div className="bg-black/30 dark:bg-black/70 text-black dark:text-white text-sm p-2 rounded backdrop-blur-sm text-center">
            지도를 움직여 위치를 선택해보세요
          </div>

          {/* 확인 버튼 */}
          {selectedLocation && (
            <Button
              onClick={handleConfirm}
              className="w-full bg-[#f9f0eb]/80 hover:bg-gray-100 dark:bg-[#2a1c31] dark:hover:bg-[#1a0c21] text-black dark:text-white flex items-center justify-center gap-2 transition-colors"
            >
              <Check className="w-4 h-4" />이 위치로 선택
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const LocationPreview = ({ location }: LocationPreviewProps) => {
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=15&size=300x200&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="relative">
        <img
          src={staticMapUrl}
          alt="선택된 위치"
          className="w-full h-48 object-cover"
          onError={e => {
            console.error("지도 이미지 로딩 실패");
            (e.target as HTMLImageElement).src = "/placeholder-map.png"; // fallback 이미지
          }}
        />
        {/* 커스텀 툴팁 추가 */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
          >
            {/* 막대기 (아래 부분) - 회색 */}
            <rect x="14" y="16" width="4" height="12" fill="#666666" rx="2" />

            {/* 동그란 부분 (위쪽) - 빨간색 */}
            <circle cx="16" cy="12" r="8" fill="#FF4444" stroke="#CC0000" stroke-width="1" />

            {/* 중앙 점 */}
            <circle cx="16" cy="12" r="2.5" fill="white" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export { LocationPicker, LocationPreview };
