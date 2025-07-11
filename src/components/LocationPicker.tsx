import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader } from "@googlemaps/js-api-loader";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface LocationPickerProps {
  open: boolean;
  onClose: () => void;
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
}

const LocationPicker = ({ open, onClose, onLocationSelect }: LocationPickerProps) => {
  const [mapInitialized, setMapInitialized] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null); // 지도 인스턴스 참조 추가

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

          // 위치 권한 요청
          navigator.geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;
              const map = new window.google.maps.Map(mapRef.current!, {
                center: { lat: latitude, lng: longitude },
                zoom: 15,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
              });

              mapInstanceRef.current = map; // 지도 인스턴스 저장

              // 현재 위치에 기본 마커 표시 (선택사항)
              const currentLocationMarker = new window.google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map,
                icon: {
                  url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  scaledSize: new window.google.maps.Size(32, 32),
                },
                title: "현재 위치",
              });

              // 📍 지도 클릭 시 선택 마커 생성 또는 이동
              map.addListener("click", (e: google.maps.MapMouseEvent) => {
                const lat = e.latLng?.lat();
                const lng = e.latLng?.lng();

                if (lat !== undefined && lng !== undefined) {
                  console.log("📍 클릭한 위치:", { lat, lng });
                  onLocationSelect({ latitude: lat, longitude: lng });

                  const position = { lat, lng };

                  // 기존 선택 마커가 있으면 위치 이동, 없으면 새로 생성
                  if (markerRef.current) {
                    markerRef.current.setPosition(position);
                  } else {
                    markerRef.current = new window.google.maps.Marker({
                      position,
                      map,
                      icon: {
                        url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                        scaledSize: new window.google.maps.Size(40, 40),
                      },
                      title: "선택한 위치",
                      animation: window.google.maps.Animation.DROP, // 드롭 애니메이션 추가
                    });
                  }

                  // 선택한 위치로 지도 중심 이동
                  map.panTo(position);
                }
              });

              setMapInitialized(true);
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

              map.addListener("click", (e: google.maps.MapMouseEvent) => {
                const lat = e.latLng?.lat();
                const lng = e.latLng?.lng();

                if (lat !== undefined && lng !== undefined) {
                  console.log("📍 클릭한 위치:", { lat, lng });
                  onLocationSelect({ latitude: lat, longitude: lng });

                  const position = { lat, lng };

                  if (markerRef.current) {
                    markerRef.current.setPosition(position);
                  } else {
                    markerRef.current = new window.google.maps.Marker({
                      position,
                      map,
                      icon: {
                        url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                        scaledSize: new window.google.maps.Size(40, 40),
                      },
                      title: "선택한 위치",
                      animation: window.google.maps.Animation.DROP,
                    });
                  }

                  map.panTo(position);
                }
              });

              setMapInitialized(true);
            }
          );
        })
        .catch(err => {
          console.error("❌ Google Maps 로딩 실패:", err);
        });
    }, 100);

    return () => clearTimeout(timer);
  }, [open, mapInitialized, onLocationSelect]);

  // 모달이 닫힐 때 상태 초기화
  const handleClose = () => {
    onClose();
    setMapInitialized(false);
    if (markerRef.current) {
      markerRef.current.setMap(null); // 마커 제거
    }
    markerRef.current = null;
    mapInstanceRef.current = null;
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
      <DialogContent className="w-full max-w-md h-[70vh] p-0 rounded-t-2xl overflow-hidden">
        <DialogTitle className="sr-only">위치 선택</DialogTitle>

        <DialogClose 
          className="absolute top-2 right-2 z-20 text-white bg-black/50 rounded-full p-1 hover:bg-black/70"
          onClick={handleClose}
        >
          <X className="w-5 h-5" />
          <span className="sr-only">Close</span>
        </DialogClose>

        {/* 지도 영역 */}
        <div ref={mapRef} className="w-full h-full bg-gray-100 relative z-10" id="map-container" />

        {/* 안내 메시지 */}
        <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/70 text-white text-sm p-2 rounded">
          📍 지도를 클릭하여 위치를 선택하세요
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPicker;
