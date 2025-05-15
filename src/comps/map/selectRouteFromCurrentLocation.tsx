import { getUserLocationWithMarker } from './getUserLocation';
import { getUserDestinationLocation } from './getUserDestinationLocation';
import { createStartMarker, createEndMarker } from './MarkerUtils';

interface RouteSelectorParams {
  map: any;
  setStatus: (status: string) => void;
  tryCreateRoute: () => void;
  startRef: React.MutableRefObject<any>;
  endRef: React.MutableRefObject<any>;
  startMarkerRef: React.MutableRefObject<any>;
  endMarkerRef: React.MutableRefObject<any>;
}

export async function selectRouteFromCurrentLocation({
  map,
  setStatus,
  tryCreateRoute,
  startRef,
  endRef,
  startMarkerRef,
  endMarkerRef,
}: RouteSelectorParams): Promise<void> {
  try {
    // 1. ดึงตำแหน่งปัจจุบัน
    const currentPos = await getUserLocationWithMarker(map);
    
    // ใช้ฟังก์ชัน createStartMarker สร้าง marker จุดเริ่มต้น
    startRef.current = createStartMarker({
      position: { lat: currentPos.lat, lng: currentPos.lng },
      map,
      markerRef: startMarkerRef
    });

    setStatus('ตำแหน่งปัจจุบันถูกตั้งเป็นจุดเริ่มต้น');

    // 2. รอ user เลือกจุดสิ้นสุด
    await getUserDestinationLocation({
      map,
      endRef,
      endMarkerRef,
      setStatus,
      tryCreateRoute
    });

    // 3. สร้าง route จากจุดเริ่มต้นไปจุดสิ้นสุด
    tryCreateRoute();

  } catch (error) {
    setStatus('ไม่สามารถรับตำแหน่งได้หรือเกิดข้อผิดพลาด');
    console.error(error);
  }
}
