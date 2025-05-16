import { getUserLocationWithMarker } from './getUserLocation';
import { createStartMarker, createEndMarker } from './MarkerUtils';
import { createPedestrianRoute } from './PedestrianRoute';
import { getLocation } from "@/utils/api/location";

interface RouteToLocationParams {
  map: any;
  location_id: number;
  setStatus: (status: string) => void;
  startRef: React.MutableRefObject<any>;
  endRef: React.MutableRefObject<any>;
  startMarkerRef: React.MutableRefObject<any>;
  endMarkerRef: React.MutableRefObject<any>;
  routeObjectsRef: React.MutableRefObject<any[]>;
}

export async function routeToLocation({
  map,
  location_id,
  setStatus,
  startRef,
  endRef,
  startMarkerRef,
  endMarkerRef,
  routeObjectsRef,
}: RouteToLocationParams): Promise<void> {
  try {
    // 1. ดึงตำแหน่งปัจจุบันของผู้ใช้
    const currentPos = await getUserLocationWithMarker(map);
    
    // 2. สร้าง marker จุดเริ่มต้นที่ตำแหน่งปัจจุบัน
    startRef.current = createStartMarker({
      position: { lat: currentPos.lat, lng: currentPos.lng },
      map,
      markerRef: startMarkerRef
    });

    setStatus('กำลังค้นหาสถานที่ปลายทาง...');

    // 3. ดึงข้อมูลสถานที่ปลายทางจาก API
    const locationData = await getLocation({ location_id });
    
    if (!locationData.data || locationData.data.length === 0) {
      setStatus('ไม่พบข้อมูลสถานที่ปลายทาง');
      return;
    }

    const destination = locationData.data[0];

    // 4. สร้าง marker จุดสิ้นสุดที่สถานที่ปลายทาง
    endRef.current = createEndMarker({
      position: { lat: destination.lat, lng: destination.long },
      map,
      markerRef: endMarkerRef
    });

    setStatus('กำลังสร้างเส้นทาง...');

    // 5. สร้างเส้นทาง
    const platform = new window.H.service.Platform({
      apikey: 'fAnmdyEh8EyRxpTms7faftupQenGyqHL63ckLKQRDKc',
    });

    createPedestrianRoute({
      map,
      platform,
      start: { lat: currentPos.lat, lng: currentPos.lng },
      end: { lat: destination.lat, lng: destination.long },
      routeObjectsRef,
    });

    setStatus('สร้างเส้นทางเรียบร้อยแล้ว');

  } catch (error) {
    console.error('Error in routeToLocation:', error);
    setStatus('เกิดข้อผิดพลาดในการสร้างเส้นทาง');
  }
} 