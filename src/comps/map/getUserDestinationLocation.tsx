interface DestinationSelectionParams {
  map: any;
  endRef: React.MutableRefObject<any>;
  endMarkerRef: React.MutableRefObject<any>;
  setStatus: (status: string) => void;
  tryCreateRoute: () => void;
}

import { createEndMarker } from './MarkerUtils';

export function getUserDestinationLocation({
  map,
  endRef,
  endMarkerRef,
  setStatus,
  tryCreateRoute,
}: DestinationSelectionParams): Promise<void> {
  return new Promise((resolve) => {

    const handleMapClick = (evt: any) => {
      const coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
      const position = { lat: coord.lat, lng: coord.lng };

      // ใช้ฟังก์ชัน createEndMarker จาก MarkerUtils
      endRef.current = createEndMarker({
        position,
        map,
        markerRef: endMarkerRef
      });

      // อัพเดตสถานะ
      setStatus("เลือกจุดสิ้นสุดแล้ว");

      // ลบ event listener หลังเลือกจุดเสร็จ
      map.removeEventListener("tap", handleMapClick);

      // เรียกสร้าง route ใหม่
      tryCreateRoute();

      resolve();
    };

    map.addEventListener("tap", handleMapClick);
  });
}
