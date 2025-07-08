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

const LocationPicker = () => {
  const [open, setOpen] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      if (!mapRef.current || mapInitialized) return;

      console.log("🔑 KEY:", import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

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

          console.log("✅ Google Maps API 로드 성공");

          const map = new window.google.maps.Map(mapRef.current!, {
            center: { lat: 37.5665, lng: 126.978 },
            zoom: 13,
          });

          map.addListener("click", (e: google.maps.MapMouseEvent) => {
            const lat = e.latLng?.lat();
            const lng = e.latLng?.lng();
            if (lat !== undefined && lng !== undefined) {
              console.log("📍 선택된 위치:", { lat, lng });
            } else {
              console.warn("⚠️ 클릭 좌표를 가져올 수 없습니다.");
            }
          });

          setMapInitialized(true);
        })
        .catch(err => {
          console.error("❌ Google Maps 로딩 실패:", err);
        });
    }, 100); // 약간의 delay

    return () => clearTimeout(timer);
  }, [open, mapInitialized]);

  return (
    <Dialog
      open={open}
      onOpenChange={o => {
        setOpen(o);
        if (!o) setMapInitialized(false); // 다시 열 때 초기화
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={`mr-4 flex items-center gap-2 text-sm px-4 py-2 bg-green-800`}
        >
          지도에서 위치 선택
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md h-[70vh] p-0 rounded-t-2xl overflow-hidden">
        <DialogTitle className="sr-only">위치 선택</DialogTitle>

        {/* 닫기 버튼 */}
        <DialogClose className="absolute top-2 right-2 z-20 text-white bg-black/50 rounded-full p-1 hover:bg-black/70">
          <X className="w-5 h-5" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div ref={mapRef} className="w-full h-full bg-white relative z-10" id="map-container" />
      </DialogContent>
    </Dialog>
  );
};

export default LocationPicker;
