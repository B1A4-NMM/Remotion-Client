import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "@googlemaps/js-api-loader";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface LocationPickerProps {
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
}

const LocationPicker = ({ onLocationSelect }: LocationPickerProps) => {
  const [open, setOpen] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<google.maps.Marker | null>(null); // 💙 마커 참조

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
                zoom: 13,
              });

              // 📍 지도 클릭 시 마커 생성 or 위치 이동
              map.addListener("click", (e: google.maps.MapMouseEvent) => {
                const lat = e.latLng?.lat();
                const lng = e.latLng?.lng();

                if (lat !== undefined && lng !== undefined) {
                  onLocationSelect({ latitude: lat, longitude: lng });

                  const position = { lat, lng };

                  if (markerRef.current) {
                    markerRef.current.setPosition(position);
                  } else {
                    markerRef.current = new window.google.maps.Marker({
                      position,
                      map,
                      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                      title: "선택한 위치",
                    });
                  }
                }
              });

              setMapInitialized(true);
            },
            error => {
              console.warn("위치 정보 가져오기 실패. 기본 위치로 지도 초기화", error);
              const fallbackLatLng = { lat: 37.5665, lng: 126.978 };
              const map = new window.google.maps.Map(mapRef.current!, {
                center: fallbackLatLng,
                zoom: 13,
              });

              map.addListener("click", (e: google.maps.MapMouseEvent) => {
                const lat = e.latLng?.lat();
                const lng = e.latLng?.lng();

                if (lat !== undefined && lng !== undefined) {
                  onLocationSelect({ latitude: lat, longitude: lng });

                  const position = { lat, lng };

                  if (markerRef.current) {
                    markerRef.current.setPosition(position);
                  } else {
                    markerRef.current = new window.google.maps.Marker({
                      position,
                      map,
                      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                      title: "선택한 위치",
                    });
                  }
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

  return (
    <Dialog
      open={open}
      onOpenChange={o => {
        setOpen(o);
        if (!o) {
          setMapInitialized(false);
          markerRef.current = null; // 💙 마커 초기화
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="mr-4 flex items-center gap-2 text-sm px-4 py-2 bg-green-800 text-white"
        >
          지도에서 위치 선택
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-md h-[70vh] p-0 rounded-t-2xl overflow-hidden">
        <DialogTitle className="sr-only">위치 선택</DialogTitle>

        <DialogClose className="absolute top-2 right-2 z-20 text-white bg-black/50 rounded-full p-1 hover:bg-black/70">
          <X className="w-5 h-5" />
          <span className="sr-only">Close</span>
        </DialogClose>

        {/* 지도 영역 */}
        <div ref={mapRef} className="w-full h-full bg-white relative z-10" id="map-container" />
      </DialogContent>
    </Dialog>
  );
};

export default LocationPicker;
